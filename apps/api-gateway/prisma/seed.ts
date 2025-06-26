import { PrismaClient } from "../prisma/generated";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

// Example dummy data
const users = [
  {
    "email": "ardi.supriadi@attendee.com",
    "password": "ardiPassword",
  },
  {
    "email": "sarah.johnson@attendee.com",
    "password": "sarahPassword",
  },
  {
    "email": "michael.chen@attendee.com",
    "password": "michaelPassword",
  },
  {
    "email": "emily.davis@attendee.com",
    "password": "emilyPassword",
  },
  {
    "email": "james.wilson@attendee.com",
    "password": "jamesPassword",
  },
  {
    "email": "linda.martinez@attendee.com",
    "password": "lindaPassword",
  },
  {
    "email": "robert.taylor@attendee.com",
    "password": "robertPassword",
  },
  {
    "email": "jessica.brown@attendee.com",
    "password": "jessicaPassword",
  }
]

async function insertUsers() {
  const userData = await Promise.all(users.map(async (user, index) => ({
    id: index + 1,
    email: user.email,
    hash: await bcrypt.hash(user.password, 10),
    createdAt: new Date(),
    updatedAt: new Date()
  })));

  await prisma.user.createMany({
    data: userData,
  });
}

async function clear() {
  await prisma.token.deleteMany();
  await prisma.user.deleteMany();
}

async function main() {
  await clear();
  await insertUsers();
}

main();