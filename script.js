const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size to window size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Matrix rain characters
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
const fontSize = 14;
const columns = Math.floor(canvas.width / fontSize);
const drops = new Array(columns).fill(1);

// Add some retro sound effects
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function createBeep(frequency = 440, duration = 0.1) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    
    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    oscillator.stop(audioContext.currentTime + duration);
}

// Matrix rain animation
function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#0F0';
    ctx.font = fontSize + 'px monospace';
    
    for (let i = 0; i < drops.length; i++) {
        const text = characters[Math.floor(Math.random() * characters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

// Section-specific animations
const animations = {
    home: function(container) {
        const canvas = document.createElement('canvas');
        canvas.width = container.offsetWidth;
        canvas.height = 200;
        container.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        
        function drawHomeAnimation() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            const time = Date.now() * 0.001;
            for (let i = 0; i < 10; i++) {
                const x = Math.sin(time + i) * 50 + canvas.width / 2;
                const y = Math.cos(time + i) * 50 + canvas.height / 2;
                
                ctx.beginPath();
                ctx.arc(x, y, 5, 0, Math.PI * 2);
                ctx.fillStyle = `hsl(${time * 50 + i * 30}, 50%, 50%)`;
                ctx.fill();
            }
            
            if (container.querySelector('canvas')) {
                requestAnimationFrame(() => drawHomeAnimation());
            }
        }
        
        drawHomeAnimation();
    },
    
    about: function(container) {
        const canvas = document.createElement('canvas');
        canvas.width = container.offsetWidth;
        canvas.height = 200;
        container.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        
        const particles = Array.from({ length: 50 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 3 + 1,
            speedX: Math.random() * 2 - 1,
            speedY: Math.random() * 2 - 1
        }));
        
        function drawAboutAnimation() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.x += particle.speedX;
                particle.y += particle.speedY;
                
                if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
                
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = '#0F0';
                ctx.fill();
            });
            
            if (container.querySelector('canvas')) {
                requestAnimationFrame(() => drawAboutAnimation());
            }
        }
        
        drawAboutAnimation();
    },
    
    contact: function(container) {
        const canvas = document.createElement('canvas');
        canvas.width = container.offsetWidth;
        canvas.height = 200;
        container.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        
        let angle = 0;
        
        function drawContactAnimation() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            
            for (let i = 0; i < 8; i++) {
                const rotation = angle + (Math.PI * 2 * i) / 8;
                const x = centerX + Math.cos(rotation) * 50;
                const y = centerY + Math.sin(rotation) * 50;
                
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(x, y);
                ctx.strokeStyle = `hsl(${angle * 50}, 50%, 50%)`;
                ctx.stroke();
            }
            
            angle += 0.02;
            
            if (container.querySelector('canvas')) {
                requestAnimationFrame(() => drawContactAnimation());
            }
        }
        
        drawContactAnimation();
    }
};

// Menu interaction
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => {
        const section = item.getAttribute('data-section');
        const contentBox = document.getElementById(`${section}-content`);
        
        // Hide all content boxes
        document.querySelectorAll('.content-box').forEach(box => {
            box.classList.remove('active');
            const canvas = box.querySelector('canvas');
            if (canvas) {
                canvas.remove();
            }
        });
        
        // Show selected content box
        contentBox.classList.add('active');
        
        // Start section-specific animation
        const animationContainer = contentBox.querySelector(`.${section}-animation`);
        animations[section](animationContainer);
        
        // Play different sound for each section
        const frequencies = {
            home: 440,
            about: 550,
            contact: 660
        };
        createBeep(frequencies[section], 0.2);
    });
    
    item.addEventListener('mouseenter', () => {
        createBeep(440, 0.1);
    });
});

// Close button functionality
document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const contentBox = btn.closest('.content-box');
        contentBox.classList.remove('active');
        const canvas = contentBox.querySelector('canvas');
        if (canvas) {
            canvas.remove();
        }
        createBeep(220, 0.1);
    });
});

// Animation loop for matrix rain
setInterval(draw, 35);

// Add some retro cursor effects
document.addEventListener('mousemove', (e) => {
    const cursor = document.createElement('div');
    cursor.className = 'cursor-trail';
    cursor.style.left = e.pageX + 'px';
    cursor.style.top = e.pageY + 'px';
    document.body.appendChild(cursor);
    
    setTimeout(() => {
        cursor.remove();
    }, 1000);
});

// Add cursor trail style
const style = document.createElement('style');
style.textContent = `
    .cursor-trail {
        position: fixed;
        width: 5px;
        height: 5px;
        background: #0F0;
        border-radius: 50%;
        pointer-events: none;
        animation: fadeOut 1s linear forwards;
    }
    @keyframes fadeOut {
        to {
            opacity: 0;
            transform: scale(0.3);
        }
    }
`;
document.head.appendChild(style);

// Add some "hacker" typing effect to the welcome text
const welcomeText = document.querySelector('.welcome-text');
const originalText = welcomeText.textContent;
welcomeText.textContent = '';

function typeText(element, text, index = 0) {
    if (index < text.length) {
        element.textContent += text[index];
        setTimeout(() => typeText(element, text, index + 1), 100);
    }
}

setTimeout(() => {
    typeText(welcomeText, originalText);
}, 500); 