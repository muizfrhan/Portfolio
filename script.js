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
    // PROJECTS DATA - Edit here to add/remove projects
    // ============================================
    const projectsData = [
        {
            id: 'nexora',
            featured: true,
            title: 'Nexora — AI SaaS Dashboard',
            category: 'Featured • SaaS',
            description: 'Analytics dashboard for AI teams. Real-time pipelines, model monitoring and collaborative workspaces — built for scale.',
            longDescription: 'Nexora empowers AI teams to monitor models, track data pipelines, and collaborate on experiments in one unified workspace. Designed for high-throughput and low-latency.',
            image: 'gradient-a',
            icon: 'fa-brain',
            technologies: ['Next.js', 'Node.js', 'PostgreSQL', 'Prisma', 'Tailwind', 'Vercel'],
            features: ['Real-time streaming with WebSockets', 'Role-based workspaces & permissions', 'Model registry & versioning', 'Custom chart builder with export'],
            challenges: 'Handling high-frequency ingestion (12k evt/s) while keeping dashboard interaction at 60fps and avoiding layout thrash on large datasets.',
            solutions: 'Virtualized tables, Web Worker aggregations, incremental SSR + SWR caching and canvas-based chart renderer with RAF throttling.',
            github: '#',
            demo: '#',
            year: '2024'
        },
        {
            id: 'lumina',
            title: 'Lumina E-Commerce',
            category: 'E-Commerce',
            description: 'Headless commerce storefront with lightning-fast SSR, cart sync and payment orchestration.',
            longDescription: 'Lumina is a headless storefront focused on conversion. Edge-rendered PLPs, optimistic cart and modular payment providers.',
            image: 'gradient-b',
            icon: 'fa-bag-shopping',
            technologies: ['React', 'PHP', 'MySQL', 'REST API', 'Stripe'],
            features: ['Edge SSR for 98 Lighthouse score', 'Optimistic cart & wishlist sync', 'Stripe + Midtrans payment orchestration', 'Admin CMS for catalog'],
            challenges: 'SEO for 20k+ SKUs and cart consistency across tabs/devices.',
            solutions: 'Incremental Static Regeneration, BroadcastChannel cart sync and background revalidation queue.',
            github: '#',
            demo: '#',
            year: '2024'
        },
        {
            id: 'voltpay',
            title: 'VoltPay Wallet',
            category: 'Fintech',
            description: 'Secure digital wallet with QR payments, ledger and fraud detection hooks.',
            longDescription: 'VoltPay handles wallet ledger, QRIS payments and transaction reconciliation with idempotency and audit trails.',
            image: 'gradient-c',
            icon: 'fa-bolt',
            technologies: ['Node.js', 'MySQL', 'REST API', 'JavaScript', 'Vercel'],
            features: ['Idempotent ledger & double-entry', 'QRIS generation & scan', 'Webhook retry with HMAC', 'Fraud-heuristic scoring'],
            challenges: 'Consistency of ledger under concurrent transfers and webhook delivery guarantees.',
            solutions: 'DB transactions with row-level locking, outbox pattern and exponential backoff with dead-letter queue.',
            github: '#',
            demo: '#',
            year: '2023'
        },
        {
            id: 'chronicle',
            title: 'Chronicle CMS',
            category: 'CMS • Editorial',
            description: 'Headless CMS for editorial teams — live preview, scheduling and image optimization pipeline.',
            longDescription: 'Chronicle gives editors live preview, scheduled publishing and an image pipeline that auto-optimizes to WebP/AVIF.',
            image: 'gradient-d',
            icon: 'fa-newspaper',
            technologies: ['PHP', 'MySQL', 'JavaScript', 'GitHub Actions'],
            features: ['Live preview via iframe bridge', 'Scheduled publish with cron', 'Image CDN transform pipeline', 'Draft → Review → Publish flow'],
            challenges: 'Preview fidelity and cache purging across CDN on publish.',
            solutions: 'Preview token bridge and tag-based cache invalidation with surrogate keys.',
            github: '#',
            demo: '#',
            year: '2023'
        },
        {
            id: 'atlas',
            title: 'Atlas API Gateway',
            category: 'Infrastructure',
            description: 'Gateway aggregating microservices with rate-limit, auth and observability.',
            longDescription: 'Atlas sits in front of microservices, handling auth, rate limiting, request tracing and aggregated docs.',
            image: 'gradient-e',
            icon: 'fa-diagram-project',
            technologies: ['Node.js', 'Python', 'REST API', 'Git', 'Vercel'],
            features: ['JWT + API key dual auth', 'Token bucket rate limiting', 'OpenAPI aggregation', 'Grafana + traces'],
            challenges: 'Low-latency routing and consistent rate limits across instances.',
            solutions: 'LRU cache + Redis sliding window and edge middleware with streaming.',
            github: '#',
            demo: '#',
            year: '2024'
        },
        {
            id: 'orbit',
            title: 'Orbit Analytics',
            category: 'Analytics',
            description: 'Product analytics with funnels, retention and cohort charts — privacy-first.',
            longDescription: 'Orbit tracks product events without cookies, building funnels and retention cohorts with clickhouse-style rollups.',
            image: 'gradient-f',
            icon: 'fa-chart-line',
            technologies: ['JavaScript', 'Python', 'MySQL', 'Vercel', 'GitHub'],
            features: ['Cookie-less tracking snippet', 'Funnel & retention engine', 'Cohort heatmaps', 'CSV & webhook exports'],
            challenges: 'Fast cohort queries over millions of events without pre-aggregation lag.',
            solutions: 'Materialized rollups, columnar in-memory cache and query planner with sampling.',
            github: '#',
            demo: '#',
            year: '2024'
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
        let lastScrollY = 0;
        let scrollTicking = false;

        window.addEventListener('scroll', () => {
            if (!scrollTicking) {
                requestAnimationFrame(() => {
                    const currentScrollY = window.scrollY;
                    if (currentScrollY > 100) navbar.classList.add('scrolled');
                    else navbar.classList.remove('scrolled');
                    updateActiveNavLink();
                    scrollTicking = false;
                });
                scrollTicking = true;
            }
        }, {passive:true});

        // Mobile menu toggle
        function setNav(open){
            navToggle.classList.toggle('active', open);
            navLinks.classList.toggle('open', open);
            navToggle.setAttribute('aria-expanded', String(open));
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
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.scrollY;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 200;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (navLink && scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                navLink.classList.add('active');
            }
        });
    }

    // ============================================
    // HERO CANVAS PARTICLES (2D)
    // ============================================
    function initHeroCanvas() {
        const canvas = heroCanvas;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId;

        function resizeCanvas() {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
        }

        function createParticles() {
            particles = [];
            const particleCount = isMobile ? 30 : 60;
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 2 + 0.5,
                    speedX: (Math.random() - 0.5) * 0.5,
                    speedY: (Math.random() - 0.5) * 0.5,
                    opacity: Math.random() * 0.5 + 0.1,
                    color: Math.random() > 0.5 ? '0, 240, 255' : '123, 47, 255'
                });
            }
        }

        function drawParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
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
            });

            // Draw connections
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 150) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(0, 240, 255, ${0.05 * (1 - distance / 150)})`;
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
            // Draw once
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
                ctx.fill();
            });
        }

        window.addEventListener('resize', () => {
            resizeCanvas();
            createParticles();
        }, {passive:true});

        // pause when offscreen
        observeVisibility(document.getElementById('home'), ()=>{
            if(!prefersReducedMotion && !animationId) drawParticles();
        }, ()=>{
            if(animationId){ cancelAnimationFrame(animationId); animationId=null; }
        });
    }

    // ============================================
    // THREE.JS 3D SCENE
    // ============================================
    function initThreeJS() {
        if (isMobile || typeof THREE === 'undefined' || prefersReducedMotion) {
            if (threeContainer) {
                threeContainer.style.display = 'none';
            }
            return;
        }

        try {
            const container = threeContainer;
            const width = container.offsetWidth;
            const height = container.offsetHeight;

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
                antialias: true
            });
            renderer.setSize(width, height);
            renderer.setPixelRatio(perfPixelRatio);
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

            // Particles
            const particleCount = 200;
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

            function animate() {
                requestAnimationFrame(animate);

                // Rotate icosahedron
                icosahedron.rotation.y += 0.003;
                icosahedron.rotation.x += 0.001;

                // Rotate core in opposite direction
                core.rotation.y -= 0.005;
                core.rotation.x -= 0.002;

                // Rotate rings
                ring1.rotation.z += 0.002;
                ring2.rotation.z -= 0.001;
                ring1.rotation.x = Math.PI / 2 + Math.sin(Date.now() * 0.001) * 0.2;
                ring2.rotation.x = Math.PI / 3 + Math.cos(Date.now() * 0.001) * 0.2;

                // Rotate particles
                particles.rotation.y += 0.0005;
                particles.rotation.x += 0.0002;

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
        const heroVisual = document.getElementById('heroVisual');
        const codeBlocks = document.querySelectorAll('.floating-code-block');
        const profileStage = document.getElementById('profileStage');
        const profileFrame = document.querySelector('.profile-frame');
        const profile3d = document.querySelector('.profile-3d-layer');
        const heroBg = document.querySelector('.hero-background');

        function updateParallax() {
            if (isLoaded && !isMobile) {
                const scrollY = window.scrollY;
                const hero = document.getElementById('home');
                if (hero) {
                    const rect = hero.getBoundingClientRect();
                    const prog = Math.min(Math.max(0, -rect.top / (rect.height || 800)), 1);
                    // depth layers: bg slowest, 3d medium, photo fastest
                    if (heroBg) heroBg.style.transform = `translateY(${prog * 18}px)`;
                    if (profile3d) profile3d.style.transform = `translateY(${prog * 32}px)`;
                    if (profileFrame) profileFrame.style.transform = `translateY(${prog * 12}px)`;
                    if (profileStage) profileStage.style.transform = `translateY(${prog * 8}px)`;
                }
                codeBlocks.forEach((block, i) => {
                    const offset = (i + 1) * 20;
                    const parallax = Math.min(window.scrollY * 0.14, 200);
                    block.style.transform = `translateY(${parallax * (offset / 100)}px)`;
                });
            }
            requestAnimationFrame(updateParallax);
        }
        if (!prefersReducedMotion) updateParallax();
    }

    // ============================================
    // MOUSE PARALLAX ON HERO — Cinematic depth
    // ============================================
    function initMouseParallax() {
        if (isMobile || prefersReducedMotion) return;
        const heroVisual = document.getElementById('heroVisual');
        const profileStage = document.getElementById('profileStage');
        const profileFrame = document.querySelector('.profile-frame');
        const profile3d = document.querySelector('.profile-3d-layer');
        const heroBg = document.querySelector('.hero-background');
        const badges = document.querySelectorAll('.profile-badge-float');
        const floats = document.querySelectorAll('.profile-float');
        const codeBlocks = document.querySelectorAll('.floating-code-block');

        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;

            if (profileStage) {
                // depth: background 1px, 3D 6px, photo 3px, UI 7px — subtle premium
                if (profileFrame) profileFrame.style.transform = `translate3d(${x * 3}px, ${y * 2.5}px, 0)`;
                if (profile3d) profile3d.style.transform = `translate3d(${x * 6}px, ${y * 4}px, 0)`;
                if (heroBg) heroBg.style.transform = `translate3d(${x * 1.2}px, ${y * 1}px, 0)`;
                badges.forEach((b,i)=>{ b.style.transform = `translate3d(${x * (5+i*1.2)}px, ${y * (4+i*1)}px, 0)`; });
                floats.forEach((f,i)=>{ f.style.transform = `translate3d(${x * (6+i*1.5)}px, ${y * (5+i*1)}px, 0)`; });
            } else if (heroVisual) {
                // legacy fallback (old heroVisual absolute)
                const isNew = heroVisual.classList.contains('hero-right');
                if (isNew) {
                    heroVisual.style.transform = `translate(${x * 10}px, ${y * 10}px)`;
                } else {
                    heroVisual.style.transform = `translateY(-50%) translateX(${x * 10}px) translateY(${y * 10}px)`;
                }
            }
            codeBlocks.forEach((block, i) => {
                const factor = (i + 1) * 5;
                block.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
            });
        });
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
        if(isMobile || prefersReducedMotion) return;
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
            if(roleTyping) roleTyping.textContent = 'FULL-STACK DEVELOPER';
            if(roleCursor) roleCursor.classList.add('is-visible');
            if(desc) desc.classList.add('is-visible');
            descLines.forEach(l=> l.classList.add('is-visible'));
            if(badge) badge.classList.add('is-visible');
            const statusCard = document.querySelector('.hero-status-card');
            if(statusCard) statusCard.classList.add('is-visible');
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
            const full = 'FULL-STACK DEVELOPER';
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

        function revealStatusAndCTA(){
            const statusCard = document.querySelector('.hero-status-card');
            if(statusCard) statusCard.classList.add('is-visible');
            if(buttons) buttons.classList.add('is-visible');
            if(social) social.classList.add('is-visible');
            if(badge) badge.classList.add('is-visible');
        }

        // --- Sequence after loader ---
        // isLoaded is set true after loader hide (800ms). initHeroTextCinematic is called in initAll which is after loader.
        // So now schedule per spec.
        setTimeout(revealEyebrow, 200);
        setTimeout(revealName, 400);
        // FARHAN is second line, but revealName already staggers 0/150/300 from 400 => 400,550,700 matches spec
        setTimeout(startTyping, 1000);
        setTimeout(revealDesc, 2000);
        setTimeout(()=>{
            const statusCard = document.querySelector('.hero-status-card');
            if(statusCard) statusCard.classList.add('is-visible');
        }, 1750);
        setTimeout(()=>{
            if(buttons) buttons.classList.add('is-visible');
        }, 2200);
        setTimeout(()=>{
            if(social) social.classList.add('is-visible');
            if(badge) badge.classList.add('is-visible');
        }, 2400);

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

        // --- Scroll fade/blur ---
        if(hero && heroLeft && !prefersReducedMotion){
            let ticking=false;
            window.addEventListener('scroll', ()=>{
                if(ticking) return;
                ticking=true;
                requestAnimationFrame(()=>{
                    const rect = hero.getBoundingClientRect();
                    const prog = Math.min(Math.max(0, -rect.top / 420), 1);
                    if(prog>0.08){
                        heroLeft.classList.add('is-scrolled');
                        heroLeft.style.opacity = String(1 - prog*0.65);
                        heroLeft.style.filter = `blur(${prog*2.2}px)`;
                        heroLeft.style.transform = `translateY(${-prog*18}px)`;
                    } else {
                        heroLeft.classList.remove('is-scrolled');
                        heroLeft.style.opacity = '';
                        heroLeft.style.filter = '';
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

        const target = parseInt(element.dataset.target);
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
                        { cls: 'Name:', val: ' Ahmad Dhia', highlight: false },
                        { cls: 'Role:', val: ' Full-Stack Developer', highlight: true },
                        { cls: 'Location:', val: ' Indonesia', highlight: false },
                        { cls: 'Focus:', val: ' Web Development', highlight: true },
                        { cls: 'Status:', val: ' Available', highlight: true }
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
                    return '<span class="info">JavaScript &nbsp; Node.js &nbsp; Python &nbsp; React &nbsp; Next.js</span>\n<span class="info">PHP &nbsp; Laravel &nbsp; PostgreSQL &nbsp; AWS &nbsp; Docker</span>';
                }},
                termLine6: { text: '', delay: 4500 },
                termLine7: { text: '$ experience', delay: 5000 },
                termLine8: { text: '', delay: 5600, html: (i) => {
                    return '<span class="info">5+ years building scalable web applications</span>\n<span class="info">30+ clients, 42+ projects shipped</span>';
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
            javascript: `<span class="cm">// Full-Stack Developer Portfolio</span>
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

