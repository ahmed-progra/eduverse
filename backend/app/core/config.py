from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    SUPABASE_URL: str = ""
    SUPABASE_SERVICE_KEY: str = ""
    SUPABASE_ANON_KEY: str = ""
    ANTHROPIC_API_KEY: str = ""
    JWT_SECRET: str = ""
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    ENVIRONMENT: str = "development"
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/eduverse"

    model_config = {"env_file": ".env", "case_sensitive": True}

    @property
    def effective_service_key(self) -> str:
        if self.SUPABASE_SERVICE_KEY:
            return self.SUPABASE_SERVICE_KEY
        if self.ENVIRONMENT == "development":
            return self.SUPABASE_ANON_KEY
        raise ValueError("SUPABASE_SERVICE_KEY must be set in production")


settings = Settings()
