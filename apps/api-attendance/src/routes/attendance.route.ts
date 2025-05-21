import { Router } from "express";
import * as attendance from "../controllers/attendance.controller";
import { upload } from "../middlewares/upload.middleware";

const router = Router();

router.get("/list", attendance.getAll);
router.get("/:id", attendance.getById);
router.get("/target/list", attendance.getTargetAll);
router.get("/targetHistory/list", attendance.getTargetHistoryAll);
router.get("/targetHistory/:id", attendance.getTargetHistoryById);
router.get("/target/:id", attendance.getTargetById);
router.get("/current/:id", attendance.getByIdToday);

router.post("/create", attendance.createTarget);
router.post("/target/update/:id", attendance.updateTargetAttendance);
router.post("/check/in/:id", upload.single("photo"), attendance.createIn);
router.post("/check/out/:id", upload.single("photo"), attendance.createOut);

router.post("/remove/:id", attendance.deleteAllByUserId);

export default router;