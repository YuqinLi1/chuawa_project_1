import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import BottomBar from '../component/BottomBar';
import HeaderBar from '../component/HeaderBar';
import '../App.css';

function EditProduct(){

    const dummyProducts = [
        {
          id: 1,
          name: 'iPhone 14',
          description: 'Latest Apple phone with cutting-edge tech.',
          category: 'electronic',
          price: 1099,
          stock: 0,
        },]

    const { id } = useParams();
    const productToEdit = dummyProducts.find((p) => p.id === Number(id));
    const [product, setProduct] = useState({
        name: '',
        description: '',
        category: 'electronic',
        price: '',
        stock: ''
      });

      useEffect(() => {
        if (productToEdit) {
          setProduct({
            name: productToEdit.name,
            description: productToEdit.description,
            category: productToEdit.category,
            price: productToEdit.price,
            stock: productToEdit.stock
          });
        }
      }, [productToEdit]);
    
      const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
      };
    
      const handleEdit = () => {
        // Submit updated product to backend here
        console.log('Updated product:', product);
        alert('Product updated successfully!');
      };
    
      const handleDelete = () => {
        // Delete product logic here
        alert('Product deleted!');
      };

      return (
        <>
          <HeaderBar />
          <Container className="page-container create-edit-product-page">
            <h4 className="text-center mb-4">Update Product</h4>
    
            <Form>
              {/* Product Name */}
              <Form.Group className="mb-3">
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={1}
                  maxLength={100}
                  name="name"
                  placeholder="Enter product name (max 100 words)"
                  value={product.name}
                  onChange={handleChange}
                />
              </Form.Group>
    
              {/* Product Description */}
              <Form.Group className="mb-3">
                <Form.Label>Product Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  maxLength={500}
                  name="description"
                  placeholder="Enter product description (max 500 words)"
                  value={product.description}
                  onChange={handleChange}
                />
              </Form.Group>
    
              {/* Category + Price + Stock (Same Line) */}
              <div className="d-flex gap-3 mb-4">
                <Form.Group className="flex-fill">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    name="category"
                    value={product.category}
                    onChange={handleChange}
                  >
                    <option value="electronic">Electronic</option>
                    <option value="daily">Daily</option>
                    <option value="grocery">Grocery</option>
                    <option value="other">Other</option>
                  </Form.Select>
                </Form.Group>
    
                <Form.Group className="flex-fill">
                  <Form.Label>Price ($)</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={product.price}
                    onChange={handleChange}
                  />
                </Form.Group>
    
                <Form.Group className="flex-fill">
                  <Form.Label>In Stock Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    name="stock"
                    value={product.stock}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>
    
              {/* Action Buttons */}
              <div className="d-flex justify-content-between mt-4">
                <Button variant="success" onClick={handleEdit}>
                  Edit Product
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                  Delete Product
                </Button>
              </div>
            </Form>
          </Container>
          <BottomBar />
        </>
      );
    }

    export default EditProduct;