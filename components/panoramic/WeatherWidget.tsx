"use client";

import { useEffect, useState } from "react";

export function WeatherWidget() {
  const [weather, setWeather] = useState({
    temp: 29,
    condition: "Sunny",
    humidity: 65,
    aqi: 72
  });

  // Mock fetching weather
  useEffect(() => {
    const interval = setInterval(() => {
      setWeather(prev => ({
        ...prev,
        temp: prev.temp + (Math.random() > 0.5 ? 0.1 : -0.1)
      }));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-950/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl flex items-center gap-4">
      <div className="flex flex-col">
        <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Mumbai Weather</span>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-2xl font-black text-white">{weather.temp.toFixed(1)}°C</span>
          <div className="w-[1px] h-6 bg-white/10 mx-1"></div>
          <div className="flex flex-col">
            <span className="text-white text-[10px] font-bold">{weather.condition}</span>
            <span className="text-slate-400 text-[9px]">AQI: {weather.aqi}</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white/5 p-2 rounded-xl">
        <svg className="w-8 h-8 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 5.106a.75.75 0 011.06 0l1.591 1.591a.75.75 0 11-1.06 1.061l-1.591-1.59a.75.75 0 010-1.061zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 010 1.06l-1.591 1.591a.75.75 0 11-1.061-1.06l1.59-1.591a.75.75 0 011.061 0zM12 18.75a.75.75 0 01.75.75V21.75a.75.75 0 01-1.5 0V19.5a.75.75 0 01.75-.75zM5.106 18.894a.75.75 0 011.06 0l1.591 1.591a.75.75 0 01-1.061 1.06l-1.59-1.591a.75.75 0 010-1.061zM2.25 12a.75.75 0 01.75-.75h2.25a.75.75 0 010 1.5H3a.75.75 0 01-.75-.75zM5.106 5.106a.75.75 0 010 1.06l-1.591 1.591a.75.75 0 01-1.06-1.06l1.59-1.591a.75.75 0 011.061 0z" />
        </svg>
      </div>
    </div>
  );
}
