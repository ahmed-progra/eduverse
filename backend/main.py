from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.api.routes import auth, courses, lessons, exams, progress, ai
from app.core.config import settings
from app.middleware.cors import setup_cors
from app.middleware.rate_limiter import setup_rate_limiter
from app.middleware.security_headers import SecurityHeadersMiddleware


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


app = FastAPI(
    title="EduVerse API",
    description="Educational platform backend",
    version="1.0.0",
    lifespan=lifespan,
)

setup_cors(app)
setup_rate_limiter(app)
app.add_middleware(SecurityHeadersMiddleware)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    if settings.ENVIRONMENT == "development":
        raise exc
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred"},
    )


app.include_router(auth.router)
app.include_router(courses.router)
app.include_router(lessons.router)
app.include_router(exams.router)
app.include_router(progress.router)
app.include_router(ai.router)


@app.get("/api/health")
async def health_check():
    return {"status": "ok", "environment": settings.ENVIRONMENT}
