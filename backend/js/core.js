// ============================================================================
// STARK PROTOCOLO: CORE VECTORIAL GRÁFICO (ALMA DE J.A.R.V.I.S)
// ============================================================================

let scene;
let camera;
let renderer;

let jarvisSoul;
let coreMesh;
let midMesh;
let orbit1;
let orbit2;
let brightCenter;

let stars;

let isThinking = false;

const clock = new THREE.Clock();

function initCore() {

    const container =
        document.getElementById(
            'canvas3d-container'
        );

    if (!container) {
        console.error(
            "[CRITICAL CORE] No se encontró el contenedor."
        );
        return;
    }

    // =====================================================
    // ESCENA
    // =====================================================

    scene = new THREE.Scene();

    scene.fog =
        new THREE.FogExp2(
            0x000814,
            0.05
        );

    // =====================================================
    // CÁMARA
    // =====================================================

    camera =
        new THREE.PerspectiveCamera(
            55,
            container.clientWidth /
            container.clientHeight,
            0.1,
            1000
        );

    camera.position.z = 6;

    // =====================================================
    // RENDER
    // =====================================================

    renderer =
        new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });

    renderer.setSize(
        container.clientWidth,
        container.clientHeight
    );

    renderer.setPixelRatio(
        window.devicePixelRatio
    );

    container.appendChild(
        renderer.domElement
    );

    // =====================================================
    // LUCES
    // =====================================================

    const ambient =
        new THREE.AmbientLight(
            0xffffff,
            1
        );

    scene.add(ambient);

    const light1 =
        new THREE.PointLight(
            0x00d4ff,
            6,
            100
        );

    light1.position.set(
        5,
        5,
        5
    );

    scene.add(light1);

    const light2 =
        new THREE.PointLight(
            0xffffff,
            4,
            100
        );

    light2.position.set(
        -5,
        -5,
        5
    );

    scene.add(light2);

    const light3 =
        new THREE.PointLight(
            0x00ffff,
            8,
            100
        );

    light3.position.set(
        0,
        0,
        3
    );

    scene.add(light3);

    // =====================================================
    // GRUPO PRINCIPAL
    // =====================================================

    jarvisSoul =
        new THREE.Group();

    scene.add(
        jarvisSoul
    );

    // =====================================================
    // MATERIAL PRINCIPAL
    // =====================================================

    const holoMaterial =
        new THREE.MeshPhysicalMaterial({
            color: 0x00d4ff,
            emissive: 0x00aaff,
            emissiveIntensity: 2,
            metalness: 1,
            roughness: 0,
            transmission: 0.6,
            transparent: true,
            opacity: 0.9,
            wireframe: true
        });

    // =====================================================
    // NÚCLEO CENTRAL
    // =====================================================

    const coreGeom =
        new THREE.IcosahedronGeometry(
            1.0,
            8
        );

    coreMesh =
        new THREE.Mesh(
            coreGeom,
            holoMaterial
        );

    jarvisSoul.add(
        coreMesh
    );

    // =====================================================
    // CAPA INTERMEDIA
    // =====================================================

    const midGeom =
        new THREE.SphereGeometry(
            1.8,
            48,
            48
        );

    midMesh =
        new THREE.Mesh(
            midGeom,
            new THREE.MeshPhysicalMaterial({
                color: 0x00a2ff,
                emissive: 0x0044aa,
                emissiveIntensity: 1,
                transparent: true,
                opacity: 0.12,
                wireframe: true,
                metalness: 1,
                roughness: 0
            })
        );

    jarvisSoul.add(
        midMesh
    );

    // =====================================================
    // ANILLOS
    // =====================================================

    function createRing(
        radius,
        rotX,
        rotY
    ) {

        const geom =
            new THREE.TorusGeometry(
                radius,
                0.04,
                24,
                120
            );

        const mat =
            new THREE.MeshPhysicalMaterial({
                color: 0x00d4ff,
                emissive: 0x00aaff,
                emissiveIntensity: 2,
                wireframe: true,
                transparent: true,
                opacity: 0.6,
                metalness: 1,
                roughness: 0
            });

        const mesh =
            new THREE.Mesh(
                geom,
                mat
            );

        mesh.rotation.x = rotX;
        mesh.rotation.y = rotY;

        return mesh;
    }

    orbit1 =
        createRing(
            2.4,
            Math.PI / 3,
            Math.PI / 4
        );

    orbit2 =
        createRing(
            2.0,
            -Math.PI / 4,
            Math.PI / 6
        );

    jarvisSoul.add(
        orbit1
    );

    jarvisSoul.add(
        orbit2
    );

    // =====================================================
    // NÚCLEO DE ENERGÍA
    // =====================================================

    const centerGeom =
        new THREE.SphereGeometry(
            0.35,
            64,
            64
        );

    const centerMat =
        new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            emissive: 0x00ffff,
            emissiveIntensity: 5,
            metalness: 1,
            roughness: 0,
            transmission: 1
        });

    brightCenter =
        new THREE.Mesh(
            centerGeom,
            centerMat
        );

    jarvisSoul.add(
        brightCenter
    );

    // =====================================================
    // PARTÍCULAS
    // =====================================================

    const particleGeometry =
        new THREE.BufferGeometry();

    const particleCount = 2000;

    const positions =
        new Float32Array(
            particleCount * 3
        );

    for (
        let i = 0;
        i < particleCount * 3;
        i++
    ) {

        positions[i] =
            (Math.random() - 0.5) * 20;
    }

    particleGeometry.setAttribute(
        'position',
        new THREE.BufferAttribute(
            positions,
            3
        )
    );

    const particleMaterial =
        new THREE.PointsMaterial({
            color: 0x00d4ff,
            size: 0.03,
            transparent: true,
            opacity: 0.8
        });

    stars =
        new THREE.Points(
            particleGeometry,
            particleMaterial
        );

    scene.add(
        stars
    );

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

    camera.position.x =
        Math.sin(
            elapsedTime * 0.2
        ) * 0.4;

    camera.position.y =
        Math.cos(
            elapsedTime * 0.15
        ) * 0.2;

    camera.lookAt(
        jarvisSoul.position
    );

    coreMesh.rotation.y =
        elapsedTime * 0.45;

    coreMesh.rotation.x =
        elapsedTime * 0.25;

    midMesh.rotation.y =
        -elapsedTime * 0.12;

    orbit1.rotation.z =
        elapsedTime * 0.30;

    orbit2.rotation.z =
        -elapsedTime * 0.40;

    stars.rotation.y =
        elapsedTime * 0.01;

    jarvisSoul.rotation.y =
        Math.sin(
            elapsedTime * 0.35
        ) * 0.15;

    jarvisSoul.rotation.x =
        Math.cos(
            elapsedTime * 0.25
        ) * 0.10;

    if (isThinking) {

        const pulse =
            1 +
            Math.sin(
                elapsedTime * 30
            ) * 0.08;

        coreMesh.scale.setScalar(
            pulse * 1.1
        );

        brightCenter.scale.setScalar(
            1 +
            Math.sin(
                elapsedTime * 30
            ) * 0.2
        );

    } else {

        const pulse =
            1 +
            Math.sin(
                elapsedTime * 2.5
            ) * 0.05;

        coreMesh.scale.setScalar(
            pulse
        );

        brightCenter.scale.setScalar(
            1 +
            Math.sin(
                elapsedTime * 5
            ) * 0.06
        );
    }

    renderer.render(
        scene,
        camera
    );
}

function setCoreState(
    thinking
) {
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
