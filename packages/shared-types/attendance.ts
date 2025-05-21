export enum AttendanceType {
  CHECK_IN = 1,
  CHECK_OUT = 2,
}

export enum Weekday {
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
  SUNDAY = 7,
}

export interface AttendanceRegisterData {
  userId: number,
  typeId: AttendanceType,
  dateTime: Date,
  photo: string | null,
}

export interface AttendanceData extends AttendanceRegisterData {
  id: number
}

export interface AttendanceEmployeeTargetData extends AttendanceData {
  name: string,
  targetTime: Date
}

export interface TargetAttendanceFormData {
  weekday: Weekday,
  startTime: Date,
  endTime: Date,
}

export interface TargetAttendanceRegisterData extends TargetAttendanceFormData {
  userId: number,
}

export interface TargetAttendanceData extends TargetAttendanceRegisterData {
  id: number
}

export interface TargetAttendanceHistoryData extends TargetAttendanceData {
  createdAt: Date,
}

export interface AttendanceDataToday {
  target: TargetAttendanceRegisterData | null,
  attendance: {
    checkIn: AttendanceData | null,
    checkOut: AttendanceData | null,
  }
}