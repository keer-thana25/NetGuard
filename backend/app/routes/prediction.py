from fastapi import APIRouter, HTTPException
from app.models.schema import TrafficInput, PredictionResponse
from app.services.prediction_service import predict_anomaly
from app.utils.helper import log_prediction

router = APIRouter()

@router.post("/predict", response_model=PredictionResponse)
def predict(payload: TrafficInput):
    """
    Predict endpoint for NetGuard.
    Receives network packet characteristics and outputs anomaly labels, risk level, and confidence.
    """
    try:
        # Convert Pydantic payload to dictionary
        input_data = payload.dict()
        result = predict_anomaly(input_data)
        
        # Log prediction metrics using helper utility
        log_prediction(input_data, result)
        
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )
