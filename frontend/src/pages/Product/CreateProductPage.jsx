import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Segment,
  Image,
  Header,
  Button,
  Label,
  Form,
  Input,
  TextArea,
  Dropdown
} from "semantic-ui-react";
import api from "../../services/api";
import HeaderBar from "../../components/HeaderBar";
import Footer from "../../components/Footer";

function CreateProductPage() {
  const [previewUrl, setPreviewUrl] = useState("");
  const [product, setProduct] = useState({
    name: "",
    description: "",
    category: "electronic",
    price: "",
    stock: "",
    imageUrl: "",
  });

  const navigate = useNavigate();

  const handleChange = (e, { name, value }) => {
    setProduct({ ...product, [name]: value });
  };

  const handlePreview = () => {
    if (product.imageUrl.startsWith("http")) {
      setPreviewUrl(product.imageUrl);
    } else {
      alert("Please enter a valid image URL");
    }
  };

  const handleAddProduct = async () => {
    try {
      const response = await api.post(
        "/products/create",
        {
          name: product.name,
          description: product.description,
          category: product.category,
          price: parseFloat(product.price),
          stock: parseInt(product.stock),
          image1: product.imageUrl,
        },
        { withCredentials: true }
      );

      alert("Product added successfully!");
      navigate("/products");
    } catch (error) {
      console.error("Failed to create product:", error);
      alert("Failed to add product.");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <HeaderBar />
      <Segment basic className="create-edit-product-page">
        <Header as="h2" textAlign="center" style={{ marginBottom: "2rem" }}>
          Create Product
        </Header>

        <Form>
          <Form.Field
            control={TextArea}
            label="Product Name"
            name="name"
            placeholder="Enter product name (max 100 words)"
            maxLength={100}
            value={product.name}
            onChange={handleChange}
          />

          <Form.Field
            control={TextArea}
            label="Product Description"
            name="description"
            placeholder="Enter product description (max 500 words)"
            rows={3}
            maxLength={500}
            value={product.description}
            onChange={handleChange}
          />

          <Form.Group widths="equal">
            <Form.Field
              control={Dropdown}
              label="Category"
              name="category"
              selection
              options={[
                { key: "electronic", text: "Electronic", value: "electronic" },
                { key: "daily", text: "Daily", value: "daily" },
                { key: "grocery", text: "Grocery", value: "grocery" },
                { key: "other", text: "Other", value: "other" },
              ]}
              value={product.category}
              onChange={handleChange}
            />

            <Form.Field
              control={Input}
              label="Price ($)"
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group widths="equal">
            <Form.Field
              control={Input}
              label="In Stock Quantity"
              type="number"
              name="stock"
              value={product.stock}
              onChange={handleChange}
            />

            <Form.Field width={10}>
              <label>Add Image Link</label>
              <Input
                action={{ icon: "eye", onClick: handlePreview }}
                placeholder="https://example.com/image.jpg"
                name="imageUrl"
                value={product.imageUrl}
                onChange={handleChange}
              />
            </Form.Field>
          </Form.Group>

          {previewUrl && (
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <Image src={previewUrl} size="medium" centered bordered />
            </div>
          )}

          <div style={{ textAlign: "center" }}>
            <Button color="green" onClick={handleAddProduct}>
              Add Product
            </Button>
          </div>
        </Form>
      </Segment>
      <Footer />
    </div>
  );
}

export default CreateProductPage;