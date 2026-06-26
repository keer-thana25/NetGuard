import time
import random
import numpy as np
from collections import Counter
from scapy.all import sniff, IP, TCP, UDP

def calculate_spectral_entropy_and_energy(packet_sizes):
    """
    Computes spectral entropy and frequency band energy using real Fast Fourier Transform (rfft).
    - spectral_entropy: Shannon entropy of the FFT power spectrum.
    - freq_band_energy: Average of squared FFT magnitudes.
    """
    if not packet_sizes or len(packet_sizes) < 2:
        return 0.0, 0.0
        
    try:
        # Compute real FFT
        fft_vals = np.fft.rfft(packet_sizes)
        magnitudes = np.abs(fft_vals)
        count = len(magnitudes)
        
        # Frequency band energy: sum of squared FFT magnitudes / count
        freq_band_energy = float(np.sum(magnitudes ** 2) / count) if count > 0 else 0.0
        
        # Spectral entropy: power spectrum entropy
        power_spectrum = magnitudes ** 2
        sum_power = np.sum(power_spectrum)
        
        if sum_power == 0:
            spectral_entropy = 0.0
        else:
            norm_power = power_spectrum / sum_power
            # Avoid division by zero/log(0) by filtering out zero values
            norm_power = norm_power[norm_power > 0]
            spectral_entropy = float(-np.sum(norm_power * np.log2(norm_power)))
            
        return spectral_entropy, freq_band_energy
    except Exception as e:
        print(f"Error calculating FFT features: {e}")
        return 0.0, 0.0

def get_simulated_features(is_anomaly: bool = False) -> dict:
    """
    Generates realistic, high-fidelity simulated packet features in normal or anomalous ranges.
    Used as fallback when live capture fails/captures nothing, and for simulating attacks.
    """
    if not is_anomaly:
        # Simulate standard, healthy traffic (e.g. browsing, API calls)
        packet_size = random.uniform(200.0, 800.0)
        inter_arrival_time = random.uniform(0.015, 0.12)
        source_port = random.choice([80, 443, 53, 3000, 5000, 8080, 54321])
        destination_port = random.choice([80, 443, 53, 8080])
        packet_count = random.randint(100, 450)
        spectral_entropy = random.uniform(3.0, 5.8)
        freq_band_energy = random.uniform(1000.0, 18000.0)
        protocol_type = random.choice([6, 17]) # 6 = TCP, 17 = UDP
        tcp_flags = random.uniform(10.0, 24.0) # Normal flags (like ACK, PSH-ACK)
        tcp_flags_list = ["SYN"] if random.random() < 0.1 else []
        src_ip = random.choice(["192.168.1.2", "192.168.1.3"])
        dst_ip = random.choice(["192.168.1.5", "192.168.1.6"])
    else:
        # Simulate different types of anomalies (DDoS, Exfiltration, suspicious port, high entropy)
        anomaly_type = random.choice(["exfil", "ddos", "scan", "port"])
        if anomaly_type == "exfil":
            packet_size = random.uniform(1420.0, 1500.0) # > 1400 bytes (data exfiltration)
            inter_arrival_time = random.uniform(0.02, 0.08)
            source_port = random.randint(49152, 65535)
            destination_port = random.choice([443, 80])
            packet_count = random.randint(200, 500)
            spectral_entropy = random.uniform(4.5, 6.5)
            freq_band_energy = random.uniform(25000.0, 85000.0)
            protocol_type = 6
            tcp_flags = 24.0 # PSH-ACK
            tcp_flags_list = ["FIN"]
            src_ip = "192.168.1.2"
            dst_ip = "192.168.1.5"
        elif anomaly_type == "ddos":
            packet_size = random.uniform(64.0, 120.0)
            inter_arrival_time = random.uniform(0.001, 0.007) # < 0.01 seconds (high flood rate)
            source_port = random.randint(1024, 65535)
            destination_port = 80
            packet_count = random.randint(950, 1600) # > 900 packets
            spectral_entropy = random.uniform(3.0, 4.8)
            freq_band_energy = random.uniform(8000.0, 25000.0)
            protocol_type = 6
            tcp_flags = 2.0 # SYN flood
            tcp_flags_list = ["SYN"]
            src_ip = "192.168.1.3"
            dst_ip = "192.168.1.6"
        elif anomaly_type == "scan":
            packet_size = random.uniform(64.0, 150.0)
            inter_arrival_time = random.uniform(0.002, 0.009)
            source_port = random.randint(1024, 65535)
            destination_port = random.choice([4444, 1337, 6667, 9999, 31337]) # suspicious port
            packet_count = random.randint(910, 1300)
            spectral_entropy = random.uniform(2.5, 4.5)
            freq_band_energy = random.uniform(2000.0, 6000.0)
            protocol_type = 6
            tcp_flags = 2.0
            tcp_flags_list = ["SYN"]
            src_ip = "192.168.1.2"
            dst_ip = "192.168.1.5"
        else: # Encrypted tunnel / high entropy
            packet_size = random.uniform(800.0, 1200.0)
            inter_arrival_time = random.uniform(0.01, 0.04)
            source_port = random.randint(1024, 65535)
            destination_port = 443
            packet_count = random.randint(350, 700)
            spectral_entropy = random.uniform(7.6, 8.8) # > 7.5 (possible encrypted tunnel)
            freq_band_energy = random.uniform(30000.0, 95000.0)
            protocol_type = 6
            tcp_flags = 24.0
            tcp_flags_list = ["SYN-ACK"]
            src_ip = "192.168.1.2"
            dst_ip = "192.168.1.5"

    return {
        "packet_size": packet_size,
        "inter_arrival_time": inter_arrival_time,
        "source_port": source_port,
        "destination_port": destination_port,
        "packet_count": packet_count,
        "spectral_entropy": spectral_entropy,
        "freq_band_energy": freq_band_energy,
        "protocol_type": protocol_type,
        "tcp_flags": tcp_flags,
        "tcp_flags_list": tcp_flags_list,
        "src_ip": src_ip,
        "dst_ip": dst_ip
    }

