# ============================================================
# J.A.R.V.I.S. — REGISTRO CENTRAL DE AGENTES
# ============================================================

from .agents import (
    HistoryAgent,
    ScienceAgent,
    CodingAgent,
    ImageAgent,
    GeneralAgent
)


AGENTS = [
    HistoryAgent(),
    ScienceAgent(),
    CodingAgent(),
    ImageAgent(),
    GeneralAgent(),
]


def obtener_agente(request: str):

    """
    Mission Control busca el primer especialista
    capaz de manejar la solicitud.

    Si ninguno coincide, utiliza GeneralAgent.
    """

    if not request:
        return AGENTS[-1]

    texto = request.strip()

    for agent in AGENTS:

        if agent.name == "general":
            continue

        if agent.can_handle(texto):
            return agent

    return AGENTS[-1]


def listar_agentes():

    return [
        {
            "name": agent.name,
            "description": agent.description
        }
        for agent in AGENTS
    ]
