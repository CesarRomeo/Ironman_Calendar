import React from 'react';
import { getStravaAuthUrl } from '../services/strava.ts';

const Settings: React.FC = () => {
  const handleConnectStrava = () => {
    window.location.href = getStravaAuthUrl();
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="user-profile flex items-center gap-8 p-10 bg-surface-container rounded-xl border border-outline-variant/10 shadow-xl">
        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/20 font-headline font-black text-3xl text-primary shadow-[0_0_20px_rgba(0,218,243,0.1)]">AL</div>
        <div className="user-info">
          <h3 className="font-headline font-black text-3xl tracking-tighter uppercase">Alex R.</h3>
          <p className="font-label text-xs opacity-50 uppercase tracking-[0.2em] mt-1 text-primary">Pro Elite Performance Plan</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="settings-group">
          <div className="font-label text-[10px] uppercase text-primary font-black tracking-[0.3em] mb-6 ml-4">System Configuration</div>
          <div className="bg-surface-container rounded-xl border border-outline-variant/10 overflow-hidden shadow-lg">
            <div className="flex justify-between items-center p-8 border-b border-outline-variant/10 hover:bg-surface-container-high transition-colors group">
              <div>
                <span className="font-headline font-bold text-sm block">Push Notifications</span>
                <p className="text-[10px] font-body opacity-40 uppercase mt-1">Real-time alerts & reminders</p>
              </div>
              <div className="relative inline-block w-12 h-6">
                <input type="checkbox" defaultChecked className="peer opacity-0 w-0 h-0" />
                <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-surface-container-highest transition-all duration-300 rounded-full peer-checked:bg-primary before:absolute before:h-4 before:w-4 before:left-1 before:bottom-1 before:bg-on-surface before:transition-all before:duration-300 before:rounded-full peer-checked:before:translate-x-6"></span>
              </div>
            </div>
            <div className="flex justify-between items-center p-8 border-b border-outline-variant/10 hover:bg-surface-container-high transition-colors">
              <div>
                <span className="font-headline font-bold text-sm block">Dark Mode</span>
                <p className="text-[10px] font-body opacity-40 uppercase mt-1">High contrast performance UI</p>
              </div>
              <div className="relative inline-block w-12 h-6">
                <input type="checkbox" defaultChecked className="peer opacity-0 w-0 h-0" />
                <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-surface-container-highest transition-all duration-300 rounded-full peer-checked:bg-primary before:absolute before:h-4 before:w-4 before:left-1 before:bottom-1 before:bg-on-surface before:transition-all before:duration-300 before:rounded-full peer-checked:before:translate-x-6"></span>
              </div>
            </div>
            <div className="flex justify-between items-center p-8 hover:bg-surface-container-high transition-colors">
              <div>
                <span className="font-headline font-bold text-sm block">Measurement Units</span>
                <p className="text-[10px] font-body opacity-40 uppercase mt-1">Global metric standards</p>
              </div>
              <span className="font-label text-[10px] uppercase font-black text-primary bg-primary/10 px-3 py-1 rounded">Metric (KM)</span>
            </div>
          </div>
        </div>

        <div className="settings-group">
          <div className="font-label text-[10px] uppercase text-primary font-black tracking-[0.3em] mb-6 ml-4">Training Integration</div>
          <div className="bg-surface-container rounded-xl border border-outline-variant/10 overflow-hidden shadow-lg">
            <div className="flex justify-between items-center p-8 border-b border-outline-variant/10 hover:bg-surface-container-high transition-colors">
              <div>
                <span className="font-headline font-bold text-sm block">Difficulty Scaling</span>
                <p className="text-[10px] font-body opacity-40 uppercase mt-1">Adaptive algorithm intensity</p>
              </div>
              <span className="font-label text-[10px] uppercase font-black text-secondary bg-secondary/10 px-3 py-1 rounded">Pro Elite</span>
            </div>
            <div className="flex justify-between items-center p-8 hover:bg-surface-container-high transition-colors">
              <div>
                <span className="font-headline font-bold text-sm block">Strava Connection</span>
                <p className="text-[10px] font-body opacity-40 uppercase mt-1">Cloud performance data</p>
              </div>
              <button 
                onClick={handleConnectStrava}
                className="font-label text-[10px] uppercase font-black text-primary hover:bg-primary hover:text-on-primary border border-primary/30 px-4 py-2 rounded-full transition-all"
              >
                Connect Strava
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-12 border-t border-outline-variant/20 flex justify-end">
        <button className="px-10 py-5 bg-error-container/10 text-error border border-error/30 rounded-full font-label text-[10px] font-black uppercase tracking-[0.2em] hover:bg-error hover:text-on-error transition-all shadow-lg hover:shadow-error/20">
          Terminate Session
        </button>
      </div>
    </div>
  );
};

export default Settings;
