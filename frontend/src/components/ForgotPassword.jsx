import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";
import api from "./Api";
import ValidateInput from "./ValidateInput";
import Footer from "./Footer";
const BackEndUrl = import.meta.env.VITE_BACKEND_URL;

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function sendResetEmail() {
    try {
      setError('');
      setSuccessMessage('');
      setLoading(true);

      const response = await api.post(`${BackEndUrl}/send-reset-otp`, { email });
      if (!response.data?.success) {
        setError(response.data?.message);
        return;
      }

      setOtpSent(true);
      setSuccessMessage(response.data?.message);
    } catch (error) {
      setError("Failed to send otp.");
      console.log("Failed to send otp. ", error);
    } finally {
      setLoading(false);
    }
  }

  async function resetPassword() {
    try {
      setError('');
      setSuccessMessage('');
      setLoading(true);

      // First: Validate input locally
      if (!ValidateInput(newPassword)) {
        throw new Error("Use at least 8 characters, including a letter and a number.");
      }

      if (newPassword !== confirmPassword) {
        throw new Error("Passwords must match");
      }

      // Then: If input is valid, make the API request
      const response = await api.post(`/reset-password`, { email, otp, newPassword });

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Failed to reset password");
      }

      setSuccessMessage(response.data?.message);
    } catch (error) {
      setError(error.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-950">
      <header className="text-center py-8">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-600 bg-clip-text text-transparent mb-4">Forgot Password</h1>
        <p className="text-md bg-gradient-to-r from-blue-300 via-purple-400 to-indigo-500 bg-clip-text text-transparent font-light leading-relaxed">
          {otpSent ? "Enter the 6-digit code sent to your email and set a new password." : "We'll send a 6-digit code to your email to verify your identity."}
        </p>
      </header>

      <main className="flex-grow flex items-center justify-center px-4 py-6">
        <section className="w-full max-w-xl bg-gray-800 p-8 text-white rounded-2xl shadow-lg">
          <div>
            {!otpSent ? (
              <>
                <input
                  type="email"
                  spellCheck={false}
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 mb-4"
                />
                {loading && <LoadingSpinner />}
                <button
                  style={{ display: loading ? "none" : "block" }}
                  onClick={sendResetEmail}
                  className="w-full py-2 rounded-md bg-purple-600 hover:bg-purple-700 font-semibold transition"
                >
                  Send 6-Digit Code
                </button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Enter 6-Digit Code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 mb-4"
                />

                <div className="relative mb-4">
                  <div className="flex items-center bg-gray-700 rounded-md focus-within:ring-2 focus-within:ring-purple-600">
                    <input
                      type={visible ? "text" : "password"}
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setVisible(!visible)}
                      className="px-3 text-white"
                    >
                      {visible ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="relative mb-4">
                  <input
                    type={visible ? "text" : "password"}
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 pr-10 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>

                {!loading ? (
                  <button
                    onClick={resetPassword}
                    className="w-full py-2 rounded-md bg-purple-600 hover:bg-purple-700 font-semibold transition"
                  >
                    Reset Password
                  </button>
                ) : (
                  <LoadingSpinner />
                )}
              </>
            )}
          </div>

          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          {successMessage && <p className="text-green-500 text-center mt-4">{successMessage}</p>}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default ForgotPassword;
