document.addEventListener('DOMContentLoaded', () => {
    initLogoAnimation();
    initMobileMenu();
    initSmoothScroll();
    initServicesEffect();
    initCursorEffect();
});

function initCursorEffect() {
    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    const outline = document.createElement('div');
    outline.className = 'cursor-outline';
    document.body.appendChild(dot);
    document.body.appendChild(outline);

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        dot.style.left = `${posX}px`;
        dot.style.top = `${posY}px`;

        outline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });
}

function initLogoAnimation() {
    const canvas = document.getElementById('logo-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Configuration
    const text = "KMG";
    const fontSize = 48; // Adjust based on canvas size
    const fontFamily = "'Inter', sans-serif";
    const fontWeight = "800"; // Bold for better masking
    
    // Matrix characters (Katakana + Latin)
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const charArray = chars.split("");
    
    // Animation state
    let drops = [];
    const columnWidth = 10; // Spacing between columns
    let columns = 0;
    
    function resize() {
        // High DPI scaling
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        
        // We want the canvas to match its CSS display size
        // The CSS sets width/height via attribute or style. 
        // Let's rely on the attributes set in HTML (120x60) but scale for DPI
        
        canvas.style.width = "120px";
        canvas.style.height = "60px";
        
        canvas.width = 120 * dpr;
        canvas.height = 60 * dpr;
        
        ctx.scale(dpr, dpr);
        
        // Reset columns
        columns = Math.floor(120 / columnWidth);
        drops = [];
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.floor(Math.random() * 80) - 20; // Random start including on-screen
        }
    }
    
    // resize() will be called after fonts load
    // Optional: resize listener if canvas is fluid, but here it's fixed size in header
    
    function draw() {
        // 1. Clear the canvas
        // We need to clear it completely to redraw the mask
        ctx.clearRect(0, 0, 120, 60); // Use logical coordinates
        
        // 2. Draw the Mask (The Text)
        // We draw the text in solid black. 
        // This forms the shape of the logo.
        ctx.fillStyle = "#000000";
        ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        // Center text
        ctx.fillText(text, 60, 32); // Center of 120x60
        
        // 3. Set Composite Operation
        // 'source-atop': New shapes are drawn only where they overlap the existing content.
        // The existing content is the Black Text.
        // So whatever we draw next (the rain) will only be visible INSIDE the black text.
        ctx.globalCompositeOperation = 'source-atop';
        
        // 4. Draw the Matrix Rain
        // We draw the rain in a contrasting color (White/Gray) with low opacity
        // so it looks like "digital noise" inside the letters.
        
        // Increase visibility slightly
        ctx.fillStyle = `rgba(0,0,0,0.7)`; // Increased opacity
        ctx.font = "10px monospace";
        
        for (let i = 0; i < drops.length; i++) {
            // Random character
            const char = charArray[Math.floor(Math.random() * charArray.length)];
            
            // Draw char
            const x = i * columnWidth;
            const y = drops[i] * 10; // 10px vertical spacing
            
            ctx.fillText(char, x, y);
            
            // Move drop
            if (y > 60 && Math.random() > 0.975) {
                drops[i] = -1; // Reset to top
            }
            drops[i]++;
        }
        
        // 5. Reset Composite Operation for next frame (though we clear anyway)
        ctx.globalCompositeOperation = 'source-over';
    }
    
    // Start animation
    let lastTime = 0;
    const fps = 15; // Slow down the effect
    const interval = 1000 / fps;

    function animate(currentTime) {
        requestAnimationFrame(animate);
        
        const deltaTime = currentTime - lastTime;
        if (deltaTime > interval) {
            lastTime = currentTime - (deltaTime % interval);
            draw();
        }
    }
    
    // Ensure fonts are loaded before starting
    document.fonts.ready.then(() => {
        resize();
        animate(0);
    });
    
    // Handle resize
    window.addEventListener('resize', resize);
}

