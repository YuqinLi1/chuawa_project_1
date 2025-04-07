import { Routes, Route } from "react-router-dom";
import ErrorPage from "./pages/Error/ErrorPage";
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import PasswordUpdate from './pages/Auth/PasswordUpdate';
import PasswordReset from './pages/Auth/PasswordReset';
import PasswordSucceed from './pages/Auth/PasswordSucceed';
import ProductPage from "./pages/Product/ProductPage";
import CreateProductPage from "./pages/Product/CreateProductPage";
import ProductDetailPage from "./pages/Product/ProductDetailPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login/>} />
      <Route path="/signup" element={<SignUp/>} />
      <Route path="/p-update" element={<PasswordUpdate/>} />
      <Route path="/p-reset" element={<PasswordReset/>} />
      <Route path="/p-succeed" element={<PasswordSucceed/>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
      <Route path="/products" element={<ProductPage />} />
      <Route path="/products/create-product" element={<CreateProductPage />} />
      <Route path="/products/:id" element={<ProductDetailPage />} />
      <Route path="/error" element={<ErrorPage />} />
    </Routes>
  );
}

export default App;
