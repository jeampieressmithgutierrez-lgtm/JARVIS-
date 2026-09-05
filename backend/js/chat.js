/* =====================================================
   J.A.R.V.I.S. — SISTEMA DE CHAT + MEMORIA TEMPORAL
===================================================== */


/* =====================================================
   CONFIGURACIÓN
===================================================== */

const STORAGE_KEY = "jarvis_guest_memory_v1";

let memoriaSesion = {
    currentChatId: null,
    chats: []
};


/* =====================================================
   GENERAR ID
===================================================== */

function generarId() {

    return (
        Date.now().toString(36) +
        Math.random().toString(36).substring(2, 8)
    );
}


/* =====================================================
   CREAR CHAT VACÍO
===================================================== */

function crearChatObjeto(titulo = "Nueva conversación") {

    return {

        id: generarId(),

        title: titulo,

        messages: [],

        createdAt: Date.now(),

        updatedAt: Date.now()

    };
}


/* =====================================================
   CARGAR MEMORIA
===================================================== */

function cargarMemoriaSesion() {

    try {

        const guardado =
            sessionStorage.getItem(STORAGE_KEY);


        if (!guardado) {

            memoriaSesion = {
                currentChatId: null,
                chats: []
            };

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


        memoriaSesion = datos;


        if (!memoriaSesion.chats.length) {

            crearPrimerChat();

            return;
        }


        const chatExiste =
            memoriaSesion.chats.some(
                chat =>
                    chat.id === memoriaSesion.currentChatId
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


/* =====================================================
   GUARDAR MEMORIA
===================================================== */

function guardarMemoriaSesion() {

    try {

        sessionStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(memoriaSesion)
        );

    } catch (error) {

        console.error(
            "[MEMORY SAVE ERROR]",
            error
        );
    }
}


/* =====================================================
   CREAR PRIMER CHAT
===================================================== */

function crearPrimerChat() {

    const chat =
        crearChatObjeto("Conversación actual");


    memoriaSesion = {

        currentChatId: chat.id,

        chats: [chat]

    };


    guardarMemoriaSesion();
}


/* =====================================================
   OBTENER CHAT ACTUAL
===================================================== */

function obtenerChatActual() {

    return memoriaSesion.chats.find(
        chat =>
            chat.id === memoriaSesion.currentChatId
    );
}


/* =====================================================
   CREAR NUEVO CHAT
===================================================== */

function nuevoChat() {

    const chat =
        crearChatObjeto("Nueva conversación");


    memoriaSesion.chats.unshift(chat);

    memoriaSesion.currentChatId =
        chat.id;


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
   CAMBIAR CHAT
===================================================== */

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


/* =====================================================
   ELIMINAR CHAT
===================================================== */

function eliminarChat(chatId, event) {

    if (event) {

        event.stopPropagation();

    }


    const cantidad =
        memoriaSesion.chats.length;


    if (cantidad <= 1) {

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


/* =====================================================
   GENERAR TÍTULO
===================================================== */

function generarTituloChat(texto) {

    let titulo =
        texto
            .replace(/\s+/g, " ")
            .trim();


    if (!titulo) {

        return "Nueva conversación";

    }


    if (titulo.length > 28) {

        titulo =
            titulo.substring(0, 28) +
            "...";

    }


    return titulo;
}


/* =====================================================
   AGREGAR MENSAJE AL CHAT
===================================================== */

function guardarMensajeEnChat(
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


    // El primer mensaje define el título.
    if (
        role === "user" &&
        chat.messages.filter(
            message =>
                message.role === "user"
        ).length === 1
    ) {

        chat.title =
            generarTituloChat(content);

    }


    guardarMemoriaSesion();

    renderizarHistorial();
}


/* =====================================================
   CREAR MENSAJE VISUAL DEL USUARIO
===================================================== */

function agregarMensajeUsuario(texto) {

    const chatBox =
        document.getElementById("messages");


    if (!chatBox) return;


    const wrapper =
        document.createElement("div");


    wrapper.className =
        "message-wrapper user-wrapper";


    const mensaje =
        document.createElement("div");


    mensaje.className =
        "message user-message";


    mensaje.textContent =
        texto;


    wrapper.appendChild(mensaje);

    chatBox.appendChild(wrapper);

    desplazarChat();
}


/* =====================================================
   CREAR MENSAJE VISUAL DE JARVIS
===================================================== */

function agregarMensajeJarvis(texto) {

    const chatBox =
        document.getElementById("messages");


    if (!chatBox) return;


    const wrapper =
        document.createElement("div");


    wrapper.className =
        "message-wrapper jarvis-wrapper";


    const avatar =
        document.createElement("div");


    avatar.className =
        "message-avatar";


    const mensaje =
        document.createElement("div");


    mensaje.className =
        "message jarvis-message";


    const nombre =
        document.createElement("span");


    nombre.className =
        "jarvis-name";


    nombre.textContent =
        "J.A.R.V.I.S.";


    const contenido =
        document.createElement("span");


    contenido.textContent =
        texto;


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

    const chatBox =
        document.getElementById("messages");


    if (!chatBox) return;


    const wrapper =
        document.createElement("div");


    wrapper.className =
        "message-wrapper jarvis-wrapper";


    wrapper.id =
        "jarvis-processing";


    const avatar =
        document.createElement("div");


    avatar.className =
        "message-avatar";


    const mensaje =
        document.createElement("div");


    mensaje.className =
        "message jarvis-message";


    const nombre =
        document.createElement("span");


    nombre.className =
        "jarvis-name";


    nombre.textContent =
        "J.A.R.V.I.S.";


    const indicador =
        document.createElement("div");


    indicador.className =
        "typing-indicator";


    for (let i = 0; i < 3; i++) {

        const punto =
            document.createElement("span");


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
   OCULTAR PROCESAMIENTO
===================================================== */

function ocultarProcesando() {

    const elemento =
        document.getElementById(
            "jarvis-processing"
        );


    if (elemento) {

        elemento.remove();

    }
}


/* =====================================================
   MOSTRAR CHAT ACTUAL
===================================================== */

function renderizarChatActual() {

    const chatBox =
        document.getElementById("messages");


    if (!chatBox) return;


    chatBox.innerHTML = "";


    const chat =
        obtenerChatActual();


    if (!chat) return;


    chat.messages.forEach(
        mensaje => {

            if (
                mensaje.role ===
                "user"
            ) {

                agregarMensajeUsuario(
                    mensaje.content
                );

            } else if (
                mensaje.role ===
                "assistant"
            ) {

                agregarMensajeJarvis(
                    mensaje.content
                );

            }

        }
    );


    desplazarChat();
}


/* =====================================================
   RENDERIZAR HISTORIAL
===================================================== */

function renderizarHistorial() {

    const history =
        document.getElementById(
            "chat-history"
        );


    if (!history) return;


    history.innerHTML = "";


    memoriaSesion.chats.forEach(
        chat => {

            const item =
                document.createElement("div");


            item.className =
                "history-item";


            if (
                chat.id ===
                memoriaSesion.currentChatId
            ) {

                item.classList.add(
                    "active"
                );

            }


            item.dataset.chatId =
                chat.id;


            const dot =
                document.createElement("span");


            dot.className =
                "history-dot";


            dot.textContent =
                "●";


            const title =
                document.createElement("span");


            title.className =
                "history-title";


            title.textContent =
                chat.title;


            const deleteButton =
                document.createElement("button");


            deleteButton.className =
                "history-delete";


            deleteButton.type =
                "button";


            deleteButton.textContent =
                "×";


            deleteButton.title =
                "Eliminar conversación";


            deleteButton.addEventListener(
                "click",
                event => {

                    eliminarChat(
                        chat.id,
                        event
                    );

                }
            );


            item.appendChild(dot);

            item.appendChild(title);

            item.appendChild(deleteButton);


            item.addEventListener(
                "click",
                () => {

                    seleccionarChat(
                        chat.id
                    );

                }
            );


            history.appendChild(item);

        }
    );
}


/* =====================================================
   CONSTRUIR MEMORIA PARA JARVIS
===================================================== */

function construirContextoMemoria() {

    const chatActual =
        obtenerChatActual();


    if (!chatActual) {

        return "";

    }


    const bloques = [];


    /*
       Enviamos primero los chats distintos
       al actual para permitir memoria cruzada.
    */

    memoriaSesion.chats.forEach(
        chat => {

            if (
                chat.id ===
                chatActual.id
            ) {

                return;

            }


            if (
                !chat.messages ||
                !chat.messages.length
            ) {

                return;

            }


            let bloque =
                `CHAT: ${chat.title}\n`;


            chat.messages
                .slice(-12)
                .forEach(
                    mensaje => {

                        const autor =
                            mensaje.role ===
                            "user"
                                ? "SEÑOR"
                                : "J.A.R.V.I.S.";


                        bloque +=
                            `${autor}: ${mensaje.content}\n`;

                    }
                );


            bloques.push(bloque);

        }
    );


    /*
       También enviamos una pequeña parte
       del chat actual para continuidad.
    */

    if (chatActual.messages.length) {

        let actual =
            `CHAT ACTUAL: ${chatActual.title}\n`;


        chatActual.messages
            .slice(-12)
            .forEach(
                mensaje => {

                    const autor =
                        mensaje.role ===
                        "user"
                            ? "SEÑOR"
                            : "J.A.R.V.I.S.";


                    actual +=
                        `${autor}: ${mensaje.content}\n`;

                }
            );


        bloques.push(actual);

    }


    if (!bloques.length) {

        return "";

    }


    /*
       Limitar tamaño total antes de enviarlo
       al servidor.
    */

    let contexto =
        bloques.join("\n");


    if (contexto.length > 16000) {

        contexto =
            contexto.substring(
                contexto.length - 16000
            );

    }


    return contexto;
}


/* =====================================================
   DESPLAZAMIENTO DEL CHAT
===================================================== */

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


/* =====================================================
   ENVIAR MENSAJE
===================================================== */

async function sendMessage() {

    const input =
        document.getElementById(
            "messageInput"
        );


    if (!input) return;


    const mensaje =
        input.value.trim();


    if (!mensaje) return;


    const chat =
        obtenerChatActual();


    if (!chat) {

        crearPrimerChat();

    }


    /*
       Guardar mensaje antes de enviarlo.
    */

    guardarMensajeEnChat(
        "user",
        mensaje
    );


    agregarMensajeUsuario(
        mensaje
    );


    input.value = "";

    input.focus();


    mostrarProcesando();


    try {

        /*
           Construimos la memoria DESPUÉS
           de guardar el mensaje actual.
        */

        const contextoMemoria =
            construirContextoMemoria();


        const respuesta =
            await enviarMensajeAPI(
                mensaje,
                contextoMemoria
            );


        ocultarProcesando();


        if (
            !respuesta ||
            typeof respuesta.response ===
            "undefined"
        ) {

            const mensajeError =
                "He recibido una respuesta inesperada del núcleo cognitivo.";


            agregarMensajeJarvis(
                mensajeError
            );


            guardarMensajeEnChat(
                "assistant",
                mensajeError
            );


            return;

        }


        agregarMensajeJarvis(
            respuesta.response
        );


        guardarMensajeEnChat(
            "assistant",
            respuesta.response
        );


    } catch (error) {

        console.error(
            "[CHAT ERROR]",
            error
        );


        ocultarProcesando();


        const mensajeError =
            "Se ha producido un error de comunicación con el núcleo cognitivo.";


        agregarMensajeJarvis(
            mensajeError
        );


        guardarMensajeEnChat(
            "assistant",
            mensajeError
        );

    }
}


/* =====================================================
   ENTER
===================================================== */

function handleKeyPress(event) {

    if (
        event.key ===
        "Enter"
    ) {

        event.preventDefault();

        sendMessage();

    }
}


/* =====================================================
   INICIALIZACIÓN
===================================================== */

function initChat() {

    console.log(
        "[CHAT] Sistema conversacional iniciado."
    );


    cargarMemoriaSesion();

    renderizarHistorial();

    renderizarChatActual();


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


    /*
       Botón para crear conversación.
    */

    const newChatButton =
        document.getElementById(
            "newChatButton"
        );


    if (newChatButton) {

        newChatButton.addEventListener(
            "click",
            nuevoChat
        );

    }

}


/* =====================================================
   INICIO
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    initChat
);
