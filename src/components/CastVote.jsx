import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CastVote = () => {
  const [voterId, setVoterId] = useState("");
  const [token, setToken] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const navigate = useNavigate();

  // Mock candidate data (later, fetch from blockchain)
  useEffect(() => {
    setCandidates([
      { id: 1, name: "Alice Johnson" },
      { id: 2, name: "Bob Smith" },
      { id: 3, name: "Charlie Brown" }
    ]);
  }, []);

  // Function to submit vote
  const castVote = () => {
    // Validate voter ID & token
    const storedTokenData = JSON.parse(localStorage.getItem("voterToken"));
    if (!storedTokenData || storedTokenData.voterId !== voterId || storedTokenData.newToken !== token) {
      alert("Invalid Voter ID or Token!");
      return;
    }

    if (!selectedCandidate) {
      alert("Please select a candidate!");
      return;
    }

    // Here, you would send the vote to the blockchain
    alert(`Vote casted successfully for ${selectedCandidate}!`);
    
    // Clear token after voting
    localStorage.removeItem("voterToken");
    navigate("/"); // Redirect to results page after voting
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Cast Your Vote</h2>

      <div className="mb-3">
        <label className="form-label">Voter ID</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter your Voter ID"
          value={voterId}
          onChange={(e) => setVoterId(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Voting Token</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter your Token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Select Candidate</label>
        <select
          className="form-select"
          value={selectedCandidate}
          onChange={(e) => setSelectedCandidate(e.target.value)}
        >
          <option value="">-- Select a Candidate --</option>
          {candidates.map((candidate) => (
            <option key={candidate.id} value={candidate.name}>
              {candidate.name}
            </option>
          ))}
        </select>
      </div>

      <button className="btn btn-primary" onClick={castVote}>
        Submit Vote
      </button>

      <div className="mt-3">
        <button className="btn btn-secondary" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default CastVote;
