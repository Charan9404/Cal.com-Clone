# 🚀 Render Deployment - Final Checklist

## ✅ Code is Ready!
All fixes have been applied:
- ✅ Duplicate function removed
- ✅ ALLOWED_HOSTS configured
- ✅ CORS configured for Vercel
- ✅ Database connection handling improved
- ✅ Error handling added

## 📋 What You Need to Do on Render (5 minutes)

### Step 1: Verify Environment Variables
Go to **Render Dashboard → Your Service → Environment** and confirm these are set:

```
✅ DATABASE_URL = postgresql://... (you already have this)
✅ DJANGO_SECRET_KEY = (you already have this)
✅ DEBUG = False
✅ ALLOWED_HOSTS = cal-com-clone.onrender.com,.onrender.com
✅ CORS_ALLOWED_ORIGINS = https://cal-com-clone-roan.vercel.app
✅ CSRF_TRUSTED_ORIGINS = https://cal-com-clone-roan.vercel.app
```

### Step 2: Set Build Command ⚠️ CRITICAL
Go to **Settings → Build Command** and set:
```bash
pip install -r requirements.txt && python manage.py migrate --noinput && python manage.py collectstatic --noinput
```

**This is the most important step!** Without this, your database won't have tables and you'll get 500 errors.

### Step 3: Verify Start Command
Go to **Settings → Start Command** and make sure it's:
```bash
gunicorn server.wsgi:application
```

### Step 4: Deploy
1. If your code is in Git: Push your latest changes, Render will auto-deploy
2. If not using Git: Go to **Manual Deploy → Deploy latest commit**

### Step 5: Run Migrations (if build command didn't work)
If you still get 500 errors after deployment:
1. Go to **Render → Your Service → Shell**
2. Run: `python manage.py migrate`
3. Redeploy

## 🧪 Test After Deployment

1. **Root endpoint**: https://cal-com-clone.onrender.com/
   - Should return: `{"ok": true, "message": "Cal.com Clone backend is running", "docs": "/api/"}`

2. **API endpoint**: https://cal-com-clone.onrender.com/api/event-types/
   - Should return: `[]` (empty array, NOT a 500 error)

3. **Frontend**: https://cal-com-clone-roan.vercel.app/
   - Should load and connect to backend

## 🐛 Troubleshooting

### Still getting 500 error?
1. **Check Render Logs**: Go to your service → Logs tab
2. **Common issues**:
   - "relation does not exist" → Database not migrated → Run migrations
   - "DisallowedHost" → ALLOWED_HOSTS not set correctly
   - "Connection refused" → DATABASE_URL incorrect
   - "Module not found" → Dependencies not installed → Check build command

### Database connection issues?
- Verify DATABASE_URL is correct in environment variables
- Check that PostgreSQL database is running in Render
- Test connection in Render Shell: `python manage.py dbshell`

## 📝 Quick Commands for Render Shell

```bash
# Check database connection
python manage.py dbshell

# Run migrations manually
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Check Django settings
python manage.py check --deploy
```
