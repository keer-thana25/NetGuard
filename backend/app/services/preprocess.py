import pandas as pd
from app.models.model_loader import model_loader
from app.services.feature_engineering import engineer_features

def preprocess_input(input_data: dict) -> pd.DataFrame:
    """
    Transforms raw user request inputs into the exact 19 feature columns
    required by the RobustScaler and Random Forest Model in the correct order.
    """
    # 1. Feature Engineering
    engineered = engineer_features(input_data)

    # 2. Extract protocol columns (one-hot encoding)
    protocol = str(engineered.get("protocol", "")).upper()
    protocol_type_TCP = 1 if protocol == "TCP" else 0
    protocol_type_UDP = 1 if protocol == "UDP" else 0

    # 3. Extract TCP flags columns (multi-select)
    flags = [f.upper() for f in engineered.get("tcp_flags", [])]
    tcp_flags_FIN = 1 if "FIN" in flags else 0
    tcp_flags_SYN = 1 if "SYN" in flags else 0
    # Support both SYN_ACK (from schema) and SYN-ACK (from UI/csv naming)
    tcp_flags_SYN_ACK = 1 if ("SYN_ACK" in flags or "SYN-ACK" in flags or "SYN-ACK" in engineered.get("tcp_flags", [])) else 0

    # 4. Extract IP columns (advanced settings)
    src_ip = engineered.get("src_ip")
    dst_ip = engineered.get("dst_ip")
    src_ip_192_168_1_2 = 1 if src_ip == "192.168.1.2" else 0
    src_ip_192_168_1_3 = 1 if src_ip == "192.168.1.3" else 0
    dst_ip_192_168_1_5 = 1 if dst_ip == "192.168.1.5" else 0
    dst_ip_192_168_1_6 = 1 if dst_ip == "192.168.1.6" else 0

    # 5. Create dict aligned with scaler features
    features_dict = {
        "packet_size": engineered.get("packet_size", 0.0),
        "inter_arrival_time": engineered.get("inter_arrival_time", 0.0),
        "src_port": engineered.get("src_port", 0),
        "dst_port": engineered.get("dst_port", 0),
        "packet_count_5s": engineered.get("packet_count_5s", 0.0),
        "spectral_entropy": engineered.get("spectral_entropy", 0.0),
        "frequency_band_energy": engineered.get("frequency_band_energy", 0.0),
        "protocol_type_TCP": protocol_type_TCP,
        "protocol_type_UDP": protocol_type_UDP,
        "src_ip_192.168.1.2": src_ip_192_168_1_2,
        "src_ip_192.168.1.3": src_ip_192_168_1_3,
        "dst_ip_192.168.1.5": dst_ip_192_168_1_5,
        "dst_ip_192.168.1.6": dst_ip_192_168_1_6,
        "tcp_flags_FIN": tcp_flags_FIN,
        "tcp_flags_SYN": tcp_flags_SYN,
        "tcp_flags_SYN-ACK": tcp_flags_SYN_ACK,
        "traffic_rate": engineered.get("traffic_rate", 0.0),
        "port_difference": engineered.get("port_difference", 0),
        "entropy_energy_ratio": engineered.get("entropy_energy_ratio", 0.0),
    }

    # 6. Aligned order of 19 features exactly matching the scaler fit
    features_order = [
        "packet_size",
        "inter_arrival_time",
        "src_port",
        "dst_port",
        "packet_count_5s",
        "spectral_entropy",
        "frequency_band_energy",
        "protocol_type_TCP",
        "protocol_type_UDP",
        "src_ip_192.168.1.2",
        "src_ip_192.168.1.3",
        "dst_ip_192.168.1.5",
        "dst_ip_192.168.1.6",
        "tcp_flags_FIN",
        "tcp_flags_SYN",
        "tcp_flags_SYN-ACK",
        "traffic_rate",
        "port_difference",
        "entropy_energy_ratio",
    ]

    # Convert to DataFrame
    df = pd.DataFrame([features_dict], columns=features_order)

    # Use loaded scaler to transform numerical/one-hot values
    scaled_values = model_loader.scaler.transform(df)
    df_scaled = pd.DataFrame(scaled_values, columns=features_order)

    return df_scaled
