import React from "react";
import { Container, Header, Button, Icon } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import useWindowSize from "../../hooks/useWindowSize";

const ErrorPage = () => {
  const navigate = useNavigate();
  const { width } = useWindowSize();
  const isMobile = width < 600;

  return (
    <Container
      text
      textAlign="center"
      style={{ marginTop: isMobile ? "2rem" : "5rem" }}
    >
      <Icon name="exclamation circle" size="huge" color="violet" />
      <Header as="h1" style={{ marginTop: "1rem" }}>
        Oops, something went wrong!
      </Header>
      <Button primary onClick={() => navigate("/")}>
        Go Home
      </Button>
    </Container>
  );
};

export default ErrorPage;
