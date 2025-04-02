import React from 'react';
import './Component.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function BottomBar() {
  return (
    <footer className="bottom-bar d-flex justify-content-between align-items-center">
      <div>@2025 All Right Reserved</div>
      <div className="footer-social-icons position-absolute start-50 translate-middle-x d-flex">
        <a href="#" className="text-white me-3">
          <i className="bi bi-youtube"></i>
        </a>
        <a href="#" className="text-white me-3">
          <i className="bi bi-facebook"></i>
        </a>
        <a href="#" className="text-white">
          <i className="bi bi-twitter"></i>
        </a>
      </div>
      <div className="ms-auto d-flex">
        <a href="#">Contact Us</a>
        <a href="#">Privacy Policies</a>
        <a href="#">Help</a>
      </div>
    </footer>
  );
}

export default BottomBar;