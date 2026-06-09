// ============================================================================
// STARK PROTOCOLO: CORE VECTORIAL GRÁFICO (ALMA DE J.A.R.V.I.S)
// ============================================================================

let scene, camera, renderer, jarvisSoul, coreMesh, midMesh, orbit1, orbit2, brightCenter;
let isThinking = false;
let clock = new THREE.Clock();

function initCore() {

    const container = document.getElementById('canvas3d-container');

    if (!container) {
        console.error("[CRITICAL CORE] No se encontró el contenedor.");
        return;
    }

    // ESCENA
    scene = new THREE.Scene();

    // =====================================================
    // ILUMINACIÓN AVANZADA
    // =====================================================

    const light1 = new THREE.PointLight(0x00d4ff, 5);
    light1.position.set(5, 5, 5);
    scene.add(light1);

    const light2 = new THREE.PointLight(0xffffff, 3);
    light2.position.set(-5, -5, 5);
    scene.add(light2);

    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambient);

    // CÁMARA

    camera = new THREE.PerspectiveCamera(
        50,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );

    camera.position.z = 5.5;

    // RENDER

    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });

    renderer.setSize(
        container.clientWidth,
        container.clientHeight
    );

    renderer.setPixelRatio(window.devicePixelRatio);

    container.appendChild(renderer.domElement);

    // GRUPO PRINCIPAL

    jarvisSoul = new THREE.Group();
    scene.add(jarvisSoul);

    // =====================================================
    // MATERIAL PRINCIPAL
    // =====================================================

    const holoMaterial = new THREE.MeshPhongMaterial({
        color: 0x00d4ff,
        wireframe: true,
        emissive: 0x003344,
        shininess: 150,
        transparent: true,
        opacity: 0.65
    });

    // =====================================================
    // NÚCLEO CENTRAL
    // =====================================================

    const coreGeom = new THREE.IcosahedronGeometry(
        1.0,
        3
    );

    coreMesh = new THREE.Mesh(
        coreGeom,
        holoMaterial
    );

    jarvisSoul.add(coreMesh);

    // =====================================================
    // CAPA INTERMEDIA
    // =====================================================

    const midGeom = new THREE.SphereGeometry(
        1.6,
        24,
        24
    );

    midMesh = new THREE.Mesh(
        midGeom,
        new THREE.MeshPhongMaterial({
            color: 0x00a2ff,
            wireframe: true,
            emissive: 0x001122,
            transparent: true,
            opacity: 0.20
        })
    );

    jarvisSoul.add(midMesh);

    // =====================================================
    // ANILLOS 3D
    // =====================================================

    function createSolidRing(radius, rotX, rotY) {

        const geom = new THREE.TorusGeometry(
            radius,
            0.03,
            12,
            64
        );

        const mat = new THREE.MeshPhongMaterial({
            color: 0x00d4ff,
            wireframe: true,
            emissive: 0x002233,
            transparent: true,
            opacity: 0.45
        });

        const mesh = new THREE.Mesh(
            geom,
            mat
        );

        mesh.rotation.x = rotX;
        mesh.rotation.y = rotY;

        return mesh;
    }

    orbit1 = createSolidRing(
        2.1,
        Math.PI / 3,
        Math.PI / 4
    );

    orbit2 = createSolidRing(
        1.8,
        -Math.PI / 4,
        Math.PI / 6
    );

    jarvisSoul.add(orbit1);
    jarvisSoul.add(orbit2);

    // =====================================================
    // NÚCLEO DE ENERGÍA
    // =====================================================

    const centerGeom = new THREE.SphereGeometry(
        0.28,
        32,
        32
    );

    const centerMat = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        emissive: 0x00d4ff,
        shininess: 300,
        transparent: true,
        opacity: 1
    });

    brightCenter = new THREE.Mesh(
        centerGeom,
        centerMat
    );

    jarvisSoul.add(brightCenter);

    // INICIAR

    animateCore();

    window.addEventListener(
        'resize',
        onWindowResize
    );
}

function animateCore() {

    requestAnimationFrame(
        animateCore
    );

    const elapsedTime =
        clock.getElapsedTime();

    coreMesh.rotation.y =
        elapsedTime * 0.40;

    coreMesh.rotation.x =
        elapsedTime * 0.22;

    midMesh.rotation.y =
        -elapsedTime * 0.15;

    orbit1.rotation.z =
        elapsedTime * 0.25;

    orbit2.rotation.z =
        -elapsedTime * 0.35;

    jarvisSoul.rotation.y =
        Math.sin(elapsedTime * 0.35) * 0.12;

    jarvisSoul.rotation.x =
        Math.cos(elapsedTime * 0.25) * 0.08;

    if (isThinking) {

        let pulse =
            1.0 +
            Math.sin(elapsedTime * 30.0) * 0.07;

        coreMesh.scale.setScalar(
            pulse * 1.08
        );

        brightCenter.scale.setScalar(
            1.0 +
            Math.sin(elapsedTime * 30.0) * 0.15
        );

    } else {

        let pulse =
            1.0 +
            Math.sin(elapsedTime * 2.5) * 0.04;

        coreMesh.scale.setScalar(
            pulse
        );

        brightCenter.scale.setScalar(
            1.0 +
            Math.sin(elapsedTime * 5.0) * 0.04
        );
    }

    renderer.render(
        scene,
        camera
    );
}

function setCoreState(thinking) {
    isThinking = thinking;
}

function onWindowResize() {

    const container =
        document.getElementById(
            'canvas3d-container'
        );

    if (!container) return;

    camera.aspect =
        container.clientWidth /
        container.clientHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        container.clientWidth,
        container.clientHeight
    );
}
