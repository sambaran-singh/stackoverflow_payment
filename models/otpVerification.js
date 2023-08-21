import mongoose from "mongoose";

const OTPVerificationSchema = mongoose.Schema({
  userId: { type: String },
  OTP: { type: String },
  createdAt: Date,
  expiresAt: Date,
});

export default mongoose.model("OTP", OTPVerificationSchema);
