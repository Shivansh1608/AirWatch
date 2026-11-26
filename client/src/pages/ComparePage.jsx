import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/client';
import { getCPCBCategory } from '../utils/cpcbColors';
import DataBadge from '../components/common/DataBadge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { BarChart3, Plus, X, Layers, Activity, Wind } from 'lucide-react';

const AVAILABLE_CITIES = [
  'Delhi',
  'Mumbai',
  'Bengaluru',
  'Lucknow',
  'Mathura',
  'Kolkata',
  'Hyderabad',
  'Chennai',
  'Ahmedabad',
  'Jaipur'
];

export default function ComparePage() {
  const [selectedCities, setSelectedCities] = useState(['Delhi', 'Mumbai', 'Lucknow']);

  const { data: comparisons = [], isLoading } = useQuery({
    queryKey: ['compare', selectedCities],
    queryFn: async () => {
      const res = await api.get('/compare', {
        params: { cities: selectedCities.join(',') }
      });
      return res.data?.data || [];
    }
  });

  const toggleCity = (city) => {
    if (selectedCities.includes(city)) {
      if (selectedCities.length > 2) {
        setSelectedCities(selectedCities.filter((c) => c !== city));
      }
    } else {
      if (selectedCities.length < 4) {
        setSelectedCities([...selectedCities, city]);
      }
    }
  };

  // Prepare chart data
  const chartData = comparisons.map((item) => ({
    name: item.name,
    aqi: item.aqi,
    category: item.category,
    color: getCPCBCategory(item.aqi).color,
    pm25: item.pollutants?.pm25?.value || 0,
    pm10: item.pollutants?.pm10?.value || 0
  }));

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
          <BarChart3 className="w-8 h-8 text-emerald-500" />
          Multi-City AQI Comparison
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Compare real-time CPCB Air Quality Indices, PM concentrations, and surface weather between 2 to 4 Indian cities.
        </p>
      </div>

      {/* City Selector Pills */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Select 2 to 4 cities to compare:
          </span>
          <span className="text-slate-400">
            {selectedCities.length} of 4 selected (min 2)
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {AVAILABLE_CITIES.map((city) => {
            const isSelected = selectedCities.includes(city);
            return (
              <button
                key={city}
                onClick={() => toggleCity(city)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{city}</span>
                {isSelected ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Chart */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-500" />
          Comparative CPCB AQI Levels
        </h3>

        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b833" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 450]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg text-xs space-y-1">
                        <div className="font-bold text-slate-900 dark:text-white">{data.name}</div>
                        <div className="flex items-center gap-2">
                          <span>AQI: <strong className="text-base">{data.aqi}</strong></span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] text-white" style={{ backgroundColor: data.color }}>
                            {data.category}
                          </span>
                        </div>
                        <div className="text-slate-400 text-[10px]">PM2.5: {data.pm25} µg/m³ • PM10: {data.pm10} µg/m³</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="aqi" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Side-by-Side Detailed Breakdown Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 overflow-x-auto">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-500" />
          Side-by-Side Telemetry Matrix
        </h3>

        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
              <th className="py-3 pr-4 font-semibold">City Metric</th>
              {comparisons.map((c) => (
                <th key={c.name} className="py-3 px-4 font-bold text-slate-900 dark:text-white text-sm">
                  {c.name}
                  <span className="block text-[10px] font-normal text-slate-400">{c.state}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
            <tr>
              <td className="py-3 pr-4 font-semibold text-slate-500">CPCB AQI</td>
              {comparisons.map((c) => {
                const cat = getCPCBCategory(c.aqi);
                return (
                  <td key={c.name} className="py-3 px-4">
                    <span className="text-xl font-black mr-2" style={{ color: cat.color }}>
                      {c.aqi}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold text-white" style={{ backgroundColor: cat.color }}>
                      {cat.name}
                    </span>
                  </td>
                );
              })}
            </tr>
            <tr>
              <td className="py-3 pr-4 font-semibold text-slate-500">Dominant Pollutant</td>
              {comparisons.map((c) => (
                <td key={c.name} className="py-3 px-4 font-bold">
                  {c.dominantPollutant}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 pr-4 font-semibold text-slate-500">PM2.5 (24h)</td>
              {comparisons.map((c) => (
                <td key={c.name} className="py-3 px-4">
                  {c.pollutants?.pm25?.value || '—'} µg/m³
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 pr-4 font-semibold text-slate-500">PM10 (24h)</td>
              {comparisons.map((c) => (
                <td key={c.name} className="py-3 px-4">
                  {c.pollutants?.pm10?.value || '—'} µg/m³
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 pr-4 font-semibold text-slate-500">Temperature & Weather</td>
              {comparisons.map((c) => (
                <td key={c.name} className="py-3 px-4">
                  {c.weather?.temperature}°C • {c.weather?.condition}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 pr-4 font-semibold text-slate-500">Wind & Dispersion</td>
              {comparisons.map((c) => (
                <td key={c.name} className="py-3 px-4">
                  {c.weather?.windSpeed} km/h (Humidity {c.weather?.humidity}%)
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 pr-4 font-semibold text-slate-500">Data Integrity</td>
              {comparisons.map((c) => (
                <td key={c.name} className="py-3 px-4">
                  <DataBadge type={c.type} source={c.source} timestamp={c.timestamp} />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
