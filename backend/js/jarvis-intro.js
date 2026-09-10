/* ============================================================
   J.A.R.V.I.S. — CINEMATIC INTRO CONTROLLER
   Stark Industries / Cognitive System

   IMPORTANTE:
   Este archivo SOLO controla la intro.
   No toca chat.js, api.js, memoria ni backend.
============================================================ */

(function () {

    "use strict";

    const intro = document.getElementById("jarvis-intro");

    if (!intro) return;


    const logo = intro.querySelector(".intro-logo");

    const jarvisJ = intro.querySelector(".intro-j");

    const jSpace = intro.querySelector(".intro-j-space");

    const letters = Array.from(
        intro.querySelectorAll(
            ".intro-letter:not(.intro-j)"
        )
    );


    if (!logo || !jarvisJ || !jSpace) return;


    document.body.classList.add(
        "jarvis-intro-active"
    );


    /* ========================================================
       UTILIDADES
    ======================================================== */

    const wait = (ms) =>
        new Promise(resolve =>
            setTimeout(resolve, ms)
        );


    function centerOf(element) {

        const rect =
            element.getBoundingClientRect();

        const parent =
            logo.getBoundingClientRect();

        return {

            x:
                rect.left +
                rect.width / 2 -
                parent.left,

            y:
                rect.top +
                rect.height / 2 -
                parent.top

        };

    }


    function moveJ(x, y) {

        const rect =
            jarvisJ.getBoundingClientRect();

        const parent =
            logo.getBoundingClientRect();

        const width = rect.width;

        const height = rect.height;


        jarvisJ.style.left =
            `${x - width / 2}px`;

        jarvisJ.style.top =
            `${y - height / 2}px`;

    }


    /* ========================================================
       PREPARAR ESCENA
    ======================================================== */

    function prepareScene() {

        letters.forEach(letter => {

            letter.classList.add(
                "intro-dimmed"
            );

        });


        const start =
            centerOf(jSpace);


        moveJ(
            start.x,
            start.y
        );


        jarvisJ.style.transform =
            "translateZ(120px) scale(1)";

    }


    /* ========================================================
       ANIMACIÓN PRINCIPAL
    ======================================================== */

    async function startIntro() {

        /* -----------------------------------------------
           ENTRADA
        ------------------------------------------------ */

        await wait(450);


        intro.classList.add(
            "intro-subtitle-visible"
        );


        await wait(850);


        /* -----------------------------------------------
           J COBRA ENERGÍA
        ------------------------------------------------ */

        intro.classList.add(
            "intro-hunting"
        );


        await wait(600);


        /* -----------------------------------------------
           J RECORRE LAS LETRAS
        ------------------------------------------------ */

        const targets =
            letters.map(letter => ({

                element: letter,

                position: centerOf(letter)

            }));


        for (const target of targets) {

            const element =
                target.element;

            const position =
                target.position;


            jarvisJ.style.transition =
                "left .52s cubic-bezier(.16,1,.3,1), " +
                "top .52s cubic-bezier(.16,1,.3,1), " +
                "transform .52s cubic-bezier(.16,1,.3,1)";


            /* J aumenta antes del impacto */

            jarvisJ.style.transform =
                "translateZ(300px) scale(1.5)";


            moveJ(
                position.x,
                position.y
            );


            await wait(390);


            /* -------------------------------------------
               IMPACTO
            ------------------------------------------- */

            element.classList.remove(
                "intro-dimmed"
            );


            element.classList.add(
                "intro-hit"
            );


            await wait(100);


            element.classList.add(
                "intro-eaten"
            );


            await wait(130);

        }


        /* -----------------------------------------------
           LIMPIEZA
        ------------------------------------------------ */

        await wait(400);


        intro.classList.remove(
            "intro-hunting"
        );


        intro.classList.add(
            "intro-j-alone"
        );


        /* -----------------------------------------------
           J AL CENTRO
        ------------------------------------------------ */

        const logoRect =
            logo.getBoundingClientRect();


        const centerX =
            logoRect.width / 2;


        const centerY =
            logoRect.height / 2;


        jarvisJ.style.transition =
            "left .9s cubic-bezier(.16,1,.3,1), " +
            "top .9s cubic-bezier(.16,1,.3,1), " +
            "transform .9s cubic-bezier(.16,1,.3,1)";


        moveJ(
            centerX,
            centerY
        );


        jarvisJ.style.transform =
            "translateZ(280px) scale(1.7)";


        await wait(1500);


        /* -----------------------------------------------
           PREPARAR MOVIMIENTO A LA ESQUINA
        ------------------------------------------------ */

        intro.classList.add(
            "intro-moving-home"
        );


        await wait(250);


        /*
           Calculamos una posición relativa al logo,
           pero usamos coordenadas de viewport para que
           el movimiento sea consistente.
        */

        const logoNow =
            logo.getBoundingClientRect();


        const desiredX =
            Math.max(
                55,
                window.innerWidth * 0.055
            );


        const desiredY =
            Math.max(
                42,
                window.innerHeight * 0.055
            );


        const targetX =
            desiredX -
            logoNow.left;


        const targetY =
            desiredY -
            logoNow.top;


        jarvisJ.style.transition =
            "left 1.15s cubic-bezier(.16,1,.3,1), " +
            "top 1.15s cubic-bezier(.16,1,.3,1), " +
            "transform 1.15s cubic-bezier(.16,1,.3,1), " +
            "filter 1.15s ease";


        moveJ(
            targetX,
            targetY
        );


        jarvisJ.style.transform =
            "translateZ(100px) scale(.28)";


        await wait(1150);


        /* -----------------------------------------------
           DESVANECER INTRO
        ------------------------------------------------ */

        intro.classList.add(
            "intro-finished"
        );


        await wait(950);


        document.body.classList.remove(
            "jarvis-intro-active"
        );


        /* -----------------------------------------------
           LIMPIEZA DE ESTILOS INLINE
        ------------------------------------------------ */

        jarvisJ.style.left = "";

        jarvisJ.style.top = "";

        jarvisJ.style.transform = "";

        jarvisJ.style.transition = "";

    }


    /* ========================================================
       REDUCED MOTION
    ======================================================== */

    const reducedMotion =
        window.matchMedia &&
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    if (reducedMotion) {

        intro.classList.add(
            "intro-finished"
        );

        document.body.classList.remove(
            "jarvis-intro-active"
        );

        return;

    }


    /* ========================================================
       INICIAR CUANDO EL DOM ESTÉ LISTO
    ======================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            () => {

                prepareScene();

                startIntro();

            },
            {
                once: true
            }
        );

    } else {

        prepareScene();

        startIntro();

    }

})();
