from fastapi import Request, HTTPException
from services import BaseAgent

def get_agent_client(request:Request) -> BaseAgent:
  return request.app.state.agent