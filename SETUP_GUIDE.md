# 🚀 Complete Setup Guide

## Step-by-Step Installation

### 1. Backend Setup (Python/FastAPI)

#### Windows
```powershell
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
.\\venv\\Scripts\\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python main.py
```

#### macOS/Linux
```bash
# Navigate to backend
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python main.py
```

The backend will start on `http://localhost:8000`

### 2. Frontend Setup (React/Vite)

Open a new terminal window:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on `http://localhost:3000`

### 3. Test the Application

1. Open your browser to `http://localhost:3000`
2. Click on "Upload Data" in the sidebar
3. Drag and drop the sample CSV file from `data/sample_moderator_data.csv`
4. Click "Analyze Data"
5. View the dashboard with all insights and charts

## 🔧 Troubleshooting

### Backend Issues

**Problem**: `ModuleNotFoundError`
```bash
# Make sure virtual environment is activated
# Reinstall dependencies
pip install -r requirements.txt
```

**Problem**: Port 8000 already in use
```bash
# Change port in backend/main.py (last line)
uvicorn.run(app, host="0.0.0.0", port=8001)
```

### Frontend Issues

**Problem**: `npm install` fails
```bash
# Clear npm cache
npm cache clean --force
# Try again
npm install
```

**Problem**: Port 3000 already in use
```bash
# Vite will automatically suggest another port
# Or specify in vite.config.js
```

**Problem**: API calls fail
- Make sure backend is running on port 8000
- Check browser console for CORS errors
- Verify proxy settings in `vite.config.js`

## 📦 Production Deployment

### Backend (FastAPI)

```bash
# Install production server
pip install gunicorn

# Run with gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
```

### Frontend (React)

```bash
# Build for production
npm run build

# The dist/ folder contains production files
# Deploy to Vercel, Netlify, or any static host
```

## 🎯 Environment Variables

Create `.env` files if needed:

**Backend** (`backend/.env`):
```env
API_PORT=8000
DEBUG=False
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:8000
```

## 🧪 Testing

### Test Backend API

```bash
# Test health endpoint
curl http://localhost:8000/

# Test upload (with sample data)
curl -X POST -F "file=@data/sample_moderator_data.csv" http://localhost:8000/api/upload
```

### Test Frontend

```bash
cd frontend
npm run build
npm run preview
```

## 📊 Using Your Own Data

Create a CSV file with these columns:
- `moderator_id` - Unique ID (string)
- `posts_moderated` - Number of posts (integer)
- `toxic_posts` - Toxic posts count (integer)
- `sentiment_score` - Score 0-1 (float)
- `activity_hours` - Hours worked (float)
- `response_time` - Response time in hours (float)

Example:
```csv
moderator_id,posts_moderated,toxic_posts,sentiment_score,activity_hours,response_time
mod_001,150,12,0.65,8.5,2.3
mod_002,200,25,0.45,10.2,3.1
```

## 🎨 Customization

### Change Theme Colors

Edit `frontend/tailwind.config.js`:
```javascript
colors: {
  dark: {
    bg: '#0a0a0f',      // Main background
    card: '#13131a',    // Card background
    border: '#1f1f28',  // Border color
    hover: '#1a1a24'    // Hover state
  }
}
```

### Modify ML Models

Edit `backend/models/ml_models.py` to:
- Add new models
- Adjust clustering parameters
- Change feature engineering logic
- Customize insights generation

## 🔐 Security Notes

For production:
1. Update CORS settings in `backend/main.py`
2. Add authentication/authorization
3. Use environment variables for sensitive data
4. Enable HTTPS
5. Add rate limiting

## 📈 Performance Tips

1. **Backend**: Use Redis for caching analysis results
2. **Frontend**: Implement lazy loading for charts
3. **Database**: Add PostgreSQL for persistent storage
4. **Scaling**: Use Docker for containerization

## ✅ Verification Checklist

- [ ] Backend running on port 8000
- [ ] Frontend running on port 3000
- [ ] Can upload CSV file
- [ ] Dashboard shows KPI cards
- [ ] Charts render correctly
- [ ] Insights and recommendations appear
- [ ] Analytics page shows clustering
- [ ] No console errors

## 🆘 Getting Help

If you encounter issues:
1. Check the console for error messages
2. Verify all dependencies are installed
3. Ensure both servers are running
4. Check the sample data format
5. Review the API response in browser DevTools

---

Happy coding! 🎉
