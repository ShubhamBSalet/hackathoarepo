const nodemailer = require("nodemailer");

const sendMail = async (email, otp) => {
  try {
    let transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: "thankikeval05@gmail.com",
          pass: "cfwb nsci olqb fyad",
        },
        debug: true, // Enable debug mode
        logger: true, // Enable logging
      });
      

    let mailOptions = {
      from: '"OTP Verification" <your_email@gmail.com>',
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
    console.log("OTP sent to email: " + email);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// Function to generate a 6-digit OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = { sendMail, generateOtp };
