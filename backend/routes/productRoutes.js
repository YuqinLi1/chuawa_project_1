const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const { userAuth, checkAdmin } = require("../middleware/authMiddleware");
const productController = require("../controller/productController");

// public: get products
router.get("/", productController.fetchAllProducts);
router.get("/:productId", productController.fetchSingleProd);

// admin only: create, update, delete
router.post(
  "/",
  userAuth,
  checkAdmin,
  upload.single("image"),
  productController.createProduct
);
router.put(
  "/:productId",
  userAuth,
  checkAdmin,
  upload.single("image"),
  productController.updateProduct
);
router.delete(
  "/:productId",
  userAuth,
  checkAdmin,
  productController.deleteProduct
);

module.exports = router;
