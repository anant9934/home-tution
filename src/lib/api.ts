const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  // Try to get token from cookies if in browser or passing it
  let token = null;
  if (typeof window !== "undefined") {
    const match = document.cookie.match(/(^| )token=([^;]+)/);
    if (match) {
      token = match[2];
    }
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle 401 — clear token and redirect to login
  if (response.status === 401 && typeof window !== "undefined") {
    document.cookie = "token=; path=/; max-age=0";
    window.location.href = "/auth/login";
    throw new Error("Session expired. Please log in again.");
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "API request failed");
  }

  return data;
}
