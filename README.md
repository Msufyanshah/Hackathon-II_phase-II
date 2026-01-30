# Hackathon II - Phase II Todo Application

This is a full-stack todo application developed as part of Hackathon II - Phase II, featuring a Next.js frontend deployed on Vercel and a FastAPI backend.

## 🚀 Live Demo

[:globe_with_meridians: **View Live Application**](https://frontend-nvs7el7k7-muhammad-sufyans-projects-fa6b4cf9.vercel.app)

## 🏗️ Architecture

- **Frontend**: Next.js 14+ with App Router, deployed on Vercel
- **Backend**: FastAPI (to be implemented)
- **Database**: Neon Serverless PostgreSQL with SQLModel ORM
- **Authentication**: JWT-based with user data isolation

## 🎯 Features

- User authentication (Login/Register)
- Secure todo management (Create, Read, Update, Delete)
- Task completion tracking
- User data isolation
- Responsive design for all device sizes
- Modern UI with accessibility features

## 🛠️ Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom-built component library
- **Deployment**: Vercel
- **API**: Planned integration with FastAPI backend

## 📋 Project Structure

```
frontend/                 # Next.js frontend application
├── src/
│   ├── app/             # App Router pages
│   ├── components/      # Reusable UI components
│   ├── contexts/        # React Context providers
│   ├── lib/             # Utilities and type definitions
│   └── styles/          # Global styles
specs/                   # Project specifications
├── 001-phase-ii-overview/ # Feature specifications
└── contracts/           # API contracts (openapi.yaml)
```

## 🚀 Quick Start

1. Clone the repository
2. Navigate to the frontend directory: `cd frontend`
3. Install dependencies: `npm install`
4. Run the development server: `npm run dev`

## 🤝 Contributing

This project was developed using Claude Code for AI-assisted development following Spec-Driven Development principles.

## 📄 License

This project is part of the Hackathon II competition.