function initServicesEffect() {
    const section = document.getElementById('services');
    const canvas = document.getElementById('services-canvas');
    if (!section || !canvas) return;
    const ctx = canvas.getContext('2d');
    let drops = [];
    let columns = 0;
    
    // Config: Bigger font, tighter spacing
    const fontSize = 24;
    const columnWidth = 20; // Tighter columns
    const rowHeight = 22;   // Tighter vertical spacing (eliminated gaps)
    
    const chars = "00112233445566778899";
    const charArray = chars.split("");
    
    function size() {
        const dpr = window.devicePixelRatio || 1;
        const rect = section.getBoundingClientRect();
        const w = Math.max(1, Math.floor(rect.width));
        const h = Math.max(1, Math.floor(rect.height));
        canvas.style.width = w + "px";
        canvas.style.height = h + "px";
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        columns = Math.max(1, Math.floor(w / columnWidth));
        // Initialize drops above the screen with a smaller vertical spread
        // so they fall as a single "batch" or curtain, rather than being scattered 
        // across the entire height (which looks like multiple batches).
        // Range: -25 to -10 (all start off-screen above)
        drops = new Array(columns).fill(0).map(() => Math.floor(Math.random() * 15) - 25);
    }
    
    function draw(speed) {
        const w = canvas.width / (window.devicePixelRatio || 1);
        const h = canvas.height / (window.devicePixelRatio || 1);
        let activeDrops = 0;
        
        // Clear frame completely
        ctx.clearRect(0, 0, w, h);
        
        // Font settings
        ctx.font = `bold ${fontSize}px monospace`;
        
        // Draw characters with trails
        for (let i = 0; i < drops.length; i++) {
            const x = i * columnWidth;
            
            // Draw a trail of characters to create vertical lines
            const trailLength = 12; // Length of the vertical line
            
            // Check if drop is still visible (including tail)
            // Head is at drops[i] * rowHeight
            // Tail end is at (drops[i] - trailLength) * rowHeight
            if ((drops[i] - trailLength) * rowHeight < h) {
                activeDrops++;
                
                for (let j = 0; j < trailLength; j++) {
                    const char = charArray[Math.floor(Math.random() * charArray.length)];
                    const y = (drops[i] - j) * rowHeight;
                    
                    // Only draw if on screen
                    if (y > -rowHeight && y < h + rowHeight) {
                        // Fade out the tail
                        const fade = 1 - (j / trailLength);
                        // Always full opacity for the main effect
                        const finalOpacity = fade;
                        
                        if (finalOpacity > 0.01) {
                            ctx.fillStyle = `rgba(0, 0, 0, ${finalOpacity})`;
                            ctx.fillText(char, x, y);
                        }
                    }
                }
                
                // Move drop
                drops[i] += speed;
            }
        }
        return activeDrops > 0;
    }
    
    let started = false;
    let revealed = false;
    const observer = new IntersectionObserver(entries => {
        if (started) return;
        for (const e of entries) {
            if (e.isIntersecting && e.intersectionRatio > 0.3) {
                started = true;
                start();
                observer.disconnect();
                break;
            }
        }
    }, { threshold: [0, 0.25, 0.5, 0.75, 1] });
    observer.observe(section);
    
    function start() {
        size();
        canvas.style.opacity = "1"; // Start fully visible
        
        function frame() {
            // Constant speed for uniform fall
            const speed = 0.8; 
            
            const isRunning = draw(speed);
            
            if (isRunning) {
                requestAnimationFrame(frame);
            } else {
                // Done
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                canvas.style.opacity = "0";
                if (!revealed) {
                    section.classList.add('services-revealed');
                    revealed = true;
                }
            }
        }
        requestAnimationFrame(frame);
    }
    window.addEventListener('resize', () => {
        if (started) size();
    });
}
function initMobileMenu() {
    const btn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav-list');
    const links = document.querySelectorAll('.nav-list a');
    
    if (btn && nav) {
        btn.addEventListener('click', () => {
            nav.classList.toggle('active');
            
            // Animate hamburger
            const spans = btn.querySelectorAll('span');
            if (nav.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Close menu when link clicked
        links.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                const spans = btn.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }
}

function initSmoothScroll() {
    // Basic smooth scroll handled by CSS scroll-behavior: smooth
    // This is just a fallback or enhancement if needed
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
    
    // Form submission
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your message. We will get back to you shortly.');
            form.reset();
        });
    }
}
