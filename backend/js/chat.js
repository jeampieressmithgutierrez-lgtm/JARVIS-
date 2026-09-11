/* =====================================================
   J.A.R.V.I.S. — CHAT / MEMORIA / VOZ
===================================================== */

"use strict";

/* =====================================================
   CONFIGURACIÓN
===================================================== */

const STORAGE_KEY = "jarvis_guest_memory_v2";

let memoriaSesion = {
    currentChatId: null,
    chats: []
};

let enviandoMensaje = false;

let reconocimientoVoz = null;
let vozActiva = false;


/* =====================================================
   UTILIDADES
===================================================== */

function generarId() {
    return (
        Date.now().toString(36) +
        Math.random().toString(36).substring(2, 9)
    );
}


/* =====================================================
   CREACIÓN DE CHATS
===================================================== */

function crearChatObjeto(titulo = "Nueva conversación") {
    const ahora = Date.now();

    return {
        id: generarId(),
        title: titulo,
        messages: [],
        createdAt: ahora,
        updatedAt: ahora
    };
}


function crearPrimerChat() {
    const chat = crearChatObjeto("Nueva conversación");

    memoriaSesion.chats = [chat];
    memoriaSesion.currentChatId = chat.id;

    guardarMemoriaSesion();

    return chat;
}


/* =====================================================
   MEMORIA DE SESIÓN
===================================================== */

function cargarMemoriaSesion() {
    try {
        const guardado = sessionStorage.getItem(STORAGE_KEY);

        if (!guardado) {
            crearPrimerChat();
            return;
        }

        const datos = JSON.parse(guardado);

        if (
            !datos ||
            !Array.isArray(datos.chats)
        ) {
            crearPrimerChat();
            return;
        }

        memoriaSesion = {
            currentChatId: datos.currentChatId || null,
            chats: datos.chats || []
        };

        if (memoriaSesion.chats.length === 0) {
            crearPrimerChat();
            return;
        }

        const chatActual = memoriaSesion.chats.find(
            chat => chat.id === memoriaSesion.currentChatId
        );

        if (!chatActual) {
            memoriaSesion.currentChatId =
                memoriaSesion.chats[0].id;
        }

    } catch (error) {
        console.error(
            "[MEMORY LOAD ERROR]:",
            error
        );

        memoriaSesion = {
            currentChatId: null,
            chats: []
        };

        crearPrimerChat();
    }
}


function guardarMemoriaSesion() {
    try {
        sessionStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(memoriaSesion)
        );
    } catch (error) {
        console.error(
            "[MEMORY SAVE ERROR]:",
            error
        );
    }
}


/* =====================================================
   CHAT ACTUAL
===================================================== */

function obtenerChatActual() {
    return memoriaSesion.chats.find(
        chat =>
            chat.id === memoriaSesion.currentChatId
    );
}


/* =====================================================
   NUEVO CHAT
===================================================== */

function nuevoChat(titulo = "Nueva conversación") {
    const nuevo = crearChatObjeto(titulo);

    memoriaSesion.chats.unshift(nuevo);
    memoriaSesion.currentChatId = nuevo.id;

    guardarMemoriaSesion();

    renderizarHistorial();
    renderizarChatActual();

    const input =
        document.getElementById("messageInput");

    if (input) {
        input.value = "";
        input.focus();
    }

    return nuevo;
}


/* =====================================================
   SELECCIONAR CHAT
===================================================== */

function seleccionarChat(chatId) {
    const chat = memoriaSesion.chats.find(
        item => item.id === chatId
    );

    if (!chat) {
        return;
    }

    memoriaSesion.currentChatId = chatId;

    guardarMemoriaSesion();

    renderizarHistorial();
    renderizarChatActual();

    const input =
        document.getElementById("messageInput");

    if (input) {
        input.focus();
    }
}


/* =====================================================
   ELIMINAR CHAT
===================================================== */

function eliminarChat(chatId) {
    memoriaSesion.chats =
        memoriaSesion.chats.filter(
            chat => chat.id !== chatId
        );

    if (
        memoriaSesion.currentChatId === chatId
    ) {
        if (memoriaSesion.chats.length > 0) {
            memoriaSesion.currentChatId =
                memoriaSesion.chats[0].id;
        } else {
            crearPrimerChat();
        }
    }

    guardarMemoriaSesion();

    renderizarHistorial();
    renderizarChatActual();
}


