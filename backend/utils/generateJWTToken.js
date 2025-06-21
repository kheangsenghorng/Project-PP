// Generate JWT Token Utility
import jwt from "jsonwebtoken";

export const generateJWTToken = (res, userId, role) => {
  const token = jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: "7d", // Token expiry time
  });

  // Set the token in a cookie
  res.cookie("token", token, {
    httpOnly: true, // Cookie can't be accessed by client-side JS
    secure: process.env.NODE_ENV === "production", // Secure cookie for HTTPS in production
    sameSite: "strict", // Cookie will only be set on the same site
    maxAge: 7 * 24 * 60 * 60 * 1000, // Token expiration time (7 days)
  });

  return token;
};
