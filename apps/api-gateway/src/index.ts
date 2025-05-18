import express, { Request, Response } from "express";
import { pinoHttp } from "pino-http";
import authRoute from "./routes/auth.route";
import { PrismaClient } from "../prisma/generated";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoute from "./routes/user.route";
import {verifyAccessToken} from "./middlewares/verify.middleware";

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

app.use("/auth", authRoute);
app.use("/user", verifyAccessToken, userRoute);

app.listen(PORT, async () => {
  await prisma.$connect();
  console.log(`Server listening on port ${PORT}`);
});