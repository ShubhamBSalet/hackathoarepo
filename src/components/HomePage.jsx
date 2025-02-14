import React, { useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/unauthorized"); // Redirect to unauthorized if not logged in
    }
  }, [navigate]);

  const handleVoteClick = () => {
    navigate("/token");
  };

  const handleResultClick = () => {
    alert("Results will be displayed here!");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Container style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Row className="justify-content-center">
        <Col lg={6} className="mb-4">
          <Card className="shadow-lg border-0" style={{ borderRadius: "15px", minHeight: "400px", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Card.Body className="text-center">
              <Card.Title className="mb-3" style={{ fontSize: "3rem" }}>
                Vote Now
              </Card.Title>
              <Card.Text style={{ fontSize: "1.5rem", marginTop: "20px" }}>
                Participate in the voting process and make your voice heard!
              </Card.Text>
              <Button variant="primary" size="lg" onClick={handleVoteClick}>
                Vote Now
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6} className="mb-4">
          <Card className="shadow-lg border-0" style={{ borderRadius: "15px", minHeight: "400px", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Card.Body className="text-center">
              <Card.Title className="mb-3" style={{ fontSize: "3rem" }}>
                Vote Result
              </Card.Title>
              <Card.Text style={{ fontSize: "1.5rem", marginTop: "20px" }}>
                Check the results of the voting and see the outcome!
              </Card.Text>
              <Button variant="success" size="lg" onClick={handleResultClick}>
                View Results
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Button variant="danger" onClick={handleLogout} style={{ position: "absolute", top: "20px", right: "20px" }}>
        Logout
      </Button>
    </Container>
  );
}

