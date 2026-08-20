import { apiRequest } from "./api";

export interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthResponse {
  success: boolean;
  message?: string;
  data: {
    token: string;
    user: User;
  };
}

interface MeResponse {
  success: boolean;
  data: User;
}

export const register = async (
  name: string,
  email: string,
  password: string,
): Promise<AuthResponse> => {
  return apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });
};

export const login = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await apiRequest<MeResponse>("/auth/me");

  return response.data;
};

export const logout = (): void => {
  localStorage.removeItem("token");
};
