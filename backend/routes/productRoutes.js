const express = require("express");
const router = express.Router();
const { verifyToken, checkAdmin } = require("../middlewares/authMiddleware");
const productController = require("../controllers/productController");

// public: get products
router.get("/", productController.fetchAllProducts);
router.get("/:productId", productController.fetchSinglePro);

// admin only: create, update, delete
router.post("/", verifyToken, checkAdmin, productController.createProduct);
router.put(
  "/:productId",
  verifyToken,
  checkAdmin,
  productController.updateProduct
);
router.delete(
  "/:productId",
  verifyToken,
  checkAdmin,
  productController.deleteProduct
);

module.exports = router;
