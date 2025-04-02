import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './authorization/Login';
import SignUp from './authorization/SignUp';
import PasswordUpdate from './authorization/PasswordUpdate';
import PasswordReset from './authorization/PasswordReset';
import Products from './product/Products';
import Details from './product/Details';
import CreateProduct from './product/CreateProduct';
import EditProduct from './product/EditProduct';
import Error from './product/Error';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp/>} />
        <Route path="/p-update" element={<PasswordUpdate/>} />
        <Route path="/p-reset" element={<PasswordReset/>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<Details />} />
        <Route path="/product/create" element={<CreateProduct />} />
        <Route path="/product/:id/edit" element={<EditProduct />} />
        <Route path="/error" element={<Error />} />
      </Routes>
    </Router>
  );
}

export default App;