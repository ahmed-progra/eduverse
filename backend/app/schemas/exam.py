from datetime import datetime

from pydantic import BaseModel


class QuestionResponse(BaseModel):
    id: int
    exam_id: int
    question_text: str
    options: list | dict
    question_type: str
    points: int
    order: int


class ExamResponse(BaseModel):
    id: int
    course_id: int | None = None
    lesson_id: int | None = None
    title: str
    description: str | None = None
    exam_type: str
    time_limit_minutes: int | None = None
    passing_score: int
    questions: list[QuestionResponse]


class ExamSubmitRequest(BaseModel):
    answers: dict


class QuestionResult(BaseModel):
    question_id: int
    question_text: str
    correct_answer: str | list | dict
    user_answer: str | list | dict
    explanation: str | None = None
    is_correct: bool
    points: int
    points_earned: int


class ExamResultResponse(BaseModel):
    exam_id: int
    score: int
    total_points: int
    percentage: float
    passed: bool
    results: list[QuestionResult]


class AttemptResponse(BaseModel):
    id: int
    exam_id: int
    score: int
    total_points: int
    percentage: float
    passed: bool
    answers: dict | None = None
    created_at: datetime
