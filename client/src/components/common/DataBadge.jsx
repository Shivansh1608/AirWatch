import React from 'react';
import { Radio, CloudRain, Clock } from 'lucide-react';

export default function DataBadge({ type = 'observed', source, timestamp, className = '' }) {
  const isObserved = type.toLowerCase() === 'observed';

  return (
    <div className={`inline-flex flex-wrap items-center gap-2 text-xs ${className}`}>
      {/* Observed vs Forecast badge */}
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-medium tracking-wide shadow-sm border ${
          isObserved
            ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700'
            : 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-700'
        }`}
      >
        {isObserved ? (
          <>
            <Radio className="w-3 h-3 text-emerald-600 dark:text-emerald-400 animate-pulse" />
            <span>Observed (Station)</span>
          </>
        ) : (
          <>
            <CloudRain className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            <span>Forecast / Model</span>
          </>
        )}
      </span>

      {/* Provider attribution */}
      {source && (
        <span className="text-slate-500 dark:text-slate-400 font-medium">
          Source: <span className="text-slate-700 dark:text-slate-300">{source}</span>
        </span>
      )}

      {/* Timestamp */}
      {timestamp && (
        <span className="inline-flex items-center gap-1 text-slate-400 dark:text-slate-500">
          <Clock className="w-3 h-3" />
          <time dateTime={new Date(timestamp).toISOString()} title={new Date(timestamp).toLocaleString('en-IN')}>
            {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </time>
        </span>
      )}
    </div>
  );
}
