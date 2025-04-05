import React, { useState, useEffect } from "react";
import {
  Segment,
  Button,
  Icon,
  Grid,
  Card,
  Image,
  Header,
  Dropdown,
  Loader,
  Message,
} from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import useWindowSize from "../../hooks/useWindowSize.jsx";
import api from "../../services/api.js";
import HeaderBar from "../../components/HeaderBar";
import Footer from "../../components/Footer";

function ProductPage() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  //cart state and content
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discountRate, setDiscountRate] = useState(0);
  const [promoCode, setPromoCode] = useState("");

  const [loading, setLoading] = useState(false);

  // sort and search
  const [sortValue, setSortValue] = useState("lastAdded");

  const { width } = useWindowSize();
  const isMobile = width < 600;

  const navigate = useNavigate();

  const sortOptions = [
    { key: "lastAdded", text: "Last Added", value: "lastAdded" },
    { key: "priceAsc", text: "Price: Low to High", value: "priceAsc" },
    { key: "priceDesc", text: "Price: High to Low", value: "priceDesc" },
  ];

  useEffect(() => {
    fetchProducts();
  }, [sortValue]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Convert sortValue to API parameters
      let sortField, sortOrder;
      if (sortValue === "lastAdded") {
        sortField = "lastAdded";
        sortOrder = "";
      } else if (sortValue === "priceAsc") {
        sortField = "price";
        sortOrder = "asc";
      } else if (sortValue === "priceDesc") {
        sortField = "price";
        sortOrder = "desc";
      }

      const response = await api.get("/products", {
        params: {
          sortField,
          sortOrder,
        },
      });

      // Check if valid products data
      if (response.data && response.data.success) {
        setProducts(response.data.allProducts || []);
      } else {
        setError("Failed to load products data");
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(
        error.response?.data?.message ||
          "An error occurred while fetching products"
      );
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      const res = await api.post("/cart", {
        productId: product._id,
        quantity: 1,
      });

      if (res.data && res.data.items) {
        setCartItems(res.data.items);

        //calculate total prices
        const newTotal = res.data.items.reduce(
          (acc, item) => acc + item.product.price * item.quantity,
          0
        );

        setTotalPrice(newTotal);
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert("Failed to add product to cart. Make sure you're logged in.");
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

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      alert("Please enter a promo code");
      return;
    }

    try {
      const res = await api.post("/cart/apply-promo", { code: promoCode });

      const discountRateFromRes = res.data.discountRate;

      setDiscountRate(discountRateFromRes);

      const currentTotal = cartItems.reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0
      );
      setTotalPrice(currentTotal * (1 - discountRateFromRes));
    } catch (error) {
      console.error("Error applying promotion:", error);
      alert(error.response?.data?.message || "Invalid promo code");
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
      <HeaderBar
        cartItems={cartItems}
        totalPrice={totalPrice}
        promoCode={promoCode}
        setPromoCode={setPromoCode}
        handleApplyPromo={handleApplyPromo}
        handleRemoveItem={handleRemoveItem}
        handleUpdateQuantity={handleUpdateQuantity}
      />

      <Segment basic style={{ flex: 1 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <div>
            <Header as="h2" style={{ marginRight: "0.5rem" }}>
              Products
            </Header>
          </div>

          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Dropdown
              selection
              options={sortOptions}
              value={sortValue}
              onChange={(e, { value }) => setSortValue(value)}
              style={{
                display: "flex",
                marginRight: "0.5rem",
              }}
            />

            <Button
              color="green"
              onClick={() => navigate("/products/create-product")}
              style={{ marginRight: "1rem" }}
            >
              <Icon name="plus" />
              Add Product
            </Button>
          </div>
        </div>

        {loading ? (
          <Loader active inline="centered">
            Loading Products...
          </Loader>
        ) : error ? (
          <Message negative>
            <Message.Header>Error</Message.Header>
            <p>{error}</p>
          </Message>
        ) : products.length === 0 ? (
          <Message info>No products found.</Message>
        ) : (
          <Grid columns={isMobile ? 1 : 4} stackable>
            {products.map((p) => (
              <Grid.Column key={p._id}>
                <Card>
                  <Image
                    src={p.image1}
                    wrapped
                    ui={false}
                    onClick={() => navigate(`/products/${p._id}`)}
                    style={{
                      cursor: "pointer",
                      height: "200px",
                      objectFit: "cover",
                    }}
                  />
                  <Card.Content
                    onClick={() => navigate(`/products/${p._id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <Card.Header>{p.name}</Card.Header>
                    <Card.Meta>${p.price}</Card.Meta>
                    <Card.Description>
                      {p.description && p.description.length > 100
                        ? `${p.description.substring(0, 100)}...`
                        : p.description}
                    </Card.Description>
                  </Card.Content>
                  <Card.Content extra>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Button primary onClick={() => handleAddToCart(p)}>
                        Add to Cart
                      </Button>
                      <Button
                        basic
                        onClick={() => navigate(`/products/${p._id}`)}
                      >
                        View
                      </Button>
                    </div>
                  </Card.Content>
                </Card>
              </Grid.Column>
            ))}
          </Grid>
        )}
      </Segment>
      <Footer />
    </div>
  );
}

export default ProductPage;
