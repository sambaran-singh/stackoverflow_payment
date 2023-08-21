import express from "express";
import {
  deleteUser,
  followUser,
  getUser,
  unfollowUser,
  updateUser,
  getAllUsers,
  searchUser,
} from "../controllers/UserController.js";

const router = express.Router();

router.get("/:id", getUser);
router.get("/", getAllUsers);
router.patch("/update/:id", updateUser);
router.post("/delete/:id", deleteUser);
router.patch("/:id/follow", followUser);
router.patch("/:id/unfollow", unfollowUser);

export default router;
