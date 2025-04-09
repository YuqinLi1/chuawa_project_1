import React, { useState } from "react";
import { Container, Form, Input, Button, Message } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import HeaderBar from "../../components/HeaderBar";
import Footer from "../../components/Footer";
import axios from "axios";
import "../../App.css";

function PasswordReset() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    setServerError("");
    if (!email || !userId || !password) {
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
          password,
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
        setServerError("Failed to update password. Please try again.");
      }
    }
  };

  return (
    <>
      <HeaderBar />
      <Container className="page-container d-flex justify-content-center align-items-center">
        <div className="login-box">
          <h5 className="text-center mb-3">
            Please input your email, your ID and new password
          </h5>

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
            </Form.Field>
            <Form.Field className="mb-2">
              <Input
                placeholder="User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
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
            </Form.Field>

            <Button type="submit" fluid className="login-button">
              Update Password
            </Button>
          </Form>
        </div>
      </Container>
      <Footer />
    </>
  );
}

export default PasswordReset;