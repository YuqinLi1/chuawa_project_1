import React, { useState } from "react";
import {
  Container,
  Form,
  Input,
  Button,
  Message,
} from "semantic-ui-react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import HeaderBar from "../components/HeaderBar";
import Footer from "../components/Footer";
import "../App.css";

function PasswordReset() {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        { id, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        navigate("/p-succeed");
      }
    } catch (error) {
      setServerError("Update failed. Please check your id");
    }
  };

  return (
    <>
      <HeaderBar />
      <Container className="page-container d-flex justify-content-center align-items-center">
        <div className="login-box">
          <h4 className="text-center mb-4">Input your id and updated password</h4>

          <Form onSubmit={handleSubmit}>
            <Form.Field className="mb-2">
              <Input
                type="id"
                placeholder="id"
                value={id}
                onChange={(e) => setId(e.target.value)}
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
              Update my password
            </Button>
          </Form>
        </div>
      </Container>
      <Footer />
    </>
  );
}

export default PasswordReset;