# Deployment Guide for outLog (Hostel Management System)

## Overview

This document provides instructions for deploying the outLog application to Railway.app. The application consists of:
- **Frontend**: React.js application
- **Backend**: Express.js API server
- **Database**: MongoDB Atlas (cloud-based)

---

## Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **GitHub Repository**: Your project should be pushed to GitHub
3. **MongoDB Atlas**: Cloud MongoDB instance already set up (or create a new one)
4. **Environment Variables Ready**: Prepare your mongoDB URI and JWT secret

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Railway Platform                      │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────────┐        ┌──────────────────┐       │
│  │  Frontend (React) │◄──────►│ Backend (Express) │       │
│  │   Port: 3000     │        │  Port: 5000      │       │
│  └──────────────────┘        └──────────────────┘       │
│                                       │                  │
│                                       ▼                  │
│                       ┌──────────────────────────┐      │
│                       │  MongoDB Atlas (Cloud)   │      │
│                       │  External Service        │      │
│                       └──────────────────────────┘      │
└─────────────────────────────────────────────────────────┘
```

---

## Step 1: Prepare Your Repository

1. **Ensure all changes are committed**:
   ```bash
   git add .
   git commit -m "Prepare for Railway deployment"
   git push origin main
   ```

2. **Verify the following files exist in your project root**:
   - `docker-compose.yml` ✓
   - `railway.json` ✓
   - Backend `/Dockerfile` ✓
   - Frontend `/Dockerfile` ✓

---

## Step 2: Set Up on Railway

### Option A: Deploy with GitHub Integration (Recommended)

1. **Go to [railway.app](https://railway.app)** and log in with your GitHub account
2. **Click "New Project"**
3. **Select "Deploy from GitHub repo"**
4. **Authorize Railway** to access your GitHub repositories
5. **Select your outLog repository**
6. **Railway will automatically detect** your `Dockerfile` and `docker-compose.yml`

### Option B: Manual Project Setup

1. **Create a new project** on Railway
2. **Add services manually** (see steps below)

---

## Step 3: Configure Services

### Backend Service Setup

1. **Create a new service** or let Railway auto-detect it
2. **Configure environment variables**:
   - `PORT`: 5000
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Your secure JWT secret
   - `NODE_ENV`: production

3. **Domain Configuration**:
   - Railway will assign a domain automatically (e.g., `yourapp-production.up.railway.app`)
   - Note this domain URL for frontend configuration

### Frontend Service Setup

1. **Create frontend service**
2. **Configure environment variables**:
   - `REACT_APP_API_URL`: Set to your backend domain:
     ```
     https://your-backend-domain.up.railway.app/api
     ```
   - Example: `https://outlog-backend-production.up.railway.app/api`

3. **Build Command**:
   - `npm run build` (Railway should auto-detect)

4. **Start Command**:
   - `serve -s build -l 3000` (Railway should auto-detect from Dockerfile)

---

## Step 4: Environment Variables Configuration

### Backend (.env)
Create environment variables in Railway dashboard for backend service:
```
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/hostelLogs?retryWrites=true&w=majority
JWT_SECRET=your-super-secure-jwt-secret-key-change-this
```

### Frontend (REACT_APP_*)
Create environment variables in Railway dashboard for frontend service:
```
REACT_APP_API_URL=https://your-backend-domain.up.railway.app/api
```

---

## Step 5: Database Connection

### Using MongoDB Atlas (Recommended)

1. **Log in to MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
2. **Get Connection String**:
   - Go to Database → Connect
   - Select "Connect your application"
   - Copy the connection string
   - Replace `<username>` and `<password>` with your credentials

3. **Add to Railway**:
   - In your backend service settings on Railway
   - Add the `MONGO_URI` environment variable with your connection string

### Connection String Format:
```
mongodb+srv://username:password@cluster-name.mongodb.net/database-name?retryWrites=true&w=majority
```

---

## Step 6: Deploy

### Automatic Deployment
- Railway automatically deploys when you push changes to your GitHub repository
- Monitor deployment in the Railway dashboard
- Check logs in real-time

### Manual Deployment
1. **Go to your Railway project dashboard**
2. **Click the relevant service**
3. **Click "Redeploy"** to trigger a new build

---

## Step 7: Verify Deployment

1. **Check Backend Health**:
   ```
   https://your-backend-domain.up.railway.app/
   ```
   Should show: "Hostel Management API Running"

2. **Check Frontend**:
   ```
   https://your-frontend-domain.up.railway.app/
   ```
   Should load the login page

3. **Test API Connection**:
   - Try logging in
   - Check browser console for any API errors
   - Verify JWT tokens are being sent correctly

---

## Environment Setup Reference

### Local Development
Use the provided `.env.development` file:
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Production (Railway)
Use the `.env.production` file:
```
REACT_APP_API_URL=https://your-backend-domain.up.railway.app/api
```

---

## Troubleshooting

### Backend Won't Start
1. **Check logs** in Railway dashboard
2. **Verify MongoDB URI** is correct and accessible
3. **Check JWT_SECRET** is set
4. **Ensure PORT** is set to 5000

### Frontend Shows Blank Page
1. **Check browser console** for errors
2. **Verify REACT_APP_API_URL** is correctly set
3. **Check Network tab** to see if API calls are reaching the backend
4. **Verify CORS** is enabled in backend

### API Requests Failing
1. **Check backend logs** for errors
2. **Verify MONGO_URI** connection
3. **Ensure REACT_APP_API_URL** matches backend domain
4. **Check token** is being sent in Authorization header

### SSL/HTTPS Issues
- Railway provides free SSL certificates
- May take a few minutes to provision
- Check Railway dashboard for SSL status

---

## Security Checklist

Before deploying to production:

- [ ] **Change JWT_SECRET** to a secure, random value
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

- [ ] **Use strong MongoDB password** (avoid simple passwords)

- [ ] **Enable IP Whitelist** in MongoDB Atlas (optional but recommended)

- [ ] **Review CORS settings**:
  - Currently allows all origins for development
  - Consider restricting to your frontend domain in production

- [ ] **Rotate JWT_SECRET** periodically

- [ ] **Monitor logs** for suspicious activity

---

## CORS Configuration

Currently, the backend accepts requests from any origin:
```javascript
app.use(cors());
```

For production, consider restricting to your frontend domain:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

Update in `backend/server.js` and add `FRONTEND_URL` environment variable.

---

## Monitoring and Logs

### In Railway Dashboard
1. **Go to your project**
2. **Select a service**
3. **View Logs tab** for real-time logs
4. **Monitor tab** for resource usage (CPU, Memory, Network)

### Common Log Entries
- Database connection established
- Server listening on port 5000
- Authentication middleware loaded

---

## Updating Your Application

After deployment, to update your application:

1. **Make changes locally**
2. **Test thoroughly**
3. **Commit and push to GitHub**:
   ```bash
   git add .
   git commit -m "Your update message"
   git push origin main
   ```
4. **Railway will automatically redeploy**

---

## Rollback

If something goes wrong after deployment:

1. **In Railway dashboard**, go to your service
2. **Click "Deployments" tab**
3. **Select a previous deployment**
4. **Click "Redeploy this version"**

---

## Additional Resources

- [Railway Documentation](https://docs.railway.app)
- [MongoDB Atlas Setup](https://docs.atlas.mongodb.com)
- [Express.js Production Guide](https://expressjs.com/en/advanced/best-practice-performance.html)
- [React Build Optimization](https://create-react-app.dev/docs/optimizations/)

---

## Support

For issues with:
- **Railway**: [Railway Docs](https://docs.railway.app) or [Support](https://railway.app/support)
- **MongoDB**: [MongoDB Support](https://developer.mongodb.com/support)
- **Application**: Check project repository issues

---

## Quick Reference Commands

```bash
# Test locally with Docker
docker-compose up

# View logs
docker-compose logs -f

# Stop containers
docker-compose down

# Rebuild images
docker-compose build --no-cache

# Access backend container
docker-compose exec backend sh

# Access frontend container
docker-compose exec frontend sh
```

---

**Last Updated**: 2026-04-23
**Project**: outLog - Hostel Management System
