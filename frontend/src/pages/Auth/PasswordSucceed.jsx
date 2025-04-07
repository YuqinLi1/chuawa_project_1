import React from "react";
import { Container, Button } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import HeaderBar from "../components/HeaderBar";
import Footer from "../components/Footer";
import "../App.css";

function PasswordSucceed() {
  const navigate = useNavigate();

  return (
    <>
      <HeaderBar />
      <Container className="page-container d-flex justify-content-center align-items-center">
        <div className="login-box text-center">
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
    </>
  );
}

export default PasswordSucceed;