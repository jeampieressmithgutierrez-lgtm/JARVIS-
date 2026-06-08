async function enviarMensajeAPI(mensaje) {

    const respuesta = await fetch('/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: mensaje
        })
    });

    return await respuesta.json();
}
