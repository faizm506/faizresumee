document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.getElementById("navbar");

    // Dynamic Navbar styling on scroll
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a.nav-link').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Collapse mobile menu if open
                const navbarToggler = document.querySelector('.navbar-toggler');
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    navbarToggler.click();
                }

                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // High-performance Intersection Observer for smooth reveal animations
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });
    
    // Trigger active state for elements already in viewport on load
    setTimeout(() => {
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if(rect.top < window.innerHeight) {
                el.classList.add('active');
            }
        });
    }, 100);
});

document.addEventListener("DOMContentLoaded", () => {
    
    // ... (Keep your existing Navbar and Reveal Animation code here) ...

    /* =========================================
       Neural Node Network Canvas Animation
       ========================================= */
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let animationFrameId;

    // Mouse position object
    let mouse = {
        x: null,
        y: null,
        radius: 150 // Distance for cursor to connect to nodes
    };

    // Track mouse movement over the hero section
    const heroSection = document.getElementById('about');
    heroSection.addEventListener('mousemove', function(event) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
    });

    heroSection.addEventListener('mouseleave', function() {
        mouse.x = null;
        mouse.y = null;
    });

    // Responsive Canvas Resize
    function resizeCanvas() {
        canvas.width = heroSection.offsetWidth;
        canvas.height = heroSection.offsetHeight;
        initParticles();
    }

    // Particle Object
    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }

        // Draw individual node
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        // Move nodes and bounce off edges
        update() {
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }

            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

   // Initialize Particle Array based on screen size
    function initParticles() {
        particlesArray = [];
        // Increased density for better visibility (changed from 12000 to 7000)
        let numberOfParticles = (canvas.width * canvas.height) / 7000;
        
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2.5) + 1; // Slightly larger nodes
            let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 1) - 0.5;
            let directionY = (Math.random() * 1) - 0.5;
            // Darker base particles for higher visibility against white
            let color = 'rgba(17, 17, 17, 0.4)'; 

            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    // Draw lines between close particles and the mouse
    function connectParticles() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) 
                             + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                
                if (distance < (canvas.width / 10) * (canvas.height / 10)) {
                    opacityValue = 1 - (distance / 15000); // Tighter connection radius
                    ctx.strokeStyle = 'rgba(17, 17, 17, ' + (opacityValue * 0.15) + ')'; // Darker base lines
                    ctx.lineWidth = 1.2;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
            
            // Connect to mouse with aesthetic "Nike Infrared" accent color
            if (mouse.x != null && mouse.y != null) {
                let dx = mouse.x - particlesArray[a].x;
                let dy = mouse.y - particlesArray[a].y;
                let mouseDistance = (dx * dx) + (dy * dy);
                
                if (mouseDistance < (mouse.radius * mouse.radius)) {
                    opacityValue = 1 - (mouseDistance / (mouse.radius * mouse.radius));
                    // High-visibility vivid red/orange just for the cursor
                    ctx.strokeStyle = 'rgba(255, 51, 51, ' + (opacityValue * 0.8) + ')';
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        }
    }

    // Main Animation Loop
    function animateParticles() {
        animationFrameId = requestAnimationFrame(animateParticles);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connectParticles();
    }

    // Setup and Listeners
    window.addEventListener('resize', () => {
        resizeCanvas();
    });

    resizeCanvas();
    animateParticles();
});


// terminal-logic.js

