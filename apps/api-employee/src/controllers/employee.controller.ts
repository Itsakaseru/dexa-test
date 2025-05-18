import { Request, Response, NextFunction } from "express";
import {
  createEmployee,
  deleteEmployee,
  getAllEmployees,
  getEmployeeByUserId,
  updateEmployee
} from "../services/employee.service";
import {StatusCodes} from "http-status-codes";

export async function getAll(req: Request, res: Response, next: NextFunction) {
  res.status(StatusCodes.OK).json(await getAllEmployees());
  return;
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  const { userId } = req.params || {};

  const employee = await getEmployeeByUserId(Number(userId));

  if (!employee) {
    res.status(StatusCodes.NOT_FOUND).json({
      message: "Employee not found"
    });
    return;
  }

  res.status(StatusCodes.OK).json(employee);
  return;
}

export async function create(req: Request, res: Response, next: NextFunction) {
  const {
    userId,
    name,
    gender,
    dob,
    departmentId,
    positionId
  } = req.body || {};

  if (!userId || !name || !gender || !dob || !departmentId || !positionId) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "Bad request"
    });
  }

  const employeeData = {
    userId,
    name,
    gender,
    dob,
    departmentId,
    positionId
  };

  const employee = await createEmployee(employeeData);

  res.status(StatusCodes.CREATED).json({
    data: {
      id: employee.id
    },
    message: "Employee created successfully"
  });
  
  return;
}

export async function update(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params || {};
  const {
    userId,
    name,
    gender,
    dob,
    departmentId,
    positionId
  } = req.body || {};

  if (!id || !userId || !name || !gender || !dob || !departmentId || !positionId) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "Bad request"
    });
    return;
  }

  const employeeData = {
    userId,
    name,
    gender,
    dob,
    departmentId,
    positionId
  };

  const historyData = await updateEmployee(Number(id), employeeData);

  if (!historyData) {
    res.status(StatusCodes.NOT_FOUND).json({
      message: "Employee not found"
    });
    return;
  }

  res.status(StatusCodes.OK).json({
    data: {
      historyData
    },
    message: "Employee updated successfully"
  });

  return;
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  const { id } = req.body || {};

  const historyData = await deleteEmployee(Number(id));

  if (!historyData) {
    res.status(StatusCodes.NOT_FOUND).json({
      message: "Employee not found"
    });
    return;
  }

  res.status(StatusCodes.OK).json({
    data: {
      historyData
    },
    message: "Employee deleted successfully"
  });

  return;
}