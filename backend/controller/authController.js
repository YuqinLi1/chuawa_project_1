const express = require("express");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel.js");
const mongoose = require("mongoose");
const expiryDate = new Date();
const date1 = expiryDate.setTime(expiryDate.getTime() + 12);
const nodemailer = require('nodemailer')

function generateTempPassword() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length: 10 }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join('');
}

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
      password, // save plain text directly
      role: role || "user",
    });

    const token = jwt.sign({ id: newUser._id }, process.env.APP_JWT_SECRET_KEY, {
      expiresIn: "12h",
    });

    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
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
  const { email } = req.body;

  // 1. Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'No user found with this email.' });
  }

  // 2. Generate temp password and update user
  const tempPassword = generateTempPassword();
  user.password = tempPassword; // plain text as per your setup
  await user.save();

  // 3. Send email with nodemailer
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'chenguanghe1992@gmail.com',
        pass: 'porsche911GT3RS$',
      },
    });

    const mailOptions = {
      from: 'hechengu@usc.edu',
      to: email,
      subject: 'Update Password',
      text: `Your temporary password is: ${tempPassword}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ email, tempPassword });
  } catch (error) {
    console.error('Email send failed:', error);
    res.status(500).json({ message: 'Failed to send email.' });
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