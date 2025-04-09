import React from "react";
import { Sidebar, Menu, Icon } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function UserSidebar({ visible, onHide, user }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });
    document.cookie = "token=; Max-Age=0"; // clear token manually
    navigate("/login");
  };

  console.log("User info:", user);

  return (
    <Sidebar
      as={Menu}
      animation="overlay"
      direction="right"
      icon="labeled"
      vertical
      visible={visible}
      onHide={onHide}
      width="thin"
    >
      <Menu.Item onClick={handleLogout}>
        <Icon name="sign-out" />
        Sign Out
      </Menu.Item>

      {user?.role?.toLowerCase() === "admin" &&  (
        <>
          <Menu.Item onClick={() => navigate("/products/create-product")}>
            <Icon name="plus" />
            Create Product
          </Menu.Item>

          <Menu.Item onClick={() => navigate("/products/create-product")}>
            <Icon name="trash" />
            Delete Product
          </Menu.Item>
        </>
      )}
    </Sidebar>
  );
}

export default UserSidebar;