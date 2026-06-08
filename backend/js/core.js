// ============================================================================
// STARK PROTOCOLO: CORE VECTORIAL GRÁFICO (ALMA DE J.A.R.V.I.S)
// Lógica de Renderizado Tridimensional Nativo mediante WebGL y Mallas Físicas
// ============================================================================

let scene, camera, renderer, jarvisSoul, coreMesh, midMesh, orbit1, orbit2, brightCenter;
let isThinking = false;
let clock = new THREE.Clock();

/**
 * Inicializa el escenario gráfico 3D y acopla el lienzo al contenedor del HUD.
 */
function initCore() {
    const container = document.getElementById('canvas3d-container');
    if (!container) {
        console.error("[CRITICAL CORE] No se encontró el contenedor 'canvas3d-container'.");
        return;
    }

    // Creación de la escena principal
    scene = new THREE.Scene();

    // Configuración de la cámara de perspectiva holográfica (Campo de visión de 50 grados)
    camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5.5;

    // Inicialización del motor de renderizado con suavizado de bordes (Antialias) y transparencia
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Grupo maestro que aglutina todas las capas para permitir oscilaciones inerciales complejas
    jarvisSoul = new THREE.Group();
    scene.add(jarvisSoul);

    // Material Base: Malla de alambre estructural de alta tecnología (Glow Cian Eléctrico)
    const holoMaterial = new THREE.MeshBasicMaterial({
        color: 0x00d4ff,
        wireframe: true,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending
    });

    // 1. CAPA INTERNA: Icosaedro facetado táctico (Define la densidad volumétrica del núcleo)
    const coreGeom = new THREE.IcosahedronGeometry(1.0, 1);
    coreMesh = new THREE.Mesh(coreGeom, holoMaterial);
    jarvisSoul.add(coreMesh);

    // 2. CAPA INTERMEDIA: Esfera cuadriculada masiva para emular flujo constante de matriz de datos
    const midGeom = new THREE.SphereGeometry(1.6, 14, 14);
    midMesh = new THREE.Mesh(midGeom, new THREE.MeshBasicMaterial({
        color: 0x00a2ff,
        wireframe: true,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending
    }));
    jarvisSoul.add(midMesh);

    // 3. CAPAS EXTERNAS: Anillos poligonales que se intersectan perpendicularmente en el espacio
    function createSolidRing(innerRadius, outerRadius, segments, rotX, rotY) {
        const geom = new THREE.RingGeometry(innerRadius, outerRadius, segments);
        const mat = new THREE.MeshBasicMaterial({
            color: 0x00d4ff,
            wireframe: true,
            transparent: true,
            opacity: 0.4,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending
        });
        const mesh = new THREE.Mesh(geom, mat);
        mesh.rotation.x = rotX;
        mesh.rotation.y = rotY;
        return mesh;
    }

    orbit1 = createSolidRing(2.1, 2.2, 24, Math.PI / 3, Math.PI / 4);
    orbit2 = createSolidRing(1.8, 1.85, 18, -Math.PI / 4, Math.PI / 6);
    jarvisSoul.add(orbit1, orbit2);

    // 4. PUNTO DE ENERGÍA CRÍTICO: Núcleo emisor blanco de alta luminiscencia interna
    const centerGeom = new THREE.SphereGeometry(0.28, 8, 8);
    const centerMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.85
    });
    brightCenter = new THREE.Mesh(centerGeom, centerMat);
    jarvisSoul.add(brightCenter);

    // Ejecución inmediata del bucle infinito de renderizado
    animateCore();

    // Enlace de reajuste dinámico de resolución al alterar el monitor
    window.addEventListener('resize', onWindowResize);
}

/**
 * Loop de renderizado gráfico de alta tasa de refresco. Modula rotaciones y pulsaciones bio-miméticas.
 */
function animateCore() {
    requestAnimationFrame(animateCore);
    const elapsedTime = clock.getElapsedTime();

    // Rotaciones diferenciales desincronizadas en ejes X e Y para denotar profundidad geométrica
    coreMesh.rotation.y = elapsedTime * 0.40;
    coreMesh.rotation.x = elapsedTime * 0.22;
    midMesh.rotation.y = -elapsedTime * 0.15;
    
    orbit1.rotation.z = elapsedTime * 0.25;
    orbit2.rotation.z = -elapsedTime * 0.35;

    // Simulación inercial magnética: Balanceo armónico de cabeceo flotante libre
    jarvisSoul.rotation.y = Math.sin(elapsedTime * 0.35) * 0.12;
    jarvisSoul.rotation.x = Math.cos(elapsedTime * 0.25) * 0.08;

    // Dinámica reactiva según el estado operacional del Framework cognitivo
    if (isThinking) {
        // Modo Computación: Pulsación frenética de alta frecuencia
        let pulse = 1.0 + Math.sin(elapsedTime * 30.0) * 0.07;
        coreMesh.scale.setScalar(pulse * 1.08);
        brightCenter.scale.setScalar(1.0 + Math.sin(elapsedTime * 30.0) * 0.15);
    } else {
        // Modo Suspensión: Ondulación pasiva sinusoidal calmada
        let pulse = 1.0 + Math.sin(elapsedTime * 2.5) * 0.04;
        coreMesh.scale.setScalar(pulse);
        brightCenter.scale.setScalar(1.0 + Math.sin(elapsedTime * 5.0) * 0.04);
    }

    renderer.render(scene, camera);
}

/**
 * Modifica globalmente el estado de oscilación del alma del asistente.
 * @param {boolean} thinking - Define si la IA se encuentra procesando datos.
 */
function setCoreState(thinking) {
    isThinking = thinking;
}

/**
 * Redimensiona el canvas gráfico de manera proporcional al HUD del navegador.
 */
function onWindowResize() {
    const container = document.getElementById('canvas3d-container');
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}
