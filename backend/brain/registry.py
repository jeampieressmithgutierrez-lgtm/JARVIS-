# ============================================================
# J.A.R.V.I.S. — AGENTES ESPECIALIZADOS
# ============================================================

from dataclasses import dataclass
from typing import Callable, Any


@dataclass
class AgentResult:
    success: bool
    agent: str
    response: str
    data: Any = None


class BaseAgent:

    name = "base"
    description = "Agente base."

    def can_handle(self, request: str) -> bool:
        return False

    def execute(self, request: str, context: str = "") -> AgentResult:
        raise NotImplementedError


class HistoryAgent(BaseAgent):

    name = "history"
    description = (
        "Especialista en historia, acontecimientos históricos, "
        "personajes, fechas, civilizaciones y procesos políticos."
    )

    KEYWORDS = [
        "historia",
        "histórico",
        "historica",
        "fundó",
        "fundador",
        "independencia",
        "guerra",
        "revolución",
        "presidente",
        "civilización",
        "imperio",
        "colombia",
        "españa",
        "roma",
        "egipto",
    ]

    def can_handle(self, request: str) -> bool:
        request = request.lower()

        return any(
            keyword in request
            for keyword in self.KEYWORDS
        )

    def execute(self, request: str, context: str = "") -> AgentResult:

        return AgentResult(
            success=True,
            agent=self.name,
            response="",
            data={
                "specialty": self.description,
                "request": request
            }
        )


class ScienceAgent(BaseAgent):

    name = "science"
    description = (
        "Especialista en ciencias naturales, física, química, "
        "biología, astronomía y conceptos científicos."
    )

    KEYWORDS = [
        "física",
        "fisica",
        "química",
        "quimica",
        "biología",
        "biologia",
        "astronomía",
        "astronomia",
        "planeta",
        "átomo",
        "atomo",
        "energía",
        "energia",
        "gravedad",
        "universo",
        "célula",
        "celula",
        "molécula",
        "molecula",
    ]

    def can_handle(self, request: str) -> bool:
        request = request.lower()

        return any(
            keyword in request
            for keyword in self.KEYWORDS
        )

    def execute(self, request: str, context: str = ""):

        return AgentResult(
            success=True,
            agent=self.name,
            response="",
            data={
                "specialty": self.description,
                "request": request
            }
        )


class CodingAgent(BaseAgent):

    name = "coding"
    description = (
        "Especialista en programación, software, algoritmos, "
        "Python, JavaScript, HTML, CSS, APIs y desarrollo."
    )

    KEYWORDS = [
        "código",
        "codigo",
        "programar",
        "programación",
        "programacion",
        "python",
        "javascript",
        "html",
        "css",
        "flask",
        "api",
        "error",
        "bug",
        "función",
        "funcion",
        "script",
        "programa",
    ]

    def can_handle(self, request: str) -> bool:
        request = request.lower()

        return any(
            keyword in request
            for keyword in self.KEYWORDS
        )

    def execute(self, request: str, context: str = ""):

        return AgentResult(
            success=True,
            agent=self.name,
            response="",
            data={
                "specialty": self.description,
                "request": request
            }
        )


class ImageAgent(BaseAgent):

    name = "image"
    description = (
        "Especialista en generación y edición de imágenes."
    )

    KEYWORDS = [
        "genera una imagen",
        "generame una imagen",
        "générame una imagen",
        "crear una imagen",
        "crea una imagen",
        "haz una imagen",
        "dibuja",
        "dibújame",
        "imagen",
        "ilustración",
        "ilustracion",
    ]

    def can_handle(self, request: str) -> bool:
        request = request.lower()

        return any(
            keyword in request
            for keyword in self.KEYWORDS
        )

    def execute(self, request: str, context: str = ""):

        return AgentResult(
            success=True,
            agent=self.name,
            response="",
            data={
                "specialty": self.description,
                "request": request,
                "action": "image_generation"
            }
        )


class GeneralAgent(BaseAgent):

    name = "general"
    description = (
        "Agente general capaz de responder preguntas "
        "y mantener conversaciones."
    )

    def can_handle(self, request: str) -> bool:
        return True

    def execute(self, request: str, context: str = ""):

        return AgentResult(
            success=True,
            agent=self.name,
            response="",
            data={
                "specialty": self.description,
                "request": request
            }
        )
