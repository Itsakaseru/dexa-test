import { Prisma, PrismaClient } from "../../prisma/generated";
import * as bcrypt from "bcrypt";
import { LoginData } from "@repo/shared-types";

const prisma = new PrismaClient();

export async function getAllUsers() {
  return prisma.user.findMany();
}

export async function getUserById(id: number) {
  return prisma.user.findUnique({
    where: {
      id
    }
  });
}

export async function getUserByEmailWithHash(email: string) {
  return prisma.user.findUnique({
    where: {
      email
    }
  });
}

export async function createUser(data: LoginData) {
  return prisma.user.create({
    data: {
      email: data.email,
      hash: await bcrypt.hash(data.password, 10),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  });
}

export async function updateUser(id: number, data: LoginData) {
  // Only update password if it is provided
  const updatedData: Prisma.UserUpdateInput = {
    email: data.email,
    updatedAt: new Date(),
    ...(data.password ? { hash: await bcrypt.hash(data.password, 10) } : {}),
  }

  return prisma.user.update({
    where: {
      id
    },
    data: updatedData
  });
}

export async function deleteUserToken(id: number) {
  return prisma.token.deleteMany({
    where: {
      userId: id
    }
  });
}

export async function deleteUser(id: number) {
  return prisma.user.delete({
    where: {
      id
    },
  });
}