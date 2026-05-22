import sys
import os

# Include app directory in python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.services.prediction_service import predict_anomaly

def test_offline_predictions():
    # Sample TCP Normal Traffic Input
    normal_input = {
        "packet_size": 0.45,
        "inter_arrival_time": 0.20,
        "src_port": 5000,
        "dst_port": 443,
        "packet_count_5s": 0.80,
        "spectral_entropy": 0.75,
        "frequency_band_energy": 0.60,
        "protocol": "TCP",
        "tcp_flags": ["SYN"],
        "src_ip": None,
        "dst_ip": None
    }

    # Sample TCP Anomaly Traffic Input (typically high count, entropy/energy discrepancy)
    anomaly_input = {
        "packet_size": 0.95,
        "inter_arrival_time": 0.01,
        "src_port": 34567,
        "dst_port": 80,
        "packet_count_5s": 9.5,
        "spectral_entropy": 0.95,
        "frequency_band_energy": 0.02,
        "protocol": "TCP",
        "tcp_flags": ["SYN", "FIN"],
        "src_ip": "192.168.1.2",
        "dst_ip": "192.168.1.5"
    }

    print("--- Running Backend Offline Prediction Tests ---")
    
    print("\nTesting Normal Traffic Payload:")
    try:
        res1 = predict_anomaly(normal_input)
        print(f"Result: {res1}")
    except Exception as e:
        print(f"FAILED normal: {e}")

    print("\nTesting Anomaly Traffic Payload:")
    try:
        res2 = predict_anomaly(anomaly_input)
        print(f"Result: {res2}")
    except Exception as e:
        print(f"FAILED anomaly: {e}")

if __name__ == "__main__":
    test_offline_predictions()
