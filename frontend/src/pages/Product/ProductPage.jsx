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
import { useNavigate } from "react-router-dom";
import useWindowSize from "../../hooks/useWindowSize.jsx";
import api from "../../services/api.js";
import HeaderBar from "../../components/HeaderBar";
import Footer from "../../components/Footer";

function ProductPage() {
  const [products, setProducts] = useState([]);

  //cart state and content
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discountRate, setDiscountRate] = useState(0);
  const [promoCode, setPromoCode] = useState("");

  const [loading, setLoading] = useState(false);

  // sort and search
  const [sortField, setSortField] = useState("price");
  const [sortOrder, setSortOrder] = useState("asc");
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
  }, [sortField, sortOrder]);

  useEffect(() => {
    if (sortValue === "lastAdded") {
      setSortField("lastAdded");
      setSortOrder("");
    } else if (sortValue === "asc") {
      setSortField("price");
      setSortOrder("asc");
    } else if (sortValue === "desc") {
      setSortField("price");
      setSortOrder("desc");
    }
  }, [sortValue]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/products", {
        params: {
          sortField,
          sortOrder,
        },
      });
      setProducts(response.data.allProducts || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

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
      setTotalPrice(currentTotal * (1 - discountRateFromRes));
    } catch (error) {
      console.error("Error applying promotion:", error);
    }
  };

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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <Header as="h2" style={{ marginRight: "1rem" }}>
            Products
          </Header>

          <Dropdown
            selection
            options={sortOptions}
            value={sortValue}
            onChange={(e, { value }) => setSortValue(value)}
            style={{ marginRight: "1rem" }}
          />

          <Button
            color="green"
            onClick={() => navigate("/create-product")}
            style={{ marginRight: "1rem" }}
          >
            <Icon name="plus" />
            Add Product
          </Button>
        </div>

        {loading ? (
          <Loader active inline="centered">
            Loading Products...
          </Loader>
        ) : products.length === 0 ? (
          <Message info>No products found.</Message>
        ) : (
          <Grid columns={4} stackable>
            {products.map((p) => (
              <Grid.Column key={p._id}>
                <Card>
                  <Image src={p.image1} wrapped ui={false} />
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
      <Footer />
    </div>
  );
}

export default ProductPage;
