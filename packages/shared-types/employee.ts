import type { TargetAttendanceData } from "./attendance";

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

export interface UserEmployeeAttendanceData extends EmployeeData {
  email: string,
  targetAttendance: TargetAttendanceData[],
}

type Department = "IT" | "HRD" | "Finance" | "Marketing" | "Sales"
type Position = "Head" | "Manager" | "Employee"

export const DepartmentMap: { [key: number]: Department } = {
  1: "IT",
  2: "HRD",
  3: "Finance",
  4: "Marketing",
  5: "Sales",
};

export const PositionMap: { [key: number]: Position } = {
  1: "Head",
  2: "Manager",
  3: "Employee",
}