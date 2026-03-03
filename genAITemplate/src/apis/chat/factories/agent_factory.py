from services import BaseAgent
from infrastructure import AgentDefinition
from foundry_local import FoundryLocalManager
from config import Config
from services import LocalAgent

class AgentFactory:

    @staticmethod
    def create_agent_client(config:Config) -> BaseAgent:
        
        # This is for local testing only and shouldn't be used
        # when running in the cloud
        if config.agent_definition == AgentDefinition.LOCAL_AGENT:
            try:
                manager = FoundryLocalManager()
                manager.load_model(config.local_alias_model)      
            except FileNotFoundError:
                raise SystemExit(
                    "\n❌  Foundry Local CLI not found on PATH.\n"
                    "   Install it from: https://github.com/microsoft/Foundry-Local\n"
                    "   Then verify:     foundry --help\n"
                )
            except Exception as exc:
                raise SystemExit(
                    f"\n❌  Foundry Local bootstrap failed: {exc}\n"
                    "   • Is Foundry Local installed?  https://github.com/microsoft/Foundry-Local\n"
                    "   • Run: foundry model list   — to see available models.\n"
                ) from exc            
            
            agent = LocalAgent(
                        endpoint=manager.endpoint,
                        apiKey=manager.api_key,
                        model_id=manager.get_model_info(config.local_alias_model).id)
            return agent