// import React from "react";
// import { Container, Row, Col, Card, Button } from "react-bootstrap";
// import { useNavigate } from "react-router-dom"; // Import useNavigate
// import "bootstrap/dist/css/bootstrap.min.css";

// export default function HomePage() {
//   const navigate = useNavigate(); // Initialize useNavigate

//   const handleVoteClick = () => {
//     navigate("/token"); // Redirect to TokenPage on click
//   };

//   const handleResultClick = () => {
//     alert("Results will be displayed here!");
//   };

//   // Custom styles for the card
//   const cardStyle = {
//     borderRadius: "15px",
//     transition: "transform 0.3s",
//     transform: "scale(1)",
//     boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
//     minHeight: "400px",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//   };

//   const hoverEffect = {
//     transform: "scale(1.05)",
//   };

//   // Center container and adjust top margin for text
//   const containerStyle = {
//     minHeight: "100vh",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//   };

//   const textStyle = {
//     marginTop: "20px",
//   };

//   return (
//     <Container style={containerStyle}>
//       <Row className="justify-content-center">
//         <Col lg={6} className="mb-4">
//           <Card
//             className="shadow-lg border-0"
//             style={cardStyle}
//             onMouseEnter={(e) =>
//               (e.currentTarget.style.transform = hoverEffect.transform)
//             }
//             onMouseLeave={(e) =>
//               (e.currentTarget.style.transform = "scale(1)")
//             }
//           >
//             <Card.Body className="text-center">
//               <Card.Title className="mb-3" style={{ fontSize: "3rem" }}>
//                 Vote Now
//               </Card.Title>
//               <Card.Text style={{ fontSize: "1.5rem", ...textStyle }}>
//                 Participate in the voting process and make your voice heard!
//               </Card.Text>
//               <Button variant="primary" size="lg" onClick={handleVoteClick}>
//                 Vote Now
//               </Button>
//             </Card.Body>
//           </Card>
//         </Col>

//         <Col lg={6} className="mb-4">
//           <Card
//             className="shadow-lg border-0"
//             style={cardStyle}
//             onMouseEnter={(e) =>
//               (e.currentTarget.style.transform = hoverEffect.transform)
//             }
//             onMouseLeave={(e) =>
//               (e.currentTarget.style.transform = "scale(1)")
//             }
//           >
//             <Card.Body className="text-center">
//               <Card.Title className="mb-3" style={{ fontSize: "3rem" }}>
//                 Vote Result
//               </Card.Title>
//               <Card.Text style={{ fontSize: "1.5rem", ...textStyle }}>
//                 Check the results of the voting and see the outcome!
//               </Card.Text>
//               <Button variant="success" size="lg" onClick={handleResultClick}>
//                 View Results
//               </Button>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// }
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

