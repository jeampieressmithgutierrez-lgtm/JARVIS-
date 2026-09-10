/* ============================================================
   J.A.R.V.I.S. — CORE SYSTEM
============================================================ */

(function () {
    "use strict";

    function actualizarReloj() {
        const clock = document.getElementById("clock");
        if (!clock) return;

        const ahora = new Date();

        const horas = String(ahora.getHours()).padStart(2, "0");
        const minutos = String(ahora.getMinutes()).padStart(2, "0");
        const segundos = String(ahora.getSeconds()).padStart(2, "0");

        clock.textContent = `${horas}:${minutos}:${segundos}`;
    }

    actualizarReloj();

    setInterval(actualizarReloj, 1000);
})();
