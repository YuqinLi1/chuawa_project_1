import React, { useState, useEffect } from "react";
import {
  Container,
  Dropdown,
  Button,
  Input,
  Icon,
  Menu,
  Header,
} from "semantic-ui-react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import UserSidebar from "./UserSidebar";
import CartSidebar from "./CartSidebar";
import "../App.css";

function HeaderBar({ showSearchBar }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // cart
  const [cartSidebarVisible, setCartSidebarVisible] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/auth/me", { withCredentials: true })
      .then((res) => {
        setUser(res.data.user);
      })
      .catch(() => {
        setUser(null);
      });
  }, [location.pathname]); 

  // Fetch cart when user changes
  useEffect(() => {
    if (user) {
      fetchCartItems();
    } else {
      // Clear cart items when user logs out
      setCartItems([]);
      setTotalPrice(0);
      setDiscount(0);
      setPromoCode("");
      // user logout, user cannot open cart again
      if (cartSidebarVisible) {
        setCartSidebarVisible(false);
      }
    }
  }, [user]);

  // Calculate total price about cart
  useEffect(() => {
    const total = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    setTotalPrice(total);
  }, [cartItems]);

  // ✅ Allow other components to trigger a cart refresh
  useEffect(() => {
    const handleRefreshCart = () => fetchCartItems();
    window.addEventListener("refresh-cart", handleRefreshCart);
    return () => window.removeEventListener("refresh-cart", handleRefreshCart);
  }, []);


  const fetchCartItems = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/cart", {
        withCredentials: true,
      });
      setCartItems(res.data.items || []);
    } catch (err) {
      console.error("Failed to fetch cart items:", err);
    }
  };

  const handleSearch = async () => {
    const term = searchTerm.trim() || "all";
    try {
      const res = await axios.get(
        `http://localhost:5000/api/products/search/${term}`
      );
      navigate("/products", { state: { products: res.data.products } });
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  const handleApplyPromo = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/cart/apply-promo",
        { code: promoCode },
        { withCredentials: true }
      );

      if (res.data.discountRate) {
        const discountAmount = totalPrice * res.data.discountRate;
        setDiscount(discountAmount);
        alert(`Promo code applied! You saved $${discountAmount.toFixed(2)}`);
      }
    } catch (err) {
      alert("Invalid promo code");
      console.error("Failed to apply promo code:", err);
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/cart/remove-item/${cartItemId}`,
        {
          withCredentials: true,
        }
      );

      // Update cart
      fetchCartItems();
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  const handleUpdateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await axios.put(
        "http://localhost:5000/api/cart/update-item",
        {
          cartItemId: cartItemId,
          quantity: newQuantity,
        },
        {
          withCredentials: true,
        }
      );

      // Update cart
      fetchCartItems();
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  };

  return (
    <>
      <Menu
        secondary
        style={{ backgroundColor: "#1B1C1D", padding: "0.5rem 1rem" }}
      >
        <Menu.Item header>
          <Header as="h3" inverted>
            Management
            <Header.Subheader style={{ fontSize: "0.8rem", color: "#ccc" }}>
              chuwa
            </Header.Subheader>
          </Header>
        </Menu.Item>

        {showSearchBar && location.pathname === "/products" && (
          <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <Input
              placeholder="Input name to search a product."
              style={{ width: "50%" }}
              icon={<Icon name="search" link onClick={handleSearch} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
          </div>
        )}

        <Menu.Menu position="right">
          {/* User menu item */}
          {!user ? (
            <Menu.Item 
              onClick={() => navigate("/login")}
              style={{ color: "#ccc" }}>
              <Icon name="user" />
              Sign In
            </Menu.Item>
          ) : (
            <>
              <Menu.Item
                onClick={() => setSidebarVisible(true)}
                style={{ color: "#fff" }}
              >
                <Icon name="user" />
                Hello, {user.email}
              </Menu.Item>

              {/* Cart Icon - Only shown when user is logged in */}
              <Menu.Item
                onClick={() => setCartSidebarVisible(true)}
                style={{ color: "#fff", position: "relative" }}
              >
                <Icon name="shopping cart" />
                {cartItems.length > 0 && (
                  <span className="cart-badge">{cartItems.length}</span>
                )}
              </Menu.Item>
            </>
          )}
        </Menu.Menu>
      </Menu>

      <UserSidebar
        visible={sidebarVisible}
        onHide={() => setSidebarVisible(false)}
        user={user}
      />

      {/* Only render CartSidebar if user is logged in */}
      {user && (
        <CartSidebar
          visible={cartSidebarVisible}
          onClose={() => setCartSidebarVisible(false)}
          cartItems={cartItems}
          totalPrice={totalPrice}
          promoCode={promoCode}
          setPromoCode={setPromoCode}
          handleApplyPromo={handleApplyPromo}
          handleRemoveItem={handleRemoveItem}
          handleUpdateQuantity={handleUpdateQuantity}
        />
      )}
    </>
  );
}
export default HeaderBar;
