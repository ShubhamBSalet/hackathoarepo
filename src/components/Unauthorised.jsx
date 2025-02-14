import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Unauthorized() {
  const navigate = useNavigate();

  const handleGoToLogin = () => {
    navigate("/login");
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Row className="w-100">
        <Col md={6} className="mx-auto">
          <Card className="shadow-lg p-4 border-0 text-center" style={{ borderRadius: "15px" }}>
            <Card.Body>
              <h1 className="text-danger mb-4">401 - Unauthorized</h1>
              <p className="lead">You are not authorized to access this page. Please log in to continue.</p>
              <Button variant="primary" onClick={handleGoToLogin}>
                Go to Login
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
