import { Router } from "express";
import * as employee from "../controllers/employee.controller";

const router = Router();

router.get("/list", employee.getAll);
router.get("/:userId", employee.getByUserId);

router.post("/create", employee.create);
router.post("/update/:id", employee.update);
router.post("/remove/:id", employee.removeById);

export default router;