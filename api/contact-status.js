/**
 * GET /api/contact-status
 * Diagnostic endpoint — cek apakah env & deployment terbaru ter-load
 * Tidak expose API key, hanya status boolean & masked email
 */
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ success: false, message: 'Gunakan GET untuk pemeriksaan status.' });
  }
  const hasResendKey = !!process.env.RESEND_API_KEY;
  const hasContactEmail = !!process.env.CONTACT_EMAIL;
  const contactEmail = process.env.CONTACT_EMAIL || null;
  const contactEmailMasked = contactEmail ? contactEmail.replace(/(.{2}).+(@.+)/, '$1***$2') : null;
  const fromEmail = process.env.RESEND_FROM || 'Portfolio Contact <onboarding@resend.dev>';
  const keyPrefix = process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.slice(0, 5) : null;
  const keyValidFormat = process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.startsWith('re_') : false;

  return res.status(200).json({
    success: true,
    message: 'Status API Kontak',
    debug: {
      hasResendKey,
      keyPrefix,
      keyValidFormat,
      hasContactEmail,
      contactEmailMasked,
      contactEmailExpected: 'mfarhanmuizaddin@gmail.com',
      contactEmailMatch: contactEmail === 'mfarhanmuizaddin@gmail.com',
      fromEmail,
      timestamp: new Date().toISOString(),
      vercelEnv: process.env.VERCEL_ENV || 'unknown',
      nodeVersion: process.version
    },
    hint: 'Jika hasResendKey false atau hasContactEmail false, atur env di Vercel Dashboard → Settings → Environment Variables (Production) lalu Redeploy.'
  });
}
