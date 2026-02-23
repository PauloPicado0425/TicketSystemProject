import { apiFetch, setToken, clearToken } from "./api";

export async function login(username, password) {
  const data = await apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

  
  if (data?.token) {
    setToken(data.token);
  } else {
    throw new Error("No se recibió token");
  }

  return data;
}

export function logout() {
  clearToken();
}