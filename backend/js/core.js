/**
 * =========================================================================
 * STARK INDUSTRIES CORE LOGIC MODULE - VERSION 3.1
 * INTERACTIVIDAD TOTAL DE HISTORIAL, COMPOSICIÓN WEBGL Y HORARIOS EXACTOS
 * =========================================================================
 */

class JarvisIntegratedEngine {
    constructor() {
        this.miniContainer = document.getElementById('canvas-mini-reactor');
        this.miniParticleCount = 4500; // Incremento de densidad molecular
        this.amberColor = 0xFF7A00;

        // Base de Datos Estática de las Sesiones del Historial (Simulación Local)
        this.chatSessionsData = {
            diagnostic: [
                { sender: "JARVIS", text: "Buenos días, Señor. Me alegra verlo de nuevo. El sistema está funcionando dentro de parámetros normales. ¿Tiene algún asunto específico que desee abordar hoy o prefiere que yo inicie la sesión revisando los eventos pendientes?" },
                { sender: "TÚ", text: "Un saludo informal, pero bienvenido, Señor. Parece que no hay nada urgente en su agenda. Mi recomendación sería revisar sus comunicaciones y notificaciones. ¿Le gustaría que le resuma los temas importantes en las últimas 24 horas?" }
            ],
            mark85: [
                { sender: "JARVIS", text: "Telemetría de la armadura Mark 85 cargada. Los propulsores repulsores se encuentran calibrados a una tasa de flujo de energía del 100%. Refrigeración estable a 32°C." },
                { sender: "TÚ", text: "Excelente Jarvis. Mantén los escudos de nanotecnología en espera activa por si requerimos pruebas mecánicas de resistencia." }
            ],
            network: [
                { sender: "JARVIS", text: "Protocolo de desfragmentación completado. Se han eliminado 4.2 GB de archivos temporales e historiales antiguos en el clúster central del servidor de Render." },
                { sender: "TÚ", text: "Perfecto, optimiza el cortafuegos perimetral para evitar caídas en el despliegue del asistente." }
            ]
        };

        // Inicialización del ecosistema
        this.initClockSynchronization();
        this.initHistoryInteractivity();
        
        if (this.miniContainer) {
            this.initMiniCoreWebGL();
        } else {
            console.error("[CRITICAL]: Nodo 'canvas-mini-reactor' inaccesible en tiempo de ejecución.");
        }

        this.bindSystemEvents();
        this.masterAnimationLoop();
    }

    // 1. RELOJ EN TIEMPO REAL EXACTO CON SEGUNDERO
    initClockSynchronization() {
        const timeClock = document.getElementById('sys-time-clock');
        const dateStamp = document.getElementById('sys-date-stamp');

        const executeTimeUpdate = () => {
            const dateObj = new Date();
            let hours = dateObj.getHours();
            const minutes = String(dateObj.getMinutes()).padStart(2, '0');
            const seconds = String(dateObj.getSeconds()).padStart(2, '0');
            const systemPeriod = hours >= 12 ? 'PM' : 'AM';

            hours = hours % 12;
            hours = hours ? hours : 12;
            const fullTimeString = `${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${systemPeriod}`;

            const nameDays = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];
            const nameMonths = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
            const fullDateString = `${nameDays[dateObj.getDay()]}, ${dateObj.getDate()} ${nameMonths[dateObj.getMonth()]} ${dateObj.getFullYear()}`;

            if (timeClock) timeClock.innerText = fullTimeString;
            if (dateStamp) dateStamp.innerText = fullDateString;
        };

