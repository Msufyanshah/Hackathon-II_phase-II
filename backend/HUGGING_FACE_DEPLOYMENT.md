# Deploying Todo Application Backend to Hugging Face Spaces

This guide explains how to deploy the Todo Application backend service to Hugging Face Spaces.

## Prerequisites

- A Hugging Face account (https://huggingface.co)
- A Neon Serverless PostgreSQL account (https://neon.tech)
- Git installed locally

## Step 1: Create Neon Database

1. Go to https://console.neon.tech and create an account
2. Create a new project
3. Copy the connection string from the project dashboard
4. The connection string should look like: `postgresql://username:password@ep-xxxxxx.us-east-1.aws.neon.tech/dbname?sslmode=require`

## Step 2: Create Hugging Face Space

1. Go to https://huggingface.co/spaces
2. Click "Create new Space"
3. Choose:
   - **Space SDK**: Docker
   - **GPU/TPU**: CPU (sufficient for a web API)
   - **Hardware**: Medium (2xCPU, 8GB RAM)
   - **Visibility**: Public or Private (as needed)

## Step 3: Prepare Repository

The repository is already structured for Hugging Face Spaces deployment with:
- `Dockerfile` - Container configuration
- `app.py` - Entry point for Hugging Face Spaces
- `requirements.txt` - Python dependencies
- `space.yaml` - Hugging Face Spaces configuration

## Step 4: Configure Environment Variables

In your Hugging Face Space settings:

1. Go to your Space page
2. Click on "Files and versions" tab
3. Go to "Secrets" section
4. Add the following secrets:

### Required Secrets:
- `DATABASE_URL`: Your Neon PostgreSQL connection string
- `SECRET_KEY`: A secure random string for JWT signing
- `BETTER_AUTH_SECRET`: Same secret as used in the frontend (for JWT compatibility)

### Optional Environment Variables:
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Minutes before access token expires (default: 15)
- `REFRESH_TOKEN_EXPIRE_DAYS`: Days before refresh token expires (default: 7)
- `LOG_LEVEL`: Logging level (default: INFO)
- `ALLOWED_ORIGINS`: Comma-separated list of allowed origins (default: localhost and Vercel)

## Step 5: Push Code to Hugging Face

### Option 1: Git Push (Recommended)

1. Clone your Space repository:
   ```bash
   git clone https://huggingface.co/spaces/YOUR_USERNAME/todo-backend
   cd todo-backend
   ```

2. Copy the backend code to the Space repository:
   ```bash
   # Copy all backend files to the Space directory
   cp -r /path/to/hackathon/backend/* .
   ```

3. Commit and push:
   ```bash
   git add .
   git commit -m "Initial backend deployment"
   git push
   ```

### Option 2: Direct Upload

1. In your Space page, click on the "Files" tab
2. Upload all files from the `backend/` directory:
   - `app.py`
   - `Dockerfile`
   - `requirements.txt`
   - `space.yaml`
   - `src/` directory (containing all source code)
   - `.env.example` (for reference)

## Step 6: Monitor Deployment

1. Watch the "Logs" tab in your Space to monitor the build process
2. The build typically takes 2-5 minutes for the first deployment
3. Once complete, your API will be available at:
   `https://YOUR_USERNAME-space-name.hf.space`

## Step 7: Connect Frontend to Backend

Once deployed, update your frontend environment variables to point to the backend:

1. In your frontend `.env.local` file, update:
   ```
   NEXT_PUBLIC_API_BASE_URL="https://YOUR_USERNAME-space-name.hf.space/api"
   NEXT_PUBLIC_AUTH_BASE_URL="https://YOUR_USERNAME-space-name.hf.space/auth"
   ```

2. Rebuild and redeploy the frontend

## API Endpoints

After deployment, your API will be available at:
- Root: `https://YOUR_USERNAME-space-name.hf.space/`
- Health check: `https://YOUR_USERNAME-space-name.hf.space/health`
- API docs: `https://YOUR_USERNAME-space-name.hf.space/docs`
- ReDoc: `https://YOUR_USERNAME-space-name.hf.space/redoc`

### Main API endpoints:
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /api/{user_id}/tasks` - Get user's tasks
- `POST /api/{user_id}/tasks` - Create new task
- `GET /api/{user_id}/tasks/{task_id}` - Get specific task
- `PUT /api/{user_id}/tasks/{task_id}` - Update task
- `PATCH /api/{user_id}/tasks/{task_id}` - Toggle task completion
- `DELETE /api/{user_id}/tasks/{task_id}` - Delete task
- `GET /api/users/me` - Get current user info

## Troubleshooting

### Common Issues:

1. **Database Connection Errors**:
   - Verify your Neon PostgreSQL connection string is correct
   - Ensure the connection string includes `?sslmode=require`
   - Check that your Neon project allows connections from external sources

2. **Authentication Failures**:
   - Verify SECRET_KEY matches between frontend and backend
   - Check that BETTER_AUTH_SECRET is identical in both frontend and backend
   - Ensure CORS settings include your frontend domain

3. **Build Failures**:
   - Check that requirements.txt is properly formatted
   - Verify all dependencies are compatible with the Hugging Face environment
   - Look at build logs for specific error messages

4. **Runtime Errors**:
   - Check Space logs for detailed error information
   - Verify all environment variables are properly set
   - Ensure database connection string is accessible

### Health Checks:

Monitor your Space health through:
- Logs tab in Hugging Face Spaces
- `/health` endpoint on your deployed API
- Database connectivity through Neon dashboard

## Security Notes

- Never expose your SECRET_KEY or database credentials publicly
- Use strong, randomly generated secrets
- Regularly rotate your secrets
- Monitor access logs for suspicious activity
- Ensure HTTPS is used for all API communications

## Scaling

The backend is designed to scale horizontally:
- Stateless JWT authentication allows for multiple instances
- Neon Serverless PostgreSQL scales automatically with demand
- Hugging Face Spaces can be configured with appropriate hardware for load requirements