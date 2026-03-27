# Git-Based Deployment Setup Guide

**Project**: Hackathon-II_phase-II Todo Application  
**Backend**: Hugging Face Spaces (@Msufyanshah/aitodo)  
**Frontend**: Vercel (to be connected to GitHub)  
**Date**: 2026-03-25

---

## 📦 Part 1: Backend - Hugging Face Spaces Git Deployment

### Step 1: Clone Your Hugging Face Space

Your space URL: https://huggingface.co/spaces/Msufyanshah/aitodo

```bash
# Create a folder for HF Space (outside your project)
mkdir C:\Hackathon-Deploy
cd C:\Hackathon-Deploy

# Clone your Hugging Face Space
git clone https://huggingface.co/spaces/Msufyanshah/aitodo hf-space
cd hf-space

# Check what's already there
dir
```

### Step 2: Copy Backend Files to HF Space

```bash
# Go back to your project
cd C:\Hackathon-II_phase-II\backend

# Copy all backend files to HF Space
xcopy /E /I /Y * C:\Hackathon-Deploy\hf-space\

# Go to HF Space directory
cd C:\Hackathon-Deploy\hf-space

# Check files
dir
```

**Files that should be in `hf-space/`**:
```
hf-space/
├── src/
│   ├── api/
│   ├── core/
│   ├── database/
│   ├── middleware/
│   ├── models/
│   ├── schemas/
│   ├── utils/
│   └── main.py
├── .env.example
├── Dockerfile
├── requirements.txt
├── space.yaml
└── README.md
```

### Step 3: Configure Git for Hugging Face

```bash
# In C:\Hackathon-Deploy\hf-space directory
cd C:\Hackathon-Deploy\hf-space

# Configure git user (if not already configured)
git config --global user.name "Msufyanshah"
git config --global user.email "your-email@example.com"

# Add all files
git add .

# Commit
git commit -m "Initial deployment: Token refresh, password reset, rate limiting, error handling"

# Push to Hugging Face
git push
```

