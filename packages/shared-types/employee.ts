import { LoginData } from "./auth";

export interface EmployeeRegisterData extends LoginData {
  name: string,
  gender: "M" | "F",
  dob: Date,
  departmentId: number,
  positionId: number,
}

export interface EmployeeData extends EmployeeRegisterData {
  id: number,
  userId: number,
  createdAt: Date,
  updatedAt: Date,
}