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
  cartItems,
  totalPrice,
  promoCode,
  setPromoCode,
  handleApplyPromo,
  handleRemoveItem,
  handleUpdateQuantity,
  handleAddToCart,
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
      setProduct(res.data);
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
}

// loading
if (loading) {
  return (
    <div>
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
    </div>
  );
}

// not found product

if (!product) {
  return (
    <div>
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
    </div>
  );
}

return (
  <div>
    <HeaderBar
      cartItems={cartItems}
      totalPrice={totalPrice}
      promoCode={promoCode}
      setPromoCode={setPromoCode}
      handleApplyPromo={handleApplyPromo}
      handleRemoveItem={handleRemoveItem}
      handleUpdateQuantity={handleUpdateQuantity}
    />

    <Segment basic>
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
              <Button style={{ marginLeft: "1rem" }} onClick={handleEdit}>
                Edit
              </Button>
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
    <Footer />
  </div>
);

export default ProductDetailPage;
