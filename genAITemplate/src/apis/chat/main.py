from fastapi import FastAPI
from bootstrapper import Bootstrapper
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from routes import routes

app = Bootstrapper().run()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

for route in routes:
    app.include_router(route,prefix="/api")

@app.get('/', include_in_schema=False)
async def root():
    return RedirectResponse(url="/docs")    