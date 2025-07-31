import mongoose from "mongoose";
import cloudinary from "../lib/cloudinary.js";
import bcrypt from "bcryptjs";

import { handleError } from "../lib/error.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

export const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    handleError(res, "getUserProfile", error);
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userFollowing = user.following;

    const suggestedUsers = await User.aggregate([
      {
        $match: {
          _id: { $nin: [...userFollowing, user._id] },
        },
      },
      {
        $sample: { size: 5 },
      },
      {
        $project: { password: 0 },
      },
    ]);
    if (!suggestedUsers) {
      return res.status(404).json({ error: "Suggested User not found" });
    }

    return res.status(200).json(suggestedUsers);
  } catch (error) {
    handleError(res, "getSuggestedUser", error);
  }
};

export const followUnfollow = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const followId = req.params.id;
    if (!followId) {
      return res.status(400).json({ error: "Follow ID is required" });
    }

    if (user._id.equals(followId)) {
      return res.status(400).json({ error: "You cannot follow yourself" });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    const followUser = await User.findById(followId).session(session);
    if (!followUser) {
      await session.abortTransaction();
      return res.status(404).json({ error: "Follow User not found" });
    }

    const isFollowing = user.following.some((id) => id.equals(followId));

    if (isFollowing) {
      user.following = user.following.filter((id) => !id.equals(followId));
      followUser.followers = followUser.followers.filter(
        (id) => !id.equals(user._id)
      );
    } else {
      user.following.push(followId);
      followUser.followers.push(user._id);

      await Notification.create(
        [
          {
            form: user._id,
            to: followId,
            type: "follow",
          },
        ],
        { session }
      );
    }

    await user.save({ session });
    await followUser.save({ session });

    await session.commitTransaction();

    return res.status(200).json(user);
  } catch (error) {
    await session.abortTransaction();
    handleError(res, "followUnFollow", error);
  } finally {
    await session.endSession();
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { fullName, currentPassword, newPassword, bio, link } = req.body;
    let { profileImg, coverImg } = req.body;

    if (
      (currentPassword && !newPassword) ||
      (newPassword && !currentPassword)
    ) {
      return res.status(400).json({
        error: "Please provide both new password and current password",
      });
    }

    if (currentPassword === newPassword) {
      return res
        .status(400)
        .json({ error: "You cannot use the same password" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
    }

    const user = await User.findById(userId);

    const isValidCurrentPassword = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isValidCurrentPassword) {
      return res.status(400).json({ error: "Current password is not correct" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    if (profileImg) {
      if (user.profileImg) {
        await cloudinary.uploader.destroy(
          user.profileImg.split("/").pop().split(".")[0]
        );
      }
      const uploadResponse = await cloudinary.uploader.upload(profileImg);
      profileImg = uploadResponse.secure_url;
    }

    if (coverImg) {
      if (user.coverImg) {
        await cloudinary.uploader.destroy(
          user.coverImg.split("/").pop().split(".")[0]
        );
      }

      const uploadResponse = await cloudinary.uploader.upload(coverImg);
      coverImg = uploadResponse.secure_url;
    }

    user.fullName = fullName || user.fullName;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;
    user.password = hashedNewPassword;

    await user.save();

    return res.status(200).json(user);
  } catch (error) {
    handleError(res, "updateUser", error);
  }
};
