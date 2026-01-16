# Deployment Guide for Render

## Quick Fix Checklist

### 1. Environment Variables in Render Dashboard

Go to your Render service settings and add these environment variables:

**Required:**
- `DJANGO_SECRET_KEY` - Generate a secure key (you can use: `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`)
- `DEBUG` - Set to `False` for production
- `ALLOWED_HOSTS` - Set to: `cal-com-clone.onrender.com,.onrender.com`
- `CORS_ALLOWED_ORIGINS` - Set to: `https://cal-com-clone-roan.vercel.app`
- `CSRF_TRUSTED_ORIGINS` - Set to: `https://cal-com-clone-roan.vercel.app`

**Database (if not using Render's automatic DATABASE_URL):**
- `DATABASE_URL` - Render should set this automatically if you have a PostgreSQL database attached
- OR set individual vars: `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`

### 2. Build Command in Render

In your Render service settings, set the **Build Command** to:
```bash
pip install -r requirements.txt && python manage.py migrate --noinput && python manage.py collectstatic --noinput
```

### 3. Start Command

Should be:
```bash
gunicorn server.wsgi:application
```

### 4. Run Migrations (if not in build command)

After deployment, you can run migrations manually via Render's Shell:
```bash
python manage.py migrate
```

### 5. Verify Database Connection

Make sure you have a PostgreSQL database attached to your Render service. Render should automatically provide `DATABASE_URL`.

## Common Issues

### 500 Error on `/api/event-types/`

1. **Database not migrated**: Run migrations (see step 4)
2. **Database connection failed**: Check DATABASE_URL or individual DB env vars
3. **ALLOWED_HOSTS not set**: Add your Render domain to ALLOWED_HOSTS
4. **Missing dependencies**: Check requirements.txt is complete

### CORS Errors

Make sure `CORS_ALLOWED_ORIGINS` includes your Vercel frontend URL.

### Static Files 404

The build command should run `collectstatic`. If not, run it manually.

## Testing

After deployment, test these endpoints:
- `https://cal-com-clone.onrender.com/` - Should return JSON with "ok": true
- `https://cal-com-clone.onrender.com/api/event-types/` - Should return [] (empty array is OK if no data)
