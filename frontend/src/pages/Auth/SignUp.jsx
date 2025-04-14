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
        setServerError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="page-container">
      <HeaderBar />
  
      {/* Centered middle layout */}
      <div className="layout-wrapper">
        <div className="login-box">
          <h4 className="text-center mb-3">Sign up an account</h4>
  
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
              {emailError && (
                <div className="mt-1 input-error">{emailError}</div>
              )}
            </Form.Field>
  
            <Form.Field className="mb-2 password-input-wrapper">
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
                <div className="mt-1 input-error">{passwordError}</div>
               )}
            </Form.Field>
  
            <Button type="submit" fluid className="login-button">
            Create an Account
            </Button>
  
            <div className="d-flex justify-content-between login-links mt-2">
              <span>
              Already have an account? <Link to="/login" className="text-primary">Sign in</Link>
              </span>
            </div>
          </Form>
        </div>
      </div>
  
      <Footer />
    </div>
  );

}

export default SignUp;
