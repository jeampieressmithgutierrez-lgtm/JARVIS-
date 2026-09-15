/* ============================================================
   J.A.R.V.I.S.
   STARK COGNITIVE CORE
   THREE.JS / WEBGL / EFFECT COMPOSER
============================================================ */

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


/* ============================================================
   CONFIGURATION
============================================================ */

const CONFIG = {

    gold: 0xffaa00,
    goldBright: 0xffc43d,
    goldLight: 0xffe7a3,

    particleCount: 2600,
    nodeCount: 720,

    innerRadius: 1.65,

    rotation: {
        inner: 0.0009,
        ringA: 0.0018,
        ringB: -0.0011,
        ringC: 0.0024,
        circuitA: -0.0017,
        circuitB: 0.0021
    }

};


/* ============================================================
   DOM
============================================================ */

const stage =
    document.getElementById("jarvis-core-stage");

if (!stage) {

    console.error(
        "[JARVIS CORE] No se encontró #jarvis-core-stage."
    );

    throw new Error(
        "JARVIS Core Stage missing."
    );
}


/* ============================================================
   SCENE
============================================================ */

const scene =
    new THREE.Scene();


/* ============================================================
   CAMERA
============================================================ */

const camera =
    new THREE.PerspectiveCamera(
        42,
        1,
        0.1,
        100
    );

camera.position.set(
    0,
    0,
    7.8
);


/* ============================================================
   RENDERER
============================================================ */

const renderer =
    new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
    });


renderer.setPixelRatio(
    Math.min(
        window.devicePixelRatio,
        2
    )
);


renderer.setSize(
    stage.clientWidth || 600,
    stage.clientHeight || 600,
    false
);


renderer.outputColorSpace =
    THREE.SRGBColorSpace;


renderer.toneMapping =
    THREE.ACESFilmicToneMapping;


renderer.toneMappingExposure =
    1.05;


renderer.setClearColor(
    0x000000,
    0
);


stage.appendChild(
    renderer.domElement
);


/* ============================================================
   BLOOM
============================================================ */

const renderPass =
    new RenderPass(
        scene,
        camera
    );


const bloomPass =
    new UnrealBloomPass(

        new THREE.Vector2(
            stage.clientWidth || 600,
            stage.clientHeight || 600
        ),

        1.2,   // strength
        0.3,   // radius
        0.25   // threshold

    );


const composer =
    new EffectComposer(
        renderer
    );


composer.addPass(
    renderPass
);


composer.addPass(
    bloomPass
);


/* ============================================================
   LIGHTING
============================================================ */

const ambientLight =
    new THREE.AmbientLight(
        CONFIG.gold,
        0.22
    );

scene.add(
    ambientLight
);


const pointLight =
    new THREE.PointLight(
        CONFIG.goldBright,
        3.2,
        10
    );

pointLight.position.set(
    0,
    0,
    1.5
);

scene.add(
    pointLight
);


/* ============================================================
   MAIN CORE GROUP
============================================================ */

const coreGroup =
    new THREE.Group();

scene.add(
    coreGroup
);


/* ============================================================
   MATERIALS
============================================================ */

const goldBasicMaterial =
    new THREE.MeshBasicMaterial({
        color: CONFIG.gold,
        transparent: true,
        opacity: 0.48,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide
    });


const goldWireMaterial =
    new THREE.MeshBasicMaterial({
        color: CONFIG.goldBright,
        wireframe: true,
        transparent: true,
        opacity: 0.34,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });


const darkWireMaterial =
    new THREE.MeshBasicMaterial({
        color: CONFIG.gold,
        wireframe: true,
        transparent: true,
        opacity: 0.17,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });


/* ============================================================
   INNER HIGH-DENSITY POINT NETWORK
============================================================ */

const innerGeometry =
    new THREE.IcosahedronGeometry(
        CONFIG.innerRadius,
        5
    );


const innerPositions =
    innerGeometry.attributes.position.array;


const innerParticleGeometry =
    new THREE.BufferGeometry();


const innerParticlePositions =
    new Float32Array(
        innerPositions.length
    );


