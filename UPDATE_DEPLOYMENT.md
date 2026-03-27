# Update Deployment Guide

**Date**: 2026-03-25  
**Purpose**: Update existing Hugging Face and Vercel deployments with latest fixes

---

## 🔄 Quick Update (Recommended)

### Backend (Hugging Face Spaces)

```bash
# Navigate to your backend directory
cd E:\Hackathon-II_phase-II\backend

# Check your Hugging Face Space git remote
git remote -v

# If not already added, add your HF Space remote
# git remote add hf https://huggingface.co/spaces/YOUR_USERNAME/todo-backend

# Commit all changes
git add .
git commit -m "Update: Token refresh, password reset, rate limiting, error handling"

# Push to Hugging Face
git push hf main
```

### Frontend (Vercel)

**Option 1: Git-based Deployment (Automatic)**
```bash
# If connected to GitHub/GitLab
cd E:\Hackathon-II_phase-II\frontend
git add .
git commit -m "Update: Fixed auth, task operations, modal layout"
git push origin main
# Vercel will auto-deploy
```

**Option 2: Vercel CLI**
```bash
# Install Vercel CLI if not installed
npm i -g vercel

# Navigate to frontend
cd E:\Hackathon-II_phase-II\frontend

# Deploy to production
vercel --prod
```

---

## 🔧 Manual Update (Alternative)

### Backend - Manual Upload to Hugging Face

1. **Go to your Space**: https://huggingface.co/spaces/YOUR_USERNAME/todo-backend
2. **Click "Files"** tab
3. **Click "Add file"** → **"Upload files"**
4. **Upload these updated folders/files**:
   - `src/` (entire folder - contains all the fixes)
   - `requirements.txt` (updated with slowapi, pytest)
   - `.env.example` (updated template)

5. **Commit changes** with message: "Update: Token refresh, password reset, rate limiting"

### Frontend - Manual Deploy to Vercel

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your project**
3. **Click "Redeploy"** on the latest deployment
4. **Or**: Push to git branch connected to Vercel

---

## ⚙️ Environment Variables to Update

### Hugging Face Spaces (Backend)

Go to your Space → **Settings** → **Variables and Secrets**

**Required Secrets** (update if changed):
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

### Vercel (Frontend)

Go to Vercel Project → **Settings** → **Environment Variables**

**Required**:
```
NEXT_PUBLIC_API_BASE_URL=https://YOUR_USERNAME-space-name.hf.space
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000/api/auth
BETTER_AUTH_SECRET=8bgUpp053Hz5MHQqFXAAfpaMt56uPPeshNP618RHc1I
DATABASE_URL=postgresql://neondb_owner:npg_tVq0idmfc7Bo@ep-round-bar-ahtpbnm4-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
```

**Redeploy after updating variables!**

---

## ✅ Verification After Update

### 1. Test Backend Deployment

```bash
# Replace with your actual Hugging Face Space URL
BACKEND_URL="https://YOUR_USERNAME-space-name.hf.space"

# Health check
curl $BACKEND_URL/health

# Should return: {"status":"healthy","service":"backend-api"}

# Test login
curl -X POST $BACKEND_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"slaman00@gmail.com","password":"slaman00"}'

# Should return: access_token, refresh_token, user data
```

### 2. Test Frontend Deployment

```bash
# Replace with your actual Vercel URL
FRONTEND_URL="https://your-frontend.vercel.app"

# Check homepage
curl $FRONTEND_URL

# Should return HTML with "Todo Application"
```

### 3. Test Full Flow

1. **Open your Vercel frontend URL**
2. **Register a new account** or login with existing
3. **Create a task** - should work ✅
4. **Toggle task completion** - should work ✅
5. **Edit a task** - should work (with page reload) ✅
6. **Delete a task** - should work (with page reload) ✅
7. **Wait 15 minutes** - token should auto-refresh ✅

---

## 🐛 Troubleshooting

### Backend Build Fails on HF

**Check logs**: Space page → "Logs" tab

**Common issues**:
- `requirements.txt` format error → Ensure no trailing spaces
- Python version mismatch → Check `space.yaml` Python version
- Import errors → Ensure all `src/` files uploaded

### Frontend Build Fails on Vercel

**Check logs**: Vercel Project → "Deployments" → Click latest → "View Logs"

**Common issues**:
- Node version → Set to 18+ in Vercel settings
- Build command → Should be `npm run build`
- Output directory → Should be `.next`

### API Calls Fail (CORS Error)

**Fix**: Update `ALLOWED_ORIGINS` in Hugging Face Spaces:
```
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,https://your-frontend.vercel.app
```

Then **redeploy backend**.

### 401 Unauthorized Errors

**Cause**: Token expired or SECRET_KEY mismatch

**Fix**:
1. Ensure `SECRET_KEY` matches in both backend (HF) and frontend (Vercel)
2. Clear browser localStorage: `localStorage.clear()`
3. Re-login to get fresh tokens

---

## 📊 Deployment Checklist

### Backend (Hugging Face Spaces)
- [ ] All `src/` files uploaded
- [ ] `requirements.txt` updated
- [ ] Environment variables set
- [ ] `SECRET_KEY` matches frontend
- [ ] Build successful (check logs)
- [ ] Health endpoint responds: `/health`
- [ ] API docs accessible: `/docs`
- [ ] CORS includes frontend URL

### Frontend (Vercel)
- [ ] All source files committed
- [ ] Environment variables set
- [ ] `NEXT_PUBLIC_API_BASE_URL` points to HF Space
- [ ] `BETTER_AUTH_SECRET` matches backend
- [ ] Build successful
- [ ] Homepage loads
- [ ] Login page accessible
- [ ] Dashboard loads after login

### Integration Tests
- [ ] Can register new user
- [ ] Can login successfully
- [ ] Can create task
- [ ] Can toggle task completion
- [ ] Can edit task
- [ ] Can delete task
- [ ] Token refreshes automatically (wait 15 min)
- [ ] No console errors in browser

---

## 🎯 Post-Deployment Monitoring

### Backend Logs
- **Hugging Face**: Space → "Logs" tab
- **Watch for**: 401 errors, database connection issues, rate limit hits

### Frontend Logs
- **Vercel**: Project → "Deployments" → Logs
- **Browser Console**: F12 → Console tab
- **Watch for**: API errors, token refresh failures

### Database
- **Neon Dashboard**: https://console.neon.tech/
- **Watch for**: Connection count, query performance

---

## 📝 Rollback Plan

If something breaks after update:

### Backend Rollback (Hugging Face)
```bash
# View previous commits
git log

# Revert to previous commit
git revert HEAD
git push hf main
```

### Frontend Rollback (Vercel)
1. Go to Vercel Project → "Deployments"
2. Find last working deployment
3. Click "..." → "Redeploy"

---

## 🚀 Ready to Deploy?

**Execute these commands in order**:

1. **Update Backend**:
   ```bash
   cd E:\Hackathon-II_phase-II\backend
   git add .
   git commit -m "Deploy: Token refresh, password reset, rate limiting"
   git push hf main
   ```

2. **Wait for backend build** (2-5 minutes)

3. **Test backend**: Visit `https://YOUR_USERNAME-space-name.hf.space/health`

4. **Update Frontend**:
   ```bash
   cd E:\Hackathon-II_phase-II\frontend
   git add .
   git commit -m "Deploy: Fixed auth, task operations, modal"
   git push origin main
   ```

5. **Wait for frontend build** (1-3 minutes)

6. **Test full flow**: Login, create task, toggle, edit, delete

---

**Good luck with your hackathon presentation!** 🎉
