/* =========================================================
   J.A.R.V.I.S. — HOLOGRAPHIC COGNITIVE CORE
   STARK COGNITIVE INTERFACE
   ---------------------------------------------------------
   THREE.JS 0.180.0
   - Procedural energy volume
   - Dense 3D particles
   - Irregular holographic circuitry
   - Multiple independent orbital structures
   - Internal luminous core
   - Bloom / glow post-processing
   - Transparent background
   - Mouse interaction
   ========================================================= */

"use strict";

import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

(() => {
    const canvas = document.getElementById("jarvis-3d-canvas");

    if (!canvas) {
        console.error("[JARVIS 3D] Falta #jarvis-3d-canvas.");
        return;
    }

    /* =====================================================
       1. ESCENA / CÁMARA / RENDER
    ===================================================== */

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(42, 1, 0.05, 100);
    camera.position.set(0, 0, 5.2);

    const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setClearColor(0x000000, 0);

    if ("outputColorSpace" in renderer && THREE.SRGBColorSpace) {
        renderer.outputColorSpace = THREE.SRGBColorSpace;
    }

    if ("toneMapping" in renderer) {
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.15;
    }

    /* =====================================================
       2. POST-PROCESADO
    ===================================================== */

    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);

    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(1, 1),
        1.65,
        0.72,
        0.12
    );

    const outputPass = new OutputPass();

    composer.addPass(renderPass);
    composer.addPass(bloomPass);
    composer.addPass(outputPass);

    /* =====================================================
       3. GRUPO PRINCIPAL
    ===================================================== */

    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    const amber = new THREE.Color(0xff9d00);
    const gold = new THREE.Color(0xffc52e);
    const paleGold = new THREE.Color(0xffed9a);
    const whiteGold = new THREE.Color(0xffffdf);

    /* =====================================================
       4. NÚCLEO CENTRAL — CAMPO PROCEDURAL 3D
    ===================================================== */

    const coreVertexShader = `
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        varying vec2 vUv;

        uniform float uTime;

        void main() {
            vUv = uv;

            vec3 p = position;
            float n1 = sin(p.x * 7.0 + uTime * 1.7);
            float n2 = sin(p.y * 9.0 - uTime * 1.25);
            float n3 = sin(p.z * 11.0 + uTime * 0.95);
            float deformation = (n1 + n2 + n3) * 0.018;

            p += normal * deformation;

            vec4 world = modelMatrix * vec4(p, 1.0);
            vWorldPosition = world.xyz;
            vNormal = normalize(normalMatrix * normal);

            gl_Position = projectionMatrix * viewMatrix * world;
        }
    `;

    const coreFragmentShader = `
        precision highp float;

        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        varying vec2 vUv;

        uniform float uTime;
        uniform vec2 uPointer;

        float hash21(vec2 p) {
            p = fract(p * vec2(123.34, 456.21));
            p += dot(p, p + 45.32);
            return fract(p.x * p.y);
        }

        float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            f = f * f * (3.0 - 2.0 * f);

            float a = hash21(i);
            float b = hash21(i + vec2(1.0, 0.0));
            float c = hash21(i + vec2(0.0, 1.0));
            float d = hash21(i + vec2(1.0, 1.0));

            return mix(
                mix(a, b, f.x),
                mix(c, d, f.x),
                f.y
            );
        }

        float fbm(vec2 p) {
            float value = 0.0;
            float amplitude = 0.5;

            for (int i = 0; i < 5; i++) {
                value += noise(p) * amplitude;
                p = p * 2.03 + 17.17;
                amplitude *= 0.5;
            }

            return value;
        }

        void main() {
            vec3 viewDir = normalize(cameraPosition - vWorldPosition);

            float fresnel = pow(
                1.0 - max(dot(normalize(vNormal), viewDir), 0.0),
                2.2
            );

            vec2 p = vUv * 2.0 - 1.0;

            p += uPointer * 0.025;

            float t = uTime;

            float n = fbm(
                p * 4.6 +
                vec2(t * 0.18, -t * 0.13)
            );

            float flowA = sin(
                p.x * 17.0 +
                sin(p.y * 8.0) +
                t * 2.0
            );

            float flowB = sin(
                p.y * 21.0 -
                p.x * 6.0 -
                t * 1.55
            );

            float flowC = sin(
                (p.x + p.y) * 15.0 +
                t * 0.85
            );

            float circuitry =
                smoothstep(
                    0.72,
                    0.98,
                    abs(flowA * 0.45 + flowB * 0.35 + flowC * 0.20)
                );

            float internalGlow =
                exp(-length(p) * 2.9);

            vec3 color = vec3(0.015, 0.007, 0.001);

            color = mix(
                color,
                vec3(1.0, 0.28, 0.015),
                n * 0.50
            );

            color = mix(
                color,
                vec3(1.0, 0.66, 0.045),
                internalGlow * 0.82
            );

            color += vec3(1.0, 0.88, 0.42) * circuitry * 0.55;
            color += vec3(1.0, 0.97, 0.75) * fresnel * 0.95;

            float pulse =
                0.82 +
                0.18 * sin(t * 2.3 + length(p) * 9.0);

            color *= pulse;

            float alpha =
                0.18 +
                internalGlow * 0.46 +
                circuitry * 0.28 +
                fresnel * 0.34;

            alpha = clamp(alpha, 0.0, 0.92);

            gl_FragColor = vec4(color, alpha);
        }
    `;

    const coreMaterial = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uPointer: { value: new THREE.Vector2(0, 0) }
        },
        vertexShader: coreVertexShader,
        fragmentShader: coreFragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
    });

    const coreGeometry = new THREE.IcosahedronGeometry(1.02, 5);
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    coreGroup.add(coreMesh);

    /* =====================================================
       5. NÚCLEO INTERNO / PULSO
    ===================================================== */

    const innerMaterial = new THREE.MeshBasicMaterial({
        color: whiteGold,
        transparent: true,
        opacity: 0.34,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const innerCore = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.31, 4),
        innerMaterial
    );

    coreGroup.add(innerCore);

    /* =====================================================
       6. PARTÍCULAS DENSAS — VOLUMEN 3D
    ===================================================== */

    const particleCount =
        window.innerWidth < 700 ? 850 : 1650;

    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const colors = new Float32Array(particleCount * 3);
    const particleData = [];

    for (let i = 0; i < particleCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        const shell =
            0.72 +
            Math.pow(Math.random(), 0.48) * 1.42;

        const irregular =
            0.12 +
            Math.random() * 0.34;

        const x =
            Math.sin(phi) *
            Math.cos(theta) *
            (shell + (Math.random() - 0.5) * irregular);

        const y =
            Math.sin(phi) *
            Math.sin(theta) *
            (shell + (Math.random() - 0.5) * irregular) *
            0.90;

        const z =
            Math.cos(phi) *
            (shell + (Math.random() - 0.5) * irregular) *
            0.86;

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        sizes[i] =
            0.012 +
            Math.random() * 0.045;

        const c =
            Math.random() < 0.22
                ? whiteGold
                : Math.random() < 0.55
                    ? gold
                    : amber;

        colors[i * 3] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;

        particleData.push({
            theta,
            phi,
            radius: shell,
            speed: 0.035 + Math.random() * 0.17,
            phase: Math.random() * Math.PI * 2,
            wobble: 0.04 + Math.random() * 0.20
        });
    }

    const particleGeometry = new THREE.BufferGeometry();

    particleGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
    );

    particleGeometry.setAttribute(
        "color",
        new THREE.BufferAttribute(colors, 3)
    );

    particleGeometry.setAttribute(
        "size",
        new THREE.BufferAttribute(sizes, 1)
    );

    const particleMaterial = new THREE.PointsMaterial({
        size: 0.032,
        vertexColors: true,
        transparent: true,
        opacity: 0.86,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true
    });

    const particleCloud = new THREE.Points(
        particleGeometry,
        particleMaterial
    );

    coreGroup.add(particleCloud);

    /* =====================================================
       7. CIRCUITOS HOLOGRÁFICOS IRREGULARES
    ===================================================== */

    function createCircuitLayer(count, radius, spread, rotation) {
        const linePositions = [];
        const lineColors = [];

        for (let i = 0; i < count; i++) {
            const a = Math.random() * Math.PI * 2;
            const b = a + (0.035 + Math.random() * 0.26);

            const r1 =
                radius +
                (Math.random() - 0.5) * spread;

            const r2 =
                radius +
                (Math.random() - 0.5) * spread;

            const y1 =
                (Math.random() - 0.5) *
                (spread * 1.9);

            const y2 =
                y1 +
                (Math.random() - 0.5) *
                0.34;

            const z1 =
                Math.cos(a) * r1;

            const x1 =
                Math.sin(a) * r1;

            const z2 =
                Math.cos(b) * r2;

            const x2 =
                Math.sin(b) * r2;

            linePositions.push(
                x1, y1, z1,
                x2, y2, z2
            );

            const intensity =
                0.42 + Math.random() * 0.58;

            lineColors.push(
                1.0, 0.38 * intensity, 0.015,
                1.0, 0.70 * intensity, 0.04
            );

            if (Math.random() < 0.20) {
                linePositions.push(
                    x2, y2, z2,
                    x2 * 0.94, y2 + 0.06, z2 * 0.94
                );

                lineColors.push(
                    1.0, 0.88, 0.42,
                    1.0, 0.42, 0.02
                );
            }
        }

        const geometry = new THREE.BufferGeometry();

        geometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(linePositions, 3)
        );

        geometry.setAttribute(
            "color",
            new THREE.Float32BufferAttribute(lineColors, 3)
        );

        const material = new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: 0.62,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const lines = new THREE.LineSegments(
            geometry,
            material
        );

        lines.rotation.set(
            rotation.x,
            rotation.y,
            rotation.z
        );

        return lines;
    }

    const circuitsA = createCircuitLayer(
        520,
        1.18,
        0.34,
        new THREE.Euler(0.1, 0.25, 0.0)
    );

    const circuitsB = createCircuitLayer(
        430,
        1.48,
        0.48,
        new THREE.Euler(1.1, -0.4, 0.35)
    );

    const circuitsC = createCircuitLayer(
        310,
        1.76,
        0.58,
        new THREE.Euler(-0.5, 0.8, -0.25)
    );

    coreGroup.add(circuitsA, circuitsB, circuitsC);

    /* =====================================================
       8. ORBITALES — ESTRUCTURA TECNOLÓGICA
    ===================================================== */

    function makeOrbit(
        radius,
        tube,
        opacity,
        rotation,
        speed
    ) {
        const geometry = new THREE.TorusGeometry(
            radius,
            tube,
            10,
            180
        );

        const material = new THREE.MeshBasicMaterial({
            color: gold,
            transparent: true,
            opacity,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const mesh = new THREE.Mesh(
            geometry,
            material
        );

        mesh.rotation.set(
            rotation.x,
            rotation.y,
            rotation.z
        );

        mesh.userData.speed = speed;

        return mesh;
    }

    const orbitA = makeOrbit(
        1.30,
        0.009,
        0.72,
        new THREE.Euler(0.55, 0.10, 0.20),
        0.32
    );

    const orbitB = makeOrbit(
        1.55,
        0.006,
        0.52,
        new THREE.Euler(1.25, 0.55, -0.15),
        -0.22
    );

    const orbitC = makeOrbit(
        1.78,
        0.004,
        0.34,
        new THREE.Euler(-0.35, 1.0, 0.65),
        0.16
    );

    coreGroup.add(
        orbitA,
        orbitB,
        orbitC
    );

    /* =====================================================
       9. MICRO NODOS / DATA POINTS
    ===================================================== */

    const nodeCount =
        window.innerWidth < 700 ? 70 : 130;

    const nodePositions =
        new Float32Array(nodeCount * 3);

    for (let i = 0; i < nodeCount; i++) {
        const angle =
            Math.random() *
            Math.PI * 2;

        const radius =
            1.08 +
            Math.random() * 0.90;

        nodePositions[i * 3] =
            Math.cos(angle) * radius;

        nodePositions[i * 3 + 1] =
            (Math.random() - 0.5) *
            2.0;

        nodePositions[i * 3 + 2] =
            Math.sin(angle) * radius *
            0.82;
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
            color: paleGold,
            size: 0.065,
            transparent: true,
            opacity: 0.92,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

    const nodes =
        new THREE.Points(
            nodeGeometry,
            nodeMaterial
        );

    coreGroup.add(nodes);

    /* =====================================================
       10. ENERGY STREAKS
    ===================================================== */

    function createStreaks(count) {
        const data = [];

        for (let i = 0; i < count; i++) {
            const a = Math.random() * Math.PI * 2;
            const r = 1.0 + Math.random() * 1.0;
            const h = (Math.random() - 0.5) * 2.2;

            const x1 = Math.cos(a) * r;
            const z1 = Math.sin(a) * r;

            const len =
                0.10 +
                Math.random() * 0.38;

            const x2 =
                Math.cos(a + len) *
                (r + Math.random() * 0.22);

            const z2 =
                Math.sin(a + len) *
                (r + Math.random() * 0.22);

            data.push(
                x1, h, z1,
                x2, h + (Math.random() - 0.5) * 0.18, z2
            );
        }

        const geometry =
            new THREE.BufferGeometry();

        geometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(
                data,
                3
            )
        );

        const material =
            new THREE.LineBasicMaterial({
                color: 0xffd66a,
                transparent: true,
                opacity: 0.52,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });

        return new THREE.LineSegments(
            geometry,
            material
        );
    }

    const streaks = createStreaks(
        window.innerWidth < 700 ? 90 : 180
    );

    coreGroup.add(streaks);

    /* =====================================================
       11. HALO PLANES — GLOW EXTRA
    ===================================================== */

    const haloMaterial =
        new THREE.SpriteMaterial({
            color: 0xffa600,
            transparent: true,
            opacity: 0.11,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

    const halo =
        new THREE.Sprite(haloMaterial);

    halo.scale.set(3.8, 3.8, 1);
    halo.position.z = -0.35;

    coreGroup.add(halo);

    /* =====================================================
       12. CURSOR / INTERACCIÓN
    ===================================================== */

    const pointer = new THREE.Vector2(0, 0);
    const targetRotation = new THREE.Vector2(0, 0);

    window.addEventListener(
        "pointermove",
        (event) => {
            targetRotation.x =
                (event.clientX / window.innerWidth) * 2 - 1;

            targetRotation.y =
                -(event.clientY / window.innerHeight) * 2 + 1;

            coreMaterial.uniforms.uPointer.value.lerp(
                targetRotation,
                0.08
            );
        },
        { passive: true }
    );

    /* =====================================================
       13. RESIZE
    ===================================================== */

    function resize() {
        const rect =
            canvas.getBoundingClientRect();

        const width =
            Math.max(rect.width, 1);

        const height =
            Math.max(rect.height, 1);

        camera.aspect =
            width / height;

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

    /* =====================================================
       14. ANIMACIÓN
    ===================================================== */

    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const time =
            clock.getElapsedTime();

        coreMaterial.uniforms.uTime.value =
            time;

        /* ---------------------------------------------
           RESPIRACIÓN DEL NÚCLEO
        --------------------------------------------- */

        const pulse =
            1.0 +
            Math.sin(time * 1.7) * 0.025 +
            Math.sin(time * 3.1) * 0.008;

        coreMesh.scale.setScalar(pulse);

        innerCore.scale.setScalar(
            1.0 +
            Math.sin(time * 2.6) * 0.08
        );

        innerMaterial.opacity =
            0.26 +
            Math.sin(time * 2.2) * 0.08;

        /* ---------------------------------------------
           MOVIMIENTO ORGÁNICO
        --------------------------------------------- */

        coreGroup.rotation.y =
            Math.sin(time * 0.16) *
            0.035 +
            targetRotation.x *
            0.055;

        coreGroup.rotation.x =
            Math.sin(time * 0.13) *
            0.025 +
            targetRotation.y *
            0.035;

        particleCloud.rotation.y =
            time * 0.055;

        particleCloud.rotation.z =
            Math.sin(time * 0.21) *
            0.035;

        circuitsA.rotation.y =
            time * 0.055;

        circuitsA.rotation.z =
            Math.sin(time * 0.35) * 0.03;

        circuitsB.rotation.x =
            time * 0.041;

        circuitsB.rotation.y =
            -time * 0.065;

        circuitsC.rotation.z =
            time * 0.032;

        nodes.rotation.y =
            -time * 0.045;

        nodes.rotation.x =
            Math.sin(time * 0.17) * 0.025;

        streaks.rotation.y =
            time * 0.11;

        streaks.rotation.x =
            Math.sin(time * 0.27) * 0.035;

        orbitA.rotation.z =
            time * orbitA.userData.speed;

        orbitB.rotation.y =
            time * orbitB.userData.speed;

        orbitC.rotation.x =
            time * orbitC.userData.speed;

        halo.material.opacity =
            0.085 +
            Math.sin(time * 1.6) * 0.025;

        /* ---------------------------------------------
           PARTICULAS — PROFUNDIDAD REAL
        --------------------------------------------- */

        const array =
            particleGeometry.attributes
                .position.array;

        for (let i = 0; i < particleCount; i++) {
            const d = particleData[i];

            const t =
                time * d.speed +
                d.phase;

            const theta =
                d.theta +
                t * 0.32;

            const phi =
                d.phi +
                Math.sin(t * 0.74) *
                d.wobble;

            const radius =
                d.radius +
                Math.sin(t * 1.35) *
                0.055;

            array[i * 3] =
                Math.sin(phi) *
                Math.cos(theta) *
                radius;

            array[i * 3 + 1] =
                Math.sin(phi) *
                Math.sin(theta) *
                radius *
                0.90;

            array[i * 3 + 2] =
                Math.cos(phi) *
                radius *
                0.86;
        }

        particleGeometry.attributes
            .position.needsUpdate = true;

        /* ---------------------------------------------
           BLOOM DINÁMICO
        --------------------------------------------- */

        bloomPass.strength =
            1.48 +
            Math.sin(time * 1.35) * 0.16;

        composer.render();
    }

    canvas.classList.add("jarvis-3d-ready");

    animate();

    console.log(
        "[JARVIS 3D] Holographic Cognitive Core: ONLINE"
    );
})();
