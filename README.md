# Muhamad Farhan Muizaddin — Futuristic Portfolio

Portfolio software engineer **futuristic, cinematic, premium, 3D, interactive** — bukan template Bootstrap, bukan website mahasiswa sederhana. Dibuat dengan **HTML5 + CSS3 + Vanilla JavaScript + Three.js (CDN)** tanpa framework, siap deploy ke **Vercel** sebagai static site.

![Favicon](favicon.svg)

---

## ✨ Fitur

- **Loading Terminal** — animasi `INITIALIZING SYSTEM...` + progress bar
- **Navbar** — transparent → glassmorphism on scroll, active indicator, hamburger 280px slide, keyboard `Esc` & `aria-expanded`
- **Hero** — badge `AVAILABLE FOR WORK`, gradient name, 2 CTA, social, 3D wireframe icosahedron + orbiting rings + particles (Three.js), grid + radial glow + noise + floating code blocks, custom cursor dot/ring/glow + magnetic hover
- **About** — profile placeholder, bio, info grid, animated counters (CV-backed), code decorations
- **Developer Terminal** — typing effect `whoami` + blink cursor, glass
- **Code Card** — tabs JS/PHP/HTML syntax highlight tanpa library berat
- **Tech Stack** — 10 cards interactive tilt + border conic + glow, `Skill Constellation` nodes + SVG lines + particles warp, marquee infinite `28s linear`
- **Projects** — Featured large + asymmetric grid (7/5/5/7/12), image zoom, tilt, overlay, badges, **modal glassmorphism** `backdrop blur 18px` dengan Features/Challenges/Solutions, `ESC` & backdrop click close, data dari JS array
- **Experience Timeline** — vertical line + progress fill on scroll, glowing nodes pulse, hover lift, `2023→2026`
- **3D Lab** — wireframe sphere + grid + particles + floating torus/box/octa, mouse drag orbit, scroll warp, performance `lowQuality` di mobile, WebGL fallback
- **Interactive Terminal** — input `$` dengan history `↑↓`, `Tab` autocomplete, commands `help/about/skills/projects/contact/clear`
- **Contact** — `Let's Build Something Great.` form Name/Email/Message validation, honeypot, char count, toast, siap **Formspree / Vercel Function / Resend**, cards Email/GitHub/LinkedIn

---

## 📁 Struktur

```
/
├── index.html      # semantic HTML, SEO OG, skip-link, main landmark
├── style.css       # ~3650 lines, CSS vars, responsive, reduced-motion
├── script.js       # vanilla ES6, modular init, rAF, IntersectionObserver
├── favicon.svg     # MF gradient
├── robots.txt
├── sitemap.xml
├── vercel.json     # headers & cleanUrls
└── assets/
    ├── images/
    └── icons/
```

No build step. No `node_modules`.

---

## 🚀 Cara Menjalankan Lokal

**Opsi 1 — Double click**
```
portfolio/index.html → double click → buka di Chrome/Edge
```

**Opsi 2 — Live Server (VS Code) — Direkomendasikan**
1. Install extension **Live Server** (Ritwick Dey)
2. Buka folder `portfolio` di VS Code
3. Klik kanan `index.html` → **Open with Live Server**
4. Browser otomatis `http://127.0.0.1:5500/`

**Opsi 3 — Python / Node**
```bash
# Python
py -m http.server 8000
# atau Node
npx serve .
```
Buka `http://localhost:8000`

---

## 🔧 Cara Deploy ke Vercel