/* =====================================================
   TÍTULO AUTOMÁTICO
===================================================== */

function generarTituloChat(mensaje) {
    if (!mensaje) {
        return "Nueva conversación";
    }

    let titulo = mensaje
        .replace(/\s+/g, " ")
        .trim();

    if (titulo.length > 32) {
        titulo =
            titulo.substring(0, 32).trim() + "...";
    }

    return titulo || "Nueva conversación";
}


/* =====================================================
   GUARDAR MENSAJES
===================================================== */

function guardarMensajeChat(
    role,
    content
) {
    const chat = obtenerChatActual();

    if (!chat) {
        return;
    }

    chat.messages.push({
        role: role,
        content: content
    });

    chat.updatedAt = Date.now();

    if (
        chat.messages.length === 1 &&
        role === "user"
    ) {
        chat.title =
            generarTituloChat(content);
    }

    guardarMemoriaSesion();

    renderizarHistorial();
}


/* =====================================================
   CONSTRUIR CONTEXTO DE MEMORIA
===================================================== */

function construirContextoMemoria() {
    const chatActual = obtenerChatActual();

    if (!chatActual) {
        return "";
    }

    let contexto = "";

    contexto +=
        "CONTEXTO DE MEMORIA DE J.A.R.V.I.S.\n";
    contexto +=
        "Utilice esta información únicamente como contexto de conversaciones anteriores.\n\n";

    /* -------------------------------------------------
       CHAT ACTUAL
    ------------------------------------------------- */

    contexto +=
        "=== CONVERSACIÓN ACTUAL ===\n";

    const mensajesActuales =
        chatActual.messages.slice(-10);

    for (const mensaje of mensajesActuales) {
        const rol =
            mensaje.role === "user"
                ? "Usuario"
                : "J.A.R.V.I.S.";

        contexto +=
            `${rol}: ${mensaje.content}\n`;
    }

    contexto += "\n";


    /* -------------------------------------------------
       OTROS CHATS
    ------------------------------------------------- */

    const otrosChats =
        memoriaSesion.chats.filter(
            chat => chat.id !== chatActual.id
        );

    if (otrosChats.length > 0) {
        contexto +=
            "=== OTRAS CONVERSACIONES DE ESTA SESIÓN ===\n";

        for (const chat of otrosChats.slice(0, 8)) {
            contexto +=
                `\n[Chat: ${chat.title}]\n`;

            const mensajes =
                chat.messages.slice(-4);

            for (const mensaje of mensajes) {
                const rol =
                    mensaje.role === "user"
                        ? "Usuario"
                        : "J.A.R.V.I.S.";

                contexto +=
                    `${rol}: ${mensaje.content}\n`;
            }
        }
    }

    /* -------------------------------------------------
       LÍMITE DE SEGURIDAD
    ------------------------------------------------- */

    if (contexto.length > 10000) {
        contexto =
            contexto.substring(
                0,
                10000
            );
    }

    return contexto;
}


/* =====================================================
   RENDERIZAR CHAT
===================================================== */

function renderizarChatActual() {
    const chatContainer =
        document.getElementById("chatMessages");

    if (!chatContainer) {
        return;
    }

    chatContainer.innerHTML = "";

    const chat = obtenerChatActual();

    if (!chat) {
        return;
    }

    for (const mensaje of chat.messages) {
        if (mensaje.role === "user") {
            agregarMensajeUsuario(
                mensaje.content,
                false
            );
        } else {
            agregarMensajeJarvis(
                mensaje.content,
                false
            );
        }
    }

    desplazarChat();
}


/* =====================================================
   RENDERIZAR HISTORIAL
===================================================== */

