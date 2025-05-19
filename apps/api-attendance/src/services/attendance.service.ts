import { Prisma, PrismaClient } from "../../prisma/generated";
import { AttendanceRegisterData, TargetAttendanceRegisterData } from "@repo/shared-types";

const prisma = new PrismaClient();

export async function getAllAttendance() {
  return prisma.attendance.findMany();
}

export async function getUserAttendance(userId: number) {
  return prisma.attendance.findMany({
    where: {
      userId
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
  if (currData.length !== 0) {
    return prisma.targetAttendance.createMany({
      data: data.map((targetAttendance) => ({
        ...targetAttendance,
        createdAt: new Date(),
        updatedAt: new Date()
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
      updatedAt: new Date()
    }))
  });

  return targetAttendanceHistory;
}