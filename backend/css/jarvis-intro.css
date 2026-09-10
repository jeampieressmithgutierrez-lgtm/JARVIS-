/* ============================================================
   J.A.R.V.I.S. — CINEMATIC INTRO
   Stark Industries / Cognitive Interface
============================================================ */


/* ============================================================
   BLOQUEO TEMPORAL DE LA INTERFAZ
============================================================ */

body.jarvis-intro-active {
    overflow: hidden;
}


/* ============================================================
   CAPA PRINCIPAL
============================================================ */

#jarvis-intro {
    position: fixed;
    inset: 0;
    z-index: 999999;

    display: flex;
    align-items: center;
    justify-content: center;

    width: 100%;
    height: 100vh;

    overflow: hidden;

    background:
        radial-gradient(
            ellipse at center,
            rgba(10, 25, 48, 0.95) 0%,
            rgba(3, 8, 18, 0.98) 38%,
            #000 78%
        );

    color: #ffffff;

    opacity: 1;
    visibility: visible;

    perspective: 1400px;

    transition:
        opacity 1s cubic-bezier(.22,1,.36,1),
        visibility 1s linear;
}


/* ============================================================
   ESTADO FINAL — INTRO DESAPARECIENDO
============================================================ */

#jarvis-intro.intro-finished {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
}


/* ============================================================
   ATMÓSFERA CINEMATOGRÁFICA
============================================================ */

#jarvis-intro::before {
    content: "";

    position: absolute;
    inset: -30%;

    background:
        radial-gradient(
            circle at 50% 48%,
            rgba(80, 180, 255, 0.13),
            transparent 23%
        ),
        radial-gradient(
            circle at 50% 50%,
            rgba(0, 110, 255, 0.08),
            transparent 42%
        );

    filter: blur(25px);

    opacity: .9;

    pointer-events: none;
}


/* ============================================================
   VIÑETA
============================================================ */

#jarvis-intro::after {
    content: "";

    position: absolute;
    inset: 0;

    background:
        radial-gradient(
            ellipse at center,
            transparent 35%,
            rgba(0, 0, 0, .45) 70%,
            rgba(0, 0, 0, .92) 100%
        );

    pointer-events: none;
}


/* ============================================================
   CONTENEDOR CINEMÁTICO
============================================================ */

.intro-cinema {
    position: relative;

    z-index: 10;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    width: min(94vw, 1500px);

    transform-style: preserve-3d;

    text-align: center;

    transition:
        transform 1s cubic-bezier(.22,1,.36,1);
}


/* ============================================================
   LOGO
============================================================ */

.intro-logo {
    position: relative;

    display: flex;
    align-items: center;
    justify-content: center;

    min-height: 170px;

    white-space: nowrap;

    transform-style: preserve-3d;

    perspective: 1200px;

    user-select: none;

    transform:
        rotateX(9deg)
        rotateY(-5deg)
        translateZ(0);

    transition:
        transform .8s cubic-bezier(.22,1,.36,1);
}


/* ============================================================
   LETRAS
============================================================ */

.intro-letter,
.intro-j-space {
    position: relative;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    font-family: "Orbitron", sans-serif;

    font-size: clamp(55px, 9vw, 155px);

    font-weight: 800;

    line-height: .9;

    letter-spacing: clamp(2px, .7vw, 12px);

    transform-style: preserve-3d;

    will-change:
        transform,
        opacity,
        filter;
}


/* ============================================================
   ESPACIO RESERVADO PARA LA J
============================================================ */

.intro-j-space {
    width: auto;

    color: transparent;

    opacity: 0;

    pointer-events: none;
}


/* ============================================================
   LETRAS RESTANTES
============================================================ */

