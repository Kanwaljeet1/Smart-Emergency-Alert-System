# ResQ - Smart Emergency Response Platform

A fully functional frontend mock of an intelligent emergency response mobile application designed for Hackathons.

## Overview
ResQ provides a unified platform to trigger emergency SOS alerts, connect with verified nearby responders, find localized emergency services, and view critical first-aid guides. 

This UI is built with an absolute mobile-first design, featuring dark mode, sleek animations, and embedded Leaflet Maps for real-time tracking visualization.

## How to run instantly (Hackathon Demo mode)

You can run this instantly in your browser without any build tools!

1. Using **VS Code Live Server**: 
   - Right-click `index.html` -> "Open with Live Server"
2. Or just use a simple Python server:
   ```bash
   python -m http.server 8000
   ```
   Then open `http://localhost:8000` in your browser.
3. Or literally just double-click `index.html` to open it in Chrome/Edge/Safari.

## Features Built
1. **Mock Login/Auth**: Validates basic input to simulate verified civilian entry.
2. **SOS Button with Pulse Animation**: Mocks an alert being broadcasted.
3. **Live Map (Leaflet.js)**: Shows user location and dynamically populates "Ambulance" and "Responder" nodes when SOS is triggered.
4. **First Aid Directory**: Interactive cards with detailed step-by-step instructions.
5. **Hyperlocal Services Tab**: Mocked list of nearby hospitals, auto mechanics, etc. with distance and ratings.

## Tech Stack
Frontend: React Native, React.js, Tailwind CSS, Web Speech API
Backend: Node.js, Express.js, Socket.io
Database: Firebase Realtime DB, PostgreSQL
Auth: Aadhaar API, Firebase Auth
APIs: Google Maps API, Firebase Cloud Messaging
Infra: AWS, Firebase Hosting
