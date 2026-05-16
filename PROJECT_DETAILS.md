# 🌌 NEUROSCAPE: THE CINEMATIC PRODUCTIVITY ENGINE

## 1. PROJECT OVERVIEW
**NeuroScape** is a futuristic, high-fidelity productivity OS designed to bridge the gap between abstract goal-setting and concrete execution. It transforms the user's workflow into a cinematic, 3D experience where goals are physical planets, notes are crystallized memories, and productivity is tracked as a "Neural Sync" score.

---

## 2. CORE INNOVATIONS & FEATURES

### 🪐 3D Universe Dashboard (Goal Visualization)
- **Spatial Goal Mapping**: Goals are rendered as a 3D solar system using **Three.js**.
- **Interactive Orbits**: Larger planets represent high-level protocols (e.g., Career, Health), while orbiting satellites represent individual tasks.
- **Constellation Mode**: A specialized view that connects related goals via neural paths, visualizing the user's mental focus.

### ✍️ Dream Workspace (Deep Work Environment)
- **Integrated Global Timer**: A persistent countdown that orchestrates flow states across the entire platform.
- **Automated Documentation**: The system automatically injects session start/stop timestamps into the user's active notes.
- **Glassmorphic Interface**: A high-premium, distraction-free environment for coding, writing, and strategic planning.

### 🏛️ Memory Vault (3D Time-Capsule)
- **Neural Archival**: Every note "crystallized" in the workspace is stored as a floating memory card in a 3D timeline.
- **Searchable Consciousness**: Users can navigate through their past sessions, filtered by date or emotion.
- **Persistent States**: Integrated with local storage to ensure all thoughts are preserved across sessions.

### 🧠 AI Core (ARIA - Advanced Reactive Intelligence Assistant)
- **Context-Aware Chat**: ARIA has a direct link to the user's `dataStore`, allowing her to answer specific questions about active tasks and goals.
- **Neural Coaching**: Provides strategic recommendations based on the user's current focus score and behavioral patterns.
- **Sentiment Analysis**: Dynamically shifts the platform's visual mood based on the emotional tone of the user's notes.

### 📊 Neural Analytics (Live Behavioral Insights)
- **Productivity Pulse**: Real-time line charts tracking focus intensity.
- **Mood Distribution**: 3D "Lava Blobs" that visually represent the user's emotional data.
- **Cognitive Evolution**: Tracks metrics like "Information Processing" and "Neural Plasticity" based on real activity.

---

## 3. TECHNICAL ARCHITECTURE

### Frontend Stack
- **Framework**: React 18 + Vite (for ultra-fast development and HMR).
- **3D Engine**: Three.js + React Three Fiber (R3F) + Drei.
- **State Management**: Zustand (Centralized store for goals, memories, and AI context).
- **Animations**: Framer Motion (for smooth UI transitions and micro-interactions).
- **Styling**: Vanilla CSS + Glassmorphism design tokens.

### Backend Stack
- **Runtime**: Node.js + Express.
- **AI Integration**: Groq SDK (Llama 3 70B / 8B models) for near-instant response times.
- **Database**: MongoDB (for user authentication and long-term cloud persistence).
- **Security**: JWT-based authentication with UID-password mapping.

---

## 4. DESIGN PHILOSOPHY
- **Aesthetic**: "Deep Space Luxury" — high contrast, vibrant neon accents (`#00FFFF`, `#7B2FFF`), and sleek dark modes.
- **Typography**: Syne (for headlines) and JetBrains Mono (for technical data).
- **UX**: Minimum interaction for maximum output. Automated logging reduces the friction of manual tracking.

---

## 5. HOW TO RUN THE PROJECT
1. **Prerequisites**: Ensure Node.js is installed.
2. **Environment**: Create a `.env` file with your `GROQ_API_KEY` and `MONGODB_URI`.
3. **Install Dependencies**: `npm install` in both root and server directories.
4. **Start System**: Run `npm run dev:all` to launch both the frontend and the AI backend simultaneously.
5. **Access Core**: Open `http://localhost:5173` to enter the NeuroScape interface.

---

© 2024 NEUROSCAPE // CREATED FOR ELITE PRODUCTIVITY.
