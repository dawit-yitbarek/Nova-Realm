import React, { useState, useEffect } from "react";
import checkAndRefreshToken from "./CheckRegistration";
import { Flame } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";
import api from "./Api";

const BackendUrl = import.meta.env.VITE_BACKEND_URL;

const StreakCard = (props) => {
  const [timeLeft, setTimeLeft] = useState("00:00:00");
  const [resetDate, setResetDate] = useState(null);
  const [claimError, setClaimError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const now = new Date();
    let initialReset = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      0, 0, 0
    ));

    if (now.getTime() > initialReset.getTime()) {
      initialReset = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() + 1,
        0, 0, 0
      ));
    }

    setResetDate(initialReset);
  }, []);

  useEffect(() => {
    if (!resetDate) return;

    const tick = () => {
      const now = new Date();
      const diff = resetDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft("00:00:00");
        props.refresh();
        const nextReset = new Date(Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate() + 1,
          0, 0, 0
        ));
        setResetDate(nextReset);
        return;
      }

      const hrs = String(Math.floor(diff / 3600000)).padStart(2, "0");
      const mins = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
      const secs = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
      setTimeLeft(`${hrs}:${mins}:${secs}`);
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [resetDate, props]);

  async function claimDailyReward() {
    setLoading(true);
    await checkAndRefreshToken();
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await api.post(
        `${BackendUrl}/claim-daily-reward`,
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (!response.data.success) {
        setClaimError("Failed to claim reward.");
      }
    } catch (error) {
      setClaimError("Failed to claim reward.");
      console.error("Error claiming daily reward:", error);
    } finally {
      setLoading(false);
      props.refresh();
    }
  }

  return (
    <div className="bg-gray-900 text-white rounded-3xl shadow-xl p-6 w-full max-w-md mx-auto mt-10 sm:p-8">
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-orange-500 to-red-500 flex items-center justify-center mb-4">
          <Flame className="text-white w-10 h-10 sm:w-12 sm:h-12" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-1">
          {props.currentStreak}
        </h1>
        <p className="text-base sm:text-lg font-semibold text-white">
          {props.currentStreak < 2 ? "Day" : "Days"} Streak
        </p>

        <p className="text-sm sm:text-md font-medium mb-6 text-center">
          {props.isClaimed
            ? "You've claimed your reward today!"
            : `🎁 Claim today's bonus: ${ props.currentStreak < 5 ? props.currentStreak * 5 : 25 || "---" } points`}
        </p>

        {!loading && !props.streakLoading ? (
          <button
            onClick={claimDailyReward}
            disabled={props.isClaimed || props.streakLoading}
            className={`w-full max-w-xs px-4 py-3 text-sm sm:text-base rounded-full font-medium transition-colors text-center ${
              props.isClaimed
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {props.isClaimed ? "Already Claimed Today" : "Claim Now"}
          </button>
        ) : (
          <div className="w-full flex justify-center py-2">
            <LoadingSpinner />
          </div>
        )}

        <p className="text-xs sm:text-sm text-gray-400 mt-3 text-center">
          {props.isClaimed ? (
            <>
              Next reward in <span className="text-purple-400">{timeLeft}</span>
            </>
          ) : (
            <>
              You have <span className="text-purple-400">{timeLeft}</span> to claim today's reward
            </>
          )}
        </p>

        <p className="text-red-500 mt-2 text-sm text-center">{claimError}</p>
      </div>
    </div>
  );
};

export default StreakCard;
