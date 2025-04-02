import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import BottomBar from '../component/BottomBar';
import HeaderBar from '../component/HeaderBar';
import '../App.css';

function ErrorPage() {
    const navigate = useNavigate();

    return (
        <>
          <HeaderBar />
          <Container className="error-page-container d-flex flex-column align-items-center justify-content-center">
            {/* Exclamation symbol in a circle */}
            <div className="custom-exclamation-circle mb-3">!</div>
    
            {/* Title */}
            <h3 className="text-center mb-4">Oops, something went wrong!</h3>
    
            {/* Button */}
            <Button variant="primary" onClick={() => navigate('/products')}>
              Go Home
            </Button>
          </Container>
          <BottomBar />
        </>
      );
    }
    
export default ErrorPage;