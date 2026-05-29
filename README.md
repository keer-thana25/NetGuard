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

⚠️ **Note:**  
This is a **prototype/demo implementation**. Future versions will include real-time packet monitoring and automated traffic ingestion.

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

## 👨‍💻 Author
Keerthana
