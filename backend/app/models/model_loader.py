import os
import joblib
from dotenv import load_dotenv

load_dotenv()

class ModelLoader:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ModelLoader, cls).__new__(cls)
            cls._instance.model = None
            cls._instance.scaler = None
            cls._instance.encoder = None
            cls._instance.load_all()
        return cls._instance

    def load_all(self):
        # Resolve paths relative to app/../saved_models
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        
        model_path = os.getenv("MODEL_PATH", "saved_models/random_forest.pkl")
        scaler_path = os.getenv("SCALER_PATH", "saved_models/scaler.pkl")
        encoder_path = os.getenv("ENCODER_PATH", "saved_models/encoder.pkl")

        # Handle relative to root
        full_model_path = os.path.join(base_dir, model_path) if not os.path.isabs(model_path) else model_path
        full_scaler_path = os.path.join(base_dir, scaler_path) if not os.path.isabs(scaler_path) else scaler_path
        full_encoder_path = os.path.join(base_dir, encoder_path) if not os.path.isabs(encoder_path) else encoder_path

        print(f"Loading model from: {full_model_path}")
        print(f"Loading scaler from: {full_scaler_path}")
        print(f"Loading encoder from: {full_encoder_path}")

        try:
            self.model = joblib.load(full_model_path)
            print("Model loaded successfully.")
        except Exception as e:
            print(f"Error loading model: {e}")
            raise e

        try:
            self.scaler = joblib.load(full_scaler_path)
            print("Scaler loaded successfully.")
        except Exception as e:
            print(f"Error loading scaler: {e}")
            raise e

        try:
            self.encoder = joblib.load(full_encoder_path)
            print("Encoder loaded successfully.")
        except Exception as e:
            print(f"Error loading encoder: {e}")
            raise e

# Instantiate a global instance to load models on startup
model_loader = ModelLoader()
