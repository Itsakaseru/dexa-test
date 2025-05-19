export enum AttendanceType {
  IN = 1,
  OUT = 2,
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
  photo?: string,
}

export interface TargetAttendanceRegisterData {
  userId: number,
  weekday: Weekday,
  startTime: Date,
  endTime: Date,
}