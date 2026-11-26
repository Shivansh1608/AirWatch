import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Navigation, Compass, Loader2 } from 'lucide-react';

export default function CitySearch({
  currentCity,
  onSelectCity,
  onUseLocation,
  popularCities = ['Delhi', 'Mumbai', 'Bengaluru', 'Lucknow', 'Mathura', 'Kolkata', 'Hyderabad']
}) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocationClick = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsLocating(false);
          onUseLocation?.({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          setIsLocating(false);
          console.warn('Geolocation error:', error.message);
          // Fallback to Delhi if denied
          alert('Location access was denied or unavailable. Retaining current city selection.');
        },
        { timeout: 8000 }
      );
    } else {
      setIsLocating(false);
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handleSelect = (cityName) => {
    setQuery('');
    setIsOpen(false);
    onSelectCity(cityName);
  };

  return (
    <div className="w-full space-y-3" ref={dropdownRef}>
      {/* Search Bar Input */}
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search Indian city or monitoring station (e.g. Delhi, Bandra, Bengaluru)..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm transition-all text-slate-900 dark:text-white"
          />
        </div>

        {/* Geolocation Button */}
        <button
          type="button"
          onClick={handleLocationClick}
          disabled={isLocating}
          className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-300 dark:hover:border-emerald-800 text-sm font-medium shadow-sm transition-all disabled:opacity-60"
          title="Detect my current location"
        >
          {isLocating ? (
            <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
          ) : (
            <Navigation className="w-4 h-4 text-emerald-500" />
          )}
          <span className="hidden sm:inline">Use My Location</span>
        </button>
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-2 space-y-1">
          {popularCities
            .filter((c) => c.toLowerCase().includes(query.toLowerCase()))
            .map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => handleSelect(city)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm text-left hover:bg-slate-50 dark:hover:bg-slate-800/70 text-slate-800 dark:text-slate-200 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  <span className="font-medium">{city}</span>
                </div>
                <span className="text-xs text-slate-400">India</span>
              </button>
            ))}
        </div>
      )}

      {/* Quick Access Pills for Popular Indian Cities */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1 shrink-0 font-medium">
          <Compass className="w-3.5 h-3.5 text-slate-400" />
          Popular:
        </span>
        {popularCities.map((city) => {
          const isSelected = currentCity?.toLowerCase() === city.toLowerCase();
          return (
            <button
              key={city}
              type="button"
              onClick={() => onSelectCity(city)}
              className={`px-3 py-1 rounded-full font-medium shrink-0 transition-all ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 font-semibold'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700'
              }`}
            >
              {city}
            </button>
          );
        })}
      </div>
    </div>
  );
}
