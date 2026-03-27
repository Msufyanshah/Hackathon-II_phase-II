# 🔧 Database Setup Guide

## Issue: Invalid Database Connection String

Your logs show:
```
connection to server at "host" (104.247.81.99), port 5432 failed: Connection timed out
[Error [BetterAuthError]: Failed to initialize database adapter]
```

This means the `DATABASE_URL` in your `.env` files is using placeholder values instead of your actual Neon PostgreSQL connection string.

---

## ✅ Step-by-Step Fix

### Step 1: Get Your Neon Connection String

1. **Go to Neon Console**: https://console.neon.tech/
2. **Sign in** to your account
3. **Select your project** (or create a new one if you haven't)
4. Click on **"Connection Details"** in the left sidebar
5. **Copy the connection string** - it looks like:
   ```
   postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require
   ```

### Step 2: Generate Secure Secret Key

Run this command to generate a secure 32-character secret:

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

Copy the output - you'll use this for both frontend and backend.

### Step 3: Update Backend `.env`

Edit `backend\.env`:

```env
# Replace THIS with your actual Neon connection string
DATABASE_URL=postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require

# Replace THIS with the secret key you generated
SECRET_KEY=paste-your-generated-secret-key-here

# Keep these as-is
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7
ACCESS_TOKEN_TYPE=bearer
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
LOG_LEVEL=INFO
```

### Step 4: Update Frontend `.env.local`

Edit `frontend\.env.local`:

```env
# Keep these as-is
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000/api/auth
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# Replace THIS with the SAME secret key you used in backend
BETTER_AUTH_SECRET=paste-your-generated-secret-key-here

# Replace THIS with your actual Neon connection string (same as backend)
DATABASE_URL=postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require
```

### Step 5: Restart Both Services

**Stop current processes** (Ctrl+C in both terminals)

**Restart Backend**:
```bash
cd E:\Hackathon-II_phase-II\backend
python -m uvicorn src.main:app --host 127.0.0.1 --port 8000 --reload
```

You should see:
```
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:8000
```

**Restart Frontend** (new terminal):
```bash
cd E:\Hackathon-II_phase-II\frontend
npm run dev
```

You should see:
```
✓ Ready in X.Xs
```

### Step 6: Verify Everything Works

1. **Open browser**: http://localhost:3000
2. **Go to register**: http://localhost:3000/register
3. **Create an account** with:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `TestPassword123!`
4. **Should redirect to dashboard** after successful registration
5. **Create a task** to verify full authentication flow

---

## 🎯 Expected Behavior

### ✅ Success Indicators

**Backend**:
```
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:8000
```

**Frontend**:
```
✓ Ready in X.Xs
```

**Registration**:
- No `[BetterAuthError]` errors
- Redirects to `/dashboard`
- Console shows: `Registration successful - Backend UUID: <uuid>`

---

## 🔍 Troubleshooting

### Issue: Still Getting Database Connection Errors

**Check**:
1. ✅ Connection string is copied **exactly** from Neon
2. ✅ No spaces or extra characters
3. ✅ Includes `?sslmode=require` at the end
4. ✅ Username and password are correct
5. ✅ Project is active in Neon console

### Issue: Better Auth Still Failing

**Try**:
1. Delete `.next` folder: `Remove-Item -Recurse -Force .next`
2. Clear Node cache: `npm cache clean --force`
3. Restart dev server

### Issue: Backend Can't Connect

**Check**:
1. ✅ Internet connection (Neon is cloud-based)
2. ✅ Firewall isn't blocking PostgreSQL connections
3. ✅ Neon project isn't paused (auto-pauses after inactivity)

---

## 📋 Quick Checklist

Before testing, ensure:

- [ ] Neon connection string in `backend\.env`
- [ ] Neon connection string in `frontend\.env.local` (same as backend)
- [ ] SECRET_KEY in `backend\.env` (generated 32-char string)
- [ ] BETTER_AUTH_SECRET in `frontend\.env.local` (SAME as backend SECRET_KEY)
- [ ] Backend restarted after `.env` change
- [ ] Frontend restarted after `.env.local` change
- [ ] No errors in backend startup logs
- [ ] No `[BetterAuthError]` in frontend logs

---

## 📞 Need Help?

If you're still stuck, share:
1. Your Neon connection string format (hide password)
2. Full backend startup logs
3. Full frontend startup logs
