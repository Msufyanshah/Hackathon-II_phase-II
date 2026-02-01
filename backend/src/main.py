from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
from .core.config import settings
from .api import router as api_router
from .database.database import create_db_and_tables

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan event handler to initialize database tables on startup
    """
    # Initialize database tables
    create_db_and_tables()
    yield
    # Cleanup operations would go here if needed

# Create FastAPI app instance
app = FastAPI(
    title="Todo Application API",
    description="REST API for the Spec-Driven Todo Application with JWT authentication and user data isolation",
    version="1.0.0",
    openapi_url="/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix="/api", tags=["api"])

@app.get("/")
async def root():
    """
    Root endpoint for health check
    """
    return {"message": "Todo Application Backend API", "status": "running"}

@app.get("/health")
async def health_check():
    """
    Health check endpoint
    """
    return {"status": "healthy", "service": "backend-api"}