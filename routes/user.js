import express from "express";
import { signup, login } from "../controllers/auth.js";
import {
  getallUsers,
  updateProfile,
  updateSubscription,
  updatePayment,
  currentUser,
  getUser,
} from "../controllers/users.js";
import auth from "../middlewares/auth.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.get("/getAllUser", getallUsers);
router.patch("/update/:id", updateProfile);
router.patch("/subscribe", updateSubscription);
router.post("/payment", updatePayment);
router.patch("/currentUser/:id", currentUser);
router.get("/getUser/:id", getUser);
export default router;
