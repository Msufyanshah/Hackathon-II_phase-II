# Todo Application Backend API

This is the backend service for the Todo Application, built with FastAPI and deployed on Hugging Face Spaces. The service provides a secure, authenticated API for managing todo tasks with proper user data isolation.

## Features

- FastAPI-based REST API with automatic OpenAPI documentation
- JWT-based authentication with user data isolation
- SQLModel ORM with Neon Serverless PostgreSQL
- Contract-first development following shared API contracts
- Hugging Face Spaces deployment ready

## Technologies

- **Framework**: FastAPI
- **ORM**: SQLModel
- **Database**: Neon Serverless PostgreSQL
- **Authentication**: JWT tokens with PyJWT
- **Deployment**: Hugging Face Spaces

## Setup

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. Run the development server:
   ```bash
   uvicorn src.main:app --reload
   ```

## API Documentation

Once running, API documentation is available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Deployment

The application is designed for deployment on Hugging Face Spaces. Simply push the code to a Space repository with the required environment variables configured.

## Architecture

The backend follows a clean architecture with distinct layers:
- **Domain Models**: SQLModel entities representing business objects
- **API Handlers**: FastAPI route handlers implementing contract endpoints
- **Persistence Logic**: Database services managing CRUD operations
- **Authentication Verification**: JWT validation and authorization services

## Contributing

This project follows constitutional requirements for spec-driven development. All changes must:
- Follow contract-first principles
- Maintain user data isolation
- Pass automated contract compliance tests
- Follow established architectural patterns