document.addEventListener("DOMContentLoaded", () => {
    const terminalBody = document.getElementById("terminal-body");
    const outputContainer = document.getElementById("output-container");
    const interactiveLine = document.getElementById("interactive-line");
    const termInput = document.getElementById("term-input");

    let isBooted = false;

    // Fully comprehensive expertise sequence
    const bootSequence = [
        {
            cmd: "ssh isro_admin@sac.remote.linux",
            output: `Authenticating Windows host... <span class="log-success">[OK]</span>
                     Welcome to ISRO Space Applications Centre (SAC).
                     Current Project: <span class="hl-string">isro_project</span>`
        },
        {
            cmd: "./deploy_core_systems.sh",
            output: `<span class="log-info">[AI/ML]</span> Deployed <span class="hl-keyword">CNNs</span> for multi-layered cloud detection.
                     <span class="log-success">[DATA]</span> Processed gigabyte-scale satellite imagery with clean data pipelines.`
        },
        {
            cmd: "cat web_and_networking_skills.log",
            output: `<span class="log-success">●</span> <span class="hl-keyword">Django Web Architecture:</span> Built custom scalable apps using advanced HTML/CSS structures.
                     <span class="log-success">●</span> <span class="hl-keyword">P2P Networks:</span> Architecting offline peer-to-peer chat applications.
                     <span class="log-success">●</span> <span class="hl-keyword">Linux Server Mgmt:</span> Maintaining robust uptime via custom bash scripts.`
        }
    ];

    const promptPrefix = `<span><span class="prompt-user">isro_admin</span>@<span class="prompt-host">sac-server</span>:<span class="prompt-dir">~/experience</span>$</span>`;
    
    // Helper to auto-scroll to bottom
    const scrollToBottom = () => { terminalBody.scrollTop = terminalBody.scrollHeight; };
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    async function runBootSequence() {
        for (let i = 0; i < bootSequence.length; i++) {
            const step = bootSequence[i];
            
            const cmdDiv = document.createElement("div");
            cmdDiv.className = "cmd-line";
            cmdDiv.innerHTML = `${promptPrefix} <span class="cmd-text"></span>`;
            outputContainer.appendChild(cmdDiv);
            
            const textSpan = cmdDiv.querySelector(".cmd-text");
            scrollToBottom();

            // Faster typing effect so the user isn't waiting forever
            for (let char of step.cmd) {
                textSpan.textContent += char;
                await sleep(25);
            }
            await sleep(200);

            // Output print
            const outDiv = document.createElement("div");
            outDiv.className = "output-block";
            outDiv.innerHTML = step.output;
            outputContainer.appendChild(outDiv);
            scrollToBottom();
            await sleep(600);
        }

        // Show input line and focus it natively
        interactiveLine.style.display = "flex";
        termInput.focus();
        scrollToBottom();
    }

    // Observer to trigger typing when section is visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !isBooted) {
                isBooted = true;
                runBootSequence();
            }
        });
    }, { threshold: 0.2 }); 

    observer.observe(document.getElementById("experience"));

    // Ensure terminal body clicks refocus the actual input field
    terminalBody.addEventListener("click", () => {
        if(isBooted) termInput.focus();
    });

    // Handle user commands seamlessly
    termInput.addEventListener("keydown", function(e) {
        if (e.key === "Enter") {
            const command = termInput.value.trim();
            termInput.value = ""; 
            
            const userCmdDiv = document.createElement("div");
            userCmdDiv.className = "cmd-line";
            userCmdDiv.innerHTML = `${promptPrefix} <span class="cmd-text">${command}</span>`;
            outputContainer.appendChild(userCmdDiv);

            const responseDiv = document.createElement("div");
            responseDiv.className = "output-block";
            
            const lowerCmd = command.toLowerCase();
            
            switch(lowerCmd) {
                case "help":
                    responseDiv.innerHTML = `Available Commands: <span class="hl-keyword">ls</span>, <span class="hl-keyword">clear</span>, <span class="hl-keyword">whoami</span>, <span class="hl-keyword">skills</span>`;
                    break;
                case "ls":
                    responseDiv.innerHTML = `<span class="hl-string">isro_project/</span>    <span class="hl-string">p2p_offline_chat.py</span>    <span class="hl-string">django_templates/</span>`;
                    break;
                case "clear":
                    outputContainer.innerHTML = "";
                    responseDiv.style.marginBottom = "0";
                    break;
                case "whoami":
                    responseDiv.innerHTML = `Developer bridging deep learning and full-stack architecture.`;
                    break;
                case "skills":
                    responseDiv.innerHTML = `<span class="hl-keyword">Python, Django, HTML/CSS, Linux, CNNs, P2P Networking, Bash</span>`;
                    break;
                case "":
                    responseDiv.style.marginBottom = "0";
                    break;
                default:
                    responseDiv.innerHTML = `bash: ${command}: command not found. Type 'help'.`;
            }

            if (responseDiv.innerHTML !== "") {
                outputContainer.appendChild(responseDiv);
            }
            scrollToBottom();
        }
    });
});