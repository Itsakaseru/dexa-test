import express, { Request, Response } from "express";
import { pinoHttp } from "pino-http";
import { PrismaClient } from "../prisma/generated";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import attendanceRoute from "./routes/attendance.route";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();
const logger = pinoHttp();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: true
}));
app.use(logger);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/attendance", attendanceRoute);

app.listen(PORT, async () => {
  await prisma.$connect();
  console.log(`Running in ${ process.env.NODE_ENV || "development" } mode.`);
  console.log(`Server listening on port ${PORT}`);
});