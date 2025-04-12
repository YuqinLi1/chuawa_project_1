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
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <HeaderBar />
      <Container className="page-container d-flex justify-content-center align-items-center">
        <div
          style={{
            width: isMobile ? "100%" : "400px",
            maxWidth: "100%",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "4rem",
              color: "#5829e3",
              marginBottom: "1.5rem",
            }}
          >
            <Icon name="check circle outline" />
          </div>

          <h2 style={{ marginBottom: "1rem" }}>Success!</h2>
          <p className="mt-3">
            We already changed your password. Please log in again.
          </p>
          <Button
            className="login-button mt-3"
            onClick={() => navigate("/login")}
            fluid
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