def capture_and_extract_features() -> dict:
    """
    Uses Scapy to sniff active network interfaces for 2 seconds.
    Extracts the mean packet size, inter-arrival time, dominant ports,
    protocol type, TCP flags, and Fourier transform frequency stats.
    Falls back to normal simulated features if sniffing fails or gets 0 packets.
    """
    try:
        # Sniff network traffic for 2 seconds
        # Use iface=None for default interface and Windows compatibility
        packets = sniff(timeout=2, iface=None)
    except Exception as e:
        print(f"Scapy sniff error/privilege restriction: {e}")
        packets = []

    # If no packets are captured, fallback gracefully to normal simulated traffic
    if not packets or len(packets) == 0:
        return get_simulated_features(is_anomaly=False)

    packet_lengths = []
    arrival_times = []
    src_ports = []
    dst_ports = []
    ip_protocols = []
    tcp_flag_values = []
    src_ips = []
    dst_ips = []

    for pkt in packets:
        # Length of packet in bytes
        packet_lengths.append(len(pkt))
        # Relative epoch timestamp
        arrival_times.append(pkt.time)
        
        # IP Layer characteristics
        if IP in pkt:
            ip_protocols.append(pkt[IP].proto)
            src_ips.append(pkt[IP].src)
            dst_ips.append(pkt[IP].dst)
            
        # Port and TCP Flags parsing
        if TCP in pkt:
            src_ports.append(pkt[TCP].sport)
            dst_ports.append(pkt[TCP].dport)
            tcp_flag_values.append(int(pkt[TCP].flags))
        elif UDP in pkt:
            src_ports.append(pkt[UDP].sport)
            dst_ports.append(pkt[UDP].dport)

    packet_count = len(packets)
    mean_packet_size = float(np.mean(packet_lengths)) if packet_lengths else 0.0

    # Calculate average inter-arrival time (time difference between consecutive packets)
    if len(arrival_times) > 1:
        sorted_times = sorted(arrival_times)
        gaps = np.diff(sorted_times)
        mean_iat = float(np.mean(gaps))
    else:
        mean_iat = 0.0

    # Extract dominant port values
    source_port = Counter(src_ports).most_common(1)[0][0] if src_ports else 443
    destination_port = Counter(dst_ports).most_common(1)[0][0] if dst_ports else 443
    
    # Extract dominant protocol type (6 = TCP, 17 = UDP)
    protocol_type = Counter(ip_protocols).most_common(1)[0][0] if ip_protocols else 6
    
    # Calculate mean of TCP flag integer values (default to 0.0 if not TCP)
    tcp_flags_mean = float(np.mean(tcp_flag_values)) if tcp_flag_values else 0.0
    
    # Identify unique TCP flags seen in the packet burst as strings
    tcp_flags_strings = set()
    for pkt in packets:
        if TCP in pkt:
            flags = pkt[TCP].flags
            # Map Scapy flags properties to standard strings
            if flags & 0x01: # FIN
                tcp_flags_strings.add("FIN")
            if flags & 0x02: # SYN
                tcp_flags_strings.add("SYN")
            if (flags & 0x02) and (flags & 0x10): # SYN-ACK
                tcp_flags_strings.add("SYN-ACK")

    # Compute Fourier Transform Features
    spectral_entropy, freq_band_energy = calculate_spectral_entropy_and_energy(packet_lengths)
    
    # Identify dominant IPs
    src_ip = Counter(src_ips).most_common(1)[0][0] if src_ips else "192.168.1.2"
    dst_ip = Counter(dst_ips).most_common(1)[0][0] if dst_ips else "192.168.1.5"

    return {
        "packet_size": mean_packet_size,
        "inter_arrival_time": mean_iat,
        "source_port": source_port,
        "destination_port": destination_port,
        "packet_count": packet_count,
        "spectral_entropy": spectral_entropy,
        "freq_band_energy": freq_band_energy,
        "protocol_type": protocol_type,
        "tcp_flags": tcp_flags_mean,
        # Helper properties for the preprocessor mapping
        "tcp_flags_list": list(tcp_flags_strings),
        "src_ip": src_ip,
        "dst_ip": dst_ip
    }
