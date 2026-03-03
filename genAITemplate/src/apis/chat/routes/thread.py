from fastapi import APIRouter, Depends
from starlette.responses import StreamingResponse

router = APIRouter(
    prefix="/thread"
)

@router.post('/new')
async def create_new_thread():
    pass