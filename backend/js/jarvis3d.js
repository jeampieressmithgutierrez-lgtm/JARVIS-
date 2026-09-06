/* =========================================================
   STARK INDUSTRIES
   J.A.R.V.I.S. — 3D IDENTITY CORE
   Three.js / WebGL
========================================================= */

import * as THREE from "three";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

const stage = document.getElementById("jarvis3d-stage");

if (!stage) {
    console.warn("[JARVIS 3D] Stage no encontrado.");
} else {

    let scene;
    let camera;
    let renderer;
    let group;
    let mainText;
    let goldShell;
    let subtitle;
    let lightSweep;
    let animationFrame;

    const pointer = {
        x: 0,
        y: 0,
        targetX: 0,
        targetY: 0
    };

    const clock = new THREE.Clock();

    init();

    function init() {

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(
            32,
            stage.clientWidth / stage.clientHeight,
            0.1,
            100
        );

        camera.position.set(0, 0.05, 5.5);

        renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });

        renderer.setPixelRatio(
            Math.min(window.devicePixelRatio || 1, 2)
        );

        renderer.setSize(
            stage.clientWidth,
            stage.clientHeight
        );

        renderer.outputColorSpace = THREE.SRGBColorSpace;

        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.15;

        renderer.domElement.className = "jarvis3d-canvas";

        stage.appendChild(renderer.domElement);

        createLights();
        createInterfaceElements();
        loadFont();

        window.addEventListener(
            "resize",
            resize
        );

        window.addEventListener(
            "pointermove",
            handlePointer
        );

        animate();
    }

    /* =====================================================
       ILUMINACIÓN
    ===================================================== */

    function createLights() {

        const ambient = new THREE.AmbientLight(
            0xffffff,
            1.1
        );

        scene.add(ambient);

        const goldLight = new THREE.PointLight(
            0xffb400,
            10,
            8
        );

        goldLight.position.set(
            -2.2,
            1.2,
            2.8
        );

        scene.add(goldLight);

        const redLight = new THREE.PointLight(
            0xff241c,
            8,
            7
        );

        redLight.position.set(
            2.5,
            -0.8,
            2.2
        );

        scene.add(redLight);

        const whiteLight = new THREE.PointLight(
            0xffffff,
            5,
            6
        );

        whiteLight.position.set(
            0,
            1.8,
            3.5
        );

        scene.add(whiteLight);
    }

    /* =====================================================
       ELEMENTOS HOLOGRÁFICOS
    ===================================================== */

    function createInterfaceElements() {

        const interfaceGroup = new THREE.Group();

        /* Línea horizontal */

        const lineGeometry = new THREE.BufferGeometry();

        lineGeometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(
                [
                    -2.7, -0.92, -0.25,
                     2.7, -0.92, -0.25
                ],
                3
            )
        );

        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0xffb400,
            transparent: true,
            opacity: 0.42
        });

        const line = new THREE.Line(
            lineGeometry,
            lineMaterial
        );

        interfaceGroup.add(line);

        /* Anillos laterales */

        const ringMaterial = new THREE.MeshBasicMaterial({
            color: 0xffb400,
            transparent: true,
            opacity: 0.28,
            side: THREE.DoubleSide
        });

        const leftRing = new THREE.Mesh(
            new THREE.RingGeometry(
                0.30,
                0.315,
                64
            ),
            ringMaterial
        );

        leftRing.position.set(
            -2.45,
            0.15,
            -0.4
        );

        leftRing.rotation.y = Math.PI / 2;

        interfaceGroup.add(leftRing);

        const rightRing = leftRing.clone();

        rightRing.position.x = 2.45;

        interfaceGroup.add(rightRing);

        /* Puntos holográficos */

        const points = [];

        for (let i = 0; i < 28; i++) {

            const x = (Math.random() - 0.5) * 5.6;
            const y = (Math.random() - 0.5) * 1.5;
            const z = -0.4 - Math.random() * 0.8;

            points.push(x, y, z);
        }

        const pointsGeometry =
            new THREE.BufferGeometry();

        pointsGeometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(
                points,
                3
            )
        );

        const pointsMaterial =
            new THREE.PointsMaterial({
                color: 0xffb400,
                size: 0.025,
                transparent: true,
                opacity: 0.55
            });

        const stars = new THREE.Points(
            pointsGeometry,
            pointsMaterial
        );

        interfaceGroup.add(stars);

        scene.add(interfaceGroup);

        group = interfaceGroup;
    }

    /* =====================================================
       TEXTO 3D
    ===================================================== */

    function loadFont() {

        const loader = new FontLoader();

        loader.load(
            "https://cdn.jsdelivr.net/npm/three@0.180.0/examples/fonts/helvetiker_bold.typeface.json",

            function(font) {

                createMainText(font);
                createSubtitle(font);

            },

            undefined,

            function(error) {

                console.error(
                    "[JARVIS 3D] No se pudo cargar la fuente.",
                    error
                );

                createFallback();
            }
        );
    }

    function createMainText(font) {

        const geometry = new TextGeometry(
            "J.A.R.V.I.S.",
            {
                font: font,
                size: 0.52,
                depth: 0.17,

                curveSegments: 10,

                bevelEnabled: true,
                bevelThickness: 0.035,
                bevelSize: 0.025,
                bevelOffset: 0,
                bevelSegments: 5
            }
        );

        geometry.computeBoundingBox();

        const centerOffset =
            -0.5 *
            (
                geometry.boundingBox.max.x -
                geometry.boundingBox.min.x
            );

        geometry.translate(
            centerOffset,
            -0.22,
            0
        );

        /* CAPA DORADA */

        const shellGeometry =
            geometry.clone();

        const shellMaterial =
            new THREE.MeshStandardMaterial({

                color: 0xffb400,

                metalness: 0.95,
                roughness: 0.20,

                emissive: 0x5c3000,
                emissiveIntensity: 0.18
            });

        goldShell = new THREE.Mesh(
            shellGeometry,
            shellMaterial
        );

        goldShell.scale.set(
            1.018,
            1.018,
            1.018
        );

        goldShell.position.z = -0.045;

        scene.add(goldShell);

        /* CUERPO PRINCIPAL */

        const material =
            new THREE.MeshStandardMaterial({

                color: 0x5b1115,

                metalness: 0.94,
                roughness: 0.19,

                emissive: 0x260304,
                emissiveIntensity: 0.22
            });

        mainText = new THREE.Mesh(
            geometry,
            material
        );

        mainText.position.z = 0;

        scene.add(mainText);

        /* REFLEJO METÁLICO */

        const highlightMaterial =
            new THREE.MeshStandardMaterial({

                color: 0xd73526,

                metalness: 1,
                roughness: 0.12,

                emissive: 0x160000,
                emissiveIntensity: 0.15
            });

        const highlight =
            new THREE.Mesh(
                geometry.clone(),
                highlightMaterial
            );

        highlight.scale.set(
            0.998,
            0.998,
            0.72
        );

        highlight.position.z = 0.025;

        scene.add(highlight);
    }

    /* =====================================================
       SUBTÍTULO 3D
    ===================================================== */

    function createSubtitle(font) {

        const geometry =
            new TextGeometry(
                "ARTIFICIAL INTELLIGENCE",
                {
                    font: font,
                    size: 0.115,
                    depth: 0.035,
                    curveSegments: 5,
                    bevelEnabled: true,
                    bevelThickness: 0.008,
                    bevelSize: 0.006,
                    bevelSegments: 2
                }
            );

        geometry.computeBoundingBox();

        const width =
            geometry.boundingBox.max.x -
            geometry.boundingBox.min.x;

        geometry.translate(
            -width / 2,
            -0.72,
            0
        );

        const material =
            new THREE.MeshStandardMaterial({

                color: 0xaaaeb5,

                metalness: 0.8,
                roughness: 0.3,

                emissive: 0x222222,
                emissiveIntensity: 0.25
            });

        subtitle =
            new THREE.Mesh(
                geometry,
                material
            );

        subtitle.position.z = 0;

        scene.add(subtitle);
    }

    /* =====================================================
       FALLBACK
    ===================================================== */

    function createFallback() {

        const fallback =
            document.createElement("div");

        fallback.className =
            "jarvis3d-fallback";

        fallback.innerHTML = `
            <strong>J.A.R.V.I.S.</strong>
            <span>ARTIFICIAL INTELLIGENCE</span>
        `;

        stage.appendChild(fallback);
    }

    /* =====================================================
       PARALLAX
    ===================================================== */

    function handlePointer(event) {

        const rect =
            stage.getBoundingClientRect();

        const x =
            (event.clientX - rect.left) /
            rect.width;

        const y =
            (event.clientY - rect.top) /
            rect.height;

        pointer.targetX =
            (x - 0.5) * 2;

        pointer.targetY =
            (y - 0.5) * 2;
    }

    /* =====================================================
       ANIMACIÓN
    ===================================================== */

    function animate() {

        animationFrame =
            requestAnimationFrame(
                animate
            );

        const elapsed =
            clock.getElapsedTime();

        pointer.x +=
            (pointer.targetX - pointer.x) *
            0.035;

        pointer.y +=
            (pointer.targetY - pointer.y) *
            0.035;

        if (mainText) {

            mainText.rotation.y =
                pointer.x * 0.13 +
                Math.sin(elapsed * 0.65) * 0.018;

            mainText.rotation.x =
                -pointer.y * 0.07;

            mainText.position.y =
                Math.sin(elapsed * 0.9) *
                0.012;
        }

        if (goldShell) {

            goldShell.rotation.y =
                pointer.x * 0.13 +
                Math.sin(elapsed * 0.65) * 0.018;

            goldShell.rotation.x =
                -pointer.y * 0.07;

            goldShell.position.y =
                Math.sin(elapsed * 0.9) *
                0.012;
        }

        if (subtitle) {

            subtitle.rotation.y =
                pointer.x * 0.09;

            subtitle.rotation.x =
                -pointer.y * 0.045;
        }

        if (group) {

            group.rotation.z =
                Math.sin(elapsed * 0.25) *
                0.006;
        }

        renderer.render(
            scene,
            camera
        );
    }

    /* =====================================================
       RESPONSIVE
    ===================================================== */

    function resize() {

        if (!stage || !renderer) {
            return;
        }

        const width =
            Math.max(stage.clientWidth, 1);

        const height =
            Math.max(stage.clientHeight, 1);

        camera.aspect =
            width / height;

        camera.updateProjectionMatrix();

        renderer.setSize(
            width,
            height
        );
    }
}
