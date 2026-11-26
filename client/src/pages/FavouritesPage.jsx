import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchFavourites,
  addFavouriteCity,
  removeFavouriteCity,
  fetchAlerts,
  createAlert,
  deleteAlert,
  fetchNotifications,
  markNotificationRead
} from '../api/authApi';
import { getCPCBCategory } from '../utils/cpcbColors';
import DataBadge from '../components/common/DataBadge';
import { Star, Bell, Plus, Trash2, MapPin, CheckCircle, ShieldAlert, AlertTriangle } from 'lucide-react';

export default function FavouritesPage() {
  const queryClient = useQueryClient();
  const [newCityName, setNewCityName] = useState('');
  const [alertThreshold, setAlertThreshold] = useState(200);
  const [selectedAlertCity, setSelectedAlertCity] = useState('Delhi');

  // Queries
  const { data: favourites = [] } = useQuery({
    queryKey: ['favourites'],
    queryFn: fetchFavourites
  });

  const { data: alerts = [] } = useQuery({
    queryKey: ['alerts'],
    queryFn: fetchAlerts
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications
  });

  // Mutations
  const addFavMutation = useMutation({
    mutationFn: addFavouriteCity,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favourites'] })
  });

  const removeFavMutation = useMutation({
    mutationFn: removeFavouriteCity,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favourites'] })
  });

  const createAlertMutation = useMutation({
    mutationFn: createAlert,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['alerts'] })
  });

  const deleteAlertMutation = useMutation({
    mutationFn: deleteAlert,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['alerts'] })
  });

  const readNotifMutation = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] })
  });

  const handleCreateAlert = (e) => {
    e.preventDefault();
    createAlertMutation.mutate({
      cityName: selectedAlertCity,
      threshold: alertThreshold
    });
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
          <Star className="w-8 h-8 text-amber-500 fill-amber-500" />
          Favourite Cities & Real-Time Alerts
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Monitor your tracked cities at a glance and receive automated notifications when CPCB thresholds are breached.
        </p>
      </div>

      {/* Notifications Banner */}
      {notifications.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-amber-800 dark:text-amber-300">
            <span className="flex items-center gap-1.5">
              <Bell className="w-4 h-4" />
              Active Air Quality Alerts
            </span>
            <span>{notifications.filter((n) => !n.read).length} Unread</span>
          </div>

          <div className="space-y-2 pt-1">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-amber-200/60 dark:border-amber-800/60 text-xs shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span className="text-slate-800 dark:text-slate-200">{notif.message}</span>
                </div>
                {!notif.read && (
                  <button
                    onClick={() => readNotifMutation.mutate(notif.id)}
                    className="text-[11px] font-semibold text-emerald-600 hover:underline shrink-0 ml-3"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Favourites Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Tracked Cities
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favourites.map((city) => {
            const category = getCPCBCategory(city.aqi);
            return (
              <div
                key={city.slug || city.name}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-emerald-500" />
                      {city.name}
                    </h3>
                    <span className="text-xs text-slate-400">{city.state || 'India'}</span>
                  </div>
                  <button
                    onClick={() => removeFavMutation.mutate(city.slug || city.name)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Remove from favourites"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-baseline justify-between pt-2">
                  <div>
                    <span className="text-3xl font-black" style={{ color: category.color }}>
                      {city.aqi}
                    </span>
                    <span
                      className="ml-2 text-xs font-bold px-2 py-0.5 rounded-md text-white"
                      style={{ backgroundColor: category.color }}
                    >
                      {category.name}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">
                    Dominant: <span className="font-semibold text-slate-700 dark:text-slate-300">{city.dominantPollutant}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                  <DataBadge type={city.type} source={city.source} timestamp={city.timestamp} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Threshold Alert Configuration */}
      <section className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 max-w-2xl">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Bell className="w-5 h-5 text-emerald-500" />
          Configure Automated AQI Threshold Alert
        </h2>
        <p className="text-xs text-slate-500">
          Our background daemon continuously scans monitoring stations and issues notifications whenever AQI exceeds your configured limit.
        </p>

        <form onSubmit={handleCreateAlert} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                City to Monitor
              </label>
              <select
                value={selectedAlertCity}
                onChange={(e) => setSelectedAlertCity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="Delhi">Delhi</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Lucknow">Lucknow</option>
                <option value="Mathura">Mathura</option>
                <option value="Kolkata">Kolkata</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                AQI Threshold (100 - 400)
              </label>
              <input
                type="number"
                min="50"
                max="500"
                value={alertThreshold}
                onChange={(e) => setAlertThreshold(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-colors shadow-sm inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Set Alert Threshold
          </button>
        </form>

        {/* Existing Alerts List */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Active Watchers ({alerts.length})
          </h3>
          {alerts.map((alt) => (
            <div
              key={alt.id}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs"
            >
              <div>
                <span className="font-bold text-slate-900 dark:text-white">{alt.cityName}</span>
                <span className="text-slate-500 ml-2">Alert when AQI &gt; {alt.threshold}</span>
              </div>
              <button
                onClick={() => deleteAlertMutation.mutate(alt.id)}
                className="p-1 text-slate-400 hover:text-rose-500"
                title="Delete alert"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
