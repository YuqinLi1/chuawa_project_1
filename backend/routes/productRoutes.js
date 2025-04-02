const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const { verifyToken, checkAdmin } = require("../middlewares/authMiddleware");
const productController = require("../controllers/productController");

// public: get products
router.get("/", productController.fetchAllProducts);
router.get("/:productId", productController.fetchSinglePro);

// admin only: create, update, delete
router.post(
  "/",
  verifyToken,
  checkAdmin,
  upload.single("image"),
  productController.createProduct
);
router.put(
  "/:productId",
  verifyToken,
  checkAdmin,
  upload.single("image"),
  productController.updateProduct
);
router.delete(
  "/:productId",
  verifyToken,
  checkAdmin,
  productController.deleteProduct
);

module.exports = router;
