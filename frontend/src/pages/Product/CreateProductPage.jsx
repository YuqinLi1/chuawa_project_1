import React, { useState, useEffect } from "react";
import {
  Container,
  Header,
  Form,
  Input,
  TextArea,
  Button,
  Segment,
  Image,
  Grid,
  Dropdown,
} from "semantic-ui-react";
import useWindowSize from "../../hooks/useWindowSize";
import api from "../../services/api";
import HeaderBar from "../../components/HeaderBar";
import Footer from "../../components/Footer";

function CreateProductPage({
  cartItems = [],
  totalPrice = 0,
  promoCode = "",
  setPromoCode = () => {},
  handleApplyPromo = () => {},
  handleRemoveItem = () => {},
  handleUpdateQuantity = () => {},
}) {
  const { width } = useWindowSize();
  const isMobile = width < 600;

  // form filed update
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imageLink, setImageLink] = useState("");

  // For local file upload
  const [selectedFile, setSelectedFile] = useState(null);

  const categoryOptions = [
    { key: "1", text: "Category1", value: "Category1" },
    { key: "2", text: "Category2", value: "Category2" },
    { key: "3", text: "Category3", value: "Category3" },
    { key: "4", text: "Category4", value: "Category4" },
  ];

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("price", price);
      formData.append("stock", stock);

      if (selectedFile) {
        formData.append("image", selectedFile);
      } else {
        formData.append("image1", imageLink);
      }

      const res = await api.post("/products/create-product", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // tells the server that the request body contains multipart form data
        },
      });

      console.log("Product created:", res.data);
      // Reset fields
      setName("");
      setDescription("");
      setCategory("");
      setPrice("");
      setStock("");
      setImageLink("");
      setSelectedFile(null);
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  // Handle local file changes
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // preview URL
  const previewImage = selectedFile
    ? URL.createObjectURL(selectedFile)
    : imageLink;

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <HeaderBar
        cartItems={cartItems}
        totalPrice={totalPrice}
        promoCode={promoCode}
        setPromoCode={setPromoCode}
        handleApplyPromo={handleApplyPromo}
        handleRemoveItem={handleRemoveItem}
        handleUpdateQuantity={handleUpdateQuantity}
      />
      <Container style={{ margin: "1rem auto", maxWidth: "800px", flex: 1 }}>
        <Header as="h2" textAlign="left">
          Create Product
        </Header>
        <Segment padded={isMobile}>
          <Form onSubmit={handleSubmit}>
            <Form.Field required>
              <label>Product Name</label>
              <Input
                placeholder="iWatch"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Field>
            <Form.Field>
              <label>Product Description</label>
              <TextArea
                placeholder="Enter product description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Field>
            <Grid columns={2} stackable>
              <Grid.Row>
                <Grid.Column>
                  <Form.Field>
                    <label>Category</label>
                    <Dropdown
                      placeholder="Category1"
                      fluid
                      selection
                      options={categoryOptions}
                      value={category}
                      onChange={(e, { value }) => setCategory(value)}
                    />
                  </Form.Field>
                </Grid.Column>

                <Grid.Column>
                  <Form.Field required>
                    <label>Price</label>
                    <Input
                      type="number"
                      placeholder="50"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </Form.Field>
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column>
                  <Form.Field>
                    <label>In Stock Quantity</label>
                    <Input
                      type="number"
                      placeholder="100"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                    />
                  </Form.Field>
                </Grid.Column>

                <Grid.Column>
                  <Form.Field>
                    <label>Add Image Link</label>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Input
                        placeholder="https://"
                        value={imageLink}
                        onChange={(e) => setImageLink(e.target.value)}
                        style={{ marginRight: "0.5rem" }}
                      />
                      <Button
                        icon="upload"
                        onClick={() =>
                          document.getElementById("fileInput").click()
                        }
                      />

                      <input
                        id="fileInput"
                        type="file"
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                      />
                    </div>
                  </Form.Field>
                </Grid.Column>
              </Grid.Row>
            </Grid>

            {previewImage && (
              <Segment
                textAlign="center"
                style={{
                  marginTop: "1rem",
                  border: "2px dashed #ccc",
                  padding: "1rem",
                }}
              >
                <Image
                  src={previewImage}
                  size="small"
                  centered
                  alt="Product preview"
                />
                <p style={{ marginTop: "0.5rem" }}>image preview!</p>
              </Segment>
            )}
            <Button primary type="submit" style={{ marginTop: "1rem" }}>
              Add Product
            </Button>
          </Form>
        </Segment>
      </Container>
      <Footer />
    </div>
  );
}

export default CreateProductPage;
