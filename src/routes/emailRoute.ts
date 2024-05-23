// handle routing for the email controller
//
// Path: src/routes/emailRoute.ts
import express from "express";
import { subscribe, sendMail, getEmails } from "../controllers/emailController";

const router = express.Router();

router.post("/subscribe", subscribe);
router.post("/send", sendMail);
router.get("/", getEmails);

export default router;
