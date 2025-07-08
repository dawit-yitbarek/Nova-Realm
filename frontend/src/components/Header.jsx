import React, { useState, Fragment } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { Menu, X, LogOut } from "lucide-react";
import api from "./Api";
const BackEndUrl = import.meta.env.VITE_BACKEND_URL;

async function LogoutBtn({ setLogoutError, setShowLogoutConfirm, navigate }) {
  try {
    localStorage.removeItem("walletName");
    localStorage.removeItem("accessToken");
    await api.post(`${BackEndUrl}/logout`);
    setShowLogoutConfirm(false); // close modal on success
    navigate("/signin");
  } catch (err) {
    console.error("Logout failed", err);
    setLogoutError("Logout failed");
  }
}


function Header(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const navigate = useNavigate();

  const navLinkClass = (active) =>
    active
      ? "hover:text-teal-400 font-medium text-purple-400"
      : "hover:text-purple-400";


  return (
    <>
      <header className="w-full bg-gray-900 px-6 py-4 flex items-center justify-between shadow-lg sticky top-0 z-50">

        <Link to="/" className="flex items-center gap-2 text-white">
          <img
            src="/img/logo.png"
            alt="Nova Realm Logo"
            className="h-10 w-10 rounded-full object-cover"
          />
          <h1 className="text-2xl text-purple-400 tracking-wide orbitron-font"> Nova Realm </h1>
        </Link>


        {/* Hamburger button for mobile */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white md:hidden"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-6 text-sm items-center">
          <Link to="/dashboard" className={navLinkClass(props.dashboard)}>Dashboard</Link>
          <Link to="/tasks" className={navLinkClass(props.tasks)}>Tasks</Link>
          <Link to="/leaderboard" className={navLinkClass(props.leaderboard)}>Leaderboard</Link>


          <div className="relative group cursor-pointer" onClick={() => setShowLogoutConfirm(true)}>
            <span className="absolute left-1/2 -translate-x-1/2 bottom-full bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition">
              Logout
            </span>
            <LogOut size={18} className="hover:text-red-400" />
          </div>
        </nav>

        {/* Mobile nav */}
        {isOpen && (
          <div className="absolute top-full left-0 w-full bg-gray-900 flex flex-col gap-4 p-6 md:hidden shadow-md border-t border-gray-700 text-sm z-40">
            <Link to="/dashboard" className={navLinkClass(props.dashboard)} onClick={() => setIsOpen(false)}>Dashboard</Link>
            <Link to="/tasks" className={navLinkClass(props.tasks)} onClick={() => setIsOpen(false)}>Tasks</Link>
            <Link to="/leaderboard" className={navLinkClass(props.leaderboard)} onClick={() => setIsOpen(false)}>Leaderboard</Link>

            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => { setIsOpen(false); setShowLogoutConfirm(true); }}>
              <LogOut size={18} className="hover:text-red-400" />
              <span className="text-white group-hover:text-red-400">Logout</span>
            </div>
          </div>
        )}
      </header>

      {/* Logout Confirmation Modal */}
      <Transition appear show={showLogoutConfirm} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowLogoutConfirm(false)}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-md" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-6 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-sm sm:max-w-md transform overflow-hidden rounded-2xl bg-gray-800 p-6 text-white align-middle shadow-2xl transition-all">
                  <DialogTitle as="h3" className="text-xl font-bold leading-6">
                    Confirm Logout
                  </DialogTitle>

                  <div className="mt-4">
                    <p className="text-sm text-gray-300">
                      Are you sure you want to logout from your account?
                    </p>
                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row gap-4">
                    <button
                      type="button"
                      onClick={() => LogoutBtn({ setLogoutError, setShowLogoutConfirm, navigate })}
                      className="flex-1 rounded-lg bg-red-500 hover:bg-red-600 px-4 py-2 text-sm font-semibold text-white transition"
                    >
                      Yes, Logout
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowLogoutConfirm(false)}
                      className="flex-1 rounded-lg border border-gray-500 bg-gray-700 hover:bg-gray-600 px-4 py-2 text-sm font-semibold text-white transition"
                    >
                      Cancel
                    </button>
                  </div>

                  {logoutError && (
                    <p className="text-red-500 text-sm mt-4 text-center">
                      {logoutError}
                    </p>
                  )}
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export default Header;
export { LogoutBtn };
