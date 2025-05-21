import type { AttendanceEmployeeTargetData } from "@repo/shared-types";
import axios from "axios";
import { API_URL } from "./config";

export async function getAttendanceListByUserId(userId: string) {
  return await axios.get<AttendanceEmployeeTargetData[]>(`${ API_URL }/attendance/list/${userId}`, {
    withCredentials: true,
  });
}