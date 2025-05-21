import { Router } from "express";
import * as auth from "../controllers/auth.controller";
import { verifyAccessToken } from "../middlewares/verify.middleware";
import { StatusCodes } from "http-status-codes";

const router = Router();

router.get("/validate", verifyAccessToken, (req, res) => {
    res.sendStatus(StatusCodes.OK);
    return;
});

router.post("/login", auth.login);
router.post("/refresh", auth.refreshToken);
router.post("/logout", auth.logout);

export default router;