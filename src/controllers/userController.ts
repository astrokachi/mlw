import { cli } from "winston/lib/winston/config";
import { prisma } from "../db/server";
import { Request, Response } from "express";

export const getClientByEmail = (req: Request, res: Response) => {
  const { email } = req.params;
  prisma.client
    .findUnique({
      where: {
        email,
      },
      include: {
        profile: true,
      },
    })
    .then((data) => {
      if (!data) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
      res.json({
        success: true,
        message: "User found",
        data,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: err.message || "Internal server error",
      });
    });
};


export const getAllClients = (req: Request, res: Response) => {
  prisma.client
    .findMany({
      include: {
        profile: true,
      },
    })
    .then((data) => {
      res.json({
        success: true,
        message: "Clients found",
        data,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: err.message|| "Internal server error",
      });
    });
}



//////////////////////////////////////////////////////////////////////////////
export const getAllTherapists = (req: Request, res: Response) => {
  prisma.therapist
    .findMany({
      include: {
        profile: true,
      },
    })
    .then((data) => {
      res.json({
        success: true,
        message: "Therapists found",
        data,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: err.message || "Internal server error",
      });
    });
}

export const getTherapistByEmail = (req: Request, res: Response) => {
  const { email } = req.params;
  prisma.therapist
    .findUnique({
      where: {
        email,
      },
      include: {
        profile: true,
      },
    })
    .then((data) => {
      if (!data) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
      res.json({
        success: true,
        message: "User found",
        data,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    });
};
