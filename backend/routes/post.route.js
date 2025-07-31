import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  commentOnPosts,
  createPosts,
  deletePost,
  getAllPosts,
  getFollowingPosts,
  getLikedPost,
  getUserPosts,
  likeUnlikePost,
} from "../controller/post.controller.js";

const router = express.Router();

router.get("/all", protectRoute, getAllPosts);
router.get("/liked-posts", protectRoute, getLikedPost);
router.get("/following-posts", protectRoute, getFollowingPosts);
router.get("/user-posts", protectRoute, getUserPosts);

router.post("/create", protectRoute, createPosts);
router.post("/comments/:id", protectRoute, commentOnPosts);
router.post("/like-unlike/:id", protectRoute, likeUnlikePost);

router.delete("/:id", protectRoute, deletePost);

export default router;
