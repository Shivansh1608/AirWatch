import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  fetchCurrentAQI,
  fetchAQIForecast,
  fetchAQIHistory,
  fetchNearbyStations,
  fetchWeather
} from '../api/aqiApi';
import {
  INDIAN_CITIES_MOCK,
  generateHourlyForecast,
  generateHistoricalTrend
} from '../components/dashboard/MockAQIData';
import CitySearch from '../components/dashboard/CitySearch';
import AQIGauge from '../components/dashboard/AQIGauge';
import HealthAdvisory from '../components/dashboard/HealthAdvisory';
import WeatherCard from '../components/dashboard/WeatherCard';
import PollutionInsights from '../components/dashboard/PollutionInsights';
import PollutantGrid from '../components/dashboard/PollutantGrid';
import AQICharts from '../components/dashboard/AQICharts';
import StationMap from '../components/map/StationMap';
import DataBadge from '../components/common/DataBadge';
import { MapPin, Sparkles, Building2, RefreshCw, Globe2 } from 'lucide-react';

export default function HomePage() {
  const [activeCity, setActiveCity] = useState({
    name: 'Delhi',
    state: 'National Capital Territory',
    country: 'India',
    lat: 28.6139,
    lon: 77.2090
  });

  // Fallback city object from mock registry
  const mockCity =
    INDIAN_CITIES_MOCK.find(
      (c) => c.name.toLowerCase() === activeCity.name.toLowerCase()
    ) || INDIAN_CITIES_MOCK[0];

  // 1. Fetch live AQI from backend with lat/lon coordinates
  const {
    data: liveAQI,
    isLoading: aqiLoading,
    refetch: refetchAQI,
    isFetching
  } = useQuery({
    queryKey: ['currentAQI', activeCity.name, activeCity.lat, activeCity.lon],
    queryFn: () =>
      fetchCurrentAQI({
        lat: activeCity.lat,
        lon: activeCity.lon,
        city: activeCity.name
      }),
    retry: 1
  });

  // 2. Fetch live weather from backend with lat/lon coordinates
  const { data: liveWeather } = useQuery({
    queryKey: ['weather', activeCity.name, activeCity.lat, activeCity.lon],
    queryFn: () =>
      fetchWeather({
        lat: activeCity.lat,
        lon: activeCity.lon,
        city: activeCity.name
      }),
    retry: 1
  });

  // 3. Fetch 24-48h forecast
  const { data: forecastData } = useQuery({
    queryKey: ['forecast', activeCity.name, activeCity.lat, activeCity.lon],
    queryFn: () =>
      fetchAQIForecast({
        lat: activeCity.lat,
        lon: activeCity.lon,
        city: activeCity.name
      }),
    retry: 1
  });

  // 4. Fetch 7d history
  const { data: historyData } = useQuery({
    queryKey: ['history', activeCity.name],
    queryFn: () => fetchAQIHistory({ city: activeCity.name, range: '7d' }),
    retry: 1
  });

  // 5. Fetch nearby stations for Leaflet map around the active city's coordinates
  const { data: stationsData } = useQuery({
    queryKey: ['stations', activeCity.lat, activeCity.lon],
    queryFn: () =>
      fetchNearbyStations({
        lat: activeCity.lat,
        lon: activeCity.lon,
        radius: 50
      }),
    retry: 1
  });

  // Merge real telemetry with fallback mock data
  const currentAQI = liveAQI?.aqi ?? mockCity.aqi;
  const currentCategory = liveAQI?.category ?? mockCity.category;
  const dominantPollutant = liveAQI?.dominantPollutant ?? mockCity.dominantPollutant;
  const pollutants = liveAQI?.pollutants ?? mockCity.pollutants;
  const source = liveAQI?.source ?? mockCity.source;
  const type = liveAQI?.type ?? mockCity.type;
  const timestamp = liveAQI?.timestamp ?? mockCity.timestamp;
  const stationName = liveAQI?.stationName ?? `${activeCity.name} Ground Sensor`;

  const weather = liveWeather ?? mockCity.weather;

  // Chart data: use backend forecast/history if available, otherwise fallback
  const hourlyData =
    forecastData?.forecast?.length > 0
      ? forecastData.forecast
      : generateHourlyForecast(currentAQI);

  const history7d =
    historyData?.history?.length > 0
      ? historyData.history
      : generateHistoricalTrend(currentAQI, 7);

  const history30d = generateHistoricalTrend(currentAQI, 30);

  const handleSelectCity = (cityObj) => {
    if (typeof cityObj === 'string') {
      const match = INDIAN_CITIES_MOCK.find(
        (c) => c.name.toLowerCase() === cityObj.toLowerCase()
      );
      if (match) {
        setActiveCity({
          name: match.name,
          state: match.state,
          country: 'India',
          lat: match.lat,
          lon: match.lon
        });
      } else {
        setActiveCity({
          name: cityObj,
          state: '',
          country: 'Global',
          lat: 28.6139,
          lon: 77.2090
        });
      }
    } else if (cityObj && typeof cityObj === 'object') {
      setActiveCity({
        name: cityObj.name,
        state: cityObj.state || '',
        country: cityObj.country || '',
        lat: cityObj.lat || 28.6139,
        lon: cityObj.lon || 77.2090
      });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Search Header Section */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 mb-2">
              <Globe2 className="w-3.5 h-3.5" />
              <span>Global Air Quality & Weather Intelligence</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Air Quality & Weather Dashboard
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Search any city worldwide for real-time AQI, atmospheric dispersion, ground sensors, and weather.
            </p>
          </div>

          <button
            type="button"
            onClick={() => refetchAQI()}
            disabled={isFetching}
            className="self-start md:self-auto inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 text-slate-700 dark:text-slate-300 shadow-xs transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin text-emerald-500' : ''}`} />
            <span>Refresh Telemetry</span>
          </button>
        </div>

        <CitySearch
          currentCity={activeCity.name}
          onSelectCity={handleSelectCity}
        />
      </section>

      {/* City Status Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {activeCity.name}
              </h2>
              {(activeCity.state || activeCity.country) && (
                <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                  {[activeCity.state, activeCity.country].filter(Boolean).join(', ')}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              {stationName} ({activeCity.lat.toFixed(4)}°, {activeCity.lon.toFixed(4)}°)
            </p>
          </div>
        </div>

        <DataBadge type={type} source={source} timestamp={timestamp} />
      </div>

      {/* Main Metric Cards: AQI Gauge + Health Advisory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-5 flex flex-col">
          <AQIGauge
            aqi={currentAQI}
            dominantPollutant={dominantPollutant}
            type={type}
            source={source}
            timestamp={timestamp}
          />
        </div>

        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <HealthAdvisory aqi={currentAQI} />
          <WeatherCard weather={weather} />
          <PollutionInsights city={activeCity.name} />
        </div>
      </div>

      {/* Key Pollutants Grid (6 CPCB pollutants) */}
      <PollutantGrid pollutants={pollutants} />

      {/* 24-48h Hourly Forecast & Historical Trend Charts */}
      <AQICharts
        hourlyData={hourlyData}
        history7d={history7d}
        history30d={history30d}
      />

      {/* Interactive Monitoring Stations Map */}
      <StationMap
        center={[activeCity.lat, activeCity.lon]}
        stations={stationsData?.stations || []}
        cityName={activeCity.name}
      />
    </div>
  );
}
