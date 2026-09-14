/* =========================================================
   J.A.R.V.I.S. — COGNITIVE CORE 3D
   STARK COGNITIVE INTERFACE
   ---------------------------------------------------------
   - Three.js
   - WebGL / GLSL
   - Sin anillos orbitales
   - Núcleo orgánico / energético
   - Ondas internas
   - Zonas oscuras y doradas
   - Transparente
   - Detrás del chat
========================================================= */

"use strict";

(() => {

    /* =====================================================
       COMPROBACIONES
    ===================================================== */

    if (typeof THREE === "undefined") {
        console.error("[JARVIS 3D] Three.js no está cargado.");
        return;
    }

    const canvas = document.getElementById("jarvis-3d-canvas");

    if (!canvas) {
        console.error(
            '[JARVIS 3D] No se encontró el canvas "#jarvis-3d-canvas".'
        );
        return;
    }


    /* =====================================================
       CONFIGURACIÓN
    ===================================================== */

    const CONFIG = {
        colorGold: new THREE.Color(0xffb400),
        colorLight: new THREE.Color(0xffdf72),
        colorDark: new THREE.Color(0x090a0c),

        sphereSize: 1.35,

        rotationSpeed: 0.00035,

        mouseInfluence: 0.10,

        pixelRatio: Math.min(window.devicePixelRatio || 1, 2)
    };


    /* =====================================================
       ESCENA
    ===================================================== */

    const scene = new THREE.Scene();


    /* =====================================================
       CÁMARA
    ===================================================== */

    const camera = new THREE.PerspectiveCamera(
        38,
        1,
        0.1,
        100
    );

    camera.position.set(0, 0, 5.2);


    /* =====================================================
       RENDERER
    ===================================================== */

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
    });

    renderer.setPixelRatio(CONFIG.pixelRatio);
    renderer.setClearColor(0x000000, 0);

    if ("outputColorSpace" in renderer && THREE.SRGBColorSpace) {
        renderer.outputColorSpace = THREE.SRGBColorSpace;
    }


    /* =====================================================
       GRUPO PRINCIPAL
    ===================================================== */

    const coreGroup = new THREE.Group();

    scene.add(coreGroup);


    /* =====================================================
       SHADER DEL NÚCLEO
       
       La forma NO utiliza anillos.
       La superficie se deforma mediante ondas.
    ===================================================== */

    const vertexShader = `
        uniform float uTime;
        uniform float uAmplitude;

        varying vec3 vNormal;
        varying vec3 vPosition;
        varying float vWave;

        void main() {

            vec3 p = position;

            float wave1 =
                sin(p.x * 3.7 + uTime * 1.7);

            float wave2 =
                sin(p.y * 4.2 - uTime * 1.25);

            float wave3 =
                sin(p.z * 5.0 + uTime * 1.45);

            float wave4 =
                sin((p.x + p.y + p.z) * 4.0 - uTime * 1.1);

            float combined =
                (wave1 + wave2 + wave3 + wave4) * 0.25;

            float radial =
                sin(length(p) * 7.0 - uTime * 1.8);

            float displacement =
                combined * 0.075 +
                radial * 0.035;

            vec3 normalDirection =
                normalize(position);

            p += normalDirection * displacement * uAmplitude;

            vWave = combined;

            vNormal = normalize(normalMatrix * normal);
            vPosition = p;

            gl_Position =
                projectionMatrix *
                modelViewMatrix *
                vec4(p, 1.0);
        }
    `;


    const fragmentShader = `
        uniform float uTime;
        uniform vec3 uGold;
        uniform vec3 uLight;
        uniform vec3 uDark;

        varying vec3 vNormal;
        varying vec3 vPosition;
        varying float vWave;

        void main() {

            /* ---------------------------------------------
               ILUMINACIÓN
            --------------------------------------------- */

            vec3 viewDirection =
                normalize(cameraPosition - vPosition);

            float fresnel =
                pow(
                    1.0 -
                    max(
                        dot(
                            normalize(vNormal),
                            viewDirection
                        ),
                        0.0
                    ),
                    2.7
                );


            /* ---------------------------------------------
               ONDAS INTERNAS
            --------------------------------------------- */

            float wave =
                sin(
                    vPosition.x * 5.0 +
                    vPosition.y * 3.0 +
                    uTime * 1.5
                );

            wave =
                wave * 0.5 + 0.5;


            /* ---------------------------------------------
               ZONAS OSCURAS
            --------------------------------------------- */

            float darkPattern =
                sin(
                    vPosition.z * 8.0 -
                    vPosition.x * 4.0 +
                    uTime * 0.7
                );

            darkPattern =
                darkPattern * 0.5 + 0.5;


            /* ---------------------------------------------
               COLOR BASE
            --------------------------------------------- */

            vec3 goldLayer =
                mix(
                    uDark,
                    uGold,
                    smoothstep(
                        0.20,
                        0.82,
                        wave
                    )
                );


            /* ---------------------------------------------
               LUZ INTERNA
            --------------------------------------------- */

            vec3 energy =
                mix(
                    goldLayer,
                    uLight,
                    fresnel * 0.85
                );


            /* ---------------------------------------------
               OSCURIDAD / PROFUNDIDAD
            --------------------------------------------- */

            energy *=
                mix(
                    0.52,
                    1.18,
                    darkPattern
                );


            /* ---------------------------------------------
               BRILLO EXTERIOR
            --------------------------------------------- */

            energy +=
                uLight *
                fresnel *
                0.32;


            /* ---------------------------------------------
               CENTRO MÁS INTENSO
            --------------------------------------------- */

            float centerGlow =
                1.0 -
                smoothstep(
                    0.15,
                    1.25,
                    length(vPosition)
                );

            energy +=
                uGold *
                centerGlow *
                0.18;


            /* ---------------------------------------------
               ALPHA
            --------------------------------------------- */

            float alpha =
                0.42 +
                fresnel * 0.40 +
                centerGlow * 0.10;


            gl_FragColor =
                vec4(
                    energy,
                    alpha
                );
        }
    `;


    /* =====================================================
       MATERIAL DEL NÚCLEO
    ===================================================== */

    const coreMaterial = new THREE.ShaderMaterial({

        uniforms: {

            uTime: {
                value: 0
            },

            uAmplitude: {
                value: 1.0
            },

            uGold: {
                value: CONFIG.colorGold
            },

            uLight: {
                value: CONFIG.colorLight
            },

            uDark: {
                value: CONFIG.colorDark
            }

        },

        vertexShader,
        fragmentShader,

        transparent: true,

        depthWrite: false,

        blending: THREE.AdditiveBlending,

        side: THREE.FrontSide
    });


    /* =====================================================
       GEOMETRÍA
       
       Alta resolución para que la deformación sea suave.
    ===================================================== */

    const coreGeometry =
        new THREE.SphereGeometry(
            CONFIG.sphereSize,
            96,
            96
        );


    const core =
        new THREE.Mesh(
            coreGeometry,
            coreMaterial
        );

    coreGroup.add(core);


    /* =====================================================
       NÚCLEO INTERNO
       
       Una pequeña esfera oscura/translúcida que da
       sensación de profundidad.
    ===================================================== */

    const innerMaterial =
        new THREE.MeshBasicMaterial({

            color: 0x08090b,

            transparent: true,

            opacity: 0.72,

            blending: THREE.NormalBlending,

            depthWrite: false
        });


    const innerGeometry =
        new THREE.SphereGeometry(
            0.62,
            64,
            64
        );


    const innerCore =
        new THREE.Mesh(
            innerGeometry,
            innerMaterial
        );


    coreGroup.add(innerCore);


    /* =====================================================
       HALO SUAVE
       
       No es un anillo.
       Es solamente una esfera translúcida para generar
       profundidad y aura alrededor del núcleo.
    ===================================================== */

    const haloMaterial =
        new THREE.MeshBasicMaterial({

            color: 0xffb400,

            transparent: true,

            opacity: 0.035,

            blending: THREE.AdditiveBlending,

            depthWrite: false
        });


    const haloGeometry =
        new THREE.SphereGeometry(
            1.65,
            48,
            48
        );


    const halo =
        new THREE.Mesh(
            haloGeometry,
            haloMaterial
        );


    coreGroup.add(halo);


    /* =====================================================
       PARTÍCULAS INTERNAS
       
       Pequeñas partículas flotando alrededor del núcleo,
       pero sin formar órbitas.
    ===================================================== */

    const particleCount = 180;

    const positions =
        new Float32Array(
            particleCount * 3
        );

    const particleSizes =
        new Float32Array(
            particleCount
        );


    for (let i = 0; i < particleCount; i++) {

        const radius =
            0.72 +
            Math.random() * 0.62;

        const theta =
            Math.random() *
            Math.PI *
            2;

        const phi =
            Math.acos(
                2 * Math.random() - 1
            );

        const x =
            radius *
            Math.sin(phi) *
            Math.cos(theta);

        const y =
            radius *
            Math.sin(phi) *
            Math.sin(theta);

        const z =
            radius *
            Math.cos(phi);

        positions[i * 3] =
            x;

        positions[i * 3 + 1] =
            y;

        positions[i * 3 + 2] =
            z;

        particleSizes[i] =
            0.8 +
            Math.random() * 1.5;
    }


    const particleGeometry =
        new THREE.BufferGeometry();

    particleGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            positions,
            3
        )
    );


    const particleMaterial =
        new THREE.PointsMaterial({

            color: 0xffc43d,

            size: 0.018,

            transparent: true,

            opacity: 0.48,

            blending: THREE.AdditiveBlending,

            depthWrite: false,

            sizeAttenuation: true
        });


    const particles =
        new THREE.Points(
            particleGeometry,
            particleMaterial
        );


    coreGroup.add(particles);


    /* =====================================================
       LUZ
    ===================================================== */

    const ambientLight =
        new THREE.AmbientLight(
            0xffc34a,
            0.25
        );

    scene.add(ambientLight);


    const pointLight =
        new THREE.PointLight(
            0xffb400,
            2.2,
            7
        );

    pointLight.position.set(
        0.8,
        1.2,
        2.4
    );

    scene.add(pointLight);


    /* =====================================================
       INTERACCIÓN DEL RATÓN
    ===================================================== */

    let targetX = 0;
    let targetY = 0;

    window.addEventListener(
        "pointermove",
        (event) => {

            targetX =
                (event.clientX /
                    window.innerWidth -
                    0.5) *
                CONFIG.mouseInfluence;

            targetY =
                (event.clientY /
                    window.innerHeight -
                    0.5) *
                CONFIG.mouseInfluence;
        },
        {
            passive: true
        }
    );


    /* =====================================================
       RESIZE
    ===================================================== */

    function resize() {

        const rect =
            canvas.getBoundingClientRect();

        const width =
            Math.max(
                rect.width,
                1
            );

        const height =
            Math.max(
                rect.height,
                1
            );

        camera.aspect =
            width / height;

        camera.updateProjectionMatrix();

        renderer.setSize(
            width,
            height,
            false
        );
    }


    window.addEventListener(
        "resize",
        resize
    );


    resize();


    /* =====================================================
       ANIMACIÓN
    ===================================================== */

    const clock =
        new THREE.Clock();


    function animate() {

        requestAnimationFrame(
            animate
        );

        const elapsed =
            clock.getElapsedTime();


        /* ---------------------------------------------
           TIEMPO DEL SHADER
        --------------------------------------------- */

        coreMaterial
            .uniforms
            .uTime
            .value =
            elapsed;


        /* ---------------------------------------------
           MOVIMIENTO MUY SUAVE
        --------------------------------------------- */

        core.rotation.y +=
            CONFIG.rotationSpeed;

        core.rotation.x =
            Math.sin(
                elapsed * 0.22
            ) * 0.025;


        /* ---------------------------------------------
           PARTÍCULAS
           
           Se mueven lentamente sin convertirse
           en anillos.
        --------------------------------------------- */

        particles.rotation.y =
            elapsed * 0.025;

        particles.rotation.x =
            Math.sin(
                elapsed * 0.18
            ) * 0.035;


        /* ---------------------------------------------
           HALO
        --------------------------------------------- */

        const pulse =
            1.0 +
            Math.sin(
                elapsed * 1.15
            ) * 0.025;

        halo.scale.set(
            pulse,
            pulse,
            pulse
        );


        /* ---------------------------------------------
           PARALLAX
        --------------------------------------------- */

        coreGroup.rotation.y +=
            (
                targetX -
                coreGroup.rotation.y
            ) * 0.025;

        coreGroup.rotation.x +=
            (
                targetY -
                coreGroup.rotation.x
            ) * 0.025;


        /* ---------------------------------------------
           LIGERO MOVIMIENTO VERTICAL
        --------------------------------------------- */

        coreGroup.position.y =
            Math.sin(
                elapsed * 0.45
            ) * 0.035;


        /* ---------------------------------------------
           RENDER
        --------------------------------------------- */

        renderer.render(
            scene,
            camera
        );
    }


    /* =====================================================
       ACTIVACIÓN
    ===================================================== */

    canvas.classList.add(
        "jarvis-3d-ready"
    );

    animate();


    console.log(
        "[JARVIS 3D] Cognitive Core iniciado correctamente."
    );

})();
