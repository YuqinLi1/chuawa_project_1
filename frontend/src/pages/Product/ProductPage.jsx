import React, { useState, useEffect } from "react";
import { Container, Dropdown, Button, Input, Icon } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import HeaderBar from "../../components/HeaderBar";
import Footer from "../../components/Footer";
import "../../App.css";

function ProductPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("date");
  const [userRole, setUserRole] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const productsPerPage = 8;

  useEffect(() => {
    fetchProducts();
    axios
      .get("http://localhost:5000/api/auth/me", { withCredentials: true })
      .then((res) => {
        setUserRole(res.data.user?.role?.toLowerCase());
      })
      .catch((err) => {
        console.error("Failed to fetch user role:", err);
      });
  }, []);

  const fetchProducts = () => {
    axios
      .get("http://localhost:5000/api/products")
      .then((res) => {
        if (res.data.success) {
          setProducts(res.data.allProducts);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
      });
  };

  const handleSearch = () => {
    if (!searchTerm) return;
    axios
      .get(`http://localhost:5000/api/products?search=${searchTerm}`)
      .then((res) => {
        if (res.data.success) {
          setProducts(res.data.allProducts);
        }
      })
      .catch((err) => {
        console.error("Search failed:", err);
      });
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/api/products/${id}`, {
        withCredentials: true,
      })
      .then(() => {
        fetchProducts();
      })
      .catch((err) => {
        console.error("Failed to delete product:", err);
      });
  };

  const getSortedProducts = () => {
    let sorted = [...products];
    if (sortOption === "date") {
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortOption === "priceLow") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortOption === "priceHigh") {
      sorted.sort((a, b) => b.price - a.price);
    }
    return sorted;
  };

  const sortedProducts = getSortedProducts();
  const paginated = sortedProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );
  const totalPages = Math.ceil(products.length / productsPerPage);

  return (
    <>
      <HeaderBar showSearchBar={true} searchTerm={searchTerm} setSearchTerm={setSearchTerm} handleSearch={handleSearch} />
      <Container fluid className="products-page-container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="m-0">Products</h4>
          <Dropdown
            selection
            value={sortOption}
            onChange={(e, { value }) => setSortOption(value)}
            options={[
              { key: "date", value: "date", text: "Sorted by date" },
              { key: "low", value: "priceLow", text: "Price - Low to High" },
              { key: "high", value: "priceHigh", text: "Price - High to Low" },
            ]}
            style={{ minWidth: "200px" }}
          />
        </div>

        <div className="product-grid">
          {paginated.map((product) => (
            <div className="product-container" key={product._id}>
              <img
                src={product.image1}
                alt={product.name}
                className="product-image"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/product/${product._id}`)}
              />
              <div className="product-name">{product.name}</div>
              <div className="product-price">${product.price}</div>
              <div className="product-buttons">
                <Button size="tiny" color="green">
                  Add
                </Button>
                {userRole === "admin" && (
                  <>
                    <Button
                      size="tiny"
                      color="yellow"
                      onClick={() => navigate(`/product/${product._id}/edit`)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="tiny"
                      color="red"
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="d-flex justify-content-end mt-4 pe-3">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <Button
              key={idx}
              color={currentPage === idx + 1 ? "blue" : undefined}
              basic={currentPage !== idx + 1}
              size="tiny"
              className="me-2"
              onClick={() => setCurrentPage(idx + 1)}
            >
              {idx + 1}
            </Button>
          ))}
        </div>
      </Container>
      <Footer />
    </>
  );
}

export default ProductPage;