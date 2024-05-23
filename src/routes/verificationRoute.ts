import { authenticate } from "../middlewares/authentication";
import {
  verifyEmail,
  verifyPassword,
} from "../controllers/verificationController";
import express from "express";
const router = express.Router();

router.post("/email", verifyEmail);
router.post("/password", authenticate, verifyPassword);

export default router;
