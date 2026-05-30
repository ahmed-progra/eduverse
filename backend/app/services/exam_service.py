from app.core.database import get_conn
from app.schemas.exam import ExamResultResponse, QuestionResult


async def calculate_score(answers: dict, exam_id: int) -> ExamResultResponse:
    conn = get_conn()
    try:
        questions = [dict(r) for r in conn.execute(
            'SELECT * FROM "questions" WHERE "exam_id" = ?', [exam_id]
        ).fetchall()]

        total_points = sum(q["points"] for q in questions)
        earned_points = 0
        results = []

        for q in questions:
            qid = str(q["id"])
            user_answer = answers.get(qid)
            correct = q["correct_answer"]
            is_correct = str(user_answer).strip().lower() == str(correct).strip().lower()
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

        exam_row = conn.execute(
            'SELECT "passing_score" FROM "exams" WHERE "id" = ?', [exam_id]
        ).fetchone()
        passing_score = exam_row["passing_score"] if exam_row else 70

        return ExamResultResponse(
            exam_id=exam_id,
            score=earned_points,
            total_points=total_points,
            percentage=percentage,
            passed=percentage >= passing_score,
            results=results,
        )
    finally:
        conn.close()