for (
    let i = 0;
    i < innerPositions.length;
    i += 3
) {

    const x =
        innerPositions[i];

    const y =
        innerPositions[i + 1];

    const z =
        innerPositions[i + 2];


    const randomScale =
        0.94 +
        Math.random() * 0.12;


    innerParticlePositions[i] =
        x * randomScale;

    innerParticlePositions[i + 1] =
        y * randomScale;

    innerParticlePositions[i + 2] =
        z * randomScale;
}


innerParticleGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(
        innerParticlePositions,
        3
    )
);


const innerParticleMaterial =
    new THREE.PointsMaterial({

        color:
            CONFIG.goldLight,

        size:
            0.018,

        transparent:
            true,

        opacity:
            0.9,

        blending:
            THREE.AdditiveBlending,

        depthWrite:
            false
    });


const innerPoints =
    new THREE.Points(
        innerParticleGeometry,
        innerParticleMaterial
    );


coreGroup.add(
    innerPoints
);


/* ============================================================
   INNER WIREFRAME SPHERE
============================================================ */

const innerShell =
    new THREE.Mesh(
        new THREE.IcosahedronGeometry(
            CONFIG.innerRadius * 0.96,
            3
        ),
        darkWireMaterial
    );


coreGroup.add(
    innerShell
);


/* ============================================================
   SECOND NODE NETWORK
============================================================ */

const nodeGeometry =
    new THREE.IcosahedronGeometry(
        2.0,
        4
    );


const nodeSource =
    nodeGeometry.attributes.position;


const nodePositions =
    new Float32Array(
        CONFIG.nodeCount * 3
    );


for (
    let i = 0;
    i < CONFIG.nodeCount;
    i++
) {

    const index =
        Math.floor(
            Math.random() *
            (nodeSource.count - 1)
        );


    const x =
        nodeSource.getX(index);

    const y =
        nodeSource.getY(index);

    const z =
        nodeSource.getZ(index);


    const scale =
        0.85 +
        Math.random() * 0.4;


    nodePositions[i * 3] =
        x * scale;

    nodePositions[i * 3 + 1] =
        y * scale;

    nodePositions[i * 3 + 2] =
        z * scale;
}


const nodeBuffer =
    new THREE.BufferGeometry();


nodeBuffer.setAttribute(
    "position",
    new THREE.BufferAttribute(
        nodePositions,
        3
    )
);


const nodeMaterial =
    new THREE.PointsMaterial({

        color:
            CONFIG.goldBright,

        size:
            0.024,

        transparent:
            true,

        opacity:
            0.75,

        blending:
            THREE.AdditiveBlending,

        depthWrite:
            false
    });


const nodePoints =
    new THREE.Points(
        nodeBuffer,
        nodeMaterial
    );


coreGroup.add(
    nodePoints
);


/* ============================================================
   NODE CONNECTION LINES
============================================================ */

const connectionPositions =
    [];


const maxConnections =
    150;


for (
    let i = 0;
    i < maxConnections;
    i++
) {

    const a =
        Math.floor(
            Math.random() *
            CONFIG.nodeCount
        );


    const b =
        Math.floor(
            Math.random() *
            CONFIG.nodeCount
        );


    const ax =
        nodePositions[a * 3];

    const ay =
        nodePositions[a * 3 + 1];

    const az =
        nodePositions[a * 3 + 2];


    const bx =
        nodePositions[b * 3];

    const by =
        nodePositions[b * 3 + 1];

    const bz =
        nodePositions[b * 3 + 2];


    connectionPositions.push(
        ax, ay, az,
        bx, by, bz
    );
}


const connectionGeometry =
    new THREE.BufferGeometry();


connectionGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(
        connectionPositions,
        3
    )
);


const connectionMaterial =
    new THREE.LineBasicMaterial({

        color:
            CONFIG.gold,

        transparent:
            true,

        opacity:
            0.18,

        blending:
            THREE.AdditiveBlending,

        depthWrite:
            false
    });


const connectionLines =
    new THREE.LineSegments(
        connectionGeometry,
        connectionMaterial
    );


