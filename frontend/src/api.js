const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function fetchMessages() {
  const response = await fetch(`${API_URL}/api/messages?limit=100`);
  if (!response.ok) throw new Error("Unable to load chat history.");
  return response.json();
}

export { API_URL };