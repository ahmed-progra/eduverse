from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    SUPABASE_URL: str = "https://frafepicpxiabgtezej.supabase.co"
    SUPABASE_SERVICE_KEY: str = ""
    SUPABASE_ANON_KEY: str = "sb_publishable_JfOsGyO6w2HL9_DL3v7yyg_ubc4c-eZ"
    ANTHROPIC_API_KEY: str = ""
    JWT_SECRET: str = ""
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    ENVIRONMENT: str = "development"
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/eduverse"

    model_config = {"env_file": ".env", "case_sensitive": True}


settings = Settings()
