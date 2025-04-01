import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './authorization/Login';
import SignUp from './authorization/SignUp';
import PasswordUpdate from './authorization/PasswordUpdate';
import PasswordReset from './pages/PasswordResetPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<SignUp/>} />
        <Route path="/p-update" element={<PasswordUpdate/>} />
        <Route path="/p-reset" element={<PasswordReset/>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;