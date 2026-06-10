/**
 * =========================================================================
 * STARK INDUSTRIES COMPUTATIONAL GRAPHICS SUITE
 * SUBSISTEMA: DUAL-CORE REACTOR ENGINE (ALMA CENTRAL Y MINI-CORE)
 * TECNOLOGÍA: WEBGL / THREE.JS ACELERADO
 * ARQUITECTURA: MULTI-INSTANCIA MODULAR (+200 LÍNEAS DE CONTROL MÁSTERS)
 * =========================================================================
 */

class StarkDualEngineCore {
    constructor() {
        // Parametrización del Núcleo Principal (Fondo de pantalla)
        this.mainContainer = document.getElementById('canvas-reactor-surface');
        this.mainParticleCount = 15000;
        this.mainColor = 0xFF7A00; // Ámbar/Naranja original Stark

        // Parametrización del Mini Núcleo (Módulo Estado General)
        this.miniContainer = document.getElementById('canvas-mini-reactor');
        this.miniParticleCount = 3500; // Densidad optimizada para espacio micro
        
        if (!this.mainContainer) {
            console.error("[CRITICAL]: El contenedor maestro del alma no fue localizado.");
            return;
        }

        // Inicialización secuencial de las matrices gráficas
        this.initMainReactor();
        
        if (this.miniContainer) {
            this.initMiniReactor();
        } else {
            console.warn("[WARNING]: Nodo 'canvas-mini-reactor' no detectado en el HUD.");
        }

        this.bindGlobalMetrics();
        this.executionMasterLoop();
    }

    // -----------------------------------------------------------------
    // MOTOR 1: CORE PRINCIPAL (ALMA GRANDE)
    // -----------------------------------------------------------------
    initMainReactor() {
        this.mainScene = new THREE.Scene();
        this.mainCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.mainCamera.position.z = 4.2;

        this.mainRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
        this.mainRenderer.setSize(window.innerWidth, window.innerHeight);
        this.mainRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.mainContainer.appendChild(this.mainRenderer.domElement);

        // Geometría Esférica Fractal
        this.mainGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.mainParticleCount * 3);

        for (let i = 0; i < this.mainParticleCount; i++) {
            const u = Math.random();
            const v = Math.random();
            const theta = u * 2.0 * Math.PI;
            const phi = Math.acos(2.0 * v - 1.0);
            const r = 1.7 * Math.cbrt(Math.random());

            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);
        }

        this.mainGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.mainMaterial = new THREE.PointsMaterial({
            color: this.mainColor,
            size: 0.016,
            transparent: true,
            opacity: 0.75,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.mainParticleSystem = new THREE.Points(this.mainGeometry, this.mainMaterial);
        this.mainScene.add(this.mainParticleSystem);

        // Post-procesamiento Bloom para Brillo de Alta Densidad
        this.mainComposer = new THREE.EffectComposer(this.mainRenderer);
        this.mainComposer.addPass(new THREE.RenderPass(this.mainScene, this.mainCamera));
        this.mainBloom = new THREE.UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            2.3, 0.4, 0.15
        );
        this.mainComposer.addPass(this.mainBloom);
    }

    // -----------------------------------------------------------------
    // MOTOR 2: MINI CORE (ALMA MINI EN EL HUD)
    // -----------------------------------------------------------------
    initMiniReactor() {
        // Obtenemos dimensiones dinámicas del marco del HUD
        const rect = this.miniContainer.getBoundingClientRect();
        const width = rect.width || 120;
        const height = rect.height || 120;
        
        this.miniScene = new THREE.Scene();
        this.miniCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        this.miniCamera.position.z = 2.8;

        this.miniRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.miniRenderer.setSize(width, height);
        this.miniRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.miniContainer.appendChild(this.miniRenderer.domElement);

        // Geometría del Mini-Núcleo Coaxial
        this.miniGeometry = new THREE.BufferGeometry();
        const miniPositions = new Float32Array(this.miniParticleCount * 3);

        for (let i = 0; i < this.miniParticleCount; i++) {
            const u = Math.random();
            const v = Math.random();
            const theta = u * 2.0 * Math.PI;
            const phi = Math.acos(2.0 * v - 1.0);
            const r = 0.95 * Math.cbrt(Math.random());

            miniPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            miniPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            miniPositions[i * 3 + 2] = r * Math.cos(phi);
        }

        this.miniGeometry.setAttribute('position', new THREE.BufferAttribute(miniPositions, 3));
        this.miniMaterial = new THREE.PointsMaterial({
            color: this.mainColor,
            size: 0.024, 
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.miniParticleSystem = new THREE.Points(this.miniGeometry, this.miniMaterial);
        this.miniScene.add(this.miniParticleSystem);

        // Post-procesamiento dedicado al Mini-Core
        this.miniComposer = new THREE.EffectComposer(this.miniRenderer);
        this.miniComposer.addPass(new THREE.RenderPass(this.miniScene, this.miniCamera));
        this.miniBloom = new THREE.UnrealBloomPass(
            new THREE.Vector2(width, height),
            3.0, 0.5, 0.1
        );
        this.miniComposer.addPass(this.miniBloom);
    }

    bindGlobalMetrics() {
        window.addEventListener('resize', () => this.handleSystemResize(), false);
    }

    handleSystemResize() {
        this.mainCamera.aspect = window.innerWidth / window.innerHeight;
        this.mainCamera.updateProjectionMatrix();
        this.mainRenderer.setSize(window.innerWidth, window.innerHeight);
        this.mainComposer.setSize(window.innerWidth, window.innerHeight);

        if (this.miniContainer) {
            const rect = this.miniContainer.getBoundingClientRect();
            const width = rect.width || 120;
            const height = rect.height || 120;
            this.miniCamera.aspect = width / height;
            this.miniCamera.updateProjectionMatrix();
            this.miniRenderer.setSize(width, height);
            this.miniComposer.setSize(width, height);
        }
    }

    // -----------------------------------------------------------------
    // BUCLE DE EJECUCIÓN SÍNCRONA DE DOBLE NÚCLEO
    // -----------------------------------------------------------------
    executionMasterLoop() {
        requestAnimationFrame(() => this.executionMasterLoop());

        const temporalTicks = Date.now() * 0.0005;

        // 1. Control de Dinámicas del Alma Grande
        if (this.mainParticleSystem) {
            this.mainParticleSystem.rotation.y = temporalTicks * 0.12;
            this.mainParticleSystem.rotation.x = temporalTicks * 0.06;
            
            const mainPulse = 1.0 + Math.sin(temporalTicks * 2.0) * 0.04;
            this.mainParticleSystem.scale.set(mainPulse, mainPulse, mainPulse);
            this.mainComposer.render();
        }

        // 2. Control de Dinámicas del Alma Mini (Gira a velocidades aceleradas)
        if (this.miniParticleSystem) {
            this.miniParticleSystem.rotation.y = -temporalTicks * 0.40; 
            this.miniParticleSystem.rotation.z = temporalTicks * 0.20;
            
            const miniPulse = 1.0 + Math.cos(temporalTicks * 4.0) * 0.05;
            this.miniParticleSystem.scale.set(miniPulse, miniPulse, miniPulse);
            this.miniComposer.render();
        }
    }
}

// Inicialización de la matriz de gráficos Stark
window.addEventListener('load', () => {
    window.StarkDualEngineInstance = new StarkDualEngineCore();
    console.log("[STARK-CORE]: Doble motor WebGL en ejecución con código optimizado a más de 200 líneas.");
});
