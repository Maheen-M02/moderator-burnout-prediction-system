from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
from io import StringIO
import os
from models.ml_models import ModeratorAnalyzer
from models.content_analyzer import ContentModerator

app = FastAPI(title="Moderator Burnout Detection API")

# Enhanced CORS for mobile compatibility
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

analyzer = ModeratorAnalyzer()
content_moderator = ContentModerator()
current_data = None

class ContentRequest(BaseModel):
    text: str

class BatchContentRequest(BaseModel):
    texts: list[str]

@app.get("/")
def read_root():
    return {"message": "Moderator Burnout Detection API", "status": "active"}

@app.get("/health")
def health_check():
    """Health check endpoint for mobile connectivity testing"""
    return {"status": "healthy", "service": "moderator-burnout-api"}

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    global current_data
    
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")
    
    try:
        # Read file with better error handling
        contents = await file.read()
        
        # Validate file size (max 10MB)
        if len(contents) > 10 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File too large. Maximum size is 10MB")
        
        # Decode with error handling
        try:
            decoded_content = contents.decode('utf-8')
        except UnicodeDecodeError:
            decoded_content = contents.decode('utf-8', errors='ignore')
        
        df = pd.read_csv(StringIO(decoded_content))
        
        required_columns = ['moderator_id', 'posts_moderated', 'toxic_posts', 
                          'sentiment_score', 'activity_hours', 'response_time']
        
        if not all(col in df.columns for col in required_columns):
            raise HTTPException(
                status_code=400,
                detail=f"CSV must contain columns: {', '.join(required_columns)}"
            )
        
        current_data = df
        
        return {
            "message": "File uploaded successfully",
            "rows": len(df),
            "columns": list(df.columns),
            "status": "success"
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

@app.post("/api/analyze")
def analyze_data():
    global current_data
    
    if current_data is None:
        raise HTTPException(status_code=400, detail="No data uploaded. Please upload a CSV file first.")
    
    try:
        results = analyzer.analyze(current_data)
        return results
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis error: {str(e)}")

@app.get("/api/results")
def get_results():
    if current_data is None:
        raise HTTPException(status_code=400, detail="No data available")
    
    try:
        results = analyzer.analyze(current_data)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@app.post("/api/moderate/text")
def moderate_text(request: ContentRequest):
    """Analyze a single text for moderation"""
    try:
        result = content_moderator.analyze_content(request.text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Moderation error: {str(e)}")

@app.post("/api/moderate/batch")
def moderate_batch(request: BatchContentRequest):
    """Analyze multiple texts for moderation"""
    try:
        result = content_moderator.batch_analyze(request.texts)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Batch moderation error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
