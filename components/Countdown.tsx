import React, { useState, useEffect } from "react";
import { TimeLeft } from "../types";

const Countdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      let christmas = new Date(currentYear, 11, 25);

      if (now > christmas) {
        christmas = new Date(currentYear + 1, 11, 25);
      }

      const difference = christmas.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();

    return () => clearInterval(timer);
  }, []);

  const TimeUnit: React.FC<{ value: number; label: string }> = ({
    value,
    label,
  }) => (
    <div className="flex flex-col items-center mx-2 md:mx-4 group">
      <div className="w-16 h-16 md:w-24 md:h-24 bg-black/30 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 shadow-[0_0_15px_rgba(255,0,0,0.3)] group-hover:shadow-[0_0_25px_rgba(255,0,0,0.6)] transition-all duration-300 relative overflow-hidden">
        {/* Shine effect */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-white/5 skew-y-12"></div>

        <span className="text-2xl md:text-4xl font-bold text-white festive-font text-glow z-10">
          {value.toString().padStart(2, "0")}
        </span>
      </div>
      <span className="mt-3 text-red-200 font-bold text-xs md:text-sm uppercase tracking-[0.2em] opacity-80">
        {label}
      </span>
    </div>
  );

  return (
    <div className="flex justify-center flex-wrap py-8">
      <TimeUnit value={timeLeft.days} label="Days" />
      <TimeUnit value={timeLeft.hours} label="Hours" />
      <TimeUnit value={timeLeft.minutes} label="Minutes" />
      <TimeUnit value={timeLeft.seconds} label="Seconds" />
    </div>
  );
};

export default Countdown;
