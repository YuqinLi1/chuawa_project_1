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
  Dropdown,
  Container,
} from "semantic-ui-react";
import api from "../../services/api";
import HeaderBar from "../../components/HeaderBar";
import Footer from "../../components/Footer";
import { useWindowSizeContext } from "../../contexts/WindowSizeContext";

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
  const windowSize = useWindowSizeContext();

  const isMobile = windowSize.width < 768;

  const categoryOptions = [
    { key: "electronic", text: "Electronic", value: "electronic" },
    { key: "daily", text: "Daily", value: "daily" },
    { key: "grocery", text: "Grocery", value: "grocery" },
    { key: "other", text: "Other", value: "other" },
  ];

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
      const parsedPrice = parseFloat(product.price);
      if (parsedPrice <= 0) {
        alert("Price must be greater than 0.");
        return;
      }
      const response = await api.post(
        "/products/create",
        {
          name: product.name,
          description: product.description,
          category: product.category,
          price: parseFloat(product.price),
          stock: parseInt(product.stock),
          imageUrl: product.imageUrl,
        },
        { withCredentials: true }
      );

      alert("Product added successfully!");
      navigate("/products");
    } catch (error) {
      navigate("/error", {
        state: {
          message: "Failed to create product:"+error,
        },
      });
    }
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <HeaderBar />
      <Container style={{ padding: isMobile ? "1rem" : "2rem", flex: 1 }}>
        <Segment basic className="create-edit-product-page">
          <Header as="h2" textAlign="center" style={{ marginBottom: "2rem" }}>
            Create Product
          </Header>

          <Form>
            <Form.Field>
              <label>Product name</label>
              <Input
                placeholder="Enter product name"
                name="name"
                value={product.name}
                onChange={handleChange}
              />
            </Form.Field>

            <Form.Field>
              <label>Product Description</label>
              <TextArea
                placeholder="Enter product description"
                name="description"
                rows={4}
                value={product.description}
                onChange={handleChange}
              />
            </Form.Field>

            {isMobile ? (
              // Mobile layout
              <>
                <Form.Field>
                  <label>Category</label>
                  <Dropdown
                    selection
                    options={categoryOptions}
                    name="category"
                    value={product.category}
                    onChange={handleChange}
                    placeholder="Select category"
                  />
                </Form.Field>

                <Form.Field>
                  <label>Price</label>
                  <Input
                    type="number"
                    placeholder="0"
                    name="price"
                    value={product.price}
                    onChange={handleChange}
                  />
                </Form.Field>

                <Form.Field>
                  <label>In Stock Quantity</label>
                  <Input
                    type="number"
                    placeholder="0"
                    name="stock"
                    value={product.stock}
                    onChange={handleChange}
                  />
                </Form.Field>

                <Form.Field>
                  <label>Add Image Link</label>
                  <div style={{ display: "flex" }}>
                    <Input
                      placeholder="http://"
                      name="imageUrl"
                      value={product.imageUrl}
                      onChange={handleChange}
                      style={{ flex: 1 }}
                    />
                    <Button
                      primary
                      onClick={handlePreview}
                      style={{ marginLeft: "0.5rem" }}
                    >
                      Upload
                    </Button>
                  </div>
                </Form.Field>
              </>
            ) : (
              // Desktop layout
              <>
                <Form.Group widths="equal">
                  <Form.Field>
                    <label>Category</label>
                    <Dropdown
                      selection
                      options={categoryOptions}
                      name="category"
                      value={product.category}
                      onChange={handleChange}
                      placeholder="Select category"
                    />
                  </Form.Field>

                  <Form.Field>
                    <label>Price</label>
                    <Input
                      type="number"
                      placeholder="0"
                      name="price"
                      value={product.price}
                      onChange={handleChange}
                    />
                  </Form.Field>
                </Form.Group>

                <Form.Group widths="equal">
                  <Form.Field>
                    <label>In Stock Quantity</label>
                    <Input
                      type="number"
                      placeholder="0"
                      name="stock"
                      value={product.stock}
                      onChange={handleChange}
                    />
                  </Form.Field>

                  <Form.Field>
                    <label>Add Image Link</label>
                    <div style={{ display: "flex" }}>
                      <Input
                        placeholder="http://"
                        name="imageUrl"
                        value={product.imageUrl}
                        onChange={handleChange}
                        style={{ flex: 1 }}
                      />
                      <Button
                        primary
                        onClick={handlePreview}
                        style={{ marginLeft: "0.5rem" }}
                      >
                        Upload
                      </Button>
                    </div>
                  </Form.Field>
                </Form.Group>
              </>
            )}

            {previewUrl && (
              <div
                style={{
                  textAlign: "center",
                  margin: "1.5rem 0",
                  border: "1px solid #ddd",
                  padding: "1rem",
                  borderRadius: "4px",
                }}
              >
                <p style={{ marginBottom: "0.5rem", color: "#666" }}>
                  Image preview!
                </p>
                <Image src={previewUrl} size="medium" centered />
              </div>
            )}

            {!previewUrl && (
              <div
                style={{
                  textAlign: "center",
                  margin: "1.5rem 0",
                  border: "1px solid #ddd",
                  padding: "1rem",
                  borderRadius: "4px",
                  height: "150px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "#999",
                }}
              >
                <div style={{ fontSize: "40px", marginBottom: "10px" }}>📷</div>
                <p>Image preview!</p>
              </div>
            )}

            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <Button
                primary
                onClick={handleAddProduct}
                style={{
                  backgroundColor: "#5829e3",
                  color: "white",
                  padding: isMobile ? "12px 24px" : "12px 32px",
                }}
              >
                Add Product
              </Button>
            </div>
          </Form>
        </Segment>
      </Container>
      <Footer />
    </div>
  );
}

export default CreateProductPage;
