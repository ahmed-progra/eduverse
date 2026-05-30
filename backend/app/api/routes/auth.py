import uuid
from datetime import datetime, timedelta, timezone

import bcrypt as _bcrypt
from fastapi import APIRouter, Depends, HTTPException, Request, status
from jose import jwt

from app.core.config import settings
from app.core.database import get_conn
from app.core.security import get_current_user, oauth2_scheme
from app.middleware.rate_limiter import limiter
from app.schemas.auth import AuthResponse, LoginRequest, SignupRequest, UserResponse
from app.utils.sanitize import sanitize_html

router = APIRouter(prefix="/api/auth", tags=["auth"])


def _create_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "aud": "authenticated",
        "iat": datetime.now(timezone.utc),
        "exp": datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.ALGORITHM)


def _make_user_response(p: dict) -> UserResponse:
    return UserResponse(
        id=p["id"],
        email=p["email"],
        username=p.get("username", ""),
        full_name=p.get("full_name", ""),
        avatar_url=p.get("avatar_url"),
        xp=0,
        level=1,
        streak=0,
        created_at=p.get("created_at", ""),
    )


@router.post("/signup", status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute")
async def signup(request: Request, signup_req: SignupRequest):
    sanitized = sanitize_html(signup_req.full_name)
    user_id = str(uuid.uuid4())
    hashed = _bcrypt.hashpw(signup_req.password.encode(), _bcrypt.gensalt()).decode()

    conn = get_conn()
    try:
        existing = conn.execute("SELECT id FROM profiles WHERE email = ?", [signup_req.email]).fetchone()
        if existing:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

        now = datetime.now(timezone.utc).isoformat()
        conn.execute(
            "INSERT INTO profiles (id, email, username, full_name, avatar_url, created_at) VALUES (?, ?, ?, ?, ?, ?)",
            [user_id, signup_req.email, signup_req.username, sanitized, None, now],
        )
        conn.commit()

        token = _create_token(user_id, signup_req.email)
        user = _make_user_response({
            "id": user_id,
            "email": signup_req.email,
            "username": signup_req.username,
            "full_name": sanitized,
            "avatar_url": None,
            "created_at": now,
        })

        return {
            "message": "User created successfully",
            "user_id": user_id,
            "access_token": token,
            "token_type": "bearer",
            "user": user,
        }
    finally:
        conn.close()


@router.post("/login", response_model=AuthResponse)
@limiter.limit("10/minute")
async def login(request: Request, login_req: LoginRequest):
    conn = get_conn()
    try:
        profile = conn.execute(
            "SELECT * FROM profiles WHERE email = ?", [login_req.email],
        ).fetchone()
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )

        user = dict(profile)
        token = _create_token(user["id"], user["email"])

        return AuthResponse(
            access_token=token,
            token_type="bearer",
            user=_make_user_response(user),
        )
    finally:
        conn.close()


@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout(token: str = Depends(oauth2_scheme), current_user: dict = Depends(get_current_user)):
    return {"message": "Logged out successfully"}


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("sub")
    conn = get_conn()
    try:
        profile = conn.execute("SELECT * FROM profiles WHERE id = ?", [user_id]).fetchone()
        if not profile:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        return _make_user_response(dict(profile))
    finally:
        conn.close()
