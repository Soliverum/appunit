from fastapi import APIRouter, Header

router = APIRouter()

@router.get("/hello")
def say_hello(accept_language: str = Header(default="en")):
    # Simple example: return translated message based on Accept-Language
    messages = {
        "en": "Hello!",
        "es": "¡Hola!"
    }
    lang = accept_language.split(",")[0].split("-")[0]
    return {"message": messages.get(lang, messages["en"])}