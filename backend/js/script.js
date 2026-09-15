/* =========================================================
   J.A.R.V.I.S.
   THREE.JS / WEBGL COGNITIVE CORE
   STARK INDUSTRIES
========================================================= */

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

    coreScale:
        0.55,

    cameraZ:
        8.5,

    particleCount:
        2400,

    nodeCount:
        850,

    bloomStrength:
        1.1,

    bloomRadius:
        0.3,

    bloomThreshold:
        0.2,

    gold:
        0xffaa00,

    goldBright:
        0xffcc33,

    amber:
        0xff8c00

};


/* =========================================================
   DOM
========================================================= */

const container =
    document.getElementById("jarvis-core-stage");


if (!container) {

    console.warn(
        "[J.A.R.V.I.S.] No se encontró #jarvis-core-stage."
    );

} else {

    initJarvisCore();

}


/* =========================================================
   VARIABLES
========================================================= */

let scene;
let camera;
let renderer;
let composer;

let reactor;
let corePoints;
let nodeField;
let orbitalField;

let innerRing;
let middleRing;
let outerRing;

let circuitGroup;
let connectionGroup;

let clock3D;

const pointer =
    new THREE.Vector2(0, 0);

const targetRotation =
    new THREE.Vector2(0, 0);


/* =========================================================
   INICIALIZACIÓN
========================================================= */

function initJarvisCore() {

    clock3D =
        new THREE.Clock();


    /* -----------------------------------------------------
       SCENE
    ----------------------------------------------------- */

    scene =
        new THREE.Scene();


    /* -----------------------------------------------------
       CAMERA
    ----------------------------------------------------- */

    camera =
        new THREE.PerspectiveCamera(
            42,
            getAspect(),
            0.1,
            100
        );

    camera.position.z =
        CONFIG.cameraZ;


    /* -----------------------------------------------------
       RENDERER
    ----------------------------------------------------- */

    renderer =
        new THREE.WebGLRenderer({

            antialias:
                true,

            alpha:
                true,

            powerPreference:
                "high-performance"

        });


    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio || 1,
            2
        )
    );


    renderer.setSize(
        container.clientWidth,
        container.clientHeight,
        false
    );


    renderer.outputColorSpace =
        THREE.SRGBColorSpace;


    renderer.toneMapping =
        THREE.ACESFilmicToneMapping;


    renderer.toneMappingExposure =
        1.05;


    renderer.domElement.setAttribute(
        "aria-hidden",
        "true"
    );


    container.appendChild(
        renderer.domElement
    );


    /* -----------------------------------------------------
       POST PROCESSING
    ----------------------------------------------------- */

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


    const bloomPass =
        new UnrealBloomPass(

            new THREE.Vector2(
                container.clientWidth,
                container.clientHeight
            ),

            CONFIG.bloomStrength,
            CONFIG.bloomRadius,
            CONFIG.bloomThreshold

        );


    bloomPass.strength =
        1.1;

    bloomPass.radius =
        0.3;

    bloomPass.threshold =
        0.2;


    composer.addPass(
        bloomPass
    );


    /* -----------------------------------------------------
       LIGHTING
    ----------------------------------------------------- */

    const ambient =
        new THREE.AmbientLight(
            0xffa500,
            0.15
        );


    scene.add(
        ambient
    );


    /* -----------------------------------------------------
       MAIN REACTOR
    ----------------------------------------------------- */

    reactor =
        new THREE.Group();


    reactor.scale.setScalar(
        CONFIG.coreScale
    );


    scene.add(
        reactor
    );


    /* -----------------------------------------------------
       CORE
    ----------------------------------------------------- */

    createCore();


    /* -----------------------------------------------------
       WIREFRAME
    ----------------------------------------------------- */

    createWireframe();


    /* -----------------------------------------------------
       NODES
    ----------------------------------------------------- */

    createNodes();


    /* -----------------------------------------------------
       CONNECTIONS
    ----------------------------------------------------- */

    createConnections();


    /* -----------------------------------------------------
       RINGS
    ----------------------------------------------------- */

    createRings();


    /* -----------------------------------------------------
       CIRCUITS
    ----------------------------------------------------- */

    createCircuitTraces();


    /* -----------------------------------------------------
       ORBITS
    ----------------------------------------------------- */

    createOrbitals();


    /* -----------------------------------------------------
       EVENTS
    ----------------------------------------------------- */

    window.addEventListener(
        "resize",
        onResize,
        {
            passive: true
        }
    );


    window.addEventListener(
        "pointermove",
        onPointerMove,
        {
            passive: true
        }
    );


    const observer =
        new ResizeObserver(
            onResize
        );


    observer.observe(
        container
    );


    /* -----------------------------------------------------
       LOOP
    ----------------------------------------------------- */

    animate();

}


