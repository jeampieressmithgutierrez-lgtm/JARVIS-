/* =====================================================
   J.A.R.V.I.S. — CHAT / MEMORIA / VOZ
   STARK COGNITIVE INTERFACE
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

    const chat = crearChatObjeto();

    memoriaSesion.chats = [chat];
    memoriaSesion.currentChatId = chat.id;

    guardarMemoriaSesion();

    return chat;
}


/* =====================================================
   MEMORIA
===================================================== */

function cargarMemoriaSesion() {

    try {

        const guardado = sessionStorage.getItem(STORAGE_KEY);

        if (!guardado) {
            crearPrimerChat();
            return;
        }

        const datos = JSON.parse(guardado);

        if (!datos || !Array.isArray(datos.chats)) {
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

        console.error("[MEMORY LOAD ERROR]", error);

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

        console.error("[MEMORY SAVE ERROR]", error);
    }
}


/* =====================================================
   CHAT ACTUAL
===================================================== */

function obtenerChatActual() {

    return memoriaSesion.chats.find(
        chat => chat.id === memoriaSesion.currentChatId
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

    const input = document.getElementById("messageInput");

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

    const input = document.getElementById("messageInput");

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

    if (memoriaSesion.currentChatId === chatId) {

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
   TÍTULO
===================================================== */

function generarTituloChat(mensaje) {

    if (!mensaje) {
        return "Nueva conversación";
    }

    let titulo =
        mensaje
            .replace(/\s+/g, " ")
            .trim();

    if (titulo.length > 32) {
        titulo =
            titulo.substring(0, 32).trim() + "...";
    }

    return titulo || "Nueva conversación";
}


/* =====================================================
   GUARDAR MENSAJE
===================================================== */

function guardarMensajeChat(role, content) {

    const chat = obtenerChatActual();

    if (!chat) {
        return;
    }

    chat.messages.push({
        role,
        content
    });

    chat.updatedAt = Date.now();

    if (
        chat.messages.length === 1 &&
        role === "user"
    ) {

        chat.title = generarTituloChat(content);
    }

    guardarMemoriaSesion();

    renderizarHistorial();
}


/* =====================================================
   CONTEXTO DE MEMORIA
===================================================== */

function construirContextoMemoria() {

    const chatActual = obtenerChatActual();

    if (!chatActual) {
        return "";
    }

    let contexto =
        "CONTEXTO DE MEMORIA DE J.A.R.V.I.S.\n";

    contexto +=
        "Utilice esta información únicamente como contexto de conversaciones anteriores.\n\n";


    /* CONVERSACIÓN ACTUAL */

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


    /* OTRAS CONVERSACIONES */

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


    if (contexto.length > 10000) {

        contexto =
            contexto.substring(0, 10000);
    }

    return contexto;
}


/* =====================================================
   RENDERIZAR CHAT
===================================================== */

function renderizarChatActual() {

    const chatContainer =
        document.getElementById("messages");

    if (!chatContainer) {

        console.error(
            "[CHAT ERROR] No se encontró #messages."
        );

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
                false,
                false
            );
        }
    }

    desplazarChat();
}


/* =====================================================
   HISTORIAL
===================================================== */

function renderizarHistorial() {

    const historial =
        document.getElementById("chat-history");

    if (!historial) {

        console.error(
            "[HISTORY ERROR] No se encontró #chat-history."
        );

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

        elemento.dataset.chatId =
            chat.id;


        /* ICONO */

        const icono =
            document.createElement("span");

        icono.className =
            "chat-history-icon";

        icono.textContent =
            "◈";


        /* TÍTULO */

        const titulo =
            document.createElement("span");

        titulo.className =
            "chat-history-title";

        titulo.textContent =
            chat.title ||
            "Nueva conversación";


        /* CANTIDAD */

        const cantidad =
            document.createElement("span");

        cantidad.className =
            "chat-history-count";

        const total =
            Array.isArray(chat.messages)
                ? chat.messages.length
                : 0;

        cantidad.textContent =
            total > 0
                ? total
                : "";


        elemento.appendChild(icono);
        elemento.appendChild(titulo);

        if (total > 0) {
            elemento.appendChild(cantidad);
        }


        elemento.addEventListener(
            "click",
            () => seleccionarChat(chat.id)
        );

        historial.appendChild(elemento);
    }
}


/* =====================================================
   MENSAJE DEL USUARIO
===================================================== */

function agregarMensajeUsuario(
    contenido,
    guardar = true
) {

    const chatContainer =
        document.getElementById("messages");

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

    chatContainer.appendChild(
        wrapper
    );


    if (guardar) {

        guardarMensajeChat(
            "user",
            contenido
        );
    }

    desplazarChat();
}


/* =====================================================
   ESCAPAR HTML
===================================================== */

function escaparHTML(texto) {

    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =====================================================
   FORMATEAR RESPUESTA
===================================================== */

function formatearRespuestaJarvis(texto) {

    if (!texto) {
        return "";
    }

    let html =
        escaparHTML(texto);


    /* NEGRITA */

    html = html.replace(
        /\*\*(.*?)\*\*/g,
        "<strong>$1</strong>"
    );


    /* TÍTULOS */

    html = html.replace(
        /^### (.+)$/gm,
        "<h4>$1</h4>"
    );

    html = html.replace(
        /^## (.+)$/gm,
        "<h3>$1</h3>"
    );


    /* LISTAS */

    html = html.replace(
        /^[•\-] (.+)$/gm,
        "<li>$1</li>"
    );


    html = html.replace(
        /((?:<li>.*?<\/li>\s*)+)/g,
        "<ul>$1</ul>"
    );


    /*
       Convertir saltos dobles
       en separación visual.
    */

    html = html.replace(
        /\n{2,}/g,
        "</p><p>"
    );


    html = html.replace(
        /\n/g,
        "<br>"
    );


    /*
       Evitar que todo termine
       en una sola caja sin estructura.
    */

    if (
        !html.startsWith("<h3") &&
        !html.startsWith("<h4") &&
        !html.startsWith("<ul") &&
        !html.startsWith("<p")
    ) {

        html =
            `<p>${html}</p>`;
    }

    return html;
}


/* =====================================================
   MENSAJE DE J.A.R.V.I.S.
===================================================== */

function agregarMensajeJarvis(
    contenido,
    guardar = true,
    animar = true
) {

    const chatContainer =
        document.getElementById("messages");

    if (!chatContainer) {
        return;
    }


    const wrapper =
        document.createElement("div");

    wrapper.className =
        "message jarvis-message";


    /* CABECERA */

    const header =
        document.createElement("div");

    header.className =
        "jarvis-message-header";


    /* NÚCLEO */

    const core =
        document.createElement("div");

    core.className =
        "jarvis-core";

    core.innerHTML =
        "<span></span>";


    /* IDENTIDAD */

    const identity =
        document.createElement("div");

    identity.className =
        "jarvis-identity";

    identity.innerHTML = `
        <strong>J.A.R.V.I.S.</strong>
        <small>ARTIFICIAL INTELLIGENCE</small>
    `;


    header.appendChild(core);
    header.appendChild(identity);


    /* CONTENIDO */

    const contenidoElemento =
        document.createElement("div");

    contenidoElemento.className =
        "message-content jarvis-content";


    /* RESPUESTA */

    if (!animar) {

        contenidoElemento.innerHTML =
            formatearRespuestaJarvis(
                contenido
            );

    } else {

        escribirRespuestaJarvis(
            contenido,
            contenidoElemento
        );
    }


    /* FIRMA */

    const footer =
        document.createElement("div");

    footer.className =
        "jarvis-message-footer";

    footer.textContent =
        "J.A.R.V.I.S. • SYSTEM RESPONSE";


    /* ENSAMBLAR */

    wrapper.appendChild(header);
    wrapper.appendChild(contenidoElemento);
    wrapper.appendChild(footer);

    chatContainer.appendChild(wrapper);


    /* MEMORIA */

    if (guardar) {

        guardarMensajeChat(
            "assistant",
            contenido
        );
    }

    desplazarChat();
}


/* =====================================================
   EFECTO DE ESCRITURA
===================================================== */

function escribirRespuestaJarvis(
    texto,
    elemento
) {

    if (!elemento) {
        return;
    }

    const textoSeguro =
        String(texto);

    let indice = 0;

    const velocidad =
        textoSeguro.length > 900
            ? 5
            : textoSeguro.length > 500
                ? 7
                : 11;


    elemento.innerHTML = `
        <span class="jarvis-typing-text"></span>
        <span class="jarvis-typing-cursor"></span>
    `;


    const textoElemento =
        elemento.querySelector(
            ".jarvis-typing-text"
        );


    function escribir() {

        if (!textoElemento) {
            return;
        }

        if (
            indice >=
            textoSeguro.length
        ) {

            elemento.innerHTML =
                formatearRespuestaJarvis(
                    textoSeguro
                );

            desplazarChat();

            return;
        }


        textoElemento.textContent +=
            textoSeguro.charAt(indice);

        indice++;

        desplazarChat();

        setTimeout(
            escribir,
            velocidad
        );
    }


    escribir();
}


/* =====================================================
   PROCESANDO
===================================================== */

function mostrarProcesando() {

    const chatContainer =
        document.getElementById("messages");

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


    /* CABECERA */

    const header =
        document.createElement("div");

    header.className =
        "jarvis-message-header";


    const core =
        document.createElement("div");

    core.className =
        "jarvis-core processing-core";

    core.innerHTML =
        "<span></span>";


    const identity =
        document.createElement("div");

    identity.className =
        "jarvis-identity";

    identity.innerHTML = `
        <strong>J.A.R.V.I.S.</strong>
        <small>PROCESSING</small>
    `;


    header.appendChild(core);
    header.appendChild(identity);


    /* CONTENIDO */

    const contenido =
        document.createElement("div");

    contenido.className =
        "message-content jarvis-content processing-content";

    contenido.innerHTML = `
        <span>Procesando, Señor</span>

        <span class="processing-dots">
            <i></i>
            <i></i>
            <i></i>
        </span>
    `;


    wrapper.appendChild(header);
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
   SCROLL
===================================================== */

function desplazarChat() {

    const chatContainer =
        document.getElementById(
            "messages"
        );

    if (!chatContainer) {
        return;
    }

    requestAnimationFrame(
        () => {

            chatContainer.scrollTop =
                chatContainer.scrollHeight;
        }
    );
}


/* =====================================================
   ENVIAR MENSAJE
===================================================== */

async function sendMessage() {

    if (enviandoMensaje) {
        return;
    }


    const input =
        document.getElementById(
            "messageInput"
        );

    const sendButton =
        document.getElementById(
            "sendButton"
        );


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


    /* ASEGURAR CHAT */

    let chatActual =
        obtenerChatActual();

    if (!chatActual) {

        chatActual =
            crearPrimerChat();
    }


    /* BLOQUEAR ENVÍO */

    enviandoMensaje = true;


    if (sendButton) {

        sendButton.disabled = true;

        sendButton.classList.add(
            "loading"
        );
    }


    /* MOSTRAR USUARIO */

    agregarMensajeUsuario(
        mensaje,
        true
    );

    input.value = "";


    /* PROCESANDO */

    mostrarProcesando();


    try {

        const contextoMemoria =
            construirContextoMemoria();


        if (
            typeof enviarMensajeAPI !==
            "function"
        ) {

            throw new Error(
                "El módulo API de J.A.R.V.I.S. no está disponible."
            );
        }


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
                true,
                true
            );

        } else {

            agregarMensajeJarvis(
                "No he recibido una respuesta válida del núcleo cognitivo, Señor.",
                true,
                true
            );
        }


    } catch (error) {

        console.error(
            "[CHAT API ERROR]",
            error
        );

        ocultarProcesando();


        agregarMensajeJarvis(
            error.message ||
            "Se ha producido un error de comunicación con el núcleo cognitivo, Señor.",
            true,
            true
        );


    } finally {

        enviandoMensaje = false;


        if (sendButton) {

            sendButton.disabled =
                false;

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
   VOZ
===================================================== */

function iniciarEntradaVoz() {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    const input =
        document.getElementById(
            "messageInput"
        );

    const button =
        document.getElementById(
            "voiceButton"
        );


    if (!SpeechRecognition) {

        agregarMensajeJarvis(
            "La entrada de voz no está disponible en este navegador, Señor."
        );

        return;
    }


    if (!input) {

        console.error(
            "[VOICE ERROR] No se encontró #messageInput."
        );

        return;
    }


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


    reconocimientoVoz =
        new SpeechRecognition();


    reconocimientoVoz.lang =
        "es-CO";

    reconocimientoVoz.continuous =
        false;

    reconocimientoVoz.interimResults =
        true;

    reconocimientoVoz.maxAlternatives =
        1;


    reconocimientoVoz.onstart =
        () => {

            vozActiva = true;

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


    reconocimientoVoz.onresult =
        (event) => {

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


                if (
                    resultado.isFinal
                ) {

                    textoFinal +=
                        transcript + " ";

                } else {

                    textoIntermedio +=
                        transcript;
                }
            }


            if (
                textoIntermedio.trim()
            ) {

                input.value =
                    textoIntermedio.trim();
            }


            if (
                textoFinal.trim()
            ) {

                input.value =
                    textoFinal.trim();

                input.focus();
            }
        };


    reconocimientoVoz.onerror =
        (event) => {

            console.error(
                "[VOICE ERROR]",
                event.error
            );


            if (
                event.error ===
                "not-allowed"
            ) {

                agregarMensajeJarvis(
                    "El navegador no permite acceder al micrófono, Señor. Revise los permisos del sitio."
                );
            }


            if (
                event.error ===
                "audio-capture"
            ) {

                agregarMensajeJarvis(
                    "No he podido acceder al dispositivo de audio, Señor. Compruebe que exista un micrófono disponible."
                );
            }
        };


    reconocimientoVoz.onend =
        () => {

            vozActiva = false;

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
   CONFIGURACIÓN DE VOZ
===================================================== */

function configurarBotonVoz() {

    const button =
        document.getElementById(
            "voiceButton"
        );

    if (!button) {
        return;
    }

    button.addEventListener(
        "click",
        iniciarEntradaVoz
    );
}


/* =====================================================
   CONFIGURAR NUEVO CHAT
===================================================== */

function configurarNuevoChat() {

    const button =
        document.getElementById(
            "newChatButton"
        );

    if (!button) {
        return;
    }

    button.addEventListener(
        "click",
        () => nuevoChat()
    );
}


/* =====================================================
   BUSCADOR
===================================================== */

function configurarBusquedaChats() {

    const input =
        document.getElementById(
            "chatSearchInput"
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


            elementos.forEach(
                elemento => {

                    const texto =
                        elemento.textContent
                            .toLowerCase();


                    elemento.style.display =
                        (
                            !busqueda ||
                            texto.includes(
                                busqueda
                            )
                        )
                            ? ""
                            : "none";
                }
            );
        }
    );
}


/* =====================================================
   INICIALIZACIÓN
===================================================== */

function initChat() {

    console.log(
        "[J.A.R.V.I.S.] Inicializando sistema de chat..."
    );


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


    if (sendButton) {

        sendButton.addEventListener(
            "click",
            sendMessage
        );

    } else {

        console.error(
            "[CHAT ERROR] No se encontró #sendButton."
        );
    }


    const input =
        document.getElementById(
            "messageInput"
        );


    if (input) {

        input.addEventListener(
            "keydown",
            handleKeyPress
        );

    } else {

        console.error(
            "[CHAT ERROR] No se encontró #messageInput."
        );
    }


    console.log(
        "[J.A.R.V.I.S.] Sistema de chat ONLINE."
    );
}


/* =====================================================
   DOM READY
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    initChat
);
