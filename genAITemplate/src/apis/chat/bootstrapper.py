from fastapi import FastAPI
from contextlib import asynccontextmanager
from config import Config
from factories import AgentFactory

@asynccontextmanager
async def lifespan_event(app: FastAPI):

    config = Config()

    app.state.agent = AgentFactory.create_agent_client(config=config)

    yield

class Bootstrapper:

    def run(self) -> FastAPI:

        app = FastAPI(lifespan=lifespan_event)

        self._configure_monitoring(app)

        return app        

    def _configure_monitoring(self, app: FastAPI):
        pass        