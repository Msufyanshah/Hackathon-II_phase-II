# Quickstart Guide: Phase II Overview - Spec-Driven Todo Application

**Date**: 2026-01-27
**Feature**: Phase II Overview - Spec-Driven Todo Application
**Branch**: 001-phase-ii-overview

## Overview

This guide provides quick instructions for setting up, developing, and deploying the Phase II Todo application. Follow these steps to get the application running locally and understand the development workflow.

## Prerequisites

- Node.js 18+ (for frontend development)
- Python 3.11+ (for backend development)
- PostgreSQL client tools
- Git
- Docker (optional, for containerized development)
- A Neon Serverless PostgreSQL account

## Environment Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env
# Edit .env with your configuration
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your configuration
```

## Configuration

### Backend Configuration (.env)

```env
# Database
DATABASE_URL="postgresql://username:password@ep-xxxxxx.us-east-1.aws.neon.tech/dbname?sslmode=require"

# Authentication
SECRET_KEY="your-super-secret-key-here"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7

# CORS
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:3001,https://yourdomain.vercel.app"

# Logging
LOG_LEVEL="INFO"
```

### Frontend Configuration (.env)

```env
# Backend API URL
NEXT_PUBLIC_API_BASE_URL="http://localhost:8000/api"
NEXT_PUBLIC_AUTH_BASE_URL="http://localhost:8000/auth"

# Authentication
NEXT_PUBLIC_JWT_SECRET="same-as-backend-secret"
```

## Database Setup

### 1. Set up Neon PostgreSQL

1. Create a Neon account at https://neon.tech/
2. Create a new project
3. Get the connection string from the project dashboard
4. Update DATABASE_URL in your backend .env file

### 2. Run Database Migrations

```bash
# From backend directory
cd src/database
python migrate.py
```

Or using Alembic:

```bash
# From backend directory
alembic upgrade head
```

## Running Locally

### 1. Start Backend

```bash
# From backend directory
cd src
uvicorn main:app --reload --port 8000
```

The backend will be available at `http://localhost:8000`

### 2. Start Frontend

```bash
# From frontend directory
npm run dev
```

The frontend will be available at `http://localhost:3000`

### 3. API Documentation

Backend API documentation available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Development Workflow

### 1. Feature Development Process

1. **Specification**: Ensure feature is specified in `/specs/`
2. **Planning**: Generate tasks from specification using `/sp.tasks`
3. **Implementation**: Implement tasks following constitutional requirements
4. **Testing**: Write and run tests for all changes
5. **Documentation**: Update relevant documentation

### 2. API Contract First Development

1. Define API contracts in `/specs/contracts/`
2. Generate backend code from contracts
3. Generate frontend API clients from contracts
4. Implement business logic following contract specifications

### 3. Testing Strategy

```bash
# Backend tests
cd backend
pytest tests/unit/     # Unit tests
pytest tests/int/      # Integration tests
pytest tests/contract/ # Contract tests

# Frontend tests
cd frontend
npm run test:unit      # Unit tests
npm run test:int       # Integration tests
npm run test:e2e       # End-to-end tests
```

## Deployment

### 1. Backend Deployment to Hugging Face Spaces

1. Create a Space in Hugging Face
2. Configure the Space with required environment variables
3. Push code to the Space repository
4. Hugging Face will automatically build and deploy

### 2. Frontend Deployment to Vercel

1. Connect Vercel to your GitHub repository
2. Configure environment variables in Vercel dashboard
3. Set build command: `npm run build`
4. Set output directory: `out` (for Next.js)

## Architecture Overview

### Backend Logical Layers

The backend is organized into four distinct layers:

1. **Domain Models** (`models/`): SQLModel entities representing business objects
2. **API Handlers** (`api/`): FastAPI route handlers implementing contract endpoints
3. **Persistence Logic** (`database/`, `services/`): Database services managing CRUD operations
4. **Authentication Verification** (`utils/security.py`, `services/auth_service.py`): JWT validation and authorization

### Frontend Logical Layers

The frontend is organized into three distinct layers:

1. **UI Components** (`components/`, `pages/`): React components for user interface presentation
2. **Authentication Guards** (`components/AuthGuard.jsx`, `utils/auth.js`): Middleware ensuring authorized access
3. **API Consumption** (`services/api.js`, `services/auth.js`): Service layer handling HTTP requests

## Key Commands

### Backend Commands

```bash
# Run development server
uvicorn src.main:app --reload

# Run tests
pytest

# Format code
black src/

# Lint code
flake8 src/

# Generate API documentation
python -m src.api.generate_docs
```

### Frontend Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Format code
npm run format

# Lint code
npm run lint
```

## Troubleshooting

### Common Issues

1. **Database Connection Errors**:
   - Verify Neon PostgreSQL connection string
   - Check firewall settings
   - Ensure SSL mode is set to require

2. **Authentication Failures**:
   - Verify SECRET_KEY matches between frontend and backend
   - Check token expiration settings
   - Validate CORS configuration

3. **Contract Violations**:
   - Verify API calls match contract specifications
   - Check request/response schemas
   - Ensure proper authentication headers

### Debugging Tips

1. Enable debug logging by setting LOG_LEVEL=DEBUG
2. Use the API documentation to verify request formats
3. Check browser developer tools for frontend errors
4. Monitor server logs for backend issues

## Next Steps

1. Review the data model in `/specs/data-model.md`
2. Examine API contracts in `/specs/contracts/`
3. Look at implementation tasks in `/specs/tasks.md` (when generated)
4. Follow the architectural guidelines in the constitution

This quickstart guide provides the essential information to begin development on the Phase II Todo application while adhering to constitutional requirements.