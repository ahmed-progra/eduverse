from fastapi import APIRouter, Depends

from app.core.security import get_current_user
from app.schemas.progress import DashboardResponse
from app.services.progress_service import get_dashboard

router = APIRouter(prefix="/api/progress", tags=["progress"])


@router.get("/dashboard", response_model=DashboardResponse)
async def get_dashboard_route(current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("sub")
    dashboard_data = await get_dashboard(user_id)
    return DashboardResponse(**dashboard_data)
