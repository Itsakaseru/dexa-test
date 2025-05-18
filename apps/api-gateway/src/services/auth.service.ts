import { User, PrismaClient } from "../../prisma/generated";
import * as bcrypt from "bcrypt";
import { JwtPayload } from "../types/auth.type";
import { v7 as uuidv7 } from "uuid";
import ms from "ms";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function findJti(userId: number, jti: string) {
  return prisma.token.findUnique({
    where: {
      userId,
      jti
    }
  });
}

export async function revokeToken(userId: number, jit: string | string[]) {
  return prisma.token.updateMany({
    where: {
      userId,
      jti: {
        in: [...jit]
      }
    },
    data: {
      isRevoked: true
    }
  });
}

export async function isPasswordValid(user: User, password: string) {
  return await bcrypt.compare(password, user.hash);
}

export type JwtTokenType = "AccessToken" | "RefreshToken";
export async function generateToken(userId: number, type: JwtTokenType) {
  const secret = await getJwtSecret();
  const expiredIn = type === "AccessToken" ? "15m" : "8h";
  const expiredAt = new Date(Date.now() + ms(expiredIn));

  const payload: JwtPayload = {
    iss: "https://dexagroup.com",
    jti: uuidv7(),
    userId: userId,
  };

  await prisma.token.create({
    data: {
      userId: userId,
      jti: payload.jti,
      isRevoked: false,
      expiredAt: expiredAt,
      createdAt: new Date(),
    }
  })

  return {
    token: jwt.sign(payload, secret, {
      expiresIn: ms(expiredIn)
    }),
    expiredAt: expiredAt,
  }
}

export async function verifyToken(token: string) {
  const secret = await getJwtSecret();
  const decode = await decodeToken(token);

  try {
    const status = await prisma.token.findUnique({
      where: {
        userId: decode.userId,
        jti: decode.jti,
      }
    });

    if (status && status.isRevoked) return false;

    jwt.verify(token, secret);

    return true;
  }
  catch (err) {
    return false;
  }
}

export async function decodeToken(token: string) {
  const secret = await getJwtSecret();
  return jwt.verify(token, secret) as JwtPayload;
}

export async function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error("JWT_SECRET is not defined");
    process.exit(1);
  }

  return secret;
}