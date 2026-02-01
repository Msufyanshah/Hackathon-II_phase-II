from fastapi import APIRouter
from . import auth, users, tasks

# Create main API router
router = APIRouter()

# Include authentication routes
router.include_router(auth.router, prefix="/auth", tags=["auth"])

# Include user routes
router.include_router(users.router, prefix="/users", tags=["users"])

# Include task routes
router.include_router(tasks.router, prefix="/tasks", tags=["tasks"])