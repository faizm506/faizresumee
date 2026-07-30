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

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('cnn-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width, height;
    
    // UI Elements for live updates
    const fpsDisplay = document.getElementById('hud-fps');
    const epochDisplay = document.getElementById('hud-epoch');
    const lossDisplay = document.getElementById('live-loss');
    const classDisplay = document.getElementById('live-classification');
    
    // Interaction & Animation State
    let mouseX = 0, mouseY = 0;
    let targetRotationX = 0.15;
    let targetRotationY = -0.4;
    let rotationX = 0.15;
    let rotationY = -0.4;
    let isHovering = false;
    let frameCount = 0;
    let lastTime = performance.now();

    // Data Structures
    const nodes = [];
    const links = [];
    const pulses = []; 
    
    // ---------------------------------------------------------
    // ENHANCED 7-LAYER DEEP CNN ARCHITECTURE
    // ---------------------------------------------------------
    const layers = [
        { z: -250, rows: 7, cols: 7, spacing: 30, type: 'input' },  // 1. Raw Image Input
        { z: -150, rows: 5, cols: 5, spacing: 35, type: 'conv' },   // 2. Convolutional Layer 1
        { z: -75,  rows: 3, cols: 3, spacing: 45, type: 'pool' },   // 3. Max Pooling Layer
        { z: 0,    rows: 3, cols: 3, spacing: 45, type: 'conv' },   // 4. Convolutional Layer 2
        { z: 100,  rows: 1, cols: 12, spacing: 25, type: 'dense' }, // 5. Flattened Dense Layer 1
        { z: 175,  rows: 1, cols: 8, spacing: 30, type: 'dense' },  // 6. Hidden Dense Layer 2
        { z: 250,  rows: 1, cols: 4, spacing: 40, type: 'output' }  // 7. Output Classification
    ];

    function resize() {
        const container = canvas.parentElement;
        width = container.clientWidth;
        height = container.clientHeight;
        canvas.width = width;
        canvas.height = height;
    }
    
    window.addEventListener('resize', resize);
    resize();

    // 1. Generate Nodes
    layers.forEach((layer, layerIndex) => {
        layer.startIndex = nodes.length;
        const offsetX = (layer.cols - 1) * layer.spacing / 2;
        const offsetY = (layer.rows - 1) * layer.spacing / 2;
        
        for (let i = 0; i < layer.rows; i++) {
            for (let j = 0; j < layer.cols; j++) {
                nodes.push({
                    x: (j * layer.spacing) - offsetX,
                    y: (i * layer.spacing) - offsetY,
                    z: layer.z,
                    layer: layerIndex,
                    type: layer.type
                });
            }
        }
        layer.endIndex = nodes.length;
    });

    // 2. Generate Links (Synapses) - INCREASED DENSITY
    for (let l = 0; l < layers.length - 1; l++) {
        const currentLayer = layers[l];
        const nextLayer = layers[l + 1];
        
        for (let i = currentLayer.startIndex; i < currentLayer.endIndex; i++) {
            for (let j = nextLayer.startIndex; j < nextLayer.endIndex; j++) {
                // Lowered the drop rate so more connections are drawn (was 0.65, now 0.5)
                if (Math.random() > 0.5) { 
                    links.push({ source: i, target: j });
                }
            }
        }
    }

    // 3. Generate Floor Grid points
    const floorY = 160;
    const gridSize = 500; 
    const gridSteps = 10;
    const floorLines = [];
    
    for (let i = -gridSize; i <= gridSize; i += gridSize/gridSteps) {
        floorLines.push({ p1: {x: i, y: floorY, z: -gridSize}, p2: {x: i, y: floorY, z: gridSize} });
        floorLines.push({ p1: {x: -gridSize, y: floorY, z: i}, p2: {x: gridSize, y: floorY, z: i} });
    }

    // Mouse Events
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / width) * 2 - 1;
        mouseY = ((e.clientY - rect.top) / height) * 2 - 1;
        
        targetRotationY = mouseX * Math.PI; 
        targetRotationX = mouseY * Math.PI * 0.5; 
    });
    
    canvas.addEventListener('mouseenter', () => isHovering = true);
    canvas.addEventListener('mouseleave', () => {
        isHovering = false;
        targetRotationX = 0.15; 
    });

    // Helper: Project 3D point to 2D
    function project(x, y, z, cx, cy, cosX, sinX, cosY, sinY) {
        let x1 = x * cosY - z * sinY;
        let z1 = z * cosY + x * sinY;
        let y2 = y * cosX - z1 * sinX;
        let z2 = z1 * cosX + y * sinX;
        
        const fov = 550; 
        const scale = fov / (fov + z2);
        return {
            px: cx + x1 * scale,
            py: cy + y2 * scale,
            scale: scale,
            z: z2
        };
    }

    // 4. Main Render Loop
    function animate(time) {
        requestAnimationFrame(animate);
        
        // Clear canvas
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);
        
        // Telemetry
        frameCount++;
        if (time - lastTime >= 1000) {
            if(fpsDisplay) fpsDisplay.innerText = frameCount;
            if(epochDisplay && Math.random() > 0.4) {
                let currentEpoch = parseInt(epochDisplay.innerText);
                epochDisplay.innerText = currentEpoch + 1;
            }
            if(lossDisplay && Math.random() > 0.6) {
                let currentLoss = parseFloat(lossDisplay.innerText);
                lossDisplay.innerText = Math.max(0.0010, (currentLoss - 0.0001)).toFixed(4);
            }
            frameCount = 0;
            lastTime = time;
        }

        // Handle Rotation
        if (!isHovering) { targetRotationY += 0.002; }
        
        rotationX += (targetRotationX - rotationX) * 0.05;
        rotationY += (targetRotationY - rotationY) * 0.05;
        
        const cx = width / 2;
        const cy = height / 2;
        const cosX = Math.cos(rotationX), sinX = Math.sin(rotationX);
        const cosY = Math.cos(rotationY), sinY = Math.sin(rotationY);
        
        // Render Floor Grid
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'; // Slightly brighter floor
        ctx.beginPath();
        floorLines.forEach(line => {
            const p1 = project(line.p1.x, line.p1.y, line.p1.z, cx, cy, cosX, sinX, cosY, sinY);
            const p2 = project(line.p2.x, line.p2.y, line.p2.z, cx, cy, cosX, sinX, cosY, sinY);
            if (p1.z > -400 && p2.z > -400) {
                ctx.moveTo(p1.px, p1.py);
                ctx.lineTo(p2.px, p2.py);
            }
        });
        ctx.stroke();

        // Spawn new data pulses
        if (Math.random() > 0.3) { // Spawn pulses more frequently
            const randomLink = links[Math.floor(Math.random() * links.length)];
            pulses.push({
                link: randomLink,
                progress: 0,
                speed: 0.015 + (Math.random() * 0.03) // Slightly slower, more visible pulses
            });
        }
        
        const projectedNodes = [];
        nodes.forEach(node => {
            const p = project(node.x, node.y, node.z, cx, cy, cosX, sinX, cosY, sinY);
            p.type = node.type;
            projectedNodes.push(p);
        });
        
        // ==========================================
        // RENDER LINKS (Increased Visibility)
        // ==========================================
        ctx.lineWidth = 0.85; // Thicker lines
        ctx.beginPath();
        links.forEach(link => {
            const p1 = projectedNodes[link.source];
            const p2 = projectedNodes[link.target];
            // Much higher base alpha so inner layers remain clearly visible
            const alpha = Math.max(0.08, 0.45 - (p1.z + 250) / 1000);
            
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            // Added a subtle blue tint for a high-tech feel
            ctx.strokeStyle = `rgba(200, 220, 255, ${alpha})`; 
        });
        ctx.stroke();

        // ==========================================
        // RENDER DATA PULSES (Added Glow)
        // ==========================================
        for (let i = pulses.length - 1; i >= 0; i--) {
            let pulse = pulses[i];
            pulse.progress += pulse.speed;
            
            if (pulse.progress >= 1) {
                pulses.splice(i, 1);
                continue;
            }
            
            const n1 = nodes[pulse.link.source];
            const n2 = nodes[pulse.link.target];
            
            const currentX = n1.x + (n2.x - n1.x) * pulse.progress;
            const currentY = n1.y + (n2.y - n1.y) * pulse.progress;
            const currentZ = n1.z + (n2.z - n1.z) * pulse.progress;
            
            const p = project(currentX, currentY, currentZ, cx, cy, cosX, sinX, cosY, sinY);
            
            ctx.beginPath();
            ctx.arc(p.px, p.py, 2 * p.scale, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.shadowBlur = 12; // Re-added glow effect
            ctx.shadowColor = '#00ffcc'; // Cyan glow
            ctx.fill();
            ctx.shadowBlur = 0; // Reset
        }

        // ==========================================
        // RENDER NODES (Bigger and Brighter)
        // ==========================================
        projectedNodes.forEach(p => {
            // Increased base size (was 2, now 3.5) and min size (was 0.5, now 1.2)
            const size = Math.max(1.2, (p.type === 'output' ? 5.5 : 3.5) * p.scale);
            // Increased base opacity so nodes in the back don't disappear entirely
            const alpha = Math.max(0.25, 1 - (p.z + 250) / 800);
            
            ctx.beginPath();
            ctx.arc(p.px, p.py, size, 0, Math.PI * 2);
            
            // Vibrant, high-contrast colors
            if (p.type === 'output') {
                ctx.fillStyle = `rgba(0, 255, 204, ${alpha + 0.4})`; // Glowing Cyan Output
            } else if (p.type === 'pool') {
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha + 0.2})`; // Pure White Pooling layers
            } else if (p.type === 'input') {
                ctx.fillStyle = `rgba(150, 200, 255, ${alpha + 0.1})`; // Ice Blue Input layers
            } else {
                ctx.fillStyle = `rgba(220, 220, 220, ${alpha})`; // Bright Silver for standard Conv/Dense
            }
            ctx.fill();
        });
    }

    // ---------------------------------------------------------
    // LIVE CLASSIFICATION TYPING LOGIC
    // ---------------------------------------------------------
    const detectionScenarios = [
        "ANALYZING SECTOR 7G...\n> CLOUD_TYPE: CIRRUS\n> CONFIDENCE: 92.4%",
        "ANALYZING SECTOR 2B...\n> CLOUD_TYPE: CUMULONIMBUS\n> ANOMALY: STORM CELL DETECTED\n> CONFIDENCE: 98.1%",
        "ANALYZING SECTOR 9F...\n> CLOUD_TYPE: CLEAR_SKY\n> CONFIDENCE: 99.9%",
        "ANALYZING SECTOR 4A...\n> CLOUD_TYPE: STRATOCUMULUS\n> CONFIDENCE: 87.3%",
        "ANALYZING SECTOR 1C...\n> CLOUD_TYPE: ALTOCUMULUS\n> ANOMALY: PRESSURE DROP\n> CONFIDENCE: 94.2%"
    ];

    let scenarioIndex = 0;
    
    async function typeClassification() {
        if (!classDisplay) return;
        
        while (true) {
            const text = detectionScenarios[scenarioIndex];
            classDisplay.innerHTML = "";
            
            for (let i = 0; i < text.length; i++) {
                classDisplay.innerHTML += text.charAt(i);
                await new Promise(r => setTimeout(r, 40)); 
            }
            
            if (text.includes("ANOMALY")) {
                classDisplay.style.color = "#8ae234";
                await new Promise(r => setTimeout(r, 2000));
                classDisplay.style.color = "#ffffff";
            } else {
                await new Promise(r => setTimeout(r, 2000)); 
            }
            
            classDisplay.innerHTML = "RECALIBRATING SENSORS<span class='blink-text'>...</span>";
            await new Promise(r => setTimeout(r, 1000));
            
            scenarioIndex = (scenarioIndex + 1) % detectionScenarios.length;
        }
    }

    // Start everything
    typeClassification();
    animate(performance.now());
});


// --- RESEARCH & PUBLICATIONS DATA VAULT ---

const vaultData = [
    {
        id: "FILE_01",
        title: "Multi-Layer CNN Architectures in Satellite Imagery",
        clearance: "TOP SECRET",
        date: "2026.03",
        abstract: "A detailed breakdown of the convolutional algorithms utilized to isolate and detect complex cloud formations and anomalies from multi-gigabyte raw satellite data streams. Covers dataset filtering, pooling layer optimization, and latency reduction in live processing pipelines utilized within advanced aerospace parameters."
    },
    {
        id: "FILE_02",
        title: "P2P Offline Chat: Protocol Specifications",
        clearance: "RESTRICTED",
        date: "2026.02",
        abstract: "Architectural overview for deploying decentralized, offline messaging applications. Details the requirement payloads, installation environment constraints, and peer-to-peer handshaking protocols necessary to guarantee message delivery without centralized server reliance."
    },
    {
        id: "FILE_03",
        title: "Django Scalability: Geospatial Metadata",
        clearance: "INTERNAL",
        date: "2026.03",
        abstract: "Technical documentation covering the ingestion and routing of complex data models via Django frameworks. Focuses on avoiding standard template tags in front-end rendering, optimizing database indexing bottlenecks, and constructing custom HTML/CSS dashboards for high-tier data visualization."
    },
    {
        id: "FILE_04",
        title: "Linux Server Automation & Uptime Maintenance",
        clearance: "CONFIDENTIAL",
        date: "2026.04",
        abstract: "Bash scripting methodologies for remote terminal management. Outlines automated cron-jobs, security protocols, and system diagnostics required to maintain zero-downtime environments across remote Linux host machines operating from Windows clients."
    }
];

document.addEventListener("DOMContentLoaded", () => {
    const track = document.getElementById("marquee-track");
    if (!track) return;

    // Create folder HTML
    const createFolderHTML = (item) => `
        <div class="vault-folder" onclick="openVaultModal('${item.id}')">
            <div class="d-flex justify-content-between align-items-start">
                <span class="font-monospace small text-white-50">${item.id}</span>
                <div class="folder-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transition: all 0.3s ease;">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                    </svg>
                </div>
            </div>
            <h4 class="text-white fw-bold fs-5 mb-0 mt-3 folder-title" style="transition: color 0.3s ease;">${item.title}</h4>
            <div class="mt-4 pt-3 border-top border-secondary d-flex justify-content-between align-items-center">
                <span class="badge ${item.clearance === 'TOP SECRET' ? 'bg-danger text-white border-danger' : 'border-white text-white-50'} border rounded-0 font-monospace">
                    ${item.clearance}
                </span>
                <span class="font-monospace small text-white-50">>>></span>
            </div>
        </div>
    `;

    // Duplicate array twice to ensure seamless infinite scroll
    const allItems = [...vaultData, ...vaultData, ...vaultData];
    
    track.innerHTML = allItems.map(createFolderHTML).join("");
});

// Modal Logic
// Modal Logic
function openVaultModal(fileId) {
    const file = vaultData.find(f => f.id === fileId);
    if (!file) return;

    // Populate data
    document.getElementById("modal-title").innerText = file.title;
    document.getElementById("modal-abstract").innerText = file.abstract;
    document.getElementById("modal-date").innerText = file.date;
    
    const clearanceBadge = document.getElementById("modal-clearance");
    clearanceBadge.innerText = file.clearance;
    
    if (file.clearance === "TOP SECRET") {
        clearanceBadge.className = "badge bg-danger text-white rounded-0 font-monospace border border-danger shadow-sm";
    } else {
        clearanceBadge.className = "badge bg-dark text-white rounded-0 font-monospace border border-secondary shadow-sm";
    }

    // Open Modal
    document.getElementById("vault-modal").classList.add("active");
    document.body.style.overflow = "hidden"; // Prevents background scrolling when modal is open
}

function closeVaultModal() {
    document.getElementById("vault-modal").classList.remove("active");
    document.body.style.overflow = "auto";
}

// Close modal if clicking outside the content box
document.getElementById("vault-modal")?.addEventListener("click", (e) => {
    if (e.target.id === "vault-modal") {
        closeVaultModal();
    }
});

// --- FOOTER 3D TOPOGRAPHIC WAVE GRID ---
document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('footer-3d-canvas');
    const footerSection = document.getElementById('footer-section');
    if (!canvas || !footerSection) return;
    
    const ctx = canvas.getContext('2d');
    let width, height;
    
    // Parallax mouse interaction
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;

    function resize() {
        width = canvas.offsetWidth;
        height = canvas.offsetHeight;
        canvas.width = width;
        canvas.height = height;
    }
    
    window.addEventListener('resize', resize);
    resize();

    // Track mouse over the footer
    footerSection.addEventListener('mousemove', (e) => {
        const rect = footerSection.getBoundingClientRect();
        // Normalize mouse coordinates from -1 to 1
        targetMouseX = ((e.clientX - rect.left) / width) * 2 - 1;
        targetMouseY = ((e.clientY - rect.top) / height) * 2 - 1;
    });

    footerSection.addEventListener('mouseleave', () => {
        targetMouseX = 0;
        targetMouseY = 0;
    });

    let time = 0;
    
    // Grid Configuration
    const cols = 35; // Grid width density
    const rows = 25; // Grid depth density
    const spacing = 45; // Space between points

    function animateWave() {
        requestAnimationFrame(animateWave);
        ctx.clearRect(0, 0, width, height);

        time += 0.015; // Speed of the wave
        
        // Smooth mouse follow
        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;

        // Camera / Projection Settings
        // Pushes the wave to the bottom right of the screen
        const cx = width * 0.7 + (mouseX * 50); 
        const cy = height * 0.6 + (mouseY * 30);
        const fov = 400;

        const points = [];

        // 1. Calculate 3D Points
        for (let z = 0; z < rows; z++) {
            points[z] = [];
            for (let x = 0; x < cols; x++) {
                
                // Center the grid in 3D space
                const worldX = (x - cols / 2) * spacing;
                const worldZ = (z - rows / 2) * spacing;

                // Mathematical Wave Function (Combine sine and cosine for natural flow)
                const distance = Math.sqrt(worldX * worldX + worldZ * worldZ);
                const wave1 = Math.sin(distance * 0.01 - time) * 50;
                const wave2 = Math.cos(worldX * 0.02 + time) * 30;
                const worldY = wave1 + wave2;

                // Rotate the grid to look down at it (Isometric tilt)
                const angleX = 1.2; // Tilt angle in radians
                const rotY = worldY * Math.cos(angleX) - worldZ * Math.sin(angleX);
                const rotZ = worldY * Math.sin(angleX) + worldZ * Math.cos(angleX);

                // Project 3D coordinate to 2D screen coordinate
                // Push the grid away from camera by adding to rotZ
                const scale = fov / (fov + rotZ + 600); 
                const px = cx + worldX * scale;
                const py = cy + rotY * scale;

                points[z][x] = { px, py, scale, z: rotZ };
            }
        }

        // 2. Draw the Wireframe Grid
        ctx.lineWidth = 1;
        // Use a subtle dark gray for the lines to match the light theme
        ctx.strokeStyle = 'rgba(17, 17, 17, 0.18)'; 

        for (let z = 0; z < rows; z++) {
            for (let x = 0; x < cols; x++) {
                const p = points[z][x];
                if (!p) continue;

                // Fade out lines that are further away in the Z-axis
                const alpha = Math.max(0, 1 - (p.z + 400) / 1000);
                ctx.strokeStyle = `rgba(17, 17, 17, ${alpha * 0.25})`;

                // Draw line to the right
                if (x < cols - 1) {
                    const right = points[z][x + 1];
                    ctx.beginPath();
                    ctx.moveTo(p.px, p.py);
                    ctx.lineTo(right.px, right.py);
                    ctx.stroke();
                }
                
                // Draw line downwards
                if (z < rows - 1) {
                    const bottom = points[z + 1][x];
                    ctx.beginPath();
                    ctx.moveTo(p.px, p.py);
                    ctx.lineTo(bottom.px, bottom.py);
                    ctx.stroke();
                }
            }
        }
    }
    
    // Start animation loop
    animateWave();
});

document.addEventListener("DOMContentLoaded", () => {
    
    // --- NAVBAR SCROLL EFFECT ---
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- LIVE SYSTEM CLOCK (IST) ---
    const clockElement = document.getElementById('sys-clock');
    
    function updateClock() {
        if (!clockElement) return;
        
        const now = new Date();
        
        // Format options for India Standard Time (Ahmedabad)
        const options = { 
            timeZone: 'Asia/Kolkata', 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        };
        
        const timeString = now.toLocaleTimeString('en-US', options);
        clockElement.innerText = `${timeString} IST`;
    }

    // Update immediately, then every second
    updateClock();
    setInterval(updateClock, 1000);
});