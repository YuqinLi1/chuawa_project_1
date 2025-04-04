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

function ProductDetailPage({
  cartItems = [],
  totalPrice = 0,
  promoCode = "",
  setPromoCode = () => {},
  handleApplyPromo = () => {},
  handleRemoveItem = () => {},
  handleUpdateQuantity = () => {},
}) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cartMessage, setCartMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/products/${id}`);
      // if valid data from backend
      if (!res.data) {
        setErrorMessage("No product data received from server");
        setLoading(false);
        return;
      }
      // check if fetch product or not
      if (res.data.hasOwnProperty("success") && !res.data.success) {
        setErrorMessage(res.data.message || "Failed to fetch product");
        setLoading(false);
        return;
      }

      const productData = res.data.singleProd || res.data;
      setProduct(productData);
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleAddCartClick = async () => {
    if (!product) return;
    // If you have a parent function:
    try {
      const res = await api.post("/cart", {
        productId: product._id,
        quantity: 1,
      });
      setCartMessage(`Added ${product.name} to cart!`);
      setErrorMessage("");
    } catch (err) {
      console.error("Error adding to cart from detail page:", err);
      setErrorMessage("Failed to add product to cart.");
      setCartMessage("");
    }
  };

  // loading
  if (loading) {
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
        <Loader active inline="centered">
          Loading product...
        </Loader>
        <div style={{ marginTop: "auto" }}>
          <Footer />
        </div>
      </div>
    );
  }

  // not found product

  if (!product) {
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
      <HeaderBar
        cartItems={cartItems}
        totalPrice={totalPrice}
        promoCode={promoCode}
        setPromoCode={setPromoCode}
        handleApplyPromo={handleApplyPromo}
        handleRemoveItem={handleRemoveItem}
        handleUpdateQuantity={handleUpdateQuantity}
      />

      <Segment basic style={{ flex: 1, padding: "1rem" }}>
        <Header as="h2">Product Detail</Header>
        <Grid stackable>
          <Grid.Row>
            <Grid.Column width={8}>
              <Image src={product.image1} fluid />
            </Grid.Column>
            <Grid.Column width={8}>
              <Header as="h1">{product.name}</Header>
              <Header as="h3">${product.price}</Header>
              {product.stock === 0 ? (
                <Label color="red">Out of Stock</Label>
              ) : (
                <Label color="green">In Stock</Label>
              )}
              <p style={{ marginTop: "1rem" }}>{product.description}</p>
              <div style={{ marginTop: "1.5rem" }}>
                <Button
                  color="blue"
                  onClick={handleAddCartClick}
                  disabled={product.stock === 0}
                >
                  Add to Cart
                </Button>
                <Button style={{ marginLeft: "1rem" }}>Edit</Button>
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
