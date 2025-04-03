import React from "react";
import { Container, Header, Button, Icon } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import useWindowSize from "../../hooks/useWindowSize";
import HeaderBar from "../../components/HeaderBar";

const ErrorPage = () => {
  const navigate = useNavigate();
  const { width } = useWindowSize();
  const isMobile = width < 600;

  const cartItems = [];
  const totalPrice = 0;
  const promoCode = "";
  const setPromoCode = () => {};
  const handleApplyPromo = () => {};
  const handleRemoveItem = () => {};
  const handleUpdateQuantity = () => {};

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

      <Container
        text
        textAlign="center"
        style={{ marginTop: isMobile ? "2rem" : "5rem" }}
      >
        <Icon name="exclamation circle" size="huge" color="violet" />
        <Header as="h1" style={{ marginTop: "1rem" }}>
          Oops, something went wrong!
        </Header>
        <Button primary onClick={() => navigate("/")}>
          Go Home
        </Button>
      </Container>
    </div>
  );
};

export default ErrorPage;
