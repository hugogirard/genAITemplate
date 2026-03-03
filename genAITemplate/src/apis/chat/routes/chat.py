from fastapi import APIRouter, Depends, HTTPException
from starlette.responses import StreamingResponse
from services import BaseAgent
from contract import ChatRequest
from typing import Annotated
from dependencies import get_agent_client

router = APIRouter(
    prefix="/chat"
)

@router.post('/')
async def chat(chat_request:ChatRequest,
               agent: Annotated[BaseAgent,Depends(get_agent_client)]) -> str:
    try:
        return await agent.run(prompt=chat_request.prompt)
    except Exception as err:
      raise HTTPException(status_code=500,detail='Internal Server Error')