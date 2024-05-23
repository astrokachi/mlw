import { prisma } from "../db/server";
import { Request, Response } from "express";
import "express-async-errors";
import { comparePassword, hashPassword } from "../utils/encrypt/hashPassword";
import { createJwt } from "../utils/encrypt/jwt";
import {
  Client,
  ClientProfile,
  Therapist,
  TherapistProfile,
} from "@prisma/client";
import { find } from "shelljs";
import { send } from "../utils/email/mail";
import { findUser } from "../utils/helpers/findUsers";

export const clientSignUp = async (req: Request, res: Response) => {
  const { email, firstName, lastName, password }: Client = req.body;
  if (!email || !firstName || !lastName || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields",
    });
  }
  const userExists = await prisma.client.findUnique({
    where: {
      email,
    },
    include: {
      profile: true,
    },
  });

  if (userExists) {
    return res.status(400).json({
      success: false,
      message: "User already exists",
    });
  }
  const hashedPassword = await hashPassword(password);

  const user: Client = await prisma.client.create({
    data: {
      email,
      firstName,
      lastName,
      password: hashedPassword,
    },
  });

  let token: string = "";
  token = createJwt(user.id, user.email);
  res.json({
    success: true,
    message: "User created successfully",
    data: { user, token },
  });
};

export const clientLogin = async (req: Request, res: Response) => {
  const { email, password }: Client = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields",
    });
  }
  const user = await prisma.client.findUnique({
    where: {
      email,
    },
    include: {
      profile: true,
    },
  });
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid credentials",
    });
  }
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    return res.status(400).json({
      success: false,
      message: "Invalid credentials",
    });
  }
  let token: string = "";
  token = createJwt(user.id, user.email);

  res.json({
    success: true,
    message: "User logged in successfully",
    data: { user, token },
  });
};

export const deleteAllClients = async (req: Request, res: Response) => {
  await prisma.client.deleteMany();
  return res.json({
    success: true,
    message: "All clients deleted",
  });
};


///////////////////////////////////////////////////////////////////////////////////////////
export const forgotPassword = async (req: Request, res: Response) => {
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

  const token = createJwt(user.id, user.email);

  // Link will contain token to secure the route
  send({
    email,
    subject: "Password Reset",
    // template: "PasswordReset",
    text: token,
  });

  res.json({
    success: true,
    message: "Email sent successfully",
  });
};

export const resetPassword = async (req: Request, res: Response) => {
  const email = req.user?.email;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({
      success: false,
      message: "Please provide a new password",
    });
  }

  const hashedPassword = await hashPassword(password);

  if (req.user?.type === "client") {
    await prisma.client.update({
      where: {
        email,
      },
      data: {
        password: hashedPassword,
      },
    });

    return res.json({
      success: true,
      message: "Password reset successfully",
    });
  } else {
    await prisma.therapist.update({
      where: {
        email,
      },
      data: {
        password: hashedPassword,
      },
    });

    return res.json({
      success: true,
      message: "Password reset successfully",
    });
  }
};

//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
export const therapistSignUp = async (req: Request, res: Response) => {
  const { email, firstName, lastName, password }: Therapist = req.body;
  if (!email || !firstName || !lastName || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields",
    });
  }
  const userExists = await prisma.therapist.findUnique({
    where: {
      email,
    },
    include: {
      profile: true,
    },
  });

  if (userExists) {
    return res.status(400).json({
      success: false,
      message: "User already exists",
    });
  }
  const hashedPassword = await hashPassword(password);

  const user: Therapist = await prisma.therapist.create({
    data: {
      email,
      firstName,
      lastName,
      password: hashedPassword,
    },
  });

  let token: string = "";
  token = createJwt(user.id, user.email);
  res.json({
    success: true,
    message: "User created successfully",
    data: { user, token },
  });
};

export const therapistLogin = async (req: Request, res: Response) => {
  const { email, password }: Therapist = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields",
    });
  }
  const user = await prisma.therapist.findUnique({
    where: {
      email,
    },
    include: {
      profile: true,
    },
  });
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid credentials",
    });
  }
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    return res.status(400).json({
      success: false,
      message: "Invalid credentials",
    });
  }
  let token: string = "";
  token = createJwt(user.id, user.email);

  res.json({
    success: true,
    message: "User logged in successfully",
    data: { user, token },
  });
};

export const deleteAllTherapists = async (req: Request, res: Response) => {
  await prisma.therapist.deleteMany();
  return res.json({
    success: true,
    message: "All therapists deleted",
  });
};
