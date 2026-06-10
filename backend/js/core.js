/**
 * CLASE: StarkReactorEngine
 * Controla la física de las partículas, la proyección de la cámara y el renderizado.
 */
class StarkReactorEngine {
    constructor() {
        this.container = document.getElementById('canvas3d-container');
        this.initScene();
        this.initPostProcessing();
        this.generateParticles(5000); // Genera la masa crítica de datos
        this.renderLoop();
    }

    initScene() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 10;
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);
    }

    initPostProcessing() {
        this.composer = new THREE.EffectComposer(this.renderer);
        this.composer.addPass(new THREE.RenderPass(this.scene, this.camera));
        this.composer.addPass(new THREE.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 3.0, 0.5, 0.2));
    }

    generateParticles(count) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        // Lógica de generación volumétrica de partículas
        for(let i = 0; i < count * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 5;
        }
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const material = new THREE.PointsMaterial({ color: 0x00d4ff, size: 0.03 });
        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    renderLoop() {
        requestAnimationFrame(() => this.renderLoop());
        this.particles.rotation.y += 0.002; // Rotación lenta de la nube de datos
        this.composer.render();
    }
}
new StarkReactorEngine();
