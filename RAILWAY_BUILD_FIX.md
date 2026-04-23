# Railway Multi-Service Deployment Fix

## The Issue

Railway was getting "Error creating build plan with Railpack" because it detected multiple `package.json` files but couldn't determine which service to build.

## Solution: Deploy as Separate Services

Since you have **backend** and **frontend** in separate directories, Railway requires you to set them up as **two separate services**.

---

## Step-by-Step Setup on Railway

### Step 1: Create a New Railway Project

1. Go to [railway.app](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Select your `outLog` repository

### Step 2: Configure Backend Service

1. **In Railway Dashboard**, click **"+ Add Service"** or wait for auto-detection
2. **Select "GitHub Repo"** → Choose your repository again
3. **Configure the service:**
   - **Name**: `backend` (or leave as default)
   - **Root Directory**: `backend`
   - **Dockerfile**: `backend/Dockerfile`

4. **Add Environment Variables:**
   ```
   PORT=5000
   NODE_ENV=production
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/hostelLogs?retryWrites=true&w=majority
   JWT_SECRET=your-super-secure-random-secret
   ```

5. **Deploy** - Railway will build and deploy the backend

6. **Copy the generated domain:**
   - Railroad will assign something like: `outlog-backend-production.up.railway.app`
   - You'll need this for the frontend configuration

### Step 3: Configure Frontend Service

1. **In Railway Dashboard**, click **"+ Add Service"**
2. **Select "GitHub Repo"** → Select your repository
3. **Configure the service:**
   - **Name**: `frontend` (or leave as default)
   - **Root Directory**: `frontend`
   - **Dockerfile**: `frontend/Dockerfile`

4. **Add Environment Variables:**
   ```
   REACT_APP_API_URL=https://your-backend-domain.up.railway.app/api
   ```
   Replace `your-backend-domain` with the actual domain from Step 2

5. **Deploy** - Railway will build the frontend

---

## Alternative: One-Click Deploy (Simpler)

If Railway still can't auto-detect:

1. **Delete the previous attempt** from Railway dashboard
2. **Go to your GitHub repo settings**
3. **Add a `Procfile` in the root**:
   ```
   # Just create empty file - won't be used with Docker
   ```
4. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Fix Railway configuration"
   git push origin main
   ```
5. **Create new Railway project from scratch**
6. **For each service, specify:**
   - **Service Root**: `backend` or `frontend`
   - **Build Command**: `npm install`
   - **Start Command**: See below

---

## Manual Service Configuration

If auto-detection fails for each service:

### Backend Configuration
- **Build**: `npm install`
- **Start**: `node server.js`
- **Environment**: See Step 2 above

### Frontend Configuration
- **Build**: `npm run build`
- **Start**: `serve -s build -l 3000`
- **Environment**: See Step 3 above

---

## Troubleshooting Build Errors

### "Cannot find module" errors
- Ensure `package.json` is in the correct directory
- Check all dependencies are listed in `package.json`
- Rebuild: Click service → "Redeploy"

### Port conflicts
- Backend must use PORT from environment variable
- Frontend port should be 3000
- Update `Dockerfile` if needed

### API connection issues
- Verify `REACT_APP_API_URL` matches backend domain
- Check JWT tokens are being sent
- Review backend/frontend logs in Railway dashboard

### Build timeout
- If build takes >15 mins, it might timeout
- Check if `node_modules` is being committed (should be in `.gitignore`)
- Verify dependencies in `package.json`

---

## Verify Everything Works

1. **Check backend is running:**
   ```
   https://your-backend-domain.up.railway.app/
   ```
   Should show: "Hostel Management API Running"

2. **Check frontend loads:**
   ```
   https://your-frontend-domain.up.railway.app/
   ```
   Should show login page

3. **Test login:**
   - Enter credentials
   - Should authenticate with backend
   - Check browser console for any errors

---

## Files That Help This Work

- **`backend/Dockerfile`** - Tells Railway how to build backend
- **`frontend/Dockerfile`** - Tells Railway how to build frontend
- **`backend/railway.json`** - Backend-specific config
- **`frontend/railway.json`** - Frontend-specific config
- **`.dockerignore`** files - Speeds up builds by excluding unnecessary files

---

## Quick Reference

| Component | Port | Environment Var | Root Directory |
|-----------|------|-----------------|-----------------|
| Backend | 5000 | PORT=5000 | `backend/` |
| Frontend | 3000 | REACT_APP_API_URL | `frontend/` |
| MongoDB | N/A | MONGO_URI | External (Atlas) |

---

## What NOT to do

❌ Don't deploy the entire repo as one service
❌ Don't hardcode `localhost:5000` in frontend
❌ Don't commit `.env` files
❌ Don't use weak JWT secrets in production

---

## Next Steps

1. Delete the failed Railway project
2. Create a new one
3. **Add TWO separate services** - one for backend, one for frontend
4. Configure each with the directory and Dockerfile specified above
5. Add environment variables
6. Deploy!

If you still get errors after following these steps, share:
- The exact error message
- Which service is failing (backend or frontend)
- What Railways logs show
