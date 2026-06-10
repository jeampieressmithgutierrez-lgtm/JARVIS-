/**
 * =========================================================================
 * STARK INDUSTRIES CORE LOGIC
 * SUBSISTEMA: GESTOR DE COMUNICACIONES TERMINAL INTERACTIVA
 * PROYECTO: J.A.R.V.I.S. AI LÓGICA MÓDULO
 * COMPLEJIDAD: +200 LÍNEAS BASADAS EN GESTIÓN DE EVENTOS DE ENTRADA Y SALIDA
 * =========================================================================
 */

class JarvisSystemController {
    constructor() {
        this.inputField = document.getElementById('terminal-command-input');
        this.sendButton = document.getElementById('submit-command-btn');
        this.chatStream = document.getElementById('chat-conversation-stream');
        this.systemStatusText = document.getElementById('system-status');
        
        this.initSystemListeners();
        this.triggerSystemWelcomeTrace();
    }

    initSystemListeners() {
        if (!this.inputField || !this.sendButton) return;

        // Captura de envío por pulsación de teclado Enter
        this.inputField.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                this.handleUserCommandTransmission();
            }
        });

        // Captura por clic físico en el botón de transmisión vectorial
        this.sendButton.addEventListener('click', () => {
            this.handleUserCommandTransmission();
        });
    }

    triggerSystemWelcomeTrace() {
        console.log("[JARVIS-CORE]: Vinculación neural establecida.");
        this.updateSystemHUDIndicator("OPERATIVO", "positive");
    }

    handleUserCommandTransmission() {
        const rawQuery = this.inputField.value;
        if (rawQuery.trim() === "") return;

        // Despliegue inmediato del mensaje del usuario en el HUD
        this.injectMessageToHUD("TÚ", rawQuery, "user");
        this.inputField.value = "";
        
        this.updateSystemHUDIndicator("PROCESANDO...", "neutral");

        // Simulación de latencia de red heurística para la respuesta de la IA
        setTimeout(() => {
            this.executeHeuristicAIAnalysis(rawQuery);
        }, 1000);
    }

    executeHeuristicAIAnalysis(query) {
        let responseText = "Comando no reconocido en la base de datos central Stark. Analizando vectores alternativos, Señor.";
        const clearQuery = query.toLowerCase();

        // Respuestas del Sistema Integrado
        if (clearQuery.includes('hola') || clearQuery.includes('buenos dias')) {
            responseText = "Hola de nuevo, Señor. Todos los sistemas del traje y los servidores en la nube están estables. ¿Desea ejecutar algún protocolo defensivo o de diagnóstico?";
        } else if (clearQuery.includes('status') || clearQuery.includes('estado')) {
            responseText = "El Reactor Arc reporta 100% de carga. La temperatura de los núcleos es de 32 grados Celsius. Todo en orden.";
        } else if (clearQuery.includes('limpia') || clearQuery.includes('clear')) {
            this.chatStream.innerHTML = "";
            responseText = "Consola de comunicación purgada con éxito, Señor.";
        }

        this.injectMessageToHUD("JARVIS", responseText, "jarvis");
        this.updateSystemHUDIndicator("ONLINE", "positive");
    }

    injectMessageToHUD(senderName, messageText, senderType) {
        if (!this.chatStream) return;

        const date = new Date();
        const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const bubbleContainer = document.createElement('div');
        bubbleContainer.className = `chat-bubble bubble-${senderType}`;

        const metaDiv = document.createElement('div');
        metaDiv.className = "bubble-meta";
        metaDiv.innerHTML = `${senderName} <span class="time-meta">${timeString}</span>`;

        const paragraphText = document.createElement('p');
        paragraphText.className = "bubble-text";
        paragraphText.innerText = messageText;

        bubbleContainer.appendChild(metaDiv);
        bubbleContainer.appendChild(paragraphText);
        
        this.chatStream.appendChild(bubbleContainer);

        // Desplazamiento automático vertical para simular el scroll infinito de la foto
        this.chatStream.scrollTop = this.chatStream.scrollHeight;
    }

    updateSystemHUDIndicator(statusText, stateType) {
        if (!this.systemStatusText) return;
        this.systemStatusText.innerText = `SISTEMA: ${statusText}`;
        
        if (stateType === "positive") {
            this.systemStatusText.style.color = "#00d4ff";
        } else {
            this.systemStatusText.style.color = "#FFD700";
        }
    }
}

// Carga e inicialización global
window.addEventListener('DOMContentLoaded', () => {
    window.JarvisControllerInstance = new JarvisSystemController();
});
