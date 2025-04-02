import React, { Component, useState} from 'react';
import { Container, Form, Button, Alert} from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import HeaderBar from '../component/HeaderBar';
import BottomBar from '../component/BottomBar';
import '../App.css';

function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [serverError, setServerError] = useState('');

  const validate = () => {
    let valid = true;
    setEmailError('');
    setPasswordError('');
    setServerError('');

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

  
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/register',
        { email, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        alert('Please input your password and sign in again');
        navigate('/login');
      }
    } catch (error) {
      console.error(error);
      setServerError('Error, please use another email and password');
    }
  };


  return (
    <>
      <HeaderBar />
      <Container className="page-container d-flex justify-content-center align-items-center">
        <div className="login-box">
          <h4 className="text-center mb-4">Sign up an account</h4>

          {serverError && (
            <Alert variant="danger" className="text-center fw-semibold">
              {serverError}
            </Alert>
          )}

          <Form>
            <Form.Group className="mb-3">
            <Form.Control
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && <div className="text-danger mt-1">{emailError}</div>}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {passwordError && <div className="text-danger mt-1">{passwordError}</div>}
            </Form.Group>

            <Button type="submit" className="login-button">Create Account</Button>
            <div className="d-flex justify-content-between login-links">
              <span>
                Already have an account? <Link to="/login">Sign in</Link>
              </span>
            </div>
          </Form>
        </div>
      </Container>
      <BottomBar />
    </>
  );
}

export default SignUp;