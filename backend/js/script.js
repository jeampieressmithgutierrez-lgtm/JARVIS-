/* =========================================================
   J.A.R.V.I.S.
   STARK HOLOGRAPHIC CORE
   THREE.JS + WEBGL2 + UNREAL BLOOM
   ========================================================= */

"use strict";

import * as THREE from "three";

import {
    EffectComposer
} from "three/addons/postprocessing/EffectComposer.js";

import {
    RenderPass
} from "three/addons/postprocessing/RenderPass.js";

import {
    UnrealBloomPass
} from "three/addons/postprocessing/UnrealBloomPass.js";


/* =========================================================
   CONFIGURACIÓN
   ========================================================= */

const CONFIG = {

    colors: {

        gold: 0xffb52e,

        goldBright: 0xffd76a,

        amber: 0xff7a00,

        cyan: 0x00bfff,

        dark: 0x020407

    },

    bloom: {

        strength: 1.65,

        radius: 0.75,

        threshold: 0.05

    }

};


/* =========================================================
   VARIABLES PRINCIPALES
   ========================================================= */

let scene;
let camera;
let renderer;
let composer;

let coreGroup;

let particleCore;
let innerShell;

let ringGroup;
let outerGroup;

let clock;

let mouse = {
    x: 0,
    y: 0
};


/* =========================================================
   INICIALIZACIÓN
   ========================================================= */

function init() {

    const container =
        document.getElementById(
            "three-background"
        );

    if (!container) {

        console.error(
            "[JARVIS 3D] No existe #three-background"
        );

        return;
    }


    /* =====================================================
       ESCENA
    ====================================================== */

    scene =
        new THREE.Scene();

    scene.background =
        new THREE.Color(
            CONFIG.colors.dark
        );


    /* =====================================================
       CÁMARA
    ====================================================== */

    camera =
        new THREE.PerspectiveCamera(

            45,

            window.innerWidth /
            window.innerHeight,

            0.1,

            100
        );

    camera.position.set(
        0,
        0,
        10
    );


    /* =====================================================
       RENDERER WEBGL2
    ====================================================== */

    renderer =
        new THREE.WebGLRenderer({

            antialias: true,

            alpha: true,

            powerPreference:
                "high-performance"
        });


    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            1.75
        )
    );


    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );


    renderer.outputColorSpace =
        THREE.SRGBColorSpace;


    /*
       Tone mapping es importante para obtener un resultado
       correcto con UnrealBloomPass.
    */
    renderer.toneMapping =
        THREE.ACESFilmicToneMapping;

    renderer.toneMappingExposure =
        1.15;


    container.appendChild(
        renderer.domElement
    );


    /* =====================================================
       COMPOSITOR
    ====================================================== */

    composer =
        new EffectComposer(
            renderer
        );


    const renderPass =
        new RenderPass(
            scene,
            camera
        );


    composer.addPass(
        renderPass
    );


    /* =====================================================
       BLOOM
    ====================================================== */

    const bloomPass =
        new UnrealBloomPass(

            new THREE.Vector2(
                window.innerWidth,
                window.innerHeight
            ),

            CONFIG.bloom.strength,

            CONFIG.bloom.radius,

            CONFIG.bloom.threshold
        );


    composer.addPass(
        bloomPass
    );


    /* =====================================================
       RELOJ
    ====================================================== */

    clock =
        new THREE.Clock();


    /* =====================================================
       CORE
    ====================================================== */

    createCore();


    /* =====================================================
       EVENTOS
    ====================================================== */

    window.addEventListener(
        "resize",
        onResize
    );


    window.addEventListener(
        "pointermove",
        onPointerMove,
        { passive: true }
    );


    /* =====================================================
       START
    ====================================================== */

    animate();
}


/* =========================================================
   CREAR CORE
   ========================================================= */

