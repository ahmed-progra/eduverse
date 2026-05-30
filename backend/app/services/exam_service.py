from app.core.supabase import supabase_admin
from app.schemas.exam import ExamResultResponse, QuestionResult


async def calculate_score(answers: dict, exam_id: int) -> ExamResultResponse:
    questions_resp = supabase_admin.table("questions").select("*").eq("exam_id", exam_id).execute()
    questions = questions_resp.data

    total_points = sum(q["points"] for q in questions)
    earned_points = 0
    results = []

    for q in questions:
        qid = str(q["id"])
        user_answer = answers.get(qid)
        correct = q["correct_answer"]

        is_correct = str(user_answer).strip().lower() == str(correct).strip().lower()

        if isinstance(correct, list) and isinstance(user_answer, list):
            is_correct = sorted(correct) == sorted(user_answer)
        elif isinstance(correct, dict) and isinstance(user_answer, dict):
            is_correct = correct == user_answer

        points = q["points"] if is_correct else 0
        earned_points += points

        results.append(QuestionResult(
            question_id=q["id"],
            question_text=q["question_text"],
            correct_answer=correct,
            user_answer=user_answer,
            explanation=q.get("explanation"),
            is_correct=is_correct,
            points=q["points"],
            points_earned=points,
        ))

    percentage = round((earned_points / total_points * 100), 2) if total_points > 0 else 0

    exam_resp = supabase_admin.table("exams").select("passing_score").eq("id", exam_id).single().execute()
    passing_score = exam_resp.data.get("passing_score", 70)

    return ExamResultResponse(
        exam_id=exam_id,
        score=earned_points,
        total_points=total_points,
        percentage=percentage,
        passed=percentage >= passing_score,
        results=results,
    )
