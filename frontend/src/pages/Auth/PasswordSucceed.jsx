import React from "react";
import { Container, Button, Icon } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import HeaderBar from "../../components/HeaderBar";
import Footer from "../../components/Footer";
import { useWindowSizeContext } from "../../contexts/WindowSizeContext";
import "../../App.css";

function PasswordSucceed() {
  const navigate = useNavigate();
  const windowSize = useWindowSizeContext();
  const isMobile = windowSize.width < 768;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <HeaderBar />

      <Container
        style={{
          flex: "1 0 auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: isMobile ? "1rem" : "2rem",
        }}
      >
        <div
          style={{
            width: isMobile ? "100%" : "400px",
            maxWidth: "100%",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            padding: isMobile ? "1.5rem" : "2rem",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "4rem",
              color: "#5829e3",
              marginBottom: "1rem",
            }}
          >
            <Icon name="check circle outline" />
          </div>

          <h2
            style={{
              fontSize: isMobile ? "1.5rem" : "1.75rem",
              marginBottom: "1rem",
            }}
          >
            Success!
          </h2>

          <p
            style={{
              fontSize: isMobile ? "1rem" : "1.1rem",
              marginBottom: "1.5rem",
              color: "#555",
            }}
          >
            We already changed your password. Please log in again.
          </p>

          <Button
            fluid
            style={{
              backgroundColor: "#5829e3",
              color: "white",
              height: isMobile ? "40px" : "45px",
              fontSize: isMobile ? "0.9rem" : "1rem",
            }}
            onClick={() => navigate("/login")}
          >
            Log In
          </Button>
        </div>
      </Container>

      <Footer />
    </div>
  );
}

export default PasswordSucceed;
