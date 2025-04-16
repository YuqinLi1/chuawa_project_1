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
        setServerError("Failed to update password. Please try again.");
      }
    }
  };

  return (
    <div className="page-container">
      <HeaderBar />

      {/* Centered middle layout */}
      <div className="layout-wrapper">
        <div className="login-box">
          <h5 className="text-center mb-3">Please input your email, your ID and new password</h5>
          
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
              
            <Form.Field className="mb-2 password-input-wrapper">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={newPassword}
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
      </div>
      <Footer />
    </div>
  );
}

export default PasswordReset;
