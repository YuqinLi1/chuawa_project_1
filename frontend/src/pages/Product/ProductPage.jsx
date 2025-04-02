import React, { useState, useEffect } from "react";
import {
  Sidebar,
  Segment,
  Button,
  Icon,
  Grid,
  Card,
  Image,
  Header,
  Loader,
  Message,
} from "semantic-ui-react";
import useWindowSize from "../../hooks/useWindowSize.jsx";
import api from "../../services/api.js";

function ProductPage() {
  const [products, setProducts] = useState([]);

  //cart state and content
  const [cartVisible, setCartVisible] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discountRate, setDiscountRate] = useState(0);
  const [promoCode, setPromoCode] = useState("");

  const [loading, setLoading] = useState(false);

  const { width } = useWindowSize();
  const isMobile = width < 600;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get("/products", {
          params: {
            sortField: "price",
            sortOrder: "asc",
          },
        });
        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddtoCart = async (product) => {
    try {
      const res = await api.post("/cart", {
        productId: product._id,
        quantity: 1,
      });
      setCartItems(res.data.items);

      //calculate total prices
      const newTotal = res.data.items.reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0
      );

      setTotalPrice(newTotal);
      setCartVisible(true);
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  const handleUpdateQuantity = async (cartItemId, newQuantity) => {
    try {
      const res = await api.put("/cart/update-item", {
        cartItemId,
        quantity: newQuantity,
      });

      setCartItems(res.data.items);
      const newTotal = res.data.items.reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0
      );
      setTotalPrice(newTotal);
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      const res = await api.delete(`/cart/remove-item/${cartItemId}`);

      setCartItems(res.data.items);
      const newTotal = res.data.items.reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0
      );
      setTotalPrice(newTotal);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleApplyPromo = async (code) => {
    try {
      const res = await api.post("/cart/apply-promo", { code: promoCode });

      const discountRateFromRes = res.data.discountRate;

      setDiscountRate(discountRateFromRes);

      const currentTotal = cartItems.reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0
      );
      setTotalPrice(currentTotal * (1 - discountRate));
    } catch (error) {
      console.error("Error applying promotion:", error);
    }
  };

  return (
    <Sidebar.Pushable as={Segment} style={{ minHeight: "100vh" }}>
      /* cart sidebar */
      <Sidebar
        as={Segment}
        animation="overlay"
        direction="right"
        visible={cartVisible}
        style={{
          width: isMobile ? "100%" : "350px",
          padding: "1rem",
          overflowY: "auto",
        }}
      >
        <Header as="h3">
          <Icon name="shopping cart" /> Cart ({cartItems.length})
        </Header>
        {cartItems.length === 0 ? (
          <Message info>
            <Message.Header>Your cart is empty</Message.Header>
            <p>Add products to see them here.</p>
          </Message>
        ) : (
          cartItems.map((item) => (
            <div key={item._id} style={{ marginBottom: "1rem" }}>
              <strong>{item.product.name}</strong> - $
              {item.product.price.toFixed(2)}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "0.5rem",
                }}
              >
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={
                    (e) =>
                      handleUpdateQuantity(
                        item._id,
                        Number(e.target.value)
                      ) /* transfer the type */
                  }
                  style={{ width: "80px" }}
                />
                <Button
                  icon="trash"
                  size="tiny"
                  color="red"
                  onClick={() => handleRemoveItem(item._id)}
                />
              </div>
            </div>
          ))
        )}
        <div style={{ marginTop: "1rem" }}>
          <strong>Total: ${totalPrice.toFixed(2)}</strong>
        </div>
        <div style={{ marginTop: "1rem" }}>
          <Input
            placeholder="Enter promo code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
          />
          <Button
            color="blue"
            fluid
            style={{ marginTop: "0.5rem" }}
            onClick={handleApplyPromo}
          >
            Apply Promo
          </Button>
        </div>
        <Button color="blue" fluid style={{ marginTop: "1rem" }}>
          Checkout
        </Button>
        <Button
          basic
          fluid
          style={{ marginTop: "0.5rem" }}
          onClick={() => setCartVisible(false)}
        >
          Close
        </Button>
      </Sidebar>
      /* Product List */
      <Sidebar.Pusher dimmed={cartVisible}>
        <Segment basic>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Header as="h2">My Store</Header>
            <div>
              <Button icon="user" content="Sign In" />
              <Button
                icon="shopping cart"
                onClick={() => setCartVisible(true)}
                style={{ marginLeft: "1rem" }}
              >
                Cart ({cartItems.length})
              </Button>
            </div>
          </div>

          {loadingProducts ? (
            <Loader active inline="centered">
              Loading Products...
            </Loader>
          ) : (
            <Grid columns={4} stackable>
              {products.map((p) => (
                <Grid.Column key={p._id}>
                  <Card>
                    <Image src={p.imageUrl} wrapped ui={false} />
                    <Card.Content>
                      <Card.Header>{p.name}</Card.Header>
                      <Card.Meta>${p.price}</Card.Meta>
                      <Card.Description>{p.description}</Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                      <Button primary onClick={() => handleAddToCart(p)}>
                        Add to Cart
                      </Button>
                    </Card.Content>
                  </Card>
                </Grid.Column>
              ))}
            </Grid>
          )}
        </Segment>
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  );
}

export default ProductPage;
