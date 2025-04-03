import { Routes, Route } from "react-router-dom";
import ErrorPage from "./pages/Error/ErrorPage";
import ProductPage from "./pages/Product/ProductPage";
import CreateProductPage from "./pages/Product/CreateProductPage";
import ProductDetailPage from "./pages/Product/ProductDetailPage";

function App() {
  return (
    <Routes>
      {/* <Route path="/" element={<HomePage />} /> */}
      <Route path="/product" element={<ProductPage />} />
      <Route path="/create-product" element={<CreateProductPage />} />
      <Route path="/products/:id" element={<ProductDetailPage />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

export default App;
