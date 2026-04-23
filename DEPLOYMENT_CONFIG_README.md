# Deployment Configuration Files

This directory contains all necessary files for deploying the outLog application to Railway.

## Files Added for Deployment

### Root Level
- **`railway.json`** - Railway deployment configuration
- **`docker-compose.yml`** - Local Docker deployment setup (for testing)
- **`DEPLOYMENT.md`** - Comprehensive deployment guide
- **`RAILWAY_QUICKSTART.md`** - Quick start guide for Railway

### Backend
- **`backend/Dockerfile`** - Production Docker image for Node.js backend
- **`backend/.dockerignore`** - Optimized Docker build (excludes node_modules, etc.)
- **`backend/.env.example`** - Environment variables template

### Frontend
- **`frontend/Dockerfile`** - Production Docker image for React frontend
- **`frontend/.dockerignore`** - Optimized Docker build
- **`frontend/.env.development`** - Development environment settings
- **`frontend/.env.production`** - Production environment settings (Railway)

### Modified Files
- **`frontend/src/utils/api.js`** - Updated to use environment variable for API URL
  - Now supports: `REACT_APP_API_URL` environment variable
  - Falls back to `http://localhost:5000/api` for local development

## Quick Start

### Local Testing with Docker
```bash
docker-compose up
```
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- MongoDB: Running in container

### Deploy to Railway

1. **Ensure all changes are pushed to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for Railway deployment"
   git push origin main
   ```

2. **Go to railway.app**
   - Create new project
   - Deploy from GitHub
   - Select your repository

3. **Add environment variables:**
   - `MONGO_URI` - Your MongoDB Atlas connection string
   - `JWT_SECRET` - Secure random string
   - `REACT_APP_API_URL` - Your backend Railway domain

See `RAILWAY_QUICKSTART.md` for detailed steps.

## Environment Variables

### Backend Requirements
```
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your-secret
NODE_ENV=production
```

### Frontend Requirements
```
REACT_APP_API_URL=https://your-backend-domain.up.railway.app/api
```

## Documentation

- **`DEPLOYMENT.md`** - Complete deployment guide with troubleshooting
- **`RAILWAY_QUICKSTART.md`** - 5-minute quick start

## Security Notes

Before deploying to production:
- [ ] Change JWT_SECRET to a strong random value
- [ ] Use secure MongoDB password
- [ ] Enable IP whitelist in MongoDB Atlas (optional)
- [ ] Review CORS settings if needed

## Testing Deployment

After deployment, verify:
1. Backend health: https://your-backend-domain.up.railway.app/
2. Frontend loads: https://your-frontend-domain.up.railway.app/
3. Login works and API calls succeed

## Support

For deployment issues:
1. Check logs in Railway dashboard
2. Verify environment variables are set correctly
3. Ensure MongoDB URI is valid and accessible
4. Check CORS and API endpoint configuration

See `DEPLOYMENT.md` for detailed troubleshooting.
