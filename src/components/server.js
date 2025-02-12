const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { sendMail, generateOtp } = require('./sendMail');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/voterDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Create a Schema and Model for User
const userSchema = new mongoose.Schema({
  voterId: { type: String, unique: true, required: true },
  mobileNumber: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  otp: { type: String, required: false }
});


const User = mongoose.model("User", userSchema);

// Signup Route
// app.post("/signup", async (req, res) => {
//   try {
//     const { voterId, mobileNumber, email, password } = req.body;
//     const existingUser = await User.findOne({ voterId });

//     if (existingUser) {
//       return res.status(409).json({ message: "Voter ID already registered." });
//     }

//     const otp = generateOTP(); // Generate OTP

//     // Save new user with OTP
//     const newUser = new User({ voterId, mobileNumber, email, password, otp });
//     await newUser.save();

//     // Simulate OTP sending (e.g., via email/SMS)
//     console.log(`OTP for ${voterId}: ${otp}`);

//     res.status(201).json({ message: "User registered successfully! OTP sent." });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// OTP verify route
// Route to verify OTP

// Signup Route
app.post("/signup", async (req, res) => {
  try {
    const { voterId, mobileNumber, email, password } = req.body;
    const existingUser = await User.findOne({ voterId });

    if (existingUser) {
      return res.status(409).json({ message: "Voter ID already registered." });
    }

    const otp = generateOtp(); // Generate OTP

    // Save new user with OTP
    const newUser = new User({ voterId, mobileNumber, email, password, otp });
    await newUser.save();

    // Send OTP via email
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
      res.sendStatus(200);
    } else {
      res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

let otpStore = {}; // In-memory store (use Redis or DB in production)
app.post("/store-otp", (req, res) => {
  const { voterId, otp } = req.body;
  otpStore[voterId] = otp;
  setTimeout(() => delete otpStore[voterId], 600000); // OTP expires in 10 minutes
  res.sendStatus(200);
});

// Login Route (Keep only one version)
app.post("/login", async (req, res) => {
  
  console.log("Login request received:", req.body); // Add this line
  
  try {
    const { voterId, password } = req.body;
    const user = await User.findOne({ voterId, password });

    if (user) {
      res.status(200).json({ message: "Login successful" });
    } 
    else {
      res.status(401).json({ message: "Invalid Voter ID or Password" });
    }
  } 
  catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});



// Handle 404 for all other routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start the server
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});