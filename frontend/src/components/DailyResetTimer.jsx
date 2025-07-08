import React, { useState, useEffect } from 'react';

export default function DailyResetTimer(props) {
  const [timeLeft, setTimeLeft] = useState('00:00:00');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const nextReset = Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() + 1,
        0, 0, 0
      );
      const diff = nextReset - now.getTime();

      if (diff <= 0) {
        setTimeLeft('00:00:00');
        handleUtcMidnight(); 
        return;
      }

      const hrs  = String(Math.floor(diff / 3_600_000)).padStart(2, '0');
      const mins = String(Math.floor((diff % 3_600_000) / 60_000)).padStart(2, '0');
      const secs = String(Math.floor((diff % 60_000) / 1_000)).padStart(2, '0');
      setTimeLeft(`${hrs}:${mins}:${secs}`);
    };

    const handleUtcMidnight = () => {
      console.log("🌟 00:00 UTC reached!");
      props.refesh
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="text-center p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-2">Next daily reward in:</h2>
      <p className="text-2xl font-mono">{timeLeft}</p>
    </div>
  );
}
