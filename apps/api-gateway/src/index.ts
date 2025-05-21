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
import httpProxy from "http-proxy";
import helmet from "helmet";

import { rateLimit } from 'express-rate-limit'

export const rateLimitAll = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 minutes
	limit: 10000,            // 10000 request per windowMs
	standardHeaders: "draft-8", 
	legacyHeaders: false, 
});

export const rateLimitAuth = rateLimit({
	windowMs: 1 * 60 * 1000,  // 1 minutes
	limit: 100,               // 100 request per windowMs
	standardHeaders: "draft-8", 
	legacyHeaders: false, 
});

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();
const logger = pinoHttp();
const prisma = new PrismaClient();
const apiProxy = httpProxy.createProxyServer();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: true
}));
app.use(logger);
app.use(helmet());

app.get("/", rateLimitAll, (req: Request, res: Response) => {
  res.json({
    time: new Date().toUTCString(),
  });
});

app.get("/uploads/*any", rateLimitAll, verifyAccessToken, (req: Request, res: Response) => {
  req.url = req.url.replace("/uploads", "");

  apiProxy.web(req, res, { target: "http://localhost:3002" }, (err: Error) => {
    console.error("Proxy error:", err);
    res.status(500).send("Proxy error");
  });
});

app.use("/auth", rateLimitAuth, authRoute);
app.use("/user", rateLimitAll, verifyAccessToken, userRoute);

app.use("/attendance", rateLimitAll, verifyAccessToken, attendanceRoute);
app.use("/employee", rateLimitAll, verifyAccessToken, employeeRoute);

app.listen(PORT, async () => {
  await prisma.$connect();
  console.log(`Running in ${ process.env.NODE_ENV || "development" } mode.`);
  console.log(`Server listening on port ${PORT}`);
});