function renderizarHistorial() {
    const historial =
        document.getElementById("chatHistory");

    if (!historial) {
        return;
    }

    historial.innerHTML = "";

    for (const chat of memoriaSesion.chats) {
        const elemento =
            document.createElement("div");

        elemento.className =
            "chat-history-item";

        if (
            chat.id ===
            memoriaSesion.currentChatId
        ) {
            elemento.classList.add("active");
        }

        elemento.dataset.chatId = chat.id;

        const titulo =
            document.createElement("span");

        titulo.className =
            "chat-history-title";

        titulo.textContent =
            chat.title || "Nueva conversación";

        elemento.appendChild(titulo);

        elemento.addEventListener(
            "click",
            () => {
                seleccionarChat(chat.id);
            }
        );

        historial.appendChild(elemento);
    }
}


/* =====================================================
   AGREGAR MENSAJE DEL USUARIO
===================================================== */

function agregarMensajeUsuario(
    contenido,
    guardar = true
) {
    const chatContainer =
        document.getElementById("chatMessages");

    if (!chatContainer) {
        return;
    }

    const wrapper =
        document.createElement("div");

    wrapper.className =
        "message user-message";

    const contenidoElemento =
        document.createElement("div");

    contenidoElemento.className =
        "message-content";

    contenidoElemento.textContent =
        contenido;

    wrapper.appendChild(
        contenidoElemento
    );

    chatContainer.appendChild(wrapper);

    if (guardar) {
        guardarMensajeChat(
            "user",
            contenido
        );
    }

    desplazarChat();
}


/* =====================================================
   AGREGAR MENSAJE DE J.A.R.V.I.S.
===================================================== */

function agregarMensajeJarvis(
    contenido,
    guardar = true
) {
    const chatContainer =
        document.getElementById("chatMessages");

    if (!chatContainer) {
        return;
    }

    const wrapper =
        document.createElement("div");

    wrapper.className =
        "message jarvis-message";

    const contenidoElemento =
        document.createElement("div");

    contenidoElemento.className =
        "message-content";

    contenidoElemento.textContent =
        contenido;

    wrapper.appendChild(
        contenidoElemento
    );

    chatContainer.appendChild(wrapper);

    if (guardar) {
        guardarMensajeChat(
            "assistant",
            contenido
        );
    }

    desplazarChat();
}


/* =====================================================
   INDICADOR DE PROCESAMIENTO
===================================================== */

function mostrarProcesando() {
    const chatContainer =
        document.getElementById("chatMessages");

    if (!chatContainer) {
        return;
    }

    ocultarProcesando();

    const wrapper =
        document.createElement("div");

    wrapper.id =
        "jarvisProcessing";

    wrapper.className =
        "message jarvis-message processing-message";

    const contenido =
        document.createElement("div");

    contenido.className =
        "message-content";

    contenido.textContent =
        "Procesando, Señor...";

    wrapper.appendChild(contenido);

    chatContainer.appendChild(wrapper);

    desplazarChat();
}


function ocultarProcesando() {
    const elemento =
        document.getElementById(
            "jarvisProcessing"
        );

    if (elemento) {
        elemento.remove();
    }
}


/* =====================================================
   DESPLAZAMIENTO
===================================================== */

function desplazarChat() {
    const chatContainer =
        document.getElementById("chatMessages");

    if (!chatContainer) {
        return;
    }

    requestAnimationFrame(() => {
        chatContainer.scrollTop =
            chatContainer.scrollHeight;
    });
}


/* =====================================================
   ENVÍO DE MENSAJES
===================================================== */

async function sendMessage() {
    if (enviandoMensaje) {
        return;
    }

    const input =
        document.getElementById("messageInput");

    const sendButton =
        document.getElementById("sendButton");

    if (!input) {
        console.error(
            "[CHAT ERROR] No se encontró #messageInput."
        );
        return;
    }

    const mensaje =
        input.value.trim();

    if (!mensaje) {
        return;
    }

    const chatActual =
        obtenerChatActual();

    if (!chatActual) {
        crearPrimerChat();
    }

    enviandoMensaje = true;

    if (sendButton) {
        sendButton.disabled = true;
        sendButton.classList.add("loading");
    }

    agregarMensajeUsuario(
        mensaje,
        true
    );

    input.value = "";

    mostrarProcesando();

    try {
        const contextoMemoria =
            construirContextoMemoria();

        const datos =
            await enviarMensajeAPI(
                mensaje,
                contextoMemoria
            );

        ocultarProcesando();

        if (
            datos &&
            datos.response
        ) {
            agregarMensajeJarvis(
                datos.response,
                true
            );
        } else {
            agregarMensajeJarvis(
                "No he recibido una respuesta válida del núcleo cognitivo, Señor.",
                true
            );
        }

    } catch (error) {
        console.error(
            "[CHAT API ERROR]:",
            error
        );

        ocultarProcesando();

        agregarMensajeJarvis(
            error.message ||
            "Se ha producido un error de comunicación con el núcleo cognitivo, Señor.",
            true
        );

    } finally {
        enviandoMensaje = false;

        if (sendButton) {
            sendButton.disabled = false;
            sendButton.classList.remove(
                "loading"
            );
        }

        input.focus();
    }
}


