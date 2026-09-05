# ============================================================================
# STARK INDUSTRIES: NÚCLEO COGNITIVO CENTRAL
# J.A.R.V.I.S. — SERVER.PY
# ============================================================================

import os

from flask import (
    Flask,
    request,
    jsonify,
    send_from_directory,
    session,
    redirect,
    url_for
)

from flask_cors import CORS

from google_auth_oauthlib.flow import Flow
import requests

from jarvis_profile import obtener_respuesta_cognitiva


# ============================================================================
# CONFIGURACIÓN
# ============================================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__)

app.secret_key = os.environ.get("FLASK_SECRET_KEY")

if not app.secret_key:
    raise RuntimeError(
        "FLASK_SECRET_KEY no está configurada en las variables de entorno."
    )

CORS(app)


# ============================================================================
# CONFIGURACIÓN DE SESIÓN
# ============================================================================

app.config["SESSION_COOKIE_HTTPONLY"] = True
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"

if os.environ.get("RENDER") == "true":
    app.config["SESSION_COOKIE_SECURE"] = True


# ============================================================================
# GOOGLE OAUTH
# ============================================================================

GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = os.environ.get("GOOGLE_REDIRECT_URI")


if not GOOGLE_CLIENT_ID:
    raise RuntimeError(
        "GOOGLE_CLIENT_ID no está configurado."
    )

if not GOOGLE_CLIENT_SECRET:
    raise RuntimeError(
        "GOOGLE_CLIENT_SECRET no está configurado."
    )

if not GOOGLE_REDIRECT_URI:
    raise RuntimeError(
        "GOOGLE_REDIRECT_URI no está configurado."
    )


GOOGLE_SCOPES = [
    "openid",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile"
]


def crear_google_flow():

    client_config = {
        "web": {
            "client_id": GOOGLE_CLIENT_ID,
            "client_secret": GOOGLE_CLIENT_SECRET,
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "userinfo_uri": "https://openidconnect.googleapis.com/v1/userinfo",
            "redirect_uris": [
                GOOGLE_REDIRECT_URI
            ]
        }
    }

    flow = Flow.from_client_config(
        client_config,
        scopes=GOOGLE_SCOPES
    )

    flow.redirect_uri = GOOGLE_REDIRECT_URI

    return flow


# ============================================================================
# ARCHIVOS WEB
# ============================================================================

@app.route("/")
def inicio():

    return send_from_directory(
        BASE_DIR,
        "index.html"
    )


@app.route("/css/<path:filename>")
def css_files(filename):

    return send_from_directory(
        os.path.join(BASE_DIR, "css"),
        filename
    )


@app.route("/js/<path:filename>")
def js_files(filename):

    return send_from_directory(
        os.path.join(BASE_DIR, "js"),
        filename
    )


# ============================================================================
# GOOGLE LOGIN
# ============================================================================

@app.route("/auth/google")
def google_login():

    flow = crear_google_flow()

    authorization_url, state = flow.authorization_url(
        access_type="offline",
        include_granted_scopes="true",
        prompt="select_account"
    )

    session["google_oauth_state"] = state

    return redirect(authorization_url)


# ============================================================================
# GOOGLE CALLBACK
# ============================================================================

@app.route("/auth/google/callback")
def google_callback():

    try:

        state = session.get("google_oauth_state")

        if not state:

            return """
            <h2>Error de autenticación</h2>
            <p>La sesión de autenticación expiró. Intente nuevamente.</p>
            """, 400

        flow = crear_google_flow()

        flow.fetch_token(
            authorization_response=request.url
        )

        credentials = flow.credentials

        userinfo_response = requests.get(
            "https://openidconnect.googleapis.com/v1/userinfo",
            headers={
                "Authorization": f"Bearer {credentials.token}"
            },
            timeout=10
        )

        if userinfo_response.status_code != 200:

            return """
            <h2>Error de autenticación</h2>
            <p>No fue posible obtener la información del usuario.</p>
            """, 400

        userinfo = userinfo_response.json()

        session["user"] = {
            "google_id": userinfo.get("sub"),
            "name": userinfo.get("name"),
            "email": userinfo.get("email"),
            "picture": userinfo.get("picture")
        }

        session.pop("google_oauth_state", None)

        return redirect(url_for("inicio"))

    except Exception as e:

        print(f"[GOOGLE AUTH ERROR]: {e}")

        return """
        <h2>Error de autenticación</h2>
        <p>No fue posible completar el inicio de sesión.</p>
        """, 500


# ============================================================================
# USUARIO ACTUAL
# ============================================================================

@app.route("/api/me")
def usuario_actual():

    usuario = session.get("user")

    if not usuario:

        return jsonify({
            "authenticated": False,
            "user": None
        })

    return jsonify({
        "authenticated": True,
        "user": usuario
    })


# ============================================================================
# CERRAR SESIÓN
# ============================================================================

@app.route("/auth/logout")
def cerrar_sesion():

    session.clear()

    return redirect(url_for("inicio"))


# ============================================================================
# API CHAT
# ============================================================================

@app.route("/api/chat", methods=["POST"])
def procesar_comando_usuario():

    try:

        datos = request.get_json()

        if not datos or "message" not in datos:

            return jsonify({
                "status": "ERROR",
                "response":
                    "Error de transmisión: paquete de datos vacío o corrupto, Señor."
            }), 400


        mensaje_usuario = datos["message"].strip()


        if not mensaje_usuario:

            return jsonify({
                "status": "ERROR",
                "response":
                    "Consola vacía. Introduzca una orden válida, Señor."
            }), 400


        # ------------------------------------------------------------
        # CONTEXTO TEMPORAL DE MEMORIA
        # ------------------------------------------------------------

        contexto_memoria = datos.get(
            "memory_context",
            ""
        )


        # Seguridad básica: limitar tamaño del contexto recibido.
        if not isinstance(contexto_memoria, str):

            contexto_memoria = ""

        contexto_memoria = contexto_memoria[:18000]


        # ------------------------------------------------------------
        # PROCESAMIENTO COGNITIVO
        # ------------------------------------------------------------

        respuesta_jarvis = obtener_respuesta_cognitiva(
            mensaje_usuario,
            contexto_memoria
        )


        return jsonify({
            "status": "SUCCESS",
            "response": respuesta_jarvis
        })


    except Exception as e:

        print(
            f"[CRITICAL BACKEND ERROR]: "
            f"{type(e).__name__}: {e}"
        )

        return jsonify({
            "status": "CRITICAL_FAILURE",
            "response":
                "Se ha producido un fallo interno del núcleo cognitivo, Señor."
        }), 500


# ============================================================================
# ESTADO DEL SISTEMA
# ============================================================================

@app.route("/status")
def estado():

    return jsonify({
        "status": "ONLINE",
        "system": "J.A.R.V.I.S",
        "message": "Todos los sistemas operativos, Señor."
    })


# ============================================================================
# INICIO
# ============================================================================

if __name__ == "__main__":

    port = int(
        os.environ.get("PORT", 5000)
    )

    app.run(
        host="0.0.0.0",
        port=port
    )
