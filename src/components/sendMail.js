const nodemailer = require("nodemailer");

const sendMail = async (email, voterKey) => {
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
      from: '"Voting System" <your_email@gmail.com>',
      to: email,
      subject: "Your Voter Key is:",
      text: `${voterKey}. Use this key to cast your vote.`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Voter key sent to email: " + email);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = { sendMail, generateOtp };


