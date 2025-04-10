const express = require("express");
const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel.js");
const mongoose = require("mongoose");

//create product
const createProduct = asyncHandler(async (req, res) => {
  const { name, price, description, stock, category, image} = req.body;

  try {
    const newProduct = await Product.create({
      name,
      price,
      description,
      stock,
      category,
      image,
    });

    res.status(200).json({
      success: true,
      product: newProduct,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

//fetch all products /products?sortField=price&sortOrder=desc
const fetchAllProducts = asyncHandler(async (req, res) => {
  try {
    const { sortField, sortOrder, search } = req.query;

    let sortOption = {};
    if (sortField) {
      if (sortField === "lastAdded") {
        sortOption.createdAt = -1;
      } else {
        sortOption[sortField] = sortOrder === "asc" ? 1 : -1;
      }
    }

    let query = {};
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const allProducts = await Product.find(query).sort(sortOption);

    res.status(200).json({
      success: true,
      allProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

//fetch single product
const fetchSingleProd = asyncHandler(async (req, res) => {
  const { id } = req?.params;
  console.log("input id "+id);
  try {
    const singleProd = await Product.findById(id);

    console.log(singleProd);
    //  check if product exists
    if (!singleProd) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      singleProd,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
});

const searchProduct = asyncHandler(async (req, res) => {
  const keyword = req.params.keyword?.trim();

  let query = {};
  if (keyword && keyword !== "") {
    query = {
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };
  }

  try {
    const products = await Product.find(query);
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

const fetchProductByName = asyncHandler(async (req, res) => {
  const { name } = req.params;
  try {
    const singleProd = await Product.findOne({ name: { $regex: new RegExp(name, "i") } });
    if (!singleProd) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      singleProd,
    });
  } catch (error) {
    res.status(500).json({
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
    const updateData = {
      ...req.body,
      user: user ? user._id : undefined,
    };
    // if file exists
    if (req.file) {
      updateData.image1 = req.file.path;
    }
    const updatedProd = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate("user");
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
  searchProduct,
  fetchProductByName,
};
