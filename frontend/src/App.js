import { Routes, Route } from "react-router-dom";
import ErrorPage from "./pages/Error/ErrorPage";
import ProductPage from "./pages/Product/ProductPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/product" element={<ProductPage />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

export default App;
