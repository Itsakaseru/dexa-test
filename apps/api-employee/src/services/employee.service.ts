import { Prisma, PrismaClient } from "../../prisma/generated";
import { EmployeeRegisterData } from "@repo/shared-types";

const prisma = new PrismaClient();

export async function getAllEmployees() {
  return prisma.employee.findMany();
}

export async function getEmployeeByUserId(userId: number) {
  return prisma.employee.findUnique({
    where: {
      userId: userId
    }
  });
}

export async function createEmployee(data: EmployeeRegisterData) {
  return prisma.employee.create({
    data: {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });
}

export async function createEmployeeHistory(data: Prisma.EmployeeCreateManyInput) {
  const { id, updatedAt, ...dataClean } = data || {};

  return prisma.employeeHistory.create({
    data: {
      ...dataClean,
      createdAt: new Date(),
    }
  });
}

export async function updateEmployee(id: number, data: EmployeeRegisterData) {
  const currEmployeeData = await prisma.employee.findUnique({
    where: {
      id
    }
  });

  // Failed to find data
  if (!currEmployeeData) return null;

  const historyData = await createEmployeeHistory(currEmployeeData);

  const { userId, ...dataWithoutUserId } = data || {};

  await prisma.employee.update({
    where: {
      id
    },
    data: {
      ...dataWithoutUserId,
      updatedAt: new Date()
    }
  });

  return historyData;
}

export async function deleteEmployee(userId: number) {
  const currEmployeeData = await getEmployeeByUserId(userId);

  // Failed to find data
  if (!currEmployeeData) return null;

  const historyData = await createEmployeeHistory(currEmployeeData);

  await prisma.employee.delete({
    where: {
      userId
    }
  });

  return historyData;
}