function initChat() {
    console.log("[CHAT] Sistema conversacional iniciado.");
}

async function sendMessage() {

    const input = document.getElementById("userInput");
    const chatBox = document.getElementById("chatBox");

    const mensaje = input.value.trim();

    if (!mensaje) return;

    chatBox.innerHTML += `
        <div class="message-wrapper user-wrapper">
            <div class="message user-message">
                ${mensaje}
            </div>
        </div>
    `;

    input.value = "";

    try {

        const respuesta = await enviarMensajeAPI(mensaje);

        chatBox.innerHTML += `
            <div class="message-wrapper jarvis-wrapper">
                <div class="message-avatar"></div>
                <div class="message jarvis-message">
                    <strong>JARVIS:</strong> ${respuesta.response}
                </div>
            </div>
        `;

        chatBox.scrollTop = chatBox.scrollHeight;

    } catch(error) {

        chatBox.innerHTML += `
            <div class="message-wrapper jarvis-wrapper">
                <div class="message jarvis-message">
                    Error de conexión con el núcleo cognitivo.
                </div>
            </div>
        `;
    }
}

function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}
