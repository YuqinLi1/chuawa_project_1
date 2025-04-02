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

    price: {
      type: Number,
    },

    category: {
      type: String,
      default: "Beauty",
    },

    image1: {
      type: String,
    },

    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

const Product = mongoose.model("Prodect", productSchema);

module.exports = Product;
