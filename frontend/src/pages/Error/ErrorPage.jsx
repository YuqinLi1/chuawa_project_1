import React from "react";
import { Container, Header, Button, Icon } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import useWindowSize from "../../hooks/useWindowSize";
import HeaderBar from "../../components/HeaderBar";
import Footer from "../../components/Footer";

const ErrorPage = () => {
  const navigate = useNavigate();
  const { width } = useWindowSize();
  const isMobile = width < 768;

  const cartItems = [];
  const totalPrice = 0;
  const promoCode = "";
  const setPromoCode = () => {};
  const handleApplyPromo = () => {};
  const handleRemoveItem = () => {};
  const handleUpdateQuantity = () => {};

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh", // ensures full viewport height
        margin: 0, // remove default body margin if needed
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

      <Container
        text
        textAlign="center"
        style={{
          marginTop: isMobile ? "2rem" : "5rem",
          flex: 1,
          padding: "1rem",
        }}
      >
        <Icon name="exclamation circle" size="huge" color="red" />
        <Header as="h1" style={{ marginTop: "1rem" }}>
          Oops, something went wrong!
        </Header>
        <Button primary onClick={() => navigate("/products")}>
          Go Home
        </Button>
      </Container>
      <Footer />
    </div>
  );
};

export default ErrorPage;
