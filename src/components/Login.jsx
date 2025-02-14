import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [voterId, setVoterId] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const handleInput = (event) => {
    event.target.value = event.target.value.replace(/\D/g, "").slice(0, 10);
    setVoterId(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voterId, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("OTP sent to your registered email.");
      setOtpSent(true);
    } catch (error) {
      console.error("Error:", error);
      alert("Server error. Please try again.");
    }
  };

  const handleOtpVerification = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voterId, otp }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("OTP verified successfully");
        navigate("/token");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server error. Please try again.");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Row className="w-100">
        <Col md={6} className="p-5 bg-light rounded shadow">
          <h2 className="text-center mb-4">Sign in</h2>

          {!otpSent ? (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="voterId">
                <Form.Label>Your Voter ID</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your Voter ID"
                  pattern="[0-9]{10}"
                  title="Please enter a 10-digit voter ID."
                  required
                  value={voterId}
                  onInput={handleInput}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100">
                Login
              </Button>
            </Form>
          ) : (
            <Form onSubmit={handleOtpVerification}>
              <Form.Group className="mb-3" controlId="otp">
                <Form.Label>Enter OTP</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter the OTP"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100">
                Verify OTP
              </Button>
            </Form>
          )}

          <div className="text-center mt-3">
            <p>
              Don't have account?{" "}
              <span
                className="text-primary"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/")}
              >
                Sign-up here
              </span>
            </p>
          </div>
          <div className="text-center mt-3">
            <p>
              <span
                className="text-primary"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/forgot")}
              >
                Forgot Password
              </span>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
