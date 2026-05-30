import httpx
from fastapi import APIRouter, Depends, HTTPException, Request, status

from app.core.config import settings
from app.core.security import get_current_user, oauth2_scheme
from app.core.supabase import supabase_admin
from app.middleware.rate_limiter import limiter
from app.schemas.auth import (
    AuthResponse,
    LoginRequest,
    SignupRequest,
    UserResponse,
)
from app.utils.sanitize import sanitize_html

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/signup", status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute")
async def signup(request: Request, signup_req: SignupRequest):
    sanitized = sanitize_html(signup_req.full_name)

    url = f"{settings.SUPABASE_URL}/auth/v1/admin/users"
    headers = {"apikey": settings.SUPABASE_ANON_KEY, "Authorization": f"Bearer {settings.effective_service_key}"}
    resp = httpx.post(url, headers=headers, json={"email": signup_req.email, "password": signup_req.password, "email_confirm": False})
    resp.raise_for_status()
    user_data = resp.json()
    user_id = user_data["id"]

    supabase_admin.table("profiles").insert({
        "id": user_id,
        "email": signup_req.email,
        "username": signup_req.username,
        "full_name": sanitized,
        "avatar_url": None,
    })

    return {
        "message": "User created successfully. Please check your email to verify your account.",
        "user_id": user_id,
    }


@router.post("/login", response_model=AuthResponse)
@limiter.limit("10/minute")
async def login(request: Request, login_req: LoginRequest):
    url = f"{settings.SUPABASE_URL}/auth/v1/token?grant_type=password"
    headers = {"apikey": settings.SUPABASE_ANON_KEY, "Content-Type": "application/json"}
    resp = httpx.post(url, headers=headers, json={"email": login_req.email, "password": login_req.password})
    if resp.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    data = resp.json()

    user = data["user"]
    profile = supabase_admin.table("profiles").select("*").eq("id", user["id"]).execute_single()

    return AuthResponse(
        access_token=data["access_token"],
        token_type="bearer",
        user=UserResponse(
            id=user["id"],
            email=user["email"],
            username=profile.get("username", "") if profile else "",
            full_name=profile.get("full_name", "") if profile else "",
            avatar_url=profile.get("avatar_url") if profile else None,
        ),
    )


@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout(token: str = Depends(oauth2_scheme), current_user: dict = Depends(get_current_user)):
    return {"message": "Logged out successfully"}


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("sub")
    profile = supabase_admin.table("profiles").select("*").eq("id", user_id).execute_single()
    return UserResponse(
        id=user_id,
        email=current_user.get("email", profile.get("email", "") if profile else ""),
        username=profile.get("username", "") if profile else "",
        full_name=profile.get("full_name", "") if profile else "",
        avatar_url=profile.get("avatar_url") if profile else None,
    )