        executeTimeUpdate();
        setInterval(executeTimeUpdate, 500); // Frecuencia de muestreo óptima
    }

    // 2. INTERACTIVIDAD DEL HISTORIAL DE CHATS (ABRIR SESIONES)
    initHistoryInteractivity() {
        const historyItems = document.querySelectorAll('.history-item');
        const chatStream = document.getElementById('chat-conversation-stream');

        historyItems.forEach(item => {
            item.addEventListener('click', (e) => {
                // Remover el estado activo previo de la lista
                historyItems.forEach(i => i.classList.remove('active'));
                
                // Activar el componente seleccionado
                const target = e.currentTarget;
                target.classList.add('active');

                // Extraer el identificador de sesión
                const sessionKey = target.getAttribute('data-session');
                const messages = this.chatSessionsData[sessionKey];

                if (messages && chatStream) {
                    // Limpiar el visor del chat principal
                    chatStream.innerHTML = '';
                    
                    // Inyectar de manera estructurada los mensajes de la sesión cargada
                    messages.forEach(msg => {
                        const bubble = document.createElement('div');
                        const isJarvis = msg.sender === "JARVIS";
                        bubble.className = `chat-bubble ${isJarvis ? 'bubble-jarvis' : 'bubble-user'}`;
                        
                        bubble.innerHTML = `
                            <div class="bubble-meta">${msg.sender} <span class="time-meta">REGISTRO CARGADO</span></div>
                            <p class="bubble-text">${msg.text}</p>
                        `;
                        chatStream.appendChild(bubble);
                    });
                    
                    // Auto-scroll al final del flujo cargado
                    chatStream.scrollTop = chatStream.scrollHeight;
                }
            });
        });
    }

    // 3. RESURRECCIÓN DEL ALMA GRÁFICA INTERNA DE J.A.R.V.I.S (WEBGL)
    initMiniCoreWebGL() {
        const d = 80; // Diámetro ajustado exacto al wrapper del CSS
        
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, d / d, 0.1, 100);
        this.camera.position.z = 2.2;

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(d, d);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.miniContainer.appendChild(this.renderer.domElement);

        // Geometría Molecular Esférica
        this.geometry = new THREE.BufferGeometry();
        const coords = new Float32Array(this.miniParticleCount * 3);

        for (let i = 0; i < this.miniParticleCount; i++) {
            const u = Math.random();
            const v = Math.random();
            const theta = u * 2.0 * Math.PI;
            const phi = Math.acos(2.0 * v - 1.0);
            const r = 0.8 * Math.cbrt(Math.random()); // Esfera tridimensional compacta

            coords[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            coords[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            coords[i * 3 + 2] = r * Math.cos(phi);
        }

        this.geometry.setAttribute('position', new THREE.BufferAttribute(coords, 3));
        
        // Puntos de luz de alta intensidad ámbar
        this.material = new THREE.PointsMaterial({
            color: this.amberColor,
            size: 0.025,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.particleSystem = new THREE.Points(this.geometry, this.material);
        this.scene.add(this.particleSystem);

        // Compositor de Efectos Avanzados de Iluminación (Bloom)
        this.composer = new THREE.EffectComposer(this.renderer);
        this.composer.addPass(new THREE.RenderPass(this.scene, this.camera));
        
        this.unrealBloom = new THREE.UnrealBloomPass(new THREE.Vector2(d, d), 3.0, 0.4, 0.05);
        this.composer.addPass(this.unrealBloom);
    }

    bindSystemEvents() {
        window.addEventListener('resize', () => {
            if (this.miniContainer) {
                const d = 80;
                this.camera.aspect = 1;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(d, d);
                this.composer.setSize(d, d);
            }
        });
    }

    // 4. ANIMACIÓN Y CICLO CRÓNICO DEL NÚCLEO
    masterAnimationLoop() {
        requestAnimationFrame(() => this.masterAnimationLoop());

        const runtimeTicks = Date.now() * 0.0006;

        if (this.particleSystem) {
            // Rotación tridimensional del alma de partículas
            this.particleSystem.rotation.y = -runtimeTicks * 0.5;
            this.particleSystem.rotation.x = runtimeTicks * 0.25;

            // Frecuencia armónica de pulsación del núcleo energético
            const scalarPulse = 1.0 + Math.sin(runtimeTicks * 4.0) * 0.05;
            this.particleSystem.scale.set(scalarPulse, scalarPulse, scalarPulse);

            this.composer.render();
        }
    }
}

// Inicialización de la consola al completar la carga del DOM
window.addEventListener('DOMContentLoaded', () => {
    window.JarvisEngineInstance = new JarvisIntegratedEngine();
    console.log("[STARK-SYSTEM]: Núcleo v3.1 desplegado con interactividad completa y alma revitalizada.");
});
