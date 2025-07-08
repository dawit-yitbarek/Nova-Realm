import React, { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
const BackEndUrl = import.meta.env.VITE_BACKEND_URL;

function GoogleLogin(props) {
    const [loading, setLoading] = useState(false)

    async function login() {
        setLoading(true)
        window.location.href = `${BackEndUrl}/auth/google?ref=${props.referr}`;
    }

    return (
        loading ? <LoadingSpinner /> :
        <button disabled={props.disabled} onClick={login} className="flex items-center justify-center w-full py-2 mt-4 rounded-md bg-white text-gray-800 font-medium shadow-md hover:bg-[#e6e6e6] transition">
            <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google icon"
                className="w-5 h-5 mr-2"
            />
            {props.btnName}
        </button>

    )
}

export default GoogleLogin;