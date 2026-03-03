from abc import ABC, abstractmethod
from models import Message

class BaseAgent(ABC):

    @abstractmethod
    async def run(self,prompt:str) -> str:
        pass