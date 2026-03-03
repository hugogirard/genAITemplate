from pydantic import BaseModel
from infrastructure import Role

class Message(BaseModel):
    id: str
    text: str
    role: Role