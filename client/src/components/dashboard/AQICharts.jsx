import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { getCPCBCategory } from '../../utils/cpcbColors';
import DataBadge from '../common/DataBadge';
import { TrendingUp, Calendar, Clock } from 'lucide-react';

export default function AQICharts({
  hourlyData = [],
  history7d = [],
  history30d = []
}) {
  const [activeTab, setActiveTab] = useState('hourly'); // 'hourly' | '7d' | '30d'

  // Pick dataset based on tab
  const getActiveData = () => {
    switch (activeTab) {
      case '7d':
        return {
          data: history7d,
          xKey: 'shortDate',
          type: 'observed',
          source: 'WAQI / CPCB Historical Station Record',
          title: '7-Day Historical Daily AQI'
        };
      case '30d':
        return {
          data: history30d,
          xKey: 'shortDate',
          type: 'observed',
          source: 'WAQI / CPCB 30-Day Air Quality Archive',
          title: '30-Day Historical Trend'
        };
      case 'hourly':
      default:
        return {
          data: hourlyData,
          xKey: 'time',
          type: 'forecast',
          source: 'Open-Meteo Atmospheric Chemistry Model',
          title: 'Next 24h Hourly AQI Forecast'
        };
    }
  };

  const { data, xKey, type, source, title } = getActiveData();

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const category = getCPCBCategory(item.aqi);

      return (
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-1.5 min-w-[180px]">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 pb-1 border-b border-slate-100 dark:border-slate-800">
            <span>{item.date || item.time}</span>
            <span
              className="px-1.5 py-0.5 rounded text-[10px] text-white"
              style={{ backgroundColor: category.color }}
            >
              {category.name}
            </span>
          </div>
          <div className="flex items-baseline justify-between pt-0.5">
            <span className="text-xs text-slate-500">AQI:</span>
            <span className="text-xl font-black text-slate-900 dark:text-white">{item.aqi}</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>PM2.5: {item.pm25} µg/m³</span>
            <span>PM10: {item.pm10} µg/m³</span>
          </div>
          <div className="pt-1">
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
              type === 'observed' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
            }`}>
              {type === 'observed' ? '● Observed Record' : '▲ Forecast Model'}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
      {/* Header with Title and Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            {title}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {type === 'forecast' ? 'Numerical model predictions for upcoming 24-48 hours' : 'Validated ground station sensor historical observations'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 self-start sm:self-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('hourly')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'hourly'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Next 24h Forecast
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('7d')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === '7d'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            7-Day History
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('30d')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === '30d'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            30-Day Trend
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-72 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="aqiColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b833" />
            <XAxis
              dataKey={xKey}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: '#94a3b8' }}
            />
            <YAxis
              domain={[0, 450]}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: '#94a3b8' }}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* CPCB Threshold Reference Lines */}
            <ReferenceLine y={50} stroke="#00B050" strokeDasharray="3 3" label={{ value: 'Good (50)', fill: '#00B050', fontSize: 10, position: 'insideTopRight' }} />
            <ReferenceLine y={100} stroke="#92D050" strokeDasharray="3 3" label={{ value: 'Satisfactory (100)', fill: '#92D050', fontSize: 10, position: 'insideTopRight' }} />
            <ReferenceLine y={200} stroke="#FFD700" strokeDasharray="3 3" label={{ value: 'Moderate (200)', fill: '#FFD700', fontSize: 10, position: 'insideTopRight' }} />
            <ReferenceLine y={300} stroke="#FF9900" strokeDasharray="3 3" label={{ value: 'Poor (300)', fill: '#FF9900', fontSize: 10, position: 'insideTopRight' }} />
            <ReferenceLine y={400} stroke="#FF0000" strokeDasharray="3 3" label={{ value: 'Very Poor (400)', fill: '#FF0000', fontSize: 10, position: 'insideTopRight' }} />

            <Area
              type="monotone"
              dataKey="aqi"
              stroke="#059669"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#aqiColor)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Data Attribution */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
        <DataBadge type={type} source={source} timestamp={new Date().toISOString()} />
        <span className="text-[11px] text-slate-400">Values strictly calculated via CPCB NAQI formula</span>
      </div>
    </div>
  );
}
