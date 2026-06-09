// ============================================================================
// STARK PROTOCOLO: CORE VECTORIAL GRÁFICO (ALMA DE J.A.R.V.I.S - BLOOM EDITION)
// ============================================================================

let scene, camera, renderer, composer, jarvisSoul, coreMesh, midMesh, orbit1, orbit2, brightCenter;
let isThinking = false;
let clock = new THREE.Clock();

function initCore() {
    const container = document.getElementById('canvas3d-container');
    if (!container) return;

    // ESCENA
    scene = new THREE.Scene();

    // CÁMARA
    camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5.5;

    // RENDERER
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // =====================================================
    // CONFIGURACIÓN DE POST-PROCESADO (BLOOM PROFESIONAL)
    // =====================================================
    const renderScene = new THREE.RenderPass(scene, camera);
    const bloomPass = new THREE.UnrealBloomPass(
        new THREE.Vector2(container.clientWidth, container.clientHeight), 
        1.5, // Intensidad del brillo
        0.4, // Radio
        0.85 // Threshold (umbral de luz)
    );
    
    composer = new THREE.EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    // LUCES (Mantenidas de tu original)
    scene.add(new THREE.PointLight(0x00d4ff, 5));
    scene.add(new THREE.PointLight(0xffffff, 3));
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));

    // GRUPO PRINCIPAL
    jarvisSoul = new THREE.Group();
    scene.add(jarvisSoul);

    // MATERIALES (El secreto del brillo es el color Emissive)
    const holoMaterial = new THREE.MeshPhongMaterial({
        color: 0x00d4ff,
        wireframe: true,
        emissive: 0x005577, // Emisividad para que el Bloom lo detecte
        shininess: 150,
        transparent: true,
        opacity: 0.65
    });

    // GEOMETRÍAS (Idénticas a las tuyas)
    coreMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1.0, 3), holoMaterial);
    midMesh = new THREE.Mesh(new THREE.SphereGeometry(1.6, 24, 24), new THREE.MeshPhongMaterial({ color: 0x00a2ff, wireframe: true, emissive: 0x002244, transparent: true, opacity: 0.20 }));
    
    // ANILLOS
    function createSolidRing(radius, rotX, rotY) {
        const mesh = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.03, 12, 64), holoMaterial);
        mesh.rotation.set(rotX, rotY, 0);
        return mesh;
    }
    orbit1 = createSolidRing(2.1, Math.PI / 3, Math.PI / 4);
    orbit2 = createSolidRing(1.8, -Math.PI / 4, Math.PI / 6);

    // NÚCLEO CENTRAL BRILLANTE
    brightCenter = new THREE.Mesh(new THREE.SphereGeometry(0.28, 32, 32), new THREE.MeshPhongMaterial({ color: 0xffffff, emissive: 0x00d4ff, shininess: 300 }));

    jarvisSoul.add(coreMesh, midMesh, orbit1, orbit2, brightCenter);

    animateCore();
    window.addEventListener('resize', onWindowResize);
}

function animateCore() {
    requestAnimationFrame(animateCore);
    const t = clock.getElapsedTime();

    // Animaciones
    coreMesh.rotation.set(t * 0.22, t * 0.4, 0);
    midMesh.rotation.y = -t * 0.15;
    orbit1.rotation.z = t * 0.25;
    orbit2.rotation.z = -t * 0.35;
    jarvisSoul.rotation.set(Math.cos(t * 0.25) * 0.08, Math.sin(t * 0.35) * 0.12, 0);

    // Lógica de pulso
    const pulse = isThinking ? 1.0 + Math.sin(t * 30.0) * 0.07 : 1.0 + Math.sin(t * 2.5) * 0.04;
    coreMesh.scale.setScalar(pulse * (isThinking ? 1.08 : 1.0));
    brightCenter.scale.setScalar(1.0 + Math.sin(t * (isThinking ? 30.0 : 5.0)) * (isThinking ? 0.15 : 0.04));

    // Renderizado a través del compositor (BLOOM)
    composer.render();
}

function onWindowResize() {
    const container = document.getElementById('canvas3d-container');
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
    composer.setSize(container.clientWidth, container.clientHeight);
}
