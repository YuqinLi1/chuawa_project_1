import React, { useState, useEffect } from "react";
import { Container, Dropdown, Button, Input, Icon, Menu, Header } from "semantic-ui-react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import UserSidebar from "./UserSidebar";
import "../App.css";

function HeaderBar({ showSearchBar}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/auth/me", { withCredentials: true })
      .then((res) => {
        setUser(res.data.user);
      })
      .catch(() => {
        setUser(null);
      });
  }, []);

  const handleSearch = async () => {
    const term = searchTerm.trim() || "all";
    try {
      const res = await axios.get(`http://localhost:5000/api/products/search/${term}`)
      navigate("/products", { state: { products: res.data.products } });
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  return (
    <>
      <Menu secondary style={{ backgroundColor: "#1B1C1D", padding: "0.5rem 1rem" }}>
        <Menu.Item header>
          <Header as="h3" inverted>
            Management
            <Header.Subheader style={{ fontSize: "0.8rem", color: "#ccc" }}>
              chuwa
            </Header.Subheader>
          </Header>
        </Menu.Item>

        {showSearchBar && location.pathname === "/products" && (
            <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
              <Input
                placeholder="Input name to search a product."
                style={{ width: "50%" }}
                icon={<Icon name="search" link onClick={handleSearch} />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
              />
            </div>
          )}

        <Menu.Menu position="right">
          {!user ? (
            <Menu.Item style={{ color: "#ccc" }}>
              <Icon name="user" />
              Sign In
            </Menu.Item>
          ) : (
            <Menu.Item onClick={() => setSidebarVisible(true)} style={{ color: "#fff" }}>
              <Icon name="user" />
              Hello, {user.email}
            </Menu.Item>
          )}
        </Menu.Menu>
      </Menu>

      <UserSidebar
        visible={sidebarVisible}
        onHide={() => setSidebarVisible(false)}
        user={user}
      />
    </>
  );
}

export default HeaderBar;
