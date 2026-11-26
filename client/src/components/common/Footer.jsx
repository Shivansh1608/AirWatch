import React from 'react';
import { Wind, Heart, ExternalLink, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Wind className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                Air<span className="text-emerald-500">Watch</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-md">
              Real-time Air Quality Index monitoring, forecasts, and AI-grounded health intelligence for Indian cities, strictly calibrated to Central Pollution Control Board (CPCB) standards.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>CPCB Breakpoints & Guidelines compliant</span>
            </div>
          </div>

          {/* Standards & Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Data & Standards
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://cpcb.nic.in/National-Air-Quality-Index/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-500 inline-flex items-center gap-1"
                >
                  CPCB NAQI Index <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://open-meteo.com/en/docs/air-quality-api"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-500 inline-flex items-center gap-1"
                >
                  Open-Meteo Air Quality <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://aqicn.org/api/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-500 inline-flex items-center gap-1"
                >
                  WAQI Station Data <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Health Disclaimer */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Health Disclaimer
            </h4>
            <p className="text-xs leading-relaxed text-slate-400">
              AirWatch provides environmental health advisories based on CPCB indices. Guidance is informational and does not replace medical counsel from certified healthcare professionals.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} AirWatch India. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for clean air and public health.
          </p>
        </div>
      </div>
    </footer>
  );
}
