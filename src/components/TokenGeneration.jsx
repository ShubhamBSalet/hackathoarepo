import React, { useState } from "react";
import { Steps } from "primereact/steps";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import emailjs from "emailjs-com";

const TokenGeneration = () => {
    const navigate = useNavigate();
    const [activeIndex, setActiveIndex] = useState(0);
    const [voterId, setVoterId] = useState("");
    const [otp, setOtp] = useState("");
    const [privateKey, setPrivateKey] = useState("");
    const [token, setToken] = useState("");
    const [email, setEmail] = useState("");

    const generatePrivateKey = () => {
        const newPrivateKey = "PK-" + Math.random().toString(36).substr(2, 10);
        setPrivateKey(newPrivateKey);
        setActiveIndex(3);
    };

    const generateToken = () => {
        const newToken = "TOKEN-" + Math.random().toString(36).substr(2, 8);
        setToken(newToken);
        setActiveIndex(4);
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text("Voting System Token", 10, 10);
        doc.text(`Voter ID: ${voterId}`, 10, 20);
        doc.text(`Token ID: ${token}`, 10, 30);
        return doc;
    };

    const sendEmail = () => {
        const doc = generatePDF();
        const pdfData = doc.output("datauristring");

        const emailParams = {
            voter_email: email,
            voter_id: voterId,
            token_id: token,
            attachment: pdfData,
        };

        emailjs.send(
            "service_n2qnm6a",  // Replace with EmailJS service ID
            "templete_4hvdar3",  // Replace with EmailJS template ID
            emailParams,
            "vyWiSsszZzsabofw_"       // Replace with EmailJS public key
        )
        .then((response) => {
            alert("Token PDF sent to email!");
            console.log("Email sent:", response);
        })
        .catch((error) => {
            console.error("Error sending email:", error);
        });
    };

    const steps = [
        { label: "Enter Voter ID" },
        { label: "Verify OTP" },
        { label: "Generate Private Key" },
        { label: "Token Generated" }
    ];

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Token Generation Process</h2>
            <Steps model={steps} activeIndex={activeIndex} />
            <div className="card p-4 mt-4">
                {activeIndex === 0 && (
                    <div>
                        <h5>Step 1: Enter Voter ID</h5>
                        <InputText value={voterId} onChange={(e) => setVoterId(e.target.value)} placeholder="Enter Voter ID" className="form-control mb-3" />
                        <Button label="Next" onClick={() => setActiveIndex(1)} className="btn btn-primary" />
                    </div>
                )}
                {activeIndex === 1 && (
                    <div>
                        <h5>Step 2: Verify OTP</h5>
                        <InputText value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" className="form-control mb-3" />
                        <Button label="Verify & Next" onClick={() => setActiveIndex(2)} className="btn btn-success" />
                    </div>
                )}
                {activeIndex === 2 && (
                    <div>
                        <h5>Step 3: Generate Private Key</h5>
                        <Button label="Generate Key" onClick={generatePrivateKey} className="btn btn-warning" />
                    </div>
                )}
                {activeIndex === 3 && (
                    <div>
                        <h5>Step 4: Token Generated</h5>
                        <p><strong>Private Key:</strong> {privateKey}</p>
                        
                        <label>Enter Email:</label>
                        <InputText value={email} onChange={(e) => setEmail(e.target.value)} className="form-control mb-3" />
                        
                        {/* <Button label="Send Token via Email" className="btn btn-danger" onClick={sendEmail} /> */}
                        
                        <Button label="Go to Cast Vote" className="btn btn-success mt-3" onClick={(sendEmail) => navigate("/vote")} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default TokenGeneration;
