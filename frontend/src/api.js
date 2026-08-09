const DEFAULT_API_URL = "https://pulsechat-backend-production-23f3.up.railway.app";
const API_URL = import.meta.env.VITE_API_URL || (window.location.hostname === "localhost" ? "http://localhost:5000" : DEFAULT_API_URL);

export async function fetchMessages() {
  const response = await fetch(`${API_URL}/api/messages?limit=100`);
  if (!response.ok) throw new Error("Unable to load chat history.");
  return response.json();
}

export { API_URL };