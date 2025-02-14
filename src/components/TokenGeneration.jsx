import React, { useState, useEffect } from "react";
import { InputGroup, FormControl, Button, Card, Container, Row, Col, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Dropdown } from "primereact/dropdown";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { useNavigate } from "react-router-dom";

const TokenGeneration = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/unauthorized"); // Redirect to unauthorized if not logged in
    }
  }, [navigate]);

  const [voterKey, setVoterKey] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // Candidate list
  const candidates = [
    { label: "Candidate A", value: "A" },
    { label: "Candidate B", value: "B" },
    { label: "Candidate C", value: "C" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (voterKey && selectedCandidate) {
      try {
        const token = localStorage.getItem("token");
        const voterId = JSON.parse(atob(token.split(".")[1])).voterId; // Extract voterId from token

        // Validate the voter key
        const response = await fetch("http://localhost:8000/validate-voter-key", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ voterId, voterKey }),
        });

        const data = await response.json();
        if (response.ok) {
          // Confirmation popup
          const isConfirmed = window.confirm(`Are you sure you want to vote for ${selectedCandidate}?`);
          if (isConfirmed) {
            alert(`Your vote for ${selectedCandidate} has been recorded.`);
            navigate("/"); // Redirect to homepage after confirmation
          }
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
      }
    } else {
      alert("Please fill in all fields!");
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow-lg p-4 border-0" style={{ borderRadius: "15px" }}>
            <Card.Body>
              <h2 className="text-center mb-4 text-primary">Cast Your Vote</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label><strong>Voter Key:</strong></Form.Label>
                  <InputGroup>
                    <FormControl
                      value={voterKey}
                      onChange={(e) => setVoterKey(e.target.value)}
                      placeholder="Enter your Voter Key"
                      required
                    />
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label><strong>Select Candidate:</strong></Form.Label>
                  <Dropdown
                    value={selectedCandidate}
                    options={candidates}
                    onChange={(e) => setSelectedCandidate(e.value)}
                    placeholder="Select a Candidate"
                    className="w-100"
                    required
                  />
                </Form.Group>

                <Button type="submit" variant="success" className="w-100">
                  Submit Vote
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TokenGeneration;
