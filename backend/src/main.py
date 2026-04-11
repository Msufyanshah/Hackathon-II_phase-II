from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from .api import router as api_router
from .core.config import settings
from .database.database import create_db_and_tables
from .middleware.observability import MetricsMiddleware, RequestLoggingMiddleware
from .utils.error_handling import register_exception_handlers
from .utils.logging_config import get_logger, setup_logging

# Initialize logging
logger = get_logger(__name__)
setup_logging(level=settings.LOG_LEVEL, structured=False)


# Rate limiter configuration
def rate_limiter():
    from slowapi import Limiter

    return Limiter(key_func=get_remote_address, default_limits=["100/minute"])


limiter = rate_limiter()

# Global metrics instance
metrics_middleware = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan event handler to initialize database tables on startup
    """
    global metrics_middleware
    logger.info("Starting up Todo Application API...")
    # Initialize database tables
    create_db_and_tables()
    logger.info("Database tables initialized successfully")
    yield
    # Cleanup operations
    logger.info("Shutting down Todo Application API...")


# Create FastAPI app instance
app = FastAPI(
    title="Todo Application API",
    description="REST API for the Spec-Driven Todo Application with JWT authentication and user data isolation",
    version="1.0.0",
    openapi_url="/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# Add rate limiter to app state
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Register exception handlers
register_exception_handlers(app)

# Add middleware
app.add_middleware(RequestLoggingMiddleware)

# Add metrics middleware and keep reference
metrics_middleware = MetricsMiddleware(app)
app.add_middleware(MetricsMiddleware)

# REFINED CORS middleware with dynamic origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes (without extra tag to avoid duplicates in Swagger)
app.include_router(api_router, prefix="/api")


@app.get("/")
async def root():
    """
    Root endpoint for health check
    """
    logger.info("Root endpoint accessed")
    return {"message": "Todo Application Backend API", "status": "running"}


@app.get("/health")
async def health_check():
    """
    Health check endpoint
    """
    return {"status": "healthy", "service": "backend-api"}


@app.get("/metrics")
async def get_metrics():
    """
    Metrics endpoint for monitoring
    Returns request counts, response times, and error rates
    """
    # Get metrics from the last middleware instance
    if hasattr(app, "user_middleware") and app.user_middleware:
        for middleware in app.user_middleware:
            if isinstance(middleware.cls, MetricsMiddleware):
                return {"metrics": middleware.cls(None).get_metrics()}

    # Fallback: return empty metrics
    return {
        "metrics": {
            "requests": {"total": 0, "by_method": {}, "by_status": {}},
            "response_times": {
                "avg_ms": 0,
                "p50_ms": 0,
                "p95_ms": 0,
                "p99_ms": 0,
                "samples": 0,
            },
            "errors": {"total": 0, "rate": 0},
        }
    }
