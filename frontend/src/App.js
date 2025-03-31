import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Container, Form, Button, Navbar, Nav } from 'react-bootstrap';

class App extends Component {
  state = {
    showPassword: false
  };

  togglePasswordVisibility = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  render() {
    return (
      <>
        {/* 🔝 Top Navbar */}
        <Navbar bg="dark" variant="dark" expand="lg" fixed="top" className="px-4">
          <Navbar.Brand href="#">Management</Navbar.Brand>
          <div className="navbar-search">
            <Form.Control type="text" placeholder="Search..." />
          </div>
          <Nav className="ms-auto d-flex align-items-center gap-3">
            <Button className="nav-signin-button">Sign In</Button>
            <span role="img" aria-label="cart" className="cart-icon">🛒</span>
          </Nav>
        </Navbar>

        {/* 🧾 Login Form */}
        <Container className="login-container d-flex justify-content-center align-items-center">
          <div className="login-box">
            <h4 className="text-center mb-4">Sign in to your account</h4>
            <Form>
              <Form.Group className="mb-3">
                <Form.Control type="email" placeholder="Email" />
              </Form.Group>

              <Form.Group className="mb-2 position-relative">
                <Form.Control
                  type={this.state.showPassword ? 'text' : 'password'}
                  placeholder="Password"
                />
                <span
                  className="show-password-toggle"
                  onClick={this.togglePasswordVisibility}
                >
                  {this.state.showPassword ? 'Hide' : 'Show'}
                </span>
              </Form.Group>

              <Button className="login-button">Sign In</Button>

              <div className="d-flex justify-content-between login-links">
                <span>
                  Don't have an account? <a href="#">Sign up</a>
                </span>
                <a href="#">Forgot password?</a>
              </div>
            </Form>
          </div>
        </Container>

        {/* 🔚 Bottom Footer */}
        <footer className="bottom-bar d-flex justify-content-between">
          <div>@2022 All Right Reserved</div>
          <div>
            <a href="#">Contact Us</a>
            <a href="#">Privacy Policies</a>
            <a href="#">Help</a>
          </div>
        </footer>
      </>
    );
  }
}

export default App;