// DOM Elements
const loginScreen = document.getElementById('login-screen');
const mainApp = document.getElementById('main-app');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginError = document.getElementById('login-error');
const authTitle = document.getElementById('auth-title');

// Auth Toggle Logic
function toggleAuth(mode) {
    if (mode === 'signup') {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
        authTitle.innerText = "Request Warden Access";
        loginError.innerText = "";
    } else {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
        authTitle.innerText = "Secure Surveillance Login";
        loginError.innerText = "";
    }
}
window.toggleAuth = toggleAuth;

const tabs = document.querySelectorAll('.sidebar li');
const pages = document.querySelectorAll('.page');
const notifBtn = document.getElementById('notif-btn');
const notifPanel = document.getElementById('notification-panel');
const simAlertBtn = document.getElementById('sim-alert-btn');
const mainStatus = document.getElementById('main-status');
const statusIcon = mainStatus.querySelector('.status-icon i');
const statusText = mainStatus.querySelector('.status-text');
const alertModal = document.getElementById('alert-modal');
const alarmSound = document.getElementById('alarm-sound');
const alertCountEl = document.getElementById('alert-count');
const notifList = document.getElementById('notif-list');

// State
let alertCount = 0;
let isAlertActive = false;
let mapVar = null;
let bearMarker = null;

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    // DEMO MODE: Auto-login disabled so judges always see the Login Screen first.
    // Uncomment the lines below to enable persistent login session.
    /*
    if (sessionStorage.getItem('isLoggedIn') === 'true') {
        showApp();
    }
    */
});

// Signup Logic
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newName = document.getElementById('new-username').value;
    const newEmail = document.getElementById('new-email').value;
    const newPass = document.getElementById('new-password').value;

    // Save to LocalStorage (Simulated Backend)
    const users = JSON.parse(localStorage.getItem('bg_users') || '[]');

    // Check if exists
    if (users.find(u => u.email === newEmail)) {
        alert("User already exists!");
        return;
    }

    users.push({ name: newName, email: newEmail, pass: newPass });
    localStorage.setItem('bg_users', JSON.stringify(users));

    // Feedback and Switch to Login
    alert(`Registration Successful! Please login as ${newName}.`);
    toggleAuth('login');

    // Pre-fill login
    usernameInput.value = newEmail;
    passwordInput.focus();
});

// Login Logic
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const userOrEmail = usernameInput.value;
    const pass = passwordInput.value;

    // Check Hardcoded Admins
    if ((userOrEmail === 'admin' && pass === 'admin123') || (userOrEmail === 'chief' && pass === 'bear')) {
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('currentUser', 'Admin'); // Default for hardcoded
        showApp();
        return;
    }

    // Check Registered Users
    const users = JSON.parse(localStorage.getItem('bg_users') || '[]');
    const validUser = users.find(u => (u.email === userOrEmail || u.name === userOrEmail) && u.pass === pass);

    if (validUser) {
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('currentUser', validUser.name);
        showApp();
        // Welcome notification
        setTimeout(() => {
            addNotification('System', `Welcome back, ${validUser.name}.`, 'info');
        }, 1000);
    } else {
        showLoginError('Invalid Email/Username or Password');
    }
});

function showLoginError(msg) {
    loginError.textContent = msg;
    loginError.classList.add('visible');
    setTimeout(() => loginError.classList.remove('visible'), 3000);
}

function showApp() {
    loginScreen.style.opacity = '0';
    setTimeout(() => {
        loginScreen.style.display = 'none';
        mainApp.style.display = 'flex';
        // Initialize App Components
        updateTime();
        initMap();
        updateTime();
        initMap();
        initAdvancedCharts();
        checkDayNightCycle();
        // Simulate some notifications
        addNotification('System', 'Night Guardian Protocol Initialized.', 'info');
        addNotification('Sector 2', 'Biodiversity Corridor: Clear.', 'info');
    }, 500);
}

// Update Time
function updateTime() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-date').innerText = now.toLocaleDateString('en-US', options);
}

// Tab Switching
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class
        tabs.forEach(t => t.classList.remove('active'));
        pages.forEach(p => p.classList.remove('active'));

        // Add active class
        tab.classList.add('active');
        const target = tab.getAttribute('data-tab');
        document.getElementById(target).classList.add('active');

        // Resize map if map tab is opened (Leaflet glitch fix)
        if (target === 'map' && mapVar) {
            setTimeout(() => { mapVar.invalidateSize(); }, 200);
        }
    });
});

// Notifications Panel
notifBtn.addEventListener('click', () => {
    notifPanel.classList.toggle('show');
});

