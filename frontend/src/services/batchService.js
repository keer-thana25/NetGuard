import apiClient from "./api";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const suggestMapping = async (columns) => {
  try {
    const response = await apiClient.post("/suggest-mapping", { columns });
    return response.data;
  } catch (error) {
    console.error("Error suggesting column mapping:", error);
    const serverMessage = error.response?.data?.detail || error.message || "Failed to suggest mapping";
    throw new Error(serverMessage);
  }
};

/**
 * Initiates the batch prediction stream.
 * @param {Array} data - Parsed dataset rows
 * @param {Object} mapping - Column mapping dictionary
 * @param {Function} onRowResult - Callback for each streamed row prediction
 * @param {Function} onComplete - Callback for complete event
 * @param {Function} onError - Callback for errors
 */
export const predictBatchStream = async (data, mapping, onRowResult, onComplete, onError) => {
  try {
    const response = await fetch(`${API_BASE_URL}/predict-batch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data, mapping }),
    });

    if (!response.ok) {
      const errorJson = await response.json().catch(() => ({}));
      const errMsg = errorJson.error || `HTTP error! status: ${response.status}`;
      throw new Error(errMsg);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      // Keep the last partial line in the buffer
      buffer = lines.pop();

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const jsonStr = line.slice(6).trim();
          if (!jsonStr) continue;
          try {
            const eventData = JSON.parse(jsonStr);
            if (eventData.status === "complete") {
              onComplete(eventData);
            } else {
              onRowResult(eventData);
            }
          } catch (e) {
            console.error("Error parsing stream line:", e, line);
          }
        }
      }
    }
  } catch (error) {
    console.error("Error in predictBatchStream:", error);
    onError(error);
  }
};
