# backend/main.py
from fastapi import FastAPI
from backend.api.endpoints import projects as projects_router
from api.example import router as example_api_router # Corrected import path based on existing file

app = FastAPI(title="AppUnit API", version="0.1.0")

@app.get("/")
async def root():
    return {"message": "Welcome to AppUnit API"}

app.include_router(projects_router.router, prefix="/api/v1/projects", tags=["Projects"])
app.include_router(example_api_router, prefix="/api", tags=["Example"]) # Kept existing router