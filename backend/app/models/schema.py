from pydantic import BaseModel, Field
from typing import List, Optional

class TrafficInput(BaseModel):
    packet_size: float = Field(..., description="Normalized packet size, usually 0.0 - 1.0")
    inter_arrival_time: float = Field(..., description="Time difference between packet arrivals")
    src_port: int = Field(..., description="Source port number (0 - 65535)")
    dst_port: int = Field(..., description="Destination port number (0 - 65535)")
    packet_count_5s: float = Field(..., description="Number of packets in 5 seconds window")
    spectral_entropy: float = Field(..., description="Spectral entropy of traffic")
    frequency_band_energy: float = Field(..., description="Frequency band energy of traffic")
    protocol: str = Field(..., description="Protocol: TCP or UDP")
    tcp_flags: List[str] = Field(default=[], description="List of active TCP flags (FIN, SYN, SYN_ACK)")
    src_ip: Optional[str] = Field(default=None, description="Optional Source IP: '192.168.1.2', '192.168.1.3', or None/Other")
    dst_ip: Optional[str] = Field(default=None, description="Optional Destination IP: '192.168.1.5', '192.168.1.6', or None/Other")

class PredictionResponse(BaseModel):
    prediction: int
    status: str
    confidence: float
    risk: str