// Simulate Alert Logic
simAlertBtn.addEventListener('click', triggerAlert);

function triggerAlert() {
    if (isAlertActive) return;
    isAlertActive = true;

    // AI False Alarm Simulation (30% chance)
    const isFalseAlarm = Math.random() < 0.3;

    if (isFalseAlarm) {
        // Show scanning effect then dismiss
        addNotification('System', 'Motion detected. Analyzing pattern...', 'info');

        // Temporarily show yellow status
        const originalText = statusText.innerText;
        statusText.innerText = "ANALYZING...";
        statusIcon.className = "fa-solid fa-circle-notch fa-spin";

        setTimeout(() => {
            statusText.innerText = originalText;
            statusIcon.className = "fa-solid fa-shield-heart";
            addNotification('AI Model', 'False Alarm: Local resident identified. No thread.', 'success');
            alert("AI Analysis: Human Detected. Alert suppressed.");
            isAlertActive = false;
        }, 1500);
        return;
    }

    // Real Alert Logic
    // Visuals on Main Status
    mainStatus.classList.remove('safe');
    mainStatus.classList.add('danger');
    statusIcon.classList.remove('fa-shield-heart');
    statusIcon.classList.add('fa-triangle-exclamation');
    statusText.innerText = "WILDLIFE NEARBY";

    // Counter
    alertCount++;
    alertCountEl.innerText = alertCount;

    // Sound & Voice
    alarmSound.currentTime = 0;
    alarmSound.play().catch(e => console.log("Audio play failed:", e));
    speakAlert("Critical Alert. Bear detected in Sector 4. Please secure the area immediately.");

    // Notification
    addNotification('SENSORS', 'Motion detected in Sector 4. Initiating safety protocol.', 'alert');

    // Map Marker (if map initialized)
    if (mapVar) {
        if (bearMarker) mapVar.removeLayer(bearMarker);
        bearMarker = L.marker([11.3530, 76.7959]).addTo(mapVar)
            .bindPopup("<b>Wildlife Spotted</b><br>Deterrence Ready")
            .openPopup();

        // Flash the circle
        L.circle([11.3530, 76.7959], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: 100
        }).addTo(mapVar);

        mapVar.setView([11.3530, 76.7959], 16);
    }

    // Reset Deterrence Panel
    resetDeterrencePanel();

    // Show Modal
    alertModal.showModal();
}

function closeAlert() {
    alertModal.close();
    alarmSound.pause();

    // Reset Status visually after a delay, or keep it red until "Resolved"
    // For demo, we stick to red or switch back
    // Let's not reset immediately to keep the tension of the "Live" system
    // But user might want to see 'Safe' again
    // For demo simplicity:
    // restoreSafeState(); 
}

function resetDeterrencePanel() {
    document.querySelectorAll('.ctrl-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('action-status').innerText = "waiting for manual input...";
    document.getElementById('action-status').style.color = "#94a3b8";
}

function activateDeterrence(btn, type) {
    // Visual Feedback
    btn.classList.toggle('active');
    const isActive = btn.classList.contains('active');
    const statusEl = document.getElementById('action-status');

    let msg = "";
    if (isActive) {
        switch (type) {
            case 'sonic':
                msg = ">> EMITTING BIO-SAFE SIGNAL. GUIDING AWAY...";
                break;
            case 'strobe':
                msg = ">> VISUAL WARNING: ENGAGED";
                break;
            case 'drone':
                msg = ">> DISPATCHING SCOUT DRONE...";
                // Fancy delayed effect
                setTimeout(() => {
                    statusEl.innerText = ">> DRONE: MONITORING PATH BACK TO FOREST";
                    statusEl.style.color = "#3b82f6";
                }, 1500);
                break;
        }
        statusEl.innerText = msg;
        statusEl.style.color = "#10b981"; // Success Green
    } else {
        statusEl.innerText = ">> SYSTEM DISENGAGED";
        statusEl.style.color = "#ef4444";
    }
}

function notifyAuthorities() {
    alert("Authorities notified via SMS and Radio Dispatch!");
    closeAlert();
    alert("Authorities notified via SMS and Radio Dispatch!");
    addNotification('System', 'Rangers dispatcher acknowledged info packet #442.', 'info');
    closeAlert();
}

function speakAlert(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.1;
        utterance.pitch = 0.9;
        utterance.volume = 1.0;
        window.speechSynthesis.speak(utterance);
    }
}

