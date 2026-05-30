from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status

from app.core.security import get_current_user
from app.core.supabase import supabase_admin

router = APIRouter(prefix="/api/lessons", tags=["lessons"])


@router.get("/{lesson_id}")
async def get_lesson(lesson_id: int, current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("sub")

    lesson_resp = supabase_admin.table("lessons").select("*").eq("id", lesson_id).single().execute()
    lesson = lesson_resp.data
    if not lesson:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lesson not found")

    progress_resp = supabase_admin.table("user_progress").select("completed").eq("user_id", user_id).eq("lesson_id", lesson_id).maybe_single().execute()
    is_completed = progress_resp.data.get("completed", False) if progress_resp.data else False

    return {
        "id": lesson["id"],
        "course_id": lesson["course_id"],
        "title": lesson["title"],
        "description": lesson.get("description"),
        "content": lesson.get("content"),
        "order": lesson["order"],
        "lesson_type": lesson.get("lesson_type"),
        "estimated_minutes": lesson.get("estimated_minutes"),
        "is_completed": is_completed,
    }


@router.post("/{lesson_id}/complete")
async def complete_lesson(lesson_id: int, current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("sub")

    lesson_resp = supabase_admin.table("lessons").select("id, course_id, courses(path_id, order)").eq("id", lesson_id).single().execute()
    lesson = lesson_resp.data
    if not lesson:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lesson not found")

    course = lesson.get("courses", {})
    path_id = course.get("path_id")

    supabase_admin.table("user_progress").upsert({
        "user_id": user_id,
        "lesson_id": lesson_id,
        "course_id": lesson["course_id"],
        "path_id": path_id,
        "completed": True,
        "completed_at": datetime.now(timezone.utc).isoformat(),
    }, on_conflict="user_id,lesson_id").execute()

    next_lesson = supabase_admin.table("lessons").select("id").eq("course_id", lesson["course_id"]).eq("order", lesson.get("order", 0) + 1).maybe_single().execute()
    next_lesson_id = next_lesson.data.get("id") if next_lesson.data else None

    return {
        "success": True,
        "next_lesson_id": next_lesson_id,
    }
