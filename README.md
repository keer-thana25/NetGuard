# NetGuard: AI-Powered Network Traffic Anomaly Detection System

NetGuard is a fully functional, production-ready cybersecurity dashboard application designed to analyze network traffic telemetry and detect anomalies in real-time. It uses an ensemble **Random Forest Classifier** trained on scikit-learn to identify threat patterns (e.g., port scanning, SYN floods, UDP bursts).

The visual aesthetic mimics modern high-tech security operations centers (think CrowdStrike or Splunk), featuring glassmorphism elements, neon highlights, responsive charting, and a dynamic simulated live traffic stream.

---

## 🛠 Tech Stack

- **Frontend**: React.js (scaffolded via Vite, styled using premium Vanilla CSS)
- **Backend**: FastAPI (Python web server running on Uvicorn)
- **Machine Learning**: Scikit-Learn (RobustScaler preprocessing & RandomForest Classifier)
- **Charts Engine**: Recharts (Custom SVG responsive data plots)
- **Communication**: Axios API (Asynchronous HTTP connection)
- **Model Storage**: Joblib serialization (`.pkl`)

---

## 📂 Project Structure

```
network-anomaly-project/
│
├── backend/
│   │
│   ├── app/
│   │   ├── main.py                    # FastAPI entrypoint, CORS configuration
│   │   ├── routes/
│   │   │   └── prediction.py          # /predict router handler
│   │   ├── services/
│   │   │   ├── preprocess.py          # Data scaling & one-hot categorical encoder mapping
│   │   │   ├── prediction_service.py  # Inference orchestration & confidence scoring
│   │   │   └── feature_engineering.py # traffic_rate, port_difference, entropy_ratio
│   │   ├── models/
│   │   │   ├── model_loader.py        # Thread-safe scikit-learn model singleton loader
│   │   │   └── schema.py              # Pydantic validation input/output schemas
│   │   └── utils/
│   │       └── helper.py              # Custom logger utility
│   │
│   ├── saved_models/
│   │   ├── random_forest.pkl          # Serialized Random Forest model
│   │   ├── scaler.pkl                 # Serialized robust scaling weights
│   │   └── encoder.pkl                # Serialized metadata structures
│   │
│   ├── training/
│   │   ├── train_model.py             # Reproducible ML training pipeline script
│   │   ├── feature_selection.py       # Variance threshold filter script
│   │   └── evaluate_model.py          # Metrics evaluation script
│   │
│   ├── requirements.txt               # Backend dependencies
│   └── .env                           # Server environment configs
│
├── frontend/
│   │
│   ├── src/
│   │   ├── pages/
│   │   │   └── Dashboard.jsx          # Hero statistics & live simulated stream table
│   │   ├── components/
│   │   │   ├── PredictionForm.jsx     # Network telemetries input panel with scenarios presets
│   │   │   ├── ResultCard.jsx         # Glowing decision indicators, threat risk metrics
│   │   │   └── Charts.jsx             # Recharts components (trends, ports, protocols, importances)
│   │   ├── services/
│   │   │   └── api.js                 # Axios API connector clients
│   │   └── App.jsx                    # Primary app router state, layout header & health indicator
│   │
│   └── package.json                   # Frontend dependencies
│
└── README.md                          # Instruction documentation
```

---

## ⚡ Setup & Installation Instructions

Follow these instructions to run the full application locally:

### 1. Prerequisites
Ensure you have **Python 3.10+** and **Node.js 18+** installed.

---

### 2. Backend Setup & Startup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Start the FastAPI development server:
   ```bash
   uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```
   The backend will be online at `http://127.0.0.1:8000`. You should see `API_SYS: ONLINE` blink green on your frontend navbar when started successfully!

---

### 3. Frontend Setup & Startup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node dependencies:
   ```bash
   npm install
   ```

3. Spin up the Vite development server:
   ```bash
   npm run dev
   ```
   Vite will host the frontend at `http://localhost:5173`. Open this URL in your web browser to access the interactive dashboard!

---

## 🔬 API & Integration Testing

To test the backend independently using tools like `curl` or Postman, make a `POST` request to the endpoint `/predict`:

### Endpoint
`POST http://localhost:8000/predict`

### Sample Request Headers
```json
Content-Type: application/json
```

### Sample Payloads

#### 1. Expected Anomaly Payload (SYN Flood Scan signature)
```json
{
  "packet_size": 0.332,
  "inter_arrival_time": 0.737,
  "src_port": 30522,
  "dst_port": 443,
  "packet_count_5s": 0.142,
  "spectral_entropy": 0.838,
  "frequency_band_energy": 0.926,
  "protocol": "TCP",
  "tcp_flags": ["SYN"],
  "src_ip": null,
  "dst_ip": null
}
```

#### Expected Anomaly Response
```json
{
  "prediction": 1,
  "status": "Anomaly Detected",
  "confidence": 60.1,
  "risk": "High"
}
```

#### 2. Expected Normal Payload (Standard HTTPS web socket connection)
```json
{
  "packet_size": 0.25,
  "inter_arrival_time": 0.15,
  "src_port": 52431,
  "dst_port": 443,
  "packet_count_5s": 0.35,
  "spectral_entropy": 0.22,
  "frequency_band_energy": 0.85,
  "protocol": "TCP",
  "tcp_flags": ["SYN"],
  "src_ip": "192.168.1.2",
  "dst_ip": "192.168.1.5"
}
```

#### Expected Normal Response
```json
{
  "prediction": 0,
  "status": "Normal Traffic",
  "confidence": 80.74,
  "risk": "Low"
}
```

---

## 🔬 DEMO INSTRUCTIONS (For Faculty Viva / Evaluation)

To present the new automated network anomaly detection features to an evaluator, follow this step-by-step checklist:

1. **Start Backend**: Open a terminal in the `backend` folder and run:
   ```bash
   uvicorn app.main:app --reload
   ```
2. **Start Frontend**: Open another terminal in the `frontend` folder and run:
   ```bash
   npm run dev
   ```
3. **Open Application**: Navigate to `http://localhost:5173` in your browser.
4. **Show Dashboard**: Highlight the modern SOC product layout and real-time feed simulation.
5. **Launch Live Telemetry**: Click the **"Launch Traffic Analyzer"** button on the home page. Explain that this redirects the user to the brand-new automated monitor.
6. **Start Telemetry Sniffing**: Click **"Start Monitoring"** on the Live Monitor page. Note that a green "Safe" panel appears, and the graph immediately begins plotting continuous risk scores over time.
7. **Simulate Cyber Attack**: Click **"Simulate Attack"** to force a malicious traffic sample through the pipeline. Observe that:
   - The risk panel transitions from green to red/orange.
   - The risk score spike is reflected on the Recharts line graph.
   - An alert log is added to the session table below.
   - A custom toast notification slides in from the top-right corner explaining the threat severity and reason in plain English.
8. **Export PDF Summary**: Click **"Download Report"** to export an automated PDF of the monitoring session. Open the PDF to show the table listing all isolated alerts and metadata.
9. **Show Tech Settings**: Click the **"Traffic Analysis"** tab in the navbar. Explain that technical users can still manually test specific connection packet profiles using the original form.
10. **Key Viva Explanation**: State: *"I kept the original manual prediction form under Traffic Analysis for technical users. But now, normal users can just click Launch Traffic Analyzer and the system captures network packets automatically — requiring no manual inputs or advanced networking knowledge."*
