import bcrypt from "bcryptjs";

import { signInValidation, signUpValidation } from "../lib/validation.js";
import { generateTokenAndSetCookie } from "../lib/generateToken.js";

import User from "../models/user.model.js";

export const signUp = async (req, res) => {
  try {
    const data = req.body;
    const result = signUpValidation(data);
    if (!result.valid) {
      return res.status(400).json({ error: result.error });
    }

    const { username, email, fullName, password } = data;

    const [existingUsername, existingEmail] = await Promise.all([
      User.findOne({ username }),
      User.findOne({ email }),
    ]);

    if (existingUsername) {
      return res.status(400).json({ error: "Username already exists" });
    }

    if (existingEmail) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username,
      fullName,
      email,
      password: hashedPassword,
    });
    if (!newUser) {
      return res.status(400).json({ error: "Signup failed" });
    }

    generateTokenAndSetCookie(newUser._id, res);

    const userToReturn = newUser.toObject();
    delete userToReturn.password;

    return res.status(200).json(userToReturn);
  } catch (error) {
    handleError(res, "signUp controller", error);
  }
};

export const signIn = async (req, res) => {
  try {
    const data = req.body;

    const result = signInValidation(data);
    if (!result.valid) {
      return res.status(400).json({ error: result.error });
    }

    const { username, password } = data;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: "Invalid username" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: "Invalid password" });
    }

    generateTokenAndSetCookie();

    const userToReturn = user.toObject();
    delete userToReturn.password;

    return res.status(200).json(userToReturn);
  } catch (error) {
    handleError(res, "signIn controller", error);
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("accessToken", "", { maxAge: 0 });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    handleError(res, "logout controller", error);
  }
};

export const checkAuth = (req, res) => {
  try {
    const user = req.user;

    return res.status(200).json(user);
  } catch (error) {
    handleError(res, "checkAuth controller", error);
  }
};