.intro-letter:not(.intro-j) {

    color: rgba(185, 225, 255, .82);

    background:
        linear-gradient(
            180deg,
            #ffffff 0%,
            #bde9ff 13%,
            #5dbaff 36%,
            #2475c7 62%,
            #123b70 84%,
            #06172d 100%
        );

    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;

    -webkit-text-stroke:
        1px rgba(115, 205, 255, .18);

    text-shadow:
        0 1px 0 rgba(255,255,255,.8),
        0 3px 0 rgba(37,104,170,.8),
        0 6px 0 rgba(10,45,82,.85),
        0 9px 0 rgba(2,20,40,.9),
        0 0 8px rgba(90,190,255,.65),
        0 0 25px rgba(0,140,255,.35),
        0 0 60px rgba(0,100,255,.16);

    filter:
        drop-shadow(0 8px 18px rgba(0,0,0,.8));

    transition:
        opacity .55s ease,
        transform .65s cubic-bezier(.22,1,.36,1),
        filter .65s ease;
}


/* ============================================================
   PUNTOS
============================================================ */

.intro-dot {
    font-size: clamp(35px, 5vw, 90px);

    margin-left: clamp(1px, .15vw, 4px);
    margin-right: clamp(1px, .15vw, 4px);

    opacity: .65 !important;

    text-shadow:
        0 0 8px rgba(90,190,255,.8),
        0 0 25px rgba(0,120,255,.5);
}


/* ============================================================
   J — LETRA PRINCIPAL
============================================================ */

.intro-j {
    position: absolute;

    z-index: 500;

    color: #ffffff;

    background:
        linear-gradient(
            180deg,
            #ffffff 0%,
            #e8f9ff 10%,
            #8ed8ff 25%,
            #3faeff 43%,
            #1168c2 63%,
            #063568 82%,
            #011326 100%
        );

    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;

    -webkit-text-stroke:
        1.5px rgba(190,235,255,.42);

    text-shadow:
        0 2px 0 #d7f4ff,
        0 5px 0 #4e9ed5,
        0 8px 0 #15598e,
        0 11px 0 #062b4d,
        0 14px 0 #011525,

        0 0 10px rgba(170,235,255,.95),
        0 0 28px rgba(50,180,255,.9),
        0 0 65px rgba(0,125,255,.65),
        0 0 120px rgba(0,90,255,.32);

    filter:
        drop-shadow(0 10px 15px rgba(0,0,0,.9));

    transform:
        translateZ(120px)
        scale(1);

    will-change:
        left,
        top,
        transform,
        filter;
}


/* ============================================================
   HALO DETRÁS DE LA J
============================================================ */

.intro-j::before {
    content: "";

    position: absolute;

    z-index: -2;

    width: 170%;
    height: 170%;

    left: -35%;
    top: -35%;

    border-radius: 50%;

    background:
        radial-gradient(
            circle,
            rgba(100,210,255,.28) 0%,
            rgba(0,130,255,.14) 28%,
            transparent 70%
        );

    filter: blur(25px);

    transform: translateZ(-30px);

    pointer-events: none;
}


/* ============================================================
   EXTRUSIÓN 3D VISUAL
============================================================ */

.intro-j::after {
    content: "J";

    position: absolute;

    z-index: -1;

    inset: 0;

    color: transparent;

    -webkit-text-stroke:
        1px rgba(20,105,175,.55);

    transform:
        translateZ(-35px)
        translateX(7px)
        translateY(8px);

    filter: blur(.2px);

    pointer-events: none;
}


/* ============================================================
   LETRA ATENUADA
============================================================ */

.intro-letter.intro-dimmed {
    opacity: .22;

    filter:
        blur(.7px)
        brightness(.55);

    transform:
        translateZ(-25px)
        scale(.94);
}


/* ============================================================
   LETRA CONSUMIDA POR LA J
============================================================ */

.intro-letter.intro-eaten {

    opacity: 0 !important;

    filter:
        blur(16px)
        brightness(2.8);

    transform:
        translateZ(-80px)
        scale(.25)
        rotateX(55deg);

    transition:
        opacity .42s ease,
        transform .65s cubic-bezier(.22,1,.36,1),
        filter .5s ease;
}


/* ============================================================
   DESTELLO AL SER ATRAVESADA
============================================================ */

.intro-letter.intro-hit {
    animation:
        introLetterHit .38s ease-out forwards;
}


