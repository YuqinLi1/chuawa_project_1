import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Segment,
  Grid,
  Image,
  Header,
  Button,
  Label,
  Loader,
  Message,
} from "semantic-ui-react";
import api from "../../services/api";
import HeaderBar from "../../components/HeaderBar";
import Footer from "../../components/Footer";

function ProductDetailPage() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cartMessage, setCartMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userRole, setUserRole] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProduct();
    fetchUser();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/products/${id}`);
      if (res.data?.success && res.data.singleProd) {
        setProduct(res.data.singleProd);
      } else {
        setErrorMessage(res.data?.message || "Failed to fetch product");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      setErrorMessage("Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await api.get("/auth/me", { withCredentials: true });
      setUserRole(res.data.user?.role?.toLowerCase());
    } catch (error) {
      console.error("Failed to fetch user info");
    }
  };

  const handleAddCartClick = async () => {
    if (!product) return;

    try {
      // Check if user is logged in first
      const userCheck = await api.get("/auth/me", { withCredentials: true });

      if (!userCheck.data.user) {
        setErrorMessage("Please log in to add items to cart");
        return;
      }

      const productIdToSend = product._id.toString
        ? product._id.toString()
        : product._id;
      console.log("Adding to cart, product ID:", productIdToSend);

      const response = await api.post(
        "/cart",
        {
          productId: product._id,
          quantity: 1,
        },
        { withCredentials: true }
      );

      console.log("Cart response:", response.data); // Log successful response
      setCartMessage(`Added ${product.name} to cart!`);
      setErrorMessage("");
    } catch (err) {
      console.error("Error adding to cart:", err);

      // Log detailed error information
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response data:", err.response.data);
        console.error("Error response status:", err.response.status);

        if (err.response.status === 401) {
          setErrorMessage("Please log in to add items to cart");
        } else {
          setErrorMessage(
            `Failed to add product to cart: ${
              err.response.data.message || "Unknown error"
            }`
          );
        }
      } else if (err.request) {
        // The request was made but no response was received
        console.error("No response received:", err.request);
        setErrorMessage("Server not responding. Please try again later.");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Request setup error:", err.message);
        setErrorMessage(`Error: ${err.message}`);
      }

      setCartMessage("");
    }
  };

  if (loading) {
    return (
      <div
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <HeaderBar />
        <Loader active inline="centered">
          Loading product...
        </Loader>
        <div style={{ marginTop: "auto" }}>
          <Footer />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <HeaderBar />
        <Message negative>No product found.</Message>
        <div style={{ marginTop: "auto" }}>
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <HeaderBar />
      <Segment basic style={{ flex: 1, padding: "2rem 3rem" }}>
        <Header as="h2">Product Detail</Header>
        <Grid stackable style={{ marginTop: "1.5rem" }}>
          <Grid.Row>
            <Grid.Column width={8}>
              {product.image1 ? (
                <Image
                  src={product.image1}
                  fluid
                  style={{ backgroundColor: "#f9f9f9" }}
                />
              ) : (
                <div
                  style={{ height: "300px", backgroundColor: "#f0f0f0" }}
                ></div>
              )}
            </Grid.Column>
            <Grid.Column width={8}>
              <Header as="h3">{product.name}</Header>
              <p>
                <strong>Product Description:</strong> {product.description}
              </p>
              <p>
                <strong>Category:</strong> {product.category}
              </p>
              <p>
                <strong>Price ($):</strong> {product.price}
              </p>
              <div style={{ margin: "1rem 0" }}>
                {product.stock === 0 ? (
                  <Label color="red">Out of Stock</Label>
                ) : (
                  <Label color="green">In Stock</Label>
                )}
              </div>
              <div>
                <Button
                  color="blue"
                  onClick={handleAddCartClick}
                  disabled={product.stock === 0}
                >
                  Add to Cart
                </Button>
                {userRole === "admin" && (
                  <Button
                    style={{ marginLeft: "1rem" }}
                    onClick={() => navigate(`/product/${product._id}/edit`)}
                  >
                    Edit
                  </Button>
                )}
              </div>
              {cartMessage && <p style={{ color: "green" }}>{cartMessage}</p>}
              {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
      <Footer />
    </div>
  );
}

export default ProductDetailPage;