function createCore() {

    coreGroup =
        new THREE.Group();


    scene.add(
        coreGroup
    );


    /*
       Escalamos ligeramente el núcleo para que no domine
       toda la interfaz.
    */

    coreGroup.scale.setScalar(
        1.35
    );


    /* =====================================================
       CAPA 1
       NÚCLEO DENSO DE PARTÍCULAS
    ====================================================== */

    const particleGeometry =
        new THREE.SphereGeometry(

            1.55,

            72,

            72
        );


    const particleMaterial =
        new THREE.PointsMaterial({

            color:
                CONFIG.colors.goldBright,

            size:
                0.045,

            transparent:
                true,

            opacity:
                0.82,

            blending:
                THREE.AdditiveBlending,

            depthWrite:
                false,

            sizeAttenuation:
                true
        });


    particleCore =
        new THREE.Points(

            particleGeometry,

            particleMaterial
        );


    coreGroup.add(
        particleCore
    );


    /* =====================================================
       ESFERA INTERIOR
    ====================================================== */

    const shellGeometry =
        new THREE.SphereGeometry(

            1.32,

            64,

            64
        );


    const shellMaterial =
        new THREE.MeshBasicMaterial({

            color:
                CONFIG.colors.amber,

            transparent:
                true,

            opacity:
                0.09,

            blending:
                THREE.AdditiveBlending,

            depthWrite:
                false
        });


    innerShell =
        new THREE.Mesh(

            shellGeometry,

            shellMaterial
        );


    coreGroup.add(
        innerShell
    );


    /* =====================================================
       CAPA 2
       ANILLOS TORUS
    ====================================================== */

    ringGroup =
        new THREE.Group();


    coreGroup.add(
        ringGroup
    );


    const ringMaterial =
        new THREE.MeshBasicMaterial({

            color:
                CONFIG.colors.gold,

            transparent:
                true,

            opacity:
                0.68,

            wireframe:
                true,

            blending:
                THREE.AdditiveBlending,

            depthWrite:
                false
        });


    const ringConfigurations = [

        {
            radius: 1.85,
            tube: 0.018,
            rotation: [0, 0, 0],
            speed: 0.30
        },

        {
            radius: 2.05,
            tube: 0.014,
            rotation: [Math.PI / 2, 0, 0],
            speed: -0.22
        },

        {
            radius: 2.25,
            tube: 0.012,
            rotation: [0, Math.PI / 2, 0],
            speed: 0.17
        }

    ];


    ringConfigurations.forEach(
        config => {

            const geometry =
                new THREE.TorusGeometry(

                    config.radius,

                    config.tube,

                    10,

                    128
                );


            const ring =
                new THREE.Mesh(

                    geometry,

                    ringMaterial.clone()
                );


            ring.rotation.set(
                ...config.rotation
            );


            ring.userData.speed =
                config.speed;


            ringGroup.add(
                ring
            );
        }
    );


    /* =====================================================
       CAPA 3
       ICOSAEDRO EXTERIOR
    ====================================================== */

    outerGroup =
        new THREE.Group();


    coreGroup.add(
        outerGroup
    );


    const icoGeometry =
        new THREE.IcosahedronGeometry(

            2.55,

            2
        );


    const icoMaterial =
        new THREE.MeshBasicMaterial({

            color:
                CONFIG.colors.goldBright,

            wireframe:
                true,

            transparent:
                true,

            opacity:
                0.26,

            blending:
                THREE.AdditiveBlending,

            depthWrite:
                false
        });


    const icosahedron =
        new THREE.Mesh(

            icoGeometry,

            icoMaterial
        );


    outerGroup.add(
        icosahedron
    );


    /* =====================================================
       AROS EXTERIORES ADICIONALES
    ====================================================== */

    const outerRingData = [

        {
            radius: 2.75,
            rotation: [0.4, 0.1, 0],
            speed: 0.11
        },

        {
            radius: 2.95,
            rotation: [1.2, 0.6, 0.7],
            speed: -0.08
        }

    ];


    outerRingData.forEach(
        config => {

            const geometry =
                new THREE.TorusGeometry(

                    config.radius,

                    0.010,

                    8,

                    160
                );


            const material =
                new THREE.MeshBasicMaterial({

                    color:
                        CONFIG.colors.goldBright,

                    transparent:
                        true,

                    opacity:
                        0.38,

                    blending:
                        THREE.AdditiveBlending,

                    depthWrite:
                        false
                });


            const ring =
                new THREE.Mesh(
                    geometry,
                    material
                );


            ring.rotation.set(
                ...config.rotation
            );


            ring.userData.speed =
                config.speed;


            outerGroup.add(
                ring
            );
        }
    );


    /* =====================================================
       PARTÍCULAS ORBITALES
    ====================================================== */

    createOrbitalParticles();
}


