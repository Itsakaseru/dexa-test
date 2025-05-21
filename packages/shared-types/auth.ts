import type { EmployeeData } from "./employee";

export interface LoginData {
  email: string,
  password: string,
}

export interface UserData {
  id?: number,
  email: string,
  hash: string,
  createdAt: Date,
  updatedAt: Date,
}

export interface SelfUserInfo extends EmployeeData {
  name: string,
  email: string,
}

export interface AuthResponse {
  message: string,
  hasAdminAccess: boolean,
}