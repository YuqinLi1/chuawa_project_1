import React, { useState } from "react";
import { Container, Form, Input, Button, Message } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import HeaderBar from "../../components/HeaderBar";
import Footer from "../../components/Footer";
import axios from "axios";
import { useWindowSizeContext } from "../../contexts/WindowSizeContext";
import "../../App.css";

function PasswordReset() {
  const navigate = useNavigate();
  const windowSize = useWindowSizeContext();
  const isMobile = windowSize.width < 768;

  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [newPassword, setPassword] = useState("");
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    setServerError("");
    if (!email || !userId || !newPassword) {
      setServerError("Please fill in all fields.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await axios.put(
        "http://localhost:5000/api/auth/updatePassword",
        {
          email,
          userId,
          newPassword,
        },
        { withCredentials: true }
      );

      if (res.status === 200) {
        navigate("/p-succeed");
      }
    } catch (error) {
      const status = error.response?.status;
      if (status === 400) {
        setServerError("Email and ID do not match.");
      } else {
        navigate("/error", {
          state: {
            message: "Internal Service Error: Backend is down",
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
            position: "relative",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              marginBottom: "1.5rem",
              fontSize: isMobile ? "1.25rem" : "1.5rem",
            }}
          >
            Update your password
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
            </Form.Field>

            <Form.Field style={{ marginBottom: "1rem" }}>
              <label>User ID</label>
              <Input
                placeholder="Enter your User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                fluid
                size={isMobile ? "small" : "large"}
              />
            </Form.Field>

            <Form.Field
              style={{
                marginBottom: "1.5rem",
                position: "relative",
              }}
            >
              <label>New Password</label>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your new password"
                value={newPassword}
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
              Update Password
            </Button>
          </Form>

          <div
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              cursor: "pointer",
              fontSize: "1.2rem",
            }}
            onClick={() => navigate(-1)}
          >
            ✕
          </div>
        </div>
      </Container>
      <Footer />
    </div>
  );
}

export default PasswordReset;
