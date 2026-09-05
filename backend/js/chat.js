/* =========================================================
   J.A.R.V.I.S.
   CHAT + MEMORIA TEMPORAL DE INVITADO
========================================================= */


/* =========================================================
   CONFIGURACIÓN
========================================================= */

const STORAGE_KEY = "jarvis_guest_memory_v2";

let memoriaSesion = {
    currentChatId: null,
    chats: []
};

let enviandoMensaje = false;


/* =========================================================
   ID
========================================================= */

function generarId() {

    return (
        Date.now().toString(36) +
        Math.random()
            .toString(36)
            .substring(2, 8)
    );

}


/* =========================================================
   CREAR CHAT
========================================================= */

function crearChatObjeto(
    titulo = "Nueva conversación"
) {

    return {

        id: generarId(),

        title: titulo,

        messages: [],

        createdAt: Date.now(),

        updatedAt: Date.now()

    };

}


/* =========================================================
   CREAR PRIMER CHAT
========================================================= */

function crearPrimerChat() {

    const chat =
        crearChatObjeto(
            "Conversación actual"
        );


    memoriaSesion = {

        currentChatId: chat.id,

        chats: [chat]

    };


    guardarMemoriaSesion();

}


/* =========================================================
   CARGAR MEMORIA
========================================================= */

function cargarMemoriaSesion() {

    try {

        const guardado =
            sessionStorage.getItem(
                STORAGE_KEY
            );


        if (!guardado) {

            crearPrimerChat();

            return;

        }


        const datos =
            JSON.parse(guardado);


        if (
            !datos ||
            !Array.isArray(datos.chats)
        ) {

            crearPrimerChat();

            return;

        }


        memoriaSesion = datos;


        if (
            !memoriaSesion.chats.length
        ) {

            crearPrimerChat();

            return;

        }


        const chatExiste =
            memoriaSesion.chats.some(
                chat =>
                    chat.id ===
                    memoriaSesion.currentChatId
            );


        if (!chatExiste) {

            memoriaSesion.currentChatId =
                memoriaSesion.chats[0].id;

        }


        guardarMemoriaSesion();

    } catch (error) {

        console.error(
            "[MEMORY LOAD ERROR]",
            error
        );

        crearPrimerChat();

    }

}


/* =========================================================
   GUARDAR MEMORIA
========================================================= */

function guardarMemoriaSesion() {

    try {

        sessionStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(
                memoriaSesion
            )
        );

    } catch (error) {

        console.error(
            "[MEMORY SAVE ERROR]",
            error
        );

    }

}


/* =========================================================
   CHAT ACTUAL
========================================================= */

function obtenerChatActual() {

    return memoriaSesion.chats.find(
        chat =>
            chat.id ===
            memoriaSesion.currentChatId
    );

}


/* =========================================================
   NUEVO CHAT
========================================================= */

function nuevoChat() {

    const chat =
        crearChatObjeto(
            "Nueva conversación"
        );


    memoriaSesion.chats.unshift(chat);


    memoriaSesion.currentChatId =
        chat.id;


    guardarMemoriaSesion();

    renderizarHistorial();

    renderizarChatActual();


    const input =
        document.getElementById(
            "messageInput"
        );


    if (input) {

        input.focus();

    }

}


/* =========================================================
   SELECCIONAR CHAT
========================================================= */

function seleccionarChat(chatId) {

    const existe =
        memoriaSesion.chats.some(
            chat =>
                chat.id === chatId
        );


    if (!existe) return;


    memoriaSesion.currentChatId =
        chatId;


    guardarMemoriaSesion();

    renderizarHistorial();

    renderizarChatActual();

}


/* =========================================================
   ELIMINAR CHAT
========================================================= */

function eliminarChat(
    chatId,
    event
) {

    if (event) {

        event.stopPropagation();

    }


    if (
        memoriaSesion.chats.length <= 1
    ) {

        const chat =
            obtenerChatActual();


        if (chat) {

            chat.messages = [];

            chat.title =
                "Conversación actual";

            chat.updatedAt =
                Date.now();

        }


        guardarMemoriaSesion();

        renderizarHistorial();

        renderizarChatActual();

        return;

    }


    memoriaSesion.chats =
        memoriaSesion.chats.filter(
            chat =>
                chat.id !== chatId
        );


    if (
        memoriaSesion.currentChatId ===
        chatId
    ) {

        memoriaSesion.currentChatId =
            memoriaSesion.chats[0].id;

    }


    guardarMemoriaSesion();

    renderizarHistorial();

    renderizarChatActual();

}


