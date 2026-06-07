// ============================================================================
// STARK PROTOCOLO: COORDINADOR CENTRAL DE SUBSISTEMAS OPERATIVOS
// Punto de Entrada Único y Seguro del Lado del Cliente (Frontend)
// ============================================================================

window.addEventListener('DOMContentLoaded', () => {
    console.log("[SISTEMA] Inicializando subsistemas modulares de J.A.R.V.I.S...");

    // Verificación e inicialización segura del Motor Gráfico 3D (Desarrollado en core.js)
    if (typeof initCore === 'function') {
        initCore();
        console.log("[OK] Núcleo Holográfico 3D enlazado con éxito.");
    } else {
        console.error("[CRITICAL] Fallo de enlace: initCore() no está definido en el flujo.");
    }
    
    // Verificación e inicialización del Módulo de Eventos del Chat (Desarrollado en chat.js)
    if (typeof initChat === 'function') {
        initChat();
        console.log("[OK] Gestor de Conversación Interactiva desplegado.");
    } else {
        console.error("[CRITICAL] Fallo de enlace: initChat() no está definido en el flujo.");
    }
});