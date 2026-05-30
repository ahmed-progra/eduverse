from pydantic import BaseModel


class ChatRequest(BaseModel):
    message: str
    lesson_id: int | None = None
    history: list[dict] = []


class ChatResponse(BaseModel):
    response: str


class SummarizeResponse(BaseModel):
    summary: str
    lesson_title: str
