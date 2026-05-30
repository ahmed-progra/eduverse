from fastapi import APIRouter, Depends, HTTPException, status

from app.core.security import get_current_user, oauth2_scheme
from app.core.supabase import get_supabase_client, supabase_admin
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
async def signup(request: SignupRequest):
    sanitized = sanitize_html(request.full_name)

    auth_resp = supabase_admin.auth.admin.create_user(
        email=request.email,
        password=request.password,
        email_confirm=False,
    )

    user_id = auth_resp.user.id

    supabase_admin.table("profiles").insert({
        "id": user_id,
        "email": request.email,
        "username": request.username,
        "full_name": sanitized,
        "avatar_url": None,
    }).execute()

    return {
        "message": "User created successfully. Please check your email to verify your account.",
        "user_id": user_id,
    }


@router.post("/login", response_model=AuthResponse)
@limiter.limit("10/minute")
async def login(request: LoginRequest):
    try:
        auth_resp = supabase_admin.auth.sign_in_with_password(
            email=request.email,
            password=request.password,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    user = auth_resp.user
    session = auth_resp.session

    profile_resp = supabase_admin.table("profiles").select("*").eq("id", user.id).single().execute()
    profile = profile_resp.data

    return AuthResponse(
        access_token=session.access_token,
        token_type="bearer",
        user=UserResponse(
            id=user.id,
            email=user.email,
            username=profile.get("username", ""),
            full_name=profile.get("full_name", ""),
            avatar_url=profile.get("avatar_url"),
        ),
    )


@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout(token: str = Depends(oauth2_scheme), current_user: dict = Depends(get_current_user)):
    user_client = get_supabase_client(token)
    try:
        user_client.auth.sign_out()
    except Exception:
        pass
    return {"message": "Logged out successfully"}


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("sub")
    profile_resp = supabase_admin.table("profiles").select("*").eq("id", user_id).single().execute()
    profile = profile_resp.data
    return UserResponse(
        id=user_id,
        email=current_user.get("email", profile.get("email", "")),
        username=profile.get("username", ""),
        full_name=profile.get("full_name", ""),
        avatar_url=profile.get("avatar_url"),
    )
