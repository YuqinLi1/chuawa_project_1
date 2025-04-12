import React, { useState, useEffect } from "react";
import { Container, Dropdown, Button, Input, Icon } from "semantic-ui-react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import HeaderBar from "../../components/HeaderBar";
import Footer from "../../components/Footer";
import { useWindowSizeContext } from "../../contexts/WindowSizeContext";
import "../../App.css";

function ProductPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const windowSize = useWindowSizeContext();
  const isMobile = windowSize.width < 768;

  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("date");
  const [userRole, setUserRole] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [cartMessage, setCartMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const productsPerPage = isMobile ? 1 : 8;

  useEffect(() => {
    if (location.state?.products) {
      setProducts(location.state.products);
    } else {
      fetchProducts();
    }
    axios
      .get("http://localhost:5000/api/auth/me", { withCredentials: true })
      .then((res) => {
        setUserRole(res.data.user?.role?.toLowerCase());
      })
      .catch((err) => {
        console.error("Failed to fetch user role:", err);
      });
  }, [location.state]);

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

  const handleAddCartClick = async (productId, productName) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/cart",
        {
          productId: productId,
          quantity: 1,
        },
        { withCredentials: true }
      );

      console.log("Cart response:", response.data);
      setCartMessage(`Added ${productName} to cart!`);
      setErrorMessage("");
    } catch (err) {
      console.error("Error adding to cart:", err.message);

      if (err.response) {
        if (err.response.status === 401) {
          setErrorMessage("Please log in to add items to cart");
        } else {
          setErrorMessage(
            `Failed to add product to cart: ${
              err.response.data.message || "Unknown error"
            }`
          );
        }
      } else if (err.request) {
        setErrorMessage("Server not responding. Please try again later.");
      } else {
        setErrorMessage(`Error: ${err.message}`);
      }

      setCartMessage("");
    }
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      fetchProducts();
      return;
    }
    axios
      .get(`http://localhost:5000/api/products/search/${searchTerm}`)
      .then((res) => {
        if (res.data.success) {
          setProducts(res.data.products);
          setCurrentPage(1);
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

  const handleImageClick = (name) => {
    axios
      .get(`http://localhost:5000/api/products/name/${name}`)
      .then((res) => {
        if (res.data.success && res.data.singleProd) {
          const product = res.data.singleProd;
          navigate(`/product/${product._id}`);
        }
      })
      .catch((err) => {
        console.error("Failed to load product details:", err);
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
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <HeaderBar
        showSearchBar={true}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
      />
      <Container fluid className="products-page-container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 style={{ margin: 0 }}>Products</h2>
          <div>
            <Dropdown
              className="products-sort"
              value={sortOption}
              onChange={(e, { value }) => setSortOption(value)}
              options={[
                { key: "date", text: "Sorted by date", value: "date" },
                {
                  key: "priceLow",
                  text: "Sorted by price - Low to High",
                  value: "priceLow",
                },
                {
                  key: "priceHigh",
                  text: "Sorted by price - High to Low",
                  value: "priceHigh",
                },
              ]}
            />
          </div>
        </div>

        <div className="product-grid">
          {paginated.map((product) => (
            <div className="product-container" key={product._id}>
              <img
                src={product.image1}
                alt={product.name}
                className="product-image"
                style={{ cursor: "pointer" }}
                onClick={() => handleImageClick(product.name)}
              />
              <div className="product-name">{product.name}</div>
              <div className="product-price">${product.price}</div>
              <div className="product-buttons">
                <Button
                  size="tiny"
                  color="green"
                  onClick={() => handleAddCartClick(product._id, product.name)}
                  disabled={product.stock === 0}
                >
                  Add
                </Button>
                {userRole === "admin" && (
                  <>
                    <Button
                      size="tiny"
                      color="yellow"
                      onClick={() => {
                        axios
                          .get(
                            `http://localhost:5000/api/products/name/${product.name}`
                          )
                          .then((res) => {
                            if (res.data.success && res.data.singleProd) {
                              navigate(
                                `/product/${res.data.singleProd._id}/edit`
                              );
                            }
                          })
                          .catch((err) => {
                            console.error(
                              "Failed to fetch product for editing:",
                              err
                            );
                          });
                      }}
                    >
                      Edit
                    </Button>

                    <Button
                      size="tiny"
                      color="red"
                      onClick={() => {
                        axios
                          .get(
                            `http://localhost:5000/api/products/name/${product.name}`
                          )
                          .then((res) => {
                            if (res.data.success && res.data.singleProd) {
                              const id = res.data.singleProd._id;
                              axios
                                .delete(
                                  `http://localhost:5000/api/products/${id}`,
                                  {
                                    withCredentials: true,
                                  }
                                )
                                .then(() => fetchProducts())
                                .catch((err) => {
                                  console.error(
                                    "Failed to delete product:",
                                    err
                                  );
                                });
                            }
                          })
                          .catch((err) => {
                            console.error(
                              "Failed to fetch product for deletion:",
                              err
                            );
                          });
                      }}
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
    </div>
  );
}

export default ProductPage;
