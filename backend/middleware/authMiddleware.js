const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const asyncHandler = require("express-async-handler");

const userAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (req?.headers?.cookie && req.headers.cookie.includes("token=")) {
    const tokenMatch = req.headers.cookie.match(/token=([^;]*)/);
    if (tokenMatch && tokenMatch[1]) {
      token = tokenMatch[1];
    }
  }

  if (!token) {
    token = req?.header("token") || (req?.cookie && req.cookie.token);
  }

  try {
    if (!token) {
      return res.status(401).json({
        message: "No entry without authentication!",
      });
    }

    const user = jwt.verify(token, process.env.APP_JWT_SECRET_KEY);

    const userFound = await User.findById(user.id).select("-password");

    if (!userFound) {
      return res.status(401).json({
        message: "User no longer exists",
      });
    }

    req.user = userFound;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({
      message: "Error at Authentication",
      error: error.message,
    });
  }
});

const checkAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};
module.exports = { userAuth, checkAdmin };
