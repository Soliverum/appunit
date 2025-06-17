from fastapi import FastAPI, Request
from api.example import router as example_router

app = FastAPI(title="AppUnit API")

@app.get("/")
async def root():
    return {"message": "Welcome to AppUnit backend"}

app.include_router(example_router, prefix="/api")