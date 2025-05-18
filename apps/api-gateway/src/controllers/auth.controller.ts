import { Request, Response, NextFunction } from "express";
import {
  decodeToken,
  findJti,
  generateToken,
  isPasswordValid, revokeToken,
  verifyToken
} from "../services/auth.service";
import { getUserByEmailWithHash } from "../services/user.service";
import { StatusCodes } from "http-status-codes";

export async function login(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body || {};

  if (!email || !password) {
    res.status(StatusCodes.BAD_REQUEST).send({ message: "Email and password are required" });
    return;
  }

  try {
    const user = await getUserByEmailWithHash(email);

    if (!user) {
      res.status(StatusCodes.UNAUTHORIZED).send({ message: "Invalid email or password" });
      return;
    }

    if (!await isPasswordValid(user, password)) {
      res.status(StatusCodes.UNAUTHORIZED).send({ message: "Invalid email or password" });
      return;
    }

    // Can be declared into a separate configuration to determine the expiry time of access token and refresh token
    const accessToken = await generateToken(user.id, "AccessToken");
    const refreshToken = await generateToken(user.id, "RefreshToken");

    res.cookie("accessToken", accessToken, {
      secure: process.env.NODE_ENV === "production",
      expires: accessToken.expiredAt,
      httpOnly: false,
    });

    res.cookie("refreshToken", refreshToken, {
      secure: process.env.NODE_ENV === "production",
      expires: refreshToken.expiredAt,
      httpOnly: true,
    });

    res.status(StatusCodes.OK).json({
      message: "Login successful",
    });
    return;
  }
  catch (err: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error"
    });
    return;
  }
}

export async function refreshToken(req: Request, res: Response, next: NextFunction) {
  const refreshToken: string | null = req.cookies.refreshToken;

  if (!refreshToken) {
    res.status(StatusCodes.BAD_REQUEST).send({ message: "Invalid refresh token" });
    return;
  }

  try {
    // Can be decoupled to separate middleware to check the validity of either access token or refresh token
    const payload = await decodeToken(refreshToken);

    if (await verifyToken(refreshToken)) {
      res.status(StatusCodes.UNAUTHORIZED).send({ message: "Invalid refresh token" });
      return;
    }

    const accessToken = await generateToken(payload.userId, "AccessToken");
    res.cookie("accessToken", accessToken, {
      secure: process.env.NODE_ENV === "production",
      expires: accessToken.expiredAt,
      httpOnly: false,
    });

    res.status(StatusCodes.OK).json({
      message: "Successfully re-authenticated with refresh token.",
    });
    return;
  }
  catch (err: any) {
    res.status(StatusCodes.BAD_REQUEST).send({ message: "Invalid refresh token" });
    return;
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  const accessToken: string | null = req.cookies.accessToken.token;
  const refreshToken: string | null = req.cookies.refreshToken.token;

  // No cookies found
  if (!accessToken || !refreshToken) {
    res.status(StatusCodes.OK).json({
      message: "Logout successful, no cookies found"
    });
    return;
  }

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  if (!await verifyToken(accessToken) || !await verifyToken(refreshToken)) {
    res.status(StatusCodes.OK).send({
      message: "Logout successful, invalid token"
    });
    return;
  }

  const accessTokenPayload = await decodeToken(accessToken);
  const refreshTokenPayload = await decodeToken(refreshToken);

  await revokeToken(accessTokenPayload.userId, [accessTokenPayload.jti, refreshTokenPayload.jti]);

  res.status(StatusCodes.OK).json({
    message: "Logout successful",
  });
  return;
}