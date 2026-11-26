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
import { MapPin, Sparkles, Building2, RefreshCw } from 'lucide-react';

export default function HomePage() {
  const [selectedCityName, setSelectedCityName] = useState('Delhi');
  const [selectedCoords, setSelectedCoords] = useState(null);

  // Fallback city object from mock registry
  const mockCity =
    INDIAN_CITIES_MOCK.find(
      (c) => c.name.toLowerCase() === selectedCityName.toLowerCase()
    ) || INDIAN_CITIES_MOCK[0];

  // 1. Fetch live AQI from backend
  const {
    data: liveAQI,
    isLoading: aqiLoading,
    refetch: refetchAQI,
    isFetching
  } = useQuery({
    queryKey: ['currentAQI', selectedCityName, selectedCoords],
    queryFn: () =>
      fetchCurrentAQI(
        selectedCoords
          ? { lat: selectedCoords.lat, lon: selectedCoords.lon }
          : { city: selectedCityName }
      ),
    retry: 1
  });

  // 2. Fetch live weather from backend
  const { data: liveWeather } = useQuery({
    queryKey: ['weather', selectedCityName, selectedCoords],
    queryFn: () =>
      fetchWeather(
        selectedCoords
          ? { lat: selectedCoords.lat, lon: selectedCoords.lon }
          : { city: selectedCityName }
      ),
    retry: 1
  });

  // 3. Fetch 24-48h forecast
  const { data: forecastData } = useQuery({
    queryKey: ['forecast', selectedCityName, selectedCoords],
    queryFn: () =>
      fetchAQIForecast(
        selectedCoords
          ? { lat: selectedCoords.lat, lon: selectedCoords.lon }
          : { city: selectedCityName }
      ),
    retry: 1
  });

  // 4. Fetch 7d history
  const { data: historyData } = useQuery({
    queryKey: ['history', selectedCityName],
    queryFn: () => fetchAQIHistory({ city: selectedCityName, range: '7d' }),
    retry: 1
  });

  // 5. Fetch nearby stations for Leaflet map
  const { data: stationsData } = useQuery({
    queryKey: ['stations', selectedCityName, selectedCoords],
    queryFn: () =>
      fetchNearbyStations(
        selectedCoords
          ? { lat: selectedCoords.lat, lon: selectedCoords.lon, radius: 50 }
          : { lat: mockCity.lat, lon: mockCity.lon, radius: 50 }
      ),
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
  const stationName = liveAQI?.stationName ?? mockCity.station;

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

  const handleSelectCity = (name) => {
    setSelectedCityName(name);
    setSelectedCoords(null);
  };

  const handleUseLocation = ({ lat, lon }) => {
    setSelectedCoords({ lat, lon });
    setSelectedCityName('Current Location');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Search Header Section */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real-Time Indian Air Quality Intelligence</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Air Quality Dashboard
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              CPCB Standard Air Quality Index, Ground Sensors, and Dispersion Telemetry.
            </p>
          </div>

          <button
            type="button"
            onClick={() => refetchAQI()}
            disabled={isFetching}
            className="self-start md:self-auto inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 text-slate-700 dark:text-slate-300 shadow-xs transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin text-emerald-500' : ''}`} />
            <span>Refresh Readings</span>
          </button>
        </div>

        <CitySearch
          currentCity={selectedCityName}
          onSelectCity={handleSelectCity}
          onUseLocation={handleUseLocation}
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
                {selectedCityName}
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                {mockCity.state || 'India'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              {stationName}
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
          <PollutionInsights city={selectedCityName} />
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
        center={[mockCity.lat, mockCity.lon]}
        stations={stationsData?.stations || []}
        cityName={selectedCityName}
      />
    </div>
  );
}
