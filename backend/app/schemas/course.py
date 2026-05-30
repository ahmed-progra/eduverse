from pydantic import BaseModel


class PathResponse(BaseModel):
    id: int
    slug: str
    title: str
    description: str | None = None
    icon: str | None = None
    color: str | None = None
    order: int


class CourseResponse(BaseModel):
    id: int
    path_id: int
    slug: str
    title: str
    description: str | None = None
    difficulty: str | None = None
    estimated_hours: int | None = None
    order: int
    completed_lessons: int = 0
    total_lessons: int = 0


class LessonResponse(BaseModel):
    id: int
    course_id: int
    title: str
    description: str | None = None
    order: int
    lesson_type: str | None = None
    estimated_minutes: int | None = None
