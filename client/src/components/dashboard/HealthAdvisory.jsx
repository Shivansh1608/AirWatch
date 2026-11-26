import React, { useState } from 'react';
import { getCPCBCategory } from '../../utils/cpcbColors';
import { HeartPulse, Users, Shield, Wind, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

export default function HealthAdvisory({ aqi = 0 }) {
  const [showSensitiveDetails, setShowSensitiveDetails] = useState(false);
  const category = getCPCBCategory(aqi);

  // Behavioral precaution recommendations based on CPCB level
  const isDangerous = aqi > 200;
  const isModerate = aqi > 100;

  return (
    <div
      className="p-6 rounded-3xl border shadow-sm space-y-5 transition-all"
      style={{
        backgroundColor: `${category.color}0D`, // 5% opacity tint
        borderColor: `${category.color}40`
      }}
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="flex items-center gap-2">
          <HeartPulse className="w-5 h-5 text-rose-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            CPCB Health Guidance & Impact
          </h3>
        </div>
        <span
          className="text-xs font-bold px-2.5 py-0.5 rounded-full text-white"
          style={{ backgroundColor: category.color }}
        >
          {category.name} ({category.range})
        </span>
      </div>

      {/* General Population Advisory */}
      <div className="space-y-1.5">
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Users className="w-4 h-4 text-slate-500" />
          General Public Guidance:
        </span>
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
          {category.advisoryGeneral}
        </p>
      </div>

      {/* Sensitive Groups Toggle */}
      <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
        <button
          type="button"
          onClick={() => setShowSensitiveDetails(!showSensitiveDetails)}
          className="w-full flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 focus:outline-none"
        >
          <span className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-500" />
            Sensitive Groups (Asthma, Heart Conditions, Children, Elderly)
          </span>
          {showSensitiveDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showSensitiveDetails && (
          <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 mt-2 p-3 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800">
            {category.advisorySensitive}
          </p>
        )}
      </div>

      {/* Actionable Precaution Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
        <div className={`p-2.5 rounded-xl border text-xs text-center font-medium ${
          isDangerous ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200' : 'bg-white/80 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
        }`}>
          {isDangerous ? '😷 N95 Mask Advised' : '🍃 Normal Breathing'}
        </div>

        <div className={`p-2.5 rounded-xl border text-xs text-center font-medium ${
          isDangerous ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200' : 'bg-white/80 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
        }`}>
          {isDangerous ? '🚪 Keep Windows Shut' : '🪟 Natural Ventilation OK'}
        </div>

        <div className={`p-2.5 rounded-xl border text-xs text-center font-medium ${
          isDangerous ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200' : 'bg-white/80 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
        }`}>
          {isDangerous ? '⚡ Run Air Purifier' : '✨ Clean Ambient Air'}
        </div>

        <div className={`p-2.5 rounded-xl border text-xs text-center font-medium ${
          isModerate ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200' : 'bg-white/80 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
        }`}>
          {isModerate ? '🏃 Limit Strenuous Jogging' : '🏃 Safe for Outdoor Jogging'}
        </div>
      </div>
    </div>
  );
}
