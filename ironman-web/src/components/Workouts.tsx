import React, { useEffect, useState } from 'react';
import { getAthleteActivities } from '../services/strava.ts';

interface StravaActivity {
  id: number;
  name: string;
  type: string;
  distance: number;
  moving_time: number;
  start_date: string;
  total_elevation_gain: number;
}

interface GroupedWorkouts {
  [week: string]: StravaActivity[];
}

const Workouts: React.FC = () => {
  const [activities, setActivities] = useState<StravaActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Cargar desde LocalStorage al iniciar (Clone persistente)
  useEffect(() => {
    const savedEntrenos = localStorage.getItem('ironEntrenos');
    if (savedEntrenos) {
      setActivities(JSON.parse(savedEntrenos));
    }
    setLoading(false);
  }, []);

  // Función para sincronizar con Strava (Fusión inteligente)
  const handleSync = async () => {
    const token = localStorage.getItem('strava_token');
    if (!token) {
      setError('Strava no conectado. Ve a Configuración para vincular tu cuenta.');
      return;
    }

    setSyncing(true);
    setError(null);

    try {
      const newData = await getAthleteActivities(token);
      
      if (Array.isArray(newData)) {
        setActivities(prev => {
          // Obtener IDs de las actividades que ya tenemos clonadas
          const existingIds = new Set(prev.map(a => a.id));
          
          // Filtrar solo las nuevas que no están en nuestro registro local
          const uniqueNewActivities = newData.filter((a: StravaActivity) => !existingIds.has(a.id));
          
          const combined = [...uniqueNewActivities, ...prev].sort((a, b) => 
            new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
          );

          // Guardar permanentemente el clon actualizado
          localStorage.setItem('ironEntrenos', JSON.stringify(combined));
          return combined;
        });
      } else {
        setError('Error al sincronizar con Strava. Intenta reconectar.');
      }
    } catch (err) {
      setError('Error de red al conectar con Strava.');
      console.error(err);
    } finally {
      setSyncing(false);
    }
  };

  const getWeekNumber = (date: Date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  };

  const groupActivitiesByWeek = (activities: StravaActivity[]) => {
    return activities.reduce((acc: GroupedWorkouts, activity) => {
      const date = new Date(activity.start_date);
      const year = date.getFullYear();
      const week = getWeekNumber(date);
      const weekKey = `Semana ${week}, ${year}`;
      
      if (!acc[weekKey]) {
        acc[weekKey] = [];
      }
      acc[weekKey].push(activity);
      return acc;
    }, {});
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="font-label text-sm uppercase tracking-widest text-primary animate-pulse">Cargando Historial Local...</p>
      </div>
    );
  }

  const grouped = groupActivitiesByWeek(activities);
  const sortedWeeks = Object.keys(grouped).sort((a, b) => {
    // Ordenar por año y luego por semana de forma descendente
    const [weekA, yearA] = a.replace('Semana ', '').split(', ');
    const [weekB, yearB] = b.replace('Semana ', '').split(', ');
    if (yearA !== yearB) return parseInt(yearB) - parseInt(yearA);
    return parseInt(weekB) - parseInt(weekA);
  });

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black font-headline tracking-tighter uppercase mb-2">Mis <span className="text-primary">Entrenos</span></h2>
          <p className="font-label text-[10px] uppercase tracking-[0.3em] opacity-40 font-black text-primary leading-tight">Clonación Permanente Strava</p>
        </div>
        
        <div className="flex items-center gap-4">
            <div className="bg-surface-container-high px-6 py-3 rounded-full border border-outline-variant/10 flex items-center gap-4 shadow-lg">
                <span className="material-symbols-outlined text-primary text-xl">database</span>
                <span className="font-label text-[10px] uppercase font-bold tracking-widest">{activities.length} Sesiones Guardadas</span>
            </div>
            
            <button 
                onClick={handleSync}
                disabled={syncing}
                className={`flex items-center gap-3 px-6 py-3 rounded-full font-label text-[10px] font-black uppercase tracking-widest transition-all ${syncing ? 'bg-surface-container text-on-surface opacity-50' : 'bg-primary text-on-primary hover:scale-105 active:scale-95 shadow-lg shadow-primary/20'}`}
            >
                <span className={`material-symbols-outlined text-lg ${syncing ? 'animate-spin' : ''}`}>sync</span>
                {syncing ? 'Sincronizando...' : 'Sincronizar Strava'}
            </button>
        </div>
      </div>

      {error && (
        <div className="bg-error-container/10 border border-error/20 p-4 rounded-lg flex items-center gap-4 text-error animate-in fade-in zoom-in-95">
            <span className="material-symbols-outlined">warning</span>
            <p className="font-label text-[10px] uppercase font-black tracking-widest">{error}</p>
        </div>
      )}

      {activities.length === 0 && !syncing ? (
         <div className="bg-surface-container p-20 rounded-xl border border-outline-variant/10 text-center shadow-xl max-w-2xl mx-auto">
            <span className="material-symbols-outlined text-primary text-6xl mb-6 opacity-20">cloud_sync</span>
            <h3 className="font-headline font-black text-2xl uppercase tracking-tighter mb-4 text-on-surface">Sin Sesiones Clonadas</h3>
            <p className="font-body text-sm opacity-50 mb-10 leading-relaxed">
                Aún no has sincronizado tus entrenos. Pulsa el botón de arriba para clonar tu historial de Strava permanentemente en esta aplicación.
            </p>
            <button 
                onClick={handleSync}
                className="bg-primary text-on-primary px-10 py-4 rounded-full font-label text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl shadow-primary/20"
            >
                Iniciar Primera Sincronización
            </button>
        </div>
      ) : (
        <div className="space-y-10">
          {sortedWeeks.map(week => (
            <section key={week}>
              <div className="flex items-center gap-6 mb-8">
                  <h3 className="text-xl font-black font-headline tracking-tighter uppercase whitespace-nowrap">{week}</h3>
                  <div className="h-[1px] w-full bg-outline-variant/20"></div>
                  <div className="px-3 py-1 bg-primary/10 rounded-sm">
                      <span className="font-label text-[10px] uppercase font-black text-primary tracking-widest">{grouped[week].length} Sesiones</span>
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {grouped[week].map(activity => (
                  <div key={activity.id} className="bg-surface-container hover:bg-surface-container-high p-6 rounded-xl border border-outline-variant/10 transition-all group cursor-pointer shadow-lg hover:shadow-primary/5 hover:translate-y-[-4px]">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary opacity-60 group-hover:opacity-100 transition-opacity">
                          {activity.type === 'Run' ? 'directions_run' : activity.type === 'Ride' ? 'directions_bike' : 'pool'}
                        </span>
                        <span className="font-label text-[10px] uppercase tracking-[0.2em] opacity-40 font-black group-hover:text-primary group-hover:opacity-100 transition-all">{activity.type}</span>
                      </div>
                      <span className="font-label text-[10px] opacity-30 group-hover:opacity-60 transition-opacity uppercase font-bold">
                          {new Date(activity.start_date).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <h4 className="font-headline font-black text-lg leading-tight uppercase tracking-tight mb-4 line-clamp-1 group-hover:text-primary transition-colors">{activity.name}</h4>
                    
                    <div className="grid grid-cols-2 gap-4 mt-auto">
                      <div>
                        <p className="font-label text-[8px] uppercase tracking-[0.3em] opacity-30 mb-1 font-black">Distancia</p>
                        <p className="text-xl font-black font-headline leading-none">{(activity.distance / 1000).toFixed(2)} <span className="text-[10px] opacity-40 font-label tracking-normal">KM</span></p>
                      </div>
                      <div>
                        <p className="font-label text-[8px] uppercase tracking-[0.3em] opacity-30 mb-1 font-black">Duración</p>
                        <p className="text-xl font-black font-headline leading-none">{Math.floor(activity.moving_time / 3600)}h {Math.floor((activity.moving_time % 3600) / 60)}m</p>
                      </div>
                    </div>
                    
                    {activity.total_elevation_gain > 0 && (
                      <div className="mt-4 pt-4 border-t border-outline-variant/5 flex items-center gap-2">
                          <span className="material-symbols-outlined text-xs opacity-40">terrain</span>
                          <span className="font-label text-[10px] uppercase font-bold opacity-40 tracking-widest">{activity.total_elevation_gain}m Desnivel</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};

export default Workouts;
