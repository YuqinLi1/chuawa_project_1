import React, { useState } from "react";
import { Menu, Input, Icon, Header } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import CartSidebar from "./CartSidebar";
import api from "../services/api";

const HeaderBar = ({
  cartItems,
  totalPrice,
  promoCode,
  setPromoCode,
  handleApplyPromo,
  handleRemoveItem,
  handleUpdateQuantity,
}) => {
  const [cartVisible, setCartVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const res = await api.get("/products", {
        params: { search: searchTerm },
      });
    } catch (error) {
      console.error("Error searching products:", error);
    }
  };

  return (
    <div>
      <Menu
        secondary
        style={{
          backgroundColor: "#1B1C1D",
          padding: "0.5rem 1rem",
          border: "none",
        }}
      >
        <Menu.Item header>
          <Header as="h3" inverted>
            Management
            <Header.Subheader style={{ fontSize: "0.8rem", color: "#ccc" }}>
              chuwa
            </Header.Subheader>
          </Header>
        </Menu.Item>

        <Menu.Item style={{ flex: 1 }}>
          <Input
            placeholder="Search..."
            fluid
            icon={<Icon name="search" link onClick={handleSearch} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
        </Menu.Item>

        <Menu.Menu position="right">
          <Menu.Item
            onClick={() => navigate("/sign-out")}
            style={{ color: "#fff" }}
          >
            <Icon name="user" style={{ marginRight: "0.5rem" }} />
            Sign out
          </Menu.Item>
          <Menu.Item
            onClick={() => setCartVisible(true)}
            style={{ color: "#fff" }}
          >
            <Icon name="shopping cart" style={{ marginRight: "0.5rem" }} />$
            {totalPrice.toFixed(2)}
          </Menu.Item>
        </Menu.Menu>
      </Menu>

      <CartSidebar
        visible={cartVisible}
        onClose={() => setCartVisible(false)}
        cartItems={cartItems}
        totalPrice={totalPrice}
        promoCode={promoCode}
        setPromoCode={setPromoCode}
        handleApplyPromo={handleApplyPromo}
        handleRemoveItem={handleRemoveItem}
        handleUpdateQuantity={handleUpdateQuantity}
      />
    </div>
  );
};

export default HeaderBar;
