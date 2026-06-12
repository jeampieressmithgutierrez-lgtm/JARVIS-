/**
 * =========================================================================
 * STARK INDUSTRIES COMPUTATIONAL GRAPHICS & TIME SUITE
 * SUBSISTEMA: CONTROL DE RELOJ REAL Y MINI-CORE INDEPENDIENTE INTERACTIVO
 * TECNOLOGÍA: WEBGL / THREE.JS ACELERADO
 * ARQUITECTURA: MONITOREO DINÁMICO COMPLETO (+200 LÍNEAS DE PRODUCCIÓN)
 * =========================================================================
 */

class JarvisHUDSystemEngine {
    constructor() {
        // Inicialización del Canvas del Mini-Reactor ubicado abajo a la izquierda
        this.miniContainer = document.getElementById('canvas-mini-reactor');
        this.miniParticleCount = 4000; 
        this.coreColor = 0xFF7A00; // Ámbar puro energético Stark
        
        // Ejecución de rutinas de sincronización inmediata
        this.initSystemClockSync();
        
        if (this.miniContainer) {
            this.initMiniReactorWebGL();
        } else {
            console.error("[CRITICAL]: El contenedor inferior 'canvas-mini-reactor' no existe.");
        }

        this.bindRuntimeMetrics();
        this.executionMasterLoop();
    }

    // -----------------------------------------------------------------
    // SINCRONIZACIÓN DE LA HORA CON EL RELOJ REAL (LEST DE SISTEMA ACTIVO)
    // -----------------------------------------------------------------
    initSystemClockSync() {
        const timeElement = document.getElementById('sys-time-clock');
        const dateElement = document.getElementById('sys-date-stamp');

        const updateClock = () => {
            const now = new Date();
            
            // Formato de hora localizado de 12 horas con segundos exactos
            let hours = now.getHours();
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            
            hours = hours % 12;
            hours = hours ? hours : 12; // Formato de hora '12' en vez de '0'
            const timeString = `${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;

            // Array de días y meses para despliegue de telemetría de cabecera
            const days = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];
            const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
            
            const dateString = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;

            if (timeElement) timeElement.innerText = timeString;
            if (dateElement) dateElement.innerText = dateString;
        };

        // Actualización síncrona cada 500ms para evitar desfases del segundero
        updateClock();
        setInterval(updateClock, 500);
        console.log("[STARK-CLOCK]: Sincronización horaria en tiempo real activada de manera óptima.");
    }

    // -----------------------------------------------------------------
    // MOTOR WEBGL: MINI CORE HOLOGRÁFICO BAJO IZQUIERDA
    // -----------------------------------------------------------------
    initMiniReactorWebGL() {
        const width = 75;
        const height = 75;
        
        this.miniScene = new THREE.Scene();
        
        // Ajuste milimétrico de cámara de perspectiva compacta
        this.miniCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        this.miniCamera.position.z = 2.4;

        this.miniRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.miniRenderer.setSize(width, height);
        this.miniRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.miniContainer.appendChild(this.miniRenderer.domElement);

        // Creación del Sistema Molecular del Mini-Core Ámbar
        this.miniGeometry = new THREE.BufferGeometry();
        const miniPositions = new Float32Array(this.miniParticleCount * 3);

        for (let i = 0; i < this.miniParticleCount; i++) {
            const u = Math.random();
            const v = Math.random();
            const theta = u * 2.0 * Math.PI;
            const phi = Math.acos(2.0 * v - 1.0);
            const r = 0.85 * Math.cbrt(Math.random()); // Esfera densa y compacta

            miniPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            miniPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            miniPositions[i * 3 + 2] = r * Math.cos(phi);
        }

        this.miniGeometry.setAttribute('position', new THREE.BufferAttribute(miniPositions, 3));
        this.miniMaterial = new THREE.PointsMaterial({
            color: this.coreColor,
            size: 0.024,
            transparent: true,
            opacity: 0.95,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.miniParticleSystem = new THREE.Points(this.miniGeometry, this.miniMaterial);
        this.miniScene.add(this.miniParticleSystem);

        // Pipeline de Efectos de Post-Procesamiento (Bloom incandescente de precisión)
        this.miniComposer = new THREE.EffectComposer(this.miniRenderer);
        this.miniComposer.addPass(new THREE.RenderPass(this.miniScene, this.miniCamera));
        
        this.miniBloom = new THREE.UnrealBloomPass(
            new THREE.Vector2(width, height),
            3.2,  // Mayor brillo concentrado
            0.45, // Radio controlado
            0.05  // Umbral bajo para máxima iluminación técnica
        );
        this.miniComposer.addPass(this.miniBloom);
    }

    bindRuntimeMetrics() {
        window.addEventListener('resize', () => this.handleSystemResize(), false);
    }

    handleSystemResize() {
        if (this.miniContainer) {
            const width = 75;
            const height = 75;
            this.miniCamera.aspect = width / height;
            this.miniCamera.updateProjectionMatrix();
            this.miniRenderer.setSize(width, height);
            this.miniComposer.setSize(width, height);
        }
    }

    // -----------------------------------------------------------------
    // LOOP DE RENDERIZADO GRÁFICO CONTINUO
    // -----------------------------------------------------------------
    executionMasterLoop() {
        requestAnimationFrame(() => this.executionMasterLoop());

        const temporalTicks = Date.now() * 0.0005;

        // Animación fluida de rotación del mini-núcleo en el footer
        if (this.miniParticleSystem) {
            this.miniParticleSystem.rotation.y = -temporalTicks * 0.45; // Rotación invertida rápida
            this.miniParticleSystem.rotation.z = temporalTicks * 0.25;
            
            // Simulación de pulso de frecuencia armónica
            const miniPulse = 1.0 + Math.cos(temporalTicks * 5.0) * 0.04;
            this.miniParticleSystem.scale.set(miniPulse, miniPulse, miniPulse);
            
            this.miniComposer.render();
        }
    }
}

// Auto-arranque coordinado del controlador gráfico y horariomódulo Stark
window.addEventListener('load', () => {
    window.JarvisSystemInstance = new JarvisHUDSystemEngine();
    console.log("[STARK-CORE]: Interfaz de Reloj y Mini-Core Inicializada Correctamente.");
});
