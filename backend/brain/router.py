# ============================================================
# J.A.R.V.I.S. — MISSION CONTROL
# ============================================================

from .registry import obtener_agente


class JarvisRouter:

    def __init__(self):

        self.nombre = "MISSION CONTROL"
        self.modo = "ORCHESTRATOR"

    def analizar(self, request: str):

        """
        Analiza una solicitud y determina
        qué especialista puede ayudar.
        """

        return obtener_agente(request)

    def ejecutar(
        self,
        request: str,
        context: str = ""
    ):

        """
        Envía la solicitud al especialista seleccionado.
        """

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
