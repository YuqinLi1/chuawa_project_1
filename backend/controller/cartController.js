const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

// get user's cart
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId }).populate(
      "items.product",
      "name price stock"
    );
    if (!cart) {
      return res.json({ items: [] }); // cart is not found
    }
    res.json(cart);
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

// add/update item in cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // find or create a cart for the user
    let cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      cart = await Cart.create({ user: req.user.userId, items: [] });
    }

    // check if product already in cart
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      // update quantity
      cart.items[itemIndex].quantity += quantity;
    } else {
      // push a new item
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();

    // re-fetch the cart with product details
    const updatedCart = await Cart.findById(cart._id).populate(
      "items.product",
      "name price stock"
    );
    res.json(updatedCart);
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

// update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const { cartItemId, quantity } = req.body;

    // find user's cart
    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // for subdocuments, might need to find by index
    const item = cart.items.id(cartItemId);
    if (!item) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    item.quantity = quantity; // update
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate(
      "items.product",
      "name price stock"
    );
    res.json(updatedCart);
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

// remove item from cart
exports.removeCartItem = async (req, res) => {
  try {
    const { cartItemId } = req.params; // or from body

    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items.id(cartItemId).remove();
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate(
      "items.product",
      "name price stock"
    );
    res.json(updatedCart);
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

// apply promo code
const applyPromo = async (req, res) => {
  try {
    const { code } = req.body;
    // logic to verify code, calculate discount, etc.

    if (code === "CHUWA10") {
      return res.json({ discountRate: 0.1 });
    } else {
      return res.status(400).json({ message: "Invalid promo code" });
    }
  } catch (error) {
    res.status(401).json({
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
