import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load models and endpoints on startup
from app.models.model_loader import model_loader
from app.routes.prediction import router as prediction_router

load_dotenv()

app = FastAPI(
    title="NetGuard API",
    description="AI-Powered Network Traffic Anomaly Detection System Backend",
    version="1.0.0"
)

# Configure CORS for communication with React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify frontend host (e.g., http://localhost:5173)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount prediction endpoints
app.include_router(prediction_router, tags=["Anomaly Detection"])

@app.get("/")
def read_root():
    return {
        "status": "online",
        "system": "NetGuard AI Network Traffic Anomaly Detector",
        "model_loaded": model_loader.model is not None,
        "scaler_loaded": model_loader.scaler is not None,
        "encoder_loaded": model_loader.encoder is not None
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    uvicorn.run("main:app", host=host, port=port, reload=True)
