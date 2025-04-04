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
} from "semantic-ui-react";

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
  const taxRate = 0.1;
  const tax = (totalPrice * taxRate).toFixed(2);

  const discount = 20.0;

  const estimatedTotal = (totalPrice + Number(tax) - discount).toFixed(2);

  return (
    <Sidebar
      as={Segment}
      animation="overlay"
      direction="right"
      visible={visible}
      style={{
        width: "350px",
        padding: "1rem",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Top Section: Cart Title */}
      <div>
        <Header
          as="h3"
          style={{
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Icon name="shopping cart" /> Cart ({cartItems.length})
          <Icon
            name="close"
            style={{ marginLeft: "auto", cursor: "pointer" }}
            onClick={onClose}
          />
        </Header>

        {/* If cart empty, show message */}
        {cartItems.length === 0 ? (
          <Message info>
            <Message.Header>Your cart is empty</Message.Header>
            <p>Add products to see them here.</p>
          </Message>
        ) : (
          // else map items
          cartItems.map((item) => (
            <div
              key={item._id}
              style={{
                display: "flex",
                marginBottom: "1rem",
                alignItems: "center",
              }}
            >
              {/* product show */}
              <Image
                src={
                  item.product.image1 ||
                  "https://via.placeholder.com/60?text=No+Image"
                }
                size="tiny"
                style={{ marginRight: "0.5rem" }}
              />
              <div style={{ flex: 1 }}>
                <strong>{item.product.name}</strong>
                <p style={{ margin: 0 }}>${item.product.price.toFixed(2)}</p>
              </div>
              <div>
                <Button
                  icon="minus"
                  size="mini"
                  onClick={() =>
                    handleUpdateQuantity(item._id, item.quantity - 1)
                  }
                  disabled={item.quantity <= 1}
                />
                <span style={{ margin: "0 0.5rem" }}>{item.quantity}</span>
                <Button
                  icon="plus"
                  size="mini"
                  onClick={() =>
                    handleUpdateQuantity(item._id, item.quantity + 1)
                  }
                />
              </div>
              <Button
                basic
                size="tiny"
                style={{ marginLeft: "0.5rem" }}
                onClick={() => handleRemoveItem(item._id)}
              >
                Remove
              </Button>
            </div>
          ))
        )}

        {/* Promo code area */}
        <div style={{ marginTop: "1rem" }}>
          <Input
            placeholder="Enter promo code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            fluid
            action={{
              color: "blue",
              content: "Apply",
              onClick: handleApplyPromo,
            }}
          />
        </div>

        {/* checkout */}
        <div style={{ marginTop: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Subtotal</span>
            <strong>${totalPrice.toFixed(2)}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Tax</span>
            <strong>${tax}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Discount</span>
            <strong>-${discount.toFixed(2)}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Estimated total</span>
            <strong>${estimatedTotal}</strong>
          </div>
        </div>
      </div>

      {/* Bottom Section: Buttons */}
      <div>
        <Button color="blue" fluid style={{ marginTop: "1rem" }}>
          Continue to checkout
        </Button>
      </div>
    </Sidebar>
  );
}

export default CartSidebar;
