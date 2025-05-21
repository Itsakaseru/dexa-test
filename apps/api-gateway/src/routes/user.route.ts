import { Router } from "express";
import * as user from "../controllers/user.controller";

const router = Router();

router.get("/me", user.getMe);
router.get("/list", user.getAll);
router.get("/:id", user.getById);

export default router;