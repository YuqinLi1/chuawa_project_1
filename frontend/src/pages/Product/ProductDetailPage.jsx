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
    <div className="product-detail-page">
      <HeaderBar />
      <Container className="product-detail-container">
        <Header as="h2" className="product-detail-title">
          Products Detail
        </Header>

        <Grid stackable>
          <Grid.Row>
            <Grid.Column width={8}>
              <div className="product-detail-image-box">
                {product?.imageUrl ? (
                  <Image src={product.imageUrl} size="large" centered />
                ) : (
                  <div className="product-detail-placeholder">
                    No image available
                  </div>
                )}
              </div>
            </Grid.Column>

            <Grid.Column width={8}>
              <div className="product-detail-info">
                <div className="details-category">
                  {product?.category || "Category1"}
                </div>

                <Header as="h2" className="details-name">
                  {product?.name}
                </Header>

                <div className="details-price">
                  {product?.price && `$${product.price.toFixed(2)}`}
                  {product?.originalPrice > product?.price && (
                    <span className="original-price">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                <Divider />

                <div className="details-description">
                  <p>{product?.description}</p>
                </div>

                <div className="product-detail-controls">
                  <div>
                    {product?.stock === 0 ? (
                      <Label color="red">Out of Stock</Label>
                    ) : (
                      <Label color="green">In Stock : {product?.stock}</Label>
                    )}
                  </div>

                  <div className="product-detail-buttons">
                    <Button
                      primary
                      size="large"
                      onClick={handleAddCartClick}
                      disabled={product?.stock === 0}
                      style={{ backgroundColor: "#5829e3" }}
                    >
                      Add To Cart
                    </Button>

                    {userRole === "admin" && (
                      <Button
                        size="large"
                        onClick={() => navigate(`/product/${product?._id}/edit`)}
                      >
                        Edit
                      </Button>
                    )}
                  </div>
                </div>

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