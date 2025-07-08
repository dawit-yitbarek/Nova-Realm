import React, { useEffect, useState } from "react";
import api from "./Api";
const BackEndUrl = import.meta.env.VITE_BACKEND_URL;
const FrontEndUrl = import.meta.env.VITE_FRONTEND_URL;
const BotId = import.meta.env.VITE_TELEGRAM_BOT_ID;


const TelegramConnect = (props) => {
  const [isConnected, setIsConnected] = useState(false);


  // useEffect(() => {
  //   const connectTelegram = async () => {
  //     try {
  //       const accessToken = localStorage.getItem("accessToken");  
  //       const response = await api.get(`${BackEndUrl}/get-telegramId`, {headers: {Authorization: `Bearer ${accessToken}`,},});
  //       if (response.data.success) {
  //         setIsConnected(true);
  //         console.log("Telegram connected successfully");
  //       } else {
  //         setIsConnected(false);
  //         console.log(response.data.message);
  //       }

  //     } catch (error) {
  //       console.error("Error connecting to Telegram:", error);
  //     }
  //   };
  //   connectTelegram();
  // }, []);

 

  const handleTelegramLogin = () => {
    const redirectUri = encodeURIComponent(`${FrontEndUrl}/telegram-redirect`);
  
    const url = `https://oauth.telegram.org/auth?bot_id=${BotId}&origin=${window.location.origin}&request_access=write&redirect_uri=${redirectUri}`;
  
    // Open a popup with width and height
    window.location.href = url;
  };
  

  return (
    //  !isConnected ?
    //   <>
    //     <button
    //       onClick={handleTelegramLogin}
    //       //data-taskcompletion={props.taskCompletion} // passed, but not used
    //       //data-href={props.url} // passed, but not used
    //       //data-setid={props.setId} // passed, but not used
    //       className={`mt-3 px-4 py-2 rounded text-sm text-center font-medium transition bg-purple-700 hover:bg-purple-600`}
    //     >
    //       Connect Telegram
    //     </button>
    //     <p className="text-red-600 p-3 text-center">{props.errorMessage}</p>
    //   </>
    //    :
      (
        <a
          href={props.url}
          onClick={props.setId}
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-3 px-4 py-2 rounded text-sm text-center font-medium transition ${props.isCompleted
            ? "bg-gray-600 cursor-not-allowed flex items-center gap-1"
            : "bg-purple-700 hover:bg-purple-600"
            }`}
        >
          Go to Task →
        </a>
      )
  );
};

export default TelegramConnect;