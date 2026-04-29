const app = {
    map: null,
    userMarker: null,
    responders: [],
    sosActive: false,

    init() {
        // Mock get location text updates
        setTimeout(() => {
            document.getElementById('location-text').innerText = "San Francisco, CA (Accuracy: 12m)";
        }, 1500);
    },

    login() {
        const phone = document.getElementById('phone-input').value;
        const otp = document.getElementById('otp-input').value;

        if(phone.length > 5 && otp.length > 2) {
            document.getElementById('auth-screen').classList.remove('active');
            document.getElementById('dashboard-screen').classList.add('active');
            this.initMap();
        } else {
            alert("Please enter a valid phone number and OTP to verify.");
        }
    },

    initMap() {
        if(this.map) return;
        
        // Default to SF coordinates for mock
        const lat = 37.7749;
        const lng = -122.4194;

        this.map = L.map('map', {
            zoomControl: false // hide default zoom
        }).setView([lat, lng], 14);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '© OpenStreetMap © CARTO',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(this.map);

        // Custom marker icon with pulse
        const userIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `
                <div style='position:relative; width:24px; height:24px;'>
                    <div style='position:absolute; width:100%; height:100%; background-color:rgba(59, 130, 246, 0.4); border-radius:50%; animation: pulse-dot 2s infinite;'></div>
                    <div style='position:absolute; top:4px; left:4px; width:16px; height:16px; background-color:#3B82F6; border-radius:50%; border:2px solid white; box-shadow:0 0 10px rgba(0,0,0,0.5);'></div>
                </div>
            `,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        });

        this.userMarker = L.marker([lat, lng], {icon: userIcon}).addTo(this.map);
    },

    switchView(viewId, navElement) {
        // Hide all views
        document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
        
        // Show selected view
        document.getElementById(`view-${viewId}`).classList.remove('hidden');

        // Update nav active state
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        navElement.classList.add('active');

        // Resize map if switching to SOS view
        if(viewId === 'sos' && this.map) {
            setTimeout(() => this.map.invalidateSize(), 100);
        }
    },

    triggerSOS() {
        if(this.sosActive) return;
        this.sosActive = true;
        
        const btn = document.getElementById('sos-btn');
        btn.innerHTML = '<span class="sos-text">...</span>';
        
        document.querySelector('.sos-rings').classList.add('active');

        // Simulate network request
        setTimeout(() => {
            btn.innerHTML = '<span class="sos-text">SENT</span><span class="sos-subtext">Help is arriving</span>';
            btn.style.background = 'linear-gradient(145deg, #10B981, #059669)';
            btn.style.boxShadow = '0 15px 35px rgba(16, 185, 129, 0.4), inset 0 5px 15px rgba(255, 255, 255, 0.3)';
            
            // Show alert panel
            document.getElementById('active-alert-panel').classList.remove('hidden');
            setTimeout(() => {
                document.getElementById('active-alert-panel').classList.add('show');
            }, 50);

            this.mockRespondersOnMap();

        }, 1200);
    },

    cancelSOS() {
        this.sosActive = false;
        const btn = document.getElementById('sos-btn');
        btn.innerHTML = '<span class="sos-text">SOS</span><span class="sos-subtext">Tap in Emergency</span>';
        btn.style.background = 'linear-gradient(145deg, #ef4444, #b91c1c)';
        btn.style.boxShadow = '0 15px 35px rgba(239, 68, 68, 0.4), inset 0 5px 15px rgba(255, 255, 255, 0.3)';
        
        document.querySelector('.sos-rings').classList.remove('active');
        
        const panel = document.getElementById('active-alert-panel');
        panel.classList.remove('show');
        setTimeout(() => {
            panel.classList.add('hidden');
        }, 400);

        // Remove mock responders
        this.responders.forEach(m => this.map.removeLayer(m));
        this.responders = [];
    },

    mockRespondersOnMap() {
        const lat = 37.7749;
        const lng = -122.4194;

        const ambIcon = L.divIcon({
            className: 'custom-div-icon',
            html: "<div style='background-color:#EF4444;width:28px;height:28px;border-radius:50%;display:flex;justify-content:center;align-items:center;color:white;font-size:14px;border:2px solid white;box-shadow:0 4px 10px rgba(239,68,68,0.5);'><i class='fa-solid fa-truck-medical'></i></div>",
            iconSize: [28, 28],
            iconAnchor: [14, 14]
        });

        const volIcon = L.divIcon({
            className: 'custom-div-icon',
            html: "<div style='background-color:#3B82F6;width:28px;height:28px;border-radius:50%;display:flex;justify-content:center;align-items:center;color:white;font-size:14px;border:2px solid white;box-shadow:0 4px 10px rgba(59,130,246,0.5);'><i class='fa-solid fa-user-nurse'></i></div>",
            iconSize: [28, 28],
            iconAnchor: [14, 14]
        });

        const amb = L.marker([lat + 0.006, lng + 0.005], {icon: ambIcon}).addTo(this.map);
        const vol = L.marker([lat - 0.003, lng + 0.003], {icon: volIcon}).addTo(this.map);

        this.responders.push(amb, vol);

        // Fit bounds
        const group = new L.featureGroup([this.userMarker, amb, vol]);
        this.map.fitBounds(group.getBounds(), {padding: [50, 50]});
    },

    firstAidData: {
        cpr: {
            title: "CPR Guide",
            icon: "fa-heart-pulse",
            color: "var(--danger)",
            bg: "rgba(239, 68, 68, 0.15)",
            steps: [
                "Check the scene for safety, then check the person for responsiveness.",
                "Call emergency services immediately if there is no response.",
                "Place the heel of one hand on the center of the chest. Place the other hand on top and interlock fingers.",
                "Push hard and fast. Compress the chest at least 2 inches at a rate of 100-120 pushes a minute.",
                "Continue compressions until medical help arrives or the person starts breathing."
            ]
        },
        bleeding: {
            title: "Severe Bleeding",
            icon: "fa-droplet",
            color: "var(--warning)",
            bg: "rgba(245, 158, 11, 0.15)",
            steps: [
                "Remove any clothing or debris on the wound. Don't remove large or deeply embedded objects.",
                "Apply firm, direct pressure on the bleeding wound with a clean cloth, tissue, or piece of clothing.",
                "Maintain pressure for at least 10 minutes without lifting to check the wound.",
                "If blood soaks through, add another cloth on top. Do not remove the first one.",
                "Elevate the injured area above the heart if possible."
            ]
        },
        choking: {
            title: "Choking (Heimlich)",
            icon: "fa-lungs",
            color: "var(--info)",
            bg: "rgba(14, 165, 233, 0.15)",
            steps: [
                "Stand behind the person and wrap your arms around their waist.",
                "Make a fist with one hand and place it just above the person's navel.",
                "Grab your fist with your other hand.",
                "Make quick, upward thrusts as if trying to lift the person up.",
                "Repeat until the blockage is dislodged."
            ]
        },
        burns: {
            title: "Burns",
            icon: "fa-fire",
            color: "var(--orange)",
            bg: "rgba(249, 115, 22, 0.15)",
            steps: [
                "Cool the burn immediately by holding it under cool (not cold) running water for 10-15 minutes.",
                "Remove rings or other tight items from the burned area quickly and gently.",
                "Do not break blisters. If they break, clean gently with mild soap and water.",
                "Apply a thin layer of aloe vera lotion or burn ointment once the skin is cooled.",
                "Bandage the burn loosely with a sterile gauze pad."
            ]
        },
        fracture: {
            title: "Fractures",
            icon: "fa-bone",
            color: "var(--purple)",
            bg: "rgba(139, 92, 246, 0.15)",
            steps: [
                "Stop any bleeding by applying pressure to the wound with a sterile bandage.",
                "Immobilize the injured area. Don't try to realign the bone or push a bone that's sticking out back in.",
                "Apply ice packs to limit swelling and help relieve pain. Don't apply ice directly to the skin.",
                "Treat for shock. If the person feels faint, lay them down with the head slightly lower than the trunk."
            ]
        },
        poison: {
            title: "Poisoning",
            icon: "fa-skull-crossbones",
            color: "var(--green)",
            bg: "rgba(132, 204, 22, 0.15)",
            steps: [
                "Call Poison Control or Emergency Services immediately.",
                "Remove any remaining poison from the mouth or skin.",
                "If the suspected poison is a household cleaner or chemical, read the container's label and follow instructions.",
                "Do NOT induce vomiting unless instructed to do so by a professional.",
                "Gather the pill bottle, package, or container to give to the emergency team."
            ]
        }
    },

    showAidGuide(type) {
        const data = this.firstAidData[type];
        document.getElementById('guide-title').innerText = data.title;
        
        const headerIcon = document.getElementById('modal-header-icon');
        headerIcon.innerHTML = `<i class="fa-solid ${data.icon}"></i>`;
        headerIcon.style.color = data.color;
        headerIcon.style.backgroundColor = data.bg;
        
        let stepsHtml = '';
        data.steps.forEach((step, index) => {
            stepsHtml += `
                <div class="guide-step">
                    <div class="step-num" style="background-color: ${data.color}">${index + 1}</div>
                    <div class="step-text">${step}</div>
                </div>
            `;
        });
        
        document.getElementById('guide-steps').innerHTML = stepsHtml;
        document.getElementById('aid-guide-modal').classList.remove('hidden');
    },

    closeAidGuide() {
        document.getElementById('aid-guide-modal').classList.add('hidden');
    },

    playVoiceGuide() {
        alert("Playing audio guide... (Mock Voice Instructions Playing)");
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
