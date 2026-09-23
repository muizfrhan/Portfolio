/* ============================================
   PORTFOLIO - MAIN SCRIPT
   ============================================ */

(function() {
    'use strict';

    // ============================================
    // VARIABLES
    // ============================================
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    const isLowEnd = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) || (navigator.deviceMemory && navigator.deviceMemory <= 4) || isMobile;
    const perfPixelRatio = Math.min(window.devicePixelRatio || 1, isLowEnd ? 1 : 1.5);
    let loaderProgress = 0;
    let isLoaded = false;

    // ============================================
    // PROJECTS DATA — 4 proyek (APSS unggulan + proyek lain)
    // ============================================
    const projectsData = [
        {
            id: 'apss',
            featured: true,
            title: 'Aplikasi Pengaduan Sarana Sekolah (APSS)',
            category: 'Web Application',
            description: 'Sistem pelaporan sarana dan prasarana sekolah berbasis web — pengguna mengirim pengaduan, pengelola memantau, memproses, dan memberikan feedback terhadap laporan.',
            longDescription: 'APSS adalah sistem informasi berbasis web untuk mempermudah pelaporan kerusakan sarana dan prasarana sekolah. Pengguna mengirim pengaduan secara online, sedangkan Admin dan Guru memverifikasi, menindaklanjuti, dan memantau seluruh laporan — dilengkapi landing page responsif, autentikasi multi-role, dashboard analitik, manajemen data, dan export laporan.',
            image: 'assets/images/projects/apss-landing.png',
            icon: 'fa-clipboard-list',
            technologies: ['PHP Native', 'MySQL', 'Bootstrap 5', 'HTML', 'CSS', 'JavaScript', 'AJAX', 'Chart.js', 'SweetAlert2'],
            features: ['Autentikasi multi-role (Admin, Guru, User)', 'Dashboard admin dengan statistik & grafik', 'Manajemen dan monitoring pengaduan', 'Timeline status & progress laporan', 'Export laporan PDF dan Excel'],
            challenges: 'Menyatukan alur pengaduan multi-role — dari pengiriman laporan oleh siswa hingga verifikasi, tindak lanjut, dan pelaporan oleh Admin/Guru — dalam satu sistem yang konsisten dan mudah dipantau.',
            solutions: 'Autentikasi berbasis role, modul CRUD terpusat (pengaduan, kategori, ruangan, pengguna), grafik Chart.js untuk statistik, serta ekspor PDF/Excel untuk kebutuhan pelaporan.',
            github: 'https://github.com/muizfrhan/aplikasi-pengaduan-sarana-sekolah',
            demo: '#',
            urlLabel: 'github.com/muizfrhan/aplikasi-pengaduan-sarana-sekolah',
            role: 'Software Engineer / Developer',
            type: 'Web Application',
            year: '2026'
        },
        {
            id: 'tiket-pesawat',
            title: 'Tiket Pesawat',
            category: 'Ticket Booking System',
            description: 'Sistem informasi penjualan tiket pesawat berbasis web — mencakup booking, jadwal penerbangan, manajemen bandara dan pesawat, tarif, hingga laporan operasional.',
            longDescription: 'Sistem informasi penjualan tiket pesawat yang dibangun dengan CodeIgniter dan MySQL. Mengelola data bandara, pesawat, jadwal penerbangan, tarif, customer, serta proses booking tiket — dilengkapi modul laporan dan login multi-level (Admin, Petugas, Manajer, SuperUser).',
            image: 'assets/images/projects/tiket-pesawat.png',
            icon: 'fa-plane',
            technologies: ['CodeIgniter', 'PHP', 'MySQL', 'HTML', 'CSS', 'JavaScript'],
            features: ['Login multi-level (Admin, Petugas, Manajer, SuperUser)', 'Manajemen booking tiket', 'Jadwal dan data penerbangan', 'Master data bandara, pesawat, dan tarif', 'Modul laporan operasional'],
            challenges: 'Menghubungkan alur penjualan tiket — dari data master bandara dan pesawat, jadwal, tarif, hingga booking dan laporan — dalam satu sistem berbasis CodeIgniter.',
            solutions: 'Arsitektur MVC CodeIgniter dengan model terpisah per modul (bandara, pesawat, jadwal, tarif, booking, customer, laporan) di atas basis data MySQL.',
            github: 'https://github.com/muizfrhan/Tiket-Pesawat',
            demo: '#',
            urlLabel: 'github.com/muizfrhan/Tiket-Pesawat',
            role: 'Software Engineer / Developer',
            type: 'Web Application',
            year: 'CV'
        },
        {
            id: 'sipekerba',
            title: 'SIPEKERBA',
            category: 'Sistem Informasi',
            description: 'Sistem Pengaduan Kerusakan Barang — pelapor mengirim laporan kerusakan barang secara daring, admin memproses status pengaduan, mengelola akun, dan menyusun laporan berperiode.',
            longDescription: 'SIPEKERBA (Sistem Pengaduan Kerusakan Barang) adalah aplikasi untuk mencatat laporan kerusakan barang ke dalam database agar data tersimpan rapi dan penanganan dapat dilakukan lebih cepat. Mencakup halaman depan untuk pengecekan status pengaduan via nomor pengaduan, form pengaduan dengan nomor otomatis, login dan registrasi yang diaktivasi oleh admin, dashboard admin, data pengaduan dengan tiga status proses, manajemen akun, serta modul report harian, bulanan, dan tahunan — dibangun dengan PHP native dan MySQL.',
            image: 'assets/images/projects/sipekerba-frontend.png',
            icon: 'fa-tools',
            technologies: ['PHP Native', 'MySQL', 'JavaScript', 'HTML', 'CSS', 'Bootstrap', 'AdminLTE'],
            features: ['Form pengaduan dengan nomor pengaduan otomatis', 'Cek status pengaduan via nomor pengaduan', 'Login, registrasi, dan aktivasi akun oleh admin', 'Dashboard admin dan manajemen pengguna', 'Tracking status: diajukan → diproses → selesai', 'Laporan harian, bulanan, dan tahunan'],
            challenges: 'Menyatukan alur pengaduan lintas peran — form dan pengecekan status di halaman depan, pemrosesan status oleh admin, manajemen akun, hingga laporan berperiode — dalam satu aplikasi PHP native di atas database MySQL.',
            solutions: 'Fungsi CRUD terpusat di function.php (insertPengaduan, updatePengaduan, registrasi), pemisahan folder auth/, admin/, dan templates/, tiga status pengaduan, serta modul report dengan filter tanggal, bulan, dan tahun memakai template AdminLTE.',
            github: 'https://github.com/muizfrhan/sipekerba',
            demo: '#',
            urlLabel: 'github.com/muizfrhan/sipekerba',
            role: 'Software Engineer / Developer',
            type: 'Web Application',
            year: 'CV'
        },
        {
            id: 'sigaka',
            title: 'Sigaka',
            category: 'Payroll System',
            description: 'Sistem penggajian karyawan berbasis web — mengelola, mengatur, dan mengotomatiskan pembayaran gaji perusahaan beserta absensi, data master, peminjaman, dan laporan.',
            longDescription: 'Sigaka (Sistem Penggajian Karyawan) adalah aplikasi untuk mengelola, mengatur, dan mengotomatiskan pembayaran karyawan, sehingga perusahaan dapat melacak seluruh pembayaran dengan lebih mudah. Dibangun dengan arsitektur MVC CodeIgniter dan database MySQL — mencakup halaman awal, autentikasi, dashboard admin, data master karyawan dan jabatan, absensi, data gaji, peminjaman, hingga modul laporan.',
            image: 'assets/images/projects/sigaka-landing.png',
            icon: 'fa-wallet',
            technologies: ['CodeIgniter', 'PHP', 'MySQL', 'Bootstrap', 'JavaScript', 'HTML', 'CSS'],
            features: ['Autentikasi login & dashboard admin', 'Data master karyawan dan jabatan', 'Pencatatan absensi karyawan', 'Data dan perhitungan gaji karyawan', 'Modul peminjaman karyawan', 'Laporan penggajian dan pencetakan'],
            challenges: 'Menghubungkan seluruh siklus penggajian — data karyawan, absensi, peminjaman, hingga perhitungan gaji dan pelaporan — dalam satu sistem MVC yang konsisten di atas database MySQL.',
            solutions: 'Arsitektur MVC CodeIgniter dengan controller terpisah per modul (Auth, Dashboard, Karyawan, Jabatan, Absen, Gaji, Pinjam, Laporan), pemisahan view frontend/backend, serta template admin Bootstrap untuk antarmuka yang konsisten.',
            github: 'https://github.com/muizfrhan/Sigaka',
            demo: '#',
            urlLabel: 'github.com/muizfrhan/Sigaka',
            role: 'Software Engineer / Developer',
            type: 'Web Application',
            year: 'CV'
        }
    ];

    // DOM Elements
    const loader = document.getElementById('loader');
    const loaderOverlay = document.getElementById('loaderOverlay');
    const loaderProgressBar = document.getElementById('loaderProgressBar');
    const loaderPercentage = document.getElementById('loaderPercentage');
    const terminalBody = document.getElementById('terminalBody');
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const heroCanvas = document.getElementById('heroCanvas');
    const threeCanvas = document.getElementById('threeCanvas');
    const threeContainer = document.getElementById('hero3dContainer');
    const noiseOverlay = document.getElementById('noiseOverlay');

    // helper: pause rAF when section offscreen
    function observeVisibility(sectionEl, onVisible, onHidden){
        if(!sectionEl || !('IntersectionObserver' in window)) return;
        const io = new IntersectionObserver((entries)=>{
            entries.forEach(e=>{
                if(e.isIntersecting) onVisible && onVisible();
                else onHidden && onHidden();
            });
        }, {threshold:0});
        io.observe(sectionEl);
        return io;
    }

    // ============================================
    // LOADING SCREEN
    // ============================================
    function initLoader() {
        if (prefersReducedMotion) {
            setTimeout(() => {
                loader.classList.add('hidden');
                isLoaded = true;
                initAll();
            }, 1000);
            return;
        }

        const lines = terminalBody.querySelectorAll('.terminal-line');
        const lineDurations = [700, 800, 800, 800, 1000];
        let lineIndex = 0;
        let totalProgress = 0;

        function showLine(index) {
            if (index >= lines.length) {
                startProgress();
                return;
            }
            totalProgress += lineDurations[index] / 5200 * 100;
            updateProgress(totalProgress);
            showLine(index + 1);
        }

        function startProgress() {
            const interval = setInterval(() => {
                if (loaderProgress >= 100 || isLoaded) {
                    clearInterval(interval);
                    loaderProgress = 100;
                    updateProgress(100);
                    setTimeout(() => {
                        hideLoader();
                    }, 600);
                    return;
                }
                loaderProgress += Math.random() * 8 + 2;
                if (loaderProgress > 100) loaderProgress = 100;
                updateProgress(loaderProgress);
            }, 50);
        }

        function updateProgress(val) {
            loaderProgressBar.style.width = val + '%';
            loaderPercentage.textContent = Math.floor(val) + '%';
        }

        showLine(lineIndex);
    }

    function hideLoader() {
        loader.classList.add('hidden');
        isLoaded = true;
        setTimeout(() => {
            initAll();
        }, 800);
    }

    // ============================================
    // NAVBAR
    // ============================================
    function initNavbar() {
        // Navbar scrolled — single lightweight rAF, passive
        let scrollTicking = false;
        function onNavScroll(){
            if (scrollTicking) return;
            scrollTicking = true;
            requestAnimationFrame(()=>{
                const y = window.scrollY;
                if (y > 80) navbar.classList.add('scrolled');
                else navbar.classList.remove('scrolled');
                scrollTicking = false;
            });
        }
        window.addEventListener('scroll', onNavScroll, {passive:true});
        // initial check
        onNavScroll();
        // Active link via IntersectionObserver — jauh lebih ringan dari per-scroll loop
        try {
            const sections = document.querySelectorAll('section[id]');
            const linkMap = new Map();
            document.querySelectorAll('.nav-link[href^="#"]').forEach(a=>{
                const id = a.getAttribute('href').slice(1);
                linkMap.set(id, a);
            });
            if ('IntersectionObserver' in window && sections.length){
                const io = new IntersectionObserver((entries)=>{
                    // pilih section paling terlihat di viewport atas
                    let topMost = null;
                    let topRatio = -1;
                    entries.forEach(e=>{
                        if(e.isIntersecting && e.intersectionRatio > topRatio){
                            topRatio = e.intersectionRatio;
                            topMost = e.target.id;
                        }
                    });
                    if (topMost && linkMap.has(topMost)){
                        document.querySelectorAll('.nav-link').forEach(l=> l.classList.remove('active'));
                        linkMap.get(topMost).classList.add('active');
                    }
                }, { rootMargin:'-45% 0px -45% 0px', threshold:[0,0.25,0.5,0.75,1] });
                sections.forEach(s=> io.observe(s));
            } else {
                // fallback — throttle
                let tick=false;
                window.addEventListener('scroll', ()=>{
                    if(tick) return;
                    tick=true;
                    requestAnimationFrame(()=>{
                        const y = window.scrollY + 220;
                        let cur=null;
                        sections.forEach(s=>{ if(s.offsetTop <= y) cur=s.id; });
                        if(cur && linkMap.has(cur)){
                            document.querySelectorAll('.nav-link').forEach(l=> l.classList.remove('active'));
                            linkMap.get(cur).classList.add('active');
                        }
                        tick=false;
                    });
                }, {passive:true});
            }
        } catch(e){ /* no crash */ }

        // Mobile menu toggle
        function setNav(open){
            navToggle.classList.toggle('active', open);
            navLinks.classList.toggle('open', open);
            navToggle.setAttribute('aria-expanded', String(open));
            document.body.classList.toggle('nav-open', open);
            document.body.style.overflow = open ? 'hidden' : '';
        }
        navToggle.addEventListener('click', () => {
            const isOpen = navLinks.classList.contains('open');
            setNav(!isOpen);
        });
        navToggle.addEventListener('keydown', (e)=>{
            if(e.key==='Enter' || e.key===' '){ e.preventDefault(); navToggle.click(); }
        });

        // Close mobile menu on link click
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => setNav(false));
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target)) setNav(false);
        });
        document.addEventListener('keydown', (e)=>{
            if(e.key==='Escape' && navLinks.classList.contains('open')) setNav(false);
        });
    }

    function updateActiveNavLink() {
        // deprecated — now handled by IntersectionObserver in initNavbar
    }

    // ============================================
    // HERO CANVAS PARTICLES (2D)
    // ============================================
    function initHeroCanvas() {
        const canvas = heroCanvas;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        let particles = [];
        let animationId=null;
        let isVisible=true;

        function resizeCanvas() {
            try{
                const parent = canvas.parentElement;
                if(!parent) return;
                canvas.width = parent.offsetWidth;
                canvas.height = parent.offsetHeight;
            }catch{}
        }

        function createParticles() {
            particles = [];
            // kurangi jumlah untuk 60fps smooth
            const particleCount = isMobile ? 18 : (isLowEnd ? 24 : 32);
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 1.6 + 0.4,
                    speedX: (Math.random() - 0.5) * 0.32,
                    speedY: (Math.random() - 0.5) * 0.32,
                    opacity: Math.random() * 0.42 + 0.08,
                    color: Math.random() > 0.5 ? '0, 240, 255' : '123, 47, 255'
                });
            }
        }

        function drawParticles() {
            if (!isVisible) { animationId=null; return; }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // update & draw dots
            for(let k=0;k<particles.length;k++){
                const p = particles[k];
                p.x += p.speedX;
                p.y += p.speedY;
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
                ctx.fill();
            }
            // Draw connections — optimized: skip sqrt kecuali dekat, threshold 110
            const maxDist = 110;
            const maxDist2 = maxDist*maxDist;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const d2 = dx*dx + dy*dy;
                    if (d2 < maxDist2) {
                        const distance = Math.sqrt(d2);
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(0, 240, 255, ${0.045 * (1 - distance / maxDist)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
            animationId = requestAnimationFrame(drawParticles);
        }

        resizeCanvas();
        createParticles();
        
        if (!prefersReducedMotion) {
            drawParticles();
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for(let k=0;k<particles.length;k++){
                const p=particles[k];
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
                ctx.fill();
            }
        }

        let resizeTimer=null;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer=setTimeout(()=>{ resizeCanvas(); createParticles(); }, 120);
        }, {passive:true});

        // pause when offscreen / tab hidden
        try{
            if('IntersectionObserver' in window){
                const io = new IntersectionObserver((entries)=>{
                    entries.forEach(e=>{
                        isVisible = e.isIntersecting;
                        if(isVisible && !animationId && !prefersReducedMotion){
                            drawParticles();
                        } else if(!isVisible && animationId){
                            cancelAnimationFrame(animationId); animationId=null;
                        }
                    });
                }, {threshold:0});
                io.observe(document.getElementById('home'));
            }
        }catch{}
        document.addEventListener('visibilitychange', ()=>{
            if(document.hidden){ if(animationId){ cancelAnimationFrame(animationId); animationId=null; } }
            else if(isVisible && !animationId && !prefersReducedMotion) drawParticles();
        });
    }

    // ============================================
    // THREE.JS 3D SCENE
    // ============================================
    function initThreeJS() {
        // matikan total di mobile/low-end agar tidak berat — hero sudah pakai foto han.jpeg yang lebih penting
        if (typeof THREE === 'undefined' || prefersReducedMotion) {
            if (threeContainer) threeContainer.style.display = 'none';
            return;
        }
        // low-end atau layar kecil: nonaktifkan Three hero untuk 60fps, hanya canvas 2D yang jalan
        if (isMobile || isLowEnd || window.innerWidth < 1024) {
            if (threeContainer) threeContainer.style.display = 'none';
            return;
        }

        try {
            const container = threeContainer;
            if(!container) return;
            const width = container.offsetWidth || 300;
            const height = container.offsetHeight || 300;

            // Scene
            const scene = new THREE.Scene();
            scene.fog = new THREE.FogExp2(0x050510, 0.02);

            // Camera
            const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
            camera.position.z = 5;

            // Renderer
            const renderer = new THREE.WebGLRenderer({
                canvas: threeCanvas,
                alpha: true,
                antialias: false
            });
            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(perfPixelRatio, 1.2));
            renderer.setClearColor(0x000000, 0);

            // Wireframe Icosahedron
            const geometry = new THREE.IcosahedronGeometry(1.2, 1);
            const material = new THREE.MeshBasicMaterial({
                color: 0x00f0ff,
                wireframe: true,
                transparent: true,
                opacity: 0.6
            });
            const icosahedron = new THREE.Mesh(geometry, material);
            scene.add(icosahedron);

            // Inner solid core
            const coreGeometry = new THREE.IcosahedronGeometry(0.4, 0);
            const coreMaterial = new THREE.MeshBasicMaterial({
                color: 0x7b2fff,
                transparent: true,
                opacity: 0.3
            });
            const core = new THREE.Mesh(coreGeometry, coreMaterial);
            scene.add(core);

            // Orbiting rings
            const ring1Geometry = new THREE.RingGeometry(2, 2.05, 64);
            const ring1Material = new THREE.MeshBasicMaterial({
                color: 0x00f0ff,
                transparent: true,
                opacity: 0.15,
                side: THREE.DoubleSide
            });
            const ring1 = new THREE.Mesh(ring1Geometry, ring1Material);
            ring1.rotation.x = Math.PI / 2;
            scene.add(ring1);

            const ring2Geometry = new THREE.RingGeometry(2.5, 2.53, 64);
            const ring2Material = new THREE.MeshBasicMaterial({
                color: 0xff006e,
                transparent: true,
                opacity: 0.1,
                side: THREE.DoubleSide
            });
            const ring2 = new THREE.Mesh(ring2Geometry, ring2Material);
            ring2.rotation.x = Math.PI / 3;
            ring2.rotation.z = Math.PI / 4;
            scene.add(ring2);

            // Particles — dikurangi dari 200 ke 90 untuk smooth
            const particleCount = 90;
            const particleGeometry = new THREE.BufferGeometry();
            const positions = new Float32Array(particleCount * 3);
            const colors = new Float32Array(particleCount * 3);

            for (let i = 0; i < particleCount; i++) {
                positions[i * 3] = (Math.random() - 0.5) * 10;
                positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

                if (Math.random() > 0.5) {
                    colors[i * 3] = 0;
                    colors[i * 3 + 1] = 0.94;
                    colors[i * 3 + 2] = 1;
                } else {
                    colors[i * 3] = 0.48;
                    colors[i * 3 + 1] = 0.19;
                    colors[i * 3 + 2] = 1;
                }
            }

            particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

            const particleMaterial = new THREE.PointsMaterial({
                size: 0.03,
                vertexColors: true,
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending
            });
            const particles = new THREE.Points(particleGeometry, particleMaterial);
            scene.add(particles);

            // Glow texture (canvas-based)
            const glowCanvas = document.createElement('canvas');
            glowCanvas.width = 128;
            glowCanvas.height = 128;
            const glowCtx = glowCanvas.getContext('2d');
            const gradient = glowCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
            gradient.addColorStop(0, 'rgba(0, 240, 255, 0.3)');
            gradient.addColorStop(0.5, 'rgba(0, 240, 255, 0.05)');
            gradient.addColorStop(1, 'rgba(0, 240, 255, 0)');
            glowCtx.fillStyle = gradient;
            glowCtx.fillRect(0, 0, 128, 128);

            const glowTexture = new THREE.CanvasTexture(glowCanvas);
            const glowSprite = new THREE.Sprite(new THREE.SpriteMaterial({
                map: glowTexture,
                transparent: true,
                blending: THREE.AdditiveBlending,
                opacity: 0.5
            }));
            glowSprite.scale.set(4, 4, 1);
            scene.add(glowSprite);

            // Mouse tracking
            let targetRotX = 0;
            let targetRotY = 0;
            let currentRotX = 0;
            let currentRotY = 0;

            document.addEventListener('mousemove', (e) => {
                if (isMobile) return;
                const x = (e.clientX / window.innerWidth) * 2 - 1;
                const y = -(e.clientY / window.innerHeight) * 2 + 1;
                targetRotY = x * 0.5;
                targetRotX = y * 0.5;
            });

            // Parallax based on mouse
            let mouseX3d = 0;
            let mouseY3d = 0;

            let heroRaf=null;
            let isHeroThreeVisible=true;
            function animate() {
                if(!isHeroThreeVisible || document.hidden){ heroRaf=null; return; }
                heroRaf=requestAnimationFrame(animate);

                // Rotate icosahedron
                icosahedron.rotation.y += 0.0022;
                icosahedron.rotation.x += 0.0008;

                // Rotate core in opposite direction
                core.rotation.y -= 0.0035;
                core.rotation.x -= 0.0014;

                // Rotate rings
                ring1.rotation.z += 0.0014;
                ring2.rotation.z -= 0.0008;
                ring1.rotation.x = Math.PI / 2 + Math.sin(Date.now() * 0.001) * 0.15;
                ring2.rotation.x = Math.PI / 3 + Math.cos(Date.now() * 0.001) * 0.15;

                // Rotate particles
                particles.rotation.y += 0.00035;
                particles.rotation.x += 0.00014;

                // Mouse parallax
                currentRotX += (targetRotX - currentRotX) * 0.02;
                currentRotY += (targetRotY - currentRotY) * 0.02;

                scene.rotation.y = currentRotY * 0.3;
                scene.rotation.x = currentRotX * 0.3;

                // Glow pulsing
                const time = Date.now() * 0.001;
                glowSprite.material.opacity = 0.3 + Math.sin(time * 2) * 0.1;
                glowSprite.scale.set(3.5 + Math.sin(time * 1.5) * 0.5, 3.5 + Math.sin(time * 1.5) * 0.5, 1);

                // Icosahedron pulse
                const scale = 1 + Math.sin(time * 1.5) * 0.05;
                icosahedron.scale.set(scale, scale, scale);

                renderer.render(scene, camera);
            }

            if (!prefersReducedMotion) {
                // pause when hero offscreen
                try{
                    if('IntersectionObserver' in window){
                        const io3 = new IntersectionObserver((entries)=>{
                            entries.forEach(e=>{
                                isHeroThreeVisible = e.isIntersecting;
                                if(isHeroThreeVisible && !heroRaf) animate();
                                else if(!isHeroThreeVisible && heroRaf){ cancelAnimationFrame(heroRaf); heroRaf=null; }
                            });
                        }, {threshold:0});
                        const heroSec = document.getElementById('home');
                        if(heroSec) io3.observe(heroSec);
                    }
                }catch{}
                document.addEventListener('visibilitychange', ()=>{
                    if(document.hidden){ if(heroRaf){ cancelAnimationFrame(heroRaf); heroRaf=null; } }
                    else if(isHeroThreeVisible && !heroRaf) animate();
                });
                animate();
            } else {
                renderer.render(scene, camera);
            }

            // Resize handler
            let resizeTimeout;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    const newWidth = container.offsetWidth;
                    const newHeight = container.offsetHeight;
                    camera.aspect = newWidth / newHeight;
                    camera.updateProjectionMatrix();
                    renderer.setSize(newWidth, newHeight);
                }, 100);
            });

        } catch (e) {
            console.error('Three.js initialization failed:', e);
            if (threeContainer) {
                threeContainer.style.display = 'none';
            }
        }
    }

    // ============================================
    // NOISE OVERLAY
    // ============================================
    function initNoise() {
        if (!noiseOverlay || prefersReducedMotion) return;
        // Noise is already a CSS background-image, this just ensures it stays subtle
        noiseOverlay.style.opacity = '0.03';
    }

    // ============================================
    // HERO PARALLAX — depth: photo > 3D > particles > bg
    // ============================================
    function initHeroParallax() {
        if (isMobile || prefersReducedMotion) return;
        const profileStage = document.getElementById('profileStage');
        const profileFrame = document.querySelector('.profile-frame');
        const profile3d = document.querySelector('.profile-3d-layer');
        const heroBg = document.querySelector('.hero-background');
        const hero = document.getElementById('home');
        if (!hero) return;
        let ticking=false;
        let isHeroVisible=true;
        // pause when hero offscreen
        try{
            if('IntersectionObserver' in window){
                const io = new IntersectionObserver((entries)=>{
                    entries.forEach(e=>{ isHeroVisible = e.isIntersecting; if(!isHeroVisible){
                        // reset transforms when offscreen to avoid stray styles
                        if(heroBg) heroBg.style.transform='';
                        if(profile3d) profile3d.style.transform='';
                        if(profileFrame) profileFrame.style.transform='';
                        if(profileStage) profileStage.style.transform='';
                    }});
                }, {threshold:0});
                io.observe(hero);
            }
        }catch{}
        function apply(){
            if(!isHeroVisible || !isLoaded) { ticking=false; return; }
            const rect = hero.getBoundingClientRect();
            if(rect.bottom < -100 || rect.top > window.innerHeight) { ticking=false; return; }
            const prog = Math.min(Math.max(0, -rect.top / (rect.height || 800)), 1);
            // depth layers: gunakan translate3d untuk GPU, jauh lebih ringan dari filter
            if (heroBg) heroBg.style.transform = `translate3d(0,${prog * 12}px,0)`;
            if (profile3d) profile3d.style.transform = `translate3d(0,${prog * 18}px,0)`;
            if (profileFrame) profileFrame.style.transform = `translate3d(0,${prog * 8}px,0)`;
            if (profileStage) profileStage.style.transform = `translate3d(0,${prog * 6}px,0)`;
            ticking=false;
        }
        function onScroll(){
            if(ticking) return;
            ticking=true;
            requestAnimationFrame(apply);
        }
        window.addEventListener('scroll', onScroll, {passive:true});
        // initial
        requestAnimationFrame(apply);
    }

    // ============================================
    // MOUSE PARALLAX ON HERO — Cinematic depth
    // ============================================
    function initMouseParallax() {
        if (isMobile || prefersReducedMotion || isLowEnd) return;
        const heroVisual = document.getElementById('heroVisual');
        const profileStage = document.getElementById('profileStage');
        const profileFrame = document.querySelector('.profile-frame');
        const profile3d = document.querySelector('.profile-3d-layer');
        const heroBg = document.querySelector('.hero-background');
        const badges = document.querySelectorAll('.profile-badge-float');
        const floats = document.querySelectorAll('.profile-float');
        const codeBlocks = document.querySelectorAll('.floating-code-block');
        const hero = document.getElementById('home');
        let raf=null;
        let lastX=0, lastY=0;
        let isHeroInView=true;
        try{
            if('IntersectionObserver' in window && hero){
                const ioM = new IntersectionObserver((entries)=>{
                    entries.forEach(e=> isHeroInView=e.isIntersecting);
                }, {threshold:0});
                ioM.observe(hero);
            }
        }catch{}
        document.addEventListener('mousemove', (e) => {
            if(!isHeroInView) return;
            // throttled — hanya hitung posisi, render di rAF
            lastX = (e.clientX / window.innerWidth - 0.5) * 2;
            lastY = (e.clientY / window.innerHeight - 0.5) * 2;
            if(raf) return;
            raf = requestAnimationFrame(()=>{
                raf=null;
                // jika sudah scroll jauh, matikan parallax mouse agar tidak konflik dengan scroll parallax
                const scrollProg = hero ? Math.min(Math.max(0, -hero.getBoundingClientRect().top / 600), 1) : 0;
                if(scrollProg > 0.22) return;
                const x = lastX, y = lastY;
                if (profileStage) {
                    if (profileFrame) profileFrame.style.transform = `translate3d(${x * 3}px, ${y * 2.5}px, 0)`;
                    if (profile3d) profile3d.style.transform = `translate3d(${x * 6}px, ${y * 4}px, 0)`;
                    if (heroBg) heroBg.style.transform = `translate3d(${x * 1.2}px, ${y * 1}px, 0)`;
                    badges.forEach((b,i)=>{ b.style.transform = `translate3d(${x * (5+i*1.2)}px, ${y * (4+i*1)}px, 0)`; });
                    floats.forEach((f,i)=>{ f.style.transform = `translate3d(${x * (6+i*1.5)}px, ${y * (5+i*1)}px, 0)`; });
                } else if (heroVisual) {
                    const isNew = heroVisual.classList.contains('hero-right');
                    if (isNew) {
                        heroVisual.style.transform = `translate(${x * 10}px, ${y * 10}px)`;
                    } else {
                        heroVisual.style.transform = `translateY(-50%) translateX(${x * 10}px) translateY(${y * 10}px)`;
                    }
                }
                if(codeBlocks.length){
                    codeBlocks.forEach((block, i) => {
                        const factor = (i + 1) * 5;
                        block.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
                    });
                }
            });
        }, {passive:true});
    }

    function initProfileImageFallback(){
        const img = document.getElementById('profileImg');
        const fallback = document.getElementById('profileFallback');
        if(!img || !fallback) return;
        img.addEventListener('error', ()=>{
            if(img.style.display==='none') fallback.style.display='flex';
        });
        img.addEventListener('load', ()=>{
            if(img.naturalWidth>10){ fallback.style.display='none'; img.style.display='block'; }
        });
        setTimeout(()=>{
            if(!img.complete || img.naturalWidth===0){
            }
        }, 800);
    }

    function initMagneticButtons(){
        if(isMobile || prefersReducedMotion || isLowEnd) return;
        const btns = document.querySelectorAll('[data-magnetic]');
        btns.forEach(btn=>{
            let raf=null;
            btn.addEventListener('mousemove', (e)=>{
                const r = btn.getBoundingClientRect();
                const x = e.clientX - (r.left + r.width/2);
                const y = e.clientY - (r.top + r.height/2);
                if(raf) cancelAnimationFrame(raf);
                raf = requestAnimationFrame(()=>{
                    btn.style.transform = `translate(${x*0.18}px, ${y*0.28}px)`;
                });
            });
            btn.addEventListener('mouseleave', ()=>{
                if(raf) cancelAnimationFrame(raf);
                btn.style.transform = 'translate(0,0)';
            });
        });
    }

    // ============================================
    // HERO TEXT CINEMATIC — PART 1.1
    // ============================================
    function initHeroTextCinematic(){
        const eyebrow = document.getElementById('heroEyebrow');
        const title = document.getElementById('heroTitle');
        const nameLines = title ? title.querySelectorAll('.hero-name-line') : [];
        const role = document.getElementById('heroRole');
        const roleTyping = document.getElementById('heroRoleTyping');
        const roleCursor = role ? role.querySelector('.typing-cursor') : null;
        const desc = document.getElementById('heroDesc');
        const descLines = desc ? desc.querySelectorAll('.desc-line') : [];
        const badge = document.getElementById('heroBadge');
        const buttons = document.getElementById('heroButtons');
        const social = document.getElementById('heroSocial');
        const heroLeft = document.getElementById('heroLeft');
        const hero = document.getElementById('home');

        // reduced motion — simple fade
        if(prefersReducedMotion){
            if(eyebrow) eyebrow.classList.add('is-visible');
            nameLines.forEach(l=> l.classList.add('is-visible'));
            if(role) role.classList.add('is-visible');
            if(roleTyping) roleTyping.textContent = 'SOFTWARE ENGINEER';
            if(roleCursor) roleCursor.classList.add('is-visible');
            if(desc) desc.classList.add('is-visible');
            descLines.forEach(l=> l.classList.add('is-visible'));
            if(badge) badge.classList.add('is-visible');
            if(buttons) buttons.classList.add('is-visible');
            if(social) social.classList.add('is-visible');
            return;
        }

        // --- HELLO I'M letter split ---
        if(eyebrow && !eyebrow.dataset.split){
            const text = eyebrow.textContent;
            eyebrow.textContent = '';
            eyebrow.dataset.split = '1';
            [...text].forEach((ch, i)=>{
                const span = document.createElement('span');
                span.className = 'char';
                span.textContent = ch === ' ' ? '\u00A0' : ch;
                span.style.transitionDelay = (i * 38) + 'ms';
                eyebrow.appendChild(span);
            });
            // keep aria-label
        }

        function revealEyebrow(){
            if(!eyebrow) return;
            // initial expanded spacing
            eyebrow.style.letterSpacing = '0.55em';
            eyebrow.classList.add('is-visible');
            // chars staggered
            const chars = eyebrow.querySelectorAll('.char');
            chars.forEach(c=> c.style.transitionDelay = c.style.transitionDelay);
            // trigger chars after frame
            requestAnimationFrame(()=>{
                eyebrow.querySelectorAll('.char').forEach(c=> c.style.opacity='1');
                // after 650ms, tighten spacing to normal 4px
                setTimeout(()=>{ eyebrow.style.letterSpacing='4px'; }, 680);
            });
        }

        function revealName(){
            nameLines.forEach((line, idx)=>{
                const delay = idx===0 ? 0 : idx===1 ? 150 : 300;
                setTimeout(()=>{
                    line.classList.add('is-visible');
                }, delay);
            });
        }

        function startTyping(){
            if(!role || !roleTyping) return;
            role.classList.add('is-visible');
            if(roleCursor) roleCursor.classList.add('is-visible');
            const full = 'SOFTWARE ENGINEER';
            let i=0;
            roleTyping.textContent = '';
            const t = setInterval(()=>{
                i++;
                roleTyping.textContent = full.slice(0,i);
                if(i>=full.length){
                    clearInterval(t);
                    // keep cursor blinking
                }
            }, 68);
        }

        function revealDesc(){
            if(!desc) return;
            desc.classList.add('is-visible');
            descLines.forEach((l, idx)=>{
                setTimeout(()=> l.classList.add('is-visible'), idx*120);
            });
        }

        // --- Sequence after loader — badge → greeting → headline → role → desc → CTA → social ---
        setTimeout(()=>{ if(badge) badge.classList.add('is-visible'); }, 150);
        setTimeout(revealEyebrow, 350);
        setTimeout(revealName, 600);
        setTimeout(startTyping, 1150);
        setTimeout(revealDesc, 1900);
        setTimeout(()=>{ if(buttons) buttons.classList.add('is-visible'); }, 2250);
        setTimeout(()=>{ if(social) social.classList.add('is-visible'); }, 2500);

        // --- Glitch every 3.5-6s, very subtle, 280ms ---
        const farhan = document.querySelector('.hero-name-line.glitch');
        if(farhan && !prefersReducedMotion){
            function triggerGlitch(){
                farhan.classList.add('glitching');
                setTimeout(()=> farhan.classList.remove('glitching'), 280);
            }
            let glitchTimer = setTimeout(function loop(){
                triggerGlitch();
                const next = 3500 + Math.random()*2500;
                glitchTimer = setTimeout(loop, next);
            }, 3200);
            // pause when not visible
            document.addEventListener('visibilitychange', ()=>{
                if(document.hidden) clearTimeout(glitchTimer);
            });
        }

        // --- Micro parallax (2px / 4px / 1px) ---
        if(!isMobile && heroLeft && !prefersReducedMotion){
            let raf=null;
            heroLeft.addEventListener('mousemove', (e)=>{
                const rect = heroLeft.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                if(raf) cancelAnimationFrame(raf);
                raf = requestAnimationFrame(()=>{
                    if(eyebrow) eyebrow.style.transform = `translate(${x*2}px, ${y*1.5}px)`;
                    nameLines.forEach(l=>{ l.style.transform = `translate(${x*4}px, ${y*3}px)`; });
                    // keep clip-path reveal not broken by transform — use inner
                    const inners = document.querySelectorAll('.hero-name-line .name-inner');
                    inners.forEach((inner,i)=>{ inner.style.transform = `translate(${x*(3+i)}px, ${y*2}px)`; });
                    if(desc) desc.style.transform = `translate(${x*1}px, ${y*1}px)`;
                });
            });
            heroLeft.addEventListener('mouseleave', ()=>{
                if(raf) cancelAnimationFrame(raf);
                if(eyebrow) eyebrow.style.transform = '';
                nameLines.forEach(l=> l.style.transform = '');
                document.querySelectorAll('.hero-name-line .name-inner').forEach(i=> i.style.transform = '');
                if(desc) desc.style.transform = '';
            });
        }

        // --- Scroll fade (tanpa blur berat untuk smooth 60fps) ---
        if(hero && heroLeft && !prefersReducedMotion){
            let ticking=false;
            let heroVisible=true;
            try{
                if('IntersectionObserver' in window){
                    const io2 = new IntersectionObserver((entries)=>{
                        entries.forEach(e=> heroVisible = e.isIntersecting);
                    }, {threshold:0});
                    io2.observe(hero);
                }
            }catch{}
            window.addEventListener('scroll', ()=>{
                if(!heroVisible) return;
                if(ticking) return;
                ticking=true;
                requestAnimationFrame(()=>{
                    const rect = hero.getBoundingClientRect();
                    if(rect.bottom < -80 || rect.top > window.innerHeight){ ticking=false; return; }
                    const prog = Math.min(Math.max(0, -rect.top / 480), 1);
                    if(prog>0.07){
                        heroLeft.classList.add('is-scrolled');
                        // hanya opacity + translate3d — blur dihapus karena sangat berat di scroll
                        heroLeft.style.opacity = String(1 - prog*0.45);
                        heroLeft.style.transform = `translate3d(0,${-prog*14}px,0)`;
                        // filter blur sengaja tidak dipakai agar scroll smooth
                    } else {
                        heroLeft.classList.remove('is-scrolled');
                        heroLeft.style.opacity = '';
                        heroLeft.style.transform = '';
                    }
                    ticking=false;
                });
            }, {passive:true});
        }

        // --- Hover FARHAN brighten ---
        if(farhan){
        }
    }

    // ============================================
    // SCROLL REVEAL
    // ============================================
    function initScrollReveal() {
        const revealElements = document.querySelectorAll('[data-scroll-reveal]');
        if (!revealElements.length) return;

        const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                    const counters = entry.target.querySelectorAll('[data-counter]');
                    counters.forEach(counter => {
                        animateCounter(counter);
                    });
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

        revealElements.forEach(el => observer.observe(el));
    }

    // ============================================
    // COUNTER ANIMATION
    // ============================================
    function animateCounter(element) {
        if (element.dataset.counted) return;
        element.dataset.counted = 'true';

        const numberElPre = element.querySelector('.stat-number');
        const rawTarget = numberElPre ? numberElPre.dataset.target : element.dataset.target;
        const target = parseInt(rawTarget, 10);
        if (Number.isNaN(target)) return;
        const duration = 2000;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);

            const numberEl = element.querySelector('.stat-number');
            if (numberEl) {
                numberEl.textContent = current;
            }

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                const numberEl = element.querySelector('.stat-number');
                if (numberEl) numberEl.textContent = target;
            }
        }

        requestAnimationFrame(updateCounter);
    }

    // ============================================
    // TERMINAL TYPING EFFECT
    // ============================================
    function initTerminalTyping() {
        const terminalSection = document.querySelector('.terminal-section');
        if (!terminalSection) return;

        let hasTyped = false;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasTyped) {
                    hasTyped = true;
                    typeTerminal();
                }
            });
        }, { threshold: 0.3 });

        observer.observe(terminalSection);

        function typeTerminal() {
            const lines = {
                termLine1: { text: '$ whoami', delay: 0 },
                termLine2: { text: '', delay: 600, html: (i) => {
                    const data = [
                        { cls: 'Nama:', val: ' Muhamad Farhan Muizaddin', highlight: false },
                        { cls: 'Peran:', val: ' Software Engineer', highlight: true },
                        { cls: 'Lokasi:', val: ' Kp. Situ RT003/002, Desa Sukaremi, Kec. Megamendung, Kab. Bogor', highlight: false },
                        { cls: 'Fokus:', val: ' Web Development', highlight: true },
                        { cls: 'Pendidikan:', val: ' SMK WIKRAMA 1 Garut — RPL (2019–2022)', highlight: false }
                    ];
                    let result = '';
                    data.forEach((item, idx) => {
                        result += `<span class="${item.cls.toLowerCase()}">${item.cls}</span> <span class="${item.highlight ? 'highlight' : 'info'}">${item.val}</span>`;
                        if (idx < data.length - 1) result += '\n';
                    });
                    return result;
                }},
                termLine3: { text: '', delay: 2000 },
                termLine4: { text: '$ skills', delay: 2500 },
                termLine5: { text: '', delay: 3100, html: (i) => {
                    return '<span class="info">HTML &nbsp; CSS &nbsp; JavaScript &nbsp; jQuery</span>\n<span class="info">PHP &nbsp; Laravel &nbsp; CodeIgniter &nbsp; Node.js &nbsp; Express.js &nbsp; MySQL</span>';
                }},
                termLine6: { text: '', delay: 4500 },
                termLine7: { text: '$ background', delay: 5000 },
                termLine8: { text: '', delay: 5600, html: (i) => {
                    return '<span class="info">Magang: leader front-end, arsitektur e-learning, API</span>\n<span class="info">Organisasi: Mudabbir &amp; Pramuka Ambalan Prabu Kiansantang</span>';
                }},
                termLine9: { text: '', delay: 7000 }
            };

            function typeLine(key, index) {
                const lineEl = document.getElementById(key);
                if (!lineEl) return;
                const data = lines[key];
                if (!data) return;

                setTimeout(() => {
                    if (data.html) {
                        lineEl.innerHTML = data.html(index);
                    } else if (data.text) {
                        const cursorSpan = lineEl.querySelector('.cursor-text');
                        if (cursorSpan) {
                            lineEl.textContent = '';
                            lineEl.appendChild(cursorSpan);
                        } else {
                            lineEl.textContent = data.text;
                        }
                    }
                    if (index === 8 && !lineEl.querySelector('.cursor-text')) {
                        const cursorSpan = document.createElement('span');
                        cursorSpan.className = 'cursor-text';
                        cursorSpan.textContent = '_';
                        lineEl.appendChild(cursorSpan);
                    }
                }, data.delay);
            }

            Object.keys(lines).forEach((key, i) => {
                typeLine(key, i);
            });
        }
    }

    // ============================================
    // CODE CARD TAB SWITCHING
    // ============================================
    function initCodeCard() {
        const codeWindow = document.getElementById('codeWindow');
        const codeContent = document.getElementById('codeContent');
        const codeTabs = document.querySelectorAll('.code-tab');

        if (!codeContent || !codeTabs.length) return;

        const codeSnippets = {
            javascript: `<span class="cm">// Software Engineer Portfolio</span>
<span class="cm">// Built with passion and precision</span>

<span class="kw">class</span> <span class="cls">Developer</span> <span class="op">{</span>
  <span class="kw">constructor</span><span class="op">(</span>name<span class="op">,</span> role<span class="op">){</span>
    <span class="kw">this</span><span class="op">.</span><span class="prop">name</span> <span class="op">=</span> name<span class="op">;</span>
    <span class="kw">this</span><span class="op">.</span><span class="prop">role</span> <span class="op">=</span> role<span class="op">;</span>
  <span class="op">}</span>

  <span class="fn">buildProject</span><span class="op">(</span>tech<span class="op">){</span>
    <span class="kw">return new</span> <span class="cls">Promise</span><span class="op">((</span>resolve<span class="op">))</span> <span class="op">=></span> <span class="op">{</span>
      console<span class="op">.</span><span class="fn">log</span><span class="op">(</span><span class="str">\`Building \${tech}...\`</span><span class="op">);</span>
      <span class="fn">resolve</span><span class="op">(</span><span class="bool">true</span><span class="op">);</span>
    <span class="op">});</span>
  <span class="op">}</span>

  <span class="fn">deploy</span><span class="op">()</span> <span class="op">{</span>
    <span class="kw">return this</span><span class="op">.</span><span class="fn">buildProject</span><span class="op">(</span><span class="str">"production"</span><span class="op">)</span>
      <span class="op">.</span><span class="fn">then</span><span class="op">(</span>r <span class="op">=></span> console<span class="op">.</span><span class="fn">log</span><span class="op">(</span><span class="str">"Deployed! ✨"</span><span class="op">));</span>
  <span class="op">}</span>
<span class="op">}</span>

<span class="kw">const</span> <span class="prop">me</span> <span class="op">=</span> <span class="kw">new</span> <span class="cls">Developer</span><span class="op">(</span><span class="str">"Muhamad Farhan Muizaddin"</span><span class="op">,</span> <span class="str">"Software Engineer"</span><span class="op">);</span>
me<span class="op">.</span><span class="fn">deploy</span><span class="op">();</span> <span class="cm">// Deployed! ✨</span>`,

            php: `<span class="cm">// API Endpoint Handler</span>
<span class="kw">class</span> <span class="cls">ApiController</span> <span class="op">{</span>
  <span class="kw">private</span> <span class="op">$</span><span class="prop">db</span><span class="op">;</span>

  <span class="kw">public function</span> <span class="fn">__construct</span><span class="op">(</span><span class="op">$</span><span class="prop">db</span><span class="op">){</span>
    <span class="kw">$this</span><span class="op">-></span><span class="prop">db</span> <span class="op">=</span> <span class="op">$</span><span class="prop">db</span><span class="op">;</span>
  <span class="op">}</span>

  <span class="kw">public function</span> <span class="fn">getUsers</span><span class="op">(){</span>
    <span class="op">$</span><span class="prop">stmt</span> <span class="op">=</span> <span class="kw">$this</span><span class="op">-></span><span class="prop">db</span><span class="op">-></span><span class="fn">prepare</span><span class="op">(</span>
      <span class="str">"SELECT * FROM users"</span>
    <span class="op">);</span>
    <span class="op">$</span><span class="prop">stmt</span><span class="op">-></span><span class="fn">execute</span><span class="op">();</span>
    <span class="kw">return</span> <span class="op">$</span><span class="prop">stmt</span><span class="op">-></span><span class="fn">fetchAll</span><span class="op">();</span>
  <span class="op">}</span>

  <span class="kw">public function</span> <span class="fn">createUser</span><span class="op">(</span><span class="op">$</span><span class="prop">data</span><span class="op">){</span>
    <span class="kw">return</span> <span class="op">$this</span><span class="op">-></span><span class="prop">db</span><span class="op">-></span><span class="fn">insert</span><span class="op">(</span><span class="str">'users'</span><span class="op">,</span> <span class="op">$</span><span class="prop">data</span><span class="op">);</span>
  <span class="op">}</span>
<span class="op">}</span>

<span class="cm">// Initialize and handle requests</span>
<span class="op">$</span><span class="prop">api</span> <span class="op">=</span> <span class="kw">new</span> <span class="cls">ApiController</span><span class="op">(</span><span class="op">$</span><span class="prop">pdo</span><span class="op">);</span>`,

            html: `<span class="cm">&lt;!-- Portfolio Section --&gt;</span>
<span class="kw">&lt;section</span> <span class="prop">class</span><span class="op">=</span><span class="str">"about"</span> <span class="prop">id</span><span class="op">=</span><span class="str">"about"</span><span class="kw">&gt;</span>
  <span class="kw">&lt;div</span> <span class="prop">class</span><span class="op">=</span><span class="str">"container"</span><span class="kw">&gt;</span>
    <span class="kw">&lt;h2</span> <span class="prop">class</span><span class="op">=</span><span class="str">"section-title"</span><span class="kw">&gt;</span>
      The Engineer Behind the Code
    <span class="kw">&lt;/h2&gt;</span>
    <span class="kw">&lt;div</span> <span class="prop">class</span><span class="op">=</span><span class="str">"about-grid"</span><span class="kw">&gt;</span>
      <span class="kw">&lt;div</span> <span class="prop">class</span><span class="op">=</span><span class="str">"profile-image"</span><span class="kw">&gt;</span>
        <span class="kw">&lt;img</span> <span class="prop">src</span><span class="op">=</span><span class="str">"profile.jpg"</span> <span class="prop">alt</span><span class="op">=</span><span class="str">"Profile"</span><span class="kw">/&gt;</span>
      <span class="kw">&lt;/div&gt;</span>
      <span class="kw">&lt;div</span> <span class="prop">class</span><span class="op">=</span><span class="str">"about-content"</span><span class="kw">&gt;</span>
        <span class="kw">&lt;p</span><span class="kw">&gt;</span>Software Engineer<span class="kw">&lt;/p&gt;</span>
        <span class="kw">&lt;button</span> <span class="prop">class</span><span class="op">=</span><span class="str">"btn"</span><span class="kw">&gt;</span>Lihat Proyeks<span class="kw">&lt;/button&gt;</span>
      <span class="kw">&lt;/div&gt;</span>
    <span class="kw">&lt;/div&gt;</span>
  <span class="kw">&lt;/div&gt;</span>
<span class="kw">&lt;/section&gt;</span>`
        };

        codeContent.innerHTML = codeSnippets.javascript;

        codeTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                codeTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const lang = tab.dataset.lang;
                codeContent.innerHTML = codeSnippets[lang] || codeSnippets.javascript;
            });
        });
    }

    // ============================================
    // TECH STACK
    // ============================================
    function initTechStack() {
        initTechBgCanvas();
        initTechCards();
        initSkillViz();
    }

    function initTechBgCanvas() {
        const canvas = document.getElementById('techBgCanvas');
        if (!canvas || prefersReducedMotion) return;
        const ctx = canvas.getContext('2d');
        if(!ctx) return;
        // skip entirely on very low-end to save battery
        if(isLowEnd && isMobile) return;
        let particles = [];
        let raf=null;
        let visible=true;
        const dpr = Math.min(window.devicePixelRatio||1, 1.2);

        function resize() {
            const rect = canvas.parentElement.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            canvas.style.width = rect.width + 'px';
            canvas.style.height = rect.height + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            create();
        }
        function create() {
            particles = [];
            const w = canvas.width / dpr;
            const h = canvas.height / dpr;
            const count = isMobile ? 10 : (isLowEnd ? 14 : 20);
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    r: Math.random() * 1.4 + 0.3,
                    vx: (Math.random() - 0.5) * 0.22,
                    vy: (Math.random() - 0.5) * 0.22,
                    o: Math.random() * 0.32 + 0.1
                });
            }
        }
        function draw() {
            if(!visible || document.hidden){ raf=null; return; }
            const w = canvas.width / dpr;
            const h = canvas.height / dpr;
            ctx.clearRect(0, 0, w, h);
            for(let i=0;i<particles.length;i++){
                const p=particles[i];
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
                if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0,240,255,${p.o})`;
                ctx.fill();
            }
            raf = requestAnimationFrame(draw);
        }
        resize();
        if (!prefersReducedMotion) draw();
        let t;
        window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(resize, 150); }, {passive:true});
        try{
            if('IntersectionObserver' in window){
                const io = new IntersectionObserver((entries)=>{
                    entries.forEach(e=>{
                        visible = e.isIntersecting;
                        if(visible && !raf && !prefersReducedMotion) draw();
                        else if(!visible && raf){ cancelAnimationFrame(raf); raf=null; }
                    });
                }, {threshold:0});
                const sec=document.getElementById('skills');
                if(sec) io.observe(sec);
            }
        }catch{}
        document.addEventListener('visibilitychange', () => {
            if (document.hidden){ if(raf){ cancelAnimationFrame(raf); raf=null; } }
            else if (visible && !raf && !prefersReducedMotion) draw();
        });
    }

    function initTechCards() {
        const cards = document.querySelectorAll('.tech-card');
        if (!cards.length) return;

        // reveal
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    obs.unobserve(e.target);
                }
            });
        }, { threshold: 0.2 });
        cards.forEach(c => obs.observe(c));

        if (isMobile || prefersReducedMotion || isLowEnd) return;

        cards.forEach(card => {
            const inner = card.querySelector('.tech-card-inner');
            if (!inner) return;
            let raf = null;
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const cx = rect.width / 2;
                const cy = rect.height / 2;
                const rotY = ((x - cx) / cx) * 8;
                const rotX = -((y - cy) / cy) * 8;
                if (raf) cancelAnimationFrame(raf);
                raf = requestAnimationFrame(() => {
                    inner.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(8px)`;
                });
            });
            card.addEventListener('mouseleave', () => {
                if (raf) cancelAnimationFrame(raf);
                inner.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateZ(0)';
            });
        });

        // custom cursor hover
        cards.forEach(c => {
        });
    }

    function initSkillViz() {
        const viz = document.getElementById('skillViz');
        const svg = document.getElementById('skillVizSvg');
        const nodesWrap = document.getElementById('skillNodes');
        const tooltip = document.getElementById('skillTooltip');
        if (!viz || !svg || !nodesWrap) return;

        const categories = [
            { id: 'Frontend', label: 'Frontend', icon: 'fa-code', desc: 'HTML • CSS • JavaScript • jQuery', count: '4 teknologi', color: '#00f0ff' },
            { id: 'Backend', label: 'Backend', icon: 'fa-server', desc: 'PHP • Laravel • CodeIgniter • Node.js • Express.js', count: '5 teknologi', color: '#7b2fff' },
            { id: 'Database', label: 'Database', icon: 'fa-database', desc: 'MySQL • phpMyAdmin', count: '2 teknologi', color: '#2ecc71' },
            { id: 'API', label: 'API', icon: 'fa-plug', desc: 'RESTful API • Sanctum • Passport • Integration', count: '4 kemampuan', color: '#ffd700' },
            { id: 'UI/UX', label: 'UI/UX', icon: 'fa-palette', desc: 'Implementasi desain UI/UX', count: 'Implementasi', color: '#ff7ab6' },
            { id: 'Arsitektur', label: 'Arsitektur', icon: 'fa-diagram-project', desc: 'System Architecture • CRUD • Authentication', count: '3 fondasi', color: '#ff006e' }
        ];

        const center = { x: 400, y: 250, id: 'center', label: 'SOFTWARE<br>ENGINEER', plainLabel: 'Software Engineer', icon: 'fa-infinity', desc: 'Web development end-to-end' };
        const isCoarse = window.matchMedia('(hover: none), (pointer: coarse)').matches;

        // layout calc — visual space (px) dihitung dulu, lalu dikonversi ke viewBox 800x500
        // agar jarak antar node aman di HP (preserveAspectRatio=none meregangkan sumbu)
        function getLayout() {
            const vw = window.innerWidth;
            const isNarrow = vw < 769;
            const vizEl = document.getElementById('skillViz');
            const cw = (vizEl && vizEl.clientWidth) || vw || 800;
            const ch = (vizEl && vizEl.clientHeight) || 500;

            // ukuran node (sesuai CSS breakpoint)
            let centerPx = 118, catPx = 92;
            if (vw <= 375) { centerPx = 72; catPx = 64; }
            else if (vw <= 480) { centerPx = 84; catPx = 72; }
            else if (isNarrow) { centerPx = 96; catPx = 78; }

            // jarak minimum visual antara pusat dan node kategori
            const minDist = (centerPx / 2) + (catPx / 2) + 16;
            const pad = (catPx / 2) + 8;
            const tooltipPad = isNarrow ? 64 : 12; // ruang tooltip bawah di HP

            // elips dalam pixel container
            const cxV = cw / 2;
            const cyV = isNarrow
                ? Math.max(pad + minDist, (ch - tooltipPad) * 0.42)
                : ch / 2;
            let rxV = Math.max(minDist, cw / 2 - pad);
            let ryV = Math.max(minDist, Math.min(
                isNarrow ? (ch - tooltipPad) * 0.34 : ch * 0.35,
                cyV - pad,
                (ch - tooltipPad) - cyV
            ));
            // pastikan atas/bawah tidak menabrak center
            ryV = Math.max(ryV, minDist);

            // konversi px → viewBox
            const sx = 800 / cw;
            const sy = 500 / ch;
            const cx = cxV * sx;
            const cy = cyV * sy;
            const rx = rxV * sx;
            const ry = ryV * sy;

            const positions = [];
            categories.forEach((cat, i) => {
                const angle = (-90 + i * 60) * Math.PI / 180;
                const x = cx + Math.cos(angle) * rx;
                const y = cy + Math.sin(angle) * ry;
                positions.push({ ...cat, x, y, angle });
            });
            return { cx, cy, positions, isNarrow, rx, ry };
        }

        let layout = getLayout();
        let lineEls = [];
        let particleEls = [];

        function build() {
            nodesWrap.innerHTML = '';
            svg.innerHTML = '';
            lineEls = [];
            particleEls = [];
            layout = getLayout();

            // lines center -> each cat
            categories.forEach((cat, i) => {
                const pos = layout.positions[i];
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', layout.cx);
                line.setAttribute('y1', layout.cy);
                line.setAttribute('x2', pos.x);
                line.setAttribute('y2', pos.y);
                line.setAttribute('class', 'viz-line');
                line.dataset.cat = cat.id;
                svg.appendChild(line);
                lineEls.push(line);

                const p = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                p.setAttribute('r', '3.2');
                p.setAttribute('class', 'viz-particle');
                p.dataset.cat = cat.id;
                p.style.opacity = '0';
                svg.appendChild(p);
                particleEls.push({ el: p, idx: i, progress: Math.random() });
            });

            // optional inter-cat faint lines for extra depth (Frontend-Backend etc) - subtle
            // add ring circle
            const ring = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
            ring.setAttribute('cx', layout.cx);
            ring.setAttribute('cy', layout.cy);
            ring.setAttribute('rx', layout.rx);
            ring.setAttribute('ry', layout.ry);
            ring.setAttribute('fill', 'none');
            ring.setAttribute('stroke', 'rgba(255,255,255,0.04)');
            ring.setAttribute('stroke-width', '1');
            ring.setAttribute('stroke-dasharray', '4 8');
            svg.insertBefore(ring, svg.firstChild);

            // center node
            const centerEl = createNode(center, layout.cx, layout.cy, true);
            nodesWrap.appendChild(centerEl);

            // cat nodes
            layout.positions.forEach((pos) => {
                const el = createNode(pos, pos.x, pos.y, false);
                el.style.left = pos.x + 'px';
                el.style.top = pos.y + 'px';
                // convert svg viewBox coords to % for positioning (viewBox 800x500 maps to 100%)
                el.style.left = (pos.x / 800 * 100) + '%';
                el.style.top = (pos.y / 500 * 100) + '%';
                el.dataset.cat = pos.id;
                el.setAttribute('tabindex', '0');
                el.setAttribute('aria-label', pos.label);
                nodesWrap.appendChild(el);
            });

            bindHover();
        }

        function createNode(data, x, y, isCenter) {
            const div = document.createElement('div');
            div.className = isCenter ? 'skill-node skill-node-center' : 'skill-node skill-node-cat';
            if (!isCenter) div.dataset.cat = data.id;
            if (isCenter) div.setAttribute('aria-label', data.plainLabel || 'Software Engineer');
            div.innerHTML = `
                <span class="node-pulse" style="--pulse-delay:${Math.random()*1.2}s"></span>
                <i class="fas ${data.icon} node-icon" aria-hidden="true"></i>
                <span class="node-label">${data.label}</span>
                ${!isCenter ? `<span class="node-count">${data.count}</span>` : ''}
            `;
            if (isCenter) {
                div.style.left = (x/800*100)+'%';
                div.style.top = (y/500*100)+'%';
            }
            // cursor hover
            return div;
        }

        function bindHover() {
            const catNodes = nodesWrap.querySelectorAll('.skill-node-cat');
            const hideAll = () => {
                lineEls.forEach(l => l.classList.remove('active'));
                catNodes.forEach(n => n.classList.remove('active'));
                const centerNodeAll = nodesWrap.querySelector('.skill-node-center');
                if (centerNodeAll) centerNodeAll.classList.remove('active');
                if (tooltip) {
                    tooltip.classList.remove('visible');
                    tooltip.setAttribute('aria-hidden', 'true');
                }
                particleEls.forEach(p => p.el.style.opacity = '0');
            };
            const showCat = (cat) => {
                lineEls.forEach(l => l.classList.toggle('active', l.dataset.cat === cat));
                catNodes.forEach(n => n.classList.toggle('active', n.dataset.cat === cat));
                const centerActive = nodesWrap.querySelector('.skill-node-center');
                if (centerActive) centerActive.classList.remove('active');
                const data = categories.find(c => c.id === cat);
                if (data && tooltip) {
                    tooltip.querySelector('.tooltip-category').textContent = data.id;
                    tooltip.querySelector('.tooltip-title').textContent = data.label;
                    tooltip.querySelector('.tooltip-desc').textContent = data.desc;
                    tooltip.classList.add('visible');
                    tooltip.setAttribute('aria-hidden', 'false');
                }
                particleEls.forEach(p => {
                    p.el.style.opacity = p.el.dataset.cat === cat ? '1' : '0';
                });
            };

            catNodes.forEach(node => {
                const cat = node.dataset.cat;
                if (isCoarse) {
                    // HP / tablet: ketuk untuk toggle
                    node.addEventListener('click', (e) => {
                        e.stopPropagation();
                        if (node.classList.contains('active')) hideAll();
                        else showCat(cat);
                    });
                } else {
                    node.addEventListener('mouseenter', () => showCat(cat));
                    node.addEventListener('mouseleave', hideAll);
                }
                node.addEventListener('focus', () => showCat(cat));
                node.addEventListener('blur', hideAll);
            });

            // center — nyalakan semua garis
            const centerNode = nodesWrap.querySelector('.skill-node-center');
            if (centerNode) {
                const showCenter = () => {
                    lineEls.forEach(l => l.classList.add('active'));
                    catNodes.forEach(n => n.classList.remove('active'));
                    if (tooltip) {
                        tooltip.querySelector('.tooltip-category').textContent = 'CORE';
                        tooltip.querySelector('.tooltip-title').textContent = 'Software Engineer Core';
                        tooltip.querySelector('.tooltip-desc').textContent = 'Menghubungkan frontend, backend, API, dan database';
                        tooltip.classList.add('visible');
                        tooltip.setAttribute('aria-hidden', 'false');
                    }
                };
                if (isCoarse) {
                    centerNode.addEventListener('click', (e) => {
                        e.stopPropagation();
                        if (tooltip && tooltip.classList.contains('visible') &&
                            !centerNode.classList.contains('active') &&
                            !nodesWrap.querySelector('.skill-node-cat.active')) {
                            // sudah terbuka dari node lain — toggle mati
                            hideAll();
                        } else {
                            centerNode.classList.add('active');
                            showCenter();
                        }
                    });
                } else {
                    centerNode.addEventListener('mouseenter', showCenter);
                    centerNode.addEventListener('mouseleave', hideAll);
                }
                centerNode.addEventListener('focus', showCenter);
                centerNode.addEventListener('blur', hideAll);
            }

            // ketuk area luar node untuk menutup (khusus touch)
            if (isCoarse) {
                viz.addEventListener('click', (e) => {
                    if (!e.target.closest('.skill-node')) hideAll();
                });
            }
        }
        // animate particles along lines — optimized + pause offscreen
        let raf=null;
        let vizVisible=true;
        function animateParticles() {
            if (prefersReducedMotion) {
                particleEls.forEach(p => p.el.style.opacity = '0.5');
                return;
            }
            const speed = isLowEnd ? 0.0022 : 0.0032;
            function frame() {
                if(!vizVisible || document.hidden){ raf=null; return; }
                for(let idx=0; idx<particleEls.length; idx++){
                    const p = particleEls[idx];
                    p.progress += speed * (0.7 + Math.random()*0.5);
                    if (p.progress > 1) p.progress = 0;
                    const line = lineEls[p.idx];
                    if (!line) continue;
                    const x1 = parseFloat(line.getAttribute('x1'));
                    const y1 = parseFloat(line.getAttribute('y1'));
                    const x2 = parseFloat(line.getAttribute('x2'));
                    const y2 = parseFloat(line.getAttribute('y2'));
                    const x = x1 + (x2 - x1) * p.progress;
                    const y = y1 + (y2 - y1) * p.progress;
                    p.el.setAttribute('cx', x);
                    p.el.setAttribute('cy', y);
                    const fade = Math.sin(p.progress * Math.PI);
                    p.el.style.opacity = String(0.2 + fade * 0.8);
                }
                raf = requestAnimationFrame(frame);
            }
            frame();
        }

        build();
        // observe visibility for skill viz
        try{
            if('IntersectionObserver' in window){
                const ioViz = new IntersectionObserver((entries)=>{
                    entries.forEach(e=>{
                        vizVisible=e.isIntersecting;
                        if(vizVisible && !raf) animateParticles();
                        else if(!vizVisible && raf){ cancelAnimationFrame(raf); raf=null; }
                    });
                }, {threshold:0.08});
                ioViz.observe(viz);
            }
        }catch{}
        animateParticles();

        // parallax on mouse move for nodes (desktop only) — throttled
        if (!isMobile && !prefersReducedMotion && !isLowEnd) {
            let rafM=null;
            let mx=0, my=0;
            viz.addEventListener('mousemove', (e) => {
                const rect = viz.getBoundingClientRect();
                mx = (e.clientX - rect.left) / rect.width - 0.5;
                my = (e.clientY - rect.top) / rect.height - 0.5;
                if(rafM) return;
                rafM = requestAnimationFrame(()=>{
                    rafM=null;
                    nodesWrap.querySelectorAll('.skill-node').forEach((n, i) => {
                        const depth = n.classList.contains('skill-node-center') ? 6 : 10 + (i % 3) * 4;
                        n.style.transform = `translate(-50%, -50%) translate(${mx * depth}px, ${my * depth}px) ${n.classList.contains('active') ? 'scale(1.14)' : ''}`;
                    });
                    svg.style.transform = `translate(${mx * -8}px, ${my * -6}px)`;
                });
            }, {passive:true});
            viz.addEventListener('mouseleave', () => {
                if(rafM){ cancelAnimationFrame(rafM); rafM=null; }
                nodesWrap.querySelectorAll('.skill-node').forEach(n => {
                    n.style.transform = 'translate(-50%, -50%)';
                });
                svg.style.transform = 'translate(0,0)';
            }, {passive:true});
        }

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                cancelAnimationFrame(raf);
                build();
                animateParticles();
            }, 200);
        });

        // pause when hidden
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) cancelAnimationFrame(raf);
            else if (!prefersReducedMotion) animateParticles();
        });
    }

    // ============================================
    // PROJECTS
    // ============================================
    const gradientMap = {
        'gradient-a': 'linear-gradient(135deg, #00f0ff 0%, #7b2fff 55%, #ff006e 100%)',
        'gradient-b': 'linear-gradient(135deg, #ff7ab6 0%, #7b2fff 50%, #00f0ff 100%)',
        'gradient-c': 'linear-gradient(135deg, #00d38d 0%, #00a6ff 55%, #7b2fff 100%)',
        'gradient-d': 'linear-gradient(135deg, #ffd166 0%, #ff7a00 50%, #ff006e 100%)',
        'gradient-e': 'linear-gradient(135deg, #5ef2ff 0%, #3a5bff 55%, #1a1a40 100%)',
        'gradient-f': 'linear-gradient(135deg, #7b2fff 0%, #00f0ff 60%, #2ecc71 100%)'
    };

    function initProjects() {
        const featuredWrap = document.getElementById('featuredProject');
        const grid = document.getElementById('projectsGrid');
        if (!featuredWrap || !grid) return;

        const featured = projectsData.find(p => p.featured) || projectsData[0];
        const others = projectsData.filter(p => p.id !== featured.id);

        // render featured
        featuredWrap.innerHTML = renderFeatured(featured);
        // render grid
        const spans = ['span-7','span-5','span-5','span-7','span-12'];
        grid.innerHTML = others.map((p, i) => renderCard(p, spans[i % spans.length], i)).join('');

        // reveal + tilt
        const revealEls = document.querySelectorAll('.featured-project, .project-card');
        const ro = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    e.target.style.transitionDelay = (e.target.dataset.delay || '0s');
                    ro.unobserve(e.target);
                }
            });
        }, { threshold: 0.16 });
        revealEls.forEach((el, idx) => {
            el.dataset.delay = (idx * 0.07) + 's';
            ro.observe(el);
        });

        if (!isMobile && !prefersReducedMotion && !isLowEnd) {
            document.querySelectorAll('.featured-project, .project-card').forEach(card => {
                let raf = null;
                const innerHover = card; // transform card itself
                card.addEventListener('mousemove', (e) => {
                    const r = card.getBoundingClientRect();
                    const cx = r.left + r.width/2;
                    const cy = r.top + r.height/2;
                    const dx = (e.clientX - cx) / (r.width/2);
                    const dy = (e.clientY - cy) / (r.height/2);
                    if (raf) cancelAnimationFrame(raf);
                    raf = requestAnimationFrame(() => {
                        card.style.transform = `perspective(900px) rotateY(${dx * 6}deg) rotateX(${-dy * 6}deg) translateY(-4px)`;
                    });
                });
                card.addEventListener('mouseleave', () => {
                    if (raf) cancelAnimationFrame(raf);
                    card.style.transform = 'perspective(900px) rotateY(0) rotateX(0) translateY(0)';
                });
            });
        }

        // click handlers
        document.querySelectorAll('[data-project-id]').forEach(el => {
            el.addEventListener('click', (e) => {
                // prevent link navigation when project card clicked but github/demo clicked
                if (e.target.closest('.card-link') || e.target.closest('.featured-actions a') || e.target.closest('.card-footer a')) return;
                const id = el.dataset.projectId;
                openProjectModal(id);
            });
            el.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openProjectModal(el.dataset.projectId); }
            });
            // cursor
        });

        initProjectsCanvas();
    }

    function projectBg(p) {
        if (p.image && (p.image.indexOf('/') !== -1 || /\.(png|jpe?g|webp|gif|svg)$/i.test(p.image))) {
            return `url('${p.image}') center/cover no-repeat`;
        }
        return gradientMap[p.image] || gradientMap['gradient-a'];
    }

    function isImagePath(img) {
        return !!(img && (img.indexOf('/') !== -1 || /\.(png|jpe?g|webp|gif|svg)$/i.test(img)));
    }

    function renderFeatured(p) {
        const bg = projectBg(p);
        const hasImage = isImagePath(p.image);
        const techs = p.technologies.map((t,i) => `<span class="tech-pill ${i<3?'highlight':''}">${t}</span>`).join('');
        return `
        <article class="featured-project" data-project-id="${p.id}" tabindex="0" aria-label="View ${p.title} details" role="button">
            <div class="featured-preview">
                <div class="browser-bar">
                    <div class="browser-dots"><span></span><span></span><span></span></div>
                    <div class="browser-url"><i class="fas fa-lock"></i> ${p.urlLabel || (p.id + '.vercel.app — Pratinjau')}</div>
                </div>
                <div class="preview-stage">
                    <div class="preview-bg" style="background:${bg}"></div>
                    ${hasImage ? '' : `<div class="preview-icon-wrap"><i class="fas ${p.icon}"></i></div>`}
                    <div class="preview-overlay"><span><i class="fas fa-eye"></i> Lihat Studi Kasus</span></div>
                </div>
            </div>
            <div class="featured-info">
                <span class="featured-badge"><i class="fas fa-star"></i> UNGGULAN • ${p.year}</span>
                <h3 class="featured-title">${p.title}</h3>
                <p class="featured-desc">${p.description}</p>
                <div class="featured-techs">${techs}</div>
                <div class="featured-actions">
                    ${p.demo && p.demo !== '#' ? `<a href="${p.demo}" class="btn-solid-sm" target="_blank" rel="noopener" onclick="event.stopPropagation()"><i class="fas fa-external-link-alt"></i> Live Demo</a>` : `<a href="${p.github}" class="btn-solid-sm" target="_blank" rel="noopener" onclick="event.stopPropagation()"><i class="fas fa-eye"></i> View Project</a>`}
                    <a href="${p.github}" class="btn-ghost" target="_blank" rel="noopener" onclick="event.stopPropagation()"><i class="fab fa-github"></i> GitHub</a>
                    <button class="btn-ghost" data-open-modal="${p.id}" aria-label="Open details"><i class="fas fa-arrow-right"></i> Details</button>
                </div>
            </div>
        </article>`;
    }

    function renderCard(p, spanClass, index) {
        const bg = projectBg(p) || gradientMap['gradient-b'];
        const techs = p.technologies.slice(0,3).map(t => `<span class="tech-pill">${t}</span>`).join('');
        const extra = p.technologies.length > 3 ? `<span class="tech-pill">+${p.technologies.length-3}</span>` : '';
        return `
        <article class="project-card ${spanClass}" data-project-id="${p.id}" tabindex="0" role="button" aria-label="View ${p.title} details">
            <div class="card-preview">
                <div class="card-preview-bg" style="background:${bg}"></div>
                ${isImagePath(p.image) ? '' : `<div class="card-preview-icon"><i class="fas ${p.icon}"></i></div>`}
                <div class="card-overlay"><span><i class="fas fa-eye"></i> Lihat Proyek</span></div>
            </div>
            <div class="card-body">
                <span class="card-eyebrow">${p.category} • ${p.year}</span>
                <h3 class="card-title">${p.title}</h3>
                <p class="card-desc">${p.description}</p>
                <div class="card-techs">${techs}${extra}</div>
                <div class="card-footer">
                    <button class="card-cta">Lihat detail <i class="fas fa-arrow-right"></i></button>
                    <div class="card-links">
                        ${p.github && p.github !== '#' ? `<a href="${p.github}" class="card-link" target="_blank" rel="noopener" aria-label="GitHub" onclick="event.stopPropagation()"><i class="fab fa-github"></i></a>` : ''}
                        ${p.demo && p.demo !== '#' ? `<a href="${p.demo}" class="card-link" target="_blank" rel="noopener" aria-label="Live demo" onclick="event.stopPropagation()"><i class="fas fa-external-link-alt"></i></a>` : ''}
                    </div>
                </div>
            </div>
            <div class="card-glow"></div>
        </article>`;
    }

    function initProjectsCanvas() {
        const canvas = document.getElementById('projectsCanvas');
        if (!canvas || prefersReducedMotion) return;
        const ctx = canvas.getContext('2d');
        if(!ctx) return;
        if(isLowEnd && isMobile) return;
        let particles = [];
        let raf=null;
        let visible=true;
        const dpr = Math.min(window.devicePixelRatio||1, 1.2);
        function resize() {
            const rect = canvas.parentElement.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            canvas.style.width = rect.width + 'px';
            canvas.style.height = rect.height + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            create();
        }
        function create() {
            particles = [];
            const w = canvas.width / dpr;
            const h = canvas.height / dpr;
            const count = isMobile ? 8 : (isLowEnd ? 12 : 16);
            for (let i=0;i<count;i++) particles.push({ x: Math.random()*w, y: Math.random()*h, r: Math.random()*1.2+0.3, vx:(Math.random()-0.5)*0.2, vy:(Math.random()-0.5)*0.2, o: Math.random()*0.28+0.08, c: Math.random()>0.5?'0,240,255':'123,47,255' });
        }
        function draw() {
            if(!visible || document.hidden){ raf=null; return; }
            const w = canvas.width / dpr;
            const h = canvas.height / dpr;
            ctx.clearRect(0,0,w,h);
            for(let i=0;i<particles.length;i++){ const p=particles[i]; p.x+=p.vx; p.y+=p.vy; if(p.x<0)p.x=w; if(p.x>w)p.x=0; if(p.y<0)p.y=h; if(p.y>h)p.y=0; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle=`rgba(${p.c},${p.o})`; ctx.fill(); }
            raf=requestAnimationFrame(draw);
        }
        resize(); draw();
        let t; window.addEventListener('resize', ()=>{ clearTimeout(t); t=setTimeout(resize,150); }, {passive:true});
        try{
            if('IntersectionObserver' in window){
                const io = new IntersectionObserver((entries)=>{
                    entries.forEach(e=>{
                        visible=e.isIntersecting;
                        if(visible && !raf && !prefersReducedMotion) draw();
                        else if(!visible && raf){ cancelAnimationFrame(raf); raf=null; }
                    });
                }, {threshold:0});
                const sec=document.getElementById('projects');
                if(sec) io.observe(sec);
            }
        }catch{}
        document.addEventListener('visibilitychange', ()=>{ if(document.hidden){ if(raf){ cancelAnimationFrame(raf); raf=null; } } else if(visible && !raf && !prefersReducedMotion) draw(); });
    }

    // Modal logic
    let lastFocus = null;
    function openProjectModal(id) {
        const data = projectsData.find(p => p.id === id);
        if (!data) return;
        const modal = document.getElementById('projectModal');
        const content = document.getElementById('modalContent');
        if (!modal || !content) return;
        const bg = projectBg(data);
        content.innerHTML = `
            <div class="modal-hero">
                <div class="modal-hero-bg" style="background:${bg}"></div>
                <div class="modal-hero-overlay"></div>
                <div class="modal-hero-content">
                    <span class="modal-badge"><i class="fas ${data.icon}"></i> ${data.category} • ${data.year}</span>
                    <h3 id="modalTitle">${data.title}</h3>
                    <p id="modalSubtitle">${data.longDescription}</p>
                </div>
            </div>
            <div class="modal-body">
                <div class="modal-section">
                    <h4><i class="fas fa-align-left"></i> Tentang Proyek</h4>
                    <p style="color:var(--text-secondary); line-height:1.7; font-size:0.94rem;">${data.description} ${data.longDescription}</p>
                </div>
                <div class="modal-section">
                    <h4><i class="fas fa-circle-info"></i> Detail Proyek</h4>
                    <div class="modal-meta">
                        <div class="modal-meta-row"><span>Project</span><strong>${data.title}</strong></div>
                        ${data.role ? `<div class="modal-meta-row"><span>Role</span><strong>${data.role}</strong></div>` : ''}
                        ${data.type ? `<div class="modal-meta-row"><span>Type</span><strong>${data.type}</strong></div>` : ''}
                        <div class="modal-meta-row"><span>Technology</span><strong>${data.technologies.join(', ')}</strong></div>
                        ${data.github && data.github !== '#' ? `<div class="modal-meta-row"><span>Repository</span><strong><a href="${data.github}" target="_blank" rel="noopener">GitHub</a></strong></div>` : ''}
                    </div>
                </div>
                <div class="modal-section">
                    <h4><i class="fas fa-list-check"></i> Fitur Utama</h4>
                    <ul class="modal-features">${data.features.map(f=>`<li>${f}</li>`).join('')}</ul>
                </div>
                <div class="modal-section">
                    <h4><i class="fas fa-layer-group"></i> Teknologi</h4>
                    <div class="modal-techs">${data.technologies.map(t=>`<span class="tech-pill highlight">${t}</span>`).join('')}</div>
                </div>
                <div class="challenge-grid">
                    <div class="challenge-card">
                        <h5 class="challenge"><i class="fas fa-triangle-exclamation"></i> Tantangan</h5>
                        <p>${data.challenges}</p>
                    </div>
                    <div class="challenge-card">
                        <h5 class="solution"><i class="fas fa-lightbulb"></i> Solusi</h5>
                        <p>${data.solutions}</p>
                    </div>
                </div>
                <div class="modal-actions">
                    ${data.demo && data.demo !== '#' ? `<a href="${data.demo}" target="_blank" rel="noopener" class="btn-solid-sm"><i class="fas fa-external-link-alt"></i> Demo Langsung</a>` : ''}
                    ${data.github && data.github !== '#' ? `<a href="${data.github}" target="_blank" rel="noopener" class="btn-solid-sm"><i class="fab fa-github"></i> Lihat di GitHub</a>` : ''}
                </div>
            </div>
        `;
        lastFocus = document.activeElement;
        modal.classList.add('open');
        modal.setAttribute('aria-hidden','false');
        document.body.classList.add('modal-open');
        // focus close btn
        setTimeout(()=> document.getElementById('modalClose')?.focus(), 60);
        // trap
        document.addEventListener('keydown', handleModalKey);
    }

    function closeProjectModal() {
        const modal = document.getElementById('projectModal');
        if (!modal) return;
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden','true');
        document.body.classList.remove('modal-open');
        document.removeEventListener('keydown', handleModalKey);
        if (lastFocus) lastFocus.focus();
    }

    function handleModalKey(e) {
        if (e.key === 'Escape') closeProjectModal();
        if (e.key === 'Tab') {
            const modal = document.getElementById('projectModal');
            if (!modal || !modal.classList.contains('open')) return;
            const focusable = modal.querySelectorAll('a[href], button, [tabindex]:not([tabindex="-1"])');
            if (!focusable.length) return;
            const first = focusable[0], last = focusable[focusable.length-1];
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
    }

    function initProjectModalEvents() {
        const modal = document.getElementById('projectModal');
        const backdrop = document.getElementById('modalBackdrop');
        const closeBtn = document.getElementById('modalClose');
        if (!modal) return;
        backdrop?.addEventListener('click', closeProjectModal);
        closeBtn?.addEventListener('click', closeProjectModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeProjectModal();
        });
    }

    // ============================================
    // EXPERIENCE TIMELINE
    // ============================================
    function initExperience() {
        const exp = document.getElementById('experience');
        const timeline = document.getElementById('timeline');
        const progress = document.getElementById('timelineProgress');
        const items = document.querySelectorAll('.tl-item');
        const expCanvas = document.getElementById('expCanvas');
        if (!exp || !timeline || !progress) return;

        // subtle particles bg — dikurangi & pause offscreen
        if (expCanvas && !prefersReducedMotion && !(isLowEnd && isMobile)) {
            const ctx = expCanvas.getContext('2d');
            if(!ctx) {/* skip */}
            else {
                let particles = [], raf=null;
                let expVisible=true;
                const dprExp = Math.min(window.devicePixelRatio||1, 1.2);
                function resize() {
                    const r = expCanvas.parentElement.getBoundingClientRect();
                    expCanvas.width = r.width * dprExp;
                    expCanvas.height = r.height * dprExp;
                    expCanvas.style.width = r.width + 'px';
                    expCanvas.style.height = r.height + 'px';
                    ctx.setTransform(dprExp, 0, 0, dprExp, 0, 0);
                    particles = [];
                    const count = isMobile ? 7 : (isLowEnd ? 10 : 14);
                    const w = r.width, h = r.height;
                    for (let i=0;i<count;i++) particles.push({x:Math.random()*w, y:Math.random()*h, r:Math.random()*1.1+0.25, vx:(Math.random()-0.5)*0.16, vy:(Math.random()-0.5)*0.16, o:Math.random()*0.20+0.06});
                }
                function draw() {
                    if(!expVisible || document.hidden){ raf=null; return; }
                    const w = expCanvas.width/dprExp, h = expCanvas.height/dprExp;
                    ctx.clearRect(0,0,w,h);
                    for(let i=0;i<particles.length;i++){ const p=particles[i]; p.x+=p.vx; p.y+=p.vy; if(p.x<0)p.x=w; if(p.x>w)p.x=0; if(p.y<0)p.y=h; if(p.y>h)p.y=0; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle=`rgba(123,47,255,${p.o})`; ctx.fill(); }
                    raf=requestAnimationFrame(draw);
                }
                resize(); draw();
                let t; window.addEventListener('resize',()=>{clearTimeout(t); t=setTimeout(resize,150);}, {passive:true});
                try{
                    if('IntersectionObserver' in window){
                        const ioE = new IntersectionObserver((entries)=>{
                            entries.forEach(e=>{
                                expVisible=e.isIntersecting;
                                if(expVisible && !raf) draw();
                                else if(!expVisible && raf){ cancelAnimationFrame(raf); raf=null; }
                            });
                        }, {threshold:0});
                        ioE.observe(exp);
                    }
                }catch{}
                document.addEventListener('visibilitychange',()=>{ if(document.hidden){ if(raf){ cancelAnimationFrame(raf); raf=null; } } else if(expVisible && !raf) draw(); });
            }
        }

        // observer for items
        const io = new IntersectionObserver((entries)=>{
            entries.forEach(e=>{
                if(e.isIntersecting){
                    e.target.classList.add('visible');
                    e.target.classList.add('active');
                    // cursor hover
                }
            });
        },{threshold:0.2, rootMargin:'0px 0px -40px 0px'});
        items.forEach(it=>io.observe(it));

        // progress line on scroll — throttled + hanya saat timeline terlihat
        let ticking=false;
        let timelineVisible=true;
        try{
            if('IntersectionObserver' in window){
                const ioT = new IntersectionObserver((entries)=>{
                    entries.forEach(e=> timelineVisible=e.isIntersecting);
                }, {threshold:0});
                ioT.observe(exp);
            }
        }catch{}
        function updateProgress(){
            if(!timelineVisible){ ticking=false; return; }
            const rect = timeline.getBoundingClientRect();
            if(rect.bottom < -120 || rect.top > window.innerHeight + 200){ ticking=false; return; }
            const vh = window.innerHeight;
            const total = rect.height;
            const start = rect.top - vh*0.6;
            const scrolled = Math.min(Math.max(0, -start), total + (vh*0.2));
            const pct = Math.min(1, Math.max(0, scrolled / (total + vh*0.1)));
            // gunakan transform scaleY lebih murah dari height — responsive left
            const isMobileTl = window.innerWidth <= 900;
            progress.style.transform = isMobileTl ? `scaleY(${pct})` : `translateX(-50%) scaleY(${pct})`;
            progress.style.transformOrigin = 'top';
            // highlight active item — hanya jika timeline di viewport
            const centerY = vh * 0.5;
            let activeIdx = -1;
            // loop cuma jika visible
            for(let idx=0; idx<items.length; idx++){
                const r = items[idx].getBoundingClientRect();
                if(r.top < centerY && r.bottom > centerY*0.3){ activeIdx = idx; break; }
            }
            for(let i=0;i<items.length;i++) items[i].classList.toggle('active', i===activeIdx);
            ticking=false;
        }
        // set initial transform origin
        progress.style.transformOrigin='top';
        progress.style.willChange='transform';
        window.addEventListener('scroll', ()=>{
            if(!timelineVisible) return;
            if(!ticking){ requestAnimationFrame(updateProgress); ticking=true; }
        }, {passive:true});
        window.addEventListener('resize', updateProgress, {passive:true});
        updateProgress();
    }

    // ============================================
    // 3D LAB INTERACTIVE
    // ============================================
    function isWebGLAvailable() {
        try {
            const c = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
        } catch(e){ return false; }
    }

    function initLab3D() {
        const canvas = document.getElementById('labCanvas');
        const fallback = document.getElementById('labFallback');
        const section = document.getElementById('lab');
        if (!canvas || !section) return;

        if (prefersReducedMotion && false) { /* keep 3D but reduced */ }

        if (!isWebGLAvailable() || typeof THREE === 'undefined') {
            canvas.style.display='none';
            if(fallback) fallback.hidden=false;
            return;
        }

        // mobile quality reduction — capped for 60fps, kurangi lebih agresif
        const lowQuality = isLowEnd || isMobile;
        const pixelRatio = Math.min(perfPixelRatio, lowQuality ? 1 : 1.2);
        const particleCount = lowQuality ? 32 : 85;
        const floatCount = lowQuality ? 1 : 3;
        // skip lab 3D total di mobile sangat low-end untuk anti lag
        if (isMobile && isLowEnd && window.innerWidth < 480) {
            canvas.style.display='none';
            if(fallback) fallback.hidden=false;
            return;
        }

        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x050510, 0.035);

        // portrait / mobile: FOV lebih lebar + kamera mundur agar bola tidak terpotong
        const isPortraitLab = section.clientWidth < 600 || section.clientWidth < section.clientHeight;
        let camBaseZ = isPortraitLab ? 8.8 : 7.2;
        let camBaseY = isPortraitLab ? 0.35 : 0.6;
        let camFov = isPortraitLab ? 66 : 58;
        const camera = new THREE.PerspectiveCamera(camFov, section.clientWidth / section.clientHeight, 0.1, 100);
        camera.position.set(0, camBaseY, camBaseZ);

        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: !lowQuality });
        renderer.setPixelRatio(pixelRatio);
        renderer.setSize(section.clientWidth, section.clientHeight);
        renderer.setClearColor(0x050510, 0);

        // grid — kurangi segment untuk ringan
        const gridGeo = new THREE.PlaneGeometry(36, 36, lowQuality? 10:18, lowQuality? 10:18);
        const gridMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, wireframe: true, transparent: true, opacity: 0.06 });
        const grid = new THREE.Mesh(gridGeo, gridMat);
        grid.rotation.x = -Math.PI / 2.25;
        grid.position.y = -2.2;
        scene.add(grid);

        // main wireframe sphere
        const sphereGeo = new THREE.IcosahedronGeometry(1.55, lowQuality? 2:3);
        const sphereMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, wireframe: true, transparent: true, opacity: 0.62 });
        const sphere = new THREE.Mesh(sphereGeo, sphereMat);
        scene.add(sphere);

        const coreGeo = new THREE.IcosahedronGeometry(0.85, 1);
        const coreMat = new THREE.MeshBasicMaterial({ color: 0x7b2fff, transparent: true, opacity: 0.22 });
        const core = new THREE.Mesh(coreGeo, coreMat);
        scene.add(core);

        // outer shell
        const shellGeo = new THREE.IcosahedronGeometry(1.9, 1);
        const shellMat = new THREE.MeshBasicMaterial({ color: 0xff006e, wireframe: true, transparent: true, opacity: 0.06 });
        const shell = new THREE.Mesh(shellGeo, shellMat);
        scene.add(shell);

        // particles
        const pGeo = new THREE.BufferGeometry();
        const pPos = new Float32Array(particleCount * 3);
        const pCol = new Float32Array(particleCount * 3);
        for(let i=0;i<particleCount;i++){
            const r = 4.5 + Math.random()*2.5;
            const theta = Math.random()*Math.PI*2;
            const phi = Math.acos(2*Math.random()-1);
            pPos[i*3]= r*Math.sin(phi)*Math.cos(theta);
            pPos[i*3+1]= (Math.random()-0.5)*6;
            pPos[i*3+2]= r*Math.sin(phi)*Math.sin(theta);
            const mix = Math.random();
            if(mix<0.45){ pCol[i*3]=0; pCol[i*3+1]=0.94; pCol[i*3+2]=1; }
            else if(mix<0.75){ pCol[i*3]=0.48; pCol[i*3+1]=0.18; pCol[i*3+2]=1; }
            else { pCol[i*3]=1; pCol[i*3+1]=0; pCol[i*3+2]=0.43; }
        }
        pGeo.setAttribute('position', new THREE.BufferAttribute(pPos,3));
        pGeo.setAttribute('color', new THREE.BufferAttribute(pCol,3));
        const pMat = new THREE.PointsMaterial({ size: lowQuality?0.035:0.028, vertexColors:true, transparent:true, opacity:0.85, blending: THREE.AdditiveBlending, sizeAttenuation:true });
        const points = new THREE.Points(pGeo, pMat);
        scene.add(points);

        // floating objects
        const floaters = [];
        const floaterGeos = [
            new THREE.BoxGeometry(0.28,0.28,0.28),
            new THREE.OctahedronGeometry(0.22,0),
            new THREE.TetrahedronGeometry(0.24,0),
            new THREE.TorusGeometry(0.18,0.05,8,16)
        ];
        for(let i=0;i<floatCount;i++){
            const geo = floaterGeos[i % floaterGeos.length];
            const mat = new THREE.MeshBasicMaterial({ color: i%2?0x00f0ff:0x7b2fff, wireframe:true, transparent:true, opacity:0.45 });
            const m = new THREE.Mesh(geo, mat);
            const ang = (i / floatCount) * Math.PI*2;
            const rad = 2.8 + Math.random()*0.6;
            m.userData = { baseAng: ang, rad: rad, y: (Math.random()-0.5)*1.4, speed: 0.18 + Math.random()*0.22, rotSpeed: (Math.random()-0.5)*0.02 };
            m.position.set(Math.cos(ang)*rad, m.userData.y, Math.sin(ang)*rad);
            scene.add(m);
            floaters.push(m);
        }

        // glow sprite
        const gCanvas = document.createElement('canvas'); gCanvas.width=128; gCanvas.height=128;
        const gCtx = gCanvas.getContext('2d');
        const grd = gCtx.createRadialGradient(64,64,0,64,64,64);
        grd.addColorStop(0,'rgba(0,240,255,0.32)'); grd.addColorStop(0.35,'rgba(123,47,255,0.18)'); grd.addColorStop(1,'rgba(0,0,0,0)');
        gCtx.fillStyle=grd; gCtx.fillRect(0,0,128,128);
        const gTex = new THREE.CanvasTexture(gCanvas);
        const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map:gTex, transparent:true, blending:THREE.AdditiveBlending, opacity:0.55 }));
        sprite.scale.set(5.2,5.2,1);
        scene.add(sprite);

        // interaction state
        let targetRotX=0, targetRotY=0, curRotX=0, curRotY=0;
        let warp=0, targetWarp=0;
        let isHover=false;

        section.addEventListener('mousemove', (e)=>{
            if(lowQuality && window.innerWidth<768) return;
            const r = section.getBoundingClientRect();
            const nx = ((e.clientX - r.left)/r.width)*2 -1;
            const ny = -((e.clientY - r.top)/r.height)*2 +1;
            targetRotY = nx * 0.9;
            targetRotX = ny * 0.45;
        });
        // touch drag — dukung sumbu X (orbit) + Y (tilt ringan), jangan blokir scroll vertikal
        let dragging=false, lastX=0, lastY=0, axisLock=null;
        section.addEventListener('touchstart', (e)=>{
            dragging=true; axisLock=null;
            lastX=e.touches[0].clientX;
            lastY=e.touches[0].clientY;
        }, {passive:true});
        section.addEventListener('touchmove', (e)=>{
            if(!dragging) return;
            const t=e.touches[0];
            const dx=t.clientX-lastX;
            const dy=t.clientY-lastY;
            if(axisLock===null){
                if(Math.abs(dx)>4 || Math.abs(dy)>4){
                    axisLock = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
                }
            }
            if(axisLock==='x'){
                targetRotY += dx * 0.01;
                targetRotX = Math.max(-0.5, Math.min(0.5, targetRotX + dy * 0.004));
            }
            lastX=t.clientX;
            lastY=t.clientY;
        }, {passive:true});
        section.addEventListener('touchend', ()=>{ dragging=false; axisLock=null; }, {passive:true});
        section.addEventListener('touchcancel', ()=>{ dragging=false; axisLock=null; }, {passive:true});

        // scroll warp — throttled via rAF flag
        let warpTick=false;
        window.addEventListener('scroll', ()=>{
            if(warpTick) return;
            warpTick=true;
            requestAnimationFrame(()=>{
                warpTick=false;
                const rect = section.getBoundingClientRect();
                const vh = window.innerHeight;
                if(rect.top < vh && rect.bottom > 0){
                    const prog = 1 - Math.abs((rect.top + rect.height/2 - vh/2) / (vh*0.6));
                    targetWarp = Math.max(0, Math.min(1, prog)) * 0.9;
                }
            });
        }, {passive:true});

        let raf=null;
        let labVisible=true;
        let frameCount=0;
        function animate(){
            if(!labVisible || document.hidden){ raf=null; return; }
            raf=requestAnimationFrame(animate);
            const t = Date.now()*0.001;
            frameCount++;

            curRotX += (targetRotX - curRotX)*0.04;
            curRotY += (targetRotY - curRotY)*0.04;
            warp += (targetWarp - warp)*0.06;

            // sphere
            sphere.rotation.y += 0.004 + warp*0.01;
            sphere.rotation.x += 0.0015;
            sphere.rotation.z = curRotX * 0.25;
            sphere.position.y = Math.sin(t*0.6)*0.08;

            // core opposite
            core.rotation.y -= 0.006;
            core.rotation.x += 0.002;

            shell.rotation.y -= 0.0012;
            shell.rotation.x = Math.sin(t*0.3)*0.15;

            // grid subtle wave — only every 2 frames and skip on lowQuality
            if(!lowQuality && frameCount % 2 === 0){
                const posAttr = gridGeo.attributes.position;
                for(let i=0;i<posAttr.count;i++){
                    const ox = posAttr.getX(i), oy = posAttr.getY(i);
                    const dist = Math.sqrt(ox*ox + oy*oy);
                    posAttr.setZ(i, Math.sin(dist*0.55 - t*1.4)*0.12 * (1 - dist/20));
                }
                posAttr.needsUpdate = true;
            }
            grid.rotation.z = curRotY * 0.08;

            // floaters orbit
            floaters.forEach((m)=>{
                const ud = m.userData;
                ud.baseAng += 0.003 * ud.speed * (1 + warp*0.6);
                m.position.x = Math.cos(ud.baseAng) * ud.rad;
                m.position.z = Math.sin(ud.baseAng) * ud.rad;
                m.position.y = ud.y + Math.sin(t*0.7 + ud.baseAng)*0.35;
                m.rotation.x += ud.rotSpeed;
                m.rotation.y += ud.rotSpeed*1.3;
                // hover scale
                const s = 1 + (isHover?0.12:0) + Math.sin(t*1.2+ud.baseAng)*0.06;
                m.scale.set(s,s,s);
            });

            points.rotation.y += 0.00045 * (1 + warp);
            points.rotation.x += 0.0002;

            // camera warp
            camera.position.z = camBaseZ - warp*1.1;
            camera.position.x = curRotY * 0.9;
            camera.position.y = camBaseY + curRotX * 0.5;
            camera.lookAt(0,0,0);

            // sprite pulse
            sprite.material.opacity = 0.42 + Math.sin(t*1.6)*0.12 + warp*0.15;
            sprite.scale.set(5.2 + warp*1.2, 5.2 + warp*1.2, 1);

            // sphere pulse with warp
            const scl = 1 + Math.sin(t*1.1)*0.035 + warp*0.08;
            sphere.scale.set(scl,scl,scl);

            renderer.render(scene,camera);
        }

        if(!prefersReducedMotion){
            // observer to pause when lab offscreen
            try{
                if('IntersectionObserver' in window){
                    const ioLab = new IntersectionObserver((entries)=>{
                        entries.forEach(e=>{
                            labVisible = e.isIntersecting;
                            if(labVisible && !raf) animate();
                            else if(!labVisible && raf){ cancelAnimationFrame(raf); raf=null; }
                        });
                    }, {threshold:0.05});
                    ioLab.observe(section);
                }
            }catch{}
            animate();
        } else {
            renderer.render(scene,camera);
        }

        // resize — debounced & passive; update kamera untuk portrait/landscape
        let rt;
        window.addEventListener('resize', ()=>{
            clearTimeout(rt);
            rt=setTimeout(()=>{
                const w = section.clientWidth;
                const h = section.clientHeight;
                if(!w || !h) return;
                const portrait = w < 600 || w < h;
                camFov = portrait ? 66 : 58;
                camBaseZ = portrait ? 8.8 : 7.2;
                camBaseY = portrait ? 0.35 : 0.6;
                camera.fov = camFov;
                camera.aspect = w / h;
                camera.updateProjectionMatrix();
                camera.position.z = camBaseZ - warp*1.1;
                camera.position.y = camBaseY + curRotX * 0.5;
                renderer.setSize(w, h);
                renderer.setPixelRatio(pixelRatio);
            },150);
        }, {passive:true});

        document.addEventListener('visibilitychange', ()=>{
            if(document.hidden){ if(raf){ cancelAnimationFrame(raf); raf=null; } }
            else if(labVisible && !raf && !prefersReducedMotion) animate();
        });
    }

    // ============================================
    // INTERACTIVE TERMINAL
    // ============================================
    function initIterm() {
        const win = document.getElementById('itermWindow');
        const body = document.getElementById('itermBody');
        const log = document.getElementById('itermLog');
        const input = document.getElementById('itermInput');
        const cursor = document.getElementById('itermCursor');
        const canvasEl = document.getElementById('itermCanvas');
        if (!win || !body || !log || !input) return;

        // bg canvas subtle — optimized
        if (canvasEl && !prefersReducedMotion && !(isLowEnd && isMobile)) {
            const ctx = canvasEl.getContext('2d');
            if(!ctx) {/* skip */}
            else {
                let parts = [], raf=null;
                let itermVisible=true;
                const dprI = Math.min(window.devicePixelRatio||1, 1.2);
                function resize() {
                    const r = canvasEl.parentElement.getBoundingClientRect();
                    canvasEl.width = r.width * dprI;
                    canvasEl.height = r.height * dprI;
                    canvasEl.style.width = r.width+'px';
                    canvasEl.style.height = r.height+'px';
                    ctx.setTransform(dprI,0,0,dprI,0,0);
                    parts = [];
                    const c = isMobile?6: (isLowEnd ? 8 : 10);
                    for(let i=0;i<c;i++) parts.push({x:Math.random()*r.width, y:Math.random()*r.height, r:Math.random()*1+0.3, vx:(Math.random()-0.5)*0.14, vy:(Math.random()-0.5)*0.14, o:Math.random()*0.16+0.05});
                }
                function draw(){
                    if(!itermVisible || document.hidden){ raf=null; return; }
                    const w = canvasEl.width/dprI, h=canvasEl.height/dprI;
                    ctx.clearRect(0,0,w,h);
                    for(let i=0;i<parts.length;i++){ const p=parts[i]; p.x+=p.vx; p.y+=p.vy; if(p.x<0)p.x=w; if(p.x>w)p.x=0; if(p.y<0)p.y=h; if(p.y>h)p.y=0; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle=`rgba(0,240,255,${p.o})`; ctx.fill(); }
                    raf=requestAnimationFrame(draw);
                }
                resize(); draw();
                let tI;
                window.addEventListener('resize', ()=>{ clearTimeout(tI); tI=setTimeout(resize,150); }, {passive:true});
                document.addEventListener('visibilitychange',()=>{ if(document.hidden){ if(raf){ cancelAnimationFrame(raf); raf=null; } } else if(itermVisible && !raf) draw(); });
                try{
                    if('IntersectionObserver' in window){
                        const ioI = new IntersectionObserver((entries)=>{
                            entries.forEach(e=>{
                                itermVisible=e.isIntersecting;
                                if(itermVisible && !raf) draw();
                                else if(!itermVisible && raf){ cancelAnimationFrame(raf); raf=null; }
                            });
                        }, {threshold:0});
                        const secI=document.getElementById('playground');
                        if(secI) ioI.observe(secI);
                    }
                }catch{}
            }
        }

        const commands = ['help','about','skills','projects','contact','clear'];
        const history = [];
        let hIndex = -1;
        let tempInput = '';

        function scrollBottom(){ body.scrollTop = body.scrollHeight; }

        function addLine(html, cls=''){
            const div = document.createElement('div');
            div.className = 'iterm-line' + (cls? ' '+cls:'');
            div.innerHTML = html;
            log.appendChild(div);
            scrollBottom();
        }
        function addPromptLine(cmd){
            addLine(`<span class="iterm-prompt">$</span> ${escapeHtml(cmd)}`, 'iterm-line--in');
        }
        function escapeHtml(s){ return s.replace(/[&<>"']/g, m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m])); }

        function handle(cmdRaw){
            const cmd = cmdRaw.trim().toLowerCase();
            if(!cmd) return;
            addPromptLine(cmdRaw.trim());
            history.push(cmdRaw.trim());
            hIndex = history.length;

            if(cmd === 'help'){
                addLine(`<span class="iterm-out-title">Perintah tersedia:</span>`, 'iterm-line--help');
                addLine(`  <span class="iterm-cmd">about</span>    — tampilkan info programmer`, 'iterm-line--out');
                addLine(`  <span class="iterm-cmd">skills</span>   — gulir ke Tumpukan Teknologi`, 'iterm-line--out');
                addLine(`  <span class="iterm-cmd">projects</span> — gulir ke Proyek`, 'iterm-line--out');
                addLine(`  <span class="iterm-cmd">contact</span>  — gulir ke Kontak`, 'iterm-line--out');
                addLine(`  <span class="iterm-cmd">clear</span>    — bersihkan terminal`, 'iterm-line--out');
                addLine(`  <span class="iterm-cmd">help</span>     — tampilkan bantuan ini`, 'iterm-line--out');
            } else if(cmd === 'about'){
                addLine(`<span class="iterm-out-title">Muhamad Farhan Muizaddin — Software Engineer</span>`, 'iterm-line--success');
                addLine(`  Lokasi   : Kp. Situ RT003/002, Desa Sukaremi, Kec. Megamendung, Kab. Bogor`, 'iterm-line--out');
                addLine(`  Peran    : Software Engineer`, 'iterm-line--out');
                addLine(`  Fokus    : Web Development, RESTful API, Database`, 'iterm-line--out');
                addLine(`  Pendidikan: SMK WIKRAMA 1 Garut — RPL (2019–2022)`, 'iterm-line--out');
                addLine(`  Tumpukan : PHP • Laravel • CodeIgniter • Node.js • Express.js • RESTful API • MySQL • JavaScript`, 'iterm-line--out');
                addLine(`  Status   : <span style="color:#7CFFB2">Terbuka untuk kolaborasi</span>`, 'iterm-line--out');
                addLine(`  Tips: ketik <span class="iterm-cmd">projects</span> untuk melihat karya`, 'iterm-line--out');
            } else if(cmd === 'skills'){
                addLine(`→ Menuju <span class="iterm-cmd">Tumpukan Teknologi</span>...`, 'iterm-line--success');
                setTimeout(()=> document.getElementById('skills')?.scrollIntoView({behavior:'smooth', block:'start'}), 220);
            } else if(cmd === 'projects'){
                addLine(`→ Membuka <span class="iterm-cmd">Proyek</span>...`, 'iterm-line--success');
                setTimeout(()=> document.getElementById('projects')?.scrollIntoView({behavior:'smooth', block:'start'}), 220);
            } else if(cmd === 'contact'){
                addLine(`→ Melompat ke <span class="iterm-cmd">Kontak</span>...`, 'iterm-line--success');
                setTimeout(()=> document.getElementById('contact')?.scrollIntoView({behavior:'smooth', block:'start'}), 220);
            } else if(cmd === 'clear'){
                log.innerHTML = '';
            } else {
                addLine(`perintah tidak ditemukan: <span class="iterm-cmd">${escapeHtml(cmd)}</span> — ketik <span class="iterm-cmd">help</span>`, 'iterm-line--error');
            }
        }

        // autocomplete
        function autocomplete(val){
            if(!val) return val;
            const lower = val.toLowerCase();
            const match = commands.find(c=> c.startsWith(lower));
            return match || val;
        }

        // cursor positioning (measure text width)
        const measureCanvas = document.createElement('canvas');
        const measureCtx = measureCanvas.getContext('2d');
        function updateCursor(){
            if(!cursor) return;
            const style = getComputedStyle(input);
            measureCtx.font = `${style.fontSize} ${style.fontFamily}`;
            const textBefore = input.value.substring(0, input.selectionStart || input.value.length);
            const w = measureCtx.measureText(textBefore).width;
            cursor.style.left = (8 + w) + 'px'; // 8px offset for prompt gap? Actually input has no prompt, but wrap has prompt outside, so left is inside input
            // input padding left 0, so we offset from input left
        }

        input.addEventListener('input', updateCursor);
        input.addEventListener('click', updateCursor);
        input.addEventListener('keyup', updateCursor);
        input.addEventListener('focus', ()=> win.classList.add('focused'));
        input.addEventListener('blur', ()=> win.classList.remove('focused'));

        win.addEventListener('click', ()=> input.focus({preventScroll:true}));

        input.addEventListener('keydown', (e)=>{
            if(e.key === 'Enter'){
                e.preventDefault();
                const v = input.value;
                if(v.trim()) handle(v);
                input.value = '';
                updateCursor();
            } else if(e.key === 'ArrowUp'){
                e.preventDefault();
                if(history.length===0) return;
                if(hIndex===history.length) tempInput = input.value;
                hIndex = Math.max(0, hIndex-1);
                input.value = history[hIndex] || '';
                setTimeout(updateCursor,0);
            } else if(e.key === 'ArrowDown'){
                e.preventDefault();
                if(hIndex < history.length-1){
                    hIndex++;
                    input.value = history[hIndex] || '';
                } else {
                    hIndex = history.length;
                    input.value = tempInput;
                }
                setTimeout(updateCursor,0);
            } else if(e.key === 'Tab'){
                e.preventDefault();
                const cur = input.value;
                if(cur.trim()){
                    const completed = autocomplete(cur.trim());
                    if(completed !== cur.trim()){
                        input.value = completed;
                        updateCursor();
                    }
                }
            } else if(e.key === 'l' && (e.ctrlKey || e.metaKey)){
                e.preventDefault();
                log.innerHTML='';
            } else if(e.key === 'Escape'){
                input.value='';
                updateCursor();
            }
        });

        // initial cursor pos
        updateCursor();

        // focus when visible
        const io = new IntersectionObserver((entries)=>{
            entries.forEach(ent=>{
                if(ent.isIntersecting) setTimeout(()=> input.focus({preventScroll:true}), 400);
            });
        },{threshold:0.4});
        io.observe(win);
    }

    // ============================================
    // CONTACT
    // ============================================
    function initContact(){
        const form = document.getElementById('contactForm');
        const nameEl = document.getElementById('cName');
        const emailEl = document.getElementById('cEmail');
        const subjectEl = document.getElementById('cSubject');
        const msgEl = document.getElementById('cMessage');
        const toast = document.getElementById('formToast');
        const submit = document.getElementById('contactSubmit');
        const charCount = document.getElementById('charCount');
        const charWrap = document.getElementById('charCountWrap');
        const contactCanvas = document.getElementById('contactCanvas');
        if(!form || !nameEl || !emailEl || !msgEl || !subjectEl) return;

        // bg canvas — optimized, low count, pause offscreen
        if(contactCanvas && !prefersReducedMotion && !(isLowEnd && isMobile)){
            const ctx = contactCanvas.getContext('2d');
            if(!ctx) {/* skip */}
            else {
                let parts=[], raf=null;
                let contactVisible=true;
                const dprC = Math.min(window.devicePixelRatio||1, 1.2);
                function resize(){
                    const r = contactCanvas.parentElement.getBoundingClientRect();
                    contactCanvas.width = r.width*dprC;
                    contactCanvas.height = r.height*dprC;
                    contactCanvas.style.width=r.width+'px';
                    contactCanvas.style.height=r.height+'px';
                    ctx.setTransform(dprC,0,0,dprC,0,0);
                    parts=[];
                    const c = isMobile?6: (isLowEnd ? 8 : 10);
                    for(let i=0;i<c;i++) parts.push({x:Math.random()*r.width, y:Math.random()*r.height, r:Math.random()*1+0.3, vx:(Math.random()-0.5)*0.14, vy:(Math.random()-0.5)*0.14, o:Math.random()*0.16+0.05});
                }
                function draw(){
                    if(!contactVisible || document.hidden){ raf=null; return; }
                    const w=contactCanvas.width/dprC, h=contactCanvas.height/dprC;
                    ctx.clearRect(0,0,w,h);
                    for(let i=0;i<parts.length;i++){ const p=parts[i]; p.x+=p.vx; p.y+=p.vy; if(p.x<0)p.x=w; if(p.x>w)p.x=0; if(p.y<0)p.y=h; if(p.y>h)p.y=0; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle=`rgba(0,240,255,${p.o})`; ctx.fill(); }
                    raf=requestAnimationFrame(draw);
                }
                resize(); draw();
                let tC;
                window.addEventListener('resize', ()=>{ clearTimeout(tC); tC=setTimeout(resize,150); }, {passive:true});
                document.addEventListener('visibilitychange',()=>{ if(document.hidden){ if(raf){ cancelAnimationFrame(raf); raf=null; } } else if(contactVisible && !raf) draw(); });
                try{
                    if('IntersectionObserver' in window){
                        const ioC = new IntersectionObserver((entries)=>{
                            entries.forEach(e=>{
                                contactVisible=e.isIntersecting;
                                if(contactVisible && !raf) draw();
                                else if(!contactVisible && raf){ cancelAnimationFrame(raf); raf=null; }
                            });
                        }, {threshold:0});
                        const secC=document.getElementById('contact');
                        if(secC) ioC.observe(secC);
                    }
                }catch{}
            }
        }

        // char count — 5000 max, warn at 80%
        function updateCount(){
            if(!charCount) return;
            const len = msgEl.value.length;
            const max = parseInt(msgEl.getAttribute('maxlength')||'5000',10);
            charCount.textContent = len;
            if(charWrap){
                charWrap.classList.remove('warn','danger');
                if(len > max * 0.9) charWrap.classList.add('danger');
                else if(len > max * 0.75) charWrap.classList.add('warn');
            }
        }
        msgEl.addEventListener('input', updateCount);
        updateCount();

        // contact cards glow follow
        document.querySelectorAll('.contact-card').forEach(card=>{
            card.addEventListener('mousemove', e=>{
                const r=card.getBoundingClientRect();
                card.style.setProperty('--mx', ((e.clientX-r.left)/r.width*100)+'%');
                card.style.setProperty('--my', ((e.clientY-r.top)/r.height*100)+'%');
            });
        });

        function setFieldError(inputEl, errId, msg){
            const err = document.getElementById(errId);
            if(err) err.textContent = msg;
            const field = err?.closest('.field') || inputEl.closest('.field');
            if(field) field.classList.toggle('has-error', !!msg);
            if(inputEl) inputEl.setAttribute('aria-invalid', msg ? 'true' : 'false');
        }
        function clearErrors(){
            setFieldError(nameEl,'errName','');
            setFieldError(emailEl,'errEmail','');
            setFieldError(subjectEl,'errSubject','');
            setFieldError(msgEl,'errMessage','');
        }
        function showToast(msg, type){
            if(!toast) return;
            // use inner span for text so ::before icon stays
            toast.textContent = msg;
            toast.className = 'form-toast ' + (type||'info');
            toast.hidden = false;
            // accessibility: force re-announce
            toast.setAttribute('aria-live', type==='error' ? 'assertive' : 'polite');
            clearTimeout(toast._t);
            const duration = type==='success' ? 5500 : 5000;
            toast._t = setTimeout(()=> { toast.hidden=true; }, duration);
            // smooth scroll toast into view on mobile
            if(window.innerWidth < 768){
                try{ toast.scrollIntoView({behavior:'smooth', block:'nearest'}); }catch{}
            }
        }

        // Button states: IDLE / LOADING / SUCCESS / ERROR
        const btnTextEl = submit ? submit.querySelector('.btn-text') : null;
        const btnIconEl = submit ? submit.querySelector('i.fa-paper-plane') : null;
        let btnResetTimer = null;
        function setButtonState(state){
            if(!submit || !btnTextEl) return;
            clearTimeout(btnResetTimer);
            submit.classList.remove('is-loading','is-success','is-error');
            if(submit) submit.disabled = false;
            if(state==='loading'){
                submit.disabled = true;
                submit.classList.add('is-loading');
                btnTextEl.textContent = 'Mengirim...';
                if(btnIconEl) btnIconEl.style.opacity='0';
                submit.setAttribute('aria-busy','true');
            } else if(state==='success'){
                submit.classList.add('is-success');
                btnTextEl.textContent = 'Pesan Terkirim ✓';
                if(btnIconEl){ btnIconEl.className='fas fa-check'; btnIconEl.style.opacity='1'; btnIconEl.style.transform='scale(1.1)'; }
                submit.disabled = true;
                btnResetTimer = setTimeout(()=> setButtonState('idle'), 2400);
            } else if(state==='error'){
                submit.classList.add('is-error');
                btnTextEl.textContent = 'Coba Lagi';
                if(btnIconEl){ btnIconEl.className='fas fa-rotate-right'; btnIconEl.style.opacity='1'; }
                btnResetTimer = setTimeout(()=> setButtonState('idle'), 2200);
            } else {
                // idle
                btnTextEl.textContent = 'Kirim Pesan';
                if(btnIconEl){ btnIconEl.className='fas fa-paper-plane'; btnIconEl.style.opacity='1'; btnIconEl.style.transform=''; }
                submit.disabled = false;
                submit.removeAttribute('aria-busy');
            }
        }

        function validateFrontend(){
            clearErrors();
            const name = nameEl.value.trim();
            const email = emailEl.value.trim();
            const subject = subjectEl.value.trim();
            const message = msgEl.value.trim();
            let valid = true;
            let firstInvalid = null;

            if(!name || name.length < 2){
                setFieldError(nameEl,'errName', !name ? 'Nama wajib diisi.' : 'Nama minimal 2 karakter.');
                valid=false; firstInvalid = firstInvalid || nameEl;
            } else if(name.length > 100){
                setFieldError(nameEl,'errName','Nama maksimal 100 karakter.');
                valid=false; firstInvalid = firstInvalid || nameEl;
            }

            const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(!email){
                setFieldError(emailEl,'errEmail','Email wajib diisi.');
                valid=false; firstInvalid = firstInvalid || emailEl;
            } else if(!emailRe.test(email)){
                setFieldError(emailEl,'errEmail','Masukkan alamat email yang valid.');
                valid=false; firstInvalid = firstInvalid || emailEl;
            } else if(email.length > 254){
                setFieldError(emailEl,'errEmail','Email terlalu panjang.');
                valid=false; firstInvalid = firstInvalid || emailEl;
            }

            // Subject optional — sesuai spec terbaru: hanya nama/email/pesan wajib; jika diisi validasi 3-200
            if(subject){
                if(subject.length < 3){
                    setFieldError(subjectEl,'errSubject','Subjek minimal 3 karakter.');
                    valid=false; firstInvalid = firstInvalid || subjectEl;
                } else if(subject.length > 200){
                    setFieldError(subjectEl,'errSubject','Subjek maksimal 200 karakter.');
                    valid=false; firstInvalid = firstInvalid || subjectEl;
                }
            } else {
                // kosongkan error jika optional dan tidak diisi
                setFieldError(subjectEl,'errSubject','');
            }

            if(!message){
                setFieldError(msgEl,'errMessage','Pesan wajib diisi.');
                valid=false; firstInvalid = firstInvalid || msgEl;
            } else if(message.length < 10){
                setFieldError(msgEl,'errMessage','Pesan minimal 10 karakter.');
                valid=false; firstInvalid = firstInvalid || msgEl;
            } else if(message.length > 5000){
                setFieldError(msgEl,'errMessage','Pesan maksimal 5000 karakter.');
                valid=false; firstInvalid = firstInvalid || msgEl;
            }

            return { valid, firstInvalid };
        }

        // v13.0 — Method Not Allowed FIXED: frontend selalu POST, backend handle OPTIONS+POST, strict success, anti double-submit
        console.log('[contact] initContact v13.0 — TO mfarhanmuizaddin@gmail.com via Resend, POST ketat');
        // Pastikan honeypot kosong saat load — cegah autofill browser yang sebabkan fake success tanpa email
        const honeyInit = form.querySelector('input[name="website"]');
        if (honeyInit) {
            honeyInit.value = '';
            // double clear after short delay (beberapa browser autofill setelah load)
            setTimeout(()=> { if (honeyInit) honeyInit.value = ''; }, 500);
            // cegah browser password manager mengisi honeypot
            honeyInit.setAttribute('autocomplete', 'off');
        }

        let isSubmitting = false;

        form.addEventListener('submit', async (e)=>{
            e.preventDefault();
            e.stopPropagation();
            console.log('[contact] submit intercepted — honeypot check, validation, fetch POST /api/contact');
            if (isSubmitting) {
                console.warn('[contact] already submitting — ignore double click');
                return;
            }
            // Honeypot check first — silent return, no error shown to bot
            const honey = form.querySelector('input[name="website"]');
            if(honey && honey.value.trim()){
                console.warn('[contact] honeypot filled — treating as spam, not sending', { value: honey.value });
                // Pretend success for bot — jangan kirim email
                showToast('Pesan berhasil dikirim.', 'success');
                return;
            }

            const { valid, firstInvalid } = validateFrontend();
            if(!valid){
                showToast('Perbaiki kolom yang ditandai.', 'error');
                if(firstInvalid) firstInvalid.focus();
                // shake button for feedback
                if(submit){ submit.classList.add('is-error'); setTimeout(()=> submit.classList.remove('is-error'), 420); }
                return;
            }

            // Offline check
            if(typeof navigator !== 'undefined' && navigator.onLine === false){
                showToast('Anda tampak offline. Periksa koneksi dan coba lagi.', 'error');
                setButtonState('error');
                return;
            }

            const payload = {
                name: nameEl.value.trim(),
                email: emailEl.value.trim(),
                subject: subjectEl.value.trim(),
                message: msgEl.value.trim(),
                website: honey ? honey.value : '' // honeypot, server will drop if filled
            };

            isSubmitting = true;
            setButtonState('loading');

            const controller = new AbortController();
            const timeoutId = setTimeout(()=> controller.abort(), 15000);

            try {
                console.log('[contact] fetching POST /api/contact', { payload: { ...payload, website: payload.website ? '[filled honeypot]' : '' } });
                const res = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify(payload),
                    signal: controller.signal
                });
                clearTimeout(timeoutId);

                let data;
                const ct = res.headers.get('content-type')||'';
                if(ct.includes('application/json')){
                    data = await res.json().catch(()=> ({}));
                } else {
                    const txt = await res.text().catch(()=> '');
                    // Jika backend mengembalikan HTML (mis. static server tanpa API), deteksi 405 palsu
                    if (txt && txt.trim().startsWith('<!DOCTYPE') || txt.includes('Method Not Allowed')) {
                        console.error('[contact] Non-JSON response — likely static server without API. Run vercel dev or deploy to Vercel.');
                        showToast('Layanan sementara tidak tersedia. Coba lagi nanti atau hubungi via email.', 'error');
                        setButtonState('error');
                        isSubmitting = false;
                        return;
                    }
                    try{ data = JSON.parse(txt); } catch{ data = { error: txt || res.statusText, message: txt || res.statusText }; }
                }

                console.log('[contact] response', { status: res.status, ok: res.ok, data });

                // STRICT: hanya success true yang dianggap berhasil — cegah false positive
                // Backend untuk GET/PUT/DELETE akan balas 405 dengan {success:false} — frontend harus tangani sebagai error, bukan fallback ke GET
                if(!res.ok || !data || data.success !== true){
                    // Pastikan error ditampilkan, bukan success palsu
                    if(res.status===400 && data && data.fields){
                        Object.entries(data.fields).forEach(([field, msg])=>{
                            const map = { name:'errName', email:'errEmail', subject:'errSubject', message:'errMessage' };
                            const inputMap = { name:nameEl, email:emailEl, subject:subjectEl, message:msgEl };
                            if(map[field]) setFieldError(inputMap[field], map[field], msg);
                        });
                        showToast(data.message || data.error || 'Data formulir tidak valid. Periksa kolom yang ditandai.', 'error');
                    } else if(res.status===400){
                        showToast(data.message || data.error || 'Data formulir tidak valid.', 'error');
                    } else if(res.status===429){
                        const retry = res.headers.get('Retry-After');
                        const hint = retry ? ` (${retry}s)` : '';
                        showToast((data.message || data.error || 'Terlalu banyak pesan.') + hint, 'error');
                    } else if(res.status===413){
                        showToast(data.message || data.error || 'Pesan terlalu besar. Persingkat dan coba lagi.', 'error');
                    } else if(res.status===405){
                        // Method Not Allowed — seharusnya tidak terjadi jika frontend POST konsisten
                        // Tampilkan pesan ramah, jangan raw "Method Not Allowed"
                        console.error('[contact] 405 Method Not Allowed — check that frontend uses POST and backend allows POST. URL:', '/api/contact');
                        showToast('Kesalahan konfigurasi layanan. Coba lagi sesaat. Jika berlanjut, hubungi via email.', 'error');
                    } else if(res.status>=500){
                        showToast(data.message || data.error || 'Terjadi kesalahan di sisi kami. Coba lagi nanti.', 'error');
                    } else {
                        const msg = data.message || data.error || 'Gagal mengirim pesan. Coba lagi.';
                        showToast(msg, 'error');
                    }
                    console.warn('[contact] server response (error path)', { status: res.status, data });
                    setButtonState('error');
                    isSubmitting = false;
                    return;
                }

                // HANYA jika benar-benar success === true
                console.log('[contact] SUCCESS — email queued, Resend ID:', data.id);
                showToast('Pesan berhasil dikirim! Saya akan merespons secepatnya.', 'success');
                form.reset();
                if (honey) honey.value = '';
                updateCount();
                clearErrors();
                setButtonState('success');
                isSubmitting = false;
                return;
            } catch(err){
                clearTimeout(timeoutId);
                console.error('[contact] fetch error', err);
                if(err && err.name==='AbortError'){
                    showToast('Waktu permintaan habis. Coba lagi.', 'error');
                } else if(typeof navigator !== 'undefined' && navigator.onLine === false){
                    showToast('Anda tampak offline. Periksa koneksi dan coba lagi.', 'error');
                } else if(err instanceof TypeError && /fetch|network|Failed to fetch/i.test(String(err.message||''))){
                    // Sering terjadi jika API tidak tersedia (mis. live-server tanpa vercel dev)
                    const isLocalStatic = location.protocol === 'file:' || location.hostname === '127.0.0.1' || location.hostname === 'localhost';
                    if (isLocalStatic && !location.port.includes('3000')) {
                        showToast('API tidak tersedia di mode statis lokal. Jalankan `vercel dev` atau deploy ke Vercel untuk menguji form kontak.', 'error');
                    } else {
                        showToast('Gagal mengirim pesan. Periksa koneksi dan coba lagi.', 'error');
                    }
                } else {
                    showToast('Terjadi kesalahan. Coba lagi.', 'error');
                }
                setButtonState('error');
                isSubmitting = false;
            }
        });

        // live validation — clear error as user types (elegant, not noisy)
        const liveFields = [
            { el: nameEl, errId: 'errName', validate: (v)=> v.trim().length>=2 && v.trim().length<=100 },
            { el: emailEl, errId: 'errEmail', validate: (v)=> /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) && v.trim().length<=254 },
            { el: subjectEl, errId: 'errSubject', validate: (v)=> v.trim().length===0 || (v.trim().length>=3 && v.trim().length<=200) },
            { el: msgEl, errId: 'errMessage', validate: (v)=> v.trim().length>=10 && v.trim().length<=5000 }
        ];
        liveFields.forEach(({el, errId, validate})=>{
            el.addEventListener('input', ()=>{
                const errEl = document.getElementById(errId);
                if(errEl && errEl.textContent && validate(el.value)){
                    setFieldError(el, errId, '');
                }
                if(el===msgEl) updateCount();
            });
            el.addEventListener('blur', ()=>{
                // subtle blur validation — only if field was touched and not empty
                if(el.value.trim()){
                    if(!validate(el.value)){
                        // don't show immediately on blur if empty, only if error already exists or for email format
                        const errEl = document.getElementById(errId);
                        if(errEl && !errEl.textContent){
                            // trigger frontend validation for this single field
                            const { valid } = validateFrontend();
                            // validateFrontend already handled showing, we just wanted single field — clear others if valid? Simpler: re-run but keep UX
                            // Our validateFrontend clears all, so revert: only show this field's error
                            // To avoid flicker, just let validateFrontend handle next submit.
                        }
                    }
                }
            });
        });

        // Also clear toast when user starts typing again
        [nameEl,emailEl,subjectEl,msgEl].forEach(el=>{
            el.addEventListener('input', ()=>{
                if(toast && !toast.hidden && toast.classList.contains('error')){
                    // keep error toast until next submit, but allow user to see it's being fixed
                }
            });
        });
    }

    // ============================================
    // HERO AMBIENT — floating particles & code fragments
    // ============================================
    function initHeroAmbient(){
        if(prefersReducedMotion) return;
        const particleWrap = document.getElementById('floatingParticles');
        const fragmentWrap = document.getElementById('codeFragments');
        if(!particleWrap && !fragmentWrap) return;

        // --- tiny floating particles (CSS animated, GPU cheap) ---
        if(particleWrap && !particleWrap.childElementCount){
            const count = isMobile ? 8 : (isLowEnd ? 12 : 18);
            const frag = document.createDocumentFragment();
            for(let i=0;i<count;i++){
                const p = document.createElement('span');
                p.className = 'hero-particle' + (Math.random()>0.55 ? ' purple' : '');
                p.style.left = (Math.random()*100).toFixed(2) + '%';
                p.style.top  = (55 + Math.random()*45).toFixed(2) + '%';
                p.style.animationDuration = (7 + Math.random()*7).toFixed(1) + 's';
                p.style.animationDelay = (Math.random()*10).toFixed(1) + 's';
                p.style.width = p.style.height = (2 + Math.random()*2).toFixed(1) + 'px';
                frag.appendChild(p);
            }
            particleWrap.appendChild(frag);
        }

        // --- subtle code fragments drifting in background ---
        if(fragmentWrap && !fragmentWrap.childElementCount){
            const snippets = [
                'const dev = "full-stack";',
                'git commit -m "ship it"',
                'npm run build',
                'function deploy() {',
                'SELECT * FROM projects;',
                'async/await → promise',
                '</> { portfolio }',
                'php artisan serve',
                'return <Fast />;',
                'kubectl rollout status'
            ];
            const count = isMobile ? 4 : (isLowEnd ? 5 : 7);
            const frag = document.createDocumentFragment();
            for(let i=0;i<count;i++){
                const el = document.createElement('span');
                el.className = 'code-fragment' + (Math.random()>0.6 ? ' frag-purple' : '');
                el.textContent = snippets[i % snippets.length];
                el.style.left = (Math.random()*92).toFixed(2) + '%';
                el.style.top  = (8 + Math.random()*80).toFixed(2) + '%';
                el.style.animationDuration = (10 + Math.random()*8).toFixed(1) + 's';
                el.style.animationDelay = (Math.random()*12).toFixed(1) + 's';
                frag.appendChild(el);
            }
            fragmentWrap.appendChild(frag);
        }
    }

    // ============================================
    // INIT ALL
    // ============================================
    function initFooterYear(){
        const el = document.getElementById('footerYear');
        if(el) el.textContent = String(new Date().getFullYear());
    }

    function initAll() {
        initNavbar();
        initHeroCanvas();
        initThreeJS();
        initNoise();
        initHeroAmbient();
        initHeroParallax();
        initMouseParallax();
        initProfileImageFallback();
        initMagneticButtons();
        initHeroTextCinematic();
        initScrollReveal();
        initTerminalTyping();
        initCodeCard();
        initTechStack();
        initProjects();
        initProjectModalEvents();
        initExperience();
        initLab3D();
        initIterm();
        initContact();
        initFooterYear();
    }

    // ============================================
    // START
    // ============================================
    document.addEventListener('DOMContentLoaded', () => {
        initFooterYear();
        initLoader();
    });

})();
