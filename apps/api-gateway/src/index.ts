import express, { NextFunction, Request, Response } from "express";
import { pinoHttp } from "pino-http";
import authRoute from "./routes/auth.route";
import { PrismaClient } from "../prisma/generated";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoute from "./routes/user.route";
import {verifyAccessToken} from "./middlewares/verify.middleware";
import attendanceRoute from "./routes/attendance.route";
import employeeRoute from "./routes/employee.route";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();
const logger = pinoHttp();
const prisma = new PrismaClient();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: true
}));
app.use(logger);

app.get("/", (req: Request, res: Response) => {
  res.json({
    time: new Date().toUTCString(),
  });
});

app.use("/auth", authRoute);
app.use("/user", verifyAccessToken, userRoute);

app.use("/attendance", verifyAccessToken, attendanceRoute);
app.use("/employee", verifyAccessToken, employeeRoute);

app.listen(PORT, async () => {
  await prisma.$connect();
  console.log(`Running in ${ process.env.NODE_ENV || "development" } mode.`);
  console.log(`Server listening on port ${PORT}`);
});