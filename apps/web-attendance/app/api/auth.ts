import type { AuthResponse, LoginData } from "@repo/shared-types";
import axios from "axios";
import { API_URL } from "./config";
import { redirect } from "react-router";
import { StatusCodes } from "http-status-codes";

export async function login(data : LoginData) {
  return axios.post<AuthResponse>(`${API_URL}/auth/login`, data, {
    withCredentials: true,
  });
}

export async function refreshAuth() {
  return axios.post(`${API_URL}/auth/refresh`, {}, {
    withCredentials: true,
  });
}

export async function handleAuthError(err: unknown) {
  if (axios.isAxiosError(err)) {
    switch (err.response?.status) {
      case StatusCodes.UNAUTHORIZED:
        try {
          await refreshAuth();
        }
        catch (err) {
          return redirect("/login");
        }
        return redirect(".");
  
      default:
        return redirect("/login");
    }
  }
  else {
    return redirect("/login");
  }
}