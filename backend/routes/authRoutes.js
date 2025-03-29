const express = require("express");
const {
  registerUser,
  userLogin,
  userDetails,
  fetchAllUsers,
  userPasswordUpdate,
  updateUserField,
  saveProduct,
  unSaveProduct,
} = require("../../controllers/authController.js");
const userAuth = require("../../middleware/authMiddleware.js");

const route = express.Router();

route.post("/register", resgisterUser);
route.post("/login", userLogin);
route.get("/userDetails", userAuth, userDetails);
route.get("/allUsers", fetchAllUsers);
route.put("/updatePassword", userAuth, userPasswordUpdate);
route.put("/updateUser", userAuth, updateUserField);
route.put("/saveProduct", userAuth, saveProduct);
route.put("/unSveProduct", userAuth, unSaveProduct);
module.exports = route;
