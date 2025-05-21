import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { checkStatusToday, createAttendance, createTargetAttendance, createTargetAttendanceHistory, deleteAllTargetAttendance, deleteAllUserAttendance, deleteUserAttendance, getAllAttendance, getAllTargetAttendance, getAllTargetAttendanceHistory, getUserAttendance, getUserAttendanceToday, getUserTargetAttendance, getUserTargetAttendanceHistory, getUserTargetAttendanceToday, movePhotoToFolder, upsertTargetAttendance } from "../services/attendance.service";
import { AttendanceDataToday, AttendanceRegisterData, TargetAttendanceFormData, TargetAttendanceRegisterData } from "@repo/shared-types";
import path from "path";

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

export async function getByIdToday(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params || {};

  const targetToday = await getUserTargetAttendanceToday(Number(id));
  const attendanceToday = await getUserAttendanceToday(Number(id));

  const resData: AttendanceDataToday = {
    target: targetToday,
    attendance: {
      checkIn: attendanceToday.find(a => a.typeId === 1) || null,
      checkOut: attendanceToday.find(a => a.typeId === 2) || null,
    }
  };

  res.status(StatusCodes.OK).json(resData);

  return;
}

export async function getTargetAll(req: Request, res: Response, next: NextFunction) {
  const data = await getAllTargetAttendance();
  
  res.status(StatusCodes.OK).json(data);
  return
}

export async function getTargetHistoryAll(req: Request, res: Response, next: NextFunction) {
  const data = await getAllTargetAttendanceHistory();

  res.status(StatusCodes.OK).json(data);
  return;
}

export async function getTargetHistoryById(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params || {};
  const data = await getUserTargetAttendanceHistory(Number(id));
  
  res.status(StatusCodes.OK).json(data);
  return;
}

export async function getTargetById(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params || {};
  const data = await getUserTargetAttendance(Number(id));

  res.status(StatusCodes.OK).json(data);
  return;
}

export async function createTarget(req: Request, res: Response, next: NextFunction) {
  const { userId } = req.body || {};
  const { targetAttendance }: { targetAttendance: string } = req.body || {};

  const targetAttendanceParsed = JSON.parse(targetAttendance) as TargetAttendanceFormData[];

  const targetAttendanceRegisterData: TargetAttendanceRegisterData[] = targetAttendanceParsed.map((target) => ({
    userId: Number(userId),
    ...target,
  }));

  await createTargetAttendance(targetAttendanceRegisterData);
  res.status(StatusCodes.CREATED).json({ message: "Target attendance created" });
  return;
}

export async function updateTargetAttendance(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params || {};
  const { targetAttendance }: { targetAttendance: string } = req.body || {};

  const targetAttendanceParsed = JSON.parse(targetAttendance) as TargetAttendanceFormData[];
  const targetAttendanceRegisterData: TargetAttendanceRegisterData[] = targetAttendanceParsed.map((target) => ({
    userId: Number(id),
    ...target,
  }));

  try {
    const targetAttendanceData = await upsertTargetAttendance(targetAttendanceRegisterData);
    res.status(StatusCodes.CREATED).json(targetAttendanceData);
    return;
  }
  catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error creating target attendance" });
    return;
  }
}
  

export async function createIn(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params || {};
  const { filename, originalname } = req.file || {};

  if (!filename || !originalname) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "No file attached" });
    return;
  }
  
  const attendanceToday = await getUserAttendanceToday(Number(id));
  const statusToday = await checkStatusToday(attendanceToday);

  // Check what type of attendance to add or don't
  if (statusToday === "done") {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "Already checked in and out" });
    return;
  }
  else if (statusToday === "check-out") {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "Already checked in" });
    return;
  } 
  
  const attendanceRegisterData: AttendanceRegisterData = {
    userId: Number(id),
    typeId: 1, // check-in
    dateTime: new Date(),
    photo: filename,
  }; 

  const attendanceData = await createAttendance(attendanceRegisterData);

  try {
    movePhotoToFolder(attendanceData, filename);
  }
  catch (err) {
    await deleteUserAttendance(attendanceData.userId, attendanceData.id);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error creating directory and moving file" });
    return;
  }

  res.status(StatusCodes.CREATED).json(attendanceData);
  return;
}

export async function createOut(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params || {};
  const { filename, originalname } = req.file || {};

  if (!filename || !originalname) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "No file attached" });
    return;
  }
  
  const attendanceToday = await getUserAttendanceToday(Number(id));
  const statusToday = await checkStatusToday(attendanceToday);

  // Check what type of attendance to add or don't
  if (statusToday === "done") {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "Already checked in and out" });
    return;
  }
  else if (statusToday === "check-in") {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "You haven't checked in yet" });
    return;
  } 
  
  const attendanceRegisterData: AttendanceRegisterData = {
    userId: Number(id),
    typeId: 2, // check-out
    dateTime: new Date(),
    photo: filename,
  }; 

  const attendanceData = await createAttendance(attendanceRegisterData);

  try {
    movePhotoToFolder(attendanceData, filename);
  }
  catch (err) {
    await deleteUserAttendance(attendanceData.userId, attendanceData.id);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error creating directory and moving file" });
    return;
  }

  res.status(StatusCodes.CREATED).json(attendanceData);
  return;
}

export async function deleteAllByUserId(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params || {};

  await deleteAllUserAttendance(Number(id));
  await deleteAllTargetAttendance(Number(id));

  res.status(StatusCodes.OK).json({ message: "All attendance deleted" });
  return;
}