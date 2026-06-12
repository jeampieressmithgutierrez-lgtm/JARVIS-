/**
 * ========================================================================
 * STARK INDUSTRIES — J.A.R.V.I.S. CORE OPERATION LOGIC (V5.0)
 * SCRIPT DE CONTROL GRÁFICO, SCROLL AUTOMÁTICO Y CRONÓMETRO DE SISTEMA
 * AUTOR: JEAMPIER GUTIÉRREZ // ENTORNO DE DESPLIEGUE RENDER
 * ========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    // Inicializar subsistemas del HUD
    initSystemClock();
    initHolographicCore();
    setupAutoScroll();
    setupTerminalInteractivity();
});

/**
 * 1. RELOJ DIGITAL SINCRONIZADO (Consola Inferior Derecha)
 * Mantiene la hora local formateada en HH:MM:SS AM/PM
 */
function initSystemClock() {
    const clockElement = document.getElementById("sys-time-clock");
    if (!clockElement) return;

    const updateClock = () => {
        const now = new Date();
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        // Conversión a formato de 12 horas
        hours = hours % 12;
        hours = hours ? hours : 12; // La hora '0' debe ser '12'
        const hoursStr = String(hours).padStart(2, '0');

        clockElement.textContent = `${hoursStr}:${minutes}:${seconds} ${ampm}`;
    };

    updateClock();
    setInterval(updateClock, 1000); // Actualización continua por segundo
}

/**
 * 2. ALMA HOLOGRÁFICA TIPO IA ENERGÉTICA (Color Ámbar / Naranja)
 * Renderiza una esfera de partículas fluidas 3D dentro del círculo del avatar de JARVIS
 */
function initHolographicCore() {
    const container = document.getElementById("canvas-mini-reactor");
    if (!container) return;

    // Obtener dimensiones exactas del contenedor circular del CSS
    const width = container.clientWidth || 55;
    const height = container.clientHeight || 55;

    // 2.1. Escena y Cámara Ortográfica para HUD bidimensional
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 2.5;

    // 2.2. Renderizador con Canal Alfa (Transparente)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2.3. Geometría de Partículas para la Esfera de Energía Ámbar
    const particleCount = 750;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const originalPositions = [];

    for (let i = 0; i < particleCount; i++) {
        // Distribución esférica uniforme mediante vectores normales aleatorios
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        
        // Radio base de la esfera del alma holográfica
        const radius = 0.9; 
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        // Guardar posiciones originales para simular la pulsación molecular
        originalPositions.push(new THREE.Vector3(x, y, z));
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // 2.4. Material de Partículas Color Ámbar Puro de Stark Industries
    const material = new THREE.PointsMaterial({
        color: 0xFFB300, // Ámbar / Naranja Brillante
        size: 0.045,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    // 2.5. Bucle de Animación Gráfica (Frecuencia de actualización del Monitor)
    let clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();
        const positionAttribute = geometry.getAttribute('position');

        // Rotación sutil del núcleo de la inteligencia artificial
        particleSystem.rotation.y = elapsedTime * 0.25;
        particleSystem.rotation.x = elapsedTime * 0.15;

        // Simulación de fluctuación energética (Onda molecular ámbar)
        for (let i = 0; i < particleCount; i++) {
            const origVec = originalPositions[i];
            
            // Variación matemática del radio usando funciones de seno y coseno cruzados
            const wave = Math.sin(elapsedTime * 3.0 + (origVec.x * 2.0)) * 0.06;
            
            positionAttribute.setXYZ(
                i,
                origVec.x + (origVec.x * wave),
                origVec.y + (origVec.y * wave),
                origVec.z + (origVec.z * wave)
            );
        }

        positionAttribute.needsUpdate = true;
        renderer.render(scene, camera);
    }

    animate();

    // Redimensionar automáticamente el lienzo si la ventana cambia de escala
    window.addEventListener('resize', () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    });
}

/**
 * 3. SISTEMA DE CONTROL DE DESPLAZAMIENTO (Scroll Automático)
 * Mantiene la vista fija en el último mensaje inferior de la conversación
 */
function setupAutoScroll() {
    const scrollContainer = document.getElementById("chat-conversation-stream");
    if (!scrollContainer) return;

    // Función global ejecutable cada vez que se inserta una nueva burbuja
    window.scrollToBottomHUD = () => {
        scrollContainer.scrollTo({
            top: scrollContainer.scrollHeight,
            behavior: 'smooth' // Desplazamiento fluido de Stark OS
        });
    };

    // Ejecución preventiva inicial
    window.scrollToBottomHUD();
}

/**
 * 4. INTERACTIVIDAD BÁSICA DE LA CONSOLA TERMINAL
 * Captura comandos del input para simular el envío de mensajes
 */
function setupTerminalInteractivity() {
    const input = document.getElementById("terminal-command-input");
    if (!input) return;

    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && input.value.trim() !== "") {
            // Aquí se conectará posteriormente tu backend en Render / API Groq
            console.log(`[STARK CORE COMMAND]: ${input.value}`);
            
            // Limpiar la barra tras mandar el comando
            input.value = "";
            
            // Forzar bajada de scroll
            if (typeof window.scrollToBottomHUD === "function") {
                setTimeout(window.scrollToBottomHUD, 50);
            }
        }
    });
}
