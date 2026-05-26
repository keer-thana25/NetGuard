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

export default apiClient;
