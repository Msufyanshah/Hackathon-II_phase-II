# Hackathon II - Phase II Todo Application

This is a full-stack todo application developed as part of Hackathon II - Phase II, featuring a Next.js frontend deployed on Vercel and a FastAPI backend deployed on Hugging Face Spaces.

## 🚀 Live Demo

[:globe_with_meridians: **View Live Frontend Application**](https://frontend-nvs7el7k7-muhammad-sufyans-projects-fa6b4cf9.vercel.app)

## 🏗️ Architecture

- **Frontend**: Next.js 14+ with App Router, deployed on Vercel
- **Backend**: FastAPI with SQLModel ORM, deployed on Hugging Face Spaces
- **Database**: Neon Serverless PostgreSQL
- **Authentication**: JWT-based with user data isolation

## 🎯 Features

- User authentication (Login/Register)
- Secure todo management (Create, Read, Update, Delete)
- Task completion tracking
- User data isolation
- Responsive design for all device sizes
- Modern UI with accessibility features
- API contract compliance

## 🛠️ Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **Backend**: FastAPI, SQLModel, Pydantic
- **Styling**: Tailwind CSS
- **UI Components**: Custom-built component library
- **Deployment**: Vercel (Frontend), Hugging Face Spaces (Backend)
- **Database**: Neon Serverless PostgreSQL

## 📋 Project Structure

```
backend/                 # FastAPI backend service
├── src/
│   ├── api/             # API route handlers
│   ├── models/          # SQLModel database models
│   ├── database/        # Database services and session management
│   ├── schemas/         # Pydantic request/response schemas
│   ├── utils/           # Utility functions (security, password hashing)
│   └── core/            # Core configuration
frontend/                # Next.js frontend application
├── src/
│   ├── app/             # App Router pages
│   ├── components/      # Reusable UI components
│   ├── contexts/        # React Context providers
│   ├── lib/             # Utilities and type definitions
│   └── styles/          # Global styles
specs/                   # Project specifications
├── 001-phase-ii-overview/ # Feature specifications
├── 002-backend-api/     # Backend API specifications
└── contracts/           # API contracts (openapi.yaml)
```

## 🚀 Quick Start

### Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `pip install -r requirements.txt`
3. Set up environment variables: `cp .env.example .env` and edit with your configuration
4. Run the development server: `uvicorn src.main:app --reload`

### Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`

## 🤝 Contributing

This project was developed using Claude Code for AI-assisted development following Spec-Driven Development principles.

## 📄 License

This project is part of the Hackathon II competition.