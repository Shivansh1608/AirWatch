import React from 'react';
import { getCPCBCategory } from '../../utils/cpcbColors';
import DataBadge from '../common/DataBadge';
import { ShieldCheck, Info } from 'lucide-react';

export default function AQIGauge({
  aqi = 0,
  dominantPollutant = 'PM2.5',
  type = 'observed',
  source = 'CPCB / Station Sensor',
  timestamp = new Date().toISOString()
}) {
  const category = getCPCBCategory(aqi);
  
  // Calculate needle angle on semi-circle: 0 AQI = -90deg, 500 AQI = +90deg
  const clampedAqi = Math.max(0, Math.min(500, aqi));
  const needleAngle = -90 + (clampedAqi / 500) * 180;

  // Arc path constants
  const size = 320;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;

  // CPCB Zones along semi-circle
  // 0-50 (10%), 51-100 (10%), 101-200 (20%), 201-300 (20%), 301-400 (20%), 401-500 (20%)
  const zones = [
    { label: 'Good', range: '0-50', color: '#00B050', start: 0, end: 50 },
    { label: 'Satisfactory', range: '51-100', color: '#92D050', start: 50, end: 100 },
    { label: 'Moderate', range: '101-200', color: '#FFD700', start: 100, end: 200 },
    { label: 'Poor', range: '201-300', color: '#FF9900', start: 200, end: 300 },
    { label: 'Very Poor', range: '301-400', color: '#FF0000', start: 300, end: 400 },
    { label: 'Severe', range: '401-500+', color: '#8B0000', start: 400, end: 500 },
  ];

  // Helper to calculate SVG arc coordinates for semi-circle
  const polarToCartesian = (centerX, centerY, r, angleInDegrees) => {
    const angleInRadians = ((angleInDegrees - 180) * Math.PI) / 180.0;
    return {
      x: centerX + r * Math.cos(angleInRadians),
      y: centerY + r * Math.sin(angleInRadians),
    };
  };

  const describeArc = (x, y, r, startAngle, endAngle) => {
    const start = polarToCartesian(x, y, r, endAngle);
    const end = polarToCartesian(x, y, r, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    return ['M', start.x, start.y, 'A', r, r, 0, largeArcFlag, 0, end.x, end.y].join(' ');
  };

  return (
    <div className="flex flex-col items-center justify-between p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
      {/* Background radial glow matching current AQI category */}
      <div
        className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-15 pointer-events-none transition-colors duration-700"
        style={{ backgroundColor: category.color }}
      />

      {/* Header telemetry badge & scale label */}
      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            AQI (India - CPCB)
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
            NAQI 0–500
          </span>
        </div>
        <DataBadge type={type} source={source} timestamp={timestamp} />
      </div>

      {/* SVG Semi-Circle Gauge */}
      <div className="relative w-full max-w-[320px] aspect-[2/1.3] flex items-center justify-center mt-4">
        <svg viewBox={`0 0 ${size} ${size * 0.65}`} className="w-full h-auto overflow-visible">
          {/* Base Track */}
          <path
            d={describeArc(center, center, radius, 0, 180)}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-100 dark:text-slate-800"
            strokeLinecap="round"
          />

          {/* Color Segments */}
          {zones.map((zone) => {
            const startAngle = (zone.start / 500) * 180;
            const endAngle = (zone.end / 500) * 180;
            return (
              <path
                key={zone.label}
                d={describeArc(center, center, radius, startAngle, endAngle)}
                fill="none"
                stroke={zone.color}
                strokeWidth={strokeWidth}
                strokeOpacity={0.9}
                className="transition-all hover:stroke-width-[28px] cursor-pointer"
              >
                <title>{`${zone.label} (${zone.range})`}</title>
              </path>
            );
          })}

          {/* Needle Group */}
          <g
            transform={`translate(${center}, ${center}) rotate(${needleAngle})`}
            className="transition-transform duration-1000 ease-out"
          >
            {/* Needle shape */}
            <polygon
              points={`0,-${radius - 10} -4,0 4,0`}
              fill={category.color}
              className="drop-shadow-md"
            />
            {/* Center Pivot Point */}
            <circle cx="0" cy="0" r="10" fill="#1e293b" stroke="#ffffff" strokeWidth="3" />
          </g>
        </svg>

        {/* Center AQI Value & Status */}
        <div className="absolute bottom-2 flex flex-col items-center text-center">
          <div
            className="text-5xl sm:text-6xl font-black tracking-tight transition-colors duration-500"
            style={{ color: category.color }}
          >
            {aqi}
          </div>
          <div
            className="text-xs sm:text-sm font-bold uppercase tracking-wider px-3 py-1 rounded-full text-white shadow-sm mt-1 transition-colors duration-500"
            style={{ backgroundColor: category.color }}
          >
            {category.name}
          </div>
        </div>
      </div>

      {/* Dominant Pollutant & Category Scale Legend */}
      <div className="w-full mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400">Dominant Pollutant:</span>
          <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700">
            {dominantPollutant}
          </span>
        </div>

        {/* Scale Quick Indicator */}
        <div className="flex items-center gap-1">
          {zones.map((z) => (
            <div
              key={z.label}
              className={`w-3.5 h-2.5 rounded-sm transition-transform ${
                category.name === z.label ? 'ring-2 ring-slate-900 dark:ring-white scale-125' : 'opacity-70'
              }`}
              style={{ backgroundColor: z.color }}
              title={`${z.label} (${z.range})`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
