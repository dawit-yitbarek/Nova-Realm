import React, { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import api from "./Api";
import ValidateInput from "./ValidateInput";
import GoogleLogin from "./GoogleLogin"
import LoadingSpinner from "./LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from 'react-router-dom';
const FrontEndUrl = import.meta.env.VITE_FRONTEND_URL;
const BackEndUrl = import.meta.env.VITE_BACKEND_URL;

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);
  const [validError, setValidError] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(false);
  const [matchError, setMatchError] = useState("");
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  const [isCodeError, setIsCodeError] = useState(false);
  const [codeMessage, setCodeMessage] = useState("");
  const [visibleVerify, setVisibleVerify] = useState(false);
  const [loading, setLoading] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [searchParams] = useSearchParams();

  const validated = passwordValid && passwordMatch && email.length > 0 && name.length > 0;

  useEffect(() => {
    setReferralCode(searchParams.get('ref'))
  }, []);

  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();

    try {
      const response = await api.post(`${BackEndUrl}/register`, { email, password, referralCode, name });
      console.log(response.data);
      if (response.data?.success) {
        setVisibleVerify(true);
      }

      if (response.data?.message && !response.data?.success) {
        setError(response.data?.message);
      }
    } catch (error) {
      if (error.response && error.response.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Registration failed.");
      }
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleNameInput = (event) => {
    setName(event.target.value);
  };

  const handleEmailInput = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordInput = (event) => {
    const value = event.target.value;
    setPassword(value);
    setPasswordValid(ValidateInput(value));
    setValidError("Use at least 8 characters, including a letter and a number.");
    if (value !== confirmedPassword) {
      setPasswordMatch(false);
      setMatchError("Passwords must match");
    } else if (value === confirmedPassword) {
      setPasswordMatch(true);
    }
  };

  const handlePasswordConfirm = (event) => {
    const value = event.target.value;
    setConfirmedPassword(value);
    if (value !== password) {
      setPasswordMatch(false);
      setMatchError("Passwords must match");
    } else {
      setPasswordMatch(true);
      setMatchError("");
    }
  };

  const handleVerifyInput = (event) => {
    const val = event.target.value;
    if (/^\d*$/.test(val)) setCode(val); // Allow only digits
  };

  const handleCodeSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();
    try {
      const response = await api.post(`${BackEndUrl}/verify-email`, { code, email, referralCode, name });
      if (response.data?.success) {
        localStorage.setItem("accessToken", response.data?.accessToken);
        navigate("/");
        return;
      }

      setIsCodeError(true);
      setCodeMessage(response.data?.message);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col justify-between bg-gradient-to-r from-[#1f1c2c] to-[#928dab]">
      <section className="w-full max-w-xl bg-gray-900 p-8 text-white rounded-2xl shadow-lg mx-auto mt-6 flex-grow">

        {/* Registration Form */}
        <div style={visibleVerify ? { display: "none" } : { display: "block" }}>
          <header className="text-center slide-fade-up" style={{ fontFamily: "'Outfit', sans-serif" }}>
            <h2 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-600 bg-clip-text text-transparent mb-4 tracking-wide">
              Welcome Aboard!
            </h2>
            <p className="text-lg bg-gradient-to-r from-blue-300 via-purple-400 to-indigo-500 bg-clip-text text-transparent font-light leading-relaxed">
              Join the frontier of digital rewards. Sign up now and unlock a new experience in crypto airdrops and rewards. Let’s get you started!
            </p>
          </header>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="register-name" className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                spellCheck="false"
                id="register-name"
                value={name}
                onChange={handleNameInput}
                className="w-full px-4 py-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="register-email" className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                spellCheck="false"
                id="register-email"
                value={email}
                onChange={handleEmailInput}
                className="w-full px-4 py-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={visible ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={handlePasswordInput}
                  className="w-full px-4 py-2 pr-10 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                <button
                  type="button"
                  onClick={() => setVisible(!visible)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {visible ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {!passwordValid && <p className="text-xs text-red-500 mt-1">{validError}</p>}
            </div>

            <div className="mb-4 relative">
              <label htmlFor="confirm-password" className="block text-sm font-medium mb-2">Confirm Password</label>
              <input
                type={visible ? "text" : "password"}
                id="confirm-password"
                value={confirmedPassword}
                onChange={handlePasswordConfirm}
                className="w-full px-4 py-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              {!passwordMatch && <p className="text-xs text-red-500 mt-1">{matchError}</p>}
            </div>

            {loading && <LoadingSpinner />}
            <button
              disabled={!validated || loading}
              className={`w-full py-2 mt-4 rounded-md text-white font-semibold transition ${!validated || loading ? 'bg-gray-600 cursor-not-allowed opacity-50' : 'bg-purple-600 hover:bg-purple-700'}`}
              style={{ display: loading ? "none" : "block" }} >
              Sign Up
            </button>

          </form>

          <p className="text-red-500 mt-4">{error}</p>

          <GoogleLogin btnName="Signup with Google" referr={referralCode} disabled={loading}/>

          <p className="text-sm mt-4 text-center">
            Already have an account?{" "}
            <Link to={`${FrontEndUrl}/signin`} className="text-purple-400 hover:underline">Sign in</Link>
          </p>

        </div>

        {/* Email Verification */}
        <div style={visibleVerify ? { display: "block" } : { display: "none" }} className="bg-gray-900 rounded-2xl shadow-lg p-8 animate-fadeIn">
          <h1 className="text-3xl font-extrabold mb-4 text-center bg-gradient-to-r from-purple-300 via-purple-400 to-purple-500 bg-clip-text text-transparent">
            ✉️ Verify Your Email
          </h1>

          <p className="text-base text-center text-gray-300 font-medium mb-6">
            A verification code has been sent to <span className="font-semibold text-white">{email}</span>.<br />
            The code is valid for <strong>10 minute</strong>.
          </p>

          <form onSubmit={handleCodeSubmit}>
            <div className="mb-4">
              <label htmlFor="code" className="block text-base font-medium mb-2 text-gray-200">
                Verification Code
              </label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={handleVerifyInput}
                maxLength={6}
                placeholder="Enter 6-digit code"
                className="w-full px-4 py-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-center tracking-widest text-lg"
              />
              {isCodeError && <p className="text-sm text-red-400 mt-2 font-medium">{codeMessage}</p>}
            </div>

            {loading && <LoadingSpinner />}
            <button
              type="submit"
              className="w-full py-2 mt-4 rounded-md text-white font-semibold bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 transition"
              style={{ display: loading ? "none" : "block" }} >
              Verify
            </button>
          </form>
        </div>

      </section>

      <footer className="w-full bg-gradient-to-r from-[#16131f] to-[#6b5e76] py-3 text-center text-xs text-gray-300 border-t border-gray-700 mt-12">
        <div className="max-w-xl mx-auto">
          <p className="mb-2 tracking-wide">&copy; {new Date().getFullYear()} Bricks. All rights reserved.</p>
          <div className="flex justify-center items-center gap-4">
            <a
              href="https://t.me/Siolpo"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-300 transition"
            >
              Support
            </a>
            <span className="text-gray-500">|</span>
            <Link to="/privacy" className="hover:text-purple-300 transition">
              Privacy Policy
            </Link>
            <span className="text-gray-500">|</span>
            <Link to="/terms" className="hover:text-purple-300 transition">
            Terms of Service
            </Link>
          </div>
        </div>
      </footer>

    </main>
  );

}

export default Register;
