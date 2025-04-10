const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const mongoose = require("mongoose");

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId }).populate(
      "items.product",
      "name price stock image1"
    );
    if (!cart) {
      return res.json({ items: [] }); // cart is not found
    }
    res.json(cart);
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// add/update item in cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Validate the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Find or create a cart for the user
    let cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      cart = new Cart({ user: req.user.userId, items: [] });
    }

    // Check if product already in cart
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      // Update quantity
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Push a new item
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();

    // Re-fetch the cart with product details
    const updatedCart = await Cart.findById(cart._id).populate(
      "items.product",
      "name price stock image1"
    );

    res.json({
      success: true,
      message: "Product added to cart",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const { cartItemId, quantity } = req.body;

    console.log("Updating cart item - Item ID:", cartItemId);
    console.log("New quantity:", quantity);

    // Find user's cart
    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Find the item using _id
    const itemIndex = cart.items.findIndex(
      (item) => item._id.toString() === cartItemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    // Update quantity
    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate(
      "items.product",
      "name price stock image1"
    );

    res.json({
      success: true,
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Update cart error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// remove item from cart
const removeCartItem = async (req, res) => {
  try {
    const { cartItemId } = req.params;

    console.log("Removing cart item - Item ID:", cartItemId);

    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Find the item using _id and remove it
    const itemIndex = cart.items.findIndex(
      (item) => item._id.toString() === cartItemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    // Remove the item using splice
    cart.items.splice(itemIndex, 1);
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate(
      "items.product",
      "name price stock image1"
    );

    res.json({
      success: true,
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Remove cart item error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// apply promo code
const applyPromo = async (req, res) => {
  try {
    const { code } = req.body;
    console.log("Applying promo code:", code);

    if (code === "CHUWA10") {
      return res.json({
        success: true,
        discountRate: 0.1,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid promo code",
      });
    }
  } catch (error) {
    console.error("Apply promo error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  applyPromo,
};
