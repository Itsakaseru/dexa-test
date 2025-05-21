import { AttendanceData, EmployeeData, TargetAttendanceData, TargetAttendanceHistoryData } from "@repo/shared-types";
import dayjs from "dayjs";

export async function processAttendanceEmployeeTargetList(
  attendanceData: AttendanceData[],
  targetAttendanceData: TargetAttendanceData[],
  targetAttendanceHistoryData: TargetAttendanceHistoryData[],
  employeeData: EmployeeData[]
) {
  const attendanceEmployeeList = attendanceData.map((attendance) => {
    const employee = employeeData.find((emp) => emp.userId === attendance.userId);
    return {
      ...attendance,
      name: employee ? employee.name : "<Unknown>",
    };
  });

  const processAttendanceEmployeeTargetList = attendanceEmployeeList.map((attendance) => {
    // Check if attendance date is before the target attendance history data
    // if yes, use the target attendance history data
    const targetAttendanceHistory = targetAttendanceHistoryData.find((target) =>
      (target.userId === attendance.userId) && (target.weekday === new Date(attendance.dateTime).getDay())
    );

    if (targetAttendanceHistory && dayjs(attendance.dateTime).isBefore(dayjs(targetAttendanceHistory.createdAt))){
      const targetTime =
        attendance.typeId === 1 ?
          targetAttendanceHistory?.startTime :
          targetAttendanceHistory?.endTime;
      return {
        ...attendance,
        targetTime: targetTime || null,
      };
    }

    const targetAttendance = targetAttendanceData
      .find((target) => (target.userId === attendance.userId) && (target.weekday === new Date(attendance.dateTime).getDay()));
    // Get target time, typeId = 1 is for startTime, typeId = 2 is for endTime
    const targetTime = 
      attendance.typeId === 1 ?
        targetAttendance?.startTime :
        targetAttendance?.endTime;

    return {
      ...attendance,
      targetTime: targetTime || null,
    }
  });

  return processAttendanceEmployeeTargetList;
} 