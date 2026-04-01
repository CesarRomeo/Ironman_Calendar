export interface Workout {
    id: string;
    type: string;
    title: string;
    detail: string;
    value: number;
    km?: number;
    completed: boolean;
}

export interface TrainingPlan {
    [date: string]: Workout[];
}

export type View = 'calendar' | 'stats' | 'settings' | 'entrenos';

export interface UserSettings {
    darkMode: boolean;
    notifications: boolean;
    units: 'metric' | 'imperial';
}
