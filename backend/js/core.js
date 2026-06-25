/* ==========================================================================
   STARK INDUSTRIES INTERNAL SYSTEMS CORE — BACKGROUND & MATRIX PARTICLES
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    initLiveClock();
    initHolographicParticles();
});

// 1. CONTROL RELOJ SISTEMA DINÁMICO
function initLiveClock() {
    const clockElement = document.getElementById("hud-live-clock");
    if (!clockElement) return;

    const updateClock = () => {
        const now = new Date();
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        hours = hours % 12;
        hours = hours ? hours : 12; // Formato 12 horas
        const hoursStr = String(hours).padStart(2, '0');

        clockElement.textContent = `${hoursStr}:${minutes}:${seconds} ${ampm}`;
    };

    updateClock();
    setInterval(updateClock, 1000);
}

// 2. SISTEMA DE PARTICULAS FLOTANTES (EFECTO DE PROFUNDIDAD HUD)
function initHolographicParticles() {
    const canvas = document.getElementById("particles-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let particlesArray = [];
    const numberOfParticles = 45;

    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.5 + 0.5;
            this.speedX = Math.random() * 0.4 - 0.2;
            this.speedY = Math.random() * -0.5 - 0.1; // Desplazamiento sutil ascendente
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Reposicionamiento cíclico si salen de bordes
            if (this.y < 0) {
                this.y = canvas.height;
                this.x = Math.random() * canvas.width;
            }
            if (this.x < 0 || this.x > canvas.width) {
                this.speedX = -this.speedX;
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 214, 255, ${this.opacity})`;
            ctx.fill();
        }
    }

    const init = () => {
        particlesArray = [];
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    };

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        requestAnimationFrame(animate);
    };

    init();
    animate();
}
