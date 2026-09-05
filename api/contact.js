import { Resend } from "resend";

/**
 * POST /api/contact
 * Vercel Serverless Function — Portfolio Contact Form
 * Email via Resend (https://resend.com)
 * Framework: Vanilla HTML/CSS/JS + Vercel Serverless (compatible Production/Preview/Development)
 * Struktur routing Vercel: /api/contact.js → POST /api/contact
 *
 * Env required:
 *   CONTACT_EMAIL  - WAJIB mfarhanmuizaddin@gmail.com (tujuan SEMUA pesan Contact Form)
 *   RESEND_API_KEY - API key Resend (re_xxx) — JANGAN hardcode, hanya via process.env
 *   RESEND_FROM    - alamat pengirim terverifikasi, default Portfolio Contact <onboarding@resend.dev>
 *
 * Security: API key hanya server-side, validasi & sanitasi, rate limit, honeypot, tidak expose env ke client
 */

// In-memory rate limiting (per instance, resets on cold start)
// Map<ip, { count, resetAt }>
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 menit
const RATE_LIMIT_MAX = 5; // max 5 request per window

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) return forwarded.split(',')[0].trim();
  const realIp = req.headers['x-real-ip'];
  if (realIp) return realIp;
  return req.socket?.remoteAddress || 'unknown';
}

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT_MAX) return true;
  entry.count += 1;
  return false;
}

// Bersihkan entry kadaluarsa setiap 50 request untuk mencegah memory leak
let cleanupCounter = 0;
function maybeCleanup() {
  cleanupCounter += 1;
  if (cleanupCounter % 50 !== 0) return;
  const now = Date.now();
  for (const [k, v] of rateLimitStore.entries()) {
    if (now > v.resetAt) rateLimitStore.delete(k);
  }
}

