import { AttendanceData, EmployeeData, TargetAttendanceData, TargetAttendanceHistoryData } from "@repo/shared-types";
import axios from "axios";
import { Router } from "express";
import httpProxy from "http-proxy";
import { hasAdminAccess } from "../services/auth.service";
import dayjs from "dayjs";
import { processAttendanceEmployeeTargetList } from "../services/attendance.service";

const router = Router();
const apiProxy = httpProxy.createProxyServer();

router.get("/list", async (req, res, next) => {
  const { userId } = res.locals.decoded || {};

  if (!await hasAdminAccess(userId)) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  try {
    const attendanceData = await axios.get<AttendanceData[]>(`http://localhost:3002/attendance/list`);
    const targetAttendanceData = await axios.get<TargetAttendanceData[]>(`http://localhost:3002/attendance/target/list`);
    const targetAttendanceHistoryData = await axios.get<TargetAttendanceHistoryData[]>(`http://localhost:3002/attendance/targetHistory/list`);
    const employeeData = await axios.get<EmployeeData[]>(`http://localhost:3001/employee/list`);

    const attendanceEmployeeList = attendanceData.data.map((attendance) => {
      const employee = employeeData.data.find((emp) => emp.userId === attendance.userId);
      return {
        ...attendance,
        name: employee ? employee.name : "<Unknown>",
      };
    });

    const processedAttendanceEmployeeTargetList = await processAttendanceEmployeeTargetList(
      attendanceEmployeeList,
      targetAttendanceData.data,
      targetAttendanceHistoryData.data,
      employeeData.data
    );

    res.status(200).json(processedAttendanceEmployeeTargetList);
    return;
  }
  catch (err) {
    console.error("Error fetching attendance data:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/list/:id", async (req, res, next) => {
  const { userId } = res.locals.decoded || {};
  const { id } = req.params;

  if (!await hasAdminAccess(userId)) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  try {
    const attendanceData = await axios.get<AttendanceData[]>(`http://localhost:3002/attendance/${id}`);
    const targetAttendanceData = await axios.get<TargetAttendanceData[]>(`http://localhost:3002/attendance/target/${id}`);
    const targetAttendanceHistoryData = await axios.get<TargetAttendanceHistoryData[]>(`http://localhost:3002/attendance/targetHistory/${id}`);
    const employeeData = await axios.get<EmployeeData[]>(`http://localhost:3001/employee/list`);

    const attendanceEmployeeList = attendanceData.data.map((attendance) => {
      const employee = employeeData.data.find((emp) => emp.userId === attendance.userId);
      return {
        ...attendance,
        name: employee ? employee.name : "<Unknown>",
      };
    });

    const processedAttendanceEmployeeTargetList = await processAttendanceEmployeeTargetList(
      attendanceEmployeeList,
      targetAttendanceData.data,
      targetAttendanceHistoryData.data,
      employeeData.data
    );

    res.status(200).json(processedAttendanceEmployeeTargetList);
    return;
  }
  catch (err) {
    console.error("Error fetching attendance data:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/target", async (req, res, next) => {
  const { userId } = res.locals.decoded || {};
  req.url = req.url.replace("/target", "");

  apiProxy.web(req, res, { target: `http://localhost:3002/attendance/target/${userId}` }, (err) => {
    console.error("Proxy error:", err);
    res.status(500).send("Proxy error");
  });
  return;
});

router.get("/current", async (req, res, next) => {
  const { userId } = res.locals.decoded || {};
  req.url = req.url.replace("/current", "");
  apiProxy.web(req, res, { target: `http://localhost:3002/attendance/current/${userId}` }, (err) => {
    console.error("Proxy error:", err);
    res.status(500).send("Proxy error");
  });
  return;
});

router.post("/check/in", async (req, res, next) => {
  const { userId } = res.locals.decoded || {};
  req.url = req.url.replace("/check/in", "");

  apiProxy.web(req, res, { target: `http://localhost:3002/attendance/check/in/${userId}` }, (err) => {
    console.error("Proxy error:", err);
    res.status(500).send("Proxy error");
  });
  return;
});

router.post("/check/out", async (req, res, next) => {
  const { userId } = res.locals.decoded || {};
  req.url = req.url.replace("/check/out", "");

  apiProxy.web(req, res, { target: `http://localhost:3002/attendance/check/out/${userId}` }, (err) => {
    console.error("Proxy error:", err);
    res.status(500).send("Proxy error");
  });
  return;
});

export default router;