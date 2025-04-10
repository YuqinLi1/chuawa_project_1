import { Routes, Route, Navigate } from "react-router-dom";
import ErrorPage from "./pages/Error/ErrorPage";
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import PasswordReset from './pages/Auth/PasswordReset';
import PasswordSucceed from './pages/Auth/PasswordSucceed';
import ProductPage from "./pages/Product/ProductPage";
import CreateProductPage from "./pages/Product/CreateProductPage";
import EditProductPage from "./pages/Product/EditProductPage"
import ProductDetailPage from "./pages/Product/ProductDetailPage";

function App() {
  return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/p-reset" element={<PasswordReset />} />
        <Route path="/p-succeed" element={<PasswordSucceed />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/product/create" element={<CreateProductPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/product/:id/edit" element={<EditProductPage />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
  );
}

export default App;