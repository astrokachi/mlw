// /src/controller/emailController.ts
import "express-async-errors";
import { prisma } from "../db/server";
import { Request, Response } from "express";
import { send } from "../utils/email/mail";

export const subscribe = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }

    const existingUser = await prisma.subscribtion.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    await prisma.subscribtion.create({ data: { email } });
    console.log("email stored");

    send({
      email,
      subject:
        "Welcome to Mindlift Wellness: Your Mental Health Changes Begins Here!",
      template: "NewsletterConfirmation",
    })
      .then((resp) => {
        console.log("mail sent");
        return res
          .status(201)
          .json({ success: true, message: "User subscribed successfully" });
      })
      .catch(async (error) => {
        console.log("error", error);
        await prisma.subscribtion.delete({ where: { email } });
        console.log("deleted");
        return res.status(500).json({ success: false, message: error });
      });
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
};

export const sendMail = async (req: Request, res: Response) => {
  try {
    const { email, subject, text } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await prisma.subscribtion.findUnique({
      where: { email },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await send({ email, subject, text });
    console.log("mail sent");

    return res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

//get emails
export const getEmails = async (req: Request, res: Response) => {
  try {
    const emails = await prisma.subscribtion.findMany();
    return res
      .status(200)
      .json({ success: true, message: "fetched successfully", data: emails });
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
};
