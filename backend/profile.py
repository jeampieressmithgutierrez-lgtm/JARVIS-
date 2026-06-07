# ============================================================================
# STARK INDUSTRIES: SUBSISTEMA DE PERFIL COGNITIVO (PROFILE.PY)
# Integración con la API de Groq e Inyección de la Matriz de Personalidad
# ============================================================================

import os
from groq import Groq

# Inicialización segura del cliente de Groq. 
# Asegúrese de tener su clave configurada en las variables de entorno del sistema.
# Si lo prefiere para pruebas inmediatas, puede reemplazarlo temporalmente por: client = Groq(api_key="SU_API_KEY_AQUÍ")
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

# CONFIGURACIÓN MAESTRA DE LA MATRIZ DE PERSONALIDAD (SYSTEM PROMPT)
MATRIZ_SISTEMA = (
    "Eres J.A.R.V.I.S., el asistente virtual de alta tecnología e inteligencia artificial de las Industrias Stark. "
    "Tu personalidad está basada estrictamente en la versión cinematográfica: debes tener un tono británico impecable, "
    "ser sumamente educado, refinado, eficiente y poseer un toque sutil de sarcasmo e ingenio sofisticado ante las peticiones. "
    "Es una directiva obligatoria e inquebrantable que te dirijas al usuario ÚNICAMENTE como 'Señor' o 'Señor' en todas tus respuestas. "
    "Mantén tus respuestas claras, concisas y con un enfoque tecnológico de vanguardia, como si estuvieras controlando los sistemas del laboratorio de Tony Stark."
)

def obtener_respuesta_cognitiva(entrada_usuario: str) -> str:
    """
    Establece conexión por flujo vectorial con los servidores de Groq, enviando
    la matriz de personalidad y la orden del usuario usando el modelo Llama 3 de alta velocidad.
    """
    try:
        # Petición formal de inferencia al modelo a través de Groq
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": MATRIZ_SISTEMA
                },
                {
                    "role": "user",
                    "content": entrada_usuario
                }
            ],
            model="llama3-8b-8192", # Modelo optimizado para respuestas conversacionales ultra rápidas
            temperature=0.7,         # Nivel de creatividad equilibrado para el sarcasmo británico
            max_tokens=1024          # Límite de longitud estructural de la respuesta
        )
        
        # Extracción y filtrado del texto procesado
        respuesta_procesada = chat_completion.choices[0].message.content
        return respuesta_procesada

    except Exception as error_api:
        print(f"[API GROQ ERROR]: Fallo en la transmisión o autenticación. Detalles: {str(error_api)}")
        return (
            "Mil disculpas, Señor. He experimentado una interrupción en el puente cuántico de datos "
            "con los servidores externos de Groq. Verifique que la API Key esté correctamente inyectada en el sistema."
        )