import React, { Component, useState} from 'react';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Form, Button, Alert} from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import BottomBar from '../component/BottomBar';
import HeaderBar from '../component/HeaderBar';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [serverError, setServerError] = useState('');

  const validate = () => {
    let valid = true;
    setEmailError('');
    setPasswordError('');
    setServerError('');

    // Simple email validation
    if (!email.includes('@')) {
      setEmailError('Invalid email');
      valid = false;
    }

    if (!email) {
      setEmailError('Missing email');
      valid = false;
    }

    if (!password) {
      setPasswordError('Missing password');
      valid = false;
    }

    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/login',
        { email, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        navigate('/products');
      }
    } catch (error) {
      console.error('Login error:', error);
      setServerError('No user found, please try again');
    }
  };

  return (
    <>
      <HeaderBar/>
      <Container className="page-container d-flex justify-content-center align-items-center">
        <div className="login-box">
          <h4 className="text-center mb-4">Sign in to your account</h4>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-2">
              <Form.Control
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && <div className="text-danger mt-1">{emailError}</div>}
            </Form.Group>

            <Form.Group className="mb-2 position-relative">
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="show-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </span>
              {passwordError && <div className="text-danger mt-1">{passwordError}</div>}
            </Form.Group>

            <Button type="submit" className="login-button">
              Sign In
            </Button>

            <div className="d-flex justify-content-between login-links">
              <span>
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary">Sign up</Link>
              </span>
              <span
                className="text-primary"
                role="button"
                onClick={() => navigate('/p-update')}
              >
                Forgot password?
              </span>
            </div>
          </Form>
        </div>
      </Container>
      <BottomBar/>
    </>
  );
}

export default Login;