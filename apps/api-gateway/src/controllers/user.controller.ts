import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import {createUser, deleteUser, getAllUsers, getUserById, updateUser} from "../services/user.service";
import { Prisma } from "../../prisma/generated";
import { LoginData } from "@repo/shared-types";
import { JwtPayload } from "src/types/auth.type";
import axios from "axios";

export async function getMe(req: Request, res: Response, next: NextFunction) {
  const { userId } = res.locals.decoded || {};
  const user = await getUserById(Number(userId));
  const employeeInfo = (await axios.get(`http://localhost:3001/employee/${ userId }`)).data;

  if (!user) {
    res.status(StatusCodes.NOT_FOUND).json({
      message: "User not found"
    });
    return;
  }

  res.status(StatusCodes.OK).json({
    id: user.id,
    email: user.email,
    ...employeeInfo
  });

  return;
}

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

    res.status(StatusCodes.CREATED).json({
      message: "User created successfully"
    });
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
  const { id } = req.params || {};
  const { email, password }: LoginData = req.body || {};

  if (!email || !password) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Email and password are required"
    });
    return;
  }

  try {
    await updateUser(Number(id), {email, password});

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