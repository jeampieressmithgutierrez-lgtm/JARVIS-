# ============================================================
# J.A.R.V.I.S. — ORQUESTADOR COGNITIVO
# ============================================================

from .registry import obtener_agente


class JarvisRouter:

    def __init__(self):

        self.nombre = "J.A.R.V.I.S."
        self.modo = "ORCHESTRATOR"

    def analizar(self, request: str):

        agente = obtener_agente(request)

        return agente

    def ejecutar(
        self,
        request: str,
        context: str = ""
    ):

        agente = self.analizar(request)

        resultado = agente.execute(
            request,
            context
        )

        return {
            "agent": agente.name,
            "success": resultado.success,
            "response": resultado.response,
            "data": resultado.data
        }


router = JarvisRouter()
