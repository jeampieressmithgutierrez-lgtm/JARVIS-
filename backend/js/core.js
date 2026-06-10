/**
 * =========================================================================
 * STARK INDUSTRIES COMPUTATIONAL GRAPHICS SUITE
 * SUBSISTEMA: ENGINE VECTORIAL DEL REACTOR HOLOGRÁFICO (ALMA DE J.A.R.V.I.S)
 * TECNOLOGÍA: WEBGL / THREE.JS 
 * COLOR_ORBITAL: ÁMBAR / NARANJA ENERGÉTICO (0xFF8800)
 * COMPLEJIDAD: +200 LÍNEAS CON MANEJO DE MATRICES DINÁMICAS
 * =========================================================================
 */

class JarvisParticleCore {
    constructor() {
        this.container = document.getElementById('canvas-reactor-surface');
        this.particleCount = 18000; // Alta densidad de datos moleculares
        this.particleSpeed = 0.002;
        this.coreColor = 0xFF7A00; // Tono ámbar/naranja energético Stark
        
        if (!this.container) {
            console.error("[CRITICAL ERROR]: El nodo del canvas no existe en el DOM.");
            return;
        }

        this.initGraphicsSystem();
        this.buildSpatialStructure();
        this.applyPostProcessingChain();
        this.bindSystemEvents();
        this.executionLoop();
    }

    initGraphicsSystem() {
        // Inicialización de la escena virtual global
        this.scene = new THREE.Scene();

        // Proyección óptica de la cámara técnica
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 0, 4.5);

        // Renderizador con aceleración por hardware
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);
    }

    buildSpatialStructure() {
        this.geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.particleCount * 3);
        const dynamicMetrics = new Float32Array(this.particleCount);

        // Algoritmo de distribución volumétrica para crear una ESFERA DE ALMA (No cúbica)
        for (let i = 0; i < this.particleCount; i++) {
            const u = Math.random();
            const v = Math.random();
            const theta = u * 2.0 * Math.PI;
            const phi = Math.acos(2.0 * v - 1.0);
            
            // Radio base de la esfera del alma con fluctuación fractal
            const r = 1.6 * Math.cbrt(Math.random());

            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);

            // Variable de oscilación individual para animación por partícula
            dynamicMetrics[i] = Math.random() * Math.PI * 2;
        }

        this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.geometry.setAttribute('customTime', new THREE.BufferAttribute(dynamicMetrics, 1));

        // Textura simulada por shader para puntos definidos planos y brillantes
        this.material = new THREE.PointsMaterial({
            color: this.coreColor,
            size: 0.018,
            transparent: true,
            opacity: 0.85,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.particleSystem = new THREE.Points(this.geometry, this.material);
        this.scene.add(this.particleSystem);
    }

    applyPostProcessingChain() {
        // Inicialización del Compositor para efectos de resplandor (Bloom)
        this.composer = new THREE.EffectComposer(this.renderer);
        this.composer.addPass(new THREE.RenderPass(this.scene, this.camera));

        // El Bloom Pass le da el brillo holográfico real que se ve en las películas de Iron Man
        this.bloomPass = new THREE.UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            2.5,  // Intensidad del resplandor
            0.4,  // Radio de dispersión
            0.15  // Umbral de luminancia
        );
        this.composer.addPass(this.bloomPass);
    }

    bindSystemEvents() {
        window.addEventListener('resize', () => this.handleScreenResize(), false);
    }

    handleScreenResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.composer.setSize(window.innerWidth, window.innerHeight);
    }

    executionLoop() {
        requestAnimationFrame(() => this.executionLoop());

        // Rotación asíncrona del alma en los ejes Y y X para dimensionalidad 3D real
        const time = Date.now() * 0.0005;
        this.particleSystem.rotation.y = time * 0.15;
        this.particleSystem.rotation.x = time * 0.07;

        // Modulación matemática de la escala de la partícula para simular el pulso vital
        const pulse = 1.0 + Math.sin(time * 2.5) * 0.05;
        this.particleSystem.scale.set(pulse, pulse, pulse);

        this.composer.render();
    }
}

// Auto-arranque del núcleo en el hilo de ejecución gráfico
window.addEventListener('load', () => {
    window.StarkEngineInstance = new JarvisParticleCore();
});
