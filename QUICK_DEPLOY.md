# 🚀 Quick Deployment Guide

Follow these steps to deploy your Moderator Burnout Detection System.

## Step 1: Deploy Backend to Render (5 minutes)

1. **Create a Render account** at https://render.com

2. **Create a new Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `moderator-burnout-api`
     - **Region**: Oregon (US West)
     - **Branch**: `main`
     - **Root Directory**: Leave empty
     - **Environment**: `Python 3`
     - **Build Command**: `cd backend && pip install -r requirements.txt`
     - **Start Command**: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
     - **Plan**: Free

3. **Add Environment Variables** (in Render dashboard):
   ```
   PYTHON_VERSION=3.11.0
   ```

4. **Deploy** - Click "Create Web Service"

5. **Copy your backend URL** - It will be something like:
   ```
   https://moderator-burnout-api.onrender.com
   ```

## Step 2: Update Frontend Configuration (1 minute)

1. **Update `frontend/.env.production`** with your Render backend URL:
   ```env
   VITE_API_URL=https://moderator-burnout-api.onrender.com
   ```

2. **Update `vercel.json`** with your backend URL (replace the destination URL)

3. **Update `frontend/src/pages/Upload.jsx` and `LiveModeration.jsx`**:
   - Make sure axios is configured to use the environment variable
   - Add this at the top of both files if not already there:
   ```javascript
   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
   ```

## Step 3: Deploy Frontend to Vercel (3 minutes)

### Option A: Using Vercel CLI (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   cd frontend
   vercel --prod
   ```

4. **Follow the prompts**:
   - Set up and deploy? `Y`
   - Which scope? Select your account
   - Link to existing project? `N`
   - Project name? `moderator-burnout-dashboard`
   - Directory? `./` (current directory)
   - Override settings? `N`

### Option B: Using Vercel Dashboard

1. **Go to** https://vercel.com

2. **Click "Add New Project"**

3. **Import your GitHub repository**

4. **Configure**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. **Add Environment Variable**:
   ```
   VITE_API_URL=https://moderator-burnout-api.onrender.com
   ```

6. **Click "Deploy"**

## Step 4: Test Your Deployment (2 minutes)

1. **Visit your Vercel URL** (e.g., `https://moderator-burnout-dashboard.vercel.app`)

2. **Test the landing page** - Should load with video

3. **Click "Initialize Deployment"** - Should go to dashboard

4. **Test Upload**:
   - Go to Upload page
   - Upload the sample CSV from `data/sample_moderator_data.csv`
   - Should analyze and show results

5. **Test Live Moderation**:
   - Go to Live Moderation page
   - Enter some text
   - Click "Analyze Content"
   - Should show moderation results

## 🎉 You're Live!

Your app is now deployed at:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-api.onrender.com`

## ⚠️ Important Notes

### Free Tier Limitations

**Render Free Tier**:
- Backend will sleep after 15 minutes of inactivity
- First request after sleep takes ~30 seconds to wake up
- 750 hours/month free

**Vercel Free Tier**:
- Unlimited bandwidth
- 100 GB-hours of serverless function execution
- Perfect for frontend hosting

### Upgrade Options

If you need better performance:
- **Render**: Upgrade to Starter ($7/month) for always-on backend
- **Vercel**: Pro plan ($20/month) for advanced features

## 🔧 Troubleshooting

### Backend not responding
- Check Render logs in dashboard
- Verify environment variables are set
- Make sure backend URL in frontend is correct

### CORS errors
- Verify backend CORS settings in `backend/main.py`
- Make sure frontend URL is in allowed origins

### Upload not working
- Check backend logs for errors
- Verify CSV format matches expected format
- Check file size (should be under 10MB)

### Frontend not loading
- Clear browser cache
- Check Vercel deployment logs
- Verify build completed successfully

## 📱 Custom Domain (Optional)

### Add Custom Domain to Vercel:
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed

### Add Custom Domain to Render:
1. Go to Service Settings → Custom Domain
2. Add your domain
3. Update DNS records as instructed

## 🔄 Continuous Deployment

Both Vercel and Render support automatic deployments:
- Push to `main` branch → Auto-deploy
- Pull requests → Preview deployments

## 📊 Monitoring

### Render Dashboard:
- View logs
- Monitor CPU/Memory usage
- Check request metrics

### Vercel Dashboard:
- View deployment logs
- Monitor bandwidth usage
- Check function execution time

## 🆘 Need Help?

- Check `DEPLOYMENT.md` for detailed documentation
- Review Render logs for backend issues
- Review Vercel logs for frontend issues
- Check browser console for client-side errors

---

**Deployment Time**: ~10 minutes total
**Cost**: $0 (Free tier)
**Maintenance**: Auto-deploys on git push