<span class="kw">const</span> <span class="prop">me</span> <span class="op">=</span> <span class="kw">new</span> <span class="cls">Developer</span><span class="op">(</span><span class="str">"Ahmad Dhia"</span><span class="op">,</span> <span class="str">"Full-Stack"</span><span class="op">);</span>
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
        <span class="kw">&lt;p</span><span class="kw">&gt;</span>Full-Stack Developer<span class="kw">&lt;/p&gt;</span>
        <span class="kw">&lt;button</span> <span class="prop">class</span><span class="op">=</span><span class="str">"btn"</span><span class="kw">&gt;</span>View Projects<span class="kw">&lt;/button&gt;</span>
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
        let particles = [];
        let raf;

        function resize() {
            const rect = canvas.parentElement.getBoundingClientRect();
            canvas.width = rect.width * (window.devicePixelRatio || 1);
            canvas.height = rect.height * (window.devicePixelRatio || 1);
            canvas.style.width = rect.width + 'px';
            canvas.style.height = rect.height + 'px';
            ctx.setTransform(window.devicePixelRatio || 1, 0, 0, window.devicePixelRatio || 1, 0, 0);
            create();
        }
        function create() {
            particles = [];
            const w = canvas.width / (window.devicePixelRatio || 1);
            const h = canvas.height / (window.devicePixelRatio || 1);
            const count = isMobile ? 18 : 32;
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    r: Math.random() * 1.6 + 0.4,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3,
                    o: Math.random() * 0.4 + 0.15
                });
            }
        }
        function draw() {
            const w = canvas.width / (window.devicePixelRatio || 1);
            const h = canvas.height / (window.devicePixelRatio || 1);
            ctx.clearRect(0, 0, w, h);
            particles.forEach(p => {
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
                if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0,240,255,${p.o})`;
                ctx.fill();
            });
            raf = requestAnimationFrame(draw);
        }
        resize();
        if (!prefersReducedMotion) draw();
        let t;
        window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(resize, 120); });
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) cancelAnimationFrame(raf);
            else if (!prefersReducedMotion) draw();
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

        if (isMobile || prefersReducedMotion) return;

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
            { id: 'Frontend', label: 'Frontend', icon: 'fa-layer-group', desc: 'HTML • CSS • JavaScript • React', count: '3 stack', color: '#00f0ff' },
            { id: 'Backend', label: 'Backend', icon: 'fa-server', desc: 'PHP • Node.js • Python', count: '3 stack', color: '#7b2fff' },
            { id: 'Database', label: 'Database', icon: 'fa-database', desc: 'MySQL • PostgreSQL • Redis', count: '1 core', color: '#2ecc71' },
            { id: 'API', label: 'API', icon: 'fa-code-branch', desc: 'REST API • GraphQL • JSON', count: 'REST', color: '#ffd700' },
            { id: 'UI/UX', label: 'UI/UX', icon: 'fa-palette', desc: 'Figma • Responsive • Motion', count: 'Design', color: '#ff7ab6' },
            { id: 'Deployment', label: 'Deployment', icon: 'fa-rocket', desc: 'Git • GitHub • Vercel', count: '3 tools', color: '#ff006e' }
        ];

        const center = { x: 400, y: 250, id: 'center', label: 'FULL STACK', icon: 'fa-infinity', desc: 'End-to-end development' };

        // layout calc
        function getLayout() {
            const isNarrow = window.innerWidth < 769;
            const cx = 400, cy = isNarrow ? 175 : 250;
            const rx = isNarrow ? 150 : 250;
            // compensate for preserveAspectRatio=none stretch (container aspect vs viewBox)
            const vizEl = document.getElementById('skillViz');
            let ry = isNarrow ? 135 : 175;
            if (isNarrow && vizEl) {
                const w = vizEl.clientWidth || 400;
                const h = vizEl.clientHeight || 500;
                const scaleX = w / 800;
                const scaleY = h / 500;
                const desiredVisualRy = rx * 0.85; // make visual ~circular
                ry = desiredVisualRy * (scaleX / scaleY);
                ry = Math.max(62, Math.min(110, ry));
            }
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
            div.innerHTML = `
                <span class="node-pulse" style="--pulse-delay:${Math.random()*1.2}s"></span>
                <i class="fas ${data.icon} node-icon" aria-hidden="true"></i>
                <span class="node-label">${data.label}</span>
                ${!isCenter ? `<span class="node-count">${data.count}</span>` : `<span class="node-count" style="font-size:0.6rem; letter-spacing:1px; opacity:0.8">CORE</span>`}
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
            catNodes.forEach(node => {
                const cat = node.dataset.cat;
                const show = () => {
                    // active line
                    lineEls.forEach(l => l.classList.toggle('active', l.dataset.cat === cat));
                    // active node
                    catNodes.forEach(n => n.classList.toggle('active', n.dataset.cat === cat));
                    // tooltip
                    const data = categories.find(c => c.id === cat);
                    if (data && tooltip) {
                        tooltip.querySelector('.tooltip-category').textContent = data.id;
                        tooltip.querySelector('.tooltip-title').textContent = data.label;
                        tooltip.querySelector('.tooltip-desc').textContent = data.desc;
                        tooltip.classList.add('visible');
                        tooltip.setAttribute('aria-hidden', 'false');
                    }
                    // particle boost
                    particleEls.forEach(p => {
                        if (p.el.dataset.cat === cat) p.el.style.opacity = '1';
                    });
                };
                const hide = () => {
                    lineEls.forEach(l => l.classList.remove('active'));
                    catNodes.forEach(n => n.classList.remove('active'));
                    if (tooltip) {
                        tooltip.classList.remove('visible');
                        tooltip.setAttribute('aria-hidden', 'true');
                    }
                    particleEls.forEach(p => p.el.style.opacity = p.el.dataset.cat === cat ? '0.7' : '0');
                };
                node.addEventListener('mouseenter', show);
                node.addEventListener('mouseleave', hide);
                node.addEventListener('focus', show);
                node.addEventListener('blur', hide);
            });

            // center hover lights all
            const centerNode = nodesWrap.querySelector('.skill-node-center');
            if (centerNode) {
                centerNode.addEventListener('mouseenter', () => {
                    lineEls.forEach(l => l.classList.add('active'));
                    if (tooltip) {
                        tooltip.querySelector('.tooltip-category').textContent = 'CORE';
                        tooltip.querySelector('.tooltip-title').textContent = 'Full-Stack Core';
                        tooltip.querySelector('.tooltip-desc').textContent = 'Connecting all domains into one system';
                        tooltip.classList.add('visible');
                    }
                });
                centerNode.addEventListener('mouseleave', () => {
                    lineEls.forEach(l => l.classList.remove('active'));
                    if (tooltip) tooltip.classList.remove('visible');
                });
            }
        }

        // animate particles along lines
        let raf;
        function animateParticles() {
            if (prefersReducedMotion) {
                particleEls.forEach(p => p.el.style.opacity = '0.5');
                return;
            }
            const speed = 0.0035;
            function frame() {
                particleEls.forEach(p => {
                    p.progress += speed * (0.7 + Math.random()*0.6);
                    if (p.progress > 1) p.progress = 0;
                    const line = lineEls[p.idx];
                    if (!line) return;
                    const x1 = parseFloat(line.getAttribute('x1'));
                    const y1 = parseFloat(line.getAttribute('y1'));
                    const x2 = parseFloat(line.getAttribute('x2'));
                    const y2 = parseFloat(line.getAttribute('y2'));
                    const x = x1 + (x2 - x1) * p.progress;
                    const y = y1 + (y2 - y1) * p.progress;
                    p.el.setAttribute('cx', x);
                    p.el.setAttribute('cy', y);
                    // fade near ends
                    const fade = Math.sin(p.progress * Math.PI);
                    p.el.style.opacity = String(0.2 + fade * 0.8);
                });
                raf = requestAnimationFrame(frame);
            }
            frame();
        }

        build();
        animateParticles();

        // parallax on mouse move for nodes (desktop only)
        if (!isMobile && !prefersReducedMotion) {
            viz.addEventListener('mousemove', (e) => {
                const rect = viz.getBoundingClientRect();
                const mx = (e.clientX - rect.left) / rect.width - 0.5;
                const my = (e.clientY - rect.top) / rect.height - 0.5;
                nodesWrap.querySelectorAll('.skill-node').forEach((n, i) => {
                    const depth = n.classList.contains('skill-node-center') ? 6 : 10 + (i % 3) * 4;
                    n.style.transform = `translate(-50%, -50%) translate(${mx * depth}px, ${my * depth}px) ${n.classList.contains('active') ? 'scale(1.14)' : ''}`;
                });
                svg.style.transform = `translate(${mx * -8}px, ${my * -6}px)`;
            });
            viz.addEventListener('mouseleave', () => {
                nodesWrap.querySelectorAll('.skill-node').forEach(n => {
                    n.style.transform = 'translate(-50%, -50%)';
                });
                svg.style.transform = 'translate(0,0)';
            });
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

        if (!isMobile && !prefersReducedMotion) {
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

    function renderFeatured(p) {
        const bg = gradientMap[p.image] || gradientMap['gradient-a'];
        const techs = p.technologies.map((t,i) => `<span class="tech-pill ${i<3?'highlight':''}">${t}</span>`).join('');
        return `
        <article class="featured-project" data-project-id="${p.id}" tabindex="0" aria-label="View ${p.title} details" role="button">
            <div class="featured-preview">
                <div class="browser-bar">
                    <div class="browser-dots"><span></span><span></span><span></span></div>
                    <div class="browser-url"><i class="fas fa-lock"></i> ${p.id}.vercel.app — Preview</div>
                </div>
                <div class="preview-stage">
                    <div class="preview-bg" style="background:${bg}"></div>
                    <div class="preview-icon-wrap"><i class="fas ${p.icon}"></i></div>
                    <div class="preview-overlay"><span><i class="fas fa-eye"></i> View Case Study</span></div>
                </div>
            </div>
            <div class="featured-info">
                <span class="featured-badge"><i class="fas fa-star"></i> FEATURED • ${p.year}</span>
                <h3 class="featured-title">${p.title}</h3>
                <p class="featured-desc">${p.description}</p>
                <div class="featured-techs">${techs}</div>
                <div class="featured-actions">
                    <a href="${p.demo}" class="btn-solid-sm" target="_blank" rel="noopener" onclick="event.stopPropagation()"><i class="fas fa-external-link-alt"></i> Live Demo</a>
                    <a href="${p.github}" class="btn-ghost" target="_blank" rel="noopener" onclick="event.stopPropagation()"><i class="fab fa-github"></i> GitHub</a>
                    <button class="btn-ghost" data-open-modal="${p.id}" aria-label="Open details"><i class="fas fa-arrow-right"></i> Details</button>
                </div>
            </div>
        </article>`;
    }

    function renderCard(p, spanClass, index) {
        const bg = gradientMap[p.image] || gradientMap['gradient-b'];
        const techs = p.technologies.slice(0,3).map(t => `<span class="tech-pill">${t}</span>`).join('');
        const extra = p.technologies.length > 3 ? `<span class="tech-pill">+${p.technologies.length-3}</span>` : '';
        return `
        <article class="project-card ${spanClass}" data-project-id="${p.id}" tabindex="0" role="button" aria-label="View ${p.title} details">
            <div class="card-preview">
                <div class="card-preview-bg" style="background:${bg}"></div>
                <div class="card-preview-icon"><i class="fas ${p.icon}"></i></div>
                <div class="card-overlay"><span><i class="fas fa-eye"></i> View Project</span></div>
            </div>
            <div class="card-body">
                <span class="card-eyebrow">${p.category} • ${p.year}</span>
                <h3 class="card-title">${p.title}</h3>
                <p class="card-desc">${p.description}</p>
                <div class="card-techs">${techs}${extra}</div>
                <div class="card-footer">
                    <button class="card-cta">View detail <i class="fas fa-arrow-right"></i></button>
                    <div class="card-links">
                        <a href="${p.github}" class="card-link" target="_blank" rel="noopener" aria-label="GitHub" onclick="event.stopPropagation()"><i class="fab fa-github"></i></a>
                        <a href="${p.demo}" class="card-link" target="_blank" rel="noopener" aria-label="Live demo" onclick="event.stopPropagation()"><i class="fas fa-external-link-alt"></i></a>
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
        let particles = [];
        let raf;
        function resize() {
            const rect = canvas.parentElement.getBoundingClientRect();
            canvas.width = rect.width * (window.devicePixelRatio || 1);
            canvas.height = rect.height * (window.devicePixelRatio || 1);
            canvas.style.width = rect.width + 'px';
            canvas.style.height = rect.height + 'px';
            ctx.setTransform(window.devicePixelRatio || 1, 0, 0, window.devicePixelRatio || 1, 0, 0);
            create();
        }
        function create() {
            particles = [];
            const w = canvas.width / (window.devicePixelRatio || 1);
            const h = canvas.height / (window.devicePixelRatio || 1);
            const count = isMobile ? 14 : 26;
            for (let i=0;i<count;i++) particles.push({ x: Math.random()*w, y: Math.random()*h, r: Math.random()*1.4+0.3, vx:(Math.random()-0.5)*0.25, vy:(Math.random()-0.5)*0.25, o: Math.random()*0.35+0.12, c: Math.random()>0.5?'0,240,255':'123,47,255' });
        }
        function draw() {
            const w = canvas.width / (window.devicePixelRatio || 1);
            const h = canvas.height / (window.devicePixelRatio || 1);
            ctx.clearRect(0,0,w,h);
            particles.forEach(p=>{ p.x+=p.vx; p.y+=p.vy; if(p.x<0)p.x=w; if(p.x>w)p.x=0; if(p.y<0)p.y=h; if(p.y>h)p.y=0; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle=`rgba(${p.c},${p.o})`; ctx.fill(); });
            raf=requestAnimationFrame(draw);
        }
        resize(); draw();
        let t; window.addEventListener('resize', ()=>{ clearTimeout(t); t=setTimeout(resize,120); });
        document.addEventListener('visibilitychange', ()=>{ if(document.hidden) cancelAnimationFrame(raf); else draw(); });
    }

    // Modal logic
    let lastFocus = null;
    function openProjectModal(id) {
        const data = projectsData.find(p => p.id === id);
        if (!data) return;
        const modal = document.getElementById('projectModal');
        const content = document.getElementById('modalContent');
        if (!modal || !content) return;
        const bg = gradientMap[data.image] || gradientMap['gradient-a'];
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
                    <h4><i class="fas fa-align-left"></i> About Project</h4>
                    <p style="color:var(--text-secondary); line-height:1.7; font-size:0.94rem;">${data.description} ${data.longDescription}</p>
                </div>
                <div class="modal-section">
                    <h4><i class="fas fa-list-check"></i> Key Features</h4>
                    <ul class="modal-features">${data.features.map(f=>`<li>${f}</li>`).join('')}</ul>
                </div>
                <div class="modal-section">
                    <h4><i class="fas fa-layer-group"></i> Technologies</h4>
                    <div class="modal-techs">${data.technologies.map(t=>`<span class="tech-pill highlight">${t}</span>`).join('')}</div>
                </div>
                <div class="challenge-grid">
                    <div class="challenge-card">
                        <h5 class="challenge"><i class="fas fa-triangle-exclamation"></i> Challenge</h5>
                        <p>${data.challenges}</p>
                    </div>
                    <div class="challenge-card">
                        <h5 class="solution"><i class="fas fa-lightbulb"></i> Solution</h5>
                        <p>${data.solutions}</p>
                    </div>
                </div>
                <div class="modal-actions">
                    <a href="${data.demo}" target="_blank" rel="noopener" class="btn-solid-sm"><i class="fas fa-external-link-alt"></i> Live Demo</a>
                    <a href="${data.github}" target="_blank" rel="noopener" class="btn-ghost"><i class="fab fa-github"></i> View Code</a>
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

        // subtle particles bg
        if (expCanvas && !prefersReducedMotion) {
            const ctx = expCanvas.getContext('2d');
            let particles = [], raf;
            function resize() {
                const r = expCanvas.parentElement.getBoundingClientRect();
                expCanvas.width = r.width * (window.devicePixelRatio || 1);
                expCanvas.height = r.height * (window.devicePixelRatio || 1);
                expCanvas.style.width = r.width + 'px';
                expCanvas.style.height = r.height + 'px';
                ctx.setTransform(window.devicePixelRatio || 1, 0, 0, window.devicePixelRatio || 1, 0, 0);
                particles = [];
                const count = isMobile ? 12 : 22;
                const w = r.width, h = r.height;
                for (let i=0;i<count;i++) particles.push({x:Math.random()*w, y:Math.random()*h, r:Math.random()*1.3+0.3, vx:(Math.random()-0.5)*0.2, vy:(Math.random()-0.5)*0.2, o:Math.random()*0.25+0.08});
            }
            function draw() {
                const w = expCanvas.width/(window.devicePixelRatio||1), h = expCanvas.height/(window.devicePixelRatio||1);
                ctx.clearRect(0,0,w,h);
                particles.forEach(p=>{ p.x+=p.vx; p.y+=p.vy; if(p.x<0)p.x=w; if(p.x>w)p.x=0; if(p.y<0)p.y=h; if(p.y>h)p.y=0; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle=`rgba(123,47,255,${p.o})`; ctx.fill(); });
                raf=requestAnimationFrame(draw);
            }
            resize(); draw();
            let t; window.addEventListener('resize',()=>{clearTimeout(t); t=setTimeout(resize,120);});
            document.addEventListener('visibilitychange',()=>{ if(document.hidden) cancelAnimationFrame(raf); else draw(); });
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

        // progress line on scroll
        let ticking=false;
        function updateProgress(){
            const rect = timeline.getBoundingClientRect();
            const vh = window.innerHeight;
            const total = rect.height;
            const visibleTop = Math.max(0, vh/2 - rect.top); // center based progress
            // alternative: progress based on how much timeline scrolled into view
            const start = rect.top - vh*0.6;
            const end = rect.bottom - vh*0.4;
            const scrolled = Math.min(Math.max(0, -start), total + (vh*0.2));
            const pct = Math.min(1, Math.max(0, scrolled / (total + vh*0.1)));
            progress.style.height = (pct * 100) + '%';
            // highlight active item based on center
            const centerY = vh * 0.5;
            let activeIdx = -1;
            items.forEach((item, idx)=>{
                const r = item.getBoundingClientRect();
                if(r.top < centerY && r.bottom > centerY*0.3) activeIdx = idx;
            });
            items.forEach((it,i)=> it.classList.toggle('active', i===activeIdx));
            ticking=false;
        }
        window.addEventListener('scroll', ()=>{
            if(!ticking){ requestAnimationFrame(updateProgress); ticking=true; }
        }, {passive:true});
        window.addEventListener('resize', updateProgress);
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

        // mobile quality reduction — capped for 60fps
        const lowQuality = isLowEnd;
        const pixelRatio = perfPixelRatio;
        const particleCount = lowQuality ? 70 : 180;
        const floatCount = lowQuality ? 2 : 5;

        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x050510, 0.035);

        const camera = new THREE.PerspectiveCamera(58, section.clientWidth / section.clientHeight, 0.1, 100);
        camera.position.set(0, 0.6, 7.2);

        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: !lowQuality });
        renderer.setPixelRatio(pixelRatio);
        renderer.setSize(section.clientWidth, section.clientHeight);
        renderer.setClearColor(0x050510, 0);

        // grid
        const gridGeo = new THREE.PlaneGeometry(36, 36, lowQuality? 18:32, lowQuality? 18:32);
        const gridMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, wireframe: true, transparent: true, opacity: 0.07 });
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
        // touch drag
        let dragging=false, lastX=0;
        section.addEventListener('touchstart', (e)=>{ dragging=true; lastX=e.touches[0].clientX; }, {passive:true});
        section.addEventListener('touchmove', (e)=>{
            if(!dragging) return;
            const dx = e.touches[0].clientX - lastX;
            targetRotY += dx * 0.008;
            lastX = e.touches[0].clientX;
        }, {passive:true});
        section.addEventListener('touchend', ()=> dragging=false);

        window.addEventListener('scroll', ()=>{
            const rect = section.getBoundingClientRect();
            const vh = window.innerHeight;
            if(rect.top < vh && rect.bottom > 0){
                const prog = 1 - Math.abs((rect.top + rect.height/2 - vh/2) / (vh*0.6));
                targetWarp = Math.max(0, Math.min(1, prog)) * 0.9;
            }
        }, {passive:true});

        let raf;
        function animate(){
            raf=requestAnimationFrame(animate);
            const t = Date.now()*0.001;

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

            // grid subtle wave
            const posAttr = gridGeo.attributes.position;
            // avoid heavy per-vertex every frame on lowQuality — skip wave there
            if(!lowQuality){
                for(let i=0;i<posAttr.count;i++){
                    const ox = posAttr.getX(i), oy = posAttr.getY(i);
                    // original z is 0 plane, add wave based on distance
                    const dist = Math.sqrt(ox*ox + oy*oy);
                    posAttr.setZ(i, Math.sin(dist*0.55 - t*1.4)*0.14 * (1 - dist/20));
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
            camera.position.z = 7.2 - warp*1.1;
            camera.position.x = curRotY * 0.9;
            camera.position.y = 0.6 + curRotX * 0.5;
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
            animate();
        } else {
            renderer.render(scene,camera);
        }

        // resize
        let rt;
        window.addEventListener('resize', ()=>{
            clearTimeout(rt);
            rt=setTimeout(()=>{
                camera.aspect = section.clientWidth / section.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(section.clientWidth, section.clientHeight);
                renderer.setPixelRatio(perfPixelRatio);
            },120);
        }, {passive:true});

        document.addEventListener('visibilitychange', ()=>{
            if(document.hidden) cancelAnimationFrame(raf);
            else if(!prefersReducedMotion) animate();
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

        // bg canvas subtle
        if (canvasEl && !prefersReducedMotion) {
            const ctx = canvasEl.getContext('2d');
            let parts = [], raf;
            function resize() {
                const r = canvasEl.parentElement.getBoundingClientRect();
                canvasEl.width = r.width * (window.devicePixelRatio||1);
                canvasEl.height = r.height * (window.devicePixelRatio||1);
                canvasEl.style.width = r.width+'px';
                canvasEl.style.height = r.height+'px';
                ctx.setTransform(window.devicePixelRatio||1,0,0,window.devicePixelRatio||1,0,0);
                parts = [];
                const c = isMobile?10:18;
                for(let i=0;i<c;i++) parts.push({x:Math.random()*r.width, y:Math.random()*r.height, r:Math.random()*1.2+0.4, vx:(Math.random()-0.5)*0.18, vy:(Math.random()-0.5)*0.18, o:Math.random()*0.22+0.06});
            }
            function draw(){
                const w = canvasEl.width/(window.devicePixelRatio||1), h=canvasEl.height/(window.devicePixelRatio||1);
                ctx.clearRect(0,0,w,h);
                parts.forEach(p=>{ p.x+=p.vx; p.y+=p.vy; if(p.x<0)p.x=w; if(p.x>w)p.x=0; if(p.y<0)p.y=h; if(p.y>h)p.y=0; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle=`rgba(0,240,255,${p.o})`; ctx.fill(); });
                raf=requestAnimationFrame(draw);
            }
            resize(); draw();
            window.addEventListener('resize', resize);
            document.addEventListener('visibilitychange',()=>{ if(document.hidden) cancelAnimationFrame(raf); else draw(); });
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
                addLine(`<span class="iterm-out-title">Available commands:</span>`, 'iterm-line--help');
                addLine(`  <span class="iterm-cmd">about</span>    — show programmer info`, 'iterm-line--out');
                addLine(`  <span class="iterm-cmd">skills</span>   — scroll to Tech Stack`, 'iterm-line--out');
                addLine(`  <span class="iterm-cmd">projects</span> — scroll to Projects`, 'iterm-line--out');
                addLine(`  <span class="iterm-cmd">contact</span>  — scroll to Contact`, 'iterm-line--out');
                addLine(`  <span class="iterm-cmd">clear</span>    — clear terminal`, 'iterm-line--out');
                addLine(`  <span class="iterm-cmd">help</span>     — show this help`, 'iterm-line--out');
            } else if(cmd === 'about'){
                addLine(`<span class="iterm-out-title">Ahmad Dhia — Full-Stack Developer</span>`, 'iterm-line--success');
                addLine(`  Location : Indonesia`, 'iterm-line--out');
                addLine(`  Role     : Full-Stack Developer`, 'iterm-line--out');
                addLine(`  Focus    : Web Development, Performance, DX`, 'iterm-line--out');
                addLine(`  Stack    : JavaScript • Node.js • PHP • MySQL • Python`, 'iterm-line--out');
                addLine(`  Status   : <span style="color:#7CFFB2">Available for work</span> — let's build something great.`, 'iterm-line--out');
                addLine(`  Tip: type <span class="iterm-cmd">projects</span> to see work`, 'iterm-line--out');
            } else if(cmd === 'skills'){
                addLine(`→ Navigating to <span class="iterm-cmd">Tech Stack</span>...`, 'iterm-line--success');
                setTimeout(()=> document.getElementById('skills')?.scrollIntoView({behavior:'smooth', block:'start'}), 220);
            } else if(cmd === 'projects'){
                addLine(`→ Opening <span class="iterm-cmd">Projects</span>...`, 'iterm-line--success');
                setTimeout(()=> document.getElementById('projects')?.scrollIntoView({behavior:'smooth', block:'start'}), 220);
            } else if(cmd === 'contact'){
                addLine(`→ Jumping to <span class="iterm-cmd">Contact</span>...`, 'iterm-line--success');
                setTimeout(()=> document.getElementById('contact')?.scrollIntoView({behavior:'smooth', block:'start'}), 220);
            } else if(cmd === 'clear'){
                log.innerHTML = '';
            } else {
                addLine(`command not found: <span class="iterm-cmd">${escapeHtml(cmd)}</span> — type <span class="iterm-cmd">help</span>`, 'iterm-line--error');
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

        win.addEventListener('click', ()=> input.focus());

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
                if(ent.isIntersecting) setTimeout(()=> input.focus(), 400);
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

        // bg canvas
        if(contactCanvas && !prefersReducedMotion){
            const ctx = contactCanvas.getContext('2d');
            let parts=[], raf;
            function resize(){
                const r = contactCanvas.parentElement.getBoundingClientRect();
                contactCanvas.width = r.width*(window.devicePixelRatio||1);
                contactCanvas.height = r.height*(window.devicePixelRatio||1);
                contactCanvas.style.width=r.width+'px';
                contactCanvas.style.height=r.height+'px';
                ctx.setTransform(window.devicePixelRatio||1,0,0,window.devicePixelRatio||1,0,0);
                parts=[];
                const c = isMobile?10:18;
                for(let i=0;i<c;i++) parts.push({x:Math.random()*r.width, y:Math.random()*r.height, r:Math.random()*1.2+0.4, vx:(Math.random()-0.5)*0.18, vy:(Math.random()-0.5)*0.18, o:Math.random()*0.20+0.06});
            }
            function draw(){
                const w=contactCanvas.width/(window.devicePixelRatio||1), h=contactCanvas.height/(window.devicePixelRatio||1);
                ctx.clearRect(0,0,w,h);
                parts.forEach(p=>{ p.x+=p.vx; p.y+=p.vy; if(p.x<0)p.x=w; if(p.x>w)p.x=0; if(p.y<0)p.y=h; if(p.y>h)p.y=0; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle=`rgba(0,240,255,${p.o})`; ctx.fill(); });
                raf=requestAnimationFrame(draw);
            }
            resize(); draw();
            window.addEventListener('resize', resize, {passive:true});
            document.addEventListener('visibilitychange',()=>{ if(document.hidden) cancelAnimationFrame(raf); else draw(); });
            observeVisibility(document.getElementById('contact'), ()=>{ if(!raf) draw(); }, ()=>{ if(raf){ cancelAnimationFrame(raf); raf=null; } });
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
                btnTextEl.textContent = 'Sending...';
                if(btnIconEl) btnIconEl.style.opacity='0';
                submit.setAttribute('aria-busy','true');
            } else if(state==='success'){
                submit.classList.add('is-success');
                btnTextEl.textContent = 'Message Sent ✓';
                if(btnIconEl){ btnIconEl.className='fas fa-check'; btnIconEl.style.opacity='1'; btnIconEl.style.transform='scale(1.1)'; }
                submit.disabled = true;
                btnResetTimer = setTimeout(()=> setButtonState('idle'), 2400);
            } else if(state==='error'){
                submit.classList.add('is-error');
                btnTextEl.textContent = 'Try Again';
                if(btnIconEl){ btnIconEl.className='fas fa-rotate-right'; btnIconEl.style.opacity='1'; }
                btnResetTimer = setTimeout(()=> setButtonState('idle'), 2200);
            } else {
                // idle
                btnTextEl.textContent = 'Send Message';
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
                setFieldError(nameEl,'errName', !name ? 'Name is required.' : 'Name must be at least 2 characters.');
                valid=false; firstInvalid = firstInvalid || nameEl;
            } else if(name.length > 100){
                setFieldError(nameEl,'errName','Name must be under 100 characters.');
                valid=false; firstInvalid = firstInvalid || nameEl;
            }

            const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(!email){
                setFieldError(emailEl,'errEmail','Email is required.');
                valid=false; firstInvalid = firstInvalid || emailEl;
            } else if(!emailRe.test(email)){
                setFieldError(emailEl,'errEmail','Please enter a valid email address.');
                valid=false; firstInvalid = firstInvalid || emailEl;
            } else if(email.length > 254){
                setFieldError(emailEl,'errEmail','Email is too long.');
                valid=false; firstInvalid = firstInvalid || emailEl;
            }

            // Subject optional — sesuai spec terbaru: hanya nama/email/pesan wajib; jika diisi validasi 3-200
            if(subject){
                if(subject.length < 3){
                    setFieldError(subjectEl,'errSubject','Subject must be at least 3 characters.');
                    valid=false; firstInvalid = firstInvalid || subjectEl;
                } else if(subject.length > 200){
                    setFieldError(subjectEl,'errSubject','Subject must be under 200 characters.');
                    valid=false; firstInvalid = firstInvalid || subjectEl;
                }
            } else {
                // kosongkan error jika optional dan tidak diisi
                setFieldError(subjectEl,'errSubject','');
            }

            if(!message){
                setFieldError(msgEl,'errMessage','Message is required.');
                valid=false; firstInvalid = firstInvalid || msgEl;
            } else if(message.length < 10){
                setFieldError(msgEl,'errMessage','Message must be at least 10 characters.');
                valid=false; firstInvalid = firstInvalid || msgEl;
            } else if(message.length > 5000){
                setFieldError(msgEl,'errMessage','Message must be under 5000 characters.');
                valid=false; firstInvalid = firstInvalid || msgEl;
            }

            return { valid, firstInvalid };
        }

        // v12.3 — debug total: log version agar tahu deployment terbaru ter-load
        console.log('[contact] initContact v12.3 — TO mfarhanmuizaddin@gmail.com via Resend, strict success check');
        // Pastikan honeypot kosong saat load — cegah autofill browser yang sebabkan fake success tanpa email
        const honeyInit = form.querySelector('input[name="website"]');
        if (honeyInit) {
            honeyInit.value = '';
            // double clear after short delay (beberapa browser autofill setelah load)
            setTimeout(()=> { if (honeyInit) honeyInit.value = ''; }, 500);
        }

        form.addEventListener('submit', async (e)=>{
            e.preventDefault();
            console.log('[contact] submit intercepted — honeypot check, validation, fetch /api/contact');
            // Honeypot check first — silent return, no error shown to bot
            const honey = form.querySelector('input[name="website"]');
            if(honey && honey.value.trim()){
                console.warn('[contact] honeypot filled — treating as spam, not sending', { value: honey.value });
                // Pretend success for bot — jangan kirim email
                showToast('Message sent successfully.', 'success');
                return;
            }

            const { valid, firstInvalid } = validateFrontend();
            if(!valid){
                showToast('Please fix the highlighted fields.', 'error');
                if(firstInvalid) firstInvalid.focus();
                // shake button for feedback
                if(submit){ submit.classList.add('is-error'); setTimeout(()=> submit.classList.remove('is-error'), 420); }
                return;
            }

            // Offline check
            if(typeof navigator !== 'undefined' && navigator.onLine === false){
                showToast('Unable to send your message. Please check your connection and try again.', 'error');
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

            setButtonState('loading');

            const controller = new AbortController();
            const timeoutId = setTimeout(()=> controller.abort(), 15000);

            try {
                console.log('[contact] fetching /api/contact', { payload: { ...payload, website: payload.website ? '[filled honeypot]' : '' } });
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
                    try{ data = JSON.parse(txt); } catch{ data = { error: txt || res.statusText, message: txt || res.statusText }; }
                }

                console.log('[contact] response', { status: res.status, ok: res.ok, data });

                // STRICT: hanya success true yang dianggap berhasil — cegah false positive
                // Sesuai spec: if (!response.ok || !result.success) throw
                if(!res.ok || !data || data.success !== true){
                    // Pastikan error ditampilkan, bukan success palsu
                    if(res.status===400 && data && data.fields){
                        Object.entries(data.fields).forEach(([field, msg])=>{
                            const map = { name:'errName', email:'errEmail', subject:'errSubject', message:'errMessage' };
                            const inputMap = { name:nameEl, email:emailEl, subject:subjectEl, message:msgEl };
                            if(map[field]) setFieldError(inputMap[field], map[field], msg);
                        });
                        showToast(data.message || data.error || 'Invalid form data. Please check the highlighted fields.', 'error');
                    } else if(res.status===400){
                        showToast(data.message || data.error || 'Invalid form data.', 'error');
                    } else if(res.status===429){
                        showToast(data.message || data.error || 'Too many messages. Please wait a few minutes and try again.', 'error');
                    } else if(res.status===413){
                        showToast(data.message || data.error || 'Message is too large. Please shorten it and try again.', 'error');
                    } else if(res.status===405){
                        showToast(data.message || data.error || 'Method not allowed.', 'error');
                    } else if(res.status>=500){
                        showToast(data.message || 'Something went wrong on our side. Please try again later.', 'error');
                    } else {
                        const msg = data.message || data.error || 'Unable to send your message. Please try again.';
                        showToast(msg, 'error');
                    }
                    console.warn('[contact] server response (error path)', { status: res.status, data });
                    setButtonState('error');
                    return;
                }

                // HANYA jika benar-benar success === true
                console.log('[contact] SUCCESS — email queued, Resend ID:', data.id);
                showToast('Message sent successfully.', 'success');
                form.reset();
                updateCount();
                clearErrors();
                setButtonState('success');
                return;
            } catch(err){
                clearTimeout(timeoutId);
                console.error('[contact] fetch error', err);
                if(err && err.name==='AbortError'){
                    showToast('Request timed out. Please try again.', 'error');
                } else if(typeof navigator !== 'undefined' && navigator.onLine === false){
                    showToast('Unable to send your message. Please check your connection and try again.', 'error');
                } else if(err instanceof TypeError && /fetch|network|Failed to fetch/i.test(String(err.message||''))){
                    showToast('Unable to send your message. Please check your connection and try again.', 'error');
                } else {
                    showToast('Something went wrong. Please try again.', 'error');
                }
                setButtonState('error');
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
    // INIT ALL
    // ============================================
    function initAll() {
        initNavbar();
        initHeroCanvas();
        initThreeJS();
        initNoise();
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
    }

    // ============================================
    // START
    // ============================================
    document.addEventListener('DOMContentLoaded', () => {
        initLoader();
    });

})();
