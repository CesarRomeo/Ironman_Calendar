import React from 'react';
import type { TrainingPlan } from '../types.ts';

interface CalendarProps {
  currentMonth: Date;
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  trainingPlan: TrainingPlan;
  selectedDate: string | null;
  setSelectedDate: (date: string | null) => void;
}

const Calendar: React.FC<CalendarProps> = ({ 
  currentMonth, setCurrentMonth, trainingPlan, selectedDate, setSelectedDate 
}) => {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  let firstDay = new Date(year, month, 1).getDay();
  firstDay = (firstDay === 0) ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="bg-surface/50 min-h-[100px] p-2 opacity-20"></div>);
  }

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    const dayWorkouts = trainingPlan[dateStr] || [];
    const isToday = dateStr === todayStr;
    const isSelected = selectedDate === dateStr;

    days.push(
      <div 
        key={i} 
        className={`bg-surface min-h-[100px] p-3 border border-outline-variant/10 cursor-pointer transition-all hover:bg-surface-container-high relative group/day ${isToday ? 'ring-1 ring-inset ring-primary/30 bg-primary/5' : ''} ${isSelected ? 'border-primary shadow-[0_0_15px_rgba(0,218,243,0.1)] z-10' : ''}`}
        onClick={() => setSelectedDate(dateStr)}
      >
        <span className={`font-label text-[10px] ${isToday ? 'text-primary font-bold' : 'opacity-40'}`}>{String(i).padStart(2, '0')}</span>
        
        <div className="mt-1 space-y-1">
          {dayWorkouts.map((w, idx) => (
            <div key={idx} className={`p-1.5 rounded-sm border-l-2 transition-all ${w.completed ? 'bg-secondary/10 border-secondary opacity-40' : 'bg-primary/10 border-primary'}`}>
              <p className={`text-[9px] font-bold uppercase tracking-tighter truncate ${w.completed ? 'text-secondary' : 'text-primary'}`}>
                {w.type}: {w.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-low p-8 rounded-xl border-t border-outline-variant/5 shadow-2xl animate-in slide-in-from-left-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-2xl font-black font-headline tracking-tighter uppercase">{months[month]} {year}</h3>
          <p className="font-label text-[10px] uppercase opacity-50 tracking-widest mt-1">Foundation Block Phase 2</p>
        </div>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 rounded-full border border-outline-variant/20 hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-sm">chevron_left</span>
          </button>
          <button onClick={nextMonth} className="p-2 rounded-full border border-outline-variant/20 hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-px bg-outline-variant/10 rounded-lg overflow-hidden border border-outline-variant/10">
        <div className="bg-surface py-3 text-center"><p className="font-label text-[10px] uppercase font-bold opacity-40">Mon</p></div>
        <div className="bg-surface py-3 text-center"><p className="font-label text-[10px] uppercase font-bold opacity-40">Tue</p></div>
        <div className="bg-surface py-3 text-center"><p className="font-label text-[10px] uppercase font-bold opacity-40">Wed</p></div>
        <div className="bg-surface py-3 text-center"><p className="font-label text-[10px] uppercase font-bold opacity-40">Thu</p></div>
        <div className="bg-surface py-3 text-center"><p className="font-label text-[10px] uppercase font-bold opacity-40">Fri</p></div>
        <div className="bg-surface py-3 text-center"><p className="font-label text-[10px] uppercase font-bold opacity-40">Sat</p></div>
        <div className="bg-surface py-3 text-center"><p className="font-label text-[10px] uppercase font-bold opacity-40">Sun</p></div>
        {days}
      </div>
    </div>
  );
};

export default Calendar;
