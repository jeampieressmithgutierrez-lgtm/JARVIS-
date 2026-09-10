/* =====================================================
   J.A.R.V.I.S. — INTRO DE INICIALIZACIÓN
   No modifica el sistema de chat.
===================================================== */

(function () {

    const intro = document.getElementById("jarvis-intro");

    if (!intro) return;

    /*
     * Secuencia:
     *
     * 0.000s → aparece J.A.R.V.I.S.
     * 2.600s → la J comienza a absorber las letras
     * 4.100s → queda solamente la J
     * 4.800s → desaparece la J
     * 5.500s → aparece la página principal
     */

    window.addEventListener("load", () => {

        setTimeout(() => {
            intro.classList.add("consume");
        }, 2600);

        setTimeout(() => {
            intro.classList.add("finish");
        }, 4100);

        setTimeout(() => {
            intro.classList.add("hidden");

            setTimeout(() => {
                intro.remove();
            }, 1000);

        }, 5000);

    });

})();
