import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/client';
import { Sparkles, Wind, Droplets, Info } from 'lucide-react';

export default function PollutionInsights({ city = 'Delhi' }) {
  const { data: insights, isLoading } = useQuery({
    queryKey: ['insights', city],
    queryFn: async () => {
      const res = await api.get('/ai/insights', { params: { city } });
      return res.data?.data;
    }
  });

  if (isLoading || !insights) {
    return null;
  }

  return (
    <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-md space-y-4 border border-slate-700/60 relative overflow-hidden">
      {/* Glow effect */}
      <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between pb-2 border-b border-slate-700/80">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <h3 className="text-base font-bold text-white tracking-wide">
            Smart Pollution Insights for {city}
          </h3>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          AI Meteorology Analysis
        </span>
      </div>

      <p className="text-sm leading-relaxed text-slate-200 font-normal">
        {insights.explanation}
      </p>

      {/* Dispersion Tags */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
        <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-2 text-slate-300">
          <Wind className="w-4 h-4 text-teal-400 shrink-0" />
          <span>Dispersion: <strong>{insights.meteorologicalFactors?.dispersionStatus}</strong></span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-2 text-slate-300">
          <Droplets className="w-4 h-4 text-blue-400 shrink-0" />
          <span>Moisture: <strong>{insights.meteorologicalFactors?.humidityImpact}</strong></span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-2 text-slate-300">
          <Info className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Driver: <strong>{insights.meteorologicalFactors?.primaryDriver}</strong></span>
        </div>
      </div>
    </div>
  );
}
