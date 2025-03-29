const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema(
  {
    email: {
      required: [true, "Please enter your E-Mail!"],
      type: String,
      unique: true,
    },
    password: {
      required: [true, "Please enter your Password!"],
      type: String,
      minLength: [8, "Password must be at least 8 characters long!"],
    },

    role: {
      type: String,
      enum: ["user", "Admin"],
      default: "user",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

// account verification Logic

UserSchema.methods.createAccountVerificationToken = async function () {
  //create random bytes
  const verificationToken = crypto.randomBytes(32).toString("hex");

  this.accountVerificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  this.accountVerificationTokenExpires = Date.now() + 30 * 60 * 1000; //10mins time

  return verificationToken;
};

// password reset Logic
UserSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 30 * 60 * 1000; //10mins time to click

  return resetToken;
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
