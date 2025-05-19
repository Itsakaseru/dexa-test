import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { getAllAttendance, getUserAttendance } from "../services/attendance.service";

export async function getAll(req: Request, res: Response, next: NextFunction) {
  const data = await getAllAttendance();

  res.status(StatusCodes.OK).json(data);
  return;
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params || {};

  const data = await getUserAttendance(Number(id));
  res.status(StatusCodes.OK).json(data);

  return;
}

export async function create(req: Request, res: Response, next: NextFunction) {

  // Upload a photo from middleware, grab photo path data url, then perform insert

}