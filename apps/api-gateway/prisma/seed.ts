import { PrismaClient } from "../prisma/generated";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

// Example dummy data
const users = [
  {
    "email": "ardi.supriadi@dexagroup.com",
    "password": "ardiPassword",
  },
  {
    "email": "sarah.johnson@dexagroup.com",
    "password": "sarahPassword",
  },
  {
    "email": "michael.chen@dexagroup.com",
    "password": "michaelPassword",
  },
  {
    "email": "emily.davis@dexagroup.com",
    "password": "emilyPassword",
  },
  {
    "email": "james.wilson@dexagroup.com",
    "password": "jamesPassword",
  },
  {
    "email": "linda.martinez@dexagroup.com",
    "password": "lindaPassword",
  },
  {
    "email": "robert.taylor@dexagroup.com",
    "password": "robertPassword",
  },
  {
    "email": "jessica.brown@dexagroup.com",
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
  await prisma.user.deleteMany();
}

clear();
insertUsers();