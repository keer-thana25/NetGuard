import sys
import os
import json

# Include app directory in python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from app.main import app

def test_batch_endpoints():
    client = TestClient(app)
    
    # 1. Test suggest-mapping
    print("\n--- Testing /suggest-mapping ---")
    payload = {
        "columns": ["pkt_size", "proto", "flags", "iat", "sport", "dport", "cnt", "ent", "eng", "attack_type"]
    }
    response = client.post("/suggest-mapping", json=payload)
    print(f"Status: {response.status_code}")
    print(f"Body: {response.json()}")
    assert response.status_code == 200
    suggested = response.json()
    assert "packet_size" in suggested
    assert "protocol" in suggested

    # 2. Test predict-batch validation error (required columns missing)
    print("\n--- Testing /predict-batch validation error ---")
    bad_payload = {
        "data": [
            {"pkt_size": 0.45, "proto": "TCP"}
        ],
        "mapping": {
            "packet_size": "wrong_col", # not in data keys
            "protocol": "proto"
        }
    }
    response = client.post("/predict-batch", json=bad_payload)
    print(f"Status: {response.status_code}")
    print(f"Body: {response.json()}")
    assert response.status_code == 400
    assert "error" in response.json()

    # 3. Test predict-batch success and SSE streaming
    print("\n--- Testing /predict-batch streaming success ---")
    good_payload = {
        "data": [
            {
                "pkt_size": 0.45,
                "iat": 0.20,
                "sport": 5000,
                "dport": 443,
                "cnt": 0.80,
                "ent": 0.75,
                "eng": 0.60,
                "proto": "TCP",
                "flags": "SYN",
                "label_col": "normal"
            },
            {
                "pkt_size": 0.95,
                "iat": 0.01,
                "sport": 34567,
                "dport": 80,
                "cnt": 9.5,
                "ent": 0.95,
                "eng": 0.02,
                "proto": "TCP",
                "flags": "SYN,FIN",
                "label_col": "anomaly"
            }
        ],
        "mapping": {
            "packet_size": "pkt_size",
            "inter_arrival_time": "iat",
            "src_port": "sport",
            "dst_port": "dport",
            "packet_count_5s": "cnt",
            "spectral_entropy": "ent",
            "frequency_band_energy": "eng",
            "protocol": "proto",
            "tcp_flags": "flags",
            "label": "label_col"
        }
    }

    # Use streaming request
    with client.stream("POST", "/predict-batch", json=good_payload) as response:
        print(f"Status: {response.status_code}")
        print(f"Headers: {response.headers}")
        assert response.status_code == 200
        assert "text/event-stream" in response.headers["content-type"]
        
        events = []
        for line in response.iter_lines():
            if line.startswith("data: "):
                event_content = line[6:].strip()
                events.append(json.loads(event_content))
                
        print("Received events:")
        for ev in events:
            print(ev)
            
        assert len(events) == 3 # 2 rows + 1 complete event
        assert events[0]["row_index"] == 1
        assert events[1]["row_index"] == 2
        assert events[2]["status"] == "complete"
        assert "evaluation" in events[2]
        print("All assertions passed!")

if __name__ == "__main__":
    test_batch_endpoints()
