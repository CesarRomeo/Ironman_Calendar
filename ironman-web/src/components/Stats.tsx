import React, { useMemo } from 'react';
import type { TrainingPlan } from '../types.ts';

interface StatsProps {
  trainingPlan: TrainingPlan;
  currentMonth: Date;
  mini?: boolean;
}

const Stats: React.FC<StatsProps> = ({ trainingPlan, currentMonth, mini = false }) => {
  const stats = useMemo(() => {
    let totals = { swim: 0, bike: 0, run: 0, time: 0, totalWorkouts: 0, completedWorkouts: 0 };
    const month = currentMonth.getMonth();
    const year = currentMonth.getFullYear();

    Object.keys(trainingPlan).forEach(dateStr => {
      const d = new Date(dateStr);
      if (d.getMonth() === month && d.getFullYear() === year) {
        trainingPlan[dateStr].forEach(w => {
          totals.totalWorkouts++;
          if (w.completed) {
            totals.completedWorkouts++;
            totals.time += (w.value || 0);
            if (w.type === "Natación") totals.swim += (w.km || 0);
            if (w.type === "Bici") totals.bike += (w.km || 0);
            if (w.type === "Carrera") totals.run += (w.km || 0);
          }
        });
      }
    });

    const h = Math.floor(totals.time);
    const m = Math.round((totals.time - h) * 60);
    const timeFormatted = `${h}h ${String(m).padStart(2, '0')}m`;

    const weekPercent = totals.totalWorkouts > 0 ? Math.round((totals.completedWorkouts / totals.totalWorkouts) * 100) : 0;
    
    const marathonTarget = 100;
    const marathonPercent = Math.min(100, Math.round((totals.run / marathonTarget) * 100));

    return { ...totals, timeFormatted, weekPercent, marathonPercent };
  }, [trainingPlan, currentMonth]);

  if (mini) {
    return (
      <div className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-3xl font-black font-headline text-primary leading-none">{stats.swim.toFixed(1)}</p>
            <p className="font-label text-[10px] uppercase opacity-40">Swim (KM)</p>
          </div>
          <div className="w-24 h-1 bg-surface-container-highest overflow-hidden rounded-full">
            <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${Math.min(100, (stats.swim / 20) * 100)}%` }}></div>
          </div>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-3xl font-black font-headline text-secondary leading-none">{stats.bike.toFixed(0)}</p>
            <p className="font-label text-[10px] uppercase opacity-40">Bike (KM)</p>
          </div>
          <div className="w-24 h-1 bg-surface-container-highest overflow-hidden rounded-full">
            <div className="h-full bg-secondary transition-all duration-1000" style={{ width: `${Math.min(100, (stats.bike / 500) * 100)}%` }}></div>
          </div>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-3xl font-black font-headline text-tertiary leading-none">{stats.run.toFixed(1)}</p>
            <p className="font-label text-[10px] uppercase opacity-40">Run (KM)</p>
          </div>
          <div className="w-24 h-1 bg-surface-container-highest overflow-hidden rounded-full">
            <div className="h-full bg-tertiary transition-all duration-1000" style={{ width: `${Math.min(100, (stats.run / 120) * 100)}%` }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-surface-container p-6 rounded-xl border border-outline-variant/10">
          <span className="font-label text-[10px] uppercase tracking-widest opacity-50 mb-4 block">Natación</span>
          <span className="text-4xl font-black font-headline text-primary">{stats.swim.toFixed(1)} km</span>
        </div>
        <div className="bg-surface-container p-6 rounded-xl border border-outline-variant/10">
          <span className="font-label text-[10px] uppercase tracking-widest opacity-50 mb-4 block">Bici</span>
          <span className="text-4xl font-black font-headline text-secondary">{stats.bike.toFixed(0)} km</span>
        </div>
        <div className="bg-surface-container p-6 rounded-xl border border-outline-variant/10">
          <span className="font-label text-[10px] uppercase tracking-widest opacity-50 mb-4 block">Running</span>
          <span className="text-4xl font-black font-headline text-tertiary">{stats.run.toFixed(1)} km</span>
        </div>
      </div>

      <div className="bg-surface-container p-8 rounded-xl border border-outline-variant/10 shadow-lg shadow-black/20">
        <div className="flex justify-between items-center mb-6">
          <h4 className="font-headline font-bold text-xl uppercase tracking-tighter">Plan Progress</h4>
          <span className="px-3 py-1 bg-primary/10 text-primary font-label text-[10px] font-bold rounded-full uppercase tracking-widest">Active Season</span>
        </div>
        
        <div className="space-y-8">
          <div>
            <div className="flex justify-between items-baseline mb-2">
              <span className="font-label text-[10px] uppercase tracking-widest opacity-60">Mensual General</span>
              <span className="text-xl font-black font-headline">{stats.weekPercent}%</span>
            </div>
            <div className="h-2 w-full bg-surface-container-lowest rounded-full overflow-hidden">
              <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${stats.weekPercent}%` }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-baseline mb-2">
              <span className="font-label text-[10px] uppercase tracking-widest opacity-60">Ultramarathon Preparation</span>
              <span className="text-xl font-black font-headline">{stats.marathonPercent}%</span>
            </div>
            <div className="h-2 w-full bg-surface-container-lowest rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-tertiary to-tertiary-container transition-all duration-1000" style={{ width: `${stats.marathonPercent}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-primary/10 border border-primary/20 p-10 rounded-xl flex flex-col items-center justify-center text-center">
        <p className="font-label text-[10px] uppercase tracking-[0.2em] text-primary font-bold mb-4">Volume Overview</p>
        <div className="flex items-baseline gap-2">
          <span className="text-6xl font-black font-headline leading-none">{stats.timeFormatted.split(' ')[0]}</span>
          <span className="text-xl font-label opacity-60 uppercase">Hours Trained</span>
        </div>
        <p className="text-xs mt-4 opacity-70 italic font-body">"On track for over-reaching phase next week. Maintain sleep hygiene."</p>
      </div>
    </div>
  );
};

export default Stats;
