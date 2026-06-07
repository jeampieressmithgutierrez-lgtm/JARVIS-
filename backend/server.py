# ============================================================================
# STARK INDUSTRIES: NÚCLEO COGNITIVO CENTRAL (SERVER.PY)
# Servidor de Enrutamiento Asíncrono en Flask y Gestión de Protocolos CORS
# ============================================================================

import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from profile import obtener_respuesta_cognitiva

# Inicialización de la infraestructura del framework web
app = Flask(__name__)

# Habilitación de CORS para permitir conexiones desde el HUD del Frontend
CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route('/api/chat', list=['POST'])
def procesar_comando_usuario():
    """
    Punto de enlace API que recibe las órdenes del HUD, las procesa a través
    del perfil cognitivo del asistente y retorna la respuesta en formato JSON.
    """
    try:
        datos = request.get_json()
        
        if not datos or 'message' not in datos:
            return jsonify({
                "status": "ERROR",
                "response": "Error de transmisión: Paquete de datos vacío o corrupto, Señor."
            }), 400
            
        mensaje_usuario = datos['message'].strip()
        
        if not mensaje_usuario:
            return jsonify({
                "status": "ERROR",
                "response": "Consola vacía. Por favor, introduzca una orden válida, Señor."
            }), 400

        # Interrogación al submódulo de procesamiento de lenguaje natural
        respuesta_jarvis = obtener_respuesta_cognitiva(mensaje_usuario)

        return jsonify({
            "status": "SUCCESS",
            "response": respuesta_jarvis
        }), 200

    except Exception as e:
        print(f"[CRITICAL BACKEND ERROR]: {str(e)}")
        return jsonify({
            "status": "CRITICAL_FAILURE",
            "response": f"Fallo en el sistema central. Error interno de ejecución: {str(e)}"
        }), 500

if __name__ == '__main__':
    print("\n" + "="*80)
    print(" PROTOCOLO J.A.R.V.I.S: SERVIDOR DE ENLACE COGNITIVO INICIALIZADO")
    print(" Monitoreando flujos de datos en: http://127.0.0.1:5000")
    print("="*80 + "\n")
    
    # Ejecución del servidor local en modo de desarrollo estable
    app.run(host='127.0.0.1', port=5000, debug=True)