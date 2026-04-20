# 🚀 Deployment Guide

Complete guide for deploying the Moderator Burnout Detection System to production.

## 📋 Table of Contents

1. [Quick Deploy Options](#quick-deploy-options)
2. [Frontend Deployment](#frontend-deployment)
3. [Backend Deployment](#backend-deployment)
4. [Full Stack Deployment](#full-stack-deployment)
5. [Environment Variables](#environment-variables)
6. [Database Setup (Optional)](#database-setup)

---

## 🎯 Quick Deploy Options

### Option 1: Vercel (Frontend) + Render (Backend)
**Best for**: Quick deployment, free tier available
**Time**: ~15 minutes

### Option 2: Railway (Full Stack)
**Best for**: Single platform deployment
**Time**: ~10 minutes

### Option 3: AWS/DigitalOcean (Self-hosted)
**Best for**: Full control, production scale
**Time**: ~30 minutes

---

## 🎨 Frontend Deployment

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Build the frontend**
```bash
cd frontend
npm run build
```

3. **Deploy**
```bash
vercel
```

4. **Configure Environment Variables** in Vercel Dashboard:
```
VITE_API_URL=https://your-backend-url.com
```

### Deploy to Netlify

1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Build and deploy**
```bash
cd frontend
npm run build
netlify deploy --prod
```

3. **Configure redirects** - Create `frontend/public/_redirects`:
```
/api/*  https://your-backend-url.com/api/:splat  200
/*  /index.html  200
```

### Deploy to GitHub Pages

1. **Update `vite.config.js`**:
```javascript
export default defineConfig({
  base: '/your-repo-name/',
  // ... rest of config
})
```

2. **Build and deploy**:
```bash
cd frontend
npm run build
npx gh-pages -d dist
```

---

## 🐍 Backend Deployment

### Deploy to Render (Recommended)

1. **Create `render.yaml`** in project root:
```yaml
services:
  - type: web
    name: moderator-burnout-api
    env: python
    buildCommand: "cd backend && pip install -r requirements.txt"
    startCommand: "cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT"
    envVars:
      - key: PYTHON_VERSION
        value: 3.11.0
```

2. **Push to GitHub** and connect to Render

3. **Deploy** - Render will auto-deploy on push

### Deploy to Railway

1. **Install Railway CLI**
```bash
npm install -g @railway/cli
```

2. **Login and deploy**
```bash
railway login
cd backend
railway init
railway up
```

3. **Set environment variables**:
```bash
railway variables set PYTHON_VERSION=3.11
```

### Deploy to Heroku

1. **Create `Procfile`** in backend folder:
```
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

2. **Create `runtime.txt`**:
```
python-3.11.0
```

3. **Deploy**:
```bash
cd backend
heroku create your-app-name
git push heroku main
```

### Deploy to AWS EC2

1. **Launch EC2 instance** (Ubuntu 22.04)

2. **SSH into instance**:
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

3. **Install dependencies**:
```bash
sudo apt update
sudo apt install python3-pip python3-venv nginx -y
```

4. **Clone and setup**:
```bash
git clone your-repo-url
cd your-repo/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

5. **Create systemd service** `/etc/systemd/system/moderator-api.service`:
```ini
[Unit]
Description=Moderator Burnout API
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/your-repo/backend
Environment="PATH=/home/ubuntu/your-repo/backend/venv/bin"
ExecStart=/home/ubuntu/your-repo/backend/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000

[Install]
WantedBy=multi-user.target
```

6. **Start service**:
```bash
sudo systemctl start moderator-api
sudo systemctl enable moderator-api
```

7. **Configure Nginx** `/etc/nginx/sites-available/moderator-api`:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

8. **Enable and restart Nginx**:
```bash
sudo ln -s /etc/nginx/sites-available/moderator-api /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

---

## 🔄 Full Stack Deployment

### Deploy to Railway (Both Frontend & Backend)

1. **Create `railway.json`** in project root:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

2. **Deploy**:
```bash
railway login
railway init
railway up
```

### Deploy to DigitalOcean App Platform

1. **Create `app.yaml`**:
```yaml
name: moderator-burnout-system
services:
  - name: backend
    github:
      repo: your-username/your-repo
      branch: main
      deploy_on_push: true
    source_dir: backend
    run_command: uvicorn main:app --host 0.0.0.0 --port 8080
    http_port: 8080
    
  - name: frontend
    github:
      repo: your-username/your-repo
      branch: main
      deploy_on_push: true
    source_dir: frontend
    build_command: npm run build
    run_command: npm run preview
    http_port: 4173
```

2. **Deploy via DigitalOcean Dashboard** or CLI

### Docker Deployment

1. **Create `backend/Dockerfile`**:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

2. **Create `frontend/Dockerfile`**:
```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

3. **Create `docker-compose.yml`** in project root:
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - PYTHON_ENV=production
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    environment:
      - VITE_API_URL=http://backend:8000
    depends_on:
      - backend
    restart: unless-stopped
```

4. **Deploy**:
```bash
docker-compose up -d
```

---

## 🔐 Environment Variables

### Frontend (.env.production)
```env
VITE_API_URL=https://your-backend-url.com
```

### Backend (.env)
```env
# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=False

# CORS Origins (comma-separated)
CORS_ORIGINS=https://your-frontend-url.com,https://www.your-domain.com

# Optional: Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Optional: Redis Cache
REDIS_URL=redis://localhost:6379

# Optional: Sentry Error Tracking
SENTRY_DSN=your-sentry-dsn
```

---

## 💾 Database Setup (Optional)

For persistent storage of analysis results:

### PostgreSQL Setup

1. **Update `backend/requirements.txt`**:
```
psycopg2-binary==2.9.9
sqlalchemy==2.0.23
```

2. **Create database models** `backend/models/database.py`:
```python
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./moderator.db")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Analysis(Base):
    __tablename__ = "analyses"
    
    id = Column(Integer, primary_key=True, index=True)
    text = Column(String)
    risk_score = Column(Float)
    action = Column(String)
    created_at = Column(DateTime)

Base.metadata.create_all(bind=engine)
```

---

## 🔍 Health Checks

Add health check endpoints for monitoring:

**Backend** (`backend/main.py`):
```python
@app.get("/health")
def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}
```

---

## 📊 Monitoring & Logging

### Add Sentry for Error Tracking

1. **Install Sentry**:
```bash
pip install sentry-sdk[fastapi]
```

2. **Configure in `backend/main.py`**:
```python
import sentry_sdk

sentry_sdk.init(
    dsn=os.getenv("SENTRY_DSN"),
    traces_sample_rate=1.0,
)
```

### Add Logging

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)
```

---

## 🚦 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Render
        run: |
          curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        run: |
          npm install -g vercel
          cd frontend
          vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

---

## ✅ Post-Deployment Checklist

- [ ] Frontend loads correctly
- [ ] Backend API responds to health check
- [ ] CORS configured properly
- [ ] Environment variables set
- [ ] SSL/HTTPS enabled
- [ ] Database connected (if using)
- [ ] Error tracking configured
- [ ] Monitoring setup
- [ ] Backup strategy in place
- [ ] Domain configured
- [ ] CDN setup (optional)

---

## 🆘 Troubleshooting

### CORS Errors
Update `backend/main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend-url.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Build Failures
- Check Node.js version (18+)
- Check Python version (3.9+)
- Clear build cache
- Verify all dependencies installed

### API Connection Issues
- Verify backend URL in frontend env
- Check firewall rules
- Verify SSL certificates
- Check API logs

---

## 💰 Cost Estimates

### Free Tier Options
- **Vercel** (Frontend): Free for personal projects
- **Render** (Backend): Free tier available (sleeps after inactivity)
- **Railway** (Full Stack): $5/month credit

### Paid Options
- **Vercel Pro**: $20/month
- **Render Standard**: $7/month per service
- **AWS EC2 t3.micro**: ~$10/month
- **DigitalOcean Droplet**: $6/month

---

## 📚 Additional Resources

- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [Vite Production Build](https://vitejs.dev/guide/build.html)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Nginx Configuration](https://nginx.org/en/docs/)

---

**Need help?** Open an issue on GitHub or contact support.
