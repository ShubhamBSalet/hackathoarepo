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

// Signup Route
app.post('/signup', async (req, res) => {
  try {
    const { voterId, mobileNumber, email, password } = req.body;
    const existingUser = await User.findOne({ voterId });

    if (existingUser) {
      return res.status(409).json({ message: 'Voter ID already registered' });
    }

    // Generate OTP
    const otp = generateOtp();

    // Save new user with OTP
    const newUser = new User({ voterId, mobileNumber, email, password, otp });
    await newUser.save();

    // Send OTP to user email
    await sendMail(email, otp);
    console.log(`OTP for ${voterId}: ${otp}`);

    res.status(201).json({ message: "User registered successfully! OTP sent." });
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
      res.status(200).json({ message: "OTP verified successfully!" });
    } else {
      res.status(400).json({ message: "Invalid OTP" });
    }
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
