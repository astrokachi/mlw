import { Router } from "express";
const router = Router();
import {
  clientLogin,
  clientSignUp,
  deleteAllClients,
  deleteAllTherapists,
  forgotPassword,
  resetPassword,
  therapistLogin,
  therapistSignUp,
} from "../controllers/authController";
import { authenticate } from "../middlewares/authentication";

router.post("/client/signup", clientSignUp);
router.post("/client/login", clientLogin);
router.delete("/client/del", deleteAllClients);

router.post("/therapist/signup", therapistSignUp);
router.post("/therapist/login", therapistLogin);
router.delete("/therapist/del", deleteAllTherapists);

router.post("/forgotpassword", forgotPassword);
router.post("/resetpassword", authenticate, resetPassword);

export default router;
