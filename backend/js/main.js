/* ==========================================================================
   STARK INDUSTRIES AVATAR CORE — THREE.JS GRAPHICS ENGINE
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    initJarvisThreeCore();
    scrollToLatestMessage();
});

// CONTROLADOR GRÁFICO 3D EN TIEMPO REAL
function initJarvisThreeCore() {
    const container = document.getElementById("canvas-three-jarvis-core");
    if (!container) return;

    // Configuración Base de Escena Táctica
    const scene = new THREE.Scene();
    
    // Cámara
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.z = 2.5;

    // Renderizador Ultraligero con Transparencia Estricta
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Geometría Esférica de Alta Densidad Metálica
    const geometry = new THREE.IcosahedronGeometry(1, 2);
    
    // Material de Alambre Táctico Cian con Brillo Propio
    const material = new THREE.MeshBasicMaterial({
        color: 0x00d4ff,
        wireframe: true,
        transparent: true,
        opacity: 0.65
    });

    const coreMesh = new THREE.Mesh(geometry, material);
    scene.add(coreMesh);

    // Bucle de Animación de Rotación Cinemática
    const animateCore = () => {
        requestAnimationFrame(animateCore);

        // Rotación multiaxial constante
        coreMesh.rotation.x += 0.006;
        coreMesh.rotation.y += 0.009;

        // Microescala pulsante sutil simulando actividad neuronal
        const time = Date.now() * 0.002;
        const scaleFactor = 1 + Math.sin(time) * 0.04;
        coreMesh.scale.set(scaleFactor, scaleFactor, scaleFactor);

        renderer.render(scene, camera);
    };

    animateCore();

    // Resize Observer para garantizar responsividad del Avatar
    const resizeObserver = new ResizeObserver(() => {
        const width = container.clientWidth;
        const height = container.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });
    resizeObserver.observe(container);
}

// Asegurar scroll automático hacia el último mensaje transmitido
function scrollToLatestMessage() {
    const viewport = document.getElementById("chat-messages-viewport");
    if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
    }
}
