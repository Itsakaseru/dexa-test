import { Router } from "express";
import * as attendance from "../controllers/attendance.controller";
import { upload } from "../middlewares/upload.middleware";

const router = Router();

router.get("/list", attendance.getAll);
router.get("/:id", attendance.getById);

export default router;