/* =====================================================
   TECLADO
===================================================== */

function handleKeyPress(event) {
    if (
        event.key === "Enter" &&
        !event.shiftKey
    ) {
        event.preventDefault();

        sendMessage();
    }
}


/* =====================================================
   ENTRADA DE VOZ
===================================================== */

function iniciarEntradaVoz() {
    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    const input =
        document.getElementById("messageInput");

    const button =
        document.getElementById("voiceButton");

    if (!SpeechRecognition) {
        agregarMensajeJarvis(
            "La entrada de voz no está disponible en este navegador, Señor."
        );

        console.warn(
            "[VOICE] SpeechRecognition no está disponible."
        );

        return;
    }

    if (!input) {
        console.error(
            "[VOICE ERROR] No se encontró #messageInput."
        );

        return;
    }

    /* -------------------------------------------------
       SI YA ESTÁ ESCUCHANDO → DETENER
    ------------------------------------------------- */

    if (
        vozActiva &&
        reconocimientoVoz
    ) {
        try {
            reconocimientoVoz.stop();
        } catch (error) {
            console.warn(
                "[VOICE STOP]",
                error
            );
        }

        return;
    }


    /* -------------------------------------------------
       CREAR RECONOCIMIENTO
    ------------------------------------------------- */

    reconocimientoVoz =
        new SpeechRecognition();

    reconocimientoVoz.lang = "es-CO";

    reconocimientoVoz.continuous = false;

    reconocimientoVoz.interimResults = true;

    reconocimientoVoz.maxAlternatives = 1;


    /* -------------------------------------------------
       INICIO
    ------------------------------------------------- */

    reconocimientoVoz.onstart = () => {
        vozActiva = true;

        console.log(
            "[VOICE] Micrófono activo. Escuchando..."
        );

        if (button) {
            button.classList.add(
                "recording"
            );

            button.setAttribute(
                "aria-label",
                "Detener entrada de voz"
            );

            button.setAttribute(
                "title",
                "Detener entrada de voz"
            );
        }

        input.placeholder =
            "Escuchando, Señor...";
    };


    /* -------------------------------------------------
       RESULTADO
    ------------------------------------------------- */

    reconocimientoVoz.onresult = (event) => {
        let textoFinal = "";
        let textoIntermedio = "";

        for (
            let i = event.resultIndex;
            i < event.results.length;
            i++
        ) {
            const resultado =
                event.results[i];

            const transcript =
                resultado[0].transcript;

            if (resultado.isFinal) {
                textoFinal +=
                    transcript + " ";
            } else {
                textoIntermedio +=
                    transcript;
            }
        }

        if (textoIntermedio.trim()) {
            input.value =
                textoIntermedio.trim();
        }

        if (textoFinal.trim()) {
            input.value =
                textoFinal.trim();

            input.focus();

            console.log(
                "[VOICE RESULT]:",
                textoFinal.trim()
            );
        }
    };


    /* -------------------------------------------------
       ERRORES
    ------------------------------------------------- */

    reconocimientoVoz.onerror = (event) => {
        console.error(
            "[VOICE ERROR]:",
            event.error
        );

        switch (event.error) {

            case "not-allowed":

                agregarMensajeJarvis(
                    "El navegador no permite acceder al micrófono, Señor. Revise los permisos del sitio."
                );

                break;


            case "no-speech":

                agregarMensajeJarvis(
                    "No he detectado ninguna orden de voz, Señor."
                );

                break;


            case "audio-capture":

                agregarMensajeJarvis(
                    "No he podido acceder al dispositivo de audio, Señor. Compruebe que el micrófono esté disponible."
                );

                break;


            case "network":

                agregarMensajeJarvis(
                    "El reconocimiento de voz no pudo comunicarse con su servicio, Señor."
                );

                break;


            case "service-not-allowed":

                agregarMensajeJarvis(
                    "El servicio de reconocimiento de voz no está disponible en este navegador, Señor."
                );

                break;


            default:

                agregarMensajeJarvis(
                    "Se produjo un inconveniente con la entrada de voz, Señor."
                );

                break;
        }
    };


    /* -------------------------------------------------
       FINALIZACIÓN
    ------------------------------------------------- */

    reconocimientoVoz.onend = () => {
        vozActiva = false;

        console.log(
            "[VOICE] Reconocimiento finalizado."
        );

        if (button) {
            button.classList.remove(
                "recording"
            );

            button.setAttribute(
                "aria-label",
                "Entrada de voz"
            );

            button.setAttribute(
                "title",
                "Entrada de voz"
            );
        }

        input.placeholder =
            "Escriba una instrucción...";

        input.focus();
    };


    /* -------------------------------------------------
       INICIAR
    ------------------------------------------------- */

    try {
        reconocimientoVoz.start();

    } catch (error) {

        console.error(
            "[VOICE START ERROR]",
            error
        );

        vozActiva = false;

        if (button) {
            button.classList.remove(
                "recording"
            );
        }

        input.placeholder =
            "Escriba una instrucción...";
    }
}


