import { prisma } from "../db/server";
import "express-async-errors";
import { Request, Response } from "express";
import { ClientProfile, TherapistProfile } from "@prisma/client";

export const createClientProfile = async (req: Request, res: Response) => {
  const body: ClientProfile = req.body;
  console.log(req.user);
  const data = await prisma.clientProfile.create({
    data: {
      ...body,
      clientId: req.user?.id,
    },
  });

  return res.json({
    success: true,
    message: "profile created successfully",
    data,
  });
};

export const updateClientProfile = async (req: Request, res: Response) => {
  const body: ClientProfile = req.body;
  const data = await prisma.clientProfile.update({
    where: {
      clientId: req.user?.id,
    },
    data: {
      ...body,
    },
  });

  return res.json({
    success: true,
    message: "profile updated successfully",
    data,
  });
}

export const getClientProfile = async (req: Request, res: Response) => {
  const data = await prisma.clientProfile.findFirst({
    where: {
      clientId: req.user?.id,
    },
  });

  return res.json({
    success: true,
    message: "profile retrieved successfully",
    data,
  });
}

export const delClientProfile = async (req: Request, res: Response) => {
  const data = await prisma.clientProfile.delete({
    where: {
      clientId: req.user?.id,
    },
  });

  return res.json({
    success: true,
    message: "profile deleted successfully",
    data,
  });

}


export const delClientProfiles = async (req: Request, res: Response) => {
  const data = await prisma.clientProfile.deleteMany();

  return res.json({
    success: true,
    message: "profile deleted successfully",
    data,
  });
};

/////////////////////////////////////////////////////////////////////////////////////

export const createTherapistProfile = async (req: Request, res: Response) => {
  const body: TherapistProfile = req.body;
  const data = await prisma.therapistProfile.create({
    data: {
      ...body,
      therapistId: req.user?.id,
    },
  });

  return res.json({
    success: true,
    message: "profile created successfully",
    data,
  });
};

export const updateTherapistProfile = async (req: Request, res: Response) => {
  const body: TherapistProfile = req.body;
  const data = await prisma.therapistProfile.update({
    where: {
      therapistId: req.user?.id,
    },
    data: {
      ...body,
    },
  });

  return res.json({
    success: true,
    message: "profile updated successfully",
    data,
  });
}

export const getTherapistProfile = async (req: Request, res: Response) => {
  const data = await prisma.therapistProfile.findFirst({
    where: {
      therapistId: req.user?.id,
    },
  });

  return res.json({
    success: true,
    message: "profile retrieved successfully",
    data,
  });
}

export const delTherapistProfile = async (req: Request, res: Response) => {
  const data = await prisma.therapistProfile.delete({
    where: {
      therapistId: req.user?.id,
    },
  });

  return res.json({
    success: true,
    message: "profile deleted successfully",
    data,
  });

}

export const delTherapistProfiles = async (req: Request, res: Response) => {
  const data = await prisma.therapistProfile.deleteMany();

  return res.json({
    success: true,
    message: "profile deleted successfully",
    data,
  });
};

