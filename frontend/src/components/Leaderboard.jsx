
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import api from './Api';
import Footer from "./Footer";
import {leaderboardPlaceholder} from "./PlaceholderProvider";
const BackEndUrl = import.meta.env.VITE_BACKEND_URL;

function Leaderboard() {
  const navigate = useNavigate();
  const [topThree, setTopThree] = useState(leaderboardPlaceholder.topThree);
  const [others, setOthers] = useState(leaderboardPlaceholder.others);
  const [currentUser, setCurrentUser] = useState(leaderboardPlaceholder.currentUser);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await api.get(`${BackEndUrl}/leaderboard`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (response.data?.success) {
          setTopThree(response.data?.topThree);
          setOthers(response.data?.others);
          setCurrentUser(response.data?.currentUser);
        } else {
          console.log("leaderboard response failed ", response.data?.message);
          navigate("/signin");
        }
      } catch (error) {
        console.log("error on fetching data from leaderboard ", error);
      }
    }

    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#0c0c1c] text-white font-sans">
      <Header leaderboard={true} />

      <main>
        <section className="px-4 py-10 flex flex-col items-center gap-10 w-full max-w-full">
          {/* Page Header */}
          <header className="w-full max-w-3xl text-center px-2">
            <h1 className="text-2xl sm:text-4xl font-bold text-purple-400 mb-4">Leaderboard</h1>
            <p className="text-gray-300 text-sm sm:text-base">
              Welcome to the leaderboard! Here you can see the top performers based on points earned.
              Compete with others, climb the ranks, and earn your place among the best. Your current rank and score are shown below.
            </p>
          </header>

          {/* Top 3 Users */}
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl px-2">
            {topThree.map((user) => (
              <article
                key={user.id}
                className={`w-full h-64 rounded-xl flex flex-col items-center justify-center px-4 py-6 bg-[#1a1a2e] text-center ${user.rank == 1
                    ? "sm:col-span-2 md:col-span-1 order-1"
                    : "order-2"
                  }`}
              >
                <div className="w-20 h-20 rounded-full overflow-hidden mb-3 border-4 border-purple-500">
                  <img
                    src={user.avatar_url || "/img/placeholder.png"}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="font-bold text-white text-base sm:text-lg truncate">{user.name}</div>
                <div className="text-yellow-400 text-xl sm:text-2xl font-bold">
                  {user.point.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  {user.rank == 1 ? "1st" : user.rank == 2 ? "2nd" : "3rd"}
                </div>
              </article>
            ))}
          </section>

          {/* Other Users */}
          <section className="bg-[#1a1a2e] w-full max-w-6xl rounded-xl py-4 divide-y divide-[#292947] px-2">
            {others.map((user) => (
              <article
                key={user.id}
                className="flex justify-between items-center px-2 sm:px-6 py-4 text-sm sm:text-base"
              >
                <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
                  <span className="text-gray-400 w-5 sm:w-6 text-right">{user.rank}</span>
                  <img
                    src={user.avatar_url || "/img/placeholder.png"}
                    alt={user.name}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full"
                  />
                  <span className="font-semibold text-white truncate">{user.name}</span>
                </div>
                <div className="text-gray-300 font-semibold text-right">
                  {user.point.toLocaleString()}
                </div>
              </article>
            ))}
          </section>

          {/* Current User */}
          <section className="bg-[#1a1a2e] w-full max-w-6xl rounded-xl px-4 sm:px-6 py-6 relative">
            <div className="absolute -top-3 left-6 bg-purple-600 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-md">
              Your Rank
            </div>
            <div className="flex justify-between items-center text-sm sm:text-base flex-wrap gap-y-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="bg-purple-700 text-purple-300 text-xs px-3 py-1 rounded-full font-bold">
                  #{currentUser.rank}
                </span>
                <img
                  src={currentUser.avatar_url || "/img/fallback.png"}
                  alt={currentUser.name}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full"
                />
                <div>
                  <div className="text-white font-semibold truncate">{currentUser.name}</div>
                </div>
              </div>
              <div className="text-purple-400 font-bold text-base sm:text-lg text-right">
                {currentUser.point?.toLocaleString()} pts
              </div>
            </div>
          </section>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Leaderboard;
