# Quick Deployment Guide - Using Existing GitHub Repo

**GitHub Repo**: https://github.com/Msufyanshah/Hackathon-II_phase-II  
**Backend HF Space**: https://huggingface.co/spaces/Msufyanshah/aitodo  
**Date**: 2026-03-25

---

## 🚀 Quick Start (5 Steps)

### Step 1: Clone Your HF Space

```bash
mkdir C:\Hackathon-Deploy
cd C:\Hackathon-Deploy
git clone https://huggingface.co/spaces/Msufyanshah/aitodo hf-space
cd hf-space
```

### Step 2: Copy Backend Files

```bash
xcopy /E /I /Y E:\Hackathon-II_phase-II\backend\* .
dir
```

### Step 3: Push Backend to HF

```bash
git config user.name "Msufyanshah"
git add .
git commit -m "Deploy: All fixes - token refresh, password reset, rate limiting"
git push
```

**Enter HF token** when prompted (get from: https://huggingface.co/settings/tokens)

### Step 4: Set HF Environment Variables

Go to: https://huggingface.co/spaces/Msufyanshah/aitodo/settings

**Add as Secrets**:
```
DATABASE_URL=postgresql://neondb_owner:npg_tVq0idmfc7Bo@ep-round-bar-ahtpbnm4-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
SECRET_KEY=8bgUpp053Hz5MHQqFXAAfpaMt56uPPeshNP618RHc1I
```

### Step 5: Deploy Frontend to Vercel

1. Go to: https://vercel.com/new
2. Import: `Msufyanshah/Hackathon-II_phase-II`
3. **Root Directory**: `./frontend` ⚠️
4. **Environment Variables**:
   ```
   NEXT_PUBLIC_API_BASE_URL=https://Msufyanshah-aitodo.hf.space
   BETTER_AUTH_SECRET=8bgUpp053Hz5MHQqFXAAfpaMt56uPPeshNP618RHc1I
   DATABASE_URL=postgresql://neondb_owner:npg_tVq0idmfc7Bo@ep-round-bar-ahtpbnm4-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```
5. Click **Deploy**

---

## ✅ Done! Your URLs:

- **Backend**: https://Msufyanshah-aitodo.hf.space
- **Frontend**: `https://hackathon-ii-phase-ii-msufyanshah.vercel.app`

---

## 🔄 Future Updates

### Backend:
```bash
cd C:\Hackathon-Deploy\hf-space
xcopy /E /I /Y E:\Hackathon-II_phase-II\backend\src\* src\
git add . && git commit -m "fix" && git push
```

### Frontend:
```bash
cd E:\Hackathon-II_phase-II
git add frontend/ && git commit -m "fix" && git push origin main
```

Vercel will auto-deploy on push!

---

**That's it!** 🎉
