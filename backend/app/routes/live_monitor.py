import threading
import time
import random
from datetime import datetime
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

# Import model loading, preprocessing, packet capture and PDF generator utilities
from app.models.model_loader import model_loader
from app.services.preprocess import preprocess_input
from app.services.packet_capture import capture_and_extract_features, get_simulated_features
from app.services.report_generator import generate_session_report
from app.services.network_speed import get_network_speed

router = APIRouter()

def get_risk_details(risk_score: float) -> tuple:
    """
    Categorizes risk score (0-100) into label and color code.
    """
    if risk_score <= 30:
        return "Safe", "green"
    elif risk_score <= 60:
        return "Suspicious", "yellow"
    elif risk_score <= 85:
        return "High Risk", "orange"
    else:
        return "Critical Threat", "red"

def get_plain_reason(features: dict, risk_score: float) -> str:
    """
    Generates plain English threat explanation based on network properties and risk.
    """
    if features.get("packet_size", 0.0) > 1400:
        return "Unusually large packets detected (possible data exfiltration)"
    
    if features.get("inter_arrival_time", 999.0) < 0.01:
        return "Packets arriving extremely fast (possible DDoS or flood)"
        
    # Check both potential key names for packet count
    p_count = features.get("packet_count")
    if p_count is None:
        p_count = features.get("packet_count_5s", 0.0)
        
    if p_count > 900:
        return "Very high packet count (possible scan or flood)"
        
    if features.get("spectral_entropy", 0.0) > 7.5:
        return "Highly random data patterns (possible encrypted tunnel)"
        
    dst_port = features.get("destination_port")
    if dst_port is None:
        dst_port = features.get("dst_port", 0)
        
    if dst_port in [4444, 1337, 6667, 9999, 31337]:
        return f"Connection to suspicious port {dst_port} (common malware port)"
        
    if risk_score <= 30:
        return "Traffic looks normal"
    else:
        return "Unusual combination of network parameters"

class MonitorSession:
    """
    Holds status, statistics, and history records for the current monitoring session.
    """
    def __init__(self):
        self.is_monitoring = False
        self.thread = None
        self.stop_event = threading.Event()
        self.lock = threading.Lock()
        
        # Stats
        self.packets_analyzed = 0
        self.anomaly_count = 0
        self.alerts = []       # [{ time, label, color, risk_score, reason }]
        self.history = []      # [{ time, risk_score }] (holds last 20 data points)
        self.last_status = {
            "risk_score": 0.0,
            "label": "Safe",
            "color": "green",
            "reason": "Traffic looks normal",
            "packets_analyzed": 0,
            "anomaly_count": 0,
            "timestamp": ""
        }

monitor_session = MonitorSession()

def monitoring_thread_loop():
    """
    Continually sniffs network traffic, runs model inference, updates status, and appends alerts.
    Cycles every ~3 seconds (2s sniff, 1s sleep/overhead).
    """
    global monitor_session
    print("Background packet monitoring cycle started.")
    
    while not monitor_session.stop_event.is_set():
        try:
            # 1. Capture packet details (sniffs for 2s, falls back to simulation on error/empty)
            features = capture_and_extract_features()
            
            # Check if monitoring was turned off during the sniff timeout
            if monitor_session.stop_event.is_set():
                break
                
            # 2. Build input dictionary aligned with the model's preprocessing schema
            protocol_str = "TCP" if features["protocol_type"] == 6 else "UDP" if features["protocol_type"] == 17 else "TCP"
            input_data = {
                "packet_size": features["packet_size"],
                "inter_arrival_time": features["inter_arrival_time"],
                "src_port": int(features["source_port"]),
                "dst_port": int(features["destination_port"]),
                "packet_count_5s": float(features["packet_count"]),
                "spectral_entropy": features["spectral_entropy"],
                "frequency_band_energy": features["freq_band_energy"],
                "protocol": protocol_str,
                "tcp_flags": features.get("tcp_flags_list", []),
                "src_ip": features.get("src_ip"),
                "dst_ip": features.get("dst_ip")
            }
            
            # 3. Model Inference to extract exact probabilities
            df_scaled = preprocess_input(input_data)
            probabilities = model_loader.model.predict_proba(df_scaled)[0]
            # Anomaly probability = index 1
            risk_score = float(probabilities[1] * 100)
            
            label, color = get_risk_details(risk_score)
            reason = get_plain_reason(input_data, risk_score)
            timestamp = datetime.now().strftime("%H:%M:%S")
            
            with monitor_session.lock:
                # Update metrics
                monitor_session.packets_analyzed += int(features["packet_count"])
                
                # Risk score > 30 implies anomaly alert (suspicious/high/critical)
                if risk_score > 30:
                    monitor_session.anomaly_count += 1
                    alert_entry = {
                        "time": timestamp,
                        "label": label,
                        "color": color,
                        "risk_score": risk_score,
                        "reason": reason
                    }
                    monitor_session.alerts.append(alert_entry)
                
                # Append to history stream (keep last 20 points)
                monitor_session.history.append({
                    "time": timestamp,
                    "risk_score": risk_score
                })
                if len(monitor_session.history) > 20:
                    monitor_session.history.pop(0)
                
                # Save status payload
                monitor_session.last_status = {
                    "risk_score": risk_score,
                    "label": label,
                    "color": color,
                    "reason": reason,
                    "packets_analyzed": monitor_session.packets_analyzed,
                    "anomaly_count": monitor_session.anomaly_count,
                    "timestamp": timestamp
                }
                
        except Exception as e:
            print(f"Error encountered in monitoring cycle iteration: {e}")
            
        # Wait up to 1 second before capturing again, allowing stop signal response
        monitor_session.stop_event.wait(timeout=1.0)
        
    print("Background packet monitoring cycle stopped.")

