import { NextFunction, Request, Response } from "express";
import { decodeToken, verifyToken } from "../services/auth.service";
import { StatusCodes } from "http-status-codes";

export async function verifyAccessToken(req: Request, res: Response, next: NextFunction) {
  const accessToken = req.cookies.accessToken && req.cookies.accessToken.token;

  if (!accessToken) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Unauthorized"
    });
    return;
  }

  if (await verifyToken(accessToken)) {
    const decoded = await decodeToken(accessToken);
    res.locals.decoded = decoded;
    next();
  }
  else {
    res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Unauthorized, please login again"
    });
    return;
  }
}

export async function verifyRoles() {
  // List all users, create, update and delete user to Head of HRD only
}