import type { TrainingPlan } from '../types.ts';

export function generatePlan(): TrainingPlan {
    const plan: TrainingPlan = {};
    const startDate = new Date('2026-04-13');
    const endDate = new Date('2026-07-17'); // Final de las clases según la imagen

    const subjects = [
        { day: 1, title: 'MA2 V: Mathematik 2', time: '12:00 - 14:00', type: 'Uni' },
        { day: 2, title: 'ALD V: Algorithmen', time: '12:00 - 15:00', type: 'Uni' },
        { day: 2, title: 'BSY V: Betriebssysteme', time: '15:00 - 17:00', type: 'Uni' },
        { day: 3, title: 'MA2 Ü: Mathematik 2', time: '08:00 - 10:00', type: 'Uni' },
        { day: 3, title: 'MA2 V: Mathematik 2', time: '12:00 - 14:00', type: 'Uni' },
        { day: 3, title: 'PE2 V: Programmentwicklung 2', time: '14:00 - 17:00', type: 'Uni' },
        { day: 4, title: 'PE2 Ü: Programmentwicklung 2', time: '08:00 - 10:00', type: 'Uni' },
        { day: 4, title: 'BSY Ü: Betriebssysteme', time: '10:15 - 11:45', type: 'Uni' },
        { day: 4, title: 'DR2 P/Ü: Digitaltechnik', time: '14:00 - 15:30', type: 'Uni' },
        { day: 4, title: 'ALD Ü: Algorithmen', time: '16:00 - 18:00', type: 'Uni' },
        { day: 5, title: 'DR2 V: Digitaltechnik', time: '08:15 - 10:30', type: 'Uni' }
    ];

    let current = new Date(startDate);
    while (current <= endDate) {
        const dayOfWeek = current.getDay(); // 0(Sun) - 6(Sat)
        // Convert to 1(Mon) - 7(Sun) for easier matching with our list
        const adjustedDay = dayOfWeek === 0 ? 7 : dayOfWeek;

        const daySubjects = subjects.filter(s => s.day === adjustedDay);
        
        if (daySubjects.length > 0) {
            const dateStr = current.toISOString().split('T')[0];
            plan[dateStr] = daySubjects.map((s, idx) => ({
                id: `uni-${dateStr}-${idx}`,
                type: s.type,
                title: s.title,
                detail: `Horario: ${s.time}`,
                value: 2, // Default value for stats
                completed: false
            }));
        }

        current.setDate(current.getDate() + 1);
    }

    return plan;
}
