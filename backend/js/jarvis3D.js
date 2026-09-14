/* =========================================================
   J.A.R.V.I.S. — HOLOGRAPHIC COGNITIVE SOUL
   STARK COGNITIVE INTERFACE
   ---------------------------------------------------------
   THREE.JS + GLSL

   IMPORTANTE:
   - NO esfera 3D convencional
   - NO anillos
   - NO Saturno
   - NO átomo
   - NO dona
   - NO disco

   El núcleo es un campo energético procedural.
   Las partículas forman un volumen 3D irregular.
========================================================= */

"use strict";

(() => {

    /* =====================================================
       1. COMPROBACIONES
    ===================================================== */

    if (typeof THREE === "undefined") {
        console.error(
            "[JARVIS 3D] Three.js no está cargado."
        );
        return;
    }

    const canvas =
        document.getElementById("jarvis-3d-canvas");

    if (!canvas) {
        console.error(
            '[JARVIS 3D] Falta #jarvis-3d-canvas.'
        );
        return;
    }


    /* =====================================================
       2. ESCENA
    ===================================================== */

    const scene =
        new THREE.Scene();


    /* =====================================================
       3. CÁMARA
    ===================================================== */

    const camera =
        new THREE.PerspectiveCamera(
            45,
            1,
            0.1,
            100
        );

    camera.position.set(
        0,
        0,
        5
    );


    /* =====================================================
       4. RENDERER
    ===================================================== */

    const renderer =
        new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true,
            powerPreference: "high-performance"
        });

    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio || 1,
            1.75
        )
    );

    renderer.setClearColor(
        0x000000,
        0
    );

    if (
        "outputColorSpace" in renderer &&
        THREE.SRGBColorSpace
    ) {
        renderer.outputColorSpace =
            THREE.SRGBColorSpace;
    }


    /* =====================================================
       5. GRUPO PRINCIPAL
    ===================================================== */

    const soulGroup =
        new THREE.Group();

    scene.add(
        soulGroup
    );


    /* =====================================================
       6. SHADER DEL ALMA HOLOGRÁFICA
       
       Esto NO es una esfera.

       Es un campo procedural que crea una masa energética
       irregular y cambiante.
    ===================================================== */

    const soulVertexShader = `
        varying vec2 vUv;

        void main() {

            vUv = uv;

            gl_Position =
                projectionMatrix *
                modelViewMatrix *
                vec4(
                    position,
                    1.0
                );
        }
    `;


    const soulFragmentShader = `
        precision highp float;

        uniform float uTime;
        uniform vec2 uResolution;
        uniform vec2 uPointer;

        varying vec2 vUv;


        /* ==============================================
           ROTACIÓN 2D
        ============================================== */

        mat2 rotate2D(float a) {

            float c = cos(a);
            float s = sin(a);

            return mat2(
                c, -s,
                s,  c
            );
        }


        /* ==============================================
           RUIDO SIMPLE
        ============================================== */

        float hash21(vec2 p) {

            p =
                fract(
                    p *
                    vec2(
                        123.34,
                        456.21
                    )
                );

            p +=
                dot(
                    p,
                    p + 45.32
                );

            return fract(
                p.x * p.y
            );
        }


        float noise(vec2 p) {

            vec2 i =
                floor(p);

            vec2 f =
                fract(p);

            f =
                f *
                f *
                (
                    3.0 -
                    2.0 * f
                );

            float a =
                hash21(i);

            float b =
                hash21(i + vec2(1.0, 0.0));

            float c =
                hash21(i + vec2(0.0, 1.0));

            float d =
                hash21(i + vec2(1.0, 1.0));

            return mix(
                mix(a, b, f.x),
                mix(c, d, f.x),
                f.y
            );
        }


        /* ==============================================
           FBM
        ============================================== */

        float fbm(vec2 p) {

            float value = 0.0;
            float amplitude = 0.5;

            for (
                int i = 0;
                i < 5;
                i++
            ) {

                value +=
                    noise(p) *
                    amplitude;

                p =
                    p *
                    2.03 +
                    17.17;

                amplitude *=
                    0.5;
            }

            return value;
        }


        /* ==============================================
           CAMPO ENERGÉTICO
           
           Devuelve la intensidad de la masa holográfica.
        ============================================== */

        float energyField(
            vec2 p,
            float time
        ) {

            float radius =
                length(p);

            float angle =
                atan(
                    p.y,
                    p.x
                );


            /* ------------------------------------------
               Distorsión orgánica
            ------------------------------------------ */

            float waveA =
                sin(
                    angle * 3.0 +
                    time * 0.8
                );

            float waveB =
                sin(
                    angle * 7.0 -
                    time * 1.1
                );

            float waveC =
                sin(
                    angle * 11.0 +
                    time * 0.55
                );


            float organic =
                waveA * 0.08 +
                waveB * 0.045 +
                waveC * 0.025;


            /* ------------------------------------------
               Ruido fluido
            ------------------------------------------ */

            float n =
                fbm(
                    p * 3.2 +
                    vec2(
                        time * 0.18,
                        -time * 0.13
                    )
                );


            /* ------------------------------------------
               Forma base irregular
            ------------------------------------------ */

            float radiusLimit =
                0.92 +
                organic +
                (n - 0.5) *
                0.28;


            float body =
                1.0 -
                smoothstep(
                    radiusLimit - 0.12,
                    radiusLimit + 0.05,
                    radius
                );


            /* ------------------------------------------
               Corrientes internas
            ------------------------------------------ */

            float stream1 =
                sin(
                    p.x * 10.0 +
                    sin(p.y * 5.0) +
                    time * 2.0
                );

            float stream2 =
                sin(
                    p.y * 14.0 -
                    p.x * 4.0 -
                    time * 1.45
                );

            float streams =
                (
                    stream1 +
                    stream2
                ) *
                0.5;


            /* ------------------------------------------
               Energía
            ------------------------------------------ */

            float energy =
                body *
                (
                    0.65 +
                    streams * 0.20 +
                    n * 0.35
                );


            /* ------------------------------------------
               Borde energético
            ------------------------------------------ */

            float edge =
                smoothstep(
                    0.15,
                    0.92,
                    radius
                );

            energy +=
                body *
                edge *
                0.45;


            return max(
                energy,
                0.0
            );
        }


        void main() {

            /* ==========================================
               COORDENADAS
            ========================================== */

            vec2 uv =
                vUv * 2.0 -
                1.0;

            float aspect =
                uResolution.x /
                max(
                    uResolution.y,
                    1.0
                );

            uv.x *=
                aspect;


            /* ==========================================
               PEQUEÑA REACCIÓN AL CURSOR
            ========================================== */

            uv.x -=
                uPointer.x *
                0.045;

            uv.y -=
                uPointer.y *
                0.045;


            /* ==========================================
               MOVIMIENTO
            ========================================== */

            float time =
                uTime;


            uv =
                rotate2D(
                    sin(time * 0.11) *
                    0.025
                ) *
                uv;


            /* ==========================================
               CAMPO PRINCIPAL
            ========================================== */

            float field =
                energyField(
                    uv,
                    time
                );


            /* ==========================================
               CAPAS DE ENERGÍA
            ========================================== */

            float inner =
                energyField(
                    uv * 1.35,
                    time * 1.22
                );

            float outer =
                energyField(
                    uv * 0.72,
                    time * 0.72
                );


            /* ==========================================
               GLOW
            ========================================== */

            float distanceFromCenter =
                length(uv);

            float glow =
                exp(
                    -distanceFromCenter *
                    2.6
                );


            float edgeGlow =
                exp(
                    -abs(field - 0.25) *
                    7.0
                );


            /* ==========================================
               PALETA
               
               Dorado + amarillo + oscuridad.
            ========================================== */

            vec3 dark =
                vec3(
                    0.006,
                    0.007,
                    0.009
                );

            vec3 gold =
                vec3(
                    1.0,
                    0.47,
                    0.025
                );

            vec3 yellow =
                vec3(
                    1.0,
                    0.82,
                    0.22
                );

            vec3 whiteGold =
                vec3(
                    1.0,
                    0.97,
                    0.78
                );


            /* ==========================================
               MEZCLA DE COLOR
            ========================================== */

            vec3 color =
                dark;

            color =
                mix(
                    color,
                    gold,
                    clamp(
                        field * 1.5,
                        0.0,
                        1.0
                    )
                );

            color =
                mix(
                    color,
                    yellow,
                    clamp(
                        inner * 0.85,
                        0.0,
                        1.0
                    )
                );

            color +=
                whiteGold *
                edgeGlow *
                0.16;

            color +=
                yellow *
                glow *
                0.22;


            /* ==========================================
               ZONAS OSCURAS
               
               Esto evita el aspecto de "bola amarilla".
            ========================================== */

            float darkness =
                noise(
                    uv * 7.0 +
                    time * 0.12
                );

            darkness =
                smoothstep(
                    0.28,
                    0.70,
                    darkness
                );


            color *=
                mix(
                    0.42,
                    1.0,
                    darkness
                );


            /* ==========================================
               ALPHA HOLOGRÁFICO
            ========================================== */

            float alpha =
                field * 0.62;

            alpha +=
                glow *
                0.12;

            alpha +=
                edgeGlow *
                0.12;

            alpha =
                clamp(
                    alpha,
                    0.0,
                    0.78
                );


            /* ==========================================
               DESCARTE
            ========================================== */

            if (
                alpha <
                0.015
            ) {
                discard;
            }


            gl_FragColor =
                vec4(
                    color,
                    alpha
                );
        }
    `;


    /* =====================================================
       7. MATERIAL
    ===================================================== */

    const soulMaterial =
        new THREE.ShaderMaterial({

            uniforms: {

                uTime: {
                    value: 0
                },

                uResolution: {
                    value:
                        new THREE.Vector2(
                            1,
                            1
                        )
                },

                uPointer: {
                    value:
                        new THREE.Vector2(
                            0,
                            0
                        )
                }

            },

            vertexShader:
                soulVertexShader,

            fragmentShader:
                soulFragmentShader,

            transparent: true,

            depthWrite: false,

            depthTest: false,

            blending:
                THREE.AdditiveBlending
        });


    /* =====================================================
       8. PLANO DEL CAMPO HOLOGRÁFICO
       
       El shader genera la forma. No hay SphereGeometry.
    ===================================================== */

    const soulGeometry =
        new THREE.PlaneGeometry(
            3.8,
            3.8,
            1,
            1
        );


    const soul =
        new THREE.Mesh(
            soulGeometry,
            soulMaterial
        );


    soul.position.z =
        0;


    soulGroup.add(
        soul
    );


    /* =====================================================
       9. PARTÍCULAS 3D
       
       Aquí está la profundidad real.
       
       No son anillos.
       No forman un círculo perfecto.
       Se distribuyen alrededor del campo.
    ===================================================== */

    const PARTICLE_COUNT =
        window.innerWidth < 700
            ? 95
            : 170;


    const particlePositions =
        new Float32Array(
            PARTICLE_COUNT * 3
        );


    const particleSizes =
        new Float32Array(
            PARTICLE_COUNT
        );


    const particleData = [];


    for (
        let i = 0;
        i < PARTICLE_COUNT;
        i++
    ) {

        const theta =
            Math.random() *
            Math.PI *
            2;

        const phi =
            Math.acos(
                2 *
                Math.random() -
                1
            );


        /*
         * Distribución no uniforme.
         * Esto evita el aspecto de anillo.
         */

        const radius =
            1.15 +
            Math.pow(
                Math.random(),
                0.65
            ) *
            1.15;


        const irregularX =
            (
                Math.random() -
                0.5
            ) *
            0.65;

        const irregularY =
            (
                Math.random() -
                0.5
            ) *
            0.65;

        const irregularZ =
            (
                Math.random() -
                0.5
            ) *
            0.65;


        particlePositions[
            i * 3
        ] =
            Math.sin(phi) *
            Math.cos(theta) *
            radius +
            irregularX;


        particlePositions[
            i * 3 + 1
        ] =
            Math.sin(phi) *
            Math.sin(theta) *
            radius *
            0.82 +
            irregularY;


        particlePositions[
            i * 3 + 2
        ] =
            Math.cos(phi) *
            radius *
            0.72 +
            irregularZ;


        particleSizes[i] =
            0.025 +
            Math.random() *
            0.055;


        particleData.push({
            theta:
                theta,

            phi:
                phi,

            radius:
                radius,

            speed:
                0.08 +
                Math.random() *
                0.18,

            phase:
                Math.random() *
                Math.PI *
                2,

            wobble:
                0.08 +
                Math.random() *
                0.22
        });
    }


    const particleGeometry =
        new THREE.BufferGeometry();


    particleGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            particlePositions,
            3
        )
    );


    const particleMaterial =
        new THREE.PointsMaterial({

            color:
                0xffc83d,

            size:
                0.035,

            transparent:
                true,

            opacity:
                0.72,

            blending:
                THREE.AdditiveBlending,

            depthWrite:
                false,

            sizeAttenuation:
                true
        });


    const particleCloud =
        new THREE.Points(
            particleGeometry,
            particleMaterial
        );


    soulGroup.add(
        particleCloud
    );


    /* =====================================================
       10. DESTELLOS
    ===================================================== */

    const sparkCount =
        window.innerWidth < 700
            ? 18
            : 32;


    const sparkPositions =
        new Float32Array(
            sparkCount * 3
        );


    for (
        let i = 0;
        i < sparkCount;
        i++
    ) {

        const angle =
            Math.random() *
            Math.PI *
            2;

        const radius =
            1.0 +
            Math.random() *
            1.65;

        sparkPositions[
            i * 3
        ] =
            Math.cos(angle) *
            radius;

        sparkPositions[
            i * 3 + 1
        ] =
            (
                Math.random() -
                0.5
            ) *
            2.4;

        sparkPositions[
            i * 3 + 2
        ] =
            (
                Math.random() -
                0.5
            ) *
            1.8;
    }


    const sparkGeometry =
        new THREE.BufferGeometry();


    sparkGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            sparkPositions,
            3
        )
    );


    const sparkMaterial =
        new THREE.PointsMaterial({

            color:
                0xffe39a,

            size:
                0.045,

            transparent:
                true,

            opacity:
                0.55,

            blending:
                THREE.AdditiveBlending,

            depthWrite:
                false
        });


    const sparks =
        new THREE.Points(
            sparkGeometry,
            sparkMaterial
        );


    soulGroup.add(
        sparks
    );


    /* =====================================================
       11. INTERACCIÓN
    ===================================================== */

    let pointerX = 0;
    let pointerY = 0;

    window.addEventListener(
        "pointermove",
        (event) => {

            pointerX =
                (
                    event.clientX /
                    window.innerWidth
                ) *
                2 -
                1;


            pointerY =
                -(
                    event.clientY /
                    window.innerHeight
                ) *
                2 +
                1;


            soulMaterial
                .uniforms
                .uPointer
                .value
                .set(
                    pointerX,
                    pointerY
                );
        },
        {
            passive: true
        }
    );


    /* =====================================================
       12. RESIZE
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
            width /
            height;


        camera.updateProjectionMatrix();


        renderer.setSize(
            width,
            height,
            false
        );


        soulMaterial
            .uniforms
            .uResolution
            .value
            .set(
                width,
                height
            );
    }


    window.addEventListener(
        "resize",
        resize
    );


    resize();


    /* =====================================================
       13. ANIMACIÓN
    ===================================================== */

    const clock =
        new THREE.Clock();


    function animate() {

        requestAnimationFrame(
            animate
        );


        const time =
            clock.getElapsedTime();


        /* ---------------------------------------------
           SHADER
        --------------------------------------------- */

        soulMaterial
            .uniforms
            .uTime
            .value =
            time;


        /* ---------------------------------------------
           MOVIMIENTO GLOBAL
        --------------------------------------------- */

        soulGroup.rotation.y =
            Math.sin(
                time * 0.16
            ) *
            0.045;


        soulGroup.rotation.x =
            Math.sin(
                time * 0.13
            ) *
            0.028;


        /* ---------------------------------------------
           PARTÍCULAS IRREGULARES
        --------------------------------------------- */

        const positions =
            particleGeometry
                .attributes
                .position
                .array;


        for (
            let i = 0;
            i < PARTICLE_COUNT;
            i++
        ) {

            const data =
                particleData[i];


            const t =
                time *
                data.speed +
                data.phase;


            const theta =
                data.theta +
                t;


            const phi =
                data.phi +
                Math.sin(
                    t * 0.75
                ) *
                data.wobble;


            const radius =
                data.radius +
                Math.sin(
                    t * 1.4
                ) *
                0.10;


            positions[
                i * 3
            ] =
                Math.sin(phi) *
                Math.cos(theta) *
                radius;


            positions[
                i * 3 + 1
            ] =
                Math.sin(phi) *
                Math.sin(theta) *
                radius *
                0.82;


            positions[
                i * 3 + 2
            ] =
                Math.cos(phi) *
                radius *
                0.72;
        }


        particleGeometry
            .attributes
            .position
            .needsUpdate =
            true;


        /* ---------------------------------------------
           DESTELLOS
        --------------------------------------------- */

        sparks.rotation.y =
            time *
            0.035;

        sparks.rotation.z =
            Math.sin(
                time * 0.21
            ) *
            0.04;


        /* ---------------------------------------------
           RENDER
        --------------------------------------------- */

        renderer.render(
            scene,
            camera
        );
    }


    /* =====================================================
       14. ACTIVACIÓN
    ===================================================== */

    canvas.classList.add(
        "jarvis-3d-ready"
    );


    animate();


    console.log(
        "[JARVIS 3D] Holographic Cognitive Soul: ONLINE"
    );

})();
