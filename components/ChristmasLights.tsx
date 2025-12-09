import React from "react";

const ChristmasLights: React.FC = () => {
  const colors = [
    "text-red-500 animate-flash-1",
    "text-green-500 animate-flash-2",
    "text-yellow-400 animate-flash-3",
    "text-blue-500 animate-flash-1",
    "text-purple-500 animate-flash-2",
  ];

  const lights = Array.from({ length: 30 }); // Generate 30 lights

  return (
    <div className="absolute top-0 left-0 w-full overflow-hidden h-16 pointer-events-none z-40 flex justify-between px-2">
      {/* Wire */}
      <div className="absolute top-[-5px] left-[-10px] right-[-10px] h-8 border-b-2 border-gray-600 rounded-[50%] z-0" />

      {lights.map((_, i) => (
        <div key={i} className="relative z-10 flex flex-col items-center">
          {/* Socket */}
          <div className="w-1.5 h-2 bg-gray-700 mx-auto" />
          {/* Bulb */}
          <div
            className={`w-3 h-4 rounded-full ${
              colors[i % colors.length]
            } bg-current shadow-lg mt-[-1px]`}
            style={{ animationDelay: `${Math.random() * 2}s` }}
          />
        </div>
      ))}
    </div>
  );
};

export default ChristmasLights;
