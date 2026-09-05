/* =====================================================
   J.A.R.V.I.S. — API
===================================================== */


/* =====================================================
   ENVIAR MENSAJE
===================================================== */

async function enviarMensajeAPI(mensaje, contextoMemoria = "") {

    const respuesta = await fetch("/api/chat", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            message: mensaje,

            memory_context: contextoMemoria

        })

    });


    let datos;

    try {

        datos = await respuesta.json();

    } catch (error) {

        throw new Error(
            "El servidor devolvió una respuesta no válida."
        );

    }


    if (!respuesta.ok) {

        throw new Error(
            datos.response ||
            "Error de comunicación con el servidor."
        );

    }


    return datos;
}
