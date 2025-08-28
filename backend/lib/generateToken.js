import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.ACCESSTOKEN_SECRET_KEY, {
    expiresIn: "7d",
  });

  res.cookie("accessToken", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "None",
    secure: process.env.NODE_ENV === "production", //send only on https
  });
};
