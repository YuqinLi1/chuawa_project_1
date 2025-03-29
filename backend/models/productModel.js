const express = require("express");
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },

    stock: {
      type: Number,
      default: 0,
    },

    Price: {
      type: Number,
    },

    category: {
      type: String,
      default: "Beauty",
    },

    image1: {
      type: String,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

const Product = mongoose.model("Prodect", productSchema);

module.exports = Product;
