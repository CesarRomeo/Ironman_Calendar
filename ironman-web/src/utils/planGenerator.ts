import type { TrainingPlan, Workout } from '../types.ts';

export const templates = {
    gym: { type: "Gimnasio", title: "Fuerza + Prehab", detail: "3x12: Sentadilla Búlgara, Monster Walk, Clamshells, Peso Muerto, Plancha.", value: 1.5 },
    swim: { type: "Natación", title: "Técnica y Fluidez", detail: "8x25m Punto Muerto + 6x50m. Foco en respiración.", value: 0.6, km: 0.8 },
    bikeMid: { type: "Bici", title: "Intervalos Estática", detail: "10' cal + 5x(3' fuerte/2' suave) + 10' suave.", value: 0.8, km: 15 },
    bikeLong: { type: "Bici", title: "Salida Larga", detail: "Ritmo conversación. Acostumbrarse al sillín.", value: 2, km: 45 },
    runShort: { type: "Carrera", title: "Rodaje Muy Suave", detail: "4 km suaves. Recuperación activa.", value: 0.5, km: 4 },
    runLong: { type: "Carrera", title: "Tirada Larga", detail: "Máximo 7 km. Ni un metro más.", value: 1, km: 7 }
};

export function generatePlan(): TrainingPlan {
    const plan: TrainingPlan = {};
    const startDate = new Date(2026, 0, 1);
    const endDate = new Date(2027, 0, 1);
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        const day = d.getDay();
        
        let dailyWorkouts: any[] = [];
        if (day === 1) dailyWorkouts = [templates.gym];
        if (day === 2) dailyWorkouts = [templates.swim];
        if (day === 3) dailyWorkouts = [templates.bikeMid];
        if (day === 4) dailyWorkouts = [templates.gym, templates.runShort];
        if (day === 5) dailyWorkouts = [templates.swim];
        if (day === 6) dailyWorkouts = [templates.bikeLong];
        if (day === 0) dailyWorkouts = [templates.runLong];
        
        if (dailyWorkouts.length > 0) {
            plan[dateStr] = dailyWorkouts.map(w => ({
                ...w, 
                id: Math.random().toString(36).substr(2, 9),
                completed: false
            }));
        }
    }
    return plan;
}
