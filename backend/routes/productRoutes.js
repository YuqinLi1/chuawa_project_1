const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const { userAuth, checkAdmin } = require("../middleware/authMiddleware");
const productController = require("../controller/productController");

// public: get products
router.get("/", productController.fetchAllProducts);
router.get("/:id", productController.fetchSingleProd);
router.get("/name/:name", productController.fetchProductByName);
router.get("/search/:keyword", productController.searchProduct);

// admin only: create, update, delete
router.post(
  "/create",
  userAuth,
  checkAdmin,
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
