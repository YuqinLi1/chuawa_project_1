import React, { useState } from "react";
import { Container, Form, Input, Button, Message } from "semantic-ui-react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import HeaderBar from "../../components/HeaderBar";
import Footer from "../../components/Footer";
import "../../App.css";

function Login() {
  const navigate = useNavigate();
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
        "http://localhost:5000/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        navigate("/products");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setServerError(
          "User not exists or password doesn't match record. Please try again or register."
        );
      } else {
        setServerError("Internal Service Error: Backend is down");
      }
    }
  };

  return (
    <>
      <HeaderBar />
      <Container className="page-container d-flex justify-content-center align-items-center">
        <div className="login-box">
          <h4 className="text-center mb-3">Sign in to your account</h4>

          {serverError && (
            <Message negative className="text-center">
              {serverError}
            </Message>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Field className="mb-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && <div className="text-danger mt-1">{emailError}</div>}
            </Form.Field>

            <Form.Field className="mb-2 position-relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="show-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </span>
              {passwordError && (
                <div className="text-danger mt-1">{passwordError}</div>
              )}
            </Form.Field>

            <Button type="submit" fluid className="login-button">
              Sign In
            </Button>

            <div className="d-flex justify-content-between login-links">
              <span>
                Don&apos;t have an account?{" "}
                <Link to="/signup" className="text-primary">
                  Sign up
                </Link>
              </span>
              <span
                className="text-primary"
                role="button"
                onClick={() => navigate("/p-reset")}
              >
                Forgot password?
              </span>
            </div>
          </Form>
        </div>
      </Container>
      <Footer />
    </>
  );
}

export default Login;