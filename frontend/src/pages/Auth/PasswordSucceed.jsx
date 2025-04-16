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
    <div className="page-container">
      <HeaderBar />
      <div className="layout-wrapper">
      <div className="login-box">
      <h2 className="text-center mb-5">Success!</h2>
      <h4 className="text-center mb-3"> We already changed your password. Please log in again.</h4>
      <Button
            className="login-button mt-3"
            onClick={() => navigate("/login")}
          >
          Log In
      </Button>
      </div>
      </div>
      <Footer />
    </div>
  );
}

export default PasswordSucceed;
