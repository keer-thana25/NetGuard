from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import StreamingResponse, JSONResponse
from app.services.batch_prediction import suggest_mapping, map_row, parse_label, calculate_metrics
from app.services.prediction_service import predict_anomaly
import json
import asyncio

router = APIRouter()

async def prediction_stream(data: list, mapping: dict, label_mapped: str):
    total = len(data)
    anomalies = 0
    y_true = []
    y_pred = []

    for i, raw_row in enumerate(data):
        # Map raw row fields
        mapped_row = map_row(raw_row, mapping)
        
        try:
            # Run existing prediction model
            res = predict_anomaly(mapped_row)
            pred_class = "Anomaly" if res["prediction"] == 1 else "Normal"
            confidence = res["confidence"]
            prediction_numeric = res["prediction"]
        except Exception as e:
            # Fallback values
            pred_class = "Normal"
            confidence = 50.0
            prediction_numeric = 0

        if prediction_numeric == 1:
            anomalies += 1

        # Track labels for evaluation
        if label_mapped and label_mapped in raw_row:
            yt = parse_label(raw_row[label_mapped])
            y_true.append(yt)
            y_pred.append(prediction_numeric)

        # Stream row result
        row_result = {
            "row_index": i + 1,
            "prediction": pred_class,
            "confidence": confidence
        }
        yield f"data: {json.dumps(row_result)}\n\n"
        
        # Micro-sleep to yield control to the event loop
        await asyncio.sleep(0.001)

    # Compute optional evaluation metrics
    evaluation = None
    if y_true and len(y_true) == len(data):
        evaluation = calculate_metrics(y_true, y_pred)

    # Complete event
    complete_event = {
        "status": "complete",
        "total": total,
        "anomalies": anomalies
    }
    if evaluation:
        complete_event["evaluation"] = evaluation

    yield f"data: {json.dumps(complete_event)}\n\n"

@router.post("/suggest-mapping")
def api_suggest_mapping(payload: dict):
    columns = payload.get("columns", [])
    if not columns:
        raise HTTPException(status_code=400, detail="Columns list is required")
    return suggest_mapping(columns)

@router.post("/predict-batch")
async def api_predict_batch(payload: dict):
    data = payload.get("data", [])
    mapping = payload.get("mapping", {})

    if not data:
        return JSONResponse(
            status_code=400,
            content={"error": "Required columns could not be mapped. Please fix your column mapping and try again."}
        )

    # Required columns validation: check if at minimum "Packet Size" and "Protocol" columns are present
    packet_size_mapped = mapping.get("packet_size")
    protocol_mapped = mapping.get("protocol")
    first_row_cols = list(data[0].keys())

    if not packet_size_mapped or packet_size_mapped not in first_row_cols or not protocol_mapped or protocol_mapped not in first_row_cols:
        return JSONResponse(
            status_code=400,
            content={"error": "Required columns could not be mapped. Please fix your column mapping and try again."}
        )

    label_mapped = mapping.get("label")
    if label_mapped and label_mapped not in first_row_cols:
        label_mapped = None

    return StreamingResponse(
        prediction_stream(data, mapping, label_mapped),
        media_type="text/event-stream"
    )
