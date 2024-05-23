import { prisma } from "../db/server";
import { Request, Response } from "express";
import { findUser } from "../utils/helpers/findUsers";
import { send } from "../utils/email/mail";
import { comparePassword } from "../utils/encrypt/hashPassword";
import * as otpGenerator from "otp-generator";

export const verifyEmail = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Please provide your email",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid email format" });
  }

  const { user } = await findUser(email);

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "User not found",
    });
  }
  // GENERATE TOKEN
  const otp = otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  // Link will contain token to secure the route
  send({
    email,
    subject: "Email Verification",
    // template: "EmailVerification",
    text: `Your verification code is ${otp}`,
  })
    .then(() => {
      return res.json({
        success: true,
        message: "Email sent successfully",
      });
    })
    .catch((error) => {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    });
};

export const verifyPassword = async (req: Request, res: Response) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({
      success: false,
      message: "Please provide a password",
    });
  }
  console.log(req.user?.email);
  const find = req.user?.email ? await findUser(req.user?.email) : null;

  let isMatch;

  if (!find) {
    return res.json({
      success: false,
      message: "User not found",
    });
  }

  isMatch = find.user && (await comparePassword(password, find.user.password));

  if (isMatch) {
    return res.json({
      success: true,
      message: "Password verified successfully",
    });
  } else {
    return res.status(400).json({
      success: false,
      message: "Password does not match",
    });
  }
};
