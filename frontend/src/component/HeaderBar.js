import React from 'react';
import { Navbar, Nav, Form, Button } from 'react-bootstrap';
import './Component.css';

function HeaderBar() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top" className="top-bar">
          <Navbar.Brand href="#">Management</Navbar.Brand>
          <div className="navbar-search">
            <Form.Control type="text" placeholder="Search..." />
          </div>
          <Nav className="ms-auto d-flex align-items-center gap-3">
            <Button className="nav-signin-button">Sign In</Button>
            <span role="img" aria-label="cart" className="cart-icon">🛒</span>
          </Nav>
    </Navbar>
  );
}

export default HeaderBar;