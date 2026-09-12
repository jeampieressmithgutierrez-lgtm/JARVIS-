# ============================================================
# J.A.R.V.I.S. — REGISTRO DE AGENTES
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

    for agent in AGENTS:

        if agent.name == "general":
            continue

        if agent.can_handle(request):
            return agent

    return next(
        agent
        for agent in AGENTS
        if agent.name == "general"
    )


def listar_agentes():

    return [
        {
            "name": agent.name,
            "description": agent.description
        }
        for agent in AGENTS
    ]
