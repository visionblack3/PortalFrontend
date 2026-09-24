import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://44.206.159.34:8080/api";

const client = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach the stored JWT to every outgoing request.
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("cp_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize every backend error shape into a single readable string.
// - GlobalExceptionHandler returns { timestamp, status, error, message }
// - ErrorResponse (unused by controllers today) has { status, message, timestamp }
// - Controllers sometimes return { error: "..." } or { message: "..." } or a raw string
function extractMessage(error) {
  const data = error?.response?.data;
  if (!data) return error?.message || "Something went wrong. Please try again.";
  if (typeof data === "string") return data;
  return data.message || data.error || "Something went wrong. Please try again.";
}

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = extractMessage(error);
    const status = error?.response?.status;
    // Session expired or token invalid/missing where auth was required.
    if (status === 401 || status === 403) {
      if (status === 401) {
        localStorage.removeItem("cp_token");
        localStorage.removeItem("cp_user");
      }
    }
    return Promise.reject({ status, message, raw: error });
  }
);

export default client;
