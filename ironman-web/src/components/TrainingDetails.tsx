import React from 'react';
import type { Workout } from '../types.ts';

interface TrainingDetailsProps {
  date: string;
  workouts: Workout[];
  onClose: () => void;
  onToggleWorkout: (date: string, workoutId: string) => void;
}

const TrainingDetails: React.FC<TrainingDetailsProps> = ({ date, workouts, onClose, onToggleWorkout }) => {
  const d = new Date(date);
  const dateFormatted = d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="bg-surface-container p-8 rounded-xl border border-outline-variant/10 shadow-2xl sticky top-24">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-headline font-bold text-xl uppercase tracking-tighter text-primary">{dateFormatted}</h3>
        <button className="p-2 hover:bg-surface-container-high rounded-full transition-colors group" onClick={onClose}>
          <span className="material-symbols-outlined text-on-surface opacity-50 group-hover:opacity-100 transition-opacity">close</span>
        </button>
      </div>
      <div className="space-y-4">
        {workouts.length > 0 ? (
          workouts.map((w) => (
            <div key={w.id} className={`p-5 rounded-lg border-l-4 transition-all ${w.completed ? 'bg-secondary/5 border-secondary opacity-60' : 'bg-surface-container-high border-primary shadow-lg shadow-primary/5'}`}>
              <div className="flex flex-col gap-4">
                <div className="flex-1">
                  <span className={`font-label text-[10px] font-black uppercase tracking-widest ${w.completed ? 'text-secondary' : 'text-primary'}`}>{w.type}</span>
                  <div className={`font-headline font-bold text-xl mt-1 tracking-tight ${w.completed ? 'line-through opacity-50' : ''}`}>{w.title}</div>
                  <div className="text-xs opacity-60 mt-3 font-body leading-relaxed">{w.detail}</div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-outline-variant/5">
                    <div className="font-label text-[10px] uppercase opacity-40 tracking-widest">{w.value} HOURS</div>
                    <button 
                    className={`px-6 py-2.5 rounded-full font-label text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${w.completed ? 'bg-secondary text-on-secondary' : 'bg-primary text-on-primary hover:brightness-110 shadow-lg shadow-primary/20'}`}
                    onClick={() => onToggleWorkout(date, w.id)}
                    >
                    {w.completed ? '✓ Completed' : 'Mark as Done'}
                    </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-surface-container-high/30 rounded-lg border border-dashed border-outline-variant/20">
            <span className="material-symbols-outlined text-4xl opacity-10 mb-2 block">event_busy</span>
            <p className="opacity-40 italic text-xs font-body tracking-wide">No performance goals set for this date.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainingDetails;
