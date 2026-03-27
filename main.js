// Ironman "Survival" Training Plan Template
const templates = {
    gym: { type: "Gimnasio", title: "Fuerza + Prehab", detail: "3x12: Sentadilla Búlgara, Monster Walk, Clamshells, Peso Muerto, Plancha.", value: 1.5 }, // 1.5h
    swim: { type: "Natación", title: "Técnica y Fluidez", detail: "8x25m Punto Muerto + 6x50m. Foco en respiración.", value: 0.6, km: 0.8 }, // 0.6h, 0.8km
    bikeMid: { type: "Bici", title: "Intervalos Estática", detail: "10' cal + 5x(3' fuerte/2' suave) + 10' suave.", value: 0.8, km: 15 }, // 0.8h, 15km
    bikeLong: { type: "Bici", title: "Salida Larga", detail: "Ritmo conversación. Acostumbrarse al sillín.", value: 2, km: 45 }, // 2h, 45km
    runShort: { type: "Carrera", title: "Rodaje Muy Suave", detail: "4 km suaves. Recuperación activa.", value: 0.5, km: 4 }, // 0.5h, 4km
    runLong: { type: "Carrera", title: "Tirada Larga", detail: "Máximo 7 km. Ni un metro más.", value: 1, km: 7 } // 1h, 7km
};

// State Persistence (Local Storage)
let trainingPlan = JSON.parse(localStorage.getItem('ironPlan')) || {};
let currentDate = new Date();
let selectedDate = null;
let elements = {};

// Initialize plan if empty
if (Object.keys(trainingPlan).length === 0) {
    console.log('IronCalendar: Generating initial plan...');
    const startDate = new Date(2026, 0, 1);
    for (let d = new Date(startDate); d <= new Date(2027, 0, 1); d.setDate(d.getDate() + 1)) {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const dayNum = String(d.getDate()).padStart(2, '0');
        const dateStr = `${y}-${m}-${dayNum}`;
        const day = d.getDay();
        
        let dailyWorkouts = [];
        if (day === 1) dailyWorkouts = [{...templates.gym, id: Date.now() + Math.random()}];
        if (day === 2) dailyWorkouts = [{...templates.swim, id: Date.now() + Math.random()}];
        if (day === 3) dailyWorkouts = [{...templates.bikeMid, id: Date.now() + Math.random()}];
        if (day === 4) dailyWorkouts = [{...templates.gym, id: Date.now() + Math.random()}, {...templates.runShort, id: Date.now() + Math.random()}];
        if (day === 5) dailyWorkouts = [{...templates.swim, id: Date.now() + Math.random()}];
        if (day === 6) dailyWorkouts = [{...templates.bikeLong, id: Date.now() + Math.random()}];
        if (day === 0) dailyWorkouts = [{...templates.runLong, id: Date.now() + Math.random()}];
        
        if (dailyWorkouts.length > 0) {
            trainingPlan[dateStr] = dailyWorkouts.map(w => ({...w, completed: false}));
        }
    }
    savePlan();
}

function savePlan() {
    localStorage.setItem('ironPlan', JSON.stringify(trainingPlan));
    updateStats();
}

function initElements() {
    elements = {
        calendarGrid: document.getElementById('calendarGrid'),
        monthTitle: document.getElementById('monthTitle'),
        prevMonth: document.getElementById('prevMonth'),
        nextMonth: document.getElementById('nextMonth'),
        trainingDetails: document.getElementById('trainingDetails'),
        closeDetails: document.getElementById('closeDetails'),
        trainingContent: document.getElementById('trainingContent'),
        selectedDateText: document.getElementById('selectedDateText'),
        calendarSection: document.querySelector('.calendar-card'),
        statsView: document.getElementById('statsView'),
        settingsView: document.getElementById('settingsView'),
        navItems: document.querySelectorAll('.nav-item'),
        navCalendar: document.getElementById('navCalendar'),
        navStats: document.getElementById('navStats'),
        navSettings: document.getElementById('navSettings'),
        // Stats elements
        statSwim: document.getElementById('statSwim'),
        statBike: document.getElementById('statBike'),
        statRun: document.getElementById('statRun'),
        statTotalTime: document.getElementById('statTotalTime'),
        weekProgressBar: document.getElementById('weekProgressBar'),
        weekPercentText: document.getElementById('weekPercentText'),
        marathonProgressBar: document.getElementById('marathonProgressBar'),
        marathonPercentText: document.getElementById('marathonPercentText')
    };
}

