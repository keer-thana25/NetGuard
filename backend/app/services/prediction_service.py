import numpy as np
from app.models.model_loader import model_loader
from app.services.preprocess import preprocess_input

def predict_anomaly(input_data: dict) -> dict:
    """
    Coordinates the preprocessing, model execution, and response generation for anomaly detection.
    """
    try:
        # Preprocess and scale features
        df_scaled = preprocess_input(input_data)

        # Run prediction
        prediction_array = model_loader.model.predict(df_scaled)
        prediction = int(prediction_array[0])

        # Calculate prediction confidence
        probabilities = model_loader.model.predict_proba(df_scaled)[0]
        
        if prediction == 1:
            confidence = float(np.round(probabilities[1] * 100, 2))
            status = "Anomaly Detected"
            risk = "High"
        else:
            confidence = float(np.round(probabilities[0] * 100, 2))
            status = "Normal Traffic"
            risk = "Low"

        # Return standardized payload
        return {
            "prediction": prediction,
            "status": status,
            "confidence": confidence,
            "risk": risk
        }

    except Exception as e:
        print(f"Inference error: {e}")
        # Graceful fallback/exception raising
        raise RuntimeError(f"Error during network anomaly prediction: {str(e)}")
