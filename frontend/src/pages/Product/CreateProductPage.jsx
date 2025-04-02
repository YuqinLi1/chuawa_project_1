import React, { useState } from "react";
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
} from "semantic-ui-react";
import useWindowSize from "../../hooks/useWindowSize";
import api from "../../services/api";

function CreateProductPage() {
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

      const res = await api.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
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

  return (
    <Container style={{ marginTop: isMobile ? "1rem" : "2rem" }}>
      <Header as="h2" textAlign="center">
        Create Product
      </Header>

      <Segment padded={isMobile}>
        <Form onSubmit={handleSubmit}>
          /** product name */
          <Form.Field required>
            <label>Product Name</label>
            <Input
              placeholder="Watch"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Field>
          /** product description */
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
                  <Input
                    placeholder="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </Form.Field>
              </Grid.Column>

              <Grid.Column>
                <Form.Field required>
                  <label>Price</label>
                  <Input
                    type="number"
                    placeholder="100"
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
                    placeholder="50"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                </Form.Field>
              </Grid.Column>

              {/* Image Link */}
              <Grid.Column>
                <Form.Field>
                  <label>Image Link (URL)</label>
                  <Input
                    placeholder="https://example.com/image.jpg"
                    value={imageLink}
                    onChange={(e) => setImageLink(e.target.value)}
                  />
                </Form.Field>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Form.Field>
            <label>Upload Image</label>
            <Input type="file" onChange={handleFileChange} />
            {selectedFile && (
              <p style={{ marginTop: "0.5rem" }}>
                Selected: {selectedFile.name}
              </p>
            )}
          </Form.Field>
          {imageLink && (
            <Segment textAlign="center" style={{ marginTop: "1rem" }}>
              <Image
                src={imageLink}
                size="small"
                centered
                alt="Product preview"
              />
              <p style={{ marginTop: "0.5rem" }}>Image Upload</p>
            </Segment>
          )}
          <Button primary type="submit" style={{ marginTop: "1rem" }}>
            Add Product
          </Button>
        </Form>
      </Segment>
    </Container>
  );
}

export default CreateProductPage;
