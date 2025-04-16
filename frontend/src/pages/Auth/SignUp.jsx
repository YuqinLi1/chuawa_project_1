import React, { useState } from "react";
import { Container, Form, Input, Button, Message } from "semantic-ui-react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import HeaderBar from "../../components/HeaderBar";
import Footer from "../../components/Footer";
import { useWindowSizeContext } from "../../contexts/WindowSizeContext";
import "../../App.css";

function SignUp() {
  const navigate = useNavigate();
  const windowSize = useWindowSizeContext();
  const isMobile = windowSize.width < 768;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [serverError, setServerError] = useState("");

  const validate = () => {
    let valid = true;
    setEmailError("");
    setPasswordError("");
    setServerError("");

    if (!email.includes("@")) {
      setEmailError("Invalid email");
      valid = false;
    }

    if (!email) {
      setEmailError("Missing email");
      valid = false;
    }

    if (!password) {
      setPasswordError("Missing password");
      valid = false;
    }

    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        { email, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        navigate("/products");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setServerError("User already exists, please login");
      } else {
        navigate("/error", {
          state: {
            message: "Registration failed. Please try again later",
          },
        });
      }
    }
  };

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
          }}
        >
          <h2
            style={{
              textAlign: "center",
              marginBottom: "1.5rem",
              fontSize: isMobile ? "1.5rem" : "1.75rem",
            }}
          >
            Sign up an account
          </h2>

          {serverError && (
            <Message negative style={{ marginBottom: "1rem" }}>
              {serverError}
            </Message>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Field style={{ marginBottom: "1rem" }}>
              <label>Email</label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fluid
                size={isMobile ? "small" : "large"}
              />
              {emailError && (
                <div
                  style={{
                    color: "red",
                    marginTop: "0.5rem",
                    fontSize: "0.9rem",
                  }}
                >
                  {emailError}
                </div>
              )}
            </Form.Field>

            <Form.Field
              style={{
                marginBottom: "1.5rem",
                position: "relative",
              }}
            >
              <label>Password</label>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fluid
                size={isMobile ? "small" : "large"}
                action={{
                  content: showPassword ? "Hide" : "Show",
                  onClick: () => setShowPassword(!showPassword),
                  style: {
                    color: "#5829e3",
                    padding: isMobile ? "0.5rem" : "0.75rem",
                  },
                }}
                actionPosition="right"
              />
              {passwordError && (
                <div
                  style={{
                    color: "red",
                    marginTop: "0.5rem",
                    fontSize: "0.9rem",
                  }}
                >
                  {passwordError}
                </div>
              )}
            </Form.Field>

            <Button
              type="submit"
              fluid
              style={{
                backgroundColor: "#5829e3",
                color: "white",
                height: isMobile ? "40px" : "45px",
                fontSize: isMobile ? "0.9rem" : "1rem",
              }}
            >
              Create Account
            </Button>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "1.5rem",
                fontSize: isMobile ? "0.85rem" : "0.9rem",
              }}
            >
              <span>
                Already have an account?{" "}
                <Link to="/login" style={{ color: "#5829e3" }}>
                  Sign in
                </Link>
              </span>
            </div>
          </Form>
        </div>
      </Container>

      <Footer />
    </div>
  );
}
export default SignUp;
