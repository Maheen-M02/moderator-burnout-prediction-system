# 🧠 Moderator Burnout Detection System

A production-quality web application that analyzes moderator data, predicts burnout risk, and displays insights using advanced ML models and stunning visualizations.

## ✨ Features

- **Real-time Analytics Dashboard** - Monitor moderator health metrics
- **ML-Powered Predictions** - Multiple models for comprehensive analysis
- **Beautiful Dark UI** - Premium SaaS-style interface with smooth animations
- **Interactive Charts** - Activity trends, sentiment analysis, and clustering
- **Actionable Insights** - AI-generated recommendations for team management

## 🎯 Tech Stack

### Frontend
- React 18 with Vite
- Tailwind CSS for styling
- Recharts for data visualization
- Framer Motion for animations
- Lucide React for icons

### Backend
- FastAPI (Python)
- Pandas & NumPy for data processing
- Scikit-learn for ML models

### ML Models
- **Naive Bayes** - Sentiment classification
- **K-Means** - Moderator clustering
- **Decision Tree** - Burnout prediction
- **Linear Regression** - Workload analysis

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- pip

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start the server:
```bash
python main.py
```

Backend will run on `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## 📊 Usage

1. **Upload Data**: Navigate to the Upload page and drag & drop your CSV file
2. **View Dashboard**: Automatically redirected to see KPIs, charts, and insights
3. **Explore Analytics**: Check the Analytics page for clustering and model performance

### CSV Format

Your CSV file should contain these columns:

```csv
moderator_id,posts_moderated,toxic_posts,sentiment_score,activity_hours,response_time
mod_001,150,12,0.65,8.5,2.3
mod_002,200,25,0.45,10.2,3.1
```

**Column Descriptions:**
- `moderator_id`: Unique identifier
- `posts_moderated`: Total posts reviewed
- `toxic_posts`: Number of toxic posts handled
- `sentiment_score`: Sentiment score (0-1)
- `activity_hours`: Hours spent moderating
- `response_time`: Average response time in hours

## 📁 Project Structure

```
moderator-burnout-detection/
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Main pages (Dashboard, Upload, Analytics)
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── models/
│   │   └── ml_models.py    # ML model implementations
│   ├── main.py             # FastAPI application
│   └── requirements.txt
├── data/
│   ├── sample_moderator_data.csv
│   └── generate_sample.py
└── README.md
```

## 🎨 UI Components

- **KPI Cards** - Display key metrics with color-coded risk levels
- **Chart Cards** - Interactive visualizations with Recharts
- **Insight Cards** - AI-generated insights with icons
- **Recommendation Cards** - Actionable suggestions
- **Upload Panel** - Drag & drop file upload with preview

## 🤖 ML Pipeline

1. **Feature Engineering**
   - Workload score calculation
   - Toxicity ratio computation
   - Burnout risk indicators

2. **Model Training**
   - Naive Bayes for sentiment
   - K-Means for clustering (3 clusters)
   - Decision Tree for burnout prediction
   - Linear Regression for workload correlation

3. **Insights Generation**
   - Toxicity analysis
   - Sentiment trends
   - Activity patterns
   - Burnout risk assessment

4. **Recommendations**
   - Workload redistribution
   - Mental health support
   - Content filtering improvements
   - Team expansion suggestions

## 🔌 API Endpoints

- `GET /` - Health check
- `POST /api/upload` - Upload CSV file
- `POST /api/analyze` - Run ML analysis
- `GET /api/results` - Get analysis results

## 🎯 Sample Data

Use the provided sample data in `data/sample_moderator_data.csv` or generate your own:

```bash
cd data
python generate_sample.py
```

## 🛠️ Development

### Build for Production

Frontend:
```bash
cd frontend
npm run build
```

Backend:
```bash
cd backend
# Backend is production-ready as-is
```

## 📝 License

MIT License - feel free to use this project for your needs.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ using React, FastAPI, and Machine Learning
