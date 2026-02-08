import os
from pydantic_settings import BaseSettings
from typing import List, Optional
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class Settings(BaseSettings):
    # Database settings
    DATABASE_URL: str = os.getenv("DATABASE_URL", "")

    # Authentication settings
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-super-secret-key-change-in-production")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "15"))
    REFRESH_TOKEN_EXPIRE_DAYS: int = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))
    ACCESS_TOKEN_TYPE: str = os.getenv("ACCESS_TOKEN_TYPE", "bearer")

    # CORS settings - parse comma-separated string into list
    @property
    def ALLOWED_ORIGINS(self) -> List[str]:
        origins_str = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:3001,https://frontend-nvs7el7k7-muhammad-sufyans-projects-fa6b4cf9.vercel.app")
        return [origin.strip() for origin in origins_str.split(",") if origin.strip()]

    # Logging settings
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")

    # Application settings
    PROJECT_NAME: str = "Todo Application Backend API"
    API_V1_STR: str = "/v1"

    class Config:
        case_sensitive = True


settings = Settings()