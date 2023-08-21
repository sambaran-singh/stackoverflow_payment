import express from "express";
import { searchUser } from "../controllers/UserController.js";

const router = express.Router();

router.get("/", searchUser);
export default router;
