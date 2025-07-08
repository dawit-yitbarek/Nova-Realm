import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Footer from "./Footer";
import checkAndRefreshToken from "./CheckRegistration";
import LoadingSpinner from "./LoadingSpinner"
import api from "./Api";

const BackEndUrl = import.meta.env.VITE_BACKEND_URL;

function Landing() {
  const navigate = useNavigate();
  const [upperBtnLoading, setUpperBtnLoading] = useState(false);
  const [lowerBtnLoading, setLowerBtnLoading] = useState(false);

  function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  }

  useEffect(() => {
    const token = getCookie("accessToken");
    if (token) {
      localStorage.setItem("accessToken", token);
    }
  }, []);

  async function checkRegistration(place) {
    try {
      place == 'upper' ? setUpperBtnLoading(true) : setLowerBtnLoading(true)
      const isAuthenticated = await checkAndRefreshToken();
      if (isAuthenticated) {
        navigate("/dashboard");
      } else {
        navigate("/signin");
      }
    } catch (error) {
      console.log("error on landing component refresh", error);
    } finally {
      place == 'upper' ? setUpperBtnLoading(false) : setLowerBtnLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white font-sans">

      {/* Navbar */}
      <nav className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-8 py-4 sm:py-5 bg-gray-800 bg-opacity-60 backdrop-blur-md shadow-lg rounded-b-2xl text-center gap-2">
        <Link to="/" className="flex items-center gap-2 text-white">
          <img
            src="/img/logo2.png"
            alt="Nova Realm Logo"
            className="h-10 w-10 rounded-full object-cover"
          />
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wide orbitron-font bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">
          Nova Realm
        </h1>
        </Link>


        {upperBtnLoading ? <LoadingSpinner /> :
          <button
            onClick={() => checkRegistration('upper')}
            disabled={upperBtnLoading || lowerBtnLoading}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 px-5 py-2 rounded-full font-semibold text-base sm:text-lg transition shadow-md"
          >
            Join Now
          </button>
        }
      </nav>

      {/* Hero Section */}
      <section className="text-center py-20 px-4 sm:py-24 sm:px-6 animate-fade-in">
        <h2 className="text-4xl sm:text-6xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400 bg-clip-text text-transparent mb-6 sm:mb-8 drop-shadow-md leading-tight">
          Welcome to Nova Realm — Solana's Premier Airdrop Platform
        </h2>
        <p className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto mb-8 sm:mb-10">
          Powered by the lightning-fast Solana network, Nova Realm rewards you with free tokens for completing tasks, engaging communities, and supporting decentralized innovation.
        </p>
        {lowerBtnLoading ? <LoadingSpinner /> :
          <button
            onClick={() => checkRegistration('lower')}
            disabled={upperBtnLoading || lowerBtnLoading}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg shadow-lg transition hover:scale-105"
          >
            🚀 Get Started
          </button>
        }
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-900 bg-opacity-50 backdrop-blur-md rounded-3xl mx-4 sm:mx-6 px-4 sm:px-12 py-10 sm:py-12 shadow-2xl mb-20">
        <h3 className="text-3xl sm:text-4xl font-bold text-center mb-10 sm:mb-14 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
          How It Works
        </h3>
        <div className="grid gap-8 sm:gap-12 grid-cols-1 sm:grid-cols-3 text-center">
          <div className="p-4 sm:p-6 hover:scale-105 transition-transform duration-300">
            <div className="text-4xl sm:text-5xl mb-4 sm:mb-6">🔗</div>
            <h4 className="text-xl sm:text-2xl font-semibold mb-3">Connect Wallet</h4>
            <p className="text-gray-400 text-sm sm:text-base">Use Phantom, Solflare, or any Solana wallet to get started.</p>
          </div>
          <div className="p-4 sm:p-6 hover:scale-105 transition-transform duration-300">
            <div className="text-4xl sm:text-5xl mb-4 sm:mb-6">📝</div>
            <h4 className="text-xl sm:text-2xl font-semibold mb-3">Complete Tasks</h4>
            <p className="text-gray-400 text-sm sm:text-base">Engage with projects, refer friends, and maximize your rewards.</p>
          </div>
          <div className="p-4 sm:p-6 hover:scale-105 transition-transform duration-300">
            <div className="text-4xl sm:text-5xl mb-4 sm:mb-6">🎁</div>
            <h4 className="text-xl sm:text-2xl font-semibold mb-3">Claim Rewards</h4>
            <p className="text-gray-400 text-sm sm:text-base">Unlock exclusive benefits and enjoy special perks.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Landing;
