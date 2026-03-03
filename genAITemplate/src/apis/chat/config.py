from dotenv import load_dotenv
from infrastructure import AgentDefinition
import os

class Config:

    def __init__(self):
        load_dotenv(override=True)

    @property
    def agent_definition(self) -> AgentDefinition:
        value = os.getenv("AGENT_DEFINITION")
        if value is None:
            return AgentDefinition.LOCAL_AGENT
        try:
            return AgentDefinition(value)
        except ValueError:
            valid = [e.value for e in AgentDefinition]
            raise ValueError(f"Invalid AGENT_DEFINITION '{value}'. Must be one of: {valid}")
        
    @property
    def local_alias_model(self) -> str:
        value = os.getenv('LOCAL_FOUNDRY_MODEL')
        if value is None:
            return 'phi-4-mini'
        return value    