@router.post("/monitor/start")
def start_monitoring():
    """
    Starts the live network monitoring background daemon. Resets session variables.
    """
    global monitor_session
    with monitor_session.lock:
        if monitor_session.is_monitoring:
            return {"message": "Monitoring session is already active"}
            
        monitor_session.is_monitoring = True
        monitor_session.packets_analyzed = 0
        monitor_session.anomaly_count = 0
        monitor_session.alerts = []
        monitor_session.history = []
        monitor_session.last_status = {
            "risk_score": 0.0,
            "label": "Safe",
            "color": "green",
            "reason": "Traffic looks normal",
            "packets_analyzed": 0,
            "anomaly_count": 0,
            "timestamp": datetime.now().strftime("%H:%M:%S")
        }
        monitor_session.stop_event.clear()
        
        # Start daemon background capture thread
        monitor_session.thread = threading.Thread(target=monitoring_thread_loop, daemon=True)
        monitor_session.thread.start()
        
    return {"message": "Monitoring session started successfully"}

@router.post("/monitor/stop")
def stop_monitoring():
    """
    Stops the network monitoring thread.
    """
    global monitor_session
    with monitor_session.lock:
        if not monitor_session.is_monitoring:
            return {"message": "Monitoring session is not running"}
            
        monitor_session.is_monitoring = False
        monitor_session.stop_event.set()
        
    return {"message": "Monitoring session stopped successfully"}

@router.get("/monitor/status")
def get_status():
    """
    Retrieves the current risk metrics and session counters.
    """
    global monitor_session
    with monitor_session.lock:
        return {
            "is_monitoring": monitor_session.is_monitoring,
            "risk_score": monitor_session.last_status["risk_score"],
            "label": monitor_session.last_status["label"],
            "color": monitor_session.last_status["color"],
            "reason": monitor_session.last_status["reason"],
            "packets_analyzed": monitor_session.packets_analyzed,
            "anomaly_count": monitor_session.anomaly_count,
            "timestamp": monitor_session.last_status["timestamp"],
            "history": monitor_session.history
        }

@router.get("/monitor/alerts")
def get_alerts():
    """
    Retrieves list of all isolated anomalies captured during the current session.
    """
    global monitor_session
    with monitor_session.lock:
        return monitor_session.alerts

@router.post("/monitor/simulate-anomaly")
def simulate_anomaly():
    """
    Simulates one anomalous packet burst through the detection pipeline.
    Forces anomaly parameters to test dashboard risk panels and toast triggers.
    """
    global monitor_session
    try:
        # Generate random anomaly features
        features = get_simulated_features(is_anomaly=True)
        
        protocol_str = "TCP" if features["protocol_type"] == 6 else "UDP" if features["protocol_type"] == 17 else "TCP"
        input_data = {
            "packet_size": features["packet_size"],
            "inter_arrival_time": features["inter_arrival_time"],
            "src_port": int(features["source_port"]),
            "dst_port": int(features["destination_port"]),
            "packet_count_5s": float(features["packet_count"]),
            "spectral_entropy": features["spectral_entropy"],
            "frequency_band_energy": features["freq_band_energy"],
            "protocol": protocol_str,
            "tcp_flags": features.get("tcp_flags_list", []),
            "src_ip": features.get("src_ip"),
            "dst_ip": features.get("dst_ip")
        }
        
        # Predict anomaly probability
        df_scaled = preprocess_input(input_data)
        probabilities = model_loader.model.predict_proba(df_scaled)[0]
        risk_score = float(probabilities[1] * 100)
        
        # Force risk score to be anomalous (above 30) for simulation guarantee
        if risk_score <= 30:
            risk_score = random.uniform(75.0, 95.0)
            
        label, color = get_risk_details(risk_score)
        reason = get_plain_reason(input_data, risk_score)
        timestamp = datetime.now().strftime("%H:%M:%S")
        
        with monitor_session.lock:
            monitor_session.packets_analyzed += int(features["packet_count"])
            monitor_session.anomaly_count += 1
            
            alert_entry = {
                "time": timestamp,
                "label": label,
                "color": color,
                "risk_score": risk_score,
                "reason": reason
            }
            monitor_session.alerts.append(alert_entry)
            
            monitor_session.history.append({
                "time": timestamp,
                "risk_score": risk_score
            })
            if len(monitor_session.history) > 20:
                monitor_session.history.pop(0)
                
            monitor_session.last_status = {
                "risk_score": risk_score,
                "label": label,
                "color": color,
                "reason": reason,
                "packets_analyzed": monitor_session.packets_analyzed,
                "anomaly_count": monitor_session.anomaly_count,
                "timestamp": timestamp
            }
            
        return monitor_session.last_status
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to simulate anomaly event: {str(e)}"
        )

@router.get("/monitor/report")
def download_session_report():
    """
    Compiles session alert logs and statistics into a PDF and triggers download.
    """
    global monitor_session
    with monitor_session.lock:
        alert_log_copy = list(monitor_session.alerts)
        summary_stats = {
            "packets_analyzed": monitor_session.packets_analyzed,
            "anomalies_detected": monitor_session.anomaly_count
        }
        
    try:
        # Generate the PDF file inside in-memory buffer
        pdf_buffer = generate_session_report(alert_log_copy, summary_stats)
        
        return StreamingResponse(
            pdf_buffer,
            media_type="application/pdf",
            headers={
                "Content-Disposition": "attachment; filename=netguard_session_report.pdf",
                "Cache-Control": "no-cache"
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate session report: {str(e)}"
        )

@router.get("/monitor/speed")
def get_speed():
    """
    Returns the real-time download and upload speeds (Mbps).
    """
    return get_network_speed()