**Note**: You'll be prompted for Hugging Face credentials:
- **Username**: Msufyanshah
- **Password**: Your Hugging Face token (get from https://huggingface.co/settings/tokens)

### Step 4: Monitor Deployment

1. Go to: https://huggingface.co/spaces/Msufyanshah/aitodo
2. Click **"Logs"** tab
3. Wait for build to complete (2-5 minutes)
4. When you see "Running", deployment is complete!

### Step 5: Configure Environment Variables on HF

1. Go to your Space: https://huggingface.co/spaces/Msufyanshah/aitodo
2. Click **"Settings"** tab
3. Scroll to **"Variables and Secrets"**
4. Add these secrets:

**Required Secrets**:
```
DATABASE_URL=postgresql://neondb_owner:npg_tVq0idmfc7Bo@ep-round-bar-ahtpbnm4-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
SECRET_KEY=8bgUpp053Hz5MHQqFXAAfpaMt56uPPeshNP618RHc1I
```

**Optional Variables**:
```
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7
LOG_LEVEL=INFO
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,https://your-frontend.vercel.app
```

5. Click **"Save"** after adding each variable
6. Space will **redeploy automatically**

---

## 📦 Part 2: Frontend - GitHub + Vercel Git Deployment

### Step 1: Create GitHub Repository

1. Go to: https://github.com/new
2. **Repository name**: `todo-frontend` (or `hackathon-ii-todo`)
3. **Description**: "Todo Application Frontend - Hackathon II Phase II"
4. **Visibility**: Public (recommended for hackathon)
5. **DO NOT** initialize with README (we'll push existing code)
6. Click **"Create repository"**

### Step 2: Initialize Git for Frontend

```bash
# In your project root
cd E:\Hackathon-II_phase-II

# Initialize git (if not already)
git init

# Check if already a git repo
git status

# If "Not a git repository", initialize:
git init
```

### Step 3: Add GitHub Remote

```bash
# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/todo-frontend.git

# Verify remote
git remote -v
```

### Step 4: Create .gitignore for Frontend

Create `E:\Hackathon-II_phase-II\frontend\.gitignore`:

```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/
*.lcov

# Next.js
.next/
out/
build/

# Production
*.log

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db
```

### Step 5: Commit and Push Frontend

```bash
cd E:\Hackathon-II_phase-II

# Add frontend files only
git add frontend/

# Create .gitignore in root if not exists
echo "frontend/node_modules/" >> .gitignore
echo "frontend/.next/" >> .gitignore
echo "frontend/.env.local" >> .gitignore
git add .gitignore

# Commit
git commit -m "Initial frontend deployment: Fixed auth, task operations, modal layout"

# Push to GitHub
git push -u origin main
```

**If you get an error about 'main' branch**:
```bash
# Create main branch
git branch -M main

# Push again
git push -u origin main
```

### Step 6: Connect Vercel to GitHub

1. **Go to Vercel**: https://vercel.com/dashboard
2. **Click "Add New"** → **"Project"**
3. **Import Git Repository**:
   - Find `todo-frontend` in your repositories
   - Click **"Import"**
4. **Configure Project**:
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: `./frontend` (important!)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next` (default)
5. **Add Environment Variables**:

Click **"Environment Variables"** and add:

```
NEXT_PUBLIC_API_BASE_URL=https://Msufyanshah-aitodo.hf.space
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000/api/auth
BETTER_AUTH_SECRET=8bgUpp053Hz5MHQqFXAAfpaMt56uPPeshNP618RHc1I
DATABASE_URL=postgresql://neondb_owner:npg_tVq0idmfc7Bo@ep-round-bar-ahtpbnm4-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
```

6. Click **"Deploy"**
7. Wait for build to complete (1-3 minutes)

### Step 7: Enable Auto-Deploy

Once connected to GitHub:
- Every `git push` will automatically trigger a Vercel deployment
- You'll see deployment status in GitHub PR/commit checks

---

## 🔄 Update Workflow (After Initial Setup)

### Update Backend (HF Spaces)

```bash
cd C:\Hackathon-Deploy\hf-space

# Make your changes in backend files
# Copy updated files from E:\Hackathon-II_phase-II\backend\

git add .
git commit -m "Fix: [describe your fix]"
git push
```

**Auto-deploys to**: https://huggingface.co/spaces/Msufyanshah/aitodo

### Update Frontend (Vercel via GitHub)

```bash
cd E:\Hackathon-II_phase-II

# Make changes in frontend/src/

git add frontend/
git commit -m "Fix: [describe your fix]"
git push origin main
```

**Auto-deploys to**: Your Vercel URL (e.g., `https://todo-frontend-yourname.vercel.app`)

---

## ✅ Verification Checklist

### Backend (Hugging Face Spaces)

- [ ] Git push successful
- [ ] Build completed (check Logs tab)
- [ ] Space status: "Running"
- [ ] Health endpoint works: https://Msufyanshah-aitodo.hf.space/health
- [ ] API docs accessible: https://Msufyanshah-aitodo.hf.space/docs
- [ ] Environment variables set

### Frontend (Vercel)

- [ ] GitHub repository created
- [ ] Vercel connected to GitHub
- [ ] Build completed successfully
- [ ] No build errors
- [ ] Frontend URL accessible
- [ ] Environment variables set in Vercel
- [ ] Auto-deploy enabled

### Integration Test

- [ ] Open Vercel frontend URL
- [ ] Register new account
- [ ] Login successfully
- [ ] Create a task
- [ ] Toggle task completion
- [ ] Edit task (page reloads)
- [ ] Delete task (page reloads)
- [ ] No console errors

---

## 🐛 Troubleshooting

### HF Spaces Build Fails

**Check**: Space → "Logs" tab

**Common issues**:
- Missing files → Ensure all `src/` folder copied
- requirements.txt error → Check formatting (no trailing spaces)
- Docker build error → Check Dockerfile syntax

### Vercel Build Fails

**Check**: Vercel Project → "Deployments" → Click latest → "View Logs"

**Common issues**:
- Wrong root directory → Set to `./frontend`
- Node version → Set to 18+ in Vercel settings
- Build command → Should be `npm run build`

### CORS Errors

**Fix**: Update `ALLOWED_ORIGINS` in HF Spaces:
```
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,https://your-frontend.vercel.app
```

Then redeploy backend (git push).

### Frontend Can't Connect to Backend

**Check**:
1. `NEXT_PUBLIC_API_BASE_URL` in Vercel matches your HF Space URL
2. HF Space is running (not building)
3. Backend `/health` endpoint responds

---

## 📝 Quick Reference Commands

### Backend (HF Spaces)
```bash
cd C:\Hackathon-Deploy\hf-space
git pull          # Get latest from HF
# Make changes...
git add .
git commit -m "message"
git push
```

### Frontend (Vercel via GitHub)
```bash
cd E:\Hackathon-II_phase-II
git pull origin main
# Make changes in frontend/
git add frontend/
git commit -m "message"
git push origin main
```

### Check Deployment Status
- **Backend**: https://huggingface.co/spaces/Msufyanshah/aitodo/tree/main
- **Frontend**: https://github.com/YOUR_USERNAME/todo-frontend/commits/main

---

## 🎯 Next Steps

1. **Complete backend git setup** (Part 1, Steps 1-5)
2. **Complete frontend GitHub setup** (Part 2, Steps 1-7)
3. **Test production deployment** (Verification Checklist)
4. **Share live URL** with hackathon judges! 🚀

---

**Ready to start? Begin with Part 1 (Backend) first!** 🎉
