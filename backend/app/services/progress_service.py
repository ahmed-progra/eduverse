from datetime import datetime, timedelta

from app.core.supabase import supabase_admin


async def get_dashboard(user_id: str) -> dict:
    user_progress = supabase_admin.table("user_progress").select("*").eq("user_id", user_id).execute()
    completed = [p for p in user_progress if p.get("completed")]

    all_lessons = supabase_admin.table("lessons").select("id, course_id, title, courses!inner(id, title, path_id, learning_paths!inner(id, title))").execute()

    total_lessons = len(all_lessons)
    total_completed = len(completed)

    path_map = {}
    for lesson in all_lessons:
        course = lesson.get("courses", {})
        path = course.get("learning_paths", {})
        pid = path.get("id")
        if pid not in path_map:
            path_map[pid] = {
                "path_id": pid,
                "path_title": path.get("title", ""),
                "completed_lessons": 0,
                "total_lessons": 0,
                "courses": {},
            }
        path_map[pid]["total_lessons"] += 1
        cid = course.get("id")
        if cid not in path_map[pid]["courses"]:
            path_map[pid]["courses"][cid] = {
                "course_id": cid,
                "course_title": course.get("title", ""),
                "completed_lessons": 0,
                "total_lessons": 0,
            }
        path_map[pid]["courses"][cid]["total_lessons"] += 1

    completed_lesson_ids = {p["lesson_id"] for p in completed}
    for lesson in all_lessons:
        if lesson["id"] in completed_lesson_ids:
            course = lesson.get("courses", {})
            path = course.get("learning_paths", {})
            pid = path.get("id")
            cid = course.get("id")
            if pid in path_map:
                path_map[pid]["completed_lessons"] += 1
                if cid in path_map[pid]["courses"]:
                    path_map[pid]["courses"][cid]["completed_lessons"] += 1

    paths = []
    for pdata in path_map.values():
        courses = []
        for cdata in pdata["courses"].values():
            courses.append({
                "course_id": cdata["course_id"],
                "course_title": cdata["course_title"],
                "completed_lessons": cdata["completed_lessons"],
                "total_lessons": cdata["total_lessons"],
                "percentage": round((cdata["completed_lessons"] / cdata["total_lessons"] * 100), 2) if cdata["total_lessons"] > 0 else 0,
            })
        paths.append({
            "path_id": pdata["path_id"],
            "path_title": pdata["path_title"],
            "completed_lessons": pdata["completed_lessons"],
            "total_lessons": pdata["total_lessons"],
            "percentage": round((pdata["completed_lessons"] / pdata["total_lessons"] * 100), 2) if pdata["total_lessons"] > 0 else 0,
            "courses": courses,
        })

    completed_sorted = sorted(completed, key=lambda x: x.get("completed_at", ""), reverse=True)
    last_lesson = None
    last_activity = None
    if completed_sorted:
        last_lesson_id = completed_sorted[0].get("lesson_id")
        last_activity = completed_sorted[0].get("completed_at")
        if last_lesson_id:
            last_lesson = supabase_admin.table("lessons").select("id, title").eq("id", last_lesson_id).execute_single()

    streak_days = 0
    if completed_sorted:
        today = datetime.utcnow().date()
        dates = set()
        for p in completed:
            if p.get("completed_at"):
                d = datetime.fromisoformat(p["completed_at"].replace("Z", "+00:00")).date()
                dates.add(d)
        check_date = today
        while check_date in dates:
            streak_days += 1
            check_date -= timedelta(days=1)

    return {
        "total_lessons_completed": total_completed,
        "total_lessons": total_lessons,
        "overall_percentage": round((total_completed / total_lessons * 100), 2) if total_lessons > 0 else 0,
        "streak_days": streak_days,
        "last_lesson_id": last_lesson.get("id") if last_lesson else None,
        "last_lesson_title": last_lesson.get("title") if last_lesson else None,
        "last_activity": last_activity,
        "paths": paths,
    }
