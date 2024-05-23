import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const createJwt = (id: number, email: string) => {
  const secret: string = process.env.JWT_SECRET as string;
  const token = jwt.sign({ id, email }, secret, {
    expiresIn: "2d",
  });

  return token;
};

export const verifyJwt = (token: string) => {
  const secret: string = process.env.JWT_SECRET as string;
  const decoded = jwt.verify(token, secret);
  return decoded;
};
