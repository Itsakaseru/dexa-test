import { Router } from "express";
import * as employee from "../controllers/employee.controller";

const router = Router();

router.get("/list", employee.getAll);
router.get("/:id", employee.getById);

router.post("/create", employee.create);
router.post("/update", employee.update);
router.post("/remove", employee.remove);

export default router;