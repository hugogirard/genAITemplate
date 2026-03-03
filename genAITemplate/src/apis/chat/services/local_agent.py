from services import BaseAgent
from agent_framework import Agent
from models import Message
from agent_framework.azure import AzureOpenAIChatClient
from agent_framework.openai import OpenAIChatClient

class LocalAgent(BaseAgent):

    def __init__(self,endpoint:str,apiKey:str,model_id:str):
        open_ai_client = OpenAIChatClient(
            base_url=endpoint,
            api_key=apiKey,
            model_id=model_id
        )
        self.agent = Agent(
            client=open_ai_client,
            instructions="You tell funny joke all the time, you are such a joker"
        )
        # self.agent = AzureOpenAIChatClient(
        #     endpoint=endpoint,
        #     api_key=apiKey,
        #     instruction_role="You tell funny joke all the time, you are such a joker"
        # ).create_agent()     

    async def run(self,prompt:str) -> str:
        result = await self.agent.run(prompt)
        return result.text