import express from "express";
import {
  createPost,
  deletePost,
  getPost,
  getTimelinePost,
  likePost,
  updatePost,
} from "../controllers/PostController.js";

const router = express.Router();

router.post("/createPost", createPost);
router.get("/:id", getPost);
router.patch("/:id", updatePost);
router.post("/delete/:id", deletePost);
router.patch("/like/:id", likePost);
router.get("/:id/timeline", getTimelinePost);
router.patch("/:id/like", likePost);
export default router;
