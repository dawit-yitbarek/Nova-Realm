import React, { useState, useEffect } from "react";

function CheckingAuth() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900 overflow-hidden">
      <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-indigo-600 to-blue-500 animate-pulse text-center px-4">
        Verifying your account{dots}
      </h1>
    </div>
  );
}

export default CheckingAuth;