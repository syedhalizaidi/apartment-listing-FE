"use client";

import { useEffect, useState } from "react";

export default function PremiumLoader({ onFinish }) {
  const messages = [
    "Loading your experience…",
    "Preparing property data…",
    "Syncing real-time listings…",
    "Almost there…",
    "Finalizing details…",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, 1200);

    const finish = setTimeout(() => {
      if (onFinish) onFinish();
    }, 3000);

    return () => {
      clearInterval(msgInterval);
      clearTimeout(finish);
    };
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-[9999]">
      {/* Rotating premium ring */}
      <div className="relative w-32 h-32 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-[6px] border-gray-200"></div>

        <div className="absolute inset-0 rounded-full border-[6px] border-transparent border-t-blue-500 border-r-blue-500 animate-premium-spin drop-shadow-premium"></div>

        <div className="absolute inset-0 flex items-center justify-center animate-float">
          <span className="text-5xl">🏠</span>
        </div>
      </div>

      <p className="text-gray-600 text-lg mt-6 animate-fade">
        {messages[index]}
      </p>
    </div>
  );
}
