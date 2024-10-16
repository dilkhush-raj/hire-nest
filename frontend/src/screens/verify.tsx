import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Verify() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [feedback, setFeedback] = useState("");

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }
  if (!user) return <div>User not found</div>;
  if (user.emailVerified) {
    navigate("/");
    return null;
  }

  const sendOtp = async () => {
    setFeedback("Sending OTP...");
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_HOST_URL}/api/v1/verify/send-email-otp`,
        {
          email: user.email,
          name: user.name,
        },
        { withCredentials: true }
      );
      setOtpSent(true);
      setFeedback("OTP sent successfully!");
    } catch (error) {
      setFeedback("Failed to send OTP. Please try again." + error);
    }
  };

  const verifyOtp = async () => {
    setFeedback("Verifying OTP...");
    try {
      await axios.post(
        `${
          import.meta.env.VITE_BACKEND_HOST_URL
        }/api/v1/verify/verify-email-otp`,
        { email: user.email, otp },
        { withCredentials: true }
      );
      setFeedback("Email verified successfully!");
      setTimeout(() => (window.location.href = "/dashboard"), 1000);
    } catch (error) {
      setFeedback("Invalid OTP. Please try again." + error);
    }
  };

  const resendOtp = async () => {
    setFeedback("Resending OTP...");
    try {
      await axios.post(
        `${
          import.meta.env.VITE_BACKEND_HOST_URL
        }/api/v1/verify/resend-email-otp`,
        {
          email: user.email,
          name: user.name,
        },
        { withCredentials: true }
      );
      setFeedback("OTP resent successfully!");
    } catch (error) {
      setFeedback("Failed to resend OTP. Please try again." + error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] p-4 flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-4">Verify Your Email</h2>
      <p className="mb-4">An OTP will be sent to: {user.email}</p>
      {!otpSent ? (
        <button
          onClick={sendOtp}
          className="bg-accent text-white font-bold py-2 px-4 rounded"
        >
          Send OTP
        </button>
      ) : (
        <div className="flex flex-col items-center">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="border-2 border-gray-300 p-2 rounded mb-4"
          />
          <div className="flex gap-4">
            <button
              onClick={resendOtp}
              className="bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Resend OTP
            </button>
            <button
              onClick={verifyOtp}
              className="bg-accent text-white font-bold py-2 px-4 rounded"
            >
              Verify OTP
            </button>
          </div>
        </div>
      )}
      {feedback && <p className="mt-4 text-center">{feedback}</p>}
    </div>
  );
}
