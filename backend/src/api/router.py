from fastapi import APIRouter

from . import auth, tasks, users

# Create main API router
router = APIRouter()

# Include authentication routes
router.include_router(auth.router, prefix="/auth", tags=["auth"])

# Include user routes (handles /users/me endpoint)
router.include_router(users.router, prefix="/users", tags=["users"])

# Include task routes under users prefix to match OpenAPI spec:
# /api/users/{user_id}/tasks instead of /api/tasks/{user_id}/tasks
router.include_router(tasks.router, prefix="/users", tags=["tasks"])
