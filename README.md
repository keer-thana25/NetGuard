# 🛡️ NetGuard – AI-Powered Network Traffic Anomaly Detection System



🌐 **Live Website:**  
https://net-guard-kohl.vercel.app/

---

NetGuard is an AI-powered **Network Traffic Anomaly Detection System** designed to identify suspicious or anomalous network behavior using Machine Learning.

The system analyzes network traffic features such as:

- Packet Size
- Source/Destination Ports
- TCP Flags
- Protocol Type (TCP/UDP)
- Spectral Entropy
- Frequency Band Energy
- Traffic Rate

to classify traffic as:

✅ Normal Traffic  
⚠️ Suspicious / Anomalous Traffic

---

## ✨ Demo Preview

> This version currently works as a **user-input based simulation system** for network traffic analysis.

Users manually enter network traffic parameters, and the ML model predicts whether the traffic is **Normal or Anomalous**.


---

## 🚀 Features

- Real-time anomaly prediction
- Interactive cybersecurity dashboard
- FastAPI backend integration
- Random Forest ML model
- Network traffic simulation
- Prediction confidence score
- Analytics & visualization

---

## 🧠 Workflow

```text
User Input
    ↓
React Dashboard
    ↓
FastAPI Backend
    ↓
Preprocessing
    ↓
Scaler (.pkl)
    ↓
Random Forest Model
    ↓
Prediction Result
```

## 🏗️ Tech Stack

### Frontend
- React.js
- Vite
- Axios
- Recharts

### Backend
- FastAPI
- Uvicorn
- Scikit-learn

### Machine Learning
- Random Forest
- Feature Engineering
- Feature Scaling
- Anomaly Detection

---

## 🔮 Future Enhancements

- Real-time packet capture
- Automated network monitoring
- Advanced anomaly visualization
- Multi-model detection
- Threat severity classification
- Database logging
- Authentication system
- Admin monitoring panel

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

---

## 👨‍💻 Author
Keerthana
