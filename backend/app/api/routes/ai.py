import json
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse

from app.core.security import get_current_user
from app.core.supabase import supabase_admin
from app.middleware.rate_limiter import limiter
from app.schemas.ai import ChatRequest, SummarizeResponse
from app.services.ai_service import generate_chat_response, generate_summary
from app.utils.sanitize import sanitize_html

router = APIRouter(prefix="/api/ai", tags=["ai"])


@router.post("/chat")
@limiter.limit("30/minute")
async def chat(request: ChatRequest, current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("sub")
    sanitized_message = sanitize_html(request.message)

    lesson_context = None
    if request.lesson_id:
        lesson_resp = supabase_admin.table("lessons").select("title, content").eq("id", request.lesson_id).maybe_single().execute()
        if lesson_resp.data:
            content = lesson_resp.data.get("content")
            lesson_context = f"Lesson: {lesson_resp.data['title']}\nContent: {json.dumps(content) if content else 'N/A'}"

    async def stream():
        full_response = ""
        async for text in generate_chat_response(sanitized_message, request.history, lesson_context):
            full_response += text
            yield text

        supabase_admin.table("chat_messages").insert({
            "user_id": user_id,
            "lesson_id": request.lesson_id,
            "role": "user",
            "content": sanitized_message,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }).execute()

        supabase_admin.table("chat_messages").insert({
            "user_id": user_id,
            "lesson_id": request.lesson_id,
            "role": "assistant",
            "content": full_response,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }).execute()

    return StreamingResponse(stream(), media_type="text/plain")


@router.post("/summarize", response_model=SummarizeResponse)
@limiter.limit("30/minute")
async def summarize(lesson_id: int, current_user: dict = Depends(get_current_user)):
    lesson_resp = supabase_admin.table("lessons").select("id, title, content").eq("id", lesson_id).single().execute()
    lesson = lesson_resp.data
    if not lesson:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lesson not found")

    summary = await generate_summary(lesson.get("content", ""))

    return SummarizeResponse(
        summary=summary,
        lesson_title=lesson["title"],
    )
