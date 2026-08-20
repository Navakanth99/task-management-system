const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  const token = localStorage.getItem("token");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    (headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};