/* =========================================================
   CORE — PUNTOS 3D
========================================================= */

function createCore() {

    const geometry =
        new THREE.IcosahedronGeometry(
            1.5,
            5
        );


    const material =
        new THREE.PointsMaterial({

            color:
                CONFIG.goldBright,

            size:
                0.018,

            transparent:
                true,

            opacity:
                0.88,

            blending:
                THREE.AdditiveBlending,

            depthWrite:
                false

        });


    corePoints =
        new THREE.Points(
            geometry,
            material
        );


    reactor.add(
        corePoints
    );


    /* -----------------------------------------------------
       INNER ENERGY SPHERE
    ----------------------------------------------------- */

    const sphereGeometry =
        new THREE.SphereGeometry(
            0.45,
            48,
            48
        );


    const sphereMaterial =
        new THREE.MeshBasicMaterial({

            color:
                0xffb300,

            transparent:
                true,

            opacity:
                0.075,

            blending:
                THREE.AdditiveBlending,

            depthWrite:
                false

        });


    const energySphere =
        new THREE.Mesh(
            sphereGeometry,
            sphereMaterial
        );


    reactor.add(
        energySphere
    );

}


/* =========================================================
   WIREFRAME
========================================================= */

function createWireframe() {

    const geometry =
        new THREE.IcosahedronGeometry(
            1.58,
            3
        );


    const material =
        new THREE.MeshBasicMaterial({

            color:
                CONFIG.gold,

            wireframe:
                true,

            transparent:
                true,

            opacity:
                0.38,

            blending:
                THREE.AdditiveBlending

        });


    const mesh =
        new THREE.Mesh(
            geometry,
            material
        );


    reactor.add(
        mesh
    );

}


/* =========================================================
   NODOS
========================================================= */

function createNodes() {

    const geometry =
        new THREE.IcosahedronGeometry(
            1.88,
            4
        );


    const positions =
        geometry.attributes.position.array;


    const count =
        Math.min(
            CONFIG.nodeCount,
            positions.length / 3
        );


    const nodePositions =
        new Float32Array(
            count * 3
        );


    for (
        let i = 0;
        i < count;
        i++
    ) {

        nodePositions[i * 3] =
            positions[i * 3];

        nodePositions[i * 3 + 1] =
            positions[i * 3 + 1];

        nodePositions[i * 3 + 2] =
            positions[i * 3 + 2];

    }


    const nodeGeometry =
        new THREE.BufferGeometry();


    nodeGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            nodePositions,
            3
        )
    );


    const nodeMaterial =
        new THREE.PointsMaterial({

            color:
                0xffc12a,

            size:
                0.028,

            transparent:
                true,

            opacity:
                0.85,

            blending:
                THREE.AdditiveBlending,

            depthWrite:
                false

        });


    nodeField =
        new THREE.Points(
            nodeGeometry,
            nodeMaterial
        );


    reactor.add(
        nodeField
    );

}


/* =========================================================
   CONNECTIONS ENTRE NODOS
========================================================= */

function createConnections() {

    connectionGroup =
        new THREE.Group();


    const material =
        new THREE.LineBasicMaterial({

            color:
                CONFIG.gold,

            transparent:
                true,

            opacity:
                0.18,

            blending:
                THREE.AdditiveBlending

        });


    const nodeGeometry =
        new THREE.IcosahedronGeometry(
            1.88,
            2
        );


    const position =
        nodeGeometry.attributes.position;


    const total =
        position.count;


    for (
        let i = 0;
        i < 150;
        i++
    ) {

        const a =
            Math.floor(
                Math.random() * total
            );

        const b =
            Math.floor(
                Math.random() * total
            );


        const p1 =
            new THREE.Vector3().fromBufferAttribute(
                position,
                a
            );


        const p2 =
            new THREE.Vector3().fromBufferAttribute(
                position,
                b
            );


        const geometry =
            new THREE.BufferGeometry();


        geometry.setFromPoints([
            p1,
            p2
        ]);


        const line =
            new THREE.Line(
                geometry,
                material
            );


        connectionGroup.add(
            line
        );

    }


    reactor.add(
        connectionGroup
    );

}


/* =========================================================
   RINGS
========================================================= */

