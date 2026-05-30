from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status

from app.core.database import get_conn
from app.core.security import get_current_user
from app.core.supabase import supabase_admin

router = APIRouter(prefix="/api/lessons", tags=["lessons"])


@router.get("/{lesson_id}")
async def get_lesson(lesson_id: int, current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("sub")
    lesson = supabase_admin.table("lessons").select("*").eq("id", lesson_id).execute_single()
    if not lesson:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lesson not found")

    conn = get_conn()
    try:
        progress = conn.execute(
            'SELECT "completed" FROM "user_progress" WHERE "user_id" = ? AND "lesson_id" = ?',
            [user_id, lesson_id],
        ).fetchone()
    finally:
        conn.close()

    is_completed = bool(progress and progress["completed"])

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
    conn = get_conn()
    try:
        lesson = conn.execute(
            'SELECT "id", "course_id", "order" FROM "lessons" WHERE "id" = ?', [lesson_id]
        ).fetchone()
        if not lesson:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lesson not found")

        course = conn.execute(
            'SELECT "id", "path_id" FROM "courses" WHERE "id" = ?', [lesson["course_id"]]
        ).fetchone()

        conn.execute(
            'INSERT INTO "user_progress" ("user_id", "lesson_id", "course_id", "path_id", "completed", "completed_at") VALUES (?, ?, ?, ?, 1, ?) ON CONFLICT("user_id", "lesson_id") DO UPDATE SET "completed" = 1, "completed_at" = ?',
            [user_id, lesson_id, lesson["course_id"], course["path_id"] if course else None, datetime.now(timezone.utc).isoformat(), datetime.now(timezone.utc).isoformat()],
        )
        conn.commit()

        next_lesson = conn.execute(
            'SELECT "id" FROM "lessons" WHERE "course_id" = ? AND "order" = ?',
            [lesson["course_id"], lesson["order"] + 1],
        ).fetchone()
        next_lesson_id = next_lesson["id"] if next_lesson else None

        return {"success": True, "next_lesson_id": next_lesson_id}
    finally:
        conn.close()
