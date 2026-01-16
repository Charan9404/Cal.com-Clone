# 🚀 QUICK FIX - Deploy in 10 Minutes

## ✅ Code Fixes Applied
- ✅ Fixed duplicate function causing 500 error
- ✅ Updated ALLOWED_HOSTS for Render
- ✅ Configured CORS for Vercel frontend
- ✅ Added database fallback handling
- ✅ Added error handling for missing event types

## 🔧 Render Backend Setup (Do This Now!)

### Step 1: Go to Render Dashboard → Your Service → Environment

Add these environment variables:

```
DJANGO_SECRET_KEY = <generate one: python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())">
DEBUG = False
ALLOWED_HOSTS = cal-com-clone.onrender.com,.onrender.com
CORS_ALLOWED_ORIGINS = https://cal-com-clone-roan.vercel.app
CSRF_TRUSTED_ORIGINS = https://cal-com-clone-roan.vercel.app
```

### Step 2: Set Build Command

In Render → Settings → Build Command:
```bash
pip install -r requirements.txt && python manage.py migrate --noinput && python manage.py collectstatic --noinput
```

### Step 3: Verify Start Command

Should be:
```bash
gunicorn server.wsgi:application
```

### Step 4: Make Sure Database is Connected

- Check that you have a PostgreSQL database attached to your service
- Render should automatically set `DATABASE_URL`
- If not, you'll need to set DB env vars manually

### Step 5: Redeploy

Click "Manual Deploy" → "Deploy latest commit" in Render

## 🌐 Vercel Frontend Setup

### Step 1: Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add:
```
VITE_API_BASE_URL = https://cal-com-clone.onrender.com
```

### Step 2: Redeploy Frontend

Go to Deployments → Click "..." → "Redeploy"

## 🧪 Test After Deployment

1. Test backend root: `https://cal-com-clone.onrender.com/` → Should return JSON
2. Test API: `https://cal-com-clone.onrender.com/api/event-types/` → Should return `[]` (empty is OK)
3. Test frontend: `https://cal-com-clone-roan.vercel.app/` → Should load and connect to backend

## 🐛 If Still Getting 500 Error

1. **Check Render Logs**: Go to Render → Your Service → Logs tab
2. **Common causes**:
   - Database not migrated → Run: `python manage.py migrate` in Render Shell
   - Missing env vars → Double-check all env vars are set
   - Database connection failed → Check DATABASE_URL is set correctly

## 📝 Quick Commands for Render Shell

If you need to run commands manually:
```bash
# Run migrations
python manage.py migrate

# Check database connection
python manage.py dbshell

# Create superuser (if needed)
python manage.py createsuperuser
```
