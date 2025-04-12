const express = require("express");
const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    description: String,
    stock: Number,
    category: String,
    image1: String,
  },
  { collection: "products", timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
