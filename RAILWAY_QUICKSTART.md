# Railway Deployment Quick Start

## 5-Minute Setup

### 1. Prepare Your Repository
```bash
git add .
git commit -m "Add deployment configuration"
git push origin main
```

### 2. Create Railway Project
- Go to https://railway.app
- Click "New Project"
- Select "Deploy from GitHub repo"
- Choose your outLog repository

### 3. Add Environment Variables

**For Backend Service:**
```
PORT=5000
NODE_ENV=production
MONGO_URI=your-mongodb-atlas-uri
JWT_SECRET=your-secure-jwt-secret
```

**For Frontend Service:**
```
REACT_APP_API_URL=https://your-backend-railway-domain.up.railway.app/api
```

### 4. Configure MongoDB

Get your MongoDB Atlas connection string:
1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Database" → "Connect"
3. Choose "Connect your application"
4. Copy the connection string
5. Paste as `MONGO_URI` in Railway backend environment variables

**Connection String Format:**
```
mongodb+srv://username:password@cluster.mongodb.net/hostelLogs?retryWrites=true&w=majority
```

### 5. Update Frontend API URL

After backend deploys, Railway assigns a domain. Update frontend environment variable:
```
REACT_APP_API_URL=https://[your-backend-service-name].up.railway.app/api
```

### 6. Deploy
Push to GitHub, Railway automatically deploys:
```bash
git push origin main
```

---

## File Structure (Already Prepared)

✓ `/backend/Dockerfile` - Node.js production image
✓ `/frontend/Dockerfile` - React production build with serve
✓ `/.dockerignore` files - Optimized Docker builds
✓ `/docker-compose.yml` - Local testing
✓ `/backend/.env.example` - Environment template
✓ `/frontend/.env.production` - Production settings
✓ `/railway.json` - Railway configuration
✓ `/DEPLOYMENT.md` - Detailed guide

---

## Verify Deployment

1. **Backend health check:**
   ```
   https://your-backend-domain.up.railway.app/
   ```
   Should see: "Hostel Management API Running"

2. **Frontend:**
   ```
   https://your-frontend-domain.up.railway.app/
   ```
   Should load login page

3. **Test login** to verify API connectivity

---

## Next Steps

1. Push changes to GitHub
2. Log in to Railway.app
3. Create new project
4. Select your GitHub repository
5. Add environment variables (see above)
6. Deploy!

For detailed documentation, see `DEPLOYMENT.md`
