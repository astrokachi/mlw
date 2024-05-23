import { prisma } from "../db/server";
import { Request, Response, NextFunction } from "express";
import "express-async-errors";
import { verifyJwt } from "../utils/encrypt/jwt";
import { findUser } from "../utils/helpers/findUsers";

interface IPayload {
  id: number;
  email: string;
  iat: number;
  exp: number;
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log(token);
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
  try {
    const decoded = verifyJwt(token) as IPayload;
    console.log(decoded, "decoded");
    const { user, type } = await findUser(decoded.email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    req.user = { ...user, type };
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};
