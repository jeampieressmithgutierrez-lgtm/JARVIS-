/* =========================================================
   J.A.R.V.I.S. — REAL 3D IDENTITY
========================================================= */

.jarvis-3d-brand {
    position: relative;
    width: min(360px, 32vw);
    height: 76px;
    display: flex;
    align-items: center;
    justify-content: center;
}

#jarvis3d-stage {
    position: absolute;
    inset: 0;

    width: 100%;
    height: 100%;

    overflow: hidden;

    pointer-events: auto;
}

.jarvis3d-canvas {
    display: block;

    width: 100%;
    height: 100%;

    cursor: default;
}

.jarvis3d-accessibility {
    position: absolute;

    width: 1px;
    height: 1px;

    overflow: hidden;

    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
}

.jarvis3d-fallback {
    position: absolute;
    inset: 0;

    display: flex;
    flex-direction: column;

    align-items: center;
    justify-content: center;

    gap: 4px;

    pointer-events: none;
}

.jarvis3d-fallback strong {
    color: #b91d1d;

    font-family: "Orbitron", sans-serif;
    font-size: 23px;
    font-weight: 800;

    letter-spacing: 3px;

    text-shadow:
        1px 1px 0 #ffb400,
        2px 2px 0 #5b1115,
        0 0 14px rgba(255, 180, 0, 0.25);
}

.jarvis3d-fallback span {
    color: #858b94;

    font-family: "Share Tech Mono", monospace;
    font-size: 8px;

    letter-spacing: 2px;
}


/* =========================================================
   DETALLES DE PROFUNDIDAD DEL HEADER
========================================================= */

#topbar {
    perspective: 900px;
    transform-style: preserve-3d;
}

.top-brand {
    transform-style: preserve-3d;
}

.jarvis-3d-brand::before {
    content: "";

    position: absolute;

    left: 8%;
    right: 8%;
    bottom: 5px;

    height: 1px;

    background:
        linear-gradient(
            90deg,
            transparent,
            rgba(255, 180, 0, 0.55),
            transparent
        );

    opacity: 0.45;

    filter: blur(0.4px);

    pointer-events: none;
}

.jarvis-3d-brand::after {
    content: "";

    position: absolute;

    width: 110px;
    height: 30px;

    left: 50%;
    top: 50%;

    transform:
        translate(-50%, -50%);

    background:
        radial-gradient(
            ellipse,
            rgba(255, 180, 0, 0.10),
            transparent 70%
        );

    filter: blur(10px);

    pointer-events: none;

    z-index: -1;
}


/* =========================================================
   REDUCIR MOVIMIENTO
========================================================= */

@media (prefers-reduced-motion: reduce) {

    .jarvis3d-canvas {
        opacity: 0.92;
    }
}


/* =========================================================
   MÓVIL
========================================================= */

@media (max-width: 700px) {

    .jarvis-3d-brand {
        width: 220px;
        height: 70px;
    }

}

@media (max-width: 480px) {

    .jarvis-3d-brand {
        width: 175px;
        height: 64px;
    }

}
