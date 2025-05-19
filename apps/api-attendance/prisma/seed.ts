import {Prisma, PrismaClient } from "../prisma/generated";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const prisma = new PrismaClient();

const USER_ID_MAX_SEED = 8;
const ATTENDANCE_MAX_DAY_GENERATED = 20;
const ATTENDANCE_START_DATE = dayjs().tz("Asia/Jakarta").set("month", 4).set("date", 5).set("year", 2025).toDate();
const DEFAULT_ATTENDANCE_TARGET_TIME = {
  startTime: dayjs().tz("Asia/Jakarta").startOf("day").set("hour", 8).toDate(),
  endTime: dayjs().tz("Asia/Jakarta").startOf("day").set("hour", 17).toDate()
};

async function insertAttendanceType() {
  const attendanceType = ["Check-in", "Check-out"];

  await prisma.attendanceType.createMany({
    data: attendanceType.map((val, idx) => ({
      id: idx + 1,
      name: val,
    }))
  });
}

async function insertTargetAttendance() {
  const targetAttendanceData: Prisma.TargetAttendanceCreateManyInput[] = [];

  // Create fake data for every user's with default attendance from monday by friday
  // Weekday start from Monday(1) -> Friday(5)
  let idx = 1;
  for (let userId = 1; userId <= USER_ID_MAX_SEED; userId++) {
    for (let weekday = 1; weekday <= 5; weekday++) {
      targetAttendanceData.push({
        id: idx,
        userId,
        weekday,
        startTime: DEFAULT_ATTENDANCE_TARGET_TIME.startTime,
        endTime: DEFAULT_ATTENDANCE_TARGET_TIME.endTime,
        createdAt: new Date(),
      });

      idx++;
    }
  }

  await prisma.targetAttendance.createMany({
    data: targetAttendanceData,
  });
}

async function insertAttendance() {
  const attendanceData: Prisma.AttendanceCreateManyInput[] = [];

  let idx = 1;
  for (let userId = 1; userId <= USER_ID_MAX_SEED; userId++) {
    for (let day = 1; day <= ATTENDANCE_MAX_DAY_GENERATED; day++) {
      for (let attendanceType = 1; attendanceType <= 2; attendanceType++) {

        const offsetDay = Math.floor(day / 6) * 2;

        // Check-in and Check-out data
        const dateTime = attendanceType === 1 ?
          // Start from monday + current-day count + offset (no weekends data)
          dayjs(ATTENDANCE_START_DATE).add(day - 1 + offsetDay, "day").startOf("day").set("hour", 8).toDate() :
          dayjs(ATTENDANCE_START_DATE).add(day - 1 + offsetDay, "day").startOf("day").set("hour", 17).toDate();

        attendanceData.push({
          id: idx,
          userId: userId,
          typeId: attendanceType,
          dateTime,
          photo: null
        });

        idx++;
      }
    }
  }

  await prisma.attendance.createMany({
    data: attendanceData,
  });
}

async function clear() {
  await prisma.attendance.deleteMany();
  await prisma.targetAttendance.deleteMany();
  await prisma.attendanceType.deleteMany();
  await prisma.targetAttendanceHistory.deleteMany();
}

async function main() {
  await clear();
  await insertAttendanceType();
  await insertTargetAttendance();
  await insertAttendance();
}

main();