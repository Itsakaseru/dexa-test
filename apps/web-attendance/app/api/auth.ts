import type { AuthResponse, LoginData } from "@repo/shared-types";
import axios from "axios";
import { API_URL } from "./config";

export async function login(data : LoginData) {
  return axios.post<AuthResponse>(`${API_URL}/auth/login`, data, {
    withCredentials: true,
  });
}