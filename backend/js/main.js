/**
 * MAIN CONTROLLER
 * Función principal: Manejar la comunicación entre el usuario y el reactor.
 */
const MainController = {
    /**
     * Inicializa los listeners y el estado global del sistema.
     */
    init: function() {
        this.input = document.getElementById('command-input');
        this.input.addEventListener('keypress', (event) => {
            if(event.key === 'Enter') {
                this.handleInput(this.input.value);
            }
        });
    },

    /**
     * Procesa la entrada del usuario y activa los subsistemas.
     */
    handleInput: function(value) {
        if(!value) return;
        console.log(`[STARK PROTOCOL] Solicitud recibida: ${value}`);
        this.displayMessage(value);
        this.input.value = '';
    },

    displayMessage: function(msg) {
        const consoleEl = document.getElementById('chat-console');
        const div = document.createElement('div');
        div.innerText = `> ${msg}`;
        consoleEl.appendChild(div);
    }
};

window.addEventListener('load', () => MainController.init());
