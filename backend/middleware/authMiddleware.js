const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const asyncHandler = require("express-async-handler");

const userAuth = asyncHandler(async (req, res, next) => {
  let token;

  // Try to get token from cookie (requires cookie-parser middleware)
  if (req.cookies?.token) {
    token = req.cookies.token;
  }

  // Fallback to parsing manually from header
  if (!token && req.headers?.cookie?.includes("token=")) {
    const match = req.headers.cookie.match(/token=([^;]*)/);
    if (match && match[1]) token = match[1];
  }

  // Fallback to token in header (if manually set)
  if (!token) {
    token = req.header("token");
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token, authorization denied",
    });
  }

  try {
    // Decode token
    const decoded = jwt.verify(token, process.env.APP_JWT_SECRET_KEY);

    // Look up user
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Attach full user to req for access in routes
    req.user = user;
    next();
  } catch (err) {
    console.error("Authentication error:", err.message);
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
});

const checkAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};

module.exports = { userAuth, checkAdmin };