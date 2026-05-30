from pydantic import BaseModel


class CourseProgress(BaseModel):
    course_id: int
    course_title: str
    completed_lessons: int
    total_lessons: int
    percentage: float


class PathProgress(BaseModel):
    path_id: int
    path_title: str
    completed_lessons: int
    total_lessons: int
    percentage: float
    courses: list[CourseProgress]


class DashboardResponse(BaseModel):
    total_lessons_completed: int
    total_lessons: int
    overall_percentage: float
    streak_days: int
    last_lesson_id: int | None = None
    last_lesson_title: str | None = None
    last_activity: str | None = None
    paths: list[PathProgress]
