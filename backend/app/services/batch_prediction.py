import pandas as pd
import numpy as np
from rapidfuzz import process, fuzz
from app.services.prediction_service import predict_anomaly

MODEL_COLUMNS_SYNONYMS = {
    "packet_size": ["packet size", "pkt_size", "size", "packet_sz", "pktsize", "length", "packet length"],
    "inter_arrival_time": ["inter arrival time", "inter_arrival_time", "iat", "time_diff", "arrival_time", "delta time", "interarrival"],
    "src_port": ["source port", "src_port", "sport", "source_port", "srcport"],
    "dst_port": ["destination port", "dst_port", "dport", "destination_port", "dstport"],
    "packet_count_5s": ["packet count", "packet_count_5s", "pkt_count", "count_5s", "packetcount", "count", "num_packets"],
    "spectral_entropy": ["spectral entropy", "spectral_entropy", "entropy", "spec_entropy", "spectral_ent"],
    "frequency_band_energy": ["frequency band energy", "frequency_band_energy", "energy", "band_energy", "freq_energy", "band energy"],
    "protocol": ["protocol", "protocol_type", "proto", "protocolname"],
    "tcp_flags": ["tcp flags", "tcp_flags", "flags", "tcpflags"],
    "src_ip": ["source ip", "src_ip", "source_address", "saddr", "srcip", "source"],
    "dst_ip": ["destination ip", "dst_ip", "destination_address", "daddr", "dstip", "destination"],
    "label": ["label", "class", "attack_type", "is_anomaly", "anomaly", "target", "attack", "label_code"]
}

def suggest_mapping(uploaded_columns: list) -> dict:
    """
    Given a list of column names from the uploaded file, return a suggested
    mapping matching the keys of the model to the columns of the file.
    """
    mapping = {}
    for model_key, synonyms in MODEL_COLUMNS_SYNONYMS.items():
        best_match = None
        best_score = 0
        for synonym in synonyms:
            # Find the best matching uploaded column for this synonym
            match = process.extractOne(synonym, uploaded_columns, scorer=fuzz.WRatio)
            if match:
                col, score, _ = match
                if score > best_score and score >= 60:
                    best_score = score
                    best_match = col
        if best_match:
            mapping[model_key] = best_match
    return mapping

