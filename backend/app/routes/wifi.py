from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.wifi_scanner import wifi_scanner

router = APIRouter()

class SimulationPayload(BaseModel):
    mode: str

@router.get("/wifi/status")
def get_wifi_status():
    """
    Triggers network interface safety evaluation and returns reports.
    """
    try:
        report = wifi_scanner.scan_wifi()
        return report
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve Wi-Fi connection status: {str(e)}"
        )

@router.get("/wifi/scan")
def get_wifi_scan():
    """
    Returns list of scanned AP nodes currently visible in the RF environment.
    """
    try:
        report = wifi_scanner.scan_wifi()
        return report["scan_results"]
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to scan wireless interface networks: {str(e)}"
        )

@router.post("/wifi/simulate")
def set_wifi_simulation(payload: SimulationPayload):
    """
    Overrides real interface sniffer telemetry with mock profiles for class presentations.
    Modes: "none" (live), "safe", "unsecured", "rogue"
    """
    mode = payload.mode.lower()
    if mode not in ["none", "safe", "unsecured", "rogue"]:
        raise HTTPException(
            status_code=400,
            detail="Invalid simulation mode. Must be one of: 'none', 'safe', 'unsecured', 'rogue'"
        )
    
    success = wifi_scanner.set_simulation_mode(mode)
    if not success:
         raise HTTPException(status_code=500, detail="Failed to toggle simulation state.")
         
    return {
        "status": "success",
        "message": f"Simulation mode toggled to '{mode}' successfully.",
        "current_mode": mode
    }
