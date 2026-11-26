import React from 'react';
import { Thermometer, Droplets, Wind, Gauge, Sun } from 'lucide-react';

export default function WeatherCard({ weather = {} }) {
  const {
    temperature = 25,
    humidity = 50,
    windSpeed = 10,
    windDirection = 0,
    pressure = 1013,
    condition = 'Clear'
  } = weather;

  // Convert compass degrees to cardinal direction
  const getWindCardinal = (deg) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round((deg % 360) / 22.5) % 16;
    return directions[index];
  };

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sun className="w-5 h-5 text-amber-500" />
          Surface Weather & Dispersion
        </h3>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          {condition}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Temperature */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Thermometer className="w-4 h-4 text-rose-500" />
            <span>Temperature</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {temperature} <span className="text-sm font-normal text-slate-400">°C</span>
          </div>
        </div>

        {/* Humidity */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Droplets className="w-4 h-4 text-blue-500" />
            <span>Humidity</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {humidity} <span className="text-sm font-normal text-slate-400">%</span>
          </div>
        </div>

        {/* Wind Speed & Compass */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Wind className="w-4 h-4 text-teal-500" />
            <span>Wind Speed</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white flex items-baseline gap-2">
            <span>{windSpeed}</span>
            <span className="text-xs font-normal text-slate-400">km/h ({getWindCardinal(windDirection)})</span>
          </div>
        </div>

        {/* Barometric Pressure */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Gauge className="w-4 h-4 text-indigo-500" />
            <span>Pressure</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {pressure} <span className="text-sm font-normal text-slate-400">hPa</span>
          </div>
        </div>
      </div>
    </div>
  );
}
