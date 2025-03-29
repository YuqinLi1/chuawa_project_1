const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddleware");
const cartController = require("../controllers/cartController");

// must be logged in to manage cart
router.get("/", verifyToken, cartController.getCart);
router.post("/", verifyToken, cartController.addToCart);
router.put("/update-item", verifyToken, cartController.updateCartItem);
router.delete(
  "/remove-item/:cartItemId",
  verifyToken,
  cartController.removeCartItem
);
router.post("/apply-promo", verifyToken, cartController.applyPromo);

module.exports = router;
