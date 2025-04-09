import React, { useEffect, useState } from "react";
import { Menu, Header, Icon } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserSidebar from "./UserSidebar";

function HeaderBar() {
  const [user, setUser] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data from token on mount (optional enhancement)
    axios
      .get("http://localhost:5000/api/auth/me", { withCredentials: true })
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null));
  }, []);

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