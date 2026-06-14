document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initSmoothScroll();
    initServicesEffect();
    initCursorEffect();
    initFormHandler();
});

function initFormHandler() {
    const form = document.getElementById('contactForm');
    const statusDiv = document.getElementById('form-status');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalBtnText = btn.innerText;
            
            // 1. Get data
            const formData = new FormData(form);
            
            // 2. UI Loading State
            btn.innerText = 'Sending...';
            btn.disabled = true;
            statusDiv.className = 'form-status'; // Reset
            statusDiv.innerText = '';

            // 3. Send to Formspree
            const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xjgegebq'; 

            try {
                const response = await fetch(FORMSPREE_ENDPOINT, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Success
                    statusDiv.classList.add('success');
                    statusDiv.innerText = 'Thank you! Your message has been sent successfully.';
                    form.reset();
                } else {
                    // Error from server
                    const data = await response.json();
                    if (Object.hasOwn(data, 'errors')) {
                        statusDiv.classList.add('error');
                        statusDiv.innerText = data["errors"].map(error => error["message"]).join(", ");
                    } else {
                        statusDiv.classList.add('error');
                        statusDiv.innerText = 'Oops! There was a problem submitting your form.';
                    }
                }
            } catch (error) {
                // Network error
                statusDiv.classList.add('error');
                statusDiv.innerText = 'Oops! There was a problem submitting your form. Please check your internet connection.';
            } finally {
                // Reset button
                btn.innerText = originalBtnText;
                btn.disabled = false;
            }
        });
    }
}

function initCursorEffect() {
    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    const outline = document.createElement('div');
    outline.className = 'cursor-outline';
    document.body.appendChild(dot);
    document.body.appendChild(outline);

    function parseRgbColor(color) {
        const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (!match) return null;
        return {
            r: Number(match[1]),
            g: Number(match[2]),
            b: Number(match[3]),
            a: match[4] !== undefined ? Number(match[4]) : 1
        };
    }

    function isDarkBackground(element) {
        let node = element;

        while (node && node !== document.documentElement) {
            const style = window.getComputedStyle(node);
            const bg = style.backgroundColor;

            if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'inherit') {
                const rgb = parseRgbColor(bg);
                if (rgb && rgb.a > 0) {
                    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
                    return brightness < 140;
                }
            }
            node = node.parentElement;
        }

        return false;
    }

    function updateCursorColor(clientX, clientY) {
        const target = document.elementFromPoint(clientX, clientY);
        if (!target) return;

        const shouldUseWhite = isDarkBackground(target);
        document.body.classList.toggle('dark-cursor', shouldUseWhite);
    }

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        dot.style.left = `${posX}px`;
        dot.style.top = `${posY}px`;

        outline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: 'forwards' });

        updateCursorColor(posX, posY);
    });
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

    if (!('IntersectionObserver' in window)) {
        section.classList.add('services-revealed');
        return;
    }

    const observer = new IntersectionObserver(entries => {
        if (started) return;
        for (const e of entries) {
            if (e.isIntersecting) {
                started = true;
                start();
                observer.disconnect();
                break;
            }
        }
    }, { threshold: 0.1 });
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

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      if (entry.target.classList.contains("dark-section")) {
        document.body.classList.add("dark-cursor");
      } else {
        document.body.classList.remove("dark-cursor");
      }
    }
  });
}, { threshold: 0.6 });

document.querySelectorAll("section").forEach(section => {
  observer.observe(section);
});

document.addEventListener("mousemove", (e) => {
  const smoke = document.createElement("div");
  smoke.className = "smoke";

  smoke.style.left = e.clientX + "px";
  smoke.style.top = e.clientY + "px";

  document.body.appendChild(smoke);

  setTimeout(() => {
    smoke.remove();
  }, 800);
});

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
}
