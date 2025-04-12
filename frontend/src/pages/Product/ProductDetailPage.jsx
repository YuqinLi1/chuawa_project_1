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
  Container,
  Divider,
} from "semantic-ui-react";
import api from "../../services/api";
import HeaderBar from "../../components/HeaderBar";
import Footer from "../../components/Footer";
import { useWindowSizeContext } from "../../contexts/WindowSizeContext";

function ProductDetailPage() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cartMessage, setCartMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userRole, setUserRole] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();
  const windowSize = useWindowSizeContext();
  const isMobile = windowSize.width < 768;

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
      const response = await api.post(
        "/cart",
        {
          productId: product._id,
          quantity: 1,
        },
        { withCredentials: true }
      );

      console.log("Cart response:", response.data);
      setCartMessage(`Added ${product.name} to cart!`);
      setErrorMessage("");
    } catch (err) {
      console.error("Error adding to cart:", err);

      if (err.response) {
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
        setErrorMessage("Server not responding. Please try again later.");
      } else {
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
      <Container
        style={{
          flex: 1,
          padding: isMobile ? "1rem 0" : "2rem 0",
          maxWidth: "1200px",
        }}
      >
        <Header as="h2" style={{ marginBottom: "1.5rem" }}>
          Products Detail
        </Header>

        <Grid stackable>
          <Grid.Row>
            <Grid.Column width={8}>
              <div
                style={{
                  backgroundColor: "#f9f9f9",
                  borderRadius: "8px",
                  padding: "2rem",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  minHeight: "400px",
                }}
              >
                {product.image1 ? (
                  <Image src={product.image1} size="large" centered />
                ) : (
                  <div
                    style={{
                      height: "300px",
                      width: "100%",
                      backgroundColor: "#f0f0f0",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    No image available
                  </div>
                )}
              </div>
            </Grid.Column>

            <Grid.Column width={8}>
              <div style={{ padding: isMobile ? "1rem 0" : "0 1rem" }}>
                <div
                  style={{
                    color: "#666",
                    marginBottom: "0.5rem",
                    fontSize: "0.9rem",
                  }}
                >
                  {product.category || "Category1"}
                </div>

                <Header
                  as="h2"
                  style={{
                    margin: "0 0 1rem 0",
                    fontWeight: "bold",
                  }}
                >
                  {product.name}
                </Header>

                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    marginBottom: "1rem",
                    color: "#333",
                  }}
                >
                  ${product.price.toFixed(2)}
                  {product.originalPrice &&
                    product.originalPrice > product.price && (
                      <span
                        style={{
                          fontSize: "1rem",
                          color: "#888",
                          textDecoration: "line-through",
                          marginLeft: "0.5rem",
                        }}
                      >
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                </div>

                <Divider />

                <div style={{ marginBottom: "1.5rem" }}>
                  <p
                    style={{
                      lineHeight: "1.6",
                      color: "#555",
                    }}
                  >
                    {product.description ||
                      "Hundreds of VR games, one-of-a-kind experiences, live events, new ways to stay fit and a growing community of users. Experience the best of VR with an ever-expanding universe of games."}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    gap: "1rem",
                    marginTop: "2rem",
                  }}
                >
                  <Button
                    primary
                    size="large"
                    onClick={handleAddCartClick}
                    disabled={product.stock === 0}
                    style={{
                      backgroundColor: "#5829e3",
                      flex: isMobile ? "1" : "0 0 auto",
                    }}
                  >
                    Add To Cart
                  </Button>

                  {userRole === "admin" && (
                    <Button
                      size="large"
                      onClick={() => navigate(`/product/${product._id}/edit`)}
                      style={{ flex: isMobile ? "1" : "0 0 auto" }}
                    >
                      Edit
                    </Button>
                  )}
                </div>

                {product.stock === 0 ? (
                  <Label
                    color="red"
                    style={{ marginTop: "1rem", display: "inline-block" }}
                  >
                    Out of Stock
                  </Label>
                ) : (
                  <Label
                    color="green"
                    style={{ marginTop: "1rem", display: "inline-block" }}
                  >
                    In Stock
                  </Label>
                )}

                {cartMessage && (
                  <Message positive style={{ marginTop: "1rem" }}>
                    {cartMessage}
                  </Message>
                )}

                {errorMessage && (
                  <Message negative style={{ marginTop: "1rem" }}>
                    {errorMessage}
                  </Message>
                )}
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
      <Footer />
    </div>
  );
}

export default ProductDetailPage;
