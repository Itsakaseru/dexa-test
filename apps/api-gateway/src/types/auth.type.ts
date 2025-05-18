import jwt from "jsonwebtoken";

export interface JwtPayload {
  iss: string,
  jti: string,
  userId: number,
}