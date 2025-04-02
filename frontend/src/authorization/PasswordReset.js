import React from 'react';
import { Container } from 'react-bootstrap';
import HeaderBar from '../component/HeaderBar';
import BottomBar from '../component/BottomBar';
import '../App.css';

function PasswordReset() {
  return (
    <>
      <HeaderBar />
      <Container className="page-container d-flex justify-content-center align-items-center">
        <div className="login-box text-center">
          <div style={{ fontSize: '40px' }}>📧</div>
          <p className="mt-3">
            We have sent the update password link to your email, please check that!
          </p>
        </div>
      </Container>
      <BottomBar />
    </>
  );
}

export default PasswordReset;