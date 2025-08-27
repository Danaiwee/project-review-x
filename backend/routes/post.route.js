import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  commentOnPosts,
  createPosts,
  deletePost,
  getAllPosts,
  getBookmarkPosts,
  getFollowingPosts,
  getLikedPost,
  getRetweetPosts,
  getUserPosts,
  likeUnlikePost,
  retweetPost,
  toggleBookmark,
} from "../controller/post.controller.js";

const router = express.Router();

router.get("/all", protectRoute, getAllPosts);
router.get("/bookmarks", protectRoute, getBookmarkPosts);
router.get("/following-posts", protectRoute, getFollowingPosts);
router.get("/liked-posts/:username", protectRoute, getLikedPost);
router.get("/user-posts/:username", protectRoute, getUserPosts);
router.get("/retweets/:username", protectRoute, getRetweetPosts);

router.post("/create", protectRoute, createPosts);
router.post("/comments/:id", protectRoute, commentOnPosts);
router.post("/like-unlike/:id", protectRoute, likeUnlikePost);
router.post("/bookmark/:id", protectRoute, toggleBookmark);
router.post("/retweet/:id", protectRoute, retweetPost);

router.delete("/:id", protectRoute, deletePost);

export default router;
