import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/user.js";
import questionRoutes from "./routes/Questions.js";
import answerRoutes from "./routes/Answers.js";
import PostRoutes from "./routes/posts.js";
import UploadRoute from "./routes/upload.js";
import userSocioRoutes from "./routes/usersocio.js";
import SearchRoutes from "./routes/search.js";
import OTPRoutes from "./routes/otp.js";
import BotRoutes from "./routes/chatbot.js";
const app = express();
app.use(express.json({ limit: "30mb", extebded: true }));
app.use(express.urlencoded({ limitt: "30mb", extended: true }));
app.use(cors());
dotenv.config();

app.use(express.static("public"));
app.use("/images", express.static("images"));

app.get("/", (req, res) => {
  res.send("This is a StackOverflow Clone API");
});

app.use("/user", userRoutes);
app.use("/questions", questionRoutes);
app.use("/answer", answerRoutes);
app.use("/post", PostRoutes);
app.use("/upload", UploadRoute);
app.use("/usersocio", userSocioRoutes);
app.use("/search", SearchRoutes);
app.use("/otp", OTPRoutes);
app.use("/chatbot", BotRoutes);
const PORT = process.env.PORT || 5000;

const Connection_URL = process.env.CONNECTION_URL;

mongoose
  .connect(Connection_URL, { useNewURLParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    })
  )
  .catch((err) => {
    console.log(err.message);
  });
