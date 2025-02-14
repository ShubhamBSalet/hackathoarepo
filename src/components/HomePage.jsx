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

  const handleVoteClick = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/unauthorized"); // Redirect if no token
        return;
      }

      const voterId = JSON.parse(atob(token.split(".")[1])).voterId; // Extract voterId from token

      // Send request to generate and send voter key
      const response = await fetch("http://localhost:8000/generate-voter-key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ voterId }),
      });

      if (!response.ok) {
        const errorText = await response.text(); // Log the error response
        console.error("Server Error:", errorText);
        throw new Error("Failed to generate voter key");
      }

      const data = await response.json();
      alert("Voter key sent to your email. Please check your inbox.");
      navigate("/token"); // Redirect to token page
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
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
