import React, { useEffect } from 'react';
import { exchangeToken } from '../services/strava.ts';

const StravaCallback: React.FC = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      exchangeToken(code)
        .then(data => {
          localStorage.setItem('strava_token', data.access_token);
          localStorage.setItem('strava_refresh_token', data.refresh_token);
          window.location.href = '/';
        })
        .catch(err => {
          console.error('Error exchanging Strava token:', err);
          window.location.href = '/';
        });
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
      <p className="font-label text-sm uppercase tracking-widest text-primary animate-pulse">Synchronizing Performance Data...</p>
    </div>
  );
};

export default StravaCallback;