function exportReport() {
    // Simulate PDF generation
    const originalText = document.querySelector('.btn-outline').innerHTML;
    document.querySelector('.btn-outline').innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating...';

    setTimeout(() => {
        alert("Weekly Report (PDF) downloaded successfully!");
        document.querySelector('.btn-outline').innerHTML = originalText;
        addNotification('System', 'Weekly Analytics Report exported by Admin.', 'info');
    }, 1500);
}

function checkDayNightCycle() {
    const hour = new Date().getHours();
    const isNight = hour >= 18 || hour < 6;
    const slogan = document.querySelector('.brand small');
    const statusText = document.querySelector('#ng-status span');

    if (isNight) {
        document.body.classList.add('night-mode'); // Already default
        if (slogan) slogan.innerText = "NIGHT WATCH";
        if (statusText) statusText.innerText = "Night Guardian Active";
    } else {
        // Optional: Light mode logic could go here if implemented
        if (slogan) slogan.innerText = "DAY PATROL";
        if (statusText) statusText.innerText = "Day Monitoring Active";
    }
}

// Global scope for HTML onclick
window.closeAlert = closeAlert;
window.notifyAuthorities = notifyAuthorities;
window.activateDeterrence = activateDeterrence;

function logout() {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('currentUser');
    location.reload(); // Reload to show login screen
}
window.logout = logout;

function restoreSafeState() {
    isAlertActive = false;
    mainStatus.classList.remove('danger');
    mainStatus.classList.add('safe');
    statusIcon.classList.remove('fa-triangle-exclamation');
    statusIcon.classList.add('fa-shield-heart');
    statusText.innerText = "HARMONY ACTIVE";
}

function addNotification(source, message, type) {
    const li = document.createElement('li');
    li.className = `notif-item ${type}`;

    let icon = 'fa-circle-info';
    if (type === 'alert') icon = 'fa-triangle-exclamation';

    li.innerHTML = `
        <i class="fa-solid ${icon}"></i>
        <div>
            <span>${message}</span>
            <small>${source} • Just now</small>
        </div>
    `;

    notifList.prepend(li);

    // Update Badge
    const badge = document.querySelector('.badge');
    badge.innerText = parseInt(badge.innerText) + 1;
}

// Map Initialization
function initMap() {
    // Coonoor Coordinates
    const coonoorLat = 11.3530;
    const coonoorLng = 76.7959;

    mapVar = L.map('leaflet-map').setView([coonoorLat, coonoorLng], 15);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(mapVar);

    // Add some dummy "Safe" markers around
    const safeZones = [
        [11.3550, 76.7980],
        [11.3510, 76.7930],
        [11.3560, 76.7940]
    ];

    safeZones.forEach(coord => {
        L.circleMarker(coord, {
            color: '#10b981',
            radius: 8
        }).addTo(mapVar).bindPopup("Sector Safe");
    });
}

// Chart Initialization
// Chart Initialization
function initAdvancedCharts() {
    // 1. Activity Trend (Line Chart)
    const ctxActivity = document.getElementById('activityChart').getContext('2d');
    const gradActivity = ctxActivity.createLinearGradient(0, 0, 0, 400);
    gradActivity.addColorStop(0, 'rgba(59, 130, 246, 0.5)');
    gradActivity.addColorStop(1, 'rgba(59, 130, 246, 0)');

    new Chart(ctxActivity, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Bear Detect Events',
                data: [1, 0, 2, 4, 1, 3, 5],
                borderColor: '#3b82f6',
                backgroundColor: gradActivity,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { display: false, color: '#334155' }, ticks: { color: '#94a3b8' } },
                y: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' }, beginAtZero: true }
            }
        }
    });

    // 2. Time-Based Analysis (Bar Chart)
    const ctxTime = document.getElementById('timeChart').getContext('2d');
    new Chart(ctxTime, {
        type: 'bar',
        data: {
            labels: ['18:00', '20:00', '22:00', '00:00', '02:00', '04:00', '06:00'],
            datasets: [{
                label: 'Risk Level',
                data: [10, 25, 40, 65, 85, 30, 15],
                backgroundColor: [
                    '#10b981', '#10b981', '#f59e0b', '#f59e0b', '#ef4444', '#f59e0b', '#10b981'
                ],
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
                y: { display: false }
            }
        }
    });
}
window.exportReport = exportReport;

// Profile Modal Logic
const profileModal = document.getElementById('profile-modal');

function showProfileModal() {
    if (profileModal) profileModal.showModal();
}

function closeProfileModal() {
    if (profileModal) profileModal.close();
}

// Global scope for HTML onclick
window.showProfileModal = showProfileModal;
window.closeProfileModal = closeProfileModal;