function createRings() {

    innerRing =
        createSegmentedRing(
            1.95,
            2.02,
            96,
            0.27
        );


    middleRing =
        createSegmentedRing(
            2.28,
            2.31,
            128,
            0.22
        );


    outerRing =
        createSegmentedRing(
            2.62,
            2.66,
            160,
            0.16
        );


    innerRing.rotation.x =
        Math.PI * 0.5;


    middleRing.rotation.y =
        Math.PI * 0.32;


    outerRing.rotation.z =
        Math.PI * 0.24;


    reactor.add(
        innerRing,
        middleRing,
        outerRing
    );


    /* -----------------------------------------------------
       TORUS ORBITAL
    ----------------------------------------------------- */

    const torusConfigurations = [

        {
            radius: 2.05,
            tube: 0.018,
            rotation: [0.2, 0.0, 0.0],
            opacity: 0.55
        },

        {
            radius: 2.42,
            tube: 0.015,
            rotation: [0.0, 0.75, 0.6],
            opacity: 0.4
        },

        {
            radius: 2.8,
            tube: 0.012,
            rotation: [0.9, 0.2, 0.8],
            opacity: 0.3
        }

    ];


    torusConfigurations.forEach(
        config => {

            const geometry =
                new THREE.TorusGeometry(
                    config.radius,
                    config.tube,
                    8,
                    160
                );


            const material =
                new THREE.MeshBasicMaterial({

                    color:
                        CONFIG.gold,

                    transparent:
                        true,

                    opacity:
                        config.opacity,

                    blending:
                        THREE.AdditiveBlending

                });


            const torus =
                new THREE.Mesh(
                    geometry,
                    material
                );


            torus.rotation.set(
                ...config.rotation
            );


            reactor.add(
                torus
            );

        }
    );

}


/* =========================================================
   DISCOS SEGMENTADOS
========================================================= */

function createSegmentedRing(
    innerRadius,
    outerRadius,
    segments,
    opacity
) {

    const group =
        new THREE.Group();


    const segmentSize =
        Math.max(
            1,
            Math.floor(
                segments / 18
            )
        );


    for (
        let i = 0;
        i < segments;
        i += segmentSize * 2
    ) {

        const geometry =
            new THREE.RingGeometry(
                innerRadius,
                outerRadius,
                segmentSize,
                1,
                (i / segments) * Math.PI * 2,
                (segmentSize / segments) * Math.PI * 2
            );


        const material =
            new THREE.MeshBasicMaterial({

                color:
                    CONFIG.gold,

                transparent:
                    true,

                opacity:
                    opacity,

                side:
                    THREE.DoubleSide,

                blending:
                    THREE.AdditiveBlending,

                depthWrite:
                    false

            });


        const segment =
            new THREE.Mesh(
                geometry,
                material
            );


        group.add(
            segment
        );

    }


    return group;

}


/* =========================================================
   CIRCUIT TRACES
========================================================= */

function createCircuitTraces() {

    circuitGroup =
        new THREE.Group();


    const material =
        new THREE.LineBasicMaterial({

            color:
                CONFIG.goldBright,

            transparent:
                true,

            opacity:
                0.36,

            blending:
                THREE.AdditiveBlending

        });


    const traceCount =
        36;


    for (
        let i = 0;
        i < traceCount;
        i++
    ) {

        const angle =
            (i / traceCount) *
            Math.PI *
            2;


        const inner =
            1.55;


        const outer =
            2.9;


        const x1 =
            Math.cos(angle) *
            inner;


        const z1 =
            Math.sin(angle) *
            inner;


        const x2 =
            Math.cos(angle) *
            outer;


        const z2 =
            Math.sin(angle) *
            outer;


        const bend =
            0.08 +
            Math.random() *
            0.24;


        const midAngle =
            angle +
            (Math.random() - 0.5) *
            0.06;


        const xMid =
            Math.cos(midAngle) *
            (inner + bend);


        const zMid =
            Math.sin(midAngle) *
            (inner + bend);


        const points = [

            new THREE.Vector3(
                x1,
                0,
                z1
            ),

            new THREE.Vector3(
                xMid,
                (Math.random() - 0.5) * 0.15,
                zMid
            ),

            new THREE.Vector3(
                x2,
                0,
                z2
            )

        ];


        const geometry =
            new THREE.BufferGeometry()
                .setFromPoints(
                    points
                );


        const line =
            new THREE.Line(
                geometry,
                material
            );


        circuitGroup.add(
            line
        );


        /* NODE AT END */

        const nodeGeometry =
            new THREE.SphereGeometry(
                0.035,
                8,
                8
            );


        const nodeMaterial =
            new THREE.MeshBasicMaterial({

                color:
                    CONFIG.goldBright,

                transparent:
                    true,

                opacity:
                    0.7,

                blending:
                    THREE.AdditiveBlending

            });


        const endpoint =
            new THREE.Mesh(
                nodeGeometry,
                nodeMaterial
            );


        endpoint.position.set(
            x2,
            0,
            z2
        );


        circuitGroup.add(
            endpoint
        );

    }


    reactor.add(
        circuitGroup
    );

}


/* =========================================================
   ORBITAL PARTICLES
========================================================= */

function createOrbitals() {

    const geometry =
        new THREE.BufferGeometry();


    const positions =
        new Float32Array(
            CONFIG.particleCount * 3
        );


    for (
        let i = 0;
        i < CONFIG.particleCount;
        i++
    ) {

        const radius =
            2.3 +
            Math.random() * 1.35;


        const theta =
            Math.random() *
            Math.PI *
            2;


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
            Math.cos(phi);


        positions[i * 3 + 2] =
            radius *
            Math.sin(phi) *
            Math.sin(theta);

    }


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
                0xffb300,

            size:
                0.013,

            transparent:
                true,

            opacity:
                0.52,

            blending:
                THREE.AdditiveBlending,

            depthWrite:
                false

        });


    orbitalField =
        new THREE.Points(
            geometry,
            material
        );


    reactor.add(
        orbitalField
    );

}


/* =========================================================
   POINTER
========================================================= */

function onPointerMove(event) {

    pointer.x =
        (event.clientX /
            window.innerWidth) *
            2 -
        1;


    pointer.y =
        -(
            event.clientY /
            window.innerHeight
        ) *
        2 +
        1;


    targetRotation.x =
        pointer.y *
        0.08;


    targetRotation.y =
        pointer.x *
        0.1;

}


/* =========================================================
   RESIZE
========================================================= */

function onResize() {

    if (!container) return;


    const width =
        Math.max(
            1,
            container.clientWidth
        );


    const height =
        Math.max(
            1,
            container.clientHeight
        );


    camera.aspect =
        width / height;


    camera.updateProjectionMatrix();


    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio || 1,
            2
        )
    );


    renderer.setSize(
        width,
        height,
        false
    );


    composer.setSize(
        width,
        height
    );

}


/* =========================================================
   ASPECT
========================================================= */

function getAspect() {

    if (!container) {

        return 1;

    }


    return (
        Math.max(
            1,
            container.clientWidth
        ) /
        Math.max(
            1,
            container.clientHeight
        )
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
        clock3D.getElapsedTime();


    if (reactor) {

        /* Rotación general suave */

        reactor.rotation.y +=
            0.0018;


        reactor.rotation.x +=
            0.00045;


        /* Parallax */

        reactor.rotation.x +=
            (
                targetRotation.x -
                reactor.rotation.x
            ) *
            0.008;


        /* Núcleo */

        if (corePoints) {

            corePoints.rotation.y =
                elapsed * 0.055;

            corePoints.rotation.z =
                elapsed * 0.018;

        }


        /* Nodos */

        if (nodeField) {

            nodeField.rotation.y =
                -elapsed * 0.035;

            nodeField.rotation.x =
                elapsed * 0.014;

        }


        /* Conexiones */

        if (connectionGroup) {

            connectionGroup.rotation.y =
                elapsed * 0.025;

        }


        /* Circuitos */

        if (circuitGroup) {

            circuitGroup.rotation.z =
                elapsed * 0.018;

        }


        /* Partículas */

        if (orbitalField) {

            orbitalField.rotation.y =
                elapsed * 0.012;

            orbitalField.rotation.x =
                Math.sin(
                    elapsed * 0.18
                ) * 0.035;

        }

    }


    /* -----------------------------------------------------
       ANILLOS
    ----------------------------------------------------- */

    if (innerRing) {

        innerRing.rotation.z =
            elapsed * 0.075;

        innerRing.rotation.x =
            Math.PI * 0.5 +
            Math.sin(
                elapsed * 0.25
            ) * 0.06;

    }


    if (middleRing) {

        middleRing.rotation.x =
            elapsed * 0.052;

        middleRing.rotation.z =
            Math.PI * 0.32 -
            elapsed * 0.035;

    }


    if (outerRing) {

        outerRing.rotation.y =
            elapsed * 0.042;

        outerRing.rotation.z =
            Math.PI * 0.24 +
            elapsed * 0.025;

    }


    /* -----------------------------------------------------
       RENDER
    ----------------------------------------------------- */

    composer.render();

}
