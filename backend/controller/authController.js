const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel.js");
const mongoose = require("mongoose");
const crypto = require("crypto");

const expiryDate = new Date();
const date1 = expiryDate.setTime(expiryDate.getTime() + 12);

//register user
const registerUser = asyncHandler(async (req, res) => {
  const { email, password, role } = req?.body;
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      throw new Error("User Already exists! Please Login.");
    }
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      email: email,
      password: encryptedPassword,
      role: role || "user",
    });

    //set cookie token
    const data = {
      id: newUser?._id,
    };
    const token = jwt.sign(data, process.env.APP_JWT_SECRET_KEY, {
      expiresIn: "12h",
    });

    const createdUser = newUser;
    createdUser.password = undefined;

    res
      .status(201)
      .cookie("token", token, { expires: new Date(Date.now() + date1) })
      .json({ success: true, token, createdUser });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
});

//login user
const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req?.body;

  try {
    const emailExists = await User.findOne({ email: email }).populate("saved");

    if (!emailExists) {
      throw new Error("User Does not exist! Please Register.");
    }

    const user = await User.findOne({ email: email });
    const comparePassword = await bcrypt.compare(password, user?.password);

    if (!comparePassword) {
      throw new Error("Password Dosent Match!");
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
        sameSite: "None",
        secure: true,
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
  const { password } = req?.body;
  const id = req?.user?._id;

  try {
    const user = await User.findById(id);

    const comparePassword = await bcrypt.compare(password, user?.password);
    if (comparePassword) {
      throw new Error("Please enter a different password from your own.");
    } else {
      const salt = await bcrypt.genSalt(10);
      const encryptedPassword = await bcrypt.hash(password, salt);

      user.password = encryptedPassword;

      const updatedUser1 = await user.save();

      const updatedUser = await User.findById(id).select("-password");

      res.status(201).json({
        updatedUser,
      });
    }
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
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

module.exports = {
  registerUser,
  userLogin,
  userPasswordUpdate,
  saveProduct,
  unSaveProduct,
};