function updateStats() {
    if (!elements.statSwim) return;

    let totals = { swim: 0, bike: 0, run: 0, time: 0, totalWorkouts: 0, completedWorkouts: 0 };
    
    // Calculate for current month or overall? Let's do current month for top cards
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    Object.keys(trainingPlan).forEach(dateStr => {
        const d = new Date(dateStr);
        if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
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

    elements.statSwim.innerText = `${totals.swim.toFixed(1)} km`;
    elements.statBike.innerText = `${totals.bike.toFixed(0)} km`;
    elements.statRun.innerText = `${totals.run.toFixed(1)} km`;
    
    const h = Math.floor(totals.time);
    const m = Math.round((totals.time - h) * 60);
    elements.statTotalTime.innerText = `${h}h ${String(m).padStart(2, '0')}m`;

    // Weekly progress (last 7 days)
    const weekPercent = totals.totalWorkouts > 0 ? Math.round((totals.completedWorkouts / totals.totalWorkouts) * 100) : 0;
    elements.weekPercentText.innerText = `${weekPercent}%`;
    elements.weekProgressBar.style.width = `${weekPercent}%`;

    // Marathon goal (fictional target: 100km total running)
    const marathonTarget = 100;
    const marathonPercent = Math.min(100, Math.round((totals.run / marathonTarget) * 100));
    elements.marathonPercentText.innerText = `${marathonPercent}%`;
    elements.marathonProgressBar.style.width = `${marathonPercent}%`;
}

function renderCalendar() {
    if (!elements.calendarGrid) return;
    elements.calendarGrid.innerHTML = '';
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    if (elements.monthTitle) elements.monthTitle.innerText = `${months[month]} ${year}`;
    
    let firstDay = new Date(year, month, 1).getDay();
    firstDay = (firstDay === 0) ? 6 : firstDay - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    for (let i = 0; i < firstDay; i++) {
        const d = document.createElement('div');
        d.className = 'day empty';
        elements.calendarGrid.appendChild(d);
    }
    
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    for (let i = 1; i <= daysInMonth; i++) {
        const d = document.createElement('div');
        d.className = 'day';
        d.innerText = i;
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        
        if (dateStr === todayStr) d.classList.add('today');
        
        const dayWorkouts = trainingPlan[dateStr];
        if (dayWorkouts && dayWorkouts.length > 0) {
            d.classList.add('has-training');
            if (dayWorkouts.every(w => w.completed)) d.classList.add('all-completed'); // Visual hint
        }
        
        if (selectedDate === dateStr) d.classList.add('selected');
        d.onclick = () => selectDate(dateStr, i, months[month]);
        elements.calendarGrid.appendChild(d);
    }
}

function selectDate(dateStr, dayNum, monthName) {
    selectedDate = dateStr;
    renderCalendar();
    if (elements.selectedDateText) elements.selectedDateText.innerText = `${dayNum} de ${monthName}`;
    if (elements.trainingDetails) elements.trainingDetails.classList.remove('hidden');
    
    const workouts = trainingPlan[dateStr] || [];
    renderWorkouts(workouts, dateStr);
}

function renderWorkouts(workouts, dateStr) {
    if (!elements.trainingContent) return;
    
    if (workouts.length > 0) {
        elements.trainingContent.innerHTML = '';
        workouts.forEach((w, index) => {
            const item = document.createElement('div');
            item.className = `training-item ${w.completed ? 'completed' : ''}`;
            item.innerHTML = `
                <div class="training-info">
                    <span class="training-type">${w.type}</span>
                    <div class="training-title">${w.title}</div>
                    <div class="training-meta">${w.detail}</div>
                </div>
                <button class="btn-complete ${w.completed ? 'active' : ''}">
                    ${w.completed ? '✓ Hecho' : 'Completar'}
                </button>
            `;
            
            const btn = item.querySelector('.btn-complete');
            btn.onclick = (e) => {
                e.stopPropagation();
                w.completed = !w.completed;
                savePlan();
                renderWorkouts(workouts, dateStr);
                renderCalendar();
            };
            
            elements.trainingContent.appendChild(item);
        });
    } else {
        elements.trainingContent.innerHTML = '<div class="empty-state">No hay entrenamiento programado.</div>';
    }
}

function switchView(viewId) {
    [elements.calendarSection, elements.statsView, elements.settingsView, elements.trainingDetails].forEach(el => {
        if (el) el.classList.add('hidden');
    });
    elements.navItems.forEach(item => item.classList.remove('active'));
    
    if (viewId === 'calendar') {
        elements.calendarSection.classList.remove('hidden');
        elements.navCalendar.classList.add('active');
    } else if (viewId === 'stats') {
        updateStats();
        elements.statsView.classList.remove('hidden');
        elements.navStats.classList.add('active');
    } else if (viewId === 'settings') {
        elements.settingsView.classList.remove('hidden');
        elements.navSettings.classList.add('active');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initElements();
    if (elements.prevMonth) elements.prevMonth.onclick = () => { currentDate.setMonth(currentDate.getMonth() - 1); renderCalendar(); };
    if (elements.nextMonth) elements.nextMonth.onclick = () => { currentDate.setMonth(currentDate.getMonth() + 1); renderCalendar(); };
    if (elements.navCalendar) elements.navCalendar.onclick = () => switchView('calendar');
    if (elements.navStats) elements.navStats.onclick = () => switchView('stats');
    if (elements.navSettings) elements.navSettings.onclick = () => switchView('settings');
    if (elements.closeDetails) elements.closeDetails.onclick = () => elements.trainingDetails.classList.add('hidden');
    renderCalendar();
    updateStats();
});

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
}
