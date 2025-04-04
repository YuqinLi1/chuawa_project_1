const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const { userAuth, checkAdmin } = require("../middleware/authMiddleware");
const productController = require("../controller/productController");

// public: get products
router.get("/", productController.fetchAllProducts);
router.get("/:id", productController.fetchSingleProd);

// admin only: create, update, delete
router.post(
  "/create-product",
  userAuth,
  checkAdmin,
  upload.single("image"),
  productController.createProduct
);

router.put(
  "/:id",
  userAuth,
  checkAdmin,
  upload.single("image"),
  productController.updateProduct
);
router.delete("/:id", userAuth, checkAdmin, productController.deleteProduct);

module.exports = router;
