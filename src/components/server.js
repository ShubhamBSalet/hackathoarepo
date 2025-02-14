
const jwt = require("jsonwebtoken");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { sendMail, generateOtp } = require('./sendMail');

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
  otp: { type: String } // Store OTP temporarily
});
const User = mongoose.model("User", userSchema);

// JWT Secret Key
const JWT_SECRET = "your_jwt_secret_key";

// Login Route
app.post("/login", async (req, res) => {
  try {
    const { voterId, password } = req.body;

    // Check if the user exists and the password matches
    const user = await User.findOne({ voterId, password });
    if (!user) {
      return res.status(401).json({ message: "Invalid voter ID or password" });
    }

    // Generate OTP
    const otp = generateOtp();
    user.otp = otp;
    await user.save();

    // Send OTP to registered email
    await sendMail(user.email, otp);
    console.log(`OTP for ${voterId}: ${otp}`);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// OTP Verification Route
app.post("/verify-otp", async (req, res) => {
  try {
    const { voterId, otp } = req.body;
    const user = await User.findOne({ voterId, otp });

    if (user) {
      // Clear OTP after successful verification
      user.otp = undefined;
      await user.save();

      // Generate JWT token
      const token = jwt.sign({ voterId: user.voterId }, JWT_SECRET, { expiresIn: "1h" });

      res.status(200).json({ message: "OTP verified successfully!", token });
    } else {
      res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

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

// Protected Route Example
app.get("/protected", verifyToken, (req, res) => {
  res.status(200).json({ message: "This is a protected route", voterId: req.voterId });
});

// Start the server
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

