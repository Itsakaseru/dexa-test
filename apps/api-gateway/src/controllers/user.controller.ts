import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import {createUser, deleteUser, getAllUsers, getUserById, updateUser} from "../services/user.service";
import { Prisma } from "../../prisma/generated";
import { LoginData } from "@repo/shared-types";
import { getUserByEmailWithHash } from "../services/user.service";

export async function getAll(req: Request, res: Response, next: NextFunction) {
  const users = await getAllUsers();
  const usersWithoutHash = users.map(({hash, ...user}) => user);

  res.json(usersWithoutHash);
  return;
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params || {};
  const user = await getUserById(Number(id));
  const { hash, ...userWithoutHash } = user || {};

  res.json(userWithoutHash);
  return;
}

export async function create(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body || {};

  if (!email || !password) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "Bad request"
    });

    return;
  }

  try {
    await createUser({ email, password });
  }
  catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        res.status(StatusCodes.CONFLICT).json({
          message: "Email already exists"
        });
        return;
      }
    }
    else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error"
      });
      return;
    }
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  const { email, password }: LoginData = req.body || {};

  if (!email || !password) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Email and password are required"
    });
    return;
  }

  try {
    const user = await getUserByEmailWithHash(email);

    if (!user) {
      res.status(StatusCodes.NOT_FOUND).json({
        message: "User not found"
      });
      return;
    }

    await updateUser(user.id, {email, password});

    res.status(StatusCodes.OK).json({
      message: "User updated successfully"
    });

    return;

  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        res.status(StatusCodes.CONFLICT).json({
          message: "Email already exists"
        });
        return;
      }
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error"
    });

    return;
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  const { id } = req.body || {};
  await deleteUser(id);
}