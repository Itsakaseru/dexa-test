import dayjs from "dayjs";
import { Prisma, PrismaClient } from "../../prisma/generated";
import { AttendanceData, AttendanceRegisterData, TargetAttendanceRegisterData } from "@repo/shared-types";
import { Config } from "../index";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

export async function getAllAttendance() {
  return prisma.attendance.findMany();
}

export async function getAllTargetAttendance() {
  return prisma.targetAttendance.findMany();
}

export async function getAllTargetAttendanceHistory() {
  return prisma.targetAttendanceHistory.findMany();
}

export async function getUserTargetAttendanceHistory(userId: number) {
  return prisma.targetAttendanceHistory.findMany({
    where: {
      userId
    }
  });
}

export async function getUserAttendance(userId: number) {
  return prisma.attendance.findMany({
    where: {
      userId
    }
  });
}

export async function getUserAttendanceToday(userId: number) {
  return prisma.attendance.findMany({
    where: {
      userId,
      dateTime: {
        gte: dayjs(new Date().toUTCString()).startOf("day").toDate(),
        lte: dayjs(new Date().toUTCString()).endOf("day").toDate()
      }
    }
  });
}

export async function checkStatusToday(data: AttendanceData[]) {
  const checkIn = data.find(a => a.typeId === 1);
  const checkOut = data.find(a => a.typeId === 2);

  if (checkIn && checkOut) {
    return "done";
  } else if (checkIn && !checkOut) {
    return "check-out";
  } else if (!checkIn && !checkOut) {
    return "check-in";
  } 
}

export async function getUserTargetAttendance(userId: number) {
  return prisma.targetAttendance.findMany({
    where: {
      userId
    }
  });
}

export async function getUserTargetAttendanceToday(userId: number) {
  return prisma.targetAttendance.findUnique({
    where: {
      userId_weekday: {
        userId,
        weekday: dayjs(new Date().toUTCString()).day()
      }
    }
  });
}

export async function createAttendance(data: AttendanceRegisterData) {
  return prisma.attendance.create({
    data: {
      ...data,
    }
  });
}

export async function createTargetAttendance(data: TargetAttendanceRegisterData[]) {
  return prisma.targetAttendance.createMany({
    data: data.map((targetAttendance) => ({
      ...targetAttendance,
      createdAt: new Date()
    }))
  });
}

export async function movePhotoToFolder(attendanceData: AttendanceData, filename: string) {
  fs.existsSync(Config.tempPath) || fs.mkdirSync(Config.tempPath, { recursive: true });
  fs.existsSync(Config.uploadPath) || fs.mkdirSync(Config.uploadPath, { recursive: true });
  fs.existsSync(path.join(Config.uploadPath, attendanceData.userId.toString())) || fs.mkdirSync(path.join(Config.uploadPath, attendanceData.userId.toString()), { recursive: true });

  fs.renameSync(path.join(Config.tempPath, filename), path.join(Config.uploadPath, attendanceData.userId.toString(), filename));
}

export async function updateAttendance(id: number, data: AttendanceRegisterData) {
  return prisma.attendance.update({
    where: {
      id
    },
    data
  });
}

export async function deleteUserAttendance(userId: number, attendanceId: number) {
  return prisma.attendance.delete({
    where: {
      id: attendanceId,
      userId
    }
  });
}

export async function deleteAllUserAttendance(userId: number) {
  return prisma.attendance.deleteMany({
    where: {
      userId
    }
  });
}

export async function deleteAllTargetAttendance(userId: number) {
  return prisma.targetAttendance.deleteMany({
    where: {
      userId
    }
  });
}

export async function createTargetAttendanceHistory(data: Prisma.TargetAttendanceHistoryCreateManyInput[]) {
  return prisma.targetAttendanceHistory.createMany({
    data
  });
}

export async function upsertTargetAttendance(data: TargetAttendanceRegisterData[]) {
  // Check if data already exists
  const currData = await prisma.targetAttendance.findMany({
    where: {
      userId: data[0].userId
    }
  });

  // If data don't exist
  if (currData.length === 0) {
    return prisma.targetAttendance.createMany({
      data: data.map((targetAttendance) => ({
        ...targetAttendance,
        createdAt: new Date(),
      }))
    });
  }

  // If already exists
  const currDataWithoutId = currData.map((targetAttendance) => {
    const { id, ...currDataWithoutId } = targetAttendance;
    return currDataWithoutId;
  });

  const targetAttendanceHistory = await createTargetAttendanceHistory(currDataWithoutId);

  await prisma.targetAttendance.deleteMany({
    where: {
      userId: data[0].userId
    }
  });

  await prisma.targetAttendance.createMany({
    data: data.map((targetAttendance) => ({
      ...targetAttendance,
      createdAt: new Date(),
    }))
  });

  return targetAttendanceHistory;
}