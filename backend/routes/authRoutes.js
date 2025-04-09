const express = require("express");
const {
  registerUser,
  userLogin,
  userPasswordUpdate,
  saveProduct,
  unSaveProduct,
} = require("../controller/authController.js");
const { userAuth } = require("../middleware/authMiddleware.js");
const { getMe } = require("../controller/authController");
const { logoutUser } = require("../controller/authController");

const route = express.Router();

route.post("/register", registerUser);

route.post("/login", userLogin);

route.put("/updatePassword", userPasswordUpdate);

route.put("/saveProduct", userAuth, saveProduct);

route.put("/unSaveProduct", userAuth, unSaveProduct);

route.get("/me", userAuth, getMe);

route.post("/logout", logoutUser);

module.exports = route;
