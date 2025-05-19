import { Router } from "express";
import * as user from "../controllers/user.controller";

const router = Router();

router.get("/list", user.getAll);
router.get("/:id", user.getById);

router.post("/create", user.create);
router.post("/update/:id", user.update);
router.post("/remove/:id", user.remove);

export default router;