coreGroup.add(
    connectionLines
);


/* ============================================================
   TECHNOLOGICAL DATA TEXTURE
   NO CANVAS 2D
============================================================ */

function createTechTexture() {

    const width = 256;
    const height = 8;

    const data =
        new Uint8Array(
            width * height * 4
        );


    for (
        let y = 0;
        y < height;
        y++
    ) {

        for (
            let x = 0;
            x < width;
            x++
        ) {

            const index =
                (y * width + x) * 4;


            let alpha = 0;


            /*
             * Segmentos principales
             */

            if (
                x % 32 === 0 ||
                x % 32 === 1
            ) {

                alpha = 230;

            }


            /*
             * Micro segmentos
             */

            else if (
                x % 8 === 0 &&
                y < 4
            ) {

                alpha = 145;

            }


            /*
             * Fragmentos intermitentes
             */

            else if (
                (
                    x * 7 +
                    y * 13
                ) % 37 === 0
            ) {

                alpha = 210;

            }


            data[index] =
                255;

            data[index + 1] =
                170;

            data[index + 2] =
                0;

            data[index + 3] =
                alpha;
        }
    }


    const texture =
        new THREE.DataTexture(
            data,
            width,
            height,
            THREE.RGBAFormat
        );


    texture.needsUpdate =
        true;


    texture.wrapS =
        THREE.RepeatWrapping;


    texture.wrapT =
        THREE.ClampToEdgeWrapping;


    texture.colorSpace =
        THREE.SRGBColorSpace;


    return texture;
}


const techTexture =
    createTechTexture();


/* ============================================================
   FLAT CYBER DISCS
============================================================ */

const discGroup =
    new THREE.Group();


coreGroup.add(
    discGroup
);


