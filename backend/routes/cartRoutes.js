const express = require("express");
const router = express.Router();
const { userAuth } = require("../middleware/authMiddleware");
const cartController = require("../controller/cartController");

// must be logged in to manage cart
router.get("/", userAuth, cartController.getCart);
router.post("/", userAuth, cartController.addToCart);
router.put("/update-item", userAuth, cartController.updateCartItem);
router.delete(
  "/remove-item/:cartItemId",
  userAuth,
  cartController.removeCartItem
);
router.post("/apply-promo", userAuth, cartController.applyPromo);

module.exports = router;
