import { Router } from "express";
import * as user from "../controllers/user.controller";

const router = Router();

router.get("/list", user.getAll);
router.get("/:id", user.getById);

router.post("/create", user.create);
router.post("/update", user.update);
router.post("/remove", user.remove);

export default router;