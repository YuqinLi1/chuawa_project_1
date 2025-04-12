const express = require("express");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel.js");
const mongoose = require("mongoose");
const expiryDate = new Date();
const date1 = expiryDate.setTime(expiryDate.getTime() + 12);
const nodemailer = require('nodemailer')

//register user
const registerUser = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists, please login.",
      });
    }

    const newUser = await User.create({
      email,
      password,
      role: role || "user",
    });

    const token = jwt.sign({ id: newUser._id }, process.env.APP_JWT_SECRET_KEY, {
      expiresIn: "12h",
    });

    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 12 * 60 * 60 * 1000,
      })
      .json({ success: true, token, user: { email: newUser.email, role: newUser.role } });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

//login user
const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req?.body;

  try {
    const emailExists = await User.findOne({ email: email });
    if (!emailExists) {
      throw new Error("User Does not exist! Please Register.");
    }

    const user = emailExists;
    console.log(emailExists);
    console.log(password +" "+user.password);

    if (password !== user?.password) {
      throw new Error("Password doesn't match!");
    }

    const data = {
      id: user?._id,
    };

    //sign the cookie token
    const token = jwt.sign(data, process.env.APP_JWT_SECRET_KEY, {
      expiresIn: "12h",
    });

    user.password = undefined;

    res
      .status(200)
      .cookie("token", token, {
        expires: new Date(Date.now() + date1),
      })
      .json({
        success: true,
        token,
        user,
      });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
});

//user change password controller/logic
const userPasswordUpdate = asyncHandler(async (req, res) => {
  const { userId, email, newPassword } = req.body;

  if (!userId || !email || !newPassword) {
    return res.status(400).json({ message: "Missing fields." });
  }

  const user = await User.findById(userId);

  if (!user || user.email !== email) {
    return res.status(400).json({ message: "Invalid user ID or email mismatch." });
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({ message: "Password updated successfully." });
});

//save a product logic
const saveProduct = asyncHandler(async (req, res) => {
  const { productId } = req?.body;
  const id = req?.user?._id;

  const targetUser = await User.findById(id);
  const savedLog = targetUser?.saved?.map((prod) => {
    return prod?._id;
  });

  const isSaved = targetUser?.saved?.includes(productId);
  if (isSaved) throw new Error("Already Saved this Product!");

  try {
    const user = await User.findByIdAndUpdate(
      id,
      {
        $push: { saved: productId },
      },
      { new: true }
    );

    const updatedUser = await User.findById(id).populate("saved");

    //send the status code and user
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
});

//unsave product or dislike logic
const unSaveProduct = asyncHandler(async (req, res) => {
  const { productId } = req?.body;
  const id = req?.user?._id;

  const targetUser = await User.findById(id);
  const savedLog = targetUser?.saved?.map((prod) => {
    return prod?._id;
  });

  const isSaved = targetUser?.saved?.includes(productId);

  try {
    if (isSaved) {
      const user = await User.findByIdAndUpdate(
        id,
        {
          $pull: { saved: productId },
        },
        { new: true }
      );

      const updatedUser = await User.findById(id).populate("saved");

      res.status(200).json(updatedUser);
    }
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
});

const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.status(200).json({ user });
});

const logoutUser = asyncHandler(async (req, res) => {
  res
    .clearCookie("token", { httpOnly: true, sameSite: "None", secure: true })
    .status(200)
    .json({ message: "Logged out successfully" });
});

module.exports = {
  registerUser,
  userLogin,
  userPasswordUpdate,
  saveProduct,
  unSaveProduct,
  getMe,
  logoutUser,
};