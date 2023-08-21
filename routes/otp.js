import express from "express";

const router = express.Router();
import { Otpsend, OTPverification } from "../controllers/Otp.js";
router.post("/sendOTP", Otpsend);
router.post("/verifyOTP", OTPverification);

export default router;
