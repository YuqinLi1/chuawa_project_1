import React from "react";
import {
  Sidebar,
  Segment,
  Header,
  Icon,
  Message,
  Input,
  Button,
  Image,
  Divider,
} from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { useWindowSizeContext } from "../contexts/WindowSizeContext";

function CartSidebar({
  visible,
  onClose,
  cartItems,
  totalPrice,
  promoCode,
  setPromoCode,
  handleApplyPromo,
  handleRemoveItem,
  handleUpdateQuantity,
}) {
  const navigate = useNavigate();
  const windowSize = useWindowSizeContext();
  const isMobile = windowSize.width < 768;

  const taxRate = 0.1;
  const tax = (totalPrice * taxRate).toFixed(2);

  const discount = 20.0;

  const estimatedTotal = (totalPrice + Number(tax) - discount).toFixed(2);

  const handleCheckout = () => {
    onClose();

    // Navigate to error page
    navigate("/error");
  };

  return (
    <Sidebar
      as={Segment}
      animation="overlay"
      direction="right"
      visible={visible}
      style={{
        width: isMobile ? "100%" : "400px",
        padding: 0,
        margin: 0,
        border: "none",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          backgroundColor: "#ffffff",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "1rem",
            backgroundColor: "#5829e3",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Header as="h3" style={{ margin: 0, color: "white" }}>
            <Icon name="shopping cart" /> Cart ({cartItems.length})
          </Header>
          <Icon
            name="close"
            size="large"
            style={{ cursor: "pointer" }}
            onClick={onClose}
          />
        </div>

        {/* Cart content */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "1rem",
          }}
        >
          {cartItems.length === 0 ? (
            <Message info>
              <Message.Header>Your cart is empty</Message.Header>
              <p>Add products to see them here.</p>
            </Message>
          ) : (
            cartItems.map((item) => (
              <div
                key={item._id}
                style={{
                  display: "flex",
                  marginBottom: "1.5rem",
                  alignItems: "center",
                }}
              >
                <Image
                  src={
                    item.product.imageUrl ||
                    "https://via.placeholder.com/60?text=No+Image"
                  }
                  size="tiny"
                  style={{
                    marginRight: "1rem",
                    width: "70px",
                    height: "70px",
                    objectFit: "cover",
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "bold", marginBottom: "0.25rem" }}>
                    {item.product.name}
                  </div>
                  <div style={{ color: "#5829e3", fontWeight: "bold" }}>
                    ${item.product.price.toFixed(2)}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginRight: "0.5rem",
                  }}
                >
                  <Button
                    icon="minus"
                    size="mini"
                    circular
                    onClick={() =>
                      handleUpdateQuantity(item._id, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                    style={{
                      backgroundColor: "#f0f0f0",
                      color: "#333",
                    }}
                  />
                  <div
                    style={{
                      margin: "0 0.5rem",
                      minWidth: "20px",
                      textAlign: "center",
                    }}
                  >
                    {item.quantity}
                  </div>
                  <Button
                    icon="plus"
                    size="mini"
                    circular
                    onClick={() =>
                      handleUpdateQuantity(item._id, item.quantity + 1)
                    }
                    style={{
                      backgroundColor: "#f0f0f0",
                      color: "#333",
                    }}
                  />
                </div>
                <div
                  style={{
                    color: "#666",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    textDecoration: "underline",
                  }}
                  onClick={() => handleRemoveItem(item._id)}
                >
                  Remove
                </div>
              </div>
            ))
          )}

          {cartItems.length > 0 && (
            <>
              {/* Promo code area */}
              <div style={{ margin: "1.5rem 0" }}>
                <div
                  style={{
                    marginBottom: "0.5rem",
                    fontSize: "0.9rem",
                    color: "#666",
                  }}
                >
                  Apply Discount Code
                </div>
                <div style={{ display: "flex" }}>
                  <Input
                    placeholder="20 DOLLAR OFF"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <Button
                    style={{
                      backgroundColor: "#5829e3",
                      color: "white",
                      marginLeft: "0.5rem",
                    }}
                    onClick={handleApplyPromo}
                  >
                    Apply
                  </Button>
                </div>
              </div>

              <Divider />

              {/* Order summary */}
              <div style={{ margin: "1.5rem 0" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.75rem",
                  }}
                >
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.75rem",
                  }}
                >
                  <span>Tax</span>
                  <span>${tax}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.75rem",
                    color: "#5829e3",
                  }}
                >
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                    marginTop: "1rem",
                  }}
                >
                  <span>Estimated total</span>
                  <span>${estimatedTotal}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Checkout button */}
        {cartItems.length > 0 && (
          <div style={{ padding: "1rem" }}>
            <Button
              fluid
              style={{
                backgroundColor: "#5829e3",
                color: "white",
                padding: "1rem",
                fontSize: "1rem",
              }}
              onClick={handleCheckout}
            >
              Continue to checkout
            </Button>
          </div>
        )}
      </div>
    </Sidebar>
  );
}

export default CartSidebar;
