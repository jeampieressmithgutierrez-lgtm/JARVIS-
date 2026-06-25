/* ==========================================================================
   STARK INDUSTRIES AVATAR CORE — THREE.JS GRAPHICS ENGINE WITH CUSTOM SHADERS
   ========================================================================== */

let coreUniforms;
let clockClock;

document.addEventListener("DOMContentLoaded", () => {
    initJarvisThreeCore();
    scrollToLatestMessage();
});

function initJarvisThreeCore() {
    const container = document.getElementById("canvas-three-jarvis-core");
    if (!container) return;

    // Reloj interno de renderizado
    clockClock = new THREE.Clock();

    // 1. Configuración de Escena y Cámara Estructurada
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.z = 2.2;

    // 2. Renderizador Táctico con Canales de Transparencia Activos
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 3. Geometría Avanzada (Esfera Compleja de Alta Densidad)
    const geometry = new THREE.SphereGeometry(0.85, 45, 45);

    // 4. Uniforms de Comunicación para pasar datos a la GPU (shaders.js)
    coreUniforms = {
        uTime: { value: 0.0 }
    };

    // 5. Configuración del Material de Sombreado Personalizado (ShaderMaterial)
    const customShaderMaterial = new THREE.ShaderMaterial({
        vertexShader: JarvisShaders.vertexShader,
        fragmentShader: JarvisShaders.fragmentShader,
        uniforms: coreUniforms,
        transparent: true,
        blending: THREE.AdditiveBlending, // Genera un efecto de incandescencia pura
        side: THREE.DoubleSide
    });

    const holographicCore = new THREE.Mesh(geometry, customShaderMaterial);
    scene.add(holographicCore);

    // 6. Malla de Alambre Secundario Táctico Exterior para darle Complejidad Técnica
    const wireframeGeometry = new THREE.IcosahedronGeometry(0.95, 2);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0xffb300,
        wireframe: true,
        transparent: true,
        opacity: 0.12
    });
    const outerTechSkeleton = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    scene.add(outerTechSkeleton);

    // 7. Bucle Crítico de Animación
    const renderLoop = () => {
        requestAnimationFrame(renderLoop);

        const elapsedTime = clockClock.getElapsedTime();
        
        // Sincronizar tiempo con los shaders
        coreUniforms.uTime.value = elapsedTime;

        // Rotaciones cruzadas del núcleo y del esqueleto exterior
        holographicCore.rotation.y = elapsedTime * 0.3;
        outerTechSkeleton.rotation.y = -elapsedTime * 0.15;
        outerTechSkeleton.rotation.x = elapsedTime * 0.1;

        renderer.render(scene, camera);
    };

    renderLoop();

    // Resize Observer Dinámico para conservar proporciones exactas en Smartphones
    const layoutObserver = new ResizeObserver(() => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    });
    layoutObserver.observe(container);
}

function scrollToLatestMessage() {
    const viewport = document.getElementById("chat-messages-viewport");
    if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
    }
}
