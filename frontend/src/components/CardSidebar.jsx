import React from "react";
import {
  Sidebar,
  Segment,
  Header,
  Icon,
  Message,
  Input,
  Button,
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
                onChange={(e) =>
                  handleUpdateQuantity(item._id, Number(e.target.value))
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
      <Button basic fluid style={{ marginTop: "0.5rem" }} onClick={onClose}>
        Close
      </Button>
    </Sidebar>
  );
}

export default CartSidebar;
