import React, { useEffect, useState } from 'react';
import { exchangeToken } from '../services/strava.ts';

const StravaCallback: React.FC = () => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      exchangeToken(code)
        .then(data => {
          if (data.access_token) {
            localStorage.setItem('strava_token', data.access_token);
            localStorage.setItem('strava_refresh_token', data.refresh_token);
            localStorage.setItem('strava_expires_at', data.expires_at.toString());
            window.location.href = '/';
          } else {
            setError('No se pudo obtener el token de acceso. Verifica el Client Secret.');
          }
        })
        .catch(err => {
          console.error('Error exchanging Strava token:', err);
          setError('Error de conexión con Strava.');
        });
    } else {
      setError('No se recibió el código de autorización de Strava.');
    }
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-8 text-center">
        <span className="material-symbols-outlined text-6xl text-error mb-4">error</span>
        <h2 className="text-2xl font-black font-headline uppercase tracking-tighter mb-2">Error de Sincronización</h2>
        <p className="text-on-surface opacity-60 max-w-md mb-8">{error}</p>
        <button 
          onClick={() => window.location.href = '/'}
          className="px-8 py-3 bg-primary text-on-primary rounded-full font-label text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all"
        >
          Volver al Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
      <p className="font-label text-sm uppercase tracking-widest text-primary animate-pulse">Synchronizing Performance Data...</p>
    </div>
  );
};

export default StravaCallback;