/* =========================================================
   TÍTULO AUTOMÁTICO
========================================================= */

function generarTituloChat(texto) {

    const limpio =
        texto
            .replace(/\s+/g, " ")
            .trim();


    if (!limpio) {

        return "Nueva conversación";

    }


    if (limpio.length <= 28) {

        return limpio;

    }


    return (
        limpio.substring(0, 28).trim() +
        "..."
    );

}


/* =========================================================
   GUARDAR MENSAJE
========================================================= */

function guardarMensajeChat(
    role,
    content
) {

    const chat =
        obtenerChatActual();


    if (!chat) return;


    chat.messages.push({

        role: role,

        content: content,

        timestamp: Date.now()

    });


    chat.updatedAt =
        Date.now();


    if (
        chat.messages.length === 1 &&
        role === "user"
    ) {

        chat.title =
            generarTituloChat(
                content
            );

    }


    guardarMemoriaSesion();

    renderizarHistorial();

}


/* =========================================================
   CONSTRUIR MEMORIA COMPARTIDA
========================================================= */

function construirContextoMemoria() {

    const chatActual =
        obtenerChatActual();


    const otrosChats =
        memoriaSesion.chats.filter(
            chat =>
                chat.id !==
                memoriaSesion.currentChatId
        );


    const bloques = [];


    /* =====================================================
       CHAT ACTUAL
    ===================================================== */

    if (
        chatActual &&
        chatActual.messages.length
    ) {

        const mensajesActuales =
            chatActual.messages
                .slice(-10);


        bloques.push(
            "CHAT ACTUAL:\n" +
            mensajesActuales
                .map(mensaje => {

                    const rol =
                        mensaje.role === "user"
                            ? "SEÑOR"
                            : "J.A.R.V.I.S.";

                    return (
                        rol +
                        ": " +
                        mensaje.content
                    );

                })
                .join("\n")
        );

    }


    /* =====================================================
       OTROS CHATS
    ===================================================== */

    if (otrosChats.length) {

        const historiales =
            otrosChats
                .slice(0, 8)
                .map(chat => {

                    const mensajes =
                        chat.messages
                            .slice(-4);


                    if (!mensajes.length) {

                        return "";

                    }


                    return (
                        "CHAT: " +
                        chat.title +
                        "\n" +
                        mensajes
                            .map(mensaje => {

                                const rol =
                                    mensaje.role === "user"
                                        ? "SEÑOR"
                                        : "J.A.R.V.I.S.";

                                return (
                                    rol +
                                    ": " +
                                    mensaje.content
                                );

                            })
                            .join("\n")
                    );

                })
                .filter(Boolean);


        if (historiales.length) {

            bloques.push(
                "MEMORIA DE OTROS CHATS:\n" +
                historiales.join("\n\n")
            );

        }

    }


    if (!bloques.length) {

        return "";

    }


    let contexto =
        bloques.join("\n\n");


    const MAX =
        10000;


    if (
        contexto.length > MAX
    ) {

        contexto =
            contexto.substring(
                contexto.length - MAX
            );

    }


    return contexto;

}


/* =========================================================
   RENDERIZAR CHAT ACTUAL
========================================================= */

