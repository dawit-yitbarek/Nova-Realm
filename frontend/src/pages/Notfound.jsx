import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0c0c1c] to-[#1a1a2e] flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-6xl sm:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 animate-pulse mb-4">
        404
      </h1>
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
        Page Not Found
      </h2>
      <p className="text-gray-400 mb-8 text-base sm:text-lg max-w-md">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 transition rounded-full font-semibold text-white shadow-md hover:shadow-purple-800"
      >
        Go Back Home
      </Link>
    </div>
  );
}

export default NotFound;
