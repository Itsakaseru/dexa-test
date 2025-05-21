import { Router } from "express";
import httpProxy from "http-proxy";
import { hasAdminAccess } from "../services/auth.service";
import multer from "multer";
import { EmployeeRegisterData, LoginData, TargetAttendanceFormData } from "@repo/shared-types";
import { createUser, deleteUser, deleteUserToken, getUserById, updateUser } from "../services/user.service";
import axios from "axios";
import { StatusCodes } from "http-status-codes";

const router = Router();
const upload = multer();
const apiProxy = httpProxy.createProxyServer();

router.get("/list", async (req, res, next) => {
  const { userId } = res.locals.decoded || {};

  if (!await hasAdminAccess(userId)) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  req.url = req.url.replace("/list", "");
  apiProxy.web(req, res, { target: `http://localhost:3001/employee/list` }, (err) => {
    console.error("Proxy error:", err);
    res.status(500).send("Proxy error");
  });
  return;
});

router.get("/:id", async (req, res, next) => {
  const { userId } = res.locals.decoded || {};
  const { id } = req.params || {};
  
  if (!await hasAdminAccess(userId)) {
    res.status(StatusCodes.FORBIDDEN).json({ message: "Forbidden" });
    return;
  }

  const employeeData = await axios.get(`http://localhost:3001/employee/${id}`);
  const userData = await getUserById(Number(id));
  const attendanceData = await axios.get(`http://localhost:3002/attendance/target/${id}`);

  if (!employeeData || !userData) {
    res.status(StatusCodes.NOT_FOUND).json({ message: "Not Found" });
    return;
  }

  res.status(StatusCodes.OK).json({
    ...employeeData.data,
    email: userData.email,
    targetAttendance: attendanceData.data,
  });

  return;
});

router.post("/create", upload.none(), async (req, res, next) => {
  const { userId } = res.locals.decoded || {};
  const {
    name,
    gender,
    dob,
    departmentId,
    positionId,
    email,
    password,
    targetAttendance
  } = req.body || {}

  if (!name || !gender || !dob || !departmentId || !positionId || !email || !password) {
    res.status(400).json({ message: "Bad Request" });
    return;
  }

  if (!await hasAdminAccess(userId)) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  const userData: LoginData = {
    email,
    password,
  };

  // TODO: Implement short circuit, reverse action if one of the request failed
  const user = await createUser(userData);

  const employeeData: EmployeeRegisterData = {
    userId: user.id,
    name,
    gender,
    dob,
    departmentId: Number(departmentId),
    positionId: Number(positionId),
  };

  await axios.post(`http://localhost:3001/employee/create`, employeeData);

  if (targetAttendance && targetAttendance.length > 0) {
    await axios.post(`http://localhost:3002/attendance/create`, {
      userId: user.id,
      targetAttendance,
    });
  }

  req.url = req.url.replace("/create", "");

  res.send("OK");
  return;
});

router.post("/update/:id", upload.none(), async (req, res, next) => {
  const { userId } = res.locals.decoded || {};
  const { id } = req.params || {};

  if (!await hasAdminAccess(userId)) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  const {
    name,
    userId: userIdFromBody,
    gender,
    dob,
    departmentId,
    positionId,
    email,
    password,
    targetAttendance
  } = req.body || {}

  if (!name || !gender || !dob || !departmentId || !positionId || !email) {
    res.status(400).json({ message: "Bad Request" });
    return;
  }

  const userData: LoginData = {
    email,
    password,
  };

  // TODO: Implement short circuit, reverse action if one of the request failed
  const user = await updateUser(Number(userIdFromBody), userData);

  const employeeData: EmployeeRegisterData = {
    userId: user.id,
    name,
    gender,
    dob,
    departmentId: Number(departmentId),
    positionId: Number(positionId),
  };

  await axios.post(`http://localhost:3001/employee/update/${id}`, employeeData);

  const targetAttendanceParsed = JSON.parse(targetAttendance) as TargetAttendanceFormData[];

  if (targetAttendanceParsed && targetAttendanceParsed.length > 0) {
    await axios.post(`http://localhost:3002/attendance/target/update/${userIdFromBody}`, {
      userId: Number(userIdFromBody),
      targetAttendance,
    });
  }

  req.url = req.url.replace("/create", "");

  res.send("OK");
  return;
});

router.delete("/remove/:id", async (req, res, next) => {
  const { userId } = res.locals.decoded || {};
  const { id } = req.params || {};

  if (!await hasAdminAccess(userId)) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  // TODO: Implement short circuit, reverse action if one of the request failed
  try {
    await deleteUserToken(Number(id));
    await deleteUser(Number(id));
    await axios.post(`http://localhost:3001/employee/remove/${id}`);
    await axios.post(`http://localhost:3002/attendance/remove/${id}`);
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }

  res.send("OK");
  return;
});

export default router;