@keyframes introLetterHit {

    0% {
        opacity: .9;
        filter:
            brightness(1)
            blur(0);
    }

    30% {
        opacity: 1;
        filter:
            brightness(3)
            blur(1px);
        transform:
            scale(1.08)
            translateZ(35px);
    }

    100% {
        opacity: 0;
        filter:
            brightness(3)
            blur(12px);
        transform:
            scale(.2)
            translateZ(-80px);
    }
}


/* ============================================================
   J EN MODO ACTIVO
============================================================ */

#jarvis-intro.intro-hunting .intro-j {

    filter:
        drop-shadow(0 12px 20px rgba(0,0,0,.95))
        drop-shadow(0 0 15px rgba(180,235,255,1))
        drop-shadow(0 0 45px rgba(0,150,255,.9))
        drop-shadow(0 0 100px rgba(0,90,255,.55));

    transform:
        translateZ(180px)
        scale(1.12);
}


/* ============================================================
   J SOLA EN EL CENTRO
============================================================ */

#jarvis-intro.intro-j-alone .intro-j {

    transform:
        translateZ(240px)
        scale(1.65);

    filter:
        drop-shadow(0 15px 20px rgba(0,0,0,1))
        drop-shadow(0 0 20px rgba(210,245,255,1))
        drop-shadow(0 0 55px rgba(30,180,255,1))
        drop-shadow(0 0 130px rgba(0,90,255,.75));
}


/* ============================================================
   ANILLO DE ENERGÍA
============================================================ */

#jarvis-intro.intro-j-alone::before {

    background:
        radial-gradient(
            circle,
            rgba(120,220,255,.22) 0%,
            rgba(0,150,255,.12) 17%,
            transparent 34%
        );

    animation:
        introCorePulse 1.8s ease-in-out infinite;
}


@keyframes introCorePulse {

    0%,
    100% {
        transform: scale(.8);
        opacity: .45;
    }

    50% {
        transform: scale(1.2);
        opacity: .9;
    }
}


/* ============================================================
   SUBTÍTULO
============================================================ */

.intro-subtitle {

    position: relative;

    margin-top: 12px;

    font-family: "Share Tech Mono", monospace;

    font-size: clamp(10px, 1.2vw, 16px);

    letter-spacing:
        clamp(4px, .8vw, 12px);

    color: rgba(190,225,245,.75);

    text-shadow:
        0 0 8px rgba(70,180,255,.5),
        0 0 20px rgba(0,100,255,.25);

    opacity: 0;

    transform:
        translateY(15px)
        translateZ(20px);

    transition:
        opacity 1s ease,
        transform 1s cubic-bezier(.22,1,.36,1);
}


/* ============================================================
   SUBTÍTULO ACTIVADO
============================================================ */

#jarvis-intro.intro-subtitle-visible .intro-subtitle {

    opacity: 1;

    transform:
        translateY(0)
        translateZ(20px);
}


/* ============================================================
   ESTADO INFERIOR
============================================================ */

.intro-status {

    display: flex;
    align-items: center;
    justify-content: center;

    gap: 9px;

    margin-top: 24px;

    font-family: "Share Tech Mono", monospace;

    font-size: 9px;

    letter-spacing: 3px;

    color: rgba(130,170,195,.55);

    opacity: 0;

    transform:
        translateY(10px);

    transition:
        opacity .8s ease,
        transform .8s ease;
}


#jarvis-intro.intro-subtitle-visible .intro-status {

    opacity: 1;

    transform:
        translateY(0);
}


/* ============================================================
   PUNTO DE ESTADO
============================================================ */

.intro-status-dot {

    width: 5px;
    height: 5px;

    border-radius: 50%;

    background: #62cfff;

    box-shadow:
        0 0 5px #62cfff,
        0 0 15px rgba(40,170,255,.9);

    animation:
        introStatusPulse 1.2s ease-in-out infinite;
}


@keyframes introStatusPulse {

    0%,
    100% {
        opacity: .35;
        transform: scale(.8);
    }

    50% {
        opacity: 1;
        transform: scale(1.25);
    }
}


/* ============================================================
   SEPARADOR
============================================================ */

.intro-status-separator {
    opacity: .35;
}


/* ============================================================
   LÍNEAS HOLOGRÁFICAS
============================================================ */

.intro-cinema::before,
.intro-cinema::after {

    content: "";

    position: absolute;

    left: 50%;

    width: min(70vw, 900px);

    height: 1px;

    background:
        linear-gradient(
            90deg,
            transparent,
            rgba(80,190,255,.08),
            rgba(150,230,255,.65),
            rgba(80,190,255,.08),
            transparent
        );

    transform:
        translateX(-50%)
        translateZ(-30px);

    box-shadow:
        0 0 12px rgba(0,140,255,.25);
}


.intro-cinema::before {
    top: 12%;
}


.intro-cinema::after {
    bottom: 12%;
}


/* ============================================================
   EFECTO DE ESCANEO
============================================================ */

#jarvis-intro .intro-logo::after {

    content: "";

    position: absolute;

    left: -15%;
    right: -15%;

    top: 50%;

    height: 2px;

    background:
        linear-gradient(
            90deg,
            transparent,
            rgba(130,220,255,.1),
            rgba(220,250,255,.9),
            rgba(130,220,255,.1),
            transparent
        );

    box-shadow:
        0 0 12px rgba(90,210,255,.8),
        0 0 30px rgba(0,130,255,.5);

    opacity: .45;

    transform:
        translateY(-50%)
        translateZ(200px);

    animation:
        introScan 3.2s ease-in-out infinite;

    pointer-events: none;
}


@keyframes introScan {

    0% {
        transform:
            translateY(-120px)
            translateZ(200px);
        opacity: 0;
    }

    20% {
        opacity: .7;
    }

    50% {
        opacity: .25;
    }

    80% {
        opacity: .7;
    }

    100% {
        transform:
            translateY(120px)
            translateZ(200px);
        opacity: 0;
    }
}


/* ============================================================
   FINAL — J SE DESPLAZA A LA ESQUINA
============================================================ */

#jarvis-intro.intro-moving-home .intro-j {

    transform:
        translateZ(100px)
        scale(.28);

    filter:
        drop-shadow(0 0 8px rgba(100,210,255,.8))
        drop-shadow(0 0 22px rgba(0,120,255,.5));
}


/* ============================================================
   REDUCCIÓN DE MOVIMIENTO
============================================================ */

@media (prefers-reduced-motion: reduce) {

    #jarvis-intro *,
    #jarvis-intro::before,
    #jarvis-intro::after {

        animation: none !important;

        transition-duration: .01ms !important;
    }

}


/* ============================================================
   TABLETS
============================================================ */

@media (max-width: 900px) {

    .intro-logo {
        min-height: 130px;

        transform:
            rotateX(6deg)
            rotateY(-3deg);
    }

    .intro-status {
        font-size: 8px;
        letter-spacing: 2px;
    }

}


/* ============================================================
   MÓVILES
============================================================ */

@media (max-width: 600px) {

    .intro-logo {
        min-height: 100px;

        transform:
            rotateX(4deg)
            rotateY(-2deg);
    }

    .intro-letter,
    .intro-j-space {
        font-size: clamp(38px, 11vw, 72px);

        letter-spacing: 2px;
    }

    .intro-dot {
        font-size: clamp(25px, 7vw, 48px);
    }

    .intro-subtitle {
        margin-top: 8px;

        font-size: 8px;

        letter-spacing: 3px;
    }

    .intro-status {
        margin-top: 16px;

        font-size: 7px;

        letter-spacing: 1.5px;

        gap: 5px;
    }

}


/* ============================================================
   PANTALLAS MUY PEQUEÑAS
============================================================ */

@media (max-width: 380px) {

    .intro-logo {
        min-height: 80px;
    }

    .intro-letter,
    .intro-j-space {
        font-size: 32px;
        letter-spacing: 1px;
    }

    .intro-dot {
        font-size: 22px;
    }

    .intro-status {
        font-size: 6px;
    }

}
