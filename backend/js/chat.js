/* =====================================================
   J.A.R.V.I.S. — CHAT
===================================================== */

function initChat() {
    console.log("[CHAT] Sistema conversacional iniciado.");
}


/* =====================================================
   CREAR MENSAJE DEL USUARIO
===================================================== */

function agregarMensajeUsuario(texto) {

    const chatBox = document.getElementById("messages");

    const wrapper = document.createElement("div");
    wrapper.className = "message-wrapper user-wrapper";

    const mensaje = document.createElement("div");
    mensaje.className = "message user-message";

    // Seguridad: evita interpretar HTML escrito por el usuario
    mensaje.textContent = texto;

    wrapper.appendChild(mensaje);

    chatBox.appendChild(wrapper);

    desplazarChat();
}


/* =====================================================
   CREAR MENSAJE DE JARVIS
===================================================== */

function agregarMensajeJarvis(texto) {

    const chatBox = document.getElementById("messages");

    const wrapper = document.createElement("div");
    wrapper.className = "message-wrapper jarvis-wrapper";

    const avatar = document.createElement("div");
    avatar.className = "message-avatar";

    const mensaje = document.createElement("div");
    mensaje.className = "message jarvis-message";

    const nombre = document.createElement("span");
    nombre.className = "jarvis-name";
    nombre.textContent = "J.A.R.V.I.S.";

    const contenido = document.createElement("span");
    contenido.textContent = texto;

    mensaje.appendChild(nombre);
    mensaje.appendChild(contenido);

    wrapper.appendChild(avatar);
    wrapper.appendChild(mensaje);

    chatBox.appendChild(wrapper);

    desplazarChat();
}


/* =====================================================
   INDICADOR DE PROCESAMIENTO
===================================================== */

function mostrarProcesando() {

    const chatBox = document.getElementById("messages");

    const wrapper = document.createElement("div");

    wrapper.className =
        "message-wrapper jarvis-wrapper";

    wrapper.id = "jarvis-processing";

    const avatar = document.createElement("div");
    avatar.className = "message-avatar";

    const mensaje = document.createElement("div");
    mensaje.className = "message jarvis-message";

    const nombre = document.createElement("span");
    nombre.className = "jarvis-name";
    nombre.textContent = "J.A.R.V.I.S.";

    const indicador = document.createElement("div");
    indicador.className = "typing-indicator";

    for (let i = 0; i < 3; i++) {

        const punto = document.createElement("span");

        indicador.appendChild(punto);
    }

    mensaje.appendChild(nombre);
    mensaje.appendChild(indicador);

    wrapper.appendChild(avatar);
    wrapper.appendChild(mensaje);

    chatBox.appendChild(wrapper);

    desplazarChat();
}


/* =====================================================
   ELIMINAR INDICADOR
===================================================== */

function ocultarProcesando() {

    const elemento =
        document.getElementById("jarvis-processing");

    if (elemento) {
        elemento.remove();
    }
}


/* =====================================================
   SCROLL AUTOMÁTICO
===================================================== */

function desplazarChat() {

    const chatBox =
        document.getElementById("messages");

    if (!chatBox) return;

    chatBox.scrollTo({
        top: chatBox.scrollHeight,
        behavior: "smooth"
    });
}


/* =====================================================
   ENVIAR MENSAJE
===================================================== */

async function sendMessage() {

    const input =
        document.getElementById("messageInput");

    if (!input) return;

    const mensaje =
        input.value.trim();

    if (!mensaje) return;


    /* Mostrar mensaje del usuario */

    agregarMensajeUsuario(mensaje);

    input.value = "";

    input.focus();


    /* Mostrar procesamiento */

    mostrarProcesando();


    try {

        const respuesta =
            await enviarMensajeAPI(mensaje);

        ocultarProcesando();


        /* Verificar respuesta */

        if (
            !respuesta ||
            typeof respuesta.response === "undefined"
        ) {

            agregarMensajeJarvis(
                "He recibido una respuesta inesperada del núcleo cognitivo."
            );

            return;
        }


        agregarMensajeJarvis(
            respuesta.response
        );


    } catch (error) {

        console.error(
            "[CHAT ERROR]",
            error
        );

        ocultarProcesando();

        agregarMensajeJarvis(
            "Se ha producido un error de comunicación con el núcleo cognitivo."
        );
    }
}


/* =====================================================
   TECLA ENTER
===================================================== */

function handleKeyPress(event) {

    if (event.key === "Enter") {

        event.preventDefault();

        sendMessage();
    }
}


/* =====================================================
   INICIALIZACIÓN
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const button =
            document.getElementById("sendButton");

        const input =
            document.getElementById("messageInput");


        if (button) {

            button.addEventListener(
                "click",
                sendMessage
            );
        }


        if (input) {

            input.addEventListener(
                "keydown",
                handleKeyPress
            );
        }


        initChat();
    }
);
