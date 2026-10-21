
"use strict";

import * as THREE from "three";

/* =========================================================
   J.A.R.V.I.S. — HOLOGRAPHIC COGNITIVE CORE
   Three.js | Fondo transparente | Adaptable a móvil
========================================================= */

const canvas = document.getElementById("jarvis-3d-canvas");

if (!canvas) {
    console.error("[J.A.R.V.I.S. 3D] No se encontró #jarvis-3d-canvas.");
} else {
    initializeJarvisCore(canvas);
}

function initializeJarvisCore(canvas) {
    // Evitar inicializaciones duplicadas.
    if (canvas.dataset.jarvisInitialized === "true") return;
    canvas.dataset.jarvisInitialized = "true";

    const stage = document.getElementById("jarvis-core-stage") || canvas.parentElement;

    let renderer;
    let animationFrame = 0;
    let resizeObserver = null;
    let disposed = false;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 8.5);
    camera.lookAt(0, 0, 0);

    const clock = new THREE.Clock();
    const root = new THREE.Group();
    scene.add(root);

    const coreGroup = new THREE.Group();
    root.add(coreGroup);

    const orbitGroup = new THREE.Group();
    root.add(orbitGroup);

    const particleGroup = new THREE.Group();
    root.add(particleGroup);

    const materials = [];
    const geometries = [];

    const GOLD = 0xffbd32;
    const AMBER = 0xff7a18;
    const PALE_GOLD = 0xffe4a0;
    const CYAN = 0x53dfff;

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    try {
        renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true,
            powerPreference: "high-performance",
            depth: true,
            stencil: false
        });

        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
        renderer.setClearColor(0x000000, 0);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.15;

        // El CSS mantiene el canvas en el fondo; Three.js no captura clics.
        canvas.style.background = "transparent";
        canvas.style.pointerEvents = "none";
        canvas.style.display = "block";
    } catch (error) {
        console.error("[J.A.R.V.I.S. 3D] No se pudo iniciar WebGL:", error);
        canvas.dataset.jarvisInitialized = "false";
        return;
    }

    /* ---------------- ILUMINACIÓN ---------------- */

    scene.add(new THREE.AmbientLight(0xffc56b, 1.15));

    const keyLight = new THREE.PointLight(GOLD, 32, 18);
    keyLight.position.set(2.5, 2.4, 3.2);
    scene.add(keyLight);

    const warmLight = new THREE.PointLight(AMBER, 23, 13);
    warmLight.position.set(-2.8, -1.3, 1.6);
    scene.add(warmLight);

    const rimLight = new THREE.PointLight(CYAN, 9, 12);
    rimLight.position.set(0.2, 2.4, -2.5);
    scene.add(rimLight);

    /* ---------------- MATERIAL CENTRAL ---------------- */

    const innerGeometry = new THREE.IcosahedronGeometry(0.76, 4);
    geometries.push(innerGeometry);

    const innerMaterial = new THREE.MeshStandardMaterial({
        color: 0xff9b24,
        emissive: 0xff640a,
        emissiveIntensity: 1.55,
        metalness: 0.25,
        roughness: 0.28,
        transparent: true,
        opacity: 0.91
    });
    materials.push(innerMaterial);

    const innerCore = new THREE.Mesh(innerGeometry, innerMaterial);
    coreGroup.add(innerCore);

    // Esfera exterior de filamentos.
    const wireGeometry = new THREE.IcosahedronGeometry(1.03, 3);
    geometries.push(wireGeometry);

    const wireMaterial = new THREE.MeshBasicMaterial({
        color: GOLD,
        wireframe: true,
        transparent: true,
        opacity: 0.22,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    materials.push(wireMaterial);

    const wireCore = new THREE.Mesh(wireGeometry, wireMaterial);
    coreGroup.add(wireCore);

    // Superficie luminosa tipo holograma.
    const glowGeometry = new THREE.SphereGeometry(1.015, 48, 48);
    geometries.push(glowGeometry);

    const glowMaterial = new THREE.ShaderMaterial({
        uniforms: {
            glowColor: { value: new THREE.Color(0xffa52f) },
            glowIntensity: { value: 1.15 }
        },
        vertexShader: `
            varying vec3 vNormalView;
            varying vec3 vViewPosition;

            void main() {
                vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
                vNormalView = normalize(normalMatrix * normal);
                vViewPosition = -viewPosition.xyz;

                gl_Position = projectionMatrix * viewPosition;
            }
        `,
        fragmentShader: `
            uniform vec3 glowColor;
            uniform float glowIntensity;

            varying vec3 vNormalView;
            varying vec3 vViewPosition;

            void main() {
                vec3 normal = normalize(vNormalView);
                vec3 viewDirection = normalize(vViewPosition);

                float fresnel = pow(
                    1.0 - max(dot(normal, viewDirection), 0.0),
                    2.1
                );

                float centerLight = pow(
                    max(dot(normal, viewDirection), 0.0),
                    5.0
                );

                float alpha = fresnel * 0.47 + centerLight * 0.12;

                gl_FragColor = vec4(
                    glowColor * (fresnel + centerLight) * glowIntensity,
                    alpha
                );
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.FrontSide
    });
    materials.push(glowMaterial);

    const glowSphere = new THREE.Mesh(glowGeometry, glowMaterial);
    coreGroup.add(glowSphere);

    // Pequeño reactor luminoso central.
    const reactorGeometry = new THREE.SphereGeometry(0.28, 32, 32);
    geometries.push(reactorGeometry);

    const reactorMaterial = new THREE.MeshBasicMaterial({
        color: PALE_GOLD,
        transparent: true,
        opacity: 0.94
    });
    materials.push(reactorMaterial);

    const reactor = new THREE.Mesh(reactorGeometry, reactorMaterial);
    coreGroup.add(reactor);

    /* ---------------- ANILLOS ORBITALES ---------------- */

    function createRing(radius, tube, color, opacity, rotation) {
        const geometry = new THREE.TorusGeometry(radius, tube, 8, 160);
        geometries.push(geometry);

        const material = new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            opacity,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        materials.push(material);

        const ring = new THREE.Mesh(geometry, material);
        ring.rotation.set(rotation.x, rotation.y, rotation.z);
        orbitGroup.add(ring);

        return ring;
    }

    const ringA = createRing(
        1.42, 0.009, GOLD, 0.74,
        { x: 1.05, y: 0.22, z: 0.12 }
    );

    const ringB = createRing(
        1.63, 0.006, PALE_GOLD, 0.47,
        { x: 0.48, y: 1.1, z: 0.52 }
    );

    const ringC = createRing(
        1.83, 0.004, AMBER, 0.35,
        { x: 1.42, y: 0.15, z: -0.36 }
    );

    const ringD = createRing(
        1.23, 0.004, CYAN, 0.23,
        { x: 0.3, y: 0.7, z: 1.08 }
    );

    // Marcas cortas alrededor de una órbita.
    const tickGroup = new THREE.Group();
    orbitGroup.add(tickGroup);

    const tickMaterial = new THREE.LineBasicMaterial({
        color: PALE_GOLD,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending
    });
    materials.push(tickMaterial);

    for (let i = 0; i < 72; i++) {
        const angle = (i / 72) * Math.PI * 2;
        const major = i % 6 === 0;
        const r1 = major ? 1.88 : 1.91;
        const r2 = major ? 2.02 : 1.96;

        const points = [
            new THREE.Vector3(Math.cos(angle) * r1, Math.sin(angle) * r1, 0),
            new THREE.Vector3(Math.cos(angle) * r2, Math.sin(angle) * r2, 0)
        ];

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        geometries.push(geometry);

        const tick = new THREE.Line(geometry, tickMaterial);
        tickGroup.add(tick);
    }

    /* ---------------- PARTÍCULAS ---------------- */

    function createParticleField(count, spread, size, color, opacity) {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        const baseColor = new THREE.Color(color);

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            // Distribución volumétrica alrededor del núcleo.
            const angle = Math.random() * Math.PI * 2;
            const radius = 0.9 + Math.random() * spread;
            const height = (Math.random() - 0.5) * spread * 1.6;

            positions[i3] = Math.cos(angle) * radius;
            positions[i3 + 1] = height;
            positions[i3 + 2] = Math.sin(angle) * radius;

            const variation = 0.65 + Math.random() * 0.7;
            colors[i3] = baseColor.r * variation;
            colors[i3 + 1] = baseColor.g * variation;
            colors[i3 + 2] = baseColor.b * variation;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
            "position",
            new THREE.BufferAttribute(positions, 3)
        );
        geometry.setAttribute(
            "color",
            new THREE.BufferAttribute(colors, 3)
        );
        geometries.push(geometry);

        const material = new THREE.PointsMaterial({
            size,
            vertexColors: true,
            transparent: true,
            opacity,
            sizeAttenuation: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        materials.push(material);

        const points = new THREE.Points(geometry, material);
        particleGroup.add(points);

        return points;
    }

    const particlesGold = createParticleField(
        850, 2.8, 0.026, GOLD, 0.8
    );

    const particlesPale = createParticleField(
        300, 3.3, 0.017, PALE_GOLD, 0.58
    );

    const particlesCyan = createParticleField(
        100, 2.6, 0.015, CYAN, 0.35
    );

    /* ---------------- ARCOS ELECTRÓNICOS ---------------- */

    const circuitGroup = new THREE.Group();
    root.add(circuitGroup);

    const circuitMaterial = new THREE.LineBasicMaterial({
        color: GOLD,
        transparent: true,
        opacity: 0.25,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    materials.push(circuitMaterial);

    for (let i = 0; i < 18; i++) {
        const angle = (i / 18) * Math.PI * 2;
        const radius = 2.05 + Math.random() * 0.35;
        const direction = Math.random() > 0.5 ? 1 : -1;

        const p1 = new THREE.Vector3(
            Math.cos(angle) * 1.55,
            Math.sin(angle) * 1.55,
            (Math.random() - 0.5) * 0.3
        );

        const p2 = new THREE.Vector3(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius,
            (Math.random() - 0.5) * 0.3
        );

        const p3 = new THREE.Vector3(
            Math.cos(angle + direction * 0.12) * radius,
            Math.sin(angle + direction * 0.12) * radius,
            p2.z
        );

        const geometry = new THREE.BufferGeometry().setFromPoints([
            p1, p2, p3
        ]);
        geometries.push(geometry);

        circuitGroup.add(new THREE.Line(geometry, circuitMaterial));
    }

    /* ---------------- TAMAÑO Y RESPONSIVE ---------------- */

    function resize() {
        if (disposed || !renderer) return;

        const rect = stage.getBoundingClientRect();
        const width = Math.max(1, Math.floor(rect.width));
        const height = Math.max(1, Math.floor(rect.height));

        renderer.setSize(width, height, false);

        camera.aspect = width / height;
        camera.position.z = width < 500 ? 9.5 : width < 850 ? 9 : 8.5;
        camera.updateProjectionMatrix();

        // Mantener el núcleo proporcionado en el área de conversación.
        const scale = width < 480 ? 0.72 : width < 800 ? 0.84 : 1;
        root.scale.setScalar(scale);

        root.position.y = width < 480 ? 0.3 : 0.12;
    }

    if ("ResizeObserver" in window) {
        resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(stage);
    } else {
        window.addEventListener("resize", resize);
    }

    resize();

    /* ---------------- ANIMACIÓN ---------------- */

    function animate() {
        if (disposed) return;

        animationFrame = requestAnimationFrame(animate);

        const elapsed = clock.getElapsedTime();
        const motion = reducedMotion ? 0.12 : 1;

        coreGroup.rotation.y = elapsed * 0.16 * motion;
        coreGroup.rotation.x = Math.sin(elapsed * 0.32) * 0.08 * motion;

        innerCore.rotation.y = -elapsed * 0.12 * motion;
        innerCore.rotation.x = elapsed * 0.08 * motion;

        orbitGroup.rotation.y = elapsed * 0.055 * motion;
        orbitGroup.rotation.x = Math.sin(elapsed * 0.18) * 0.06 * motion;

        ringA.rotation.z += 0.0009 * motion;
        ringB.rotation.x += 0.0005 * motion;
        ringC.rotation.y -= 0.0007 * motion;
        ringD.rotation.z -= 0.0008 * motion;

        tickGroup.rotation.z = -elapsed * 0.025 * motion;
        circuitGroup.rotation.z = elapsed * 0.018 * motion;

        particleGroup.rotation.y = elapsed * 0.018 * motion;
        particlesGold.rotation.x = Math.sin(elapsed * 0.15) * 0.04 * motion;
        particlesPale.rotation.z = elapsed * 0.012 * motion;
        particlesCyan.rotation.y = -elapsed * 0.025 * motion;

        const pulse = 0.9 + Math.sin(elapsed * 1.7) * 0.1;
        innerMaterial.emissiveIntensity = 1.25 + pulse * 0.4;
        glowMaterial.uniforms.glowIntensity.value = 0.95 + pulse * 0.25;
        reactor.scale.setScalar(0.92 + pulse * 0.1);

        keyLight.intensity = 28 + Math.sin(elapsed * 1.3) * 4;

        renderer.render(scene, camera);
    }

    animate();

    /* ---------------- LIMPIEZA SEGURA ---------------- */

    window.addEventListener("beforeunload", () => {
        disposed = true;
        cancelAnimationFrame(animationFrame);

        if (resizeObserver) {
            resizeObserver.disconnect();
        } else {
            window.removeEventListener("resize", resize);
        }

        geometries.forEach((geometry) => geometry.dispose());
        materials.forEach((material) => material.dispose());

        renderer.dispose();
    }, { once: true });

    console.log("[J.A.R.V.I.S. 3D] Núcleo holográfico iniciado correctamente.");
}
