import {
  createClientProfile,
  createTherapistProfile,
  delClientProfiles,
} from "../controllers/profileController";
import { Router } from "express";
const router = Router();

router.route("/client").post(createClientProfile).delete(delClientProfiles)

/////////////////////////////////////////////////
router.route("/therapist").post(createTherapistProfile);


export default router;