/* =========================================================
   PARTÍCULAS ORBITALES
   ========================================================= */

function createOrbitalParticles() {

    const count = 900;

    const positions =
        new Float32Array(
            count * 3
        );


    for (
        let i = 0;
        i < count;
        i++
    ) {

        const radius =
            2.2 +
            Math.random() * 2.7;


        const theta =
            Math.random() *
            Math.PI * 2;


        const phi =
            Math.acos(
                2 * Math.random() - 1
            );


        positions[i * 3] =
            radius *
            Math.sin(phi) *
            Math.cos(theta);


        positions[i * 3 + 1] =
            radius *
            Math.sin(phi) *
            Math.sin(theta);


        positions[i * 3 + 2] =
            radius *
            Math.cos(phi);
    }


    const geometry =
        new THREE.BufferGeometry();


    geometry.setAttribute(

        "position",

        new THREE.BufferAttribute(
            positions,
            3
        )
    );


    const material =
        new THREE.PointsMaterial({

            color:
                CONFIG.colors.cyan,

            size:
                0.018,

            transparent:
                true,

            opacity:
                0.48,

            blending:
                THREE.AdditiveBlending,

            depthWrite:
                false
        });


    const particles =
        new THREE.Points(
            geometry,
            material
        );


    particles.userData.speed =
        0.025;


    outerGroup.add(
        particles
    );
}


/* =========================================================
   ANIMACIÓN
   ========================================================= */

function animate() {

    requestAnimationFrame(
        animate
    );


    const elapsed =
        clock.getElapsedTime();


    /* =====================================================
       NÚCLEO
    ====================================================== */

    if (particleCore) {

        particleCore.rotation.x =
            elapsed * 0.045;

        particleCore.rotation.y =
            elapsed * 0.065;

        particleCore.rotation.z =
            elapsed * 0.025;
    }


    /* =====================================================
       SHELL
    ====================================================== */

    if (innerShell) {

        const pulse =
            1 +
            Math.sin(elapsed * 2.2)
            * 0.025;


        innerShell.scale.setScalar(
            pulse
        );
    }


    /* =====================================================
       ANILLOS
    ====================================================== */

    if (ringGroup) {

        ringGroup.children
            .forEach(ring => {

                ring.rotation.x +=
                    ring.userData.speed *
                    0.002;

                ring.rotation.y +=
                    ring.userData.speed *
                    0.003;
            });
    }


    /* =====================================================
       ICOSAEDRO / EXTERIOR
    ====================================================== */

    if (outerGroup) {

        outerGroup.rotation.x =
            elapsed * 0.045;

        outerGroup.rotation.y =
            elapsed * 0.065;

        outerGroup.rotation.z =
            elapsed * 0.025;
    }


    /* =====================================================
       MOVIMIENTO DE CÁMARA
       RESPUESTA AL CURSOR
    ====================================================== */

    camera.position.x +=
        (
            mouse.x * 0.65 -
            camera.position.x
        ) * 0.025;


    camera.position.y +=
        (
            mouse.y * 0.35 -
            camera.position.y
        ) * 0.025;


    camera.lookAt(
        0,
        0,
        0
    );


    /* =====================================================
       RENDER
    ====================================================== */

    composer.render();
}


/* =========================================================
   RESIZE
   ========================================================= */

function onResize() {

    const width =
        window.innerWidth;

    const height =
        window.innerHeight;


    camera.aspect =
        width / height;


    camera.updateProjectionMatrix();


    renderer.setSize(
        width,
        height
    );


    composer.setSize(
        width,
        height
    );


    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            1.75
        )
    );
}


/* =========================================================
   MOUSE / TOUCH
   ========================================================= */

function onPointerMove(event) {

    mouse.x =
        (
            event.clientX /
            window.innerWidth
        ) * 2 - 1;


    mouse.y =
        -(
            event.clientY /
            window.innerHeight
        ) * 2 + 1;
}


/* =========================================================
   ARRANQUE
   ========================================================= */

init();