**Via Dashboard (paling mudah)**
1. Push repo ke GitHub
2. Buka [vercel.com/new](https://vercel.com/new) → Import GitHub repo
3. Framework Preset: **Other** (static)
4. Build Command: *(kosong)*, Output: `/`
5. Deploy → dapat URL `https://your-domain.vercel.app`

**Via CLI**
```bash
npm i -g vercel
vercel        # pertama kali linking
vercel --prod # deploy produksi
```

**Update domain di SEO**
Edit `index.html` → ganti `https://your-domain.vercel.app/` di:
- `<link rel="canonical">`
- `og:url` / `og:image`
- `twitter:image`
- `sitemap.xml` `<loc>`
- `robots.txt` `Sitemap:`

`vercel.json` sudah ada headers security & cache.

---

## 🎨 Cara Mengganti Nama

1. **Hero & About**
   - `index.html` cari `Muhamad Farhan Muizaddin` (meta, hero `data-name`, about `profile-initials` MFM, `code-tag`, footer)
   - `style.css` tidak perlu
2. **Logo navbar** — ganti gambar di `assets/images/logo-navbar.png`
3. **Favicon** ganti `favicon.svg` text `MF` dan gradient
4. **Footer & meta** `© 2026 Muhamad Farhan Muizaddin` di `index.html` footer & `application/ld+json`

---

## 📦 Cara Mengganti Project

Buka `script.js` → array `projectsData` di atas (line ~25):

```js
const projectsData = [
  {
    id: 'apss',
    featured: true, // hanya 1 yang true
    title: 'Aplikasi Pengaduan Sarana Sekolah (APSS)',
    category: 'Web Application',
    description: '...',
    longDescription: '...',
    image: 'gradient-a', // a-f di gradientMap, atau path gambar 'assets/...'
    icon: 'fa-clipboard-list', // Font Awesome
    technologies: ['PHP Native','MySQL','Bootstrap 5',...],
    features: ['...','...'],
    challenges: '...',
    solutions: '...',
    github: 'https://github.com/muizfrhan/aplikasi-pengaduan-sarana-sekolah',
    demo: 'https://demo.vercel.app',
    year: '2026'
  },
  // tambah objek lagi...
];
```

Gradient map `a-f` ada di `gradientMap` di `script.js` — ganti warna atau tambah entri.

Featured otomatis diambil yang `featured:true`, sisanya masuk grid asymmetric `span-7/5`.

---

## 🌐 Cara Mengganti Social Media

**Hero social** `index.html` `#heroSocial`:
```html
<a href="https://github.com/username" class="social-link" aria-label="GitHub"><i class="fab fa-github"></i></a>
<a href="https://linkedin.com/in/username" class="social-link" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
```

**Contact cards** `#contact`:
```html
<a href="mailto:you@email.com" class="contact-card">...
<a href="https://github.com/username" ...
<a href="https://linkedin.com/in/username" ...
```

Jangan lupa `application/ld+json` `sameAs` dan `og:url`.

---

## 📧 Cara Mengganti Email

1. `index.html` contact card `mailto:mfarhanmuizaddin@gmail.com` → ganti 2 tempat (href & text)
2. `script.js` tidak perlu (form no backend)
3. Untuk backend: lihat komen di `script.js` fungsi `initContact` → pilih:
   - **Formspree**: `fetch('https://formspree.io/f/YOUR_ID', {method:'POST', body:new FormData(form)})`
   - **Vercel Function**: buat `api/contact.js` lalu `fetch('/api/contact', {method:'POST', body:JSON.stringify({name,email,message})})`
   - **Resend**: di `api/contact.js` panggil `resend.emails.send({from, to:'you@email.com', subject, html})`

---

## 🛠️ Cara Mengganti Skills

**Cards** `index.html` `#techGrid` → tiap `.tech-card`:
```html
<div class="tech-card" data-category="Frontend" data-tech="HTML">
  <i class="fab fa-html5"></i>
  <h3 class="tech-name">HTML</h3>
  <span class="tech-category">Frontend</span>
</div>
```

**Constellation** `script.js` → `initSkillViz()` → array `categories`:
```js
{ id:'Frontend', label:'Frontend', icon:'fa-layer-group', desc:'HTML • CSS • JS', count:'3 stack' }
```

**Marquee** `index.html` `#marqueeTrack` — duplikat list agar infinite seamless.

Warna border icon otomatis dari `data-category` (Frontend cyan, Backend purple, Database green, API gold, Deployment magenta).

---

## ♿ Aksesibilitas & Performa

- Semantic: `<main id="main">`, `<nav aria-label>`, `<section aria-labelledby>`, skip-link, `aria-expanded` hamburger, `aria-hidden` untuk decorative
- Keyboard: `Tab` semua interaktif, `Enter/Space` hamburger, `Esc` tutup menu & modal, `Tab` trap di modal, `ArrowUp/Down` history terminal
- Focus: `:focus-visible` cyan outline 2px
- `prefers-reduced-motion` disables semua animasi, `prefers-contrast` outline 3px
- Perform: `transform/opacity` only (GPU), `requestAnimationFrame` + `IntersectionObserver` pause canvas saat offscreen & `document.hidden`, `passive` scroll, debounce resize 120ms, Three.js `pixelRatio` 1 di mobile, particle count 30→60 vs 18→32 etc.
- Images: tidak ada bitmap, semua CSS/Canvas/SVG — tidak butuh lazy, tapi `loading="lazy"` siap jika tambah `<img>`

---

## ✅ Audit Checklist

- **Responsive**: 320, 375, 412, 768, 1024, 1440 — `overflow-x: clip`, `container 40→24→16px`, grid `1fr` di mobile, modal `92vh`, hero `column` di mobile
- **No overflow**: `* {box-sizing:border-box}` + `max-width:100%` pada media, grid `min-width:0`
- **Performance**: Lighthouse 95+ expected (static, no blocking JS, font preconnect)
- **SEO**: title 60char, description 155, OG 1200x630, twitter, canonical, sitemap, robots, favicon.svg, JSON-LD Person
- **Console**: `node --check script.js` → 0, no `console.log` production
- **Links**: semua `href="#id"` valid (home/about/skills/projects/experience/lab/playground/contact)

---

## 📄 Lisensi

MIT — bebas pakai & modifikasi. Kredit tidak wajib tapi dihargai.

Dibuat dengan vanilla code — tanpa Bootstrap/Tailwind/React — untuk kesan **memorable, credible, hiring-manager ready**.