function renderizarChatActual() {

    const chatBox =
        document.getElementById(
            "messages"
        );


    if (!chatBox) return;


    chatBox.innerHTML = "";


    const chat =
        obtenerChatActual();


    if (!chat) return;


    chat.messages.forEach(
        mensaje => {

            if (
                mensaje.role === "user"
            ) {

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
    );


    desplazarChat();

}


/* =========================================================
   RENDERIZAR HISTORIAL
========================================================= */

function renderizarHistorial(
    filtro = ""
) {

    const historial =
        document.getElementById(
            "chat-history"
        );


    if (!historial) return;


    historial.innerHTML = "";


    const textoFiltro =
        filtro
            .toLowerCase()
            .trim();


    const chats =
        memoriaSesion.chats.filter(
            chat =>
                !textoFiltro ||
                chat.title
                    .toLowerCase()
                    .includes(textoFiltro)
        );


    chats.forEach(chat => {

        const item =
            document.createElement(
                "div"
            );


        item.className =
            "history-item" +
            (
                chat.id ===
                memoriaSesion.currentChatId
                    ? " active"
                    : ""
            );


        item.addEventListener(
            "click",
            () =>
                seleccionarChat(
                    chat.id
                )
        );


        const dot =
            document.createElement(
                "span"
            );


        dot.className =
            "history-dot";

        dot.textContent =
            "●";


        const title =
            document.createElement(
                "span"
            );


        title.className =
            "history-title";

        title.textContent =
            chat.title;


        const borrar =
            document.createElement(
                "button"
            );


        borrar.className =
            "history-delete";

        borrar.type =
            "button";

        borrar.textContent =
            "×";

        borrar.title =
            "Eliminar conversación";


        borrar.addEventListener(
            "click",
            event =>
                eliminarChat(
                    chat.id,
                    event
                )
        );


        item.appendChild(dot);

        item.appendChild(title);

        item.appendChild(borrar);


        historial.appendChild(item);

    });

}


/* =========================================================
   MENSAJE USUARIO
========================================================= */

function agregarMensajeUsuario(
    texto,
    guardar = true
) {

    const chatBox =
        document.getElementById(
            "messages"
        );


    if (!chatBox) return;


    const wrapper =
        document.createElement(
            "div"
        );


    wrapper.className =
        "message-wrapper user-wrapper";


    const mensaje =
        document.createElement(
            "div"
        );


    mensaje.className =
        "message user-message";


    mensaje.textContent =
        texto;


    wrapper.appendChild(mensaje);


    chatBox.appendChild(wrapper);


    if (guardar) {

        guardarMensajeChat(
            "user",
            texto
        );

    }


    desplazarChat();

}


/* =========================================================
   MENSAJE JARVIS
========================================================= */

function agregarMensajeJarvis(
    texto,
    guardar = true
) {

    const chatBox =
        document.getElementById(
            "messages"
        );


    if (!chatBox) return;


    const wrapper =
        document.createElement(
            "div"
        );


    wrapper.className =
        "message-wrapper jarvis-wrapper";


    const avatar =
        document.createElement(
            "div"
        );


    avatar.className =
        "message-avatar";


    const mensaje =
        document.createElement(
            "div"
        );


    mensaje.className =
        "message jarvis-message";


    const nombre =
        document.createElement(
            "span"
        );


    nombre.className =
        "jarvis-name";

    nombre.textContent =
        "J.A.R.V.I.S.";


    const contenido =
        document.createElement(
            "span"
        );


    contenido.textContent =
        texto;


    mensaje.appendChild(nombre);

    mensaje.appendChild(contenido);


    wrapper.appendChild(avatar);

    wrapper.appendChild(mensaje);


    chatBox.appendChild(wrapper);


    if (guardar) {

        guardarMensajeChat(
            "assistant",
            texto
        );

    }


    desplazarChat();

}


/* =========================================================
   PROCESANDO
========================================================= */

function mostrarProcesando() {

    const chatBox =
        document.getElementById(
            "messages"
        );


    if (!chatBox) return;


    ocultarProcesando();


    const wrapper =
        document.createElement(
            "div"
        );


    wrapper.className =
        "message-wrapper jarvis-wrapper";


    wrapper.id =
        "jarvis-processing";


    const avatar =
        document.createElement(
            "div"
        );


    avatar.className =
        "message-avatar";


    const mensaje =
        document.createElement(
            "div"
        );


    mensaje.className =
        "message jarvis-message";


    const nombre =
        document.createElement(
            "span"
        );


    nombre.className =
        "jarvis-name";

    nombre.textContent =
        "J.A.R.V.I.S.";


    const indicador =
        document.createElement(
            "div"
        );


    indicador.className =
        "typing-indicator";


    for (
        let i = 0;
        i < 3;
        i++
    ) {

        const punto =
            document.createElement(
                "span"
            );


        indicador.appendChild(
            punto
        );

    }


    mensaje.appendChild(nombre);

    mensaje.appendChild(indicador);


    wrapper.appendChild(avatar);

    wrapper.appendChild(mensaje);


    chatBox.appendChild(wrapper);


    desplazarChat();

}


/* =========================================================
   OCULTAR PROCESANDO
========================================================= */

function ocultarProcesando() {

    const elemento =
        document.getElementById(
            "jarvis-processing"
        );


    if (elemento) {

        elemento.remove();

    }

}


/* =========================================================
   SCROLL
========================================================= */

function desplazarChat() {

    const chatBox =
        document.getElementById(
            "messages"
        );


    if (!chatBox) return;


    chatBox.scrollTo({

        top:
            chatBox.scrollHeight,

        behavior:
            "smooth"

    });

}


/* =========================================================
   ENVIAR MENSAJE
========================================================= */

async function sendMessage() {

    if (enviandoMensaje) {

        return;

    }


    const input =
        document.getElementById(
            "messageInput"
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


    enviandoMensaje = true;


    const boton =
        document.getElementById(
            "sendButton"
        );


    if (boton) {

        boton.disabled = true;

    }


    /* =====================================================
       GUARDAR MENSAJE DEL SEÑOR
    ===================================================== */

    agregarMensajeUsuario(
        mensaje
    );


    input.value = "";


    mostrarProcesando();


    /* =====================================================
       CONSTRUIR MEMORIA
    ===================================================== */

    const contexto =
        construirContextoMemoria();


    try {

        const respuesta =
            await enviarMensajeAPI(
                mensaje,
                contexto
            );


        ocultarProcesando();


        if (
            !respuesta ||
            typeof respuesta.response ===
            "undefined"
        ) {

            agregarMensajeJarvis(
                "He recibido una respuesta inesperada del núcleo cognitivo, Señor."
            );

            return;

        }


        agregarMensajeJarvis(
            String(
                respuesta.response
            )
        );


    } catch (error) {

        console.error(
            "[CHAT ERROR]",
            error
        );


        ocultarProcesando();


        agregarMensajeJarvis(
            "Se ha producido un error de comunicación con el núcleo cognitivo, Señor."
        );

    } finally {

        enviandoMensaje = false;


        if (boton) {

            boton.disabled = false;

        }


        input.focus();

    }

}


/* =========================================================
   ENTER
========================================================= */

function handleKeyPress(event) {

    if (
        event.key === "Enter" &&
        !event.shiftKey
    ) {

        event.preventDefault();

        sendMessage();

    }

}


/* =========================================================
   ENTRADA DE VOZ
========================================================= */

function iniciarEntradaVoz() {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    if (!SpeechRecognition) {

        agregarMensajeJarvis(
            "La entrada de voz no está disponible en este navegador, Señor."
        );

        return;

    }


    const input =
        document.getElementById(
            "messageInput"
        );


    const button =
        document.getElementById(
            "voiceButton"
        );


    if (!input) {

        console.error(
            "[VOICE ERROR] No se encontró #messageInput."
        );

        return;

    }


    const recognition =
        new SpeechRecognition();


    recognition.lang =
        "es-CO";


    recognition.interimResults =
        false;


    recognition.continuous =
        false;


    recognition.maxAlternatives =
        1;


    if (button) {

        button.classList.add(
            "recording"
        );

        button.disabled =
            true;

    }


    try {

        recognition.start();

    } catch (error) {

        console.error(
            "[VOICE START ERROR]",
            error
        );

        if (button) {

            button.classList.remove(
                "recording"
            );

            button.disabled =
                false;

        }

        return;

    }


    recognition.onresult =
        event => {

            const texto =
                event
                    .results[0][0]
                    .transcript
                    .trim();


            if (texto) {

                input.value =
                    texto;

                input.focus();

            }

        };


    recognition.onerror =
        event => {

            console.error(
                "[VOICE ERROR]",
                event.error
            );


            if (
                event.error ===
                "not-allowed"
            ) {

                agregarMensajeJarvis(
                    "El navegador ha bloqueado el acceso al micrófono, Señor."
                );

            } else if (
                event.error ===
                "no-speech"
            ) {

                agregarMensajeJarvis(
                    "No he detectado ninguna orden de voz, Señor."
                );

            }

        };


    recognition.onend =
        () => {

            if (button) {

                button.classList.remove(
                    "recording"
                );

                button.disabled =
                    false;

            }

        };

}


/* =========================================================
   BOTÓN DE VOZ
========================================================= */

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


/* =========================================================
   BÚSQUEDA DE CHATS
========================================================= */

function configurarBusquedaChats() {

    const buscador =
        document.getElementById(
            "chatSearch"
        );


    if (!buscador) {

        return;

    }


    buscador.addEventListener(
        "input",
        () => {

            renderizarHistorial(
                buscador.value
            );

        }
    );

}


/* =========================================================
   BOTÓN NUEVO CHAT
========================================================= */

function configurarNuevoChat() {

    const boton =
        document.getElementById(
            "newChatButton"
        );


    if (!boton) {

        return;

    }


    boton.addEventListener(
        "click",
        nuevoChat
    );

}


/* =========================================================
   INICIALIZAR CHAT
========================================================= */

function initChat() {

    console.log(
        "[CHAT] Sistema conversacional iniciado."
    );


    cargarMemoriaSesion();


    renderizarHistorial();


    renderizarChatActual();


    configurarBusquedaChats();


    configurarNuevoChat();


    configurarBotonVoz();

}


/* =========================================================
   INICIALIZACIÓN
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const button =
            document.getElementById(
                "sendButton"
            );


        const input =
            document.getElementById(
                "messageInput"
            );


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
