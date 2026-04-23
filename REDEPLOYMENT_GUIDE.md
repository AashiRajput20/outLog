# Complete Railway Redeployment Guide

## Prerequisites

✓ You have deleted the failed Railway project
✓ Your code is pushed to GitHub
✓ You have MongoDB Atlas connection string ready
✓ You have a Railway account

---

## Step 1: Create a New Railway Project

### 1.1 Go to Railway Dashboard
- Visit: https://railway.app
- Click **"Dashboard"** (top-right corner)
- You should see your existing projects (if any)

### 1.2 Create New Project
- Click **"New Project"** button (usually blue, top-right)
- A dropdown menu appears with options:
  - **Deploy from GitHub repo** ← SELECT THIS
  - Deploy from template
  - Import existing project

### 1.3 Select GitHub Repository
- Click **"Deploy from GitHub repo"**
- You'll see a list of your GitHub repositories
- **Search for "outLog"** or scroll to find it
- Click on **"outLog"** repository
- Click **"Deploy Now"** or similar confirmation button

### 1.4 Wait for Initial Setup
- Railway will start processing your repo
- You'll see a project dashboard appear
- The system will attempt to auto-detect services
- **This might show errors** - that's OK, we'll configure manually

---

## Step 2: Delete Any Auto-Detected Services (If Created)

If Railway auto-detected and created services you don't want:

1. In your Railway Dashboard, look at the left sidebar
2. You'll see services listed (might say "backend", "frontend", etc.)
3. **Right-click on any service** → **Delete** (if it looks wrong)
4. **Start fresh** to avoid conflicts

---

## Step 3: Add Backend Service

### 3.1 Add a Service
- In Railway Dashboard, click **"+ Add"** or **"+ New Service"**
- A menu appears with options:
  - **GitHub Repo**
  - **Database**
  - **Other services**

- Select **"GitHub Repo"**

### 3.2 Configure Backend Service
- **Choose Repository**: Select your **outLog** repo again
- **Service Type**: Should auto-detect as Node.js
- A form appears asking for configuration:

**Fill in these fields:**

| Field | Value |
|-------|-------|
| **Service Name** | `backend` |
| **Root Directory** | `backend` |
| **Dockerfile Path** | `backend/Dockerfile` |
| **Build Command** | (Leave empty - Dockerfile handles it) |
| **Start Command** | (Leave empty - Dockerfile handles it) |

### 3.3 Add Environment Variables for Backend

After service is created, go to service settings:

1. **Click on the "backend" service** in the left sidebar
2. **Click the "Variables" tab**
3. **Add each variable by clicking "Add Variable":**

```
PORT = 5000

NODE_ENV = production

MONGO_URI = mongodb+srv://username:password@cluster-name.mongodb.net/hostelLogs?retryWrites=true&w=majority

JWT_SECRET = your-secret-key-here
```

**For MONGO_URI:**
- Log into MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Go to **Database** → **Connect**
- Choose **"Connect your application"**
- Copy the connection string
- Replace `<username>` and `<password>` with your credentials
- Example: `mongodb+srv://admin:myPassword123@cluster0.mongodb.net/hostelLogs?retryWrites=true&w=majority`

**For JWT_SECRET:**
- Generate a strong random string
- Option: Use online generator or run in terminal:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- Example: `a7f3c9d2e5b8f1a4c6e9d2b5f8a1c4e7f0a3d6c9f2e5b8a1d4g7h0k3m6`

### 3.4 Deploy Backend

1. **Click "Deploy"** button on the service
2. **Or** go to **"Deployments" tab** → **"Redeploy"**
3. Railway will:
   - Clone your repo
   - Navigate to `backend/` directory
   - Read `backend/Dockerfile`
   - Build the Docker image
   - Start the container
   - Assign a domain

### 3.5 Wait and Check Logs

1. Click on **"Deployments" tab**
2. You'll see the current deployment
3. **Click "View Logs"** to watch the build process
4. Look for messages like:
   - `npm install`
   - `Building from Dockerfile`
   - `Starting server`
   - `Server running on port 5000`

### 3.6 Get Backend Domain

Once deployment completes:

1. Go back to the **backend service view**
2. Look at the **"Domains"** section (usually shows at top)
3. You'll see a domain like: `outlog-backend-production.up.railway.app`
4. **Copy this URL** - you'll need it for the frontend!
5. **Test it**: Visit `https://outlog-backend-production.up.railway.app/`
   - Should show: **"Hostel Management API Running"**

---

## Step 4: Add Frontend Service

### 4.1 Add Frontend Service
- Click **"+ Add"** in Railway dashboard
- Select **"GitHub Repo"**
- Choose your **outLog** repository again

### 4.2 Configure Frontend Service

**Fill in these fields:**

| Field | Value |
|-------|-------|
| **Service Name** | `frontend` |
| **Root Directory** | `frontend` |
| **Dockerfile Path** | `frontend/Dockerfile` |
| **Build Command** | (Leave empty - Dockerfile handles it) |
| **Start Command** | (Leave empty - Dockerfile handles it) |

### 4.3 Add Environment Variables for Frontend

After service is created:

1. **Click on the "frontend" service**
2. **Click the "Variables" tab**
3. **Add this variable:**

```
REACT_APP_API_URL = https://your-backend-domain.up.railway.app/api
```

**Replace `your-backend-domain` with the actual domain from Step 3.6**

Example: `https://outlog-backend-production.up.railway.app/api`

### 4.4 Deploy Frontend

1. **Click "Deploy"** button on the service
2. Railway will:
   - Clone your repo
   - Navigate to `frontend/` directory
   - Read `frontend/Dockerfile`
   - Install dependencies
   - Run `npm run build` (creates optimized production bundle)
   - Start the serve process
   - Assign a domain

### 4.5 Wait and Check Frontend Logs

1. Click on **"Deployments" tab**
2. **Click "View Logs"** to watch the build
3. Look for:
   - `npm install`
   - `Building from Dockerfile`
   - `$ npm run build` (this takes 1-3 minutes)
   - `serve -s build -l 3000`

### 4.6 Get Frontend Domain

Once deployment completes:

1. Look at the **"Domains"** section
2. You'll see: `outlog-frontend-production.up.railway.app` (or similar)
3. **Copy this URL**

---

## Step 5: Verify Complete Deployment

### 5.1 Test Backend
- Visit: `https://your-backend-domain.up.railway.app/`
- Expected: **"Hostel Management API Running"**
- If you see this → ✅ Backend is working

### 5.2 Test Frontend
- Visit: `https://your-frontend-domain.up.railway.app/`
- Expected: See **login page** with email and password fields
- If you see this → ✅ Frontend is working

### 5.3 Test Full Application

1. **Go to the frontend URL** (from 5.2)
2. **Try to log in:**
   - Use existing credentials from your system
   - Or create a new account if registration is available
3. **Check browser console** (F12):
   - Should NOT see any red errors
   - Might see network requests to backend API
4. **The login should succeed** if:
   - Database connection is working
   - API is responding correctly
   - JWT tokens are being exchanged

### 5.4 Troubleshooting Test Failures

**If backend domain shows error:**
- Click backend service → "Deployment" → "View Logs"
- Look for error messages
- Check MongoDB URI is correct
- Verify all environment variables are set

**If frontend shows blank page:**
- Open browser Developer Tools (F12)
- Go to **Console tab**
- Look for error messages
- Check **Network tab** to see if API calls are working
- Make sure `REACT_APP_API_URL` is correct

**If login fails:**
- Check Network tab in browser DevTools
- Look for failed requests to `/api/auth/login`
- Check backend logs for errors
- Verify MongoDB is accessible

---

## Step 6: Finalize and Monitor

### 6.1 Commit Changes (if not already done)
```bash
git add .
git commit -m "Configure Railway deployment with separate services"
git push origin main
```

### 6.2 Configure Auto-Redeploy (Optional)

Railway automatically redeploys when you push to GitHub. To verify:
1. Go to service settings
2. Look for **"GitHub Integration"** or **"Auto-Deploy"** option
3. Should show **"Enabled"** or similar

### 6.3 Monitor Deployment

For future reference:
1. Go to Railway Dashboard
2. Click your project
3. View **Deployments** for each service
4. View **Logs** to debug issues
5. View **Metrics** to monitor CPU, Memory, Network

