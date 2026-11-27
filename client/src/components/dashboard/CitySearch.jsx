import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Navigation, Compass, Loader2, Globe } from 'lucide-react';
import { searchCities } from '../../api/aqiApi';

// Pre-defined coordinates for quick popular world & Indian cities
const QUICK_POPULAR_CITIES = [
  { name: 'Delhi', state: 'Delhi', country: 'India', lat: 28.6139, lon: 77.2090 },
  { name: 'Mumbai', state: 'Maharashtra', country: 'India', lat: 19.0760, lon: 72.8777 },
  { name: 'Bengaluru', state: 'Karnataka', country: 'India', lat: 12.9716, lon: 77.5946 },
  { name: 'London', state: 'England', country: 'United Kingdom', lat: 51.5074, lon: -0.1278 },
  { name: 'New York', state: 'New York', country: 'United States', lat: 40.7128, lon: -74.0060 },
  { name: 'Tokyo', state: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503 },
  { name: 'Dubai', state: 'Dubai', country: 'United Arab Emirates', lat: 25.2048, lon: 55.2708 },
  { name: 'Paris', state: 'Île-de-France', country: 'France', lat: 48.8566, lon: 2.3522 },
  { name: 'Singapore', state: '', country: 'Singapore', lat: 1.3521, lon: 103.8198 },
  { name: 'Lucknow', state: 'Uttar Pradesh', country: 'India', lat: 26.8467, lon: 80.9462 },
  { name: 'Mathura', state: 'Uttar Pradesh', country: 'India', lat: 27.4924, lon: 77.6737 }
];

export default function CitySearch({
  currentCity,
  onSelectCity,
  onUseLocation
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  // Search cities whenever query changes (debounced by 300ms)
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const data = await searchCities(query.trim());
        setResults(data || []);
      } catch (err) {
        console.warn('City search failed:', err);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (cityObj) => {
    setQuery('');
    setIsOpen(false);
    onSelectCity(cityObj);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (results.length > 0) {
        handleSelect(results[0]);
      } else if (query.trim().length >= 2) {
        // Fallback: search immediately and select top match
        setIsLoading(true);
        searchCities(query.trim())
          .then((data) => {
            if (data && data.length > 0) {
              handleSelect(data[0]);
            } else {
              // Custom city fallback with geocoding
              handleSelect({ name: query.trim(), state: '', country: 'Global' });
            }
          })
          .catch(() => {
            handleSelect({ name: query.trim(), state: '', country: 'Global' });
          })
          .finally(() => setIsLoading(false));
      }
    }
  };

  const handleLocationClick = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setIsLocating(false);

          let locationName = 'My Location';
          try {
            // Reverse geocode to get city name
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
            const data = await res.json();
            const addr = data.address || {};
            locationName = addr.city || addr.town || addr.municipality || addr.state_district || addr.state || 'Local Station';
          } catch (e) {
            console.warn('Reverse geocode failed:', e);
          }

          onSelectCity({
            name: locationName,
            state: 'Current Location',
            country: '',
            lat,
            lon
          });
        },
        (error) => {
          setIsLocating(false);
          console.warn('Geolocation error:', error.message);
          alert('Location access was denied or unavailable. You can search any city directly in the search bar.');
        },
        { timeout: 8000 }
      );
    } else {
      setIsLocating(false);
      alert('Geolocation is not supported by your browser.');
    }
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
            onKeyDown={handleKeyDown}
            placeholder="Search any city in the world (e.g. London, Tokyo, Delhi, New York, Dubai, Paris)..."
            className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm transition-all text-slate-900 dark:text-white"
          />
          {isLoading && (
            <Loader2 className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 animate-spin text-emerald-500" />
          )}
        </div>

        {/* Geolocation Button */}
        <button
          type="button"
          onClick={handleLocationClick}
          disabled={isLocating}
          className="inline-flex items-center gap-2 px-4 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-300 dark:hover:border-emerald-800 text-sm font-medium shadow-sm transition-all disabled:opacity-60 shrink-0"
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
      {isOpen && query.trim().length >= 2 && (
        <div className="absolute left-0 right-0 z-50 mt-1 max-h-72 overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-2 space-y-1">
          {isLoading && results.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
              <span>Searching cities worldwide...</span>
            </div>
          ) : results.length > 0 ? (
            results.map((city) => (
              <button
                key={`${city.name}-${city.lat}-${city.lon}`}
                type="button"
                onClick={() => handleSelect(city)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm text-left hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200 transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {city.name}
                    </span>
                    <span className="text-xs text-slate-400">
                      {[city.state, city.country].filter(Boolean).join(', ')}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-mono text-slate-400">
                    {city.lat?.toFixed(2)}°, {city.lon?.toFixed(2)}°
                  </span>
                </div>
              </button>
            ))
          ) : (
            <div className="p-4 text-center text-xs text-slate-400">
              No matching cities found. Press <strong>Enter</strong> to search with global coordinates.
            </div>
          )}
        </div>
      )}

      {/* Quick Access Pills for Popular Cities Worldwide */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1 shrink-0 font-medium">
          <Globe className="w-3.5 h-3.5 text-slate-400" />
          Popular Cities:
        </span>
        {QUICK_POPULAR_CITIES.map((city) => {
          const isSelected = currentCity?.toLowerCase() === city.name.toLowerCase();
          return (
            <button
              key={city.name}
              type="button"
              onClick={() => handleSelect(city)}
              className={`px-3 py-1.5 rounded-full font-medium shrink-0 transition-all flex items-center gap-1 ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 font-semibold'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700'
              }`}
            >
              <span>{city.name}</span>
              {city.country && city.country !== 'India' && (
                <span className="text-[10px] opacity-75">({city.countryCode || city.country.slice(0, 2)})</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
