import express from "express";

interface UserInput {
  id: number;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: Record<string, any>;
    }
  }
}

declare module "express-session" {
  interface SessionData {
    user: UserInput;
  }
}
