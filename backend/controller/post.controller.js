import mongoose from "mongoose";

import { handleError } from "../lib/error.js";
import cloudinary from "../lib/cloudinary.js";

import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });
    if (!posts) {
      return res.status(404).json({ error: "Posts not found" });
    }

    return res.status(200).json(posts);
  } catch (error) {
    handleError(res, "getAllPosts", error);
  }
};

export const getLikedPost = async (req, res) => {
  try {
    const username = req.params.username;
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const likesPost = await Post.find({ _id: { $in: user.likedPost } })
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });

    return res.status(200).json(likesPost);
  } catch (error) {
    handleError(res, "getLikedPost", error);
  }
};

export const getFollowingPosts = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const followingPosts = await Post.find({ user: { $in: user.following } })
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });

    if (!followingPosts) {
      return res.status(404).json({ error: "Posts not found" });
    }

    return res.status(200).json(followingPosts);
  } catch (error) {
    handleError(res, "getFollowingPosts", error);
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const username = req.params.username;
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userId = user._id;

    const userPosts = await Post.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });

    if (!userPosts) {
      return res.status(404).json({ error: "Posts not found" });
    }

    return res.status(200).json(userPosts);
  } catch (error) {
    handleError(res, "getUserPosts", error);
  }
};

export const getBookmarkPosts = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const bookmarkPosts = await Post.find({ bookmarks: { $in: user._id } })
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });

    return res.status(200).json(bookmarkPosts);
  } catch (error) {
    handleError(res, "getBookmarkPosts", error);
  }
};

export const createPosts = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { text, image } = req.body;

    if (!text && !image) {
      return res.status(400).json({ error: "Post must have text or image" });
    }

    let imageUrl;
    if (image) {
      const response = await cloudinary.uploader.upload(image);
      imageUrl = response.secure_url;
    }

    const newPost = await Post.create({
      user: user._id,
      text,
      image: imageUrl,
    });
    if (!newPost) {
      return res.status(400).json({ error: "Failed in createPost" });
    }

    return res.status(200).json(newPost);
  } catch (error) {
    handleError(res, "createPost", error);
  }
};

export const commentOnPosts = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const postId = req.params.id;
    if (!postId) {
      return res.status(400).json({ error: "Post ID is required" });
    }

    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const commentData = { text, user: user._id };

    post.comments.push(commentData);
    await post.save();

    // populate the last inserted comment with user details
    const updatedPost = await post.populate({
      path: "comments.user",
      select: "fullName username profileImg",
    });

    // return just the last added comment
    const populatedComment =
      updatedPost.comments[updatedPost.comments.length - 1];

    return res.status(200).json({ newComment: populatedComment });
  } catch (error) {
    handleError(res, "commentsOnPosts", error);
  }
};

export const likeUnlikePost = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const userId = user._id;

    const postId = req.params.id;
    if (!postId) {
      return res.status(400).json({ error: "Post ID is required" });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    const post = await Post.findById(postId).session(session);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const isUserLiked = post.likes.find((like) => like.equals(userId));
    if (isUserLiked) {
      post.likes = post.likes.filter((like) => !like.equals(userId));
      user.likedPost = user.likedPost.filter((post) => !post.equals(postId));
    } else {
      post.likes.push(userId);
      user.likedPost.push(postId);

      const receiverId = post.user;
      const [newNotification] = await Notification.create(
        [
          {
            from: userId,
            to: receiverId,
            type: "like",
          },
        ],
        { session }
      );

      if (!newNotification) {
        return res.status(400).json({ error: "Failed to create notification" });
      }
    }

    await post.save({ session });
    await user.save({ session });

    await session.commitTransaction();

    return res.status(200).json(post.likes);
  } catch (error) {
    await session.abortTransaction();
    handleError(res, "likeUnlikePost controller", error);
  } finally {
    await session.endSession();
  }
};

export const deletePost = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const postId = req.params.id;
    if (!postId) {
      return res.status(400).json({ error: "Post ID is required" });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    await Post.findByIdAndDelete(postId).session(session);

    user.likePost = user.likePost.filter((like) => !like.equals(postId));

    await user.save({ session });

    await session.commitTransaction();

    return res.status(200).json({ message: "Deleted post successfully" });
  } catch (error) {
    await session.abortTransaction();
    handleError(res, "deletePost", error);
  } finally {
    await session.endSession();
  }
};

export const toggleBookmark = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const postId = req.params.id;
    if (!postId) {
      return res.status(400).json({ error: "Post ID is required." });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const isUserAlreadyBookmark = post.bookmarks.includes(user._id);
    if (isUserAlreadyBookmark) {
      post.bookmarks = post.bookmarks.filter(
        (bookmark) => bookmark.toString() !== user._id.toString()
      );
    } else {
      post.bookmarks.push(user._id);
    }

    await post.save();

    return res.status(200).json(post.bookmarks);
  } catch (error) {
    handleError(res, "toggleBookmark", error);
  }
};
