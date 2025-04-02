const express = require("express");
const asyncHandler = require("express-async-handler");
const Product = require("../../model/productModel.js");
const mongoose = require("mongoose");

//create product
const createProduct = asyncHandler(async (req, res) => {
  const { name, price, description, stock, category, image1 } = req?.body;
  try {
    // create product
    const newProduct = await Product.create({
      name,
      price,
      description,
      stock,
      category,
      image1,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
});

//fetch all products /products?sortField=price&sortOrder=desc
const fetchAllProducts = asyncHandler(async (req, res) => {
  try {
    const sortField = req.query.sortField;
    const sortOrder = req.query.sortOrder;
    let sortOption = {};
    if (sortField) {
      // check sorting order
      sortOption[sortField] = sortOrder === "asc" ? 1 : -1;
    }

    const allProducts = await Product.find().sort(sortOption);
    res.status(200).json({
      success: true,
      allProducts,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
});

//fetch single product
const fetchSingleProd = asyncHandler(async (req, res) => {
  const { id } = req?.params;
  try {
    const singleProd = await Product.findById(id).populate("user");
    res.status(200).json(singleProd);
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
});

//update product
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req?.params;
  try {
    const user = req?.user;
    const updateProd = await Product.findByIdAndUpdate(
      id,
      {
        ...req.body,
        user: user?._id,
      },
      { new: true }
    );

    const updatedProd = await Product.findById(id).populate("user");
    res.status(200).json(updatedProd);
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
});

//delete a product
const deleteProduct = asyncHandler(async (req, res) => {
  //find the product
  const { id } = req?.params;

  try {
    const deleteProduct = await Product.findByIdAndDelete(id);

    res.status(200).json(deleteProduct);
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = {
  createProduct,
  fetchAllProducts,
  fetchSingleProd,
  updateProduct,
  deleteProduct,
};
