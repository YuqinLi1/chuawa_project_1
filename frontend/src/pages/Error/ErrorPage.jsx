import React from "react";
import { Container, Header, Button, Icon } from "semantic-ui-react";
import { useNavigate, useLocation  } from "react-router-dom";
import useWindowSize from "../../hooks/useWindowSize";
import HeaderBar from "../../components/HeaderBar";
import Footer from "../../components/Footer";

const ErrorPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const errorMessage = location.state?.message || "";
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
        minHeight: "100vh",
        margin: 0,
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
          {errorMessage && (
            <p style={{ color: "red", marginTop: "1rem", fontSize: "1rem"}}>
              {errorMessage}
            </p>
          )}
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
