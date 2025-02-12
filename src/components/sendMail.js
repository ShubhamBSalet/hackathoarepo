// const nodemailer = require("nodemailer");

// // Function to generate a 6-digit OTP
// const generateOtp = () => {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// };

// // Function to send OTP via email
// const sendMail = async (email, otp) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: "your-email@gmail.com", // Replace with your email
//         pass: "your-email-password",  // Replace with your app password
//       },
//     });

//     const mailOptions = {
//       from: "your-email@gmail.com", // Sender address
//       to: email, // Receiver's email
//       subject: "Your OTP Code",
//       text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log("OTP sent successfully!");
//   } catch (error) {
//     console.error("Error sending OTP:", error);
//   }
// };

// // Export both functions
// module.exports = {
//   sendMail,
//   generateOtp,
// };


const nodemailer = require("nodemailer");

// Function to generate a 6-digit OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Function to send OTP via email
const sendMail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "shubhamsalet2005@gmail.com", // Replace with your email
        pass: "shubhamsalet2005",  // Replace with your app password
      },
    });

    const mailOptions = {
      from: "your-email@gmail.com", // Sender address
      to: email, // Receiver's email
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    console.log("OTP sent successfully!");
  } catch (error) {
    console.error("Error sending OTP:", error);
  }
};

// Export both functions
module.exports = {
  sendMail,
  generateOtp,
};


