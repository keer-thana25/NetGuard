def engineer_features(data: dict) -> dict:
    """
    Engineers the exact features required by the scikit-learn model:
    - traffic_rate = packet_count_5s / (inter_arrival_time + 0.0001)
    - port_difference = abs(src_port - dst_port)
    - entropy_energy_ratio = spectral_entropy / (frequency_band_energy + 0.0001)
    """
    packet_count_5s = data.get("packet_count_5s", 0.0)
    inter_arrival_time = data.get("inter_arrival_time", 0.0)
    src_port = data.get("src_port", 0)
    dst_port = data.get("dst_port", 0)
    spectral_entropy = data.get("spectral_entropy", 0.0)
    frequency_band_energy = data.get("frequency_band_energy", 0.0)

    # Apply mathematical transformations identical to training notebook
    traffic_rate = packet_count_5s / (inter_arrival_time + 0.0001)
    port_difference = abs(src_port - dst_port)
    entropy_energy_ratio = spectral_entropy / (frequency_band_energy + 0.0001)

    engineered = data.copy()
    engineered["traffic_rate"] = traffic_rate
    engineered["port_difference"] = port_difference
    engineered["entropy_energy_ratio"] = entropy_energy_ratio

    return engineered
