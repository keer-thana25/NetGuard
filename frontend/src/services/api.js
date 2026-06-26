import axios from "axios";

// Use deployed backend in production, localhost during local development
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Sends network traffic features to backend model for classification.
 *
 * Payload structure:
 * {
 *   packet_size: float,
 *   inter_arrival_time: float,
 *   src_port: int,
 *   dst_port: int,
 *   packet_count_5s: float,
 *   spectral_entropy: float,
 *   frequency_band_energy: float,
 *   protocol: string ('TCP' | 'UDP'),
 *   tcp_flags: string[],
 *   src_ip: string | null,
 *   dst_ip: string | null
 * }
 */
export const predictTraffic = async (payload) => {
  try {
    const response = await apiClient.post("/predict", payload);
    return response.data;
  } catch (error) {
    console.error(
      "API Error during network anomaly prediction:",
      error
    );
    // Extract server message or fallback
    const serverMessage =
      error.response?.data?.detail ||
      error.message ||
      "Prediction failed";
    throw new Error(serverMessage, { cause: error });
  }
};

/**
 * Performs backend healthcheck
 */
export const checkBackendHealth = async () => {
  try {
    const response = await apiClient.get("/");
    return response.data;
  } catch (error) {
    console.error("Backend healthcheck failed:", error);

    return {
      status: "offline",
      error: error.message,
    };
  }
};

/**
 * Starts the live packet monitoring session in the backend.
 */
export const startLiveMonitoring = async () => {
  try {
    const response = await apiClient.post("/monitor/start");
    return response.data;
  } catch (error) {
    console.error("Failed to start live monitoring:", error);
    throw error;
  }
};

/**
 * Stops the live packet monitoring session in the backend.
 */
export const stopLiveMonitoring = async () => {
  try {
    const response = await apiClient.post("/monitor/stop");
    return response.data;
  } catch (error) {
    console.error("Failed to stop live monitoring:", error);
    throw error;
  }
};

/**
 * Retrieves the current live monitoring status and statistics.
 */
export const getLiveMonitorStatus = async () => {
  try {
    const response = await apiClient.get("/monitor/status");
    return response.data;
  } catch (error) {
    console.error("Failed to get live monitor status:", error);
    throw error;
  }
};

/**
 * Retrieves the list of anomaly alerts recorded in the current session.
 */
export const getLiveMonitorAlerts = async () => {
  try {
    const response = await apiClient.get("/monitor/alerts");
    return response.data;
  } catch (error) {
    console.error("Failed to get live monitor alerts:", error);
    throw error;
  }
};

/**
 * Simulates one network anomaly event in the backend detection pipeline.
 */
export const simulateLiveAnomaly = async () => {
  try {
    const response = await apiClient.post("/monitor/simulate-anomaly");
    return response.data;
  } catch (error) {
    console.error("Failed to simulate anomaly:", error);
    throw error;
  }
};

/**
 * Fetches the session report PDF from the backend as a Blob.
 */
export const downloadLiveSessionReport = async () => {
  try {
    const response = await apiClient.get("/monitor/report", {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    console.error("Failed to download session report:", error);
    throw error;
  }
};

/**
 * Retrieves the current live upload and download bandwidth speeds.
 */
export const getLiveNetworkSpeed = async () => {
  try {
    const response = await apiClient.get("/monitor/speed");
    return response.data;
  } catch (error) {
    console.error("Failed to get network speed metrics:", error);
    throw error;
  }
};

/**
 * Retrieves the current connected Wi-Fi interface and safety analysis.
 */
export const getWifiStatus = async () => {
  try {
    const response = await apiClient.get("/wifi/status");
    return response.data;
  } catch (error) {
    console.error("Failed to get wifi status:", error);
    throw error;
  }
};

/**
 * Retrieves the list of visible scanned Wi-Fi access points in range.
 */
export const getWifiScan = async () => {
  try {
    const response = await apiClient.get("/wifi/scan");
    return response.data;
  } catch (error) {
    console.error("Failed to get wifi scan:", error);
    throw error;
  }
};

/**
 * Toggles the backend simulation preset mode.
 */
export const setWifiSimulation = async (mode) => {
  try {
    const response = await apiClient.post("/wifi/simulate", { mode });
    return response.data;
  } catch (error) {
    console.error("Failed to set wifi simulation:", error);
    throw error;
  }
};

export default apiClient;
