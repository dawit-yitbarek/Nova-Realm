import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "./Api";
import GoogleLogin from "./GoogleLogin";
import LoadingSpinner from "./LoadingSpinner";
import TelegramLogin from "./TelegramConnect";

const FrontEndUrl = import.meta.env.VITE_FRONTEND_URL;
const BackEndUrl = import.meta.env.VITE_BACKEND_URL;

function Signin() {
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const emailLength = email.length === 0;
  const passwordLength = password.length === 0;

  const SigninBtn = async (event) => {
    setLoading(true);
    event.preventDefault();
    try {
      const response = await api.post(`${BackEndUrl}/signin`, { email, password });
      console.log(response.data);
      if (response.data.success) {
        localStorage.setItem("accessToken", response.data.accessToken);
        navigate("/");
      } else {-
        setError(response.data.message);
      }
    } catch (error) {
      console.log("error from signin component", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen justify-between bg-gradient-to-r from-[#1f1c2c] to-[#928dab]">
      <main className="flex flex-1 items-center justify-center mt-10 px-4">
        <div className="w-full max-w-xl bg-gray-900 p-8 text-white rounded-2xl shadow-lg">
          <div className="text-center slide-fade-up" style={{ fontFamily: "'Outfit', sans-serif" }}>
            <h2 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-600 bg-clip-text text-transparent mb-4 tracking-wide">
              Welcome Back!
            </h2>
            <p className="text-lg bg-gradient-to-r from-blue-300 via-purple-400 to-indigo-500 bg-clip-text text-transparent font-light leading-relaxed">
              Log in to your account and continue exploring seamless airdrop experiences.
            </p>
          </div>

          <form onSubmit={SigninBtn}>
            <div className="mb-4">
              <label htmlFor="signin-email" className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                spellCheck="false"
                id="signin-email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <input
                  type={visible ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              <div className="flex justify-start mb-2">
                <Link
                  to={`${FrontEndUrl}/forgot-password`}
                  className="text-sm text-purple-400 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            {loading && <LoadingSpinner />}

            {!loading && (
              <button
                disabled={emailLength || passwordLength}
                className={`w-full py-2 mt-4 rounded-md text-white font-semibold transition ${emailLength || passwordLength
                  ? "bg-gray-600 cursor-not-allowed opacity-50"
                  : "bg-purple-600 hover:bg-purple-700"
                  }`}
              >
                Sign In
              </button>
            )}
          </form>

          <p className="text-red-500 mt-4">{error}</p>

          <GoogleLogin btnName="Signin with Google" disabled={loading}/>
          {/* <TelegramLogin /> */}

          <p className="text-sm mt-4 text-center">
            Don’t have an account?{" "}
            <Link to={`${FrontEndUrl}/register`} className="text-purple-400 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </main>

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

    </div>
  );
}

export default Signin;