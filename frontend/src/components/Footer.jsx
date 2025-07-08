import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-12 border-t border-gray-800 py-6 text-center text-sm text-gray-500">
      <p className="mb-2">
        &copy; {new Date().getFullYear()} Nova Realm. All rights reserved.
      </p>
      <div className="flex justify-center gap-6 text-xs text-gray-400">
        <Link to="/privacy" className="hover:text-purple-400 transition" >Privacy Policy</Link>

        <Link to="/terms" className="hover:text-purple-400 transition" >Terms of Service</Link>

        <a href="https://t.me/davidyz17"
          target="_blank"
          rel="noopener noreferrer" 
          className="hover:text-purple-400 transition" >Support</a>
      </div>
    </footer>
  );
};

export default Footer;
