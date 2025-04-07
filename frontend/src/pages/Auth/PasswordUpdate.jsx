import React, { useState } from "react";
import { Container, Form, Input, Button, Message } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import HeaderBar from "../components/HeaderBar";
import Footer from "../components/Footer";
import axios from "axios";
import "../App.css";

function PasswordUpdate() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [serverError, setServerError] = useState("");

  const validate = () => {
    setServerError("");
    if (!email) {
      setServerError("Please enter your email.");
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
        { email },
        { withCredentials: true }
      );

      if (res.status === 200) {
        navigate("/p-reset", {
          state: {
            email: res.data.email,
            tempPassword: res.data.tempPassword,
          },
        });
      }
    } catch (error) {
      const status = error.response?.status;
      if (status === 400) {
        setServerError("No user found.");
      } else if (status === 500) {
        setServerError("Failed to send temp password, please try again.");
      } else {
        setServerError("Unexpected error occurred.");
      }
    }
  };

  return (
    <>
      <HeaderBar />
      <Container className="page-container d-flex justify-content-center align-items-center">
        <div className="login-box">
          <h5 className="text-center">Update your password</h5>
          <p className="text-center">
            Enter your email, we will send your temporary password.
          </p>

          {serverError && (
            <Message negative className="text-center">
              {serverError}
            </Message>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Field className="mb-3">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
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

export default PasswordUpdate;