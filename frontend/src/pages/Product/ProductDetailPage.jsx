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
      window.dispatchEvent(new Event("refresh-cart"));
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

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <HeaderBar />

      <div style={{ flex: "1 0 auto" }}>
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "3rem 0",
            }}
          >
            <Loader active size="large">
              Loading product...
            </Loader>
          </div>
        ) : !product ? (
          <Container style={{ padding: "2rem 0" }}>
            <Message negative>
              <Message.Header>No product found</Message.Header>
              <p>
                The product you're looking for doesn't exist or has been
                removed.
              </p>
              <Button onClick={() => navigate("/products")}>
                Back to Products
              </Button>
            </Message>
          </Container>
        ) : (
          <Container
            style={{
              padding: isMobile ? "1rem" : "2rem 0",
              maxWidth: isMobile ? "100%" : "1200px",
            }}
          >
            <Header as="h2" style={{ marginBottom: "1.5rem" }}>
              Products Detail
            </Header>

            <Grid stackable>
              <Grid.Row>
                <Grid.Column
                  width={isMobile ? 16 : 8}
                  style={{ marginBottom: isMobile ? "1.5rem" : 0 }}
                >
                  <div
                    style={{
                      backgroundColor: "#f9f9f9",
                      borderRadius: "8px",
                      padding: "2rem",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                      minHeight: isMobile ? "300px" : "400px",
                    }}
                  >
                    {product.imageUrl ? (
                      <Image src={product.imageUrl} size="large" centered />
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

                <Grid.Column width={isMobile ? 16 : 8}>
                  <div style={{ padding: isMobile ? "0" : "0 1rem" }}>
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
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      ${product.price.toFixed(2)}
                      {product.stock === 0 && (
                        <Label
                          style={{
                            marginLeft: "1rem",
                            backgroundColor: "#ffcccc",
                            color: "#cc0000",
                            padding: "0.4rem 0.8rem",
                          }}
                        >
                          Out of Stock
                        </Label>
                      )}
                    </div>

                    <Divider />

                    <div style={{ marginBottom: "2rem" }}>
                      <p
                        style={{
                          lineHeight: "1.6",
                          color: "#555",
                        }}
                      >
                        {product.description ||
                          "Hundreds of VR games, one-of-a-kind experiences, live events, new ways to stay fit and a growing community of users. Experience the best of VR with an ever-expanding universe of games and experiences."}
                      </p>
                    </div>

                    <div style={{ marginBottom: "2rem" }}>
                      <p
                        style={{
                          lineHeight: "1.6",
                          color: "#555",
                        }}
                      >
                        stock:{product.stock}
                      </p>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: isMobile ? "column" : "row",
                        gap: "1rem",
                        marginTop: "1rem",
                      }}
                    >
                      <Button
                        primary
                        size="large"
                        onClick={handleAddCartClick}
                        disabled={product.stock === 0}
                        style={{
                          backgroundColor: "#5829e3",
                          color: "white",
                          width: isMobile ? "100%" : "auto",
                        }}
                      >
                        Add To Cart
                      </Button>

                      {userRole === "admin" && (
                        <Button
                          size="large"
                          onClick={() =>
                            navigate(`/product/${product._id}/edit`)
                          }
                          style={{ width: isMobile ? "100%" : "auto" }}
                        >
                          Edit
                        </Button>
                      )}
                    </div>

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
        )}
      </div>

      <Footer />
    </div>
  );
}

export default ProductDetailPage;