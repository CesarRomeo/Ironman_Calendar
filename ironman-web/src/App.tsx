import React from 'react';
import type { TrainingPlan, View, Workout } from './types.ts';
import { generatePlan } from './utils/planGenerator.ts';
import './index.css';

// Components
import Calendar from './components/Calendar.tsx';
import Stats from './components/Stats.tsx';
import Settings from './components/Settings.tsx';
import TrainingDetails from './components/TrainingDetails.tsx';
import StravaCallback from './components/StravaCallback.tsx';
import Workouts from './components/Workouts.tsx';

function App() {
  const [activeView, setActiveView] = React.useState<View>('calendar');
  const [trainingPlan, setTrainingPlan] = React.useState<TrainingPlan>({});
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const isStravaCallback = window.location.pathname === '/strava-callback';

  if (isStravaCallback) {
    return <StravaCallback />;
  }

  // Load plan
  React.useEffect(() => {
    const savedPlan = localStorage.getItem('ironPlan');
    if (savedPlan) {
      setTrainingPlan(JSON.parse(savedPlan));
    } else {
      const newPlan = generatePlan();
      setTrainingPlan(newPlan);
      localStorage.setItem('ironPlan', JSON.stringify(newPlan));
    }
  }, []);

  // Save plan whenever it changes
  React.useEffect(() => {
    if (Object.keys(trainingPlan).length > 0) {
      localStorage.setItem('ironPlan', JSON.stringify(trainingPlan));
    }
  }, [trainingPlan]);

  const toggleWorkout = (date: string, workoutId: string) => {
    setTrainingPlan(prev => {
      const dayWorkouts = prev[date] || [];
      const updatedWorkouts = dayWorkouts.map(w => 
        w.id === workoutId ? { ...w, completed: !w.completed } : w
      );
      return { ...prev, [date]: updatedWorkouts };
    });
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todayWorkouts = trainingPlan[todayStr] || [];

  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary selection:text-on-primary min-h-screen">
      {/* SideNavBar */}
      <aside className="fixed left-0 top-0 h-full w-64 border-r border-outline-variant/10 bg-surface flex flex-col py-8 z-50 shadow-2xl">
        <div className="px-6 mb-12">
          <h1 className="text-2xl font-black tracking-tighter text-primary uppercase font-headline">The Kinetic Lab</h1>
          <p className="font-label text-[10px] tracking-[0.2em] uppercase opacity-50 mt-1">Elite Performance</p>
        </div>
        <nav className="flex-1 flex flex-col gap-1">
          <button 
            onClick={() => setActiveView('calendar')}
            className={`px-6 py-4 flex items-center gap-4 group transition-all relative ${activeView === 'calendar' ? 'text-primary' : 'text-on-surface opacity-60 hover:opacity-100 hover:bg-surface-container hover:text-primary'}`}
          >
            {activeView === 'calendar' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_10px_rgba(0,218,243,0.5)]"></div>}
            <span className="material-symbols-outlined" style={{ fontVariationSettings: activeView === 'calendar' ? "'FILL' 1" : "" }}>dashboard</span>
            <span className="font-label text-sm tracking-wide uppercase text-left font-bold">Dashboard</span>
          </button>
          
          <button 
             onClick={() => setActiveView('stats')}
             className={`px-6 py-4 flex items-center gap-4 group transition-all relative ${activeView === 'stats' ? 'text-primary' : 'text-on-surface opacity-60 hover:opacity-100 hover:bg-surface-container hover:text-primary'}`}
          >
            {activeView === 'stats' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_10px_rgba(0,218,243,0.5)]"></div>}
            <span className="material-symbols-outlined" style={{ fontVariationSettings: activeView === 'stats' ? "'FILL' 1" : "" }}>leaderboard</span>
            <span className="font-label text-sm tracking-wide uppercase text-left font-bold">Statistics</span>
          </button>

          <button 
             onClick={() => setActiveView('entrenos')}
             className={`px-6 py-4 flex items-center gap-4 group transition-all relative ${activeView === 'entrenos' ? 'text-primary' : 'text-on-surface opacity-60 hover:opacity-100 hover:bg-surface-container hover:text-primary'}`}
          >
            {activeView === 'entrenos' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_10px_rgba(0,218,243,0.5)]"></div>}
            <span className="material-symbols-outlined" style={{ fontVariationSettings: activeView === 'entrenos' ? "'FILL' 1" : "" }}>fitness_center</span>
            <span className="font-label text-sm tracking-wide uppercase text-left font-bold">Entrenos</span>
          </button>

          <button 
             onClick={() => setActiveView('settings')}
             className={`mt-auto px-6 py-4 flex items-center gap-4 group transition-all relative ${activeView === 'settings' ? 'text-primary' : 'text-on-surface opacity-60 hover:opacity-100 hover:bg-surface-container hover:text-primary'}`}
          >
            {activeView === 'settings' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_10px_rgba(0,218,243,0.5)]"></div>}
            <span className="material-symbols-outlined" style={{ fontVariationSettings: activeView === 'settings' ? "'FILL' 1" : "" }}>settings</span>
            <span className="font-label text-sm tracking-wide uppercase text-left font-bold">Settings</span>
          </button>
        </nav>
        <div className="px-6 mt-8">
          <button className="w-full bg-primary text-on-primary font-label text-[10px] font-black uppercase py-4 rounded-full tracking-[0.2em] hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-primary/20">
            Start Session
          </button>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="ml-64 min-h-screen relative">
        {/* TopNavBar */}
        <header className="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 z-40 bg-surface/70 backdrop-blur-md flex justify-between items-center px-8 border-b border-outline-variant/5">
          <div className="flex items-center gap-4">
            <span className="font-headline text-[10px] font-black text-on-surface tracking-[0.3em] uppercase opacity-70">
              {activeView === 'calendar' ? 'Performance Dashboard' : activeView.toUpperCase()}
            </span>
            <div className="h-4 w-[1px] bg-outline-variant/30"></div>
            <div className="flex items-center gap-2 px-3 py-1 bg-secondary-container/20 rounded-full border border-secondary/10">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              <span className="font-label text-[10px] uppercase text-secondary font-bold tracking-tighter">2026 Plan Active</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative group">
              <span className="material-symbols-outlined text-on-surface opacity-70 group-hover:text-primary transition-opacity cursor-pointer">notifications</span>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-tertiary rounded-full shadow-[0_0_8px_rgba(255,182,146,0.5)]"></span>
            </div>
            <span className="material-symbols-outlined text-on-surface opacity-70 hover:text-primary transition-opacity cursor-pointer">bolt</span>
            <div className="flex items-center gap-4 pl-4 border-l border-outline-variant/20">
              <div className="text-right">
                <p className="text-xs font-black font-headline leading-tight uppercase tracking-tight">Alex R.</p>
                <p className="text-[10px] font-label opacity-40 uppercase tracking-tighter">Pro Elite Athlete</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/20 font-headline font-black text-primary shadow-[0_0_15px_rgba(0,218,243,0.1)]">AL</div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="pt-24 px-8 pb-12 max-w-7xl mx-auto">
          {activeView === 'calendar' && (
            <div className="animate-in fade-in zoom-in-95 duration-700">
              {/* Hero Section */}
              <section className="grid grid-cols-12 gap-8 mb-12">
                <div className="col-span-12 lg:col-span-8 bg-surface-container rounded-xl overflow-hidden relative group min-h-[450px] shadow-2xl border border-outline-variant/10">
                  <div className="absolute inset-0 z-0 opacity-40 group-hover:scale-105 transition-transform duration-[20s] linear">
                    <img 
                      alt="Workout Background" 
                      className="w-full h-full object-cover" 
                      src="https://images.unsplash.com/photo-1530549387074-d56a99e1bc81?q=80&w=2070&auto=format&fit=crop" 
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent z-10"></div>
                  <div className="relative z-20 p-12 h-full flex flex-col justify-end">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="px-4 py-1.5 bg-primary text-on-primary font-label text-[10px] font-black uppercase tracking-[0.2em] rounded-sm shadow-lg shadow-primary/20">Today's Protocol</span>
                      <span className="text-on-surface font-label text-[10px] uppercase tracking-[0.2em] opacity-60">High Intensity Threshold</span>
                    </div>
                    {todayWorkouts.length > 0 ? (
                      <>
                        <h2 className="text-7xl font-black font-headline tracking-tighter mb-6 leading-none uppercase">
                          {todayWorkouts[0].type}: <span className="text-primary">{todayWorkouts[0].km ? todayWorkouts[0].km + 'km' : todayWorkouts[0].title}</span>
                        </h2>
                        <div className="grid grid-cols-3 gap-10 mt-10 border-t border-outline-variant/20 pt-10">
                          <div>
                            <p className="font-label text-[10px] uppercase tracking-[0.3em] opacity-40 mb-2 font-black text-primary">Technical Specs</p>
                            <p className="text-sm font-bold font-body leading-relaxed opacity-90">{todayWorkouts[0].detail}</p>
                          </div>
                          <div>
                            <p className="font-label text-[10px] uppercase tracking-[0.3em] opacity-40 mb-2 font-black text-primary">Duration</p>
                            <p className="text-2xl font-black font-headline">{todayWorkouts[0].value} <span className="text-xs opacity-50 font-label">HOURS</span></p>
                          </div>
                          <div>
                            <p className="font-label text-[10px] uppercase tracking-[0.3em] opacity-40 mb-2 font-black text-primary">Performance</p>
                            <p className={`text-2xl font-black font-headline ${todayWorkouts[0].completed ? 'text-secondary' : 'text-primary'}`}>
                              {todayWorkouts[0].completed ? 'COMPLETED' : 'PENDING'}
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <h2 className="text-7xl font-black font-headline tracking-tighter mb-4 leading-none uppercase">
                        Rest & <br/><span className="text-primary">Recovery</span>
                      </h2>
                    )}
                  </div>
                </div>

                {/* Stats Sidebar */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
                   <div className="bg-surface-container-low p-10 rounded-xl border border-outline-variant/10 shadow-xl">
                    <p className="font-label text-[10px] uppercase tracking-[0.3em] opacity-40 mb-8 font-black text-primary">Monthly Volume</p>
                    <Stats trainingPlan={trainingPlan} currentMonth={currentMonth} mini />
                  </div>
                  
                  <div className="bg-surface-container-high p-10 rounded-xl flex-1 flex flex-col justify-between border border-outline-variant/10 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <span className="material-symbols-outlined text-8xl">timer</span>
                    </div>
                    <div>
                      <span className="material-symbols-outlined text-tertiary mb-6 text-4xl">timer</span>
                      <h3 className="font-headline font-black text-2xl leading-tight uppercase tracking-tighter">100KM Ultramarathon Preparation</h3>
                      <p className="font-body text-xs opacity-50 mt-3 font-medium tracking-wide">TARGET DEPLOYMENT: OCT 12, 2026</p>
                    </div>
                    <div className="mt-12">
                      <div className="flex justify-between items-baseline mb-3">
                        <span className="font-label text-[10px] uppercase tracking-[0.2em] font-black opacity-60">Mission Progress</span>
                        <span className="text-3xl font-black font-headline text-on-surface">62%</span>
                      </div>
                      <div className="h-2 w-full bg-surface-container-lowest rounded-full overflow-hidden shadow-inner">
                        <div className="h-full bg-gradient-to-r from-tertiary to-tertiary-container shadow-[0_0_10px_rgba(255,182,146,0.3)]" style={{ width: '62%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Calendar Section */}
              <section className="grid grid-cols-12 gap-8">
                <div className="col-span-12 xl:col-span-9">
                  <Calendar 
                    currentMonth={currentMonth} 
                    setCurrentMonth={setCurrentMonth}
                    trainingPlan={trainingPlan}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                  />
                </div>
                
                <div className="col-span-12 xl:col-span-3 space-y-8">
                  <div className="bg-surface-container p-10 rounded-xl relative overflow-hidden border border-outline-variant/10 shadow-xl">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
                    <div className="flex flex-col gap-6 relative z-10">
                      <span className="material-symbols-outlined text-primary text-4xl shadow-glow">smart_toy</span>
                      <div>
                        <h4 className="font-headline font-black text-xl leading-tight mb-3 uppercase tracking-tighter">AI Optimization</h4>
                        <p className="text-xs opacity-50 leading-relaxed mb-6 font-medium">Performance algorithms are dynamically adjusting your 2026 Season Plan based on fatigue markers.</p>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 text-[10px] font-label uppercase tracking-widest font-bold text-secondary">
                            <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(136,217,130,0.5)]"></span>
                            Plan Active
                          </div>
                          <div className="flex items-center gap-3 text-[10px] font-label uppercase tracking-widest font-bold text-secondary">
                            <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(136,217,130,0.5)]"></span>
                            Cloud Synced
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {selectedDate && (
                    <div className="animate-in slide-in-from-right-4 fade-in duration-500">
                       <TrainingDetails 
                        date={selectedDate}
                        workouts={trainingPlan[selectedDate] || []}
                        onClose={() => setSelectedDate(null)}
                        onToggleWorkout={toggleWorkout}
                      />
                    </div>
                  )}
                </div>
              </section>
            </div>
          )}

          {activeView === 'stats' && (
            <div className="animate-in fade-in duration-700">
                <Stats trainingPlan={trainingPlan} currentMonth={currentMonth} />
            </div>
          )}

          {activeView === 'entrenos' && (
            <div className="animate-in fade-in duration-700">
                <Workouts />
            </div>
          )}

          {activeView === 'settings' && (
            <div className="animate-in fade-in duration-700">
                <Settings />
            </div>
          )}
        </div>
      </main>

      {/* Float FAB */}
      <button className="fixed bottom-10 right-10 w-16 h-16 bg-primary text-on-primary rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center hover:scale-110 active:scale-90 transition-all z-50 group">
        <span className="material-symbols-outlined text-4xl group-hover:rotate-90 transition-transform duration-300">add</span>
      </button>
    </div>
  );
}

export default App;
