import React, { useState } from 'react';
import BottomBar from '../component/BottomBar';
import HeaderBar from '../component/HeaderBar';
import '../App.css';
import { Container, Form, Button } from 'react-bootstrap';

function CreateProduct(){
    const [previewUrl, setPreviewUrl] = useState('');
    const [product, setProduct] = useState({
        name: '',
        description: '',
        category: 'electronic',
        price: '',
        stock: '',
        imageUrl: ''
      });

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
      };
    
      const handlePreview = () => {
        if (product.imageUrl.startsWith('http')) {
          setPreviewUrl(product.imageUrl);
        } else {
          alert('Please enter a valid image URL');
        }
      };

      const handleAddProduct = () => {
        // Handle product submission here (e.g., POST to backend)
        console.log('Product added:', product);
        alert('Product added successfully!');
      };
      return (
        <>
          <HeaderBar />
          <Container className="page-container create-edit-product-page">
            <h4 className="text-center mb-4">Create Product</h4>
    
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
    
              {/* Category + Price (Same Line) */}
              <div className="d-flex gap-3 mb-3">
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
              </div>
    
              {/* Stock + Image Link + Preview (Same Line) */}
              <div className="d-flex gap-3 mb-4">
                {/* In Stock Quantity */}
                <Form.Group style={{ flex: 1 }}>
                    <Form.Label>In Stock Quantity</Form.Label>
                    <Form.Control
                    type="number"
                    name="stock"
                    value={product.stock}
                    onChange={handleChange}
                    />
                </Form.Group>

            {/* Add Image Link + Preview inside input group */}
            <Form.Group style={{ flex: 3 }}>
                <Form.Label>Add Image Link</Form.Label>
                <div className="input-group">
                <Form.Control
                    type="text"
                    name="imageUrl"
                    value={product.imageUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                />
                <Button
                    variant="primary"
                    onClick={handlePreview}
                    className="input-group-text btn btn-primary"
                >
                    Preview
                </Button>
                </div>
            </Form.Group>
            </div>
    
              {/* Image Preview */}
              {previewUrl && (
                <div className="text-center mb-4">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="img-thumbnail"
                    style={{ maxHeight: '300px' }}
                  />
                </div>
              )}
    
              {/* Add Product Button */}
              <div className="text-center">
                <Button variant="success" onClick={handleAddProduct}>
                  Add Product
                </Button>
              </div>
            </Form>
          </Container>
          <BottomBar />
        </>
      );
    }

    
export default CreateProduct;
