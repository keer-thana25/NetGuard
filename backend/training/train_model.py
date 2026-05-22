import os
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import RobustScaler
from sklearn.ensemble import RandomForestClassifier

from training.feature_selection import remove_low_variance_features
from training.evaluate_model import evaluate_classifier

def run_training():
    """
    Trains the scikit-learn model using the notebook steps.
    Expects network_traffic.csv in the root workspace folder.
    """
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    workspace_dir = os.path.dirname(base_dir)
    csv_path = os.path.join(workspace_dir, "network_traffic.csv")

    if not os.path.exists(csv_path):
        print(f"Error: {csv_path} does not exist!")
        return

    # Load dataset
    print(f"Loading data from {csv_path}...")
    df = pd.read_csv(csv_path)

    # 1. Constant Feature Drop
    df_clean, dropped = remove_low_variance_features(df)
    print(f"Dropped low variance columns: {dropped}")

    # 2. Feature Engineering
    df_clean["traffic_rate"] = df_clean["packet_count_5s"] / (df_clean["inter_arrival_time"] + 0.0001)
    df_clean["port_difference"] = np.abs(df_clean["src_port"] - df_clean["dst_port"])
    df_clean["entropy_energy_ratio"] = df_clean["spectral_entropy"] / (df_clean["frequency_band_energy"] + 0.0001)

    # 3. Handle data types
    bool_cols = df_clean.select_dtypes(include=["bool"]).columns
    for col in bool_cols:
        df_clean[col] = df_clean[col].astype(int)

    # Split features and labels
    X = df_clean.drop("label", axis=1)
    y = df_clean["label"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # 4. Scaling
    scaler = RobustScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # Keep track of columns
    scaler.feature_names_in_ = np.array(X_train.columns)

    # 5. Model Training
    print("Training Random Forest Classifier...")
    rf_model = RandomForestClassifier(
        n_estimators=200,
        max_depth=10,
        random_state=42,
        class_weight="balanced"
    )
    rf_model.fit(X_train_scaled, y_train)

    # Evaluate
    metrics = evaluate_classifier(rf_model, X_test_scaled, y_test)
    print("\n--- Model Metrics ---")
    for k, v in metrics.items():
        print(f"{k}: {v:.4f}")

    # Save
    models_dir = os.path.join(base_dir, "saved_models")
    os.makedirs(models_dir, exist_ok=True)

    model_output = os.path.join(models_dir, "random_forest.pkl")
    scaler_output = os.path.join(models_dir, "scaler.pkl")
    encoder_output = os.path.join(models_dir, "encoder.pkl")

    joblib.dump(rf_model, model_output)
    joblib.dump(scaler, scaler_output)
    
    # Save dummy encoder matching columns
    encoder_data = {
        "protocols": ["TCP", "UDP"],
        "tcp_flags": ["FIN", "SYN", "SYN-ACK"],
        "src_ips": ["192.168.1.2", "192.168.1.3"],
        "dst_ips": ["192.168.1.5", "192.168.1.6"]
    }
    joblib.dump(encoder_data, encoder_output)

    print(f"\nSuccessfully trained and saved outputs to {models_dir}!")

if __name__ == "__main__":
    run_training()