def map_row(row: dict, mapping: dict) -> dict:
    """
    Map a raw row from the uploaded file to the keys expected by the model service.
    Handles missing values and performs default type conversions.
    Intelligently reconstructs categorical fields (protocol, tcp_flags, IPs) if the
    source file only contains one-hot encoded columns.
    """
    mapped = {}
    
    # helper to clean float
    def to_float(val, default=0.0):
        if val is None or val == "" or (isinstance(val, float) and np.isnan(val)):
            return default
        try:
            return float(val)
        except Exception:
            return default

    # helper to clean int
    def to_int(val, default=0):
        if val is None or val == "" or (isinstance(val, float) and np.isnan(val)):
            return default
        try:
            return int(float(val)) # handles float strings e.g. "80.0"
        except Exception:
            return default

    mapped["packet_size"] = to_float(row.get(mapping.get("packet_size", "")))
    mapped["inter_arrival_time"] = to_float(row.get(mapping.get("inter_arrival_time", "")))
    mapped["src_port"] = to_int(row.get(mapping.get("src_port", "")))
    mapped["dst_port"] = to_int(row.get(mapping.get("dst_port", "")))
    mapped["packet_count_5s"] = to_float(row.get(mapping.get("packet_count_5s", "")))
    mapped["spectral_entropy"] = to_float(row.get(mapping.get("spectral_entropy", "")))
    mapped["frequency_band_energy"] = to_float(row.get(mapping.get("frequency_band_energy", "")))

    # Reconstruct protocol from one-hot columns in row if present
    reconstructed_proto = None
    for key, val in row.items():
        key_lower = key.lower()
        if "protocol_type_tcp" in key_lower and val in [True, 1, "True", "1", "true"]:
            reconstructed_proto = "TCP"
            break
        elif "protocol_type_udp" in key_lower and val in [True, 1, "True", "1", "true"]:
            reconstructed_proto = "UDP"
            break

    # protocol: TCP or UDP
    proto_val = row.get(mapping.get("protocol", ""))
    if proto_val is not None and proto_val != "":
        proto_str = str(proto_val).upper().strip()
        if "TCP" in proto_str:
            mapped["protocol"] = "TCP"
        elif "UDP" in proto_str:
            mapped["protocol"] = "UDP"
        elif reconstructed_proto:
            mapped["protocol"] = reconstructed_proto
        else:
            if proto_val in [True, 1, "True", "1", "true"]:
                mapped["protocol"] = "TCP"
            else:
                mapped["protocol"] = "TCP"
    elif reconstructed_proto:
        mapped["protocol"] = reconstructed_proto
    else:
        mapped["protocol"] = "TCP"

    # Reconstruct tcp_flags from one-hot columns in row if present
    reconstructed_flags = []
    for key, val in row.items():
        key_lower = key.lower()
        if "tcp_flags_" in key_lower or "tcpflags_" in key_lower:
            if val in [True, 1, "True", "1", "true"]:
                flag_name = key_lower.replace("tcp_flags_", "").replace("tcpflags_", "").upper().strip()
                # standardize to synthetic flags format
                flag_name = flag_name.replace("-", "_")
                reconstructed_flags.append(flag_name)

    # tcp_flags: list of strings (e.g., ["FIN", "SYN", "SYN_ACK"])
    flags_val = row.get(mapping.get("tcp_flags", ""))
    if isinstance(flags_val, list):
        mapped["tcp_flags"] = [str(f).upper().strip() for f in flags_val if f]
    elif isinstance(flags_val, str) and flags_val != "":
        if flags_val in ["True", "1", "true"]:
            # Single mapped checkbox column name extraction fallback
            col_mapped = mapping.get("tcp_flags", "").lower()
            if "syn" in col_mapped:
                mapped["tcp_flags"] = ["SYN"]
            elif "fin" in col_mapped:
                mapped["tcp_flags"] = ["FIN"]
            elif "ack" in col_mapped:
                mapped["tcp_flags"] = ["SYN_ACK"]
            else:
                mapped["tcp_flags"] = reconstructed_flags
        else:
            parts = flags_val.replace("-", "_").replace(";", ",").replace(" ", ",").split(",")
            mapped["tcp_flags"] = [p.upper().strip() for p in parts if p.strip()]
    elif reconstructed_flags:
        mapped["tcp_flags"] = reconstructed_flags
    else:
        mapped["tcp_flags"] = []

    # Reconstruct src_ip and dst_ip from one-hot columns in row if present
    reconstructed_src_ip = None
    for key, val in row.items():
        key_lower = key.lower()
        if "src_ip_" in key_lower or "srcip_" in key_lower:
            if val in [True, 1, "True", "1", "true"]:
                # Convert src_ip_192_168_1_2 to 192.168.1.2
                reconstructed_src_ip = key_lower.replace("src_ip_", "").replace("srcip_", "").replace("_", ".")

    reconstructed_dst_ip = None
    for key, val in row.items():
        key_lower = key.lower()
        if "dst_ip_" in key_lower or "dstip_" in key_lower:
            if val in [True, 1, "True", "1", "true"]:
                # Convert dst_ip_192_168_1_5 to 192.168.1.5
                reconstructed_dst_ip = key_lower.replace("dst_ip_", "").replace("dstip_", "").replace("_", ".")

    # Optional columns
    src_ip_val = row.get(mapping.get("src_ip", ""))
    if src_ip_val is not None and src_ip_val != "" and not (isinstance(src_ip_val, float) and np.isnan(src_ip_val)):
        mapped["src_ip"] = str(src_ip_val).strip()
    elif reconstructed_src_ip:
        mapped["src_ip"] = reconstructed_src_ip
    else:
        mapped["src_ip"] = None

    dst_ip_val = row.get(mapping.get("dst_ip", ""))
    if dst_ip_val is not None and dst_ip_val != "" and not (isinstance(dst_ip_val, float) and np.isnan(dst_ip_val)):
        mapped["dst_ip"] = str(dst_ip_val).strip()
    elif reconstructed_dst_ip:
        mapped["dst_ip"] = reconstructed_dst_ip
    else:
        mapped["dst_ip"] = None

    return mapped

def parse_label(val) -> int:
    """
    Parse a label column value into 0 (Normal) or 1 (Anomaly).
    """
    if val is None or val == "" or (isinstance(val, float) and np.isnan(val)):
        return 0
    val_str = str(val).lower().strip()
    if val_str in ["0", "false", "normal", "benign", "ok", "safe"]:
        return 0
    return 1

def calculate_metrics(y_true: list, y_pred: list) -> dict:
    """
    Calculate evaluation metrics (Accuracy, Precision, Recall, F1)
    and Confusion Matrix.
    """
    tp = fp = tn = fn = 0
    for yt, yp in zip(y_true, y_pred):
        if yt == 1 and yp == 1:
            tp += 1
        elif yt == 0 and yp == 1:
            fp += 1
        elif yt == 0 and yp == 0:
            tn += 1
        elif yt == 1 and yp == 0:
            fn += 1
            
    total = len(y_true)
    accuracy = (tp + tn) / total if total > 0 else 0.0
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0.0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0.0
    f1 = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0.0
    
    return {
        "accuracy": round(accuracy, 4),
        "precision": round(precision, 4),
        "recall": round(recall, 4),
        "f1": round(f1, 4),
        "tp": tp,
        "fp": fp,
        "tn": tn,
        "fn": fn
    }