function createCyberDisc(
    radius,
    segments,
    opacity,
    rotationSpeed
) {

    const geometry =
        new THREE.RingGeometry(
            radius * 0.70,
            radius,
            segments
        );


    const material =
        new THREE.MeshBasicMaterial({

            color:
                CONFIG.gold,

            map:
                techTexture,

            alphaMap:
                techTexture,

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


    const mesh =
        new THREE.Mesh(
            geometry,
            material
        );


    mesh.rotation.x =
        Math.PI / 2;


    mesh.userData.rotationSpeed =
        rotationSpeed;


    discGroup.add(
        mesh
    );


    return mesh;
}


const discA =
    createCyberDisc(
        2.15,
        96,
        0.42,
        0.0015
    );


const discB =
    createCyberDisc(
        2.42,
        128,
        0.28,
        -0.002
    );


const discC =
    createCyberDisc(
        2.75,
        160,
        0.20,
        0.001
    );


/* ============================================================
   SEGMENTED DASHBOARD RINGS
============================================================ */

const dashboardGroup =
    new THREE.Group();


coreGroup.add(
    dashboardGroup
);


function createDashboardRing(
    radius,
    tube,
    radialSegments,
    tubularSegments,
    rotation
) {

    const geometry =
        new THREE.TorusGeometry(
            radius,
            tube,
            radialSegments,
            tubularSegments
        );


    const material =
        new THREE.MeshBasicMaterial({

            color:
                CONFIG.goldBright,

            wireframe:
                true,

            transparent:
                true,

            opacity:
                0.28,

            blending:
                THREE.AdditiveBlending,

            depthWrite:
                false
        });


    const mesh =
        new THREE.Mesh(
            geometry,
            material
        );


    mesh.rotation.set(
        rotation.x,
        rotation.y,
        rotation.z
    );


    dashboardGroup.add(
        mesh
    );


    return mesh;
}


const ringX =
    createDashboardRing(
        2.3,
        0.012,
        6,
        96,
        {
            x: Math.PI / 2,
            y: 0,
            z: 0
        }
    );


const ringY =
    createDashboardRing(
        2.55,
        0.009,
        5,
        128,
        {
            x: 0,
            y: Math.PI / 2,
            z: 0.4
        }
    );


const ringZ =
    createDashboardRing(
        2.82,
        0.008,
        5,
        144,
        {
            x: 0.5,
            y: 0.2,
            z: 0
        }
    );


/* ============================================================
   RADIAL CIRCUIT TRACES
============================================================ */

const circuitGroup =
    new THREE.Group();


coreGroup.add(
    circuitGroup
);


function createRadialCircuit(
    index,
    total
) {

    const points =
        [];


    const baseAngle =
        (
            index /
            total
        ) *
        Math.PI *
        2;


    const radiusStart =
        1.75;


    const radiusEnd =
        3.05;


    const segments =
        7;


    for (
        let i = 0;
        i <= segments;
        i++
    ) {

        const progress =
            i /
            segments;


        const radius =
            THREE.MathUtils.lerp(
                radiusStart,
                radiusEnd,
                progress
            );


        let angle =
            baseAngle;


        /*
         * Pequeñas desviaciones
         * para que parezca un circuito
         * y no un simple rayo.
         */

        if (
            i > 1 &&
            i < segments
        ) {

            angle +=
                (
                    Math.random() -
                    0.5
                ) *
                0.025;
        }


        points.push(
            new THREE.Vector3(
                Math.cos(angle) * radius,
                Math.sin(angle) * radius,
                (
                    Math.random() -
                    0.5
                ) * 0.18
            )
        );
    }


    const geometry =
        new THREE.BufferGeometry()
            .setFromPoints(
                points
            );


    const material =
        new THREE.LineBasicMaterial({

            color:
                index % 3 === 0
                    ? CONFIG.goldBright
                    : CONFIG.gold,

            transparent:
                true,

            opacity:
                0.28 +
                Math.random() * 0.2,

            blending:
                THREE.AdditiveBlending,

            depthWrite:
                false
        });


    const line =
        new THREE.Line(
            geometry,
            material
        );


    circuitGroup.add(
        line
    );
}


for (
    let i = 0;
    i < 36;
    i++
) {

    createRadialCircuit(
        i,
        36
    );
}


/* ============================================================
   ORBITING DATA PARTICLES
============================================================ */

const orbitGroup =
    new THREE.Group();


coreGroup.add(
    orbitGroup
);


function createOrbitParticles(
    radius,
    count,
    opacity
) {

    const geometry =
        new THREE.BufferGeometry();


    const positions =
        new Float32Array(
            count * 3
        );


    for (
        let i = 0;
        i < count;
        i++
    ) {

        const angle =
            Math.random() *
            Math.PI *
            2;


        const radiusOffset =
            (
                Math.random() -
                0.5
            ) *
            0.10;


        const r =
            radius +
            radiusOffset;


        positions[i * 3] =
            Math.cos(angle) * r;

        positions[i * 3 + 1] =
            Math.sin(angle) * r;

        positions[i * 3 + 2] =
            (
                Math.random() -
                0.5
            ) *
            0.25;
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
                CONFIG.goldLight,

            size:
                0.025,

            transparent:
                true,

            opacity:
                opacity,

            blending:
                THREE.AdditiveBlending,

            depthWrite:
                false
        });


    const points =
        new THREE.Points(
            geometry,
            material
        );


    orbitGroup.add(
        points
    );


    return points;
}


const orbitA =
    createOrbitParticles(
        2.5,
        420,
        0.8
    );


const orbitB =
    createOrbitParticles(
        2.9,
        320,
        0.6
    );


/* ============================================================
   CENTRAL ENERGY CORE
============================================================ */

const coreSphere =
    new THREE.Mesh(

        new THREE.SphereGeometry(
            0.42,
            32,
            32
        ),

        new THREE.MeshBasicMaterial({

            color:
                CONFIG.goldLight,

            transparent:
                true,

            opacity:
                0.75,

            blending:
                THREE.AdditiveBlending,

            depthWrite:
                false
        })
    );


coreGroup.add(
    coreSphere
);


/* ============================================================
   CORE INNER RING
============================================================ */

const innerRing =
    new THREE.Mesh(

        new THREE.RingGeometry(
            0.48,
            0.52,
            96
        ),

        new THREE.MeshBasicMaterial({

            color:
                CONFIG.goldBright,

            transparent:
                true,

            opacity:
                0.65,

            side:
                THREE.DoubleSide,

            blending:
                THREE.AdditiveBlending,

            depthWrite:
                false
        })
    );


innerRing.rotation.x =
    Math.PI / 2;


coreGroup.add(
    innerRing
);


/* ============================================================
   OUTER ORBITAL RINGS
============================================================ */

const orbitalGroup =
    new THREE.Group();


coreGroup.add(
    orbitalGroup
);


function createOrbitalRing(
    radius,
    rotation,
    opacity
) {

    const geometry =
        new THREE.TorusGeometry(
            radius,
            0.012,
            5,
            160
        );


    const material =
        new THREE.MeshBasicMaterial({

            color:
                CONFIG.goldBright,

            transparent:
                true,

            opacity:
                opacity,

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
        rotation.x,
        rotation.y,
        rotation.z
    );


    orbitalGroup.add(
        ring
    );


    return ring;
}


const orbitRingX =
    createOrbitalRing(
        3.15,
        {
            x: 0,
            y: Math.PI / 2,
            z: 0
        },
        0.5
    );


const orbitRingY =
    createOrbitalRing(
        3.28,
        {
            x: Math.PI / 2,
            y: 0,
            z: 0.4
        },
        0.38
    );


const orbitRingZ =
    createOrbitalRing(
        3.42,
        {
            x: 0.6,
            y: 0.4,
            z: 0
        },
        0.28
    );


/* ============================================================
   RANDOM MICRO NODES
============================================================ */

const microNodeGroup =
    new THREE.Group();


coreGroup.add(
    microNodeGroup
);


for (
    let i = 0;
    i < 90;
    i++
) {

    const angle =
        Math.random() *
        Math.PI *
        2;


    const radius =
        1.7 +
        Math.random() *
        1.5;


    const node =
        new THREE.Mesh(

            new THREE.SphereGeometry(
                0.018 +
                Math.random() * 0.018,
                8,
                8
            ),

            new THREE.MeshBasicMaterial({

                color:
                    i % 5 === 0
                        ? CONFIG.goldLight
                        : CONFIG.gold,

                transparent:
                    true,

                opacity:
                    0.55 +
                    Math.random() * 0.4,

                blending:
                    THREE.AdditiveBlending,

                depthWrite:
                    false
            })
        );


    node.position.set(

        Math.cos(angle) * radius,

        Math.sin(angle) * radius,

        (
            Math.random() -
            0.5
        ) *
        0.5
    );


    microNodeGroup.add(
        node
    );
}


/* ============================================================
   POINTER INTERACTION
============================================================ */

const pointer =
    new THREE.Vector2(
        0,
        0
    );


window.addEventListener(
    "pointermove",
    (event) => {

        pointer.x =
            (
                event.clientX /
                window.innerWidth
            ) *
            2 -
            1;


        pointer.y =
            -(
                event.clientY /
                window.innerHeight
            ) *
            2 +
            1;

    },
    {
        passive: true
    }
);


/* ============================================================
   RESIZE
============================================================ */

function resize() {

    const width =
        stage.clientWidth ||
        600;


    const height =
        stage.clientHeight ||
        600;


    camera.aspect =
        width /
        height;


    camera.updateProjectionMatrix();


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


window.addEventListener(
    "resize",
    resize
);


resize();


/* ============================================================
   CLOCK
============================================================ */

function updateClock() {

    const clockElement =
        document.getElementById(
            "clock"
        );


    if (!clockElement) {
        return;
    }


    const now =
        new Date();


    const hours =
        String(
            now.getHours()
        ).padStart(
            2,
            "0"
        );


    const minutes =
        String(
            now.getMinutes()
        ).padStart(
            2,
            "0"
        );


    const seconds =
        String(
            now.getSeconds()
        ).padStart(
            2,
            "0"
        );


    clockElement.textContent =
        `${hours}:${minutes}:${seconds}`;
}


updateClock();


setInterval(
    updateClock,
    1000
);


/* ============================================================
   TOOLS TOGGLE
============================================================ */

const toolsToggle =
    document.getElementById(
        "toolsToggle"
    );


const toolsSection =
    document.querySelector(
        ".tools-section"
    );


if (
    toolsToggle &&
    toolsSection
) {

    toolsToggle.addEventListener(
        "click",
        () => {

            toolsSection.classList.toggle(
                "open"
            );

        }
    );
}


/* ============================================================
   ANIMATION
============================================================ */

const clock =
    new THREE.Clock();


function animate() {

    requestAnimationFrame(
        animate
    );


    const elapsed =
        clock.getElapsedTime();


    /* --------------------------------
       Core
    -------------------------------- */

    innerPoints.rotation.y +=
        CONFIG.rotation.inner;


    innerPoints.rotation.x +=
        CONFIG.rotation.inner * 0.35;


    innerShell.rotation.y -=
        CONFIG.rotation.inner * 0.6;


    nodePoints.rotation.y +=
        0.0007;


    nodePoints.rotation.z -=
        0.0004;


    connectionLines.rotation.y +=
        0.0007;


    connectionLines.rotation.x +=
        0.00025;


    /* --------------------------------
       Dashboard discs
    -------------------------------- */

    discA.rotation.z +=
        CONFIG.rotation.ringA;


    discB.rotation.z +=
        CONFIG.rotation.ringB;


    discC.rotation.z +=
        CONFIG.rotation.ringC;


    /* --------------------------------
       Dashboard rings
    -------------------------------- */

    ringX.rotation.z +=
        0.0009;


    ringY.rotation.x -=
        0.00065;


    ringZ.rotation.y +=
        0.00075;


    /* --------------------------------
       Circuit traces
    -------------------------------- */

    circuitGroup.rotation.z +=
        CONFIG.rotation.circuitA;


    circuitGroup.rotation.x +=
        0.00025;


    /* --------------------------------
       Orbital particles
    -------------------------------- */

    orbitA.rotation.z +=
        0.0012;


    orbitB.rotation.z -=
        0.0008;


    orbitB.rotation.x +=
        0.00035;


    /* --------------------------------
       Outer rings
    -------------------------------- */

    orbitRingX.rotation.z +=
        0.0008;


    orbitRingY.rotation.y -=
        0.00065;


    orbitRingZ.rotation.x +=
        0.0005;


    /* --------------------------------
       Micro nodes
    -------------------------------- */

    microNodeGroup.rotation.y +=
        0.0006;


    microNodeGroup.rotation.z -=
        0.00025;


    /* --------------------------------
       Central energy pulse
    -------------------------------- */

    const pulse =
        1 +
        Math.sin(
            elapsed * 2.5
        ) *
        0.055;


    coreSphere.scale.setScalar(
        pulse
    );


    innerRing.rotation.z +=
        0.0025;


    /* --------------------------------
       Pointer parallax
    -------------------------------- */

    const targetRotationY =
        pointer.x *
        0.10;


    const targetRotationX =
        pointer.y *
        0.06;


    coreGroup.rotation.y +=
        (
            targetRotationY -
            coreGroup.rotation.y
        ) *
        0.025;


    coreGroup.rotation.x +=
        (
            targetRotationX -
            coreGroup.rotation.x
        ) *
        0.025;


    /* --------------------------------
       Subtle vertical breathing
    -------------------------------- */

    coreGroup.position.y =
        Math.sin(
            elapsed * 0.7
        ) *
        0.025;


    /* --------------------------------
       Render
    -------------------------------- */

    composer.render();

}


animate();


/* ============================================================
   FINAL STATUS
============================================================ */

console.log(
    "%cJ.A.R.V.I.S. COGNITIVE CORE ONLINE",
    "color:#ffaa00;font-weight:bold;font-size:14px;"
);

console.log(
    "%cThree.js + WebGL + UnrealBloomPass",
    "color:#ffda7a;"
);

console.log(
    "%cComplex geometric network initialized.",
    "color:#d7dbe0;"
);
