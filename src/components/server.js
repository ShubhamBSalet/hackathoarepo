const jwt = require("jsonwebtoken");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { sendMail, generateOtp } = require('./sendMail');
const crypto = require("crypto"); // Import crypto module for generating hash

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/voterDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// User Schema and Model
const userSchema = new mongoose.Schema({
  voterId: { type: String, required: true, unique: true },
  mobileNumber: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  otp: { type: String }, // Store OTP temporarily
  voterKey: { type: String }, // Store voter key
});
const User = mongoose.model("User", userSchema);

// JWT Secret Key
const JWT_SECRET = "your_jwt_secret_key";

// Generate a random hash string
const generateHash = () => {
  return crypto.randomBytes(16).toString("hex"); // Generates a 32-character hex string
};

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(403).json({ message: "No token provided." });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized!" });
    }
    req.voterId = decoded.voterId;
    next();
  });
};

// Route to generate and send voter key
app.post("/generate-voter-key", verifyToken, async (req, res) => {
  try {
    const { voterId } = req.body;

    // Find the user
    const user = await User.findOne({ voterId });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Generate a hash string
    const voterKey = generateHash();
    user.voterKey = voterKey;
    await user.save();

    // Send the voter key to the user's email
    await sendMail(user.email, `Your Voter Key: ${voterKey}`);
    console.log(`Voter key for ${voterId}: ${voterKey}`);

    res.status(200).json({ message: "Voter key sent to your email.", voterKey });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to validate voter key
app.post("/validate-voter-key", verifyToken, async (req, res) => {
  try {
    const { voterId, voterKey } = req.body;

    // Find the user and check if the voter key matches
    const user = await User.findOne({ voterId, voterKey });
    if (!user) {
      return res.status(400).json({ message: "Invalid voter key." });
    }

    res.status(200).json({ message: "Voter key is valid." });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Start the server
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
