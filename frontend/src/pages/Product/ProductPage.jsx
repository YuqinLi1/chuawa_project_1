import React, { useState, useEffect } from "react";
import { Container, Dropdown, Button, Image } from "semantic-ui-react";
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

  const productsPerPage = isMobile ? 3 : 8;

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
      window.dispatchEvent(new Event("refresh-cart"));
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

  const handleEdit = (id) => {
    axios
      .get(`http://localhost:5000/api/products/${id}`)
      .then((res) => {
        if (res.data.success && res.data.singleProd) {
          navigate(`/product/${res.data.singleProd._id}/edit`);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch product for editing:", err);
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
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <HeaderBar
        showSearchBar={true}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
      />

      <Container
        style={{
          flex: "1 0 auto",
          padding: isMobile ? "0.5rem" : "2rem",
          maxWidth: isMobile ? "100%" : "1200px",
        }}
      >
        {/* Header row: Title + Sort dropdown + button*/}
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isMobile ? "stretch" : "center",
            marginBottom: "1.5rem",
            gap: isMobile ? "0.75rem" : 0,
          }}
        >
          <h2 className="products-title mb-0">Products</h2>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <Dropdown
              selection
              text={
                sortOption === "date"
                  ? "Price: low to high"
                  : sortOption === "priceLow"
                  ? "Price: low to high"
                  : "Price: high to low"
              }
              style={{
                minWidth: isMobile ? "auto" : "180px",
              }}
              options={[
                { key: "date", text: "Last added", value: "date" },
                {
                  key: "priceLow",
                  text: "Price: low to high",
                  value: "priceLow",
                },
                {
                  key: "priceHigh",
                  text: "Price: high to low",
                  value: "priceHigh",
                },
              ]}
              onChange={(e, { value }) => setSortOption(value)}
            />
            {userRole === "admin" && (
              <Button
                primary
                content="Add Product"
                style={{
                  backgroundColor: "#5829e3",
                  marginLeft: isMobile ? "0" : "0.75rem",
                }}
                onClick={() => navigate("/product/create")}
              />
            )}
          </div>
        </div>

        {isMobile ? (
          <div>
            {paginated.map((product) => (
              <div
                key={product._id}
                style={{
                  marginBottom: "1.5rem",
                  border: "1px solid #eee",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => handleImageClick(product.name)}
                >
                  <Image
                    src={
                      product.imageUrl ||
                      product.image1 ||
                      "https://via.placeholder.com/300x300?text=No+Image"
                    }
                    fluid
                    style={{ width: "100%", height: "auto" }}
                  />
                </div>

                <div style={{ padding: "1rem" }}>
                  <div
                    style={{
                      color: "#666",
                      fontSize: "0.9rem",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {product.name}
                  </div>
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                      marginBottom: "0.75rem",
                    }}
                  >
                    ${product.price ? product.price.toFixed(2) : "0.00"}
                  </div>
                  '
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                      marginBottom: "0.75rem",
                    }}
                  >
                    stock:{product.stock}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    {userRole && (
                      <>
                        <Button
                          primary
                          style={{ backgroundColor: "#5829e3" }}
                          onClick={() =>
                            handleAddCartClick(product._id, product.name)
                          }
                          disabled={product.stock === 0}
                        >
                          Add
                        </Button>

                        {userRole === "admin" && (
                          <>
                            <Button
                              basic
                              onClick={() => handleEdit(product._id)}
                            >
                              Edit
                            </Button>
                            <Button
                              basic
                              color="red"
                              onClick={() => handleDelete(product._id)}
                            >
                              Delete
                            </Button>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Desktop product grid
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "1.5rem",
            }}
          >
            {paginated.map((product) => (
              <div
                key={product._id}
                style={{
                  border: "1px solid #eee",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => handleImageClick(product.name)}
                >
                  <Image
                    src={
                      product.imageUrl ||
                      product.image1 ||
                      "https://via.placeholder.com/300x300?text=No+Image"
                    }
                    fluid
                  />
                </div>

                <div style={{ padding: "1rem" }}>
                  <div
                    style={{
                      color: "#666",
                      fontSize: "0.9rem",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {product.name}
                  </div>

                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                      marginBottom: "0.75rem",
                    }}
                  >
                    ${product.price ? product.price.toFixed(2) : "0.00"}
                  </div>

                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                      marginBottom: "0.75rem",
                    }}
                  >
                    stock:{product.stock}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Button
                      primary
                      style={{ backgroundColor: "#5829e3" }}
                      onClick={() =>
                        handleAddCartClick(product._id, product.name)
                      }
                      disabled={product.stock === 0}
                    >
                      Add
                    </Button>

                    {userRole === "admin" && (
                      <>
                        <Button basic onClick={() => handleEdit(product._id)}>
                          Edit
                        </Button>
                        <Button
                          basic
                          color="red"
                          onClick={() => handleDelete(product._id)}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "2rem",
            }}
          >
            <Button
              icon="angle left"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              style={{ marginRight: "0.25rem" }}
            />

            {Array.from({ length: totalPages }).map((_, idx) => (
              <Button
                key={idx}
                style={{
                  backgroundColor:
                    currentPage === idx + 1 ? "#5829e3" : "transparent",
                  color: currentPage === idx + 1 ? "white" : "black",
                  marginRight: "0.25rem",
                }}
                onClick={() => setCurrentPage(idx + 1)}
              >
                {idx + 1}
              </Button>
            ))}

            <Button
              icon="angle right"
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
            />
          </div>
        )}
      </Container>

      <Footer />
    </div>
  );
}

export default ProductPage;