function sanitize(str) {
  if (typeof str !== 'string') return '';
  // trim, batasi, hilangkan null bytes, escape untuk log aman
  return str.trim().replace(/\0/g, '').slice(0, 10000);
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (m) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[m]));
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  // CORS — same origin, tapi izinkan preflight jika dibutuhkan
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).json({ success: false, message: 'Method not allowed. Use POST.', error: 'Method not allowed. Use POST.' });
  }

  // Batasi ukuran body (10KB cukup untuk form contact)
  const contentLength = parseInt(req.headers['content-length'] || '0', 10);
  if (contentLength > 10240) {
    return res.status(413).json({ success: false, message: 'Payload too large.', error: 'Payload too large.' });
  }

  // Rate limiting per IP
  const ip = getClientIp(req);
  maybeCleanup();
  if (isRateLimited(ip)) {
    return res.status(429).json({
      success: false,
      message: 'Too many requests. Please try again in a few minutes.',
      error: 'Too many requests. Please try again in a few minutes.'
    });
  }

  // Parse body — Vercel bisa sudah parse atau masih string
  let body = req.body;
  if (typeof body === 'string') {
    try {
      if (body.length > 10240) {
        return res.status(413).json({ success: false, message: 'Payload too large.', error: 'Payload too large.' });
      }
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ success: false, message: 'Invalid JSON.', error: 'Invalid JSON.' });
    }
  }
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ success: false, message: 'Invalid request body.', error: 'Invalid request body.' });
  }

  // Honeypot — field "website" tidak boleh diisi manusia normal
  // Jika terisi, anggap spam: jangan kirim email, tapi balas seolah sukses agar bot tidak tahu
  const honeypot = sanitize(body.website || body._honey || '');
  if (honeypot) {
    console.warn('[contact] honeypot triggered', { ip });
    return res.status(200).json({ success: true, message: 'Message sent successfully.' });
  }

  // Ambil & sanitize input
  let name = sanitize(body.name || '');
  let email = sanitize(body.email || '');
  let subject = sanitize(body.subject || '');
  let message = sanitize(body.message || '');

  // Validasi server-side
  const errors = {};

  if (!name) errors.name = 'Name is required.';
  else if (name.length < 2) errors.name = 'Name must be at least 2 characters.';
  else if (name.length > 100) errors.name = 'Name must be under 100 characters.';

  if (!email) errors.email = 'Email is required.';
  else if (email.length > 254) errors.email = 'Email is too long.';
  else if (!EMAIL_RE.test(email)) errors.email = 'Please enter a valid email address.';
  else if (email.includes('\n') || email.includes('\r')) errors.email = 'Invalid email.';

  // Subject optional — jika diisi validasi 3-200, jika kosong akan digenerate dari nama: Portfolio Contact — [name]
  if (subject) {
    if (subject.length < 3) errors.subject = 'Subject must be at least 3 characters.';
    else if (subject.length > 200) errors.subject = 'Subject must be under 200 characters.';
  }

  if (!message) errors.message = 'Message is required.';
  else if (message.length < 10) errors.message = 'Message must be at least 10 characters.';
  else if (message.length > 5000) errors.message = 'Message must be under 5000 characters.';

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ success: false, message: 'Invalid form data.', error: 'Validation failed.', fields: errors });
  }

  // Header injection protection — jangan izinkan newline di subject/name/email untuk SMTP header
  const hasNewline = (s) => /[\r\n]/.test(s);
  if (hasNewline(name) || hasNewline(email) || (subject && hasNewline(subject))) {
    return res.status(400).json({ success: false, message: 'Invalid form data.', error: 'Invalid input.' });
  }

  // Cek env — TO harus mfarhanmuizaddin@gmail.com
  const toEmail = process.env.CONTACT_EMAIL;
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM || 'Portfolio Contact <onboarding@resend.dev>';

  // DEBUG: log env presence (tanpa expose key) untuk Vercel logs
  console.log('[contact] Incoming request', {
    ip,
    hasContactEmail: !!toEmail,
    hasResendKey: !!resendApiKey,
    toEmailMasked: toEmail ? toEmail.replace(/(.{2}).+(@.+)/, '$1***$2') : null,
    expectedTo: 'mfarhanmuizaddin@gmail.com',
    match: toEmail === 'mfarhanmuizaddin@gmail.com',
    fromEmail,
    bodyKeys: Object.keys(body || {}),
    nameLen: (body.name || '').length,
    subjectLen: (body.subject || '').length
  });

  if (!toEmail || !resendApiKey) {
    console.error('[contact] Missing env', {
      hasContactEmail: !!toEmail,
      hasResendKey: !!resendApiKey
    });
    if (!resendApiKey) console.error('Missing RESEND_API_KEY');
    if (!toEmail) console.error('Missing CONTACT_EMAIL');
    // Jangan return success — return 500 agar frontend tampil error, bukan fake success
    return res.status(500).json({
      success: false,
      message: 'Server is not configured correctly. Please try again later.',
      error: 'Server is not configured correctly. Please try again later.'
    });
  }

  if (!resendApiKey.startsWith('re_')) {
    console.error('Contact email error:', { message: 'RESEND_API_KEY format invalid, must start with re_', keyPrefix: resendApiKey.slice(0, 5) });
  }

  if (toEmail !== 'mfarhanmuizaddin@gmail.com') {
    console.warn('[contact] CONTACT_EMAIL is not mfarhanmuizaddin@gmail.com — emails will go to', toEmail);
  }

  // Siapkan email — format profesional sesuai spec:
  // Subject: Portfolio Contact — [visitor name] jika subject kosong, else [Portfolio Contact] {subject}
  // Body: Nama, Email, Pesan
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject || `Portfolio Contact — ${name}`);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');

  const emailSubject = subject ? `[Portfolio Contact] ${subject}` : `Portfolio Contact — ${name}`;
  const displaySubject = subject || `Portfolio Contact — ${name}`;
  const textBody = `New message from your portfolio website

Name:
${name}

Email:
${email}

Subject:
${displaySubject}

Message:
${message}

--------------------------------
Sent from Muhamad Farhan Muizaddin Portfolio.
Reply directly to this email to reply to ${name} <${email}>.`;

  const htmlBody = `
    <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif; max-width:640px; margin:0 auto; background:#0a0a1a; color:#e2e8f0; border:1px solid rgba(0,240,255,0.12); border-radius:16px; overflow:hidden;">
      <div style="padding:24px 28px; background:linear-gradient(135deg, rgba(0,240,255,0.10), rgba(123,47,255,0.10)); border-bottom:1px solid rgba(255,255,255,0.06);">
        <p style="margin:0; font-size:11px; letter-spacing:2px; text-transform:uppercase; color:#00f0ff; font-weight:700;">Portfolio Contact</p>
        <h2 style="margin:8px 0 0; font-size:18px; line-height:1.4; color:#fff; font-weight:800;">New message — ${safeSubject}</h2>
        <p style="margin:6px 0 0; font-size:12px; color:rgba(255,255,255,0.55);">Sent from Muhamad Farhan Muizaddin Portfolio</p>
      </div>
      <div style="padding:28px;">
        <table style="width:100%; border-collapse:collapse; font-size:14px; line-height:1.6;">
          <tr>
            <td style="padding:10px 0; width:88px; color:rgba(255,255,255,0.55); font-weight:700; letter-spacing:0.6px; text-transform:uppercase; font-size:11px; vertical-align:top;">Name</td>
            <td style="padding:10px 0; color:#fff; font-weight:600;">${safeName}</td>
          </tr>
          <tr>
            <td style="padding:10px 0; color:rgba(255,255,255,0.55); font-weight:700; letter-spacing:0.6px; text-transform:uppercase; font-size:11px; vertical-align:top;">Email</td>
            <td style="padding:10px 0;"><a href="mailto:${safeEmail}" style="color:#00f0ff; text-decoration:none; word-break:break-all;">${safeEmail}</a></td>
          </tr>
          <tr>
            <td style="padding:10px 0; color:rgba(255,255,255,0.55); font-weight:700; letter-spacing:0.6px; text-transform:uppercase; font-size:11px; vertical-align:top;">Subject</td>
            <td style="padding:10px 0; color:#fff;">${safeSubject}</td>
          </tr>
        </table>
        <div style="margin-top:18px; padding:18px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); border-radius:12px;">
          <p style="margin:0 0 8px; font-size:11px; letter-spacing:1.2px; text-transform:uppercase; color:rgba(255,255,255,0.55); font-weight:700;">Message</p>
          <p style="margin:0; font-size:14px; line-height:1.75; color:#e2e8f0; white-space:pre-wrap; word-break:break-word;">${safeMessage}</p>
        </div>
        <p style="margin:18px 0 0; font-size:12px; color:rgba(255,255,255,0.35); border-top:1px solid rgba(255,255,255,0.06); padding-top:14px;">
          Reply directly to this email — it will go to <strong style="color:rgba(255,255,255,0.7);">${safeName}</strong> &lt;${safeEmail}&gt; via Reply-To.
        </p>
      </div>
    </div>
  `;

  try {
    // Kirim via Resend SDK — server-side only, API key tidak pernah ke client
    // PENTING: from harus alamat terverifikasi di Resend (onboarding@resend.dev untuk testing atau domain custom terverifikasi)
    // visitor email hanya sebagai replyTo, bukan from — agar tidak ditolak provider
    // TO selalu mfarhanmuizaddin@gmail.com via CONTACT_EMAIL
    console.log('[contact] Attempting Resend send', {
      to: toEmail,
      from: fromEmail,
      subject: emailSubject,
      replyTo: email,
      nameLen: name.length,
      messageLen: message.length
    });

    const resend = new Resend(resendApiKey);
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      subject: emailSubject,
      html: htmlBody,
      text: textBody,
      replyTo: email
    });

    // LOG lengkap untuk debug — Vercel Logs akan menampilkan status & error detail tanpa expose key
    console.log('[contact] Resend raw response', {
      hasError: !!error,
      hasData: !!data,
      hasId: !!(data && data.id),
      error,
      data
    });

    if (error) {
      console.error('Contact email error:', {
        error,
        toEmail,
        fromEmail
      });
      console.error('[contact] Resend error', error);
      // Simpan detail Resend untuk Vercel logs, tapi ke frontend hanya generic
      const msg = (error.message || '').toLowerCase();
      const isTestingRestriction = msg.includes('testing emails');
      const isDomainNotVerified = msg.includes('domain');
      const isInvalidKey = msg.includes('invalid') && msg.includes('api key');
      if (isTestingRestriction) {
        console.error('RESEND ERROR: Testing restriction — onboarding@resend.dev hanya bisa kirim ke email akun Resend. Verifikasi domain di resend.com/domains atau ganti CONTACT_EMAIL ke email akun Resend.');
      }
      if (isDomainNotVerified) {
        console.error('RESEND ERROR: Domain not verified — from harus onboarding@resend.dev atau domain terverifikasi.');
      }
      if (isInvalidKey) {
        console.error('RESEND ERROR: API key invalid — cek RESEND_API_KEY di Vercel env.');
      }
      // Jangan bocorkan detail internal ke client — frontend akan baca success:false dan tampil error
      return res.status(500).json({
        success: false,
        message: 'Unable to send message. Please try again later.',
        error: 'Failed to send email. Please try again later.'
      });
    }

    // Resend mengembalikan { id } jika sukses — pastikan di-log
    if (!data || !data.id) {
      console.error('Contact email error:', { data, error, message: 'Missing Resend ID despite no error' });
      return res.status(500).json({
        success: false,
        message: 'Unable to send message. Please try again later.',
        error: 'Failed to send email. Please try again later.'
      });
    }

    console.log('Contact email sent:', data.id);
    console.log('[contact] Email sent', { id: data.id, to: toEmail, from: fromEmail, replyTo: email });
    console.log('[contact] SUCCESS — email queued for mfarhanmuizaddin@gmail.com, Resend ID:', data.id);
    // HANYA jika benar-benar ada ID baru success true — frontend cek result.success === true
    return res.status(200).json({
      success: true,
      message: 'Message sent successfully.',
      id: data.id
    });
  } catch (err) {
    console.error('Contact email error:', {
      message: err && err.message,
      name: err && err.name,
      stack: err && err.stack ? err.stack.slice(0, 500) : null,
      toEmail,
      fromEmail
    });
    console.error('[contact] Unexpected error', err);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong on our side. Please try again later.',
      error: 'Something went wrong on our side. Please try again later.'
    });
  }
}
