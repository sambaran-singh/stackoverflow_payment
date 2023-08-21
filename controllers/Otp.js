import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import OTPmodel from "../models/otpVerification.js";
import users from "../models/auth.js";
import jwt from "jsonwebtoken";

export const Otpsend = async (req, res) => {
  const { userId, email } = req.body;
  await sendOTP({ userId, email }, res);
  try {
    // Additional logic
  } catch (error) {
    // Error handling
  }
};

const sendOTP = async ({ userId, email }, res) => {
  try {
    const otp = `${1000 + Math.floor(Math.random() * 9000)}`;

    const mail = {
      from: "stackoverflow685@gmail.com",
      to: email,
      subject: "Verify Your Email",
      html: `<p>Enter <b>${otp}</b> in the site to verify your email address and ask Questions to chat bot...</p>
      <p>This code <b>Expires in 1hr </b>. </p>`,
    };

    const salt = 10;
    const hashOTP = await bcrypt.hash(otp, salt);

    await OTPmodel.create({
      userId: userId,
      OTP: hashOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    });

    // await OTPmodel.save();
    console.log(mail);
    await transpoter.sendMail(mail);

    res.json({
      status: "pending",
      message: "OTP sent to Your mail..",
      data: {
        userId: userId,
        email: email,
      },
    });
  } catch (error) {
    res.json({
      status: "Failed",
      message: "failed to send otp ",
      error: error.message,
    });
  }
};

const transpoter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "stackoverflow685@gmail.com",
    pass: "gytdwmowhakpddtw",
    // user: "stackoverflow685@gmail.com",
    // pass: "Stackoverflow123",
  },
});

export const OTPverification = async (req, res) => {
  const { userId, otp } = req.body;
  try {
    if (!userId || !otp) {
      return res.status(404).json("Details not sufficient");
    } else {
      const verifyuser = await OTPmodel.find({ userId: userId });
      console.log(verifyuser);
      if (!verifyuser) {
        res.status(404).json("User not Found...");
      } else {
        const expiresAt = verifyuser[0].expiresAt;
        console.log(expiresAt);
        const hashedOTP = verifyuser[0].OTP;
        console.log(hashedOTP);

        if (expiresAt < Date.now()) {
          await OTPmodel.deleteMany({ userId: userId });
          res.status(400).json("OTP is Expired");
        } else {
          const validity = await bcrypt.compare(otp, hashedOTP);
          console.log(validity);
          if (!validity) {
            res.status(400).json("OTP is Wrong ");
          } else {
            await users.updateOne({ _id: userId }, { verified: true });
            const user = await users.findById(userId);
            await OTPmodel.deleteMany({ userId: userId });

            const token = jwt.sign(
              { email: user.email, id: user._id },
              process.env.JWT_SECRET,
              {
                expiresIn: "1h",
              }
            );
            res.status(200).json({
              result: user,
              token,
            });
            console.log("completed");
          }
        }
      }
    }
  } catch (error) {}
};
