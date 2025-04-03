import React from "react";
import { Segment, Container, Icon } from "semantic-ui-react";

function Footer() {
  return (
    <Segment
      inverted
      vertical
      style={{
        backgroundColor: "#1B1C1D",
        padding: "1rem 1rem",
        marginTop: "2rem",
        borderRadius: 0,
      }}
    >
      <Container
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ color: "#fff" }}>©2022 All Rights Reserved.</div>

        <div>
          <Icon
            name="youtube"
            size="large"
            color="grey"
            style={{ marginRight: "1rem" }}
          />
          <Icon
            name="twitter"
            size="large"
            color="grey"
            style={{ marginRight: "1rem" }}
          />
          <Icon name="facebook" size="large" color="grey" />
        </div>

        <div style={{ color: "#fff" }}>
          <a href="/contact" style={{ color: "#fff", marginRight: "1rem" }}>
            Contact us
          </a>
          <a href="/privacy" style={{ color: "#fff", marginRight: "1rem" }}>
            Privacy Policies
          </a>
          <a href="/help" style={{ color: "#fff" }}>
            Help
          </a>
        </div>
      </Container>
    </Segment>
  );
}

export default Footer;
