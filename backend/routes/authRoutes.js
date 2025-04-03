const express = require("express");
const {
  registerUser,
  userLogin,
  userPasswordUpdate,
  saveProduct,
  unSaveProduct,
} = require("../controller/authController.js");
const { userAuth } = require("../middleware/authMiddleware.js");

const route = express.Router();

route.post("/register", registerUser);

route.post("/login", userLogin);

route.put("/updatePassword", userAuth, userPasswordUpdate);

route.put("/saveProduct", userAuth, saveProduct);

route.put("/unSaveProduct", userAuth, unSaveProduct);

module.exports = route;
