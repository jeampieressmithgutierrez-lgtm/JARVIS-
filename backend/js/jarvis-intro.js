/* ============================================================
   J.A.R.V.I.S. — CINEMATIC INTRO CONTROLLER
   Stark Industries / Cognitive System
============================================================ */

(function () {

    "use strict";


    /* ========================================================
       CONFIGURACIÓN
    ======================================================== */

    const INTRO_DURATION = 7600;

    const intro = document.getElementById("jarvis-intro");

    if (!intro) {
        return;
    }


    const logo = intro.querySelector(".intro-logo");

    const jarvisJ = intro.querySelector(".intro-j");

    const letters = Array.from(
        intro.querySelectorAll(".intro-letter:not(.intro-j)")
    );


    if (!logo || !jarvisJ) {
        return;
    }


    /* ========================================================
       PREPARACIÓN
    ======================================================== */

    document.body.classList.add("jarvis-intro-active");


    /*
       El resto de las letras comienza ligeramente
       atenuado para dar sensación holográfica.
    */

    letters.forEach((letter) => {

        letter.classList.add("intro-dimmed");

    });


    /* ========================================================
       UTILIDADES
    ======================================================== */

    function wait(ms) {

        return new Promise((resolve) => {

            setTimeout(resolve, ms);

        });

    }


    function centerOf(element) {

        const rect = element.getBoundingClientRect();

        const parentRect = logo.getBoundingClientRect();

        return {

            x:
                rect.left +
                rect.width / 2 -
                parentRect.left,

            y:
                rect.top +
                rect.height / 2 -
                parentRect.top

        };

    }


    function setJPosition(x, y) {

        const parentRect = logo.getBoundingClientRect();

        const jRect = jarvisJ.getBoundingClientRect();

        const jWidth = jRect.width;

        const jHeight = jRect.height;


        jarvisJ.style.left =
            `${x - jWidth / 2}px`;

        jarvisJ.style.top =
            `${y - jHeight / 2}px`;

    }


    /* ========================================================
       POSICIÓN INICIAL DE LA J
    ======================================================== */

    function prepareJ() {

        const position = centerOf(
            logo.querySelector(".intro-j-space")
        );


        setJPosition(
            position.x,
            position.y
        );


        /*
           La J comienza prácticamente integrada
           con el logo original.
        */

        jarvisJ.style.transform =
            "translateZ(120px) scale(1)";

    }


    /* ========================================================
       ANIMACIÓN DE ENTRADA
    ======================================================== */

    async function introStart() {

        await wait(350);


        /*
           Revelamos progresivamente
           el subtítulo.
        */

        intro.classList.add(
            "intro-subtitle-visible"
        );


        await wait(700);


        /*
           La J adquiere protagonismo.
        */

        intro.classList.add(
            "intro-hunting"
        );


        await wait(850);


        /*
           Calculamos nuevamente las posiciones.
           Esto permite que funcione en diferentes
           tamaños de pantalla.
        */

        const targets = letters.map((letter) => {

            return {

                element: letter,

                position: centerOf(letter)

            };

        });


        /* ====================================================
           LA J COMIENZA A ATRAVESAR EL LOGO
        ==================================================== */

        for (let i = 0; i < targets.length; i++) {

            const target = targets[i];

            const element = target.element;

            const position = target.position;


            /*
               La J aumenta ligeramente antes
               de atacar cada letra.
            */

            jarvisJ.style.transition =
                "left .55s cubic-bezier(.22,1,.36,1), " +
                "top .55s cubic-bezier(.22,1,.36,1), " +
                "transform .55s cubic-bezier(.22,1,.36,1)";


            jarvisJ.style.transform =
                "translateZ(220px) scale(1.45)";


            /*
               Movimiento hacia la letra.
            */

            setJPosition(
                position.x,
                position.y
            );


            await wait(430);


            /*
               Impacto energético.
            */

            element.classList.remove(
                "intro-dimmed"
            );


            element.classList.add(
                "intro-hit"
            );


            await wait(120);


            /*
               La letra desaparece.
            */

            element.classList.add(
                "intro-eaten"
            );


            await wait(180);

        }


        /* ====================================================
           J SOLA
        ==================================================== */

        await wait(350);


        intro.classList.remove(
            "intro-hunting"
        );


        intro.classList.add(
            "intro-j-alone"
        );


        /*
           Recentramos la J.
        */

        const logoRect =
            logo.getBoundingClientRect();


        const centerX =
            logoRect.width / 2;


        const centerY =
            logoRect.height / 2;


        jarvisJ.style.transition =
            "left .9s cubic-bezier(.22,1,.36,1), " +
            "top .9s cubic-bezier(.22,1,.36,1), " +
            "transform .9s cubic-bezier(.22,1,.36,1)";


        setJPosition(
            centerX,
            centerY
        );


        await wait(1500);


        /* ====================================================
           J SE PREPARA PARA IR A LA ESQUINA
        ==================================================== */

        intro.classList.add(
            "intro-moving-home"
        );


        await wait(250);


        /*
           Posición final aproximada.
           Se calcula en relación con la pantalla.
        */

        const finalX =
            Math.max(
                55,
                window.innerWidth * 0.055
            );


        const finalY =
            Math.max(
                42,
                window.innerHeight * 0.055
            );


        /*
           Movemos la J desde el centro
           hacia la esquina superior izquierda.
        */

        jarvisJ.style.transition =
            "left 1.15s cubic-bezier(.16,1,.3,1), " +
            "top 1.15s cubic-bezier(.16,1,.3,1), " +
            "transform 1.15s cubic-bezier(.16,1,.3,1), " +
            "filter 1.15s ease";


        /*
           Como la J pertenece al logo,
           calculamos su posición relativa.
        */

        const currentParentRect =
            logo.getBoundingClientRect();


        const targetX =
            finalX -
            currentParentRect.left;


        const targetY =
            finalY -
            currentParentRect.top;


        setJPosition(
            targetX,
            targetY
        );


        jarvisJ.style.transform =
            "translateZ(100px) scale(.28)";


        await wait(1150);


        /* ====================================================
           REVELACIÓN DE LA INTERFAZ
        ==================================================== */

        intro.classList.add(
            "intro-finished"
        );


        await wait(950);


        /*
           Liberamos el scroll.
           Desde aquí J.A.R.V.I.S. vuelve a funcionar
           normalmente.
        */

        document.body.classList.remove(
            "jarvis-intro-active"
        );


        /*
           Limpiamos estilos temporales
           para evitar interferencias posteriores.
        */

        jarvisJ.style.left = "";
        jarvisJ.style.top = "";
        jarvisJ.style.transform = "";
        jarvisJ.style.transition = "";


    }


    /* ========================================================
       MODO REDUCIDO DE MOVIMIENTO
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
       INICIO
    ======================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            () => {

                prepareJ();

                introStart();

            },
            {
                once: true
            }
        );

    } else {

        prepareJ();

        introStart();

    }


})();
