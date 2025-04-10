import React, { useState } from "react";
import { Segment, Form, Button, Container, Header, Image, Message } from "semantic-ui-react";
import HeaderBar from "../../components/HeaderBar";
import Footer from "../../components/Footer";

function EditProductPage() {
  const [previewUrl, setPreviewUrl] = useState("");
  const [product, setProduct] = useState({
    name: "",
    description: "",
    category: "electronic",
    price: "",
    stock: "",
    imageUrl: ""
  });

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

  const handleUpdateProduct = () => {
    console.log("Product update:", product);
    alert("Product update successfully!");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <HeaderBar />
      <Container className="page-container create-edit-product-page" style={{ flex: 1, paddingTop: 80, paddingBottom: 60 }}>
        <Segment padded>
          <Header as="h3" textAlign="center">Update Product</Header>
          <Form>
            <Form.TextArea
              label="Product Name"
              name="name"
              rows={1}
              maxLength={100}
              placeholder="Enter product name (max 100 words)"
              value={product.name}
              onChange={handleChange}
            />

            <Form.TextArea
              label="Product Description"
              name="description"
              rows={3}
              maxLength={500}
              placeholder="Enter product description (max 500 words)"
              value={product.description}
              onChange={handleChange}
            />

            <Form.Group widths="equal">
              <Form.Select
                fluid
                label="Category"
                name="category"
                options={[
                  { key: "electronic", text: "Electronic", value: "electronic" },
                  { key: "daily", text: "Daily", value: "daily" },
                  { key: "grocery", text: "Grocery", value: "grocery" },
                  { key: "other", text: "Other", value: "other" },
                ]}
                value={product.category}
                onChange={handleChange}
              />

              <Form.Input
                label="Price ($)"
                name="price"
                type="number"
                value={product.price}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group widths="equal">
              <Form.Input
                label="In Stock Quantity"
                name="stock"
                type="number"
                value={product.stock}
                onChange={handleChange}
              />

              <Form.Input
                label="Add Image Link"
                name="imageUrl"
                type="text"
                placeholder="https://example.com/image.jpg"
                value={product.imageUrl}
                onChange={handleChange}
                action={{ icon: "eye", onClick: handlePreview }}
              />
            </Form.Group>

            {previewUrl && (
              <div className="text-center mb-4" style={{ textAlign: "center", marginBottom: "1rem" }}>
                <Image
                  src={previewUrl}
                  alt="Preview"
                  size="medium"
                  centered
                  style={{ maxHeight: "300px" }}
                />
              </div>
            )}

            <div style={{ textAlign: "center" }}>
              <Button color="green" onClick={handleUpdateProduct}>Update Product</Button>
            </div>
          </Form>
        </Segment>
      </Container>
      <Footer />
    </div>
  );
}

export default EditProductPage;