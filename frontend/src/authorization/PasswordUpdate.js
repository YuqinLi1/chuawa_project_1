import React, { useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import HeaderBar from '../component/HeaderBar';
import BottomBar from '../component/BottomBar';
import axios from 'axios';
import '../App.css';

function PasswordUpdate() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
  
    try {
      const res = await axios.post(
        'http://localhost:5000/api/auth/send-reset-code',
        { email },
        { withCredentials: true }
      );
  
      if (res.status === 200) {
        navigate('/p-reset', {
          state: {
            email: res.data.email,
            tempPassword: res.data.tempPassword
          }
        });
      }
    } catch (error) {
      console.error(error);
      setServerError('Failed to send reset code. Please try again.');
    }
  };

  return (
    <>
      <HeaderBar />
      <Container className="page-container d-flex justify-content-center align-items-center">
        <div className="login-box">
          <h5 className="text-center">Update your password</h5>
          <p className="text-center">Enter your email, we will send your temporary passowrd.</p>
          <Form>
            <Form.Group className="mb-3">
              <Form.Control type="email" placeholder="Email" />
            </Form.Group>
            <Button className="login-button" onClick={() => navigate('/p-reset')}>
              Update Password
            </Button>
          </Form>
        </div>
      </Container>
      <BottomBar />
    </>
  );
}

export default PasswordUpdate;