import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();

  const [voterId, setVoterId] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  // Function to allow only 10-digit numbers
  const handleInput = (event, setterFunction) => {
    const value = event.target.value.replace(/\D/g, "").slice(0, 10);
    setterFunction(value);
  };

  // Update password field without validation
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  // Validate confirm password
  const handleConfirmPasswordValidation = (event) => {
    const newConfirmPassword = event.target.value;
    setConfirmPassword(newConfirmPassword);

    if (newConfirmPassword !== password) {
      setPasswordError("Passwords do not match.");
      setIsFormValid(false);
    } else {
      setPasswordError("");
      setIsFormValid(true);
    }
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    const userData = {
      voterId,
      mobileNumber,
      email,
      password,
    };

    try {
      const response = await fetch("http://localhost:8000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (response.status === 409) {
        alert("Voter ID already registered. Please use a different one.");
      } else if (response.ok) {
        alert("OTP has been sent to your registered email or mobile.");
        setIsOtpSent(true); // Show OTP field
      } else {
        alert("Registration Failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  // Handle OTP submission
  const handleOtpSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voterId, otp }),
      });

      if (response.ok) {
        alert("OTP verified successfully!");
        navigate("/login"); // Redirect to login page
      } else {
        alert("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Row className="w-100">
        <Col md={6} className="p-5 bg-light rounded shadow">
          <h2 className="text-center mb-4">Sign up</h2>

          {isOtpSent ? (
            <Form onSubmit={handleOtpSubmit}>
              <Form.Group className="mb-3" controlId="otp">
                <Form.Label>Enter OTP</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter OTP"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100">
                Verify OTP
              </Button>
            </Form>
          ) : (
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
                  onChange={(e) => handleInput(e, setVoterId)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="mobileNumber">
                <Form.Label>Mobile Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your mobile number"
                  pattern="[0-9]{10}"
                  title="Please enter a 10-digit mobile number."
                  required
                  value={mobileNumber}
                  onChange={(e) => handleInput(e, setMobileNumber)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="emailId">
                <Form.Label>Your Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Set Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={handlePasswordChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="cpassword">
                <Form.Label>Confirm Your Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm your password"
                  required
                  value={confirmPassword}
                  onChange={handleConfirmPasswordValidation}
                />
              </Form.Group>

              {passwordError && <p className="text-danger">{passwordError}</p>}

              <Form.Group className="mb-3" controlId="terms">
                <Form.Check
                  type="checkbox"
                  label="I agree to all statements in Terms of Service"
                  required
                />
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className="w-100"
                disabled={!isFormValid}
              >
                Register
              </Button>
            </Form>
          )}

          <div className="text-center mt-3">
            <p>
              Already have an account?{" "}
              <span
                className="text-primary"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/login")}
              >
                Sign-in here
              </span>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
