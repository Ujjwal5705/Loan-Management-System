import { jwtDecode } from "jwt-decode";

export const getToken = () => {
  if (typeof window === "undefined") return null;

  return localStorage.getItem("token");
};

export const getUser = () => {
  const token = getToken();

  if (!token) return null;

  return jwtDecode(token);
};

export const logout = () => {
  localStorage.removeItem("token");
};
