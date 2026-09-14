/* =========================================================
   STARK INDUSTRIES
   J.A.R.V.I.S. — CENTRAL COGNITIVE CORE
   Three.js / WebGL / GLSL
   ========================================================= */

"use strict";

(function () {

    const canvas = document.getElementById("jarvis-3d-canvas");

    if (!canvas) {
        console.warn("[JARVIS 3D] Canvas del núcleo no encontrado.");
        return;
    }

    if (typeof THREE === "undefined") {
        console.error("[JARVIS 3D] Three.js no está disponible.");
        return;
    }


    /* =====================================================
       CONFIGURACIÓN
    ===================================================== */

    let scene;
    let camera;
    let renderer;

    let coreGroup;
    let coreSphere;
    let energyParticles;
    let outerParticles;

    let ring1;
    let ring2;
    let ring3;

    let animationFrame;

    const clock = new THREE.Clock();

    const pointer = {
        x: 0,
        y: 0,
        targetX: 0,
        targetY: 0
    };


    /* =====================================================
       INICIALIZACIÓN
    ===================================================== */

    init();


    function init() {

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(
            42,
            getWidth() / getHeight(),
            0.1,
            100
        );

        camera.position.set(
            0,
            0,
            5.2
        );


        /* =================================================
           RENDERER
        ================================================= */

        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });

        renderer.setPixelRatio(
            Math.min(window.devicePixelRatio || 1, 2)
        );

        renderer.setSize(
            getWidth(),
            getHeight(),
            false
        );

        renderer.setClearColor(
            0x000000,
            0
        );


        /* =================================================
           GRUPO PRINCIPAL
        ================================================= */

        coreGroup = new THREE.Group();

        scene.add(coreGroup);


        /* =================================================
           LUCES
        ================================================= */

        createLights();


        /* =================================================
           NÚCLEO
        ================================================= */

        createCore();


        /* =================================================
           ANILLOS
        ================================================= */

        createRings();


        /* =================================================
           PARTÍCULAS
        ================================================= */

        createParticles();


        /* =================================================
           EVENTOS
        ================================================= */

        window.addEventListener(
            "resize",
            resize,
            { passive: true }
        );

        window.addEventListener(
            "pointermove",
            handlePointer,
            { passive: true }
        );


        /* =================================================
           ANIMACIÓN
        ================================================= */

        animate();

        console.log(
            "[JARVIS 3D] Núcleo cognitivo inicializado."
        );
    }


    /* =====================================================
       UTILIDADES
    ===================================================== */

    function getWidth() {

        return Math.max(
            canvas.clientWidth || canvas.parentElement?.clientWidth || 1,
            1
        );
    }


    function getHeight() {

        return Math.max(
            canvas.clientHeight || canvas.parentElement?.clientHeight || 1,
            1
        );
    }


    /* =====================================================
       ILUMINACIÓN
    ===================================================== */

    function createLights() {

        const ambient =
            new THREE.AmbientLight(
                0xffffff,
                0.7
            );

        scene.add(ambient);


        const goldLight =
            new THREE.PointLight(
                0xffb400,
                3.5,
                7
            );

        goldLight.position.set(
            -1.5,
            1.2,
            2
        );

        scene.add(goldLight);


        const warmLight =
            new THREE.PointLight(
                0xff8a00,
                2.2,
                6
            );

        warmLight.position.set(
            1.5,
            -0.8,
            1.8
        );

        scene.add(warmLight);


        const whiteLight =
            new THREE.PointLight(
                0xffffff,
                1.8,
                5
            );

        whiteLight.position.set(
            0,
            0,
            3
        );

        scene.add(whiteLight);
    }


    /* =====================================================
       NÚCLEO CENTRAL
       SHADER GLSL
    ===================================================== */

    function createCore() {

        const geometry =
            new THREE.SphereGeometry(
                0.43,
                64,
                64
            );


        const material =
            new THREE.ShaderMaterial({

                transparent: true,

                depthWrite: false,

                uniforms: {

                    uTime: {
                        value: 0
                    },

                    uColor: {
                        value: new THREE.Color(
                            0xffb400
                        )
                    }

                },

                vertexShader: `

                    varying vec3 vNormal;
                    varying vec3 vPosition;

                    void main() {

                        vNormal = normalize(
                            normalMatrix * normal
                        );

                        vPosition = position;

                        gl_Position =
                            projectionMatrix *
                            modelViewMatrix *
                            vec4(position, 1.0);
                    }

                `,

                fragmentShader: `

                    uniform float uTime;
                    uniform vec3 uColor;

                    varying vec3 vNormal;
                    varying vec3 vPosition;

                    void main() {

                        float edge =
                            1.0 -
                            abs(vNormal.z);

                        float pulse =
                            0.5 +
                            0.5 *
                            sin(uTime * 2.2);

                        float glow =
                            pow(
                                edge,
                                2.6
                            );

                        float energy =
                            0.72 +
                            pulse * 0.28;

                        vec3 whiteCore =
                            vec3(
                                1.0,
                                0.88,
                                0.55
                            );

                        vec3 finalColor =
                            mix(
                                uColor,
                                whiteCore,
                                glow * 0.72
                            );

                        finalColor *= energy;

                        float alpha =
                            0.42 +
                            glow * 0.42;

                        gl_FragColor =
                            vec4(
                                finalColor,
                                alpha
                            );
                    }

                `

            });


        coreSphere =
            new THREE.Mesh(
                geometry,
                material
            );


        coreGroup.add(
            coreSphere
        );
    }


    /* =====================================================
       ANILLOS
    ===================================================== */

    function createRings() {

        const material1 =
            new THREE.MeshBasicMaterial({

                color: 0xffb400,

                transparent: true,

                opacity: 0.46,

                side: THREE.DoubleSide,

                depthWrite: false

            });


        const material2 =
            new THREE.MeshBasicMaterial({

                color: 0xffd35c,

                transparent: true,

                opacity: 0.27,

                side: THREE.DoubleSide,

                depthWrite: false

            });


        const material3 =
            new THREE.MeshBasicMaterial({

                color: 0xffa000,

                transparent: true,

                opacity: 0.20,

                side: THREE.DoubleSide,

                depthWrite: false

            });


        /* =================================================
           ANILLO 1
        ================================================= */

        ring1 =
            new THREE.Mesh(
                new THREE.RingGeometry(
                    0.56,
                    0.575,
                    96
                ),
                material1
            );


        ring1.rotation.x =
            Math.PI * 0.28;


        coreGroup.add(
            ring1
        );


        /* =================================================
           ANILLO 2
        ================================================= */

        ring2 =
            new THREE.Mesh(
                new THREE.RingGeometry(
                    0.72,
                    0.735,
                    96
                ),
                material2
            );


        ring2.rotation.y =
            Math.PI * 0.48;


        coreGroup.add(
            ring2
        );


        /* =================================================
           ANILLO 3
        ================================================= */

        ring3 =
            new THREE.Mesh(
                new THREE.RingGeometry(
                    0.88,
                    0.895,
                    96
                ),
                material3
            );


        ring3.rotation.x =
            Math.PI * 0.66;

        ring3.rotation.z =
            Math.PI * 0.22;


        coreGroup.add(
            ring3
        );
    }


    /* =====================================================
       PARTÍCULAS
    ===================================================== */

    function createParticles() {

        const particleCount = 180;

        const positions =
            new Float32Array(
                particleCount * 3
            );

        const sizes =
            new Float32Array(
                particleCount
            );

        const speeds =
            new Float32Array(
                particleCount
            );


        for (
            let i = 0;
            i < particleCount;
            i++
        ) {

            const radius =
                0.9 +
                Math.random() * 1.15;

            const angle =
                Math.random() *
                Math.PI *
                2;

            const height =
                (Math.random() - 0.5) *
                1.7;


            positions[i * 3] =
                Math.cos(angle) *
                radius;

            positions[i * 3 + 1] =
                height;

            positions[i * 3 + 2] =
                Math.sin(angle) *
                radius *
                0.58;


            sizes[i] =
                0.018 +
                Math.random() *
                0.045;


            speeds[i] =
                0.15 +
                Math.random() *
                0.45;
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


        geometry.setAttribute(
            "size",
            new THREE.BufferAttribute(
                sizes,
                1
            )
        );


        geometry.setAttribute(
            "speed",
            new THREE.BufferAttribute(
                speeds,
                1
            )
        );


        const material =
            new THREE.PointsMaterial({

                color: 0xffc84d,

                size: 0.035,

                transparent: true,

                opacity: 0.58,

                depthWrite: false,

                blending:
                    THREE.AdditiveBlending
            });


        energyParticles =
            new THREE.Points(
                geometry,
                material
            );


        coreGroup.add(
            energyParticles
        );


        /* =================================================
           PARTÍCULAS EXTERNAS
        ================================================= */

        createOuterParticles();
    }


    function createOuterParticles() {

        const count = 80;

        const positions =
            new Float32Array(
                count * 3
            );


        for (
            let i = 0;
            i < count;
            i++
        ) {

            positions[i * 3] =
                (Math.random() - 0.5) *
                4.8;

            positions[i * 3 + 1] =
                (Math.random() - 0.5) *
                3.1;

            positions[i * 3 + 2] =
                -0.5 -
                Math.random() *
                1.2;
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

                color: 0xffb400,

                size: 0.018,

                transparent: true,

                opacity: 0.32,

                depthWrite: false,

                blending:
                    THREE.AdditiveBlending
            });


        outerParticles =
            new THREE.Points(
                geometry,
                material
            );


        scene.add(
            outerParticles
        );
    }


    /* =====================================================
       MOVIMIENTO DEL MOUSE
    ===================================================== */

    function handlePointer(event) {

        const rect =
            canvas.getBoundingClientRect();


        if (
            rect.width <= 0 ||
            rect.height <= 0
        ) {
            return;
        }


        const x =
            (
                event.clientX -
                rect.left
            ) /
            rect.width;


        const y =
            (
                event.clientY -
                rect.top
            ) /
            rect.height;


        pointer.targetX =
            (x - 0.5) * 2;


        pointer.targetY =
            (y - 0.5) * 2;
    }


    /* =====================================================
       ANIMACIÓN PRINCIPAL
    ===================================================== */

    function animate() {

        animationFrame =
            requestAnimationFrame(
                animate
            );


        const elapsed =
            clock.getElapsedTime();


        /* =================================================
           SUAVIZAR POINTER
        ================================================= */

        pointer.x +=
            (
                pointer.targetX -
                pointer.x
            ) * 0.035;


        pointer.y +=
            (
                pointer.targetY -
                pointer.y
            ) * 0.035;


        /* =================================================
           NÚCLEO
        ================================================= */

        if (coreSphere) {

            coreSphere.material
                .uniforms
                .uTime
                .value =
                elapsed;


            const pulse =
                1 +
                Math.sin(
                    elapsed * 1.8
                ) * 0.045;


            coreSphere.scale.set(
                pulse,
                pulse,
                pulse
            );
        }


        /* =================================================
           MOVIMIENTO DEL GRUPO
        ================================================= */

        if (coreGroup) {

            coreGroup.rotation.y +=
                0.0015;


            coreGroup.rotation.x =
                pointer.y * 0.08;


            coreGroup.rotation.z =
                pointer.x * 0.035;


            coreGroup.position.y =
                Math.sin(
                    elapsed * 0.7
                ) * 0.035;
        }


        /* =================================================
           ANILLOS
        ================================================= */

        if (ring1) {

            ring1.rotation.z +=
                0.006;
        }


        if (ring2) {

            ring2.rotation.z -=
                0.004;


            ring2.rotation.x +=
                0.0015;
        }


        if (ring3) {

            ring3.rotation.z +=
                0.0025;
        }


        /* =================================================
           PARTÍCULAS
        ================================================= */

        if (energyParticles) {

            energyParticles.rotation.y +=
                0.0028;


            energyParticles.rotation.x =
                Math.sin(
                    elapsed * 0.35
                ) * 0.08;
        }


        if (outerParticles) {

            outerParticles.rotation.y +=
                0.00045;


            outerParticles.rotation.z =
                Math.sin(
                    elapsed * 0.18
                ) * 0.025;
        }


        /* =================================================
           RENDER
        ================================================= */

        renderer.render(
            scene,
            camera
        );
    }


    /* =====================================================
       RESPONSIVE
    ===================================================== */

    function resize() {

        if (!renderer || !camera) {
            return;
        }


        const width =
            getWidth();


        const height =
            getHeight();


        camera.aspect =
            width / height;


        camera.updateProjectionMatrix();


        renderer.setSize(
            width,
            height,
            false
        );
    }


    /* =====================================================
       LIMPIEZA
    ===================================================== */

    window.addEventListener(
        "beforeunload",
        function () {

            if (animationFrame) {

                cancelAnimationFrame(
                    animationFrame
                );
            }


            if (renderer) {

                renderer.dispose();
            }
        }
    );

})();
