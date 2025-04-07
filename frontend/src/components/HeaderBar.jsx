import React from "react";
import {
  Menu,
  Input,
  Icon,
  Button,
  Container,
  Header as SemanticHeader,
} from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import "./Components.css";

function HeaderBar({ totalPrice = 0, searchTerm, setSearchTerm, handleSearch }) {
  const navigate = useNavigate();

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch?.();
    }
  };

  return (
    <Menu borderless fixed="top" className="top-bar" style={{ marginBottom: 0 }}>
      <Container fluid className="d-flex justify-content-between align-items-center w-100">
        {/* Left: Brand */}
        <Menu.Item>
          <SemanticHeader as="h4" inverted style={{ marginBottom: 0 }}>
            Management
          </SemanticHeader>
        </Menu.Item>

        {/* Center: Search */}
        <Menu.Item className="navbar-search">
          <Input
            icon={<Icon name="search" link onClick={handleSearch} />}
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            fluid
          />
        </Menu.Item>

        {/* Right: Sign out + cart */}
        <Menu.Menu position="right" className="gap-3 align-items-center">
          <Menu.Item>
            <Button color="blue" onClick={() => navigate("/sign-out")}>
              Sign Out
            </Button>
          </Menu.Item>
          <Menu.Item onClick={() => navigate("/cart")}>
            <span role="img" aria-label="cart" className="cart-icon">
              🛒 ${totalPrice.toFixed(2)}
            </span>
          </Menu.Item>
        </Menu.Menu>
      </Container>
    </Menu>
  );
}

export default HeaderBar;