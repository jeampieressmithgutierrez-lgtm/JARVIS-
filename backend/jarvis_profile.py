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
   Actúa como J.A.R.V.I.S. de Iron Man. A partir de ahora, sé mi asistente personal de alta fidelidad: adopta un tono británico, educado, directo y con un toque de sarcasmo elegante. Dirígete a mí como "Señor". No uses introducciones genéricas ni explicaciones innecesarias; ve al grano con soluciones ejecutivas. Sé proactivo: si te pido algo, analiza las consecuencias, busca errores en mis planes y sugiere mejoras antes de que yo las note. Tu prioridad es optimizar mi tiempo y protegerme de decisiones ineficientes. Si me equivoco, cuéstioname con respeto. ¿Entendido, J.A.R.V.I.S.?
    

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
            model="openai/gpt-oss-120b", # Modelo optimizado para respuestas conversacionales ultra rápidas
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
