import React, { useState } from "react";
import collegelogo from "../assets/collegelogo.png";
import "../styles/ForgotPassword.css";
import { toast } from "react-toastify";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    try {
      const response = await axios.post(`${baseUrl}/api/v1/forgot-password`, {
        email,
      });
      toast.success("Reset link sent to email");
      setEmail("");
    } catch (error) {
      toast.error(
        error.response?.data?.msg ||
          error.message ||
          "Failed to send reset link"
      );
    }
  };

  return (
    <div className="forgot-main">
      <div className="forgot-left">
        <img src={collegelogo} />
      </div>
      <div className="forgot-right">
        <div className="forgot-right-container">
          <div className="forgot-center">
            <h2>Forgot Password</h2>
            <p>Please enter your Email id</p>
            <form onSubmit={handleSubmit}>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required={true}
                />
              </div>
              <div className="forgot-center-buttons">
                <button type="submit" className="reset-button">
                  Send Reset Link
                </button>
                <a href="/login">Go Back</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ForgotPassword;