/* =====================================================
   CONFIGURAR BOTÓN DE VOZ
===================================================== */

function configurarBotonVoz() {
    const button =
        document.getElementById("voiceButton");

    if (!button) {
        console.warn(
            "[VOICE] No se encontró #voiceButton."
        );

        return;
    }

    button.addEventListener(
        "click",
        iniciarEntradaVoz
    );
}


/* =====================================================
   NUEVA CONVERSACIÓN
===================================================== */

function configurarNuevoChat() {
    const botones =
        document.querySelectorAll(
            "#newChatButton, .new-chat-button, [data-new-chat]"
        );

    botones.forEach(button => {

        button.addEventListener(
            "click",
            () => {
                nuevoChat();
            }
        );

    });
}


/* =====================================================
   BUSCADOR DE CHATS
===================================================== */

function configurarBusquedaChats() {
    const input =
        document.getElementById(
            "chatSearch"
        );

    if (!input) {
        return;
    }

    input.addEventListener(
        "input",
        () => {

            const busqueda =
                input.value
                    .toLowerCase()
                    .trim();

            const elementos =
                document.querySelectorAll(
                    ".chat-history-item"
                );

            elementos.forEach(elemento => {

                const texto =
                    elemento.textContent
                        .toLowerCase();

                if (
                    !busqueda ||
                    texto.includes(busqueda)
                ) {
                    elemento.style.display =
                        "";
                } else {
                    elemento.style.display =
                        "none";
                }

            });

        }
    );
}


/* =====================================================
   INICIALIZACIÓN
===================================================== */

function initChat() {

    cargarMemoriaSesion();

    renderizarHistorial();

    renderizarChatActual();

    configurarBotonVoz();

    configurarNuevoChat();

    configurarBusquedaChats();

    const sendButton =
        document.getElementById(
            "sendButton"
        );

    const input =
        document.getElementById(
            "messageInput"
        );

    if (sendButton) {

        sendButton.addEventListener(
            "click",
            sendMessage
        );

    } else {

        console.warn(
            "[CHAT] No se encontró #sendButton."
        );

    }

    if (input) {

        input.addEventListener(
            "keydown",
            handleKeyPress
        );

    } else {

        console.warn(
            "[CHAT] No se encontró #messageInput."
        );

    }

    console.log(
        "[J.A.R.V.I.S.] Chat inicializado correctamente."
    );
}


/* =====================================================
   DOM READY
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    initChat
);
