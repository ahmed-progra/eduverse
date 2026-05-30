import random
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status

from app.core.security import get_current_user
from app.core.supabase import supabase_admin
from app.schemas.exam import (
    AttemptResponse,
    ExamResponse,
    ExamResultResponse,
    ExamSubmitRequest,
    QuestionResponse,
)
from app.services.exam_service import calculate_score

router = APIRouter(prefix="/api/exams", tags=["exams"])


@router.get("/{exam_id}", response_model=ExamResponse)
async def get_exam(exam_id: int, current_user: dict = Depends(get_current_user)):
    exam_resp = supabase_admin.table("exams").select("*").eq("id", exam_id).single().execute()
    exam = exam_resp.data
    if not exam:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Exam not found")

    questions_resp = supabase_admin.table("questions").select("id, exam_id, question_text, options, question_type, points, order").eq("exam_id", exam_id).order("order").execute()
    questions = questions_resp.data

    random.shuffle(questions)

    return ExamResponse(
        id=exam["id"],
        course_id=exam.get("course_id"),
        lesson_id=exam.get("lesson_id"),
        title=exam["title"],
        description=exam.get("description"),
        exam_type=exam["exam_type"],
        time_limit_minutes=exam.get("time_limit_minutes"),
        passing_score=exam["passing_score"],
        questions=[QuestionResponse(**q) for q in questions],
    )


@router.post("/{exam_id}/submit", response_model=ExamResultResponse)
async def submit_exam(exam_id: int, request: ExamSubmitRequest, current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("sub")

    exam_resp = supabase_admin.table("exams").select("id").eq("id", exam_id).single().execute()
    if not exam_resp.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Exam not found")

    result = await calculate_score(request.answers, exam_id)

    supabase_admin.table("exam_attempts").insert({
        "user_id": user_id,
        "exam_id": exam_id,
        "score": result.score,
        "total_points": result.total_points,
        "percentage": result.percentage,
        "passed": result.passed,
        "answers": request.answers,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }).execute()

    return result


@router.get("/{exam_id}/attempts", response_model=list[AttemptResponse])
async def get_exam_attempts(exam_id: int, current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("sub")

    exam_resp = supabase_admin.table("exams").select("id").eq("id", exam_id).single().execute()
    if not exam_resp.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Exam not found")

    attempts_resp = supabase_admin.table("exam_attempts").select("*").eq("user_id", user_id).eq("exam_id", exam_id).order("created_at", desc=True).execute()

    return [
        AttemptResponse(
            id=a["id"],
            exam_id=a["exam_id"],
            score=a["score"],
            total_points=a["total_points"],
            percentage=a["percentage"],
            passed=a["passed"],
            answers=a.get("answers"),
            created_at=a["created_at"],
        )
        for a in attempts_resp.data
    ]
