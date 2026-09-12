# ============================================================
# J.A.R.V.I.S. — AGENTES ESPECIALIZADOS
# ============================================================

from dataclasses import dataclass
from typing import Any


@dataclass
class AgentResult:
    success: bool
    agent: str
    response: str = ""
    data: Any = None


class BaseAgent:

    name = "base"
    description = "Agente base."

    def can_handle(self, request: str) -> bool:
        return False

    def execute(self, request: str, context: str = "") -> AgentResult:
        raise NotImplementedError


# ============================================================
# HISTORIA
# ============================================================

class HistoryAgent(BaseAgent):

    name = "history"

    description = (
        "Especialista en historia, personajes históricos, "
        "acontecimientos, fechas, civilizaciones y procesos históricos."
    )

    KEYWORDS = [
        "historia",
        "histórico",
        "histórica",
        "historico",
        "historica",
        "fundó",
        "fundo",
        "fundador",
        "independencia",
        "guerra",
        "revolución",
        "revolucion",
        "presidente",
        "civilización",
        "civilizacion",
        "imperio",
        "conquista",
        "colonia",
        "virreinato",
        "antiguo",
        "antigua",
    ]

    def can_handle(self, request: str) -> bool:

        texto = request.lower()

        return any(
            palabra in texto
            for palabra in self.KEYWORDS
        )

    def execute(
        self,
        request: str,
        context: str = ""
    ) -> AgentResult:

        return AgentResult(
            success=True,
            agent=self.name,
            data={
                "specialty": self.description,
                "request": request,
                "context": context
            }
        )


# ============================================================
# CIENCIA
# ============================================================

class ScienceAgent(BaseAgent):

    name = "science"

    description = (
        "Especialista en física, química, biología, "
        "astronomía y ciencias naturales."
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
        "genética",
        "genetica",
        "evolución",
        "evolucion",
        "ecosistema",
        "átomos",
        "atomos",
    ]

    def can_handle(self, request: str) -> bool:

        texto = request.lower()

        return any(
            palabra in texto
            for palabra in self.KEYWORDS
        )

    def execute(
        self,
        request: str,
        context: str = ""
    ) -> AgentResult:

        return AgentResult(
            success=True,
            agent=self.name,
            data={
                "specialty": self.description,
                "request": request,
                "context": context
            }
        )


# ============================================================
# PROGRAMACIÓN
# ============================================================

class CodingAgent(BaseAgent):

    name = "coding"

    description = (
        "Especialista en programación, software, "
        "Python, JavaScript, HTML, CSS, Flask, APIs y arquitectura."
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
        "software",
        "backend",
        "frontend",
        "servidor",
        "github",
        "render",
    ]

    def can_handle(self, request: str) -> bool:

        texto = request.lower()

        return any(
            palabra in texto
            for palabra in self.KEYWORDS
        )

    def execute(
        self,
        request: str,
        context: str = ""
    ) -> AgentResult:

        return AgentResult(
            success=True,
            agent=self.name,
            data={
                "specialty": self.description,
                "request": request,
                "context": context
            }
        )


# ============================================================
# IMÁGENES
# ============================================================

class ImageAgent(BaseAgent):

    name = "image"

    description = (
        "Especialista en creación, análisis y edición "
        "de imágenes y contenido visual."
    )

    KEYWORDS = [
        "imagen",
        "imágenes",
        "imagenes",
        "dibujar",
        "dibuja",
        "dibújame",
        "dibujame",
        "ilustración",
        "ilustracion",
        "foto",
        "fotografía",
        "fotografia",
        "render",
        "visual",
        "diseño",
        "diseñar",
    ]

    def can_handle(self, request: str) -> bool:

        texto = request.lower()

        return any(
            palabra in texto
            for palabra in self.KEYWORDS
        )

    def execute(
        self,
        request: str,
        context: str = ""
    ) -> AgentResult:

        return AgentResult(
            success=True,
            agent=self.name,
            data={
                "specialty": self.description,
                "request": request,
                "context": context,
                "action": "visual_task"
            }
        )


# ============================================================
# GENERAL
# ============================================================

class GeneralAgent(BaseAgent):

    name = "general"

    description = (
        "Especialista general para conversación, "
        "razonamiento, explicaciones y tareas no especializadas."
    )

    def can_handle(self, request: str) -> bool:

        return True

    def execute(
        self,
        request: str,
        context: str = ""
    ) -> AgentResult:

        return AgentResult(
            success=True,
            agent=self.name,
            data={
                "specialty": self.description,
                "request": request,
                "context": context
            }
        )
