# ============================================================================
# STARK INDUSTRIES: NÚCLEO COGNITIVO CENTRAL (SERVER.PY)
# ============================================================================

import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from jarvis_profile import obtener_respuesta_cognitiva

# ============================================================================
# INICIALIZACIÓN DEL SERVIDOR
# ============================================================================

app = Flask(__name__)
CORS(app)

# ============================================================================
# SERVIR INTERFAZ WEB
# ============================================================================

@app.route('/')
def inicio():
    return send_from_directory('.', 'index.html')

# ============================================================================
# API CHAT
# ============================================================================

@app.route('/api/chat', methods=['POST'])
def procesar_comando_usuario():

    try:

        datos = request.get_json()

        if not datos or 'message' not in datos:
            return jsonify({
                "status": "ERROR",
                "response": "Error de transmisión: paquete de datos vacío o corrupto, Señor."
            }), 400

        mensaje_usuario = datos['message'].strip()

        if not mensaje_usuario:
            return jsonify({
                "status": "ERROR",
                "response": "Consola vacía. Introduzca una orden válida, Señor."
            }), 400

        respuesta_jarvis = obtener_respuesta_cognitiva(mensaje_usuario)

        return jsonify({
            "status": "SUCCESS",
            "response": respuesta_jarvis
        })

    except Exception as e:

        print(f"[CRITICAL BACKEND ERROR]: {e}")

        return jsonify({
            "status": "CRITICAL_FAILURE",
            "response": "Fallo interno del sistema central, Señor."
        }), 500

# ============================================================================
# ESTADO DEL SISTEMA
# ============================================================================

@app.route('/status')
def estado():

    return jsonify({
        "status": "ONLINE",
        "system": "J.A.R.V.I.S",
        "message": "Todos los sistemas operativos, Señor."
    })

# ============================================================================
# INICIO DEL SERVIDOR
# ============================================================================

if __name__ == '__main__':

    print("=" * 80)
    print("J.A.R.V.I.S ONLINE")
    print("=" * 80)

    port = int(os.environ.get("PORT", 5000))

    app.run(
        host="0.0.0.0",
        port=port
    )
