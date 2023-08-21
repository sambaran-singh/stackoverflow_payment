import express from "express";
import { ChatBot } from "../controllers/ChatBot.js";
const router = express.Router();

router.post("/question", ChatBot);
export default router;
