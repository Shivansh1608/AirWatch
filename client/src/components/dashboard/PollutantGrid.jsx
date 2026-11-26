import React from 'react';
import { getCPCBCategory } from '../../utils/cpcbColors';
import { Activity, ShieldAlert } from 'lucide-react';

const POLLUTANT_METADATA = {
  pm25: {
    label: 'PM2.5',
    fullName: 'Fine Particulate Matter (≤ 2.5 µm)',
    description: 'Penetrates deep into lungs and cardiovascular system.',
    standardUnit: 'µg/m³',
    maxScale: 250
  },
  pm10: {
    label: 'PM10',
    fullName: 'Respirable Suspended Particulate Matter (≤ 10 µm)',
    description: 'Inhalable coarse particles from dust, construction and smoke.',
    standardUnit: 'µg/m³',
    maxScale: 430
  },
  no2: {
    label: 'NO2',
    fullName: 'Nitrogen Dioxide',
    description: 'Emitted from vehicular combustion and industrial plants.',
    standardUnit: 'µg/m³',
    maxScale: 400
  },
  so2: {
    label: 'SO2',
    fullName: 'Sulphur Dioxide',
    description: 'Produced by coal burning, refineries and thermal power.',
    standardUnit: 'µg/m³',
    maxScale: 1600
  },
  co: {
    label: 'CO',
    fullName: 'Carbon Monoxide',
    description: 'Incomplete combustion byproduct, reduces oxygen transport.',
    standardUnit: 'mg/m³',
    maxScale: 34
  },
  o3: {
    label: 'O3',
    fullName: 'Ground-Level Ozone (8-hour)',
    description: 'Formed by photochemical reactions in direct sunlight.',
    standardUnit: 'µg/m³',
    maxScale: 748
  }
};

export default function PollutantGrid({ pollutants = {} }) {
  const pollutantKeys = ['pm25', 'pm10', 'no2', 'so2', 'co', 'o3'];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-500" />
            Key Pollutants & CPCB Sub-Indices
          </h3>
          <p className="text-xs text-slate-500">
            CPCB calculates overall AQI from the maximum sub-index of monitored pollutants.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pollutantKeys.map((key) => {
          const item = pollutants[key] || { value: 0, subIndex: 0 };
          const meta = POLLUTANT_METADATA[key];
          const category = getCPCBCategory(item.subIndex || 0);

          // Sub-index percentage for visual progress bar (clamped 0-100%)
          const progressPercent = Math.min(100, Math.round(((item.subIndex || 0) / 500) * 100));

          return (
            <div
              key={key}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3"
            >
              {/* Pollutant Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                    {meta.label}
                  </span>
                  <span className="text-[10px] text-slate-400 block line-clamp-1">
                    {meta.fullName}
                  </span>
                </div>
                <span
                  className="text-[11px] font-bold px-2 py-0.5 rounded-full text-white shadow-xs"
                  style={{ backgroundColor: category.color }}
                >
                  {category.name}
                </span>
              </div>

              {/* Concentration Value & Sub-Index */}
              <div className="flex items-baseline justify-between pt-1">
                <div>
                  <span className="text-3xl font-black text-slate-900 dark:text-slate-100">
                    {item.value}
                  </span>
                  <span className="text-xs font-medium text-slate-400 ml-1">
                    {meta.standardUnit}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Sub-Index: </span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {item.subIndex || '—'}
                  </span>
                </div>
              </div>

              {/* Sub-Index Progress Bar */}
              <div className="w-full space-y-1">
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${progressPercent}%`,
                      backgroundColor: category.color
                    }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>0</span>
                  <span>250</span>
                  <span>500 (Severe)</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-2">
                {meta.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
