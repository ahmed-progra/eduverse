from fastapi import APIRouter, Depends, HTTPException, status

from app.core.security import get_current_user
from app.core.supabase import supabase_admin
from app.schemas.course import CourseResponse, LessonResponse, PathResponse

router = APIRouter(prefix="/api", tags=["courses"])


@router.get("/paths", response_model=list[PathResponse])
async def get_paths(current_user: dict = Depends(get_current_user)):
    return supabase_admin.table("learning_paths").select("*").eq("is_active", True).order("order").execute()


@router.get("/paths/{path_slug}/courses", response_model=list[CourseResponse])
async def get_path_courses(path_slug: str, current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("sub")

    path = supabase_admin.table("learning_paths").select("id").eq("slug", path_slug).eq("is_active", True).execute_single()
    if not path:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Path not found")

    courses = supabase_admin.table("courses").select("*").eq("path_id", path["id"]).eq("is_active", True).order("order").execute()

    result = []
    for course in courses:
        lessons = supabase_admin.table("lessons").select("id").eq("course_id", course["id"]).execute()
        total = len(lessons)

        user_lessons = supabase_admin.table("user_progress").select("lesson_id").eq("user_id", user_id).eq("completed", True).in_("lesson_id", [l["id"] for l in lessons] if lessons else [-1]).execute()
        completed_count = len(user_lessons)

        result.append(CourseResponse(
            id=course["id"],
            path_id=course["path_id"],
            slug=course["slug"],
            title=course["title"],
            description=course.get("description"),
            difficulty=course.get("difficulty"),
            estimated_hours=course.get("estimated_hours"),
            order=course["order"],
            completed_lessons=completed_count,
            total_lessons=total,
        ))

    return result


@router.get("/courses/{course_slug}", response_model=dict)
async def get_course(course_slug: str, current_user: dict = Depends(get_current_user)):
    course = supabase_admin.table("courses").select("*").eq("slug", course_slug).eq("is_active", True).execute_single()
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")

    lessons = supabase_admin.table("lessons").select("id, course_id, title, description, order, lesson_type, estimated_minutes").eq("course_id", course["id"]).order("order").execute()

    return {
        "id": course["id"],
        "path_id": course["path_id"],
        "slug": course["slug"],
        "title": course["title"],
        "description": course.get("description"),
        "difficulty": course.get("difficulty"),
        "estimated_hours": course.get("estimated_hours"),
        "order": course["order"],
        "lessons": lessons,
    }
