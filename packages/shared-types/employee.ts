import { type LoginData } from "./auth";

export interface EmployeeRegisterData {
  userId: number,
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

export const DepartmentMap: { [key: number]: string } = {
  1: "IT",
  2: "HRD",
  3: "Finance",
  4: "Marketing",
  5: "Sales",
};

export const PositionMap: { [key: number]: string } = {
  1: "Head",
  2: "Manager",
  3: "Employee",
}