---

## Environment Variables Summary

### Backend Variables (Set in Railway Dashboard)
```
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/hostelLogs?retryWrites=true&w=majority
JWT_SECRET=your-generated-secret-key
```

### Frontend Variables (Set in Railway Dashboard)
```
REACT_APP_API_URL=https://outlog-backend-production.up.railway.app/api
```

---

## Security Checklist

Before going live:

- [ ] **JWT_SECRET is strong** (use crypto generator, not simple words)
- [ ] **MongoDB password is strong** (not "password123")
- [ ] **Never commit .env files** to GitHub
- [ ] **Use HTTPS** (Railway provides free SSL)
- [ ] **Enable MongoDB IP whitelist** (optional, for extra security)
- [ ] **Monitor logs regularly** for suspicious activity

---

## Common Issues During Redeployment

### Issue: "Cannot find module"
**Solution:**
- Check `package.json` exists in backend/ and frontend/
- All dependencies must be listed there
- Try redeploying: Service → Deployment → Redeploy

### Issue: Backend won't start
**Solution:**
- Check logs: Deployment → View Logs
- Verify MONGO_URI is correct
- Verify JWT_SECRET is set
- Check MongoDB Atlas allows connections from Railway IP

### Issue: Frontend shows blank page
**Solution:**
- Open DevTools (F12) → Console tab
- Check for JavaScript errors
- Verify REACT_APP_API_URL environment variable is set correctly
- Check Network tab to see if API calls are working

### Issue: Login fails but frontend loads
**Solution:**
- Check Network tab in DevTools
- Look for failed API requests
- Check backend logs for errors
- Verify database connection string is correct

### Issue: Build takes too long / times out
**Solution:**
- Ensure `node_modules` folder is in `.gitignore`
- Check for large files being committed
- Verify package.json has no unnecessary dependencies

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Railway Dashboard                        │
├────────────────────┬──────────────────────────────────────┤
│                    │                                        │
│  Backend Service   │        Frontend Service              │
│  ├─ Port: 5000     │        ├─ Port: 3000                │
│  ├─ Node.js        │        ├─ React App                 │
│  ├─ Express API    │        ├─ Served with "serve"       │
│  └─ Dockerfile     │        └─ Dockerfile                │
│                    │                                        │
│  Environment:      │        Environment:                   │
│  ├─ MONGO_URI      │        ├─ REACT_APP_API_URL         │
│  ├─ JWT_SECRET     │        └─ Points to backend domain   │
│  └─ PORT=5000      │                                        │
│                    │                                        │
└────────────────────┴──────────────────────────────────────┘
         │                              │
         └──────────────────┬───────────┘
                            │
                  ┌─────────▼──────────┐
                  │  MongoDB Atlas     │
                  │  (Cloud Database)  │
                  │  on the internet   │
                  └────────────────────┘
```

---

## Next Steps After Successful Deployment

1. **Share the frontend URL** with users
2. **Monitor logs** for the first few hours
3. **Test all features** (leave requests, gate pass, approvals, etc.)
4. **Set up alerts** (optional, in Railway settings)
5. **Plan backup strategy** (MongoDB Atlas has automatic backups)

---

## Support & Debugging

### If something goes wrong:

1. **Check logs first:**
   - Railway Dashboard → Your Project → Service → Deployments → View Logs

2. **Check environment variables:**
   - Railway Dashboard → Your Project → Service → Variables
   - Verify all required variables are set

3. **Test database connection:**
   - MongoDB Atlas → Database → Click database → Connection info verified

4. **Common errors:**
   - "Cannot connect to MongoDB" → Check MONGO_URI
   - "Invalid token" → Check JWT_SECRET
   - "API not found" → Check REACT_APP_API_URL

---

## Summary of Services

| Service | Language | Port | Directory | Dockerfile |
|---------|----------|------|-----------|-----------|
| Backend | Node.js | 5000 | backend/ | backend/Dockerfile |
| Frontend | React | 3000 | frontend/ | frontend/Dockerfile |
| Database | MongoDB | N/A | External | MongoDB Atlas Cloud |

---

**Good luck with your deployment! 🚀**

If you encounter any issues, share the error message and I'll help troubleshoot.
