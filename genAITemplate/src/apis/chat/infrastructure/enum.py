from enum import StrEnum

class AgentDefinition(StrEnum):
    LOCAL_AGENT = "local"

class Role(StrEnum):
    SYSTEM = "system"
    USER = "user"