from datetime import datetime, timedelta

from app.core.database import get_conn


async def get_dashboard(user_id: str) -> dict:
    conn = get_conn()
    try:
        lessons = [dict(r) for r in conn.execute(
            'SELECT "id", "course_id", "title" FROM "lessons"'
        ).fetchall()]

        courses_map = {}
        for c in conn.execute('SELECT "id", "path_id", "title" FROM "courses"').fetchall():
            courses_map[c["id"]] = dict(c)

        paths_map = {}
        for p in conn.execute('SELECT "id", "title" FROM "learning_paths"').fetchall():
            paths_map[p["id"]] = dict(p)

        user_progress = [dict(r) for r in conn.execute(
            'SELECT * FROM "user_progress" WHERE "user_id" = ?', [user_id]
        ).fetchall()]
        completed = [p for p in user_progress if p.get("completed")]

        total_lessons = len(lessons)
        total_completed = len(completed)

        path_data = {}
        for lesson in lessons:
            course = courses_map.get(lesson["course_id"])
            if not course:
                continue
            path = paths_map.get(course["path_id"])
            if not path:
                continue
            pid = path["id"]
            if pid not in path_data:
                path_data[pid] = {
                    "path_id": pid,
                    "path_title": path["title"],
                    "completed_lessons": 0,
                    "total_lessons": 0,
                    "courses": {},
                }
            path_data[pid]["total_lessons"] += 1
            cid = course["id"]
            if cid not in path_data[pid]["courses"]:
                path_data[pid]["courses"][cid] = {
                    "course_id": cid,
                    "course_title": course["title"],
                    "completed_lessons": 0,
                    "total_lessons": 0,
                }
            path_data[pid]["courses"][cid]["total_lessons"] += 1

        completed_lesson_ids = {p["lesson_id"] for p in completed}
        for lesson in lessons:
            if lesson["id"] in completed_lesson_ids:
                course = courses_map.get(lesson["course_id"])
                if not course:
                    continue
                path = paths_map.get(course["path_id"])
                if not path:
                    continue
                pid = path["id"]
                cid = course["id"]
                if pid in path_data:
                    path_data[pid]["completed_lessons"] += 1
                    if cid in path_data[pid]["courses"]:
                        path_data[pid]["courses"][cid]["completed_lessons"] += 1

        paths = []
        for pdata in path_data.values():
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
        last_lesson, last_activity = None, None
        if completed_sorted:
            last_lesson_id = completed_sorted[0].get("lesson_id")
            last_activity = completed_sorted[0].get("completed_at")
            if last_lesson_id:
                ll = conn.execute(
                    'SELECT "id", "title" FROM "lessons" WHERE "id" = ?', [last_lesson_id]
                ).fetchone()
                if ll:
                    last_lesson = dict(ll)

        streak_days = 0
        if completed_sorted:
            today = datetime.utcnow().date()
            dates = set()
            for p in completed:
                if p.get("completed_at"):
                    try:
                        d = datetime.fromisoformat(p["completed_at"].replace("Z", "+00:00")).date()
                        dates.add(d)
                    except (ValueError, TypeError):
                        pass
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
    finally:
        conn.close()
