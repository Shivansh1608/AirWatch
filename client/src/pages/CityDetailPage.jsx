import React from 'react';
import { useParams } from 'react-router-dom';

export default function CityDetailPage() {
  const { slug } = useParams();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white capitalize">
        City Intelligence: {slug ? slug.replace('-', ' ') : 'City'}
      </h1>
      <p className="text-sm text-slate-500">Detailed station telemetry and deep metrics loading...</p>
    </div>
  );
}
