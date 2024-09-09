import React, { useState } from "react";
import collegelogo from "../assets/collegelogo.png";
import "../styles/ResetPassword.css";
import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa6";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { resetToken } = useParams();
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const password = e.target.newPassword.value;

    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/reset-password/${resetToken}`,
        { password }
      );
      localStorage.setItem("auth", JSON.stringify(response.data.token));
      toast.success("Password reset successful");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to reset password");
    }
  };

  return (
    <div className="reset-main">
      <div className="reset-left">
        <img src={collegelogo} />
      </div>
      <div className="reset-right">
        <div className="reset-right-container">
          <div className="reset-center">
            <h2>Reset Password</h2>
            <p>Please enter new Password</p>
            <form onSubmit={handleSubmit}>
              <div className="pass-input-div">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new Password"
                  name="newPassword"
                  required={true}
                />
                {showPassword ? (
                  <FaEyeSlash
                    onClick={() => {
                      setShowPassword(!showPassword);
                    }}
                  />
                ) : (
                  <FaEye
                    onClick={() => {
                      setShowPassword(!showPassword);
                    }}
                  />
                )}
              </div>

              <div className="reset-center-buttons">
                <button type="submit" className="try-btn">
                  Reset Password
                </button>
                <a href="/">Go Back to Home Page</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
