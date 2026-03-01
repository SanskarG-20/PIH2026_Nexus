# MargDarshak — AI Travel Intelligence Platform

> **Real-time AI-powered urban mobility assistant for Indian cities.**
> Ask in plain language. Get transport comparisons, safety alerts, eco scores, weather context, SOS emergency, and explainable AI decisions — instantly.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Problem Statement](#2-problem-statement)
3. [Solution Overview](#3-solution-overview)
4. [Key Features](#4-key-features)
5. [System Architecture](#5-system-architecture)
6. [Tech Stack](#6-tech-stack)
7. [AI Workflow](#7-ai-workflow)
8. [Folder Structure](#8-folder-structure)
9. [Local Setup](#9-local-setup)
10. [Environment Variables](#10-environment-variables)
11. [API Integrations](#11-api-integrations)
12. [Deployed Link](#12-deployed-link)
13. [Future Roadmap](#13-future-roadmap)
14. [Impact](#14-impact)

---

## 1. Project Overview

**MargDarshak** (Hindi: *मार्गदर्शक* — "the one who shows the path") is a city-aware AI travel assistant built for Indian urban commuters and travelers. It goes beyond simple directions — it reasons about your journey using real-time weather, AQI, safety scores, peak-hour traffic, transport costs, eco impact, and crowd levels, then explains *why* it chose a particular route.

The platform is designed for the complexity of Indian cities: fragmented transport networks (local trains, metro, BEST buses, autos), high-pollution zones, inconsistent safety conditions, and highly variable commute times.

---

## 2. Problem Statement

Indian urban travel is uniquely complex:

- **Fragmented transport**: A single journey may involve walking, a local train, a metro interchange, and a final auto ride.
- **No unified intelligence**: Existing apps give directions — they don't reason about safety, air quality, crowd levels, eco impact, or cost efficiency simultaneously.
- **Context-blind recommendations**: Most apps don't adjust for night-time safety risks, peak-hour rush, or real-time weather.
- **No explainability**: Users are told *what* to do, never *why*.
- **No emergency infrastructure**: No one-tap SOS with location sharing built into a travel assistant.

MargDarshak solves all of these problems in a single, AI-native interface.

---

## 3. Solution Overview

MargDarshak is a React-based single-page application that:

1. Accepts a natural language travel query (e.g., *"How do I get from Andheri to BKC?"*)
2. Classifies the intent (route, sightseeing, food, budget, safety, quick trip)
3. Fetches real-time weather + AQI data for the user's location
4. Computes transport options across Walk, Cab, Bus, Train, Auto, and Metro
5. Evaluates each option against safety zones, peak hours, crowd levels, cost, and CO₂ emissions
6. Selects the best option algorithmically and generates a human-readable explanation
7. Provides eco travel scores, smart suggestions, and a natural-language journey narration
8. Offers one-tap SOS emergency with GPS coordinates, reverse-geocoded address, and audio alert
9. Caches AI responses, weather data, and route intel for offline access
10. Persists all interactions to Supabase for history, saved trips, and analytics

---

## 4. Key Features

### Authentication & Auth-Aware Navigation
- **Clerk Auth** — Google OAuth + Email OTP login
- Protected dashboard routes — unauthenticated users are redirected to sign-in
- User profile synced to Supabase on first login
- **Auth-aware landing page** — all CTAs and product preview cards detect Clerk auth state:
  - Not authenticated → redirects to sign-in
  - Authenticated → navigates to `/app` dashboard
- Navbar shows **LOGIN** when signed out, **DASHBOARD** button + user avatar when signed in

### AI Travel Assistant
| Capability | Details |
|---|---|
| Natural language queries | Plain English/Hindi-flavored queries supported |
| Intent classification | 6 intent types: `sightseeing`, `food`, `budget`, `safety`, `quick_trip`, `route` |
| Structured responses | AI returns typed JSON: places, budget, tips, transport options |
| Intent badges | Visual badge on each message showing detected intent |
| Chat history | Persisted to Supabase; restored on next session |
| Smart suggestions | 4-section contextual panel: quick actions, local tips, safety alerts, budget hacks |

### Transport Intelligence
| Mode | Details |
|---|---|
| Walk | Recommended only for distances < 3 km |
| Cab / Auto | Ola/Uber pricing: ₹30 base + ₹12–15/km |
| Bus | Real Mumbai BEST data — 85 stops, 42 routes; boarding ≠ alighting guaranteed |
| Train | Western & Central Railway local trains with boarding/destination stations |
| Metro | Mumbai Lines 1, 2A, 2B, 7, 7A, 3 — real station data, interchange pathfinding |

**Best-route algorithm**: Minimizes `cost + (duration / 60)` with metro bonus for 5–25 km range. Walk excluded from best-pick beyond 2 km.

### Eco Travel Score
- **Per-mode CO₂ emissions** calculated using scientifically-grounded factors (g/km):
  - Walk: 0 | Metro: 15 | Train: 20 | Bus: 30 | Auto: 80 | Cab: 120
- **Green eco badges** on transport cards for modes with CO₂ < 25 g/km
- **CO₂ savings bar** comparing each mode's emissions against the highest-emitting option (cab)
- Client-side `enrichWithEco()` function parses AI duration strings → estimates distance → calculates eco scores
- Eco stat row displayed in RoutePanel with savings percentage

### Explainable AI — "Why This Route?"
After the best option is selected, a reasoning panel generates human-readable explanations:
- *"18 minutes faster than Walk"*
- *"Saves ₹150 compared to alternatives"*
- *"Better air quality — enclosed transit avoids outdoor pollution (AQI: Moderate)"*
- *"Avoids road traffic during peak hours"*
- *"High safety score (9/10)"*

### Journey Explainer
- **"EXPLAIN MY JOURNEY"** button generates a natural-language narration of the selected transport option
- `buildNarration()` constructs a human-readable journey explanation from transport data (mode, origin, destination, duration, cost, boarding/alighting, safety tips)
- **Word-by-word animated narration** with blinking cursor and progress bar
- Appears after WhyThisRoute in the transport reveal sequence

### Smart Suggestions
- AI returns a `smartSuggestions` JSON schema alongside transport data
- **4-section suggestion panel**: Quick Actions, Local Tips, Safety Alerts, Budget Hacks
- Staggered fade-in animation per section
- Contextual to the user's query and location

### Environment Intelligence
- **Weather**: Temperature, conditions, humidity, wind speed via Open-Meteo
- **AQI**: Air quality index (1–5 scale) with label and color coding
- **Rain probability**: Hourly precipitation % — surfaced in the weather badge
- **Context injection**: Weather data is injected into every AI request, enabling context-aware advice
- **Supabase logging**: Every weather fetch is saved to `environment_logs` for historical analysis

### Safety Intelligence
- **61 Mumbai zones** with real coordinates and safety scores (1–10)
- **Night penalty**: After 10 PM, zones with `nightRisk: true` have scores reduced by 2
- **Per-mode adjustments**: Walk penalised in low-safety zones; cab/metro rewarded at night
- **Safety badge**: Displayed on every transport card (green ≥ 8, amber ≥ 5, red < 5)
- **AI reasoning**: Safety context injected into AI system prompt

### SOS Emergency System
- **Floating red SOS button** — always visible on the dashboard
- **One-tap emergency panel** with:
  - GPS coordinates with 3-tier fallback (GPS → last-known → cache → Delhi default)
  - Reverse-geocoded human-readable address via Nominatim
  - **Copy Message** — pre-built emergency message with location, timestamp, and user details
  - **Call 112** — direct emergency services dial link
  - **Open Maps** — opens Google Maps at the user's coordinates
  - **Play Alert** — Web Audio API generates 3 high-frequency alert beeps (800 Hz, 200ms)
  - **AI Safety Guidance** — Groq-powered contextual safety advice based on the user's location
- All SOS triggers are logged to Supabase `sos_logs` table with coordinates, address, and timestamp
- **Works offline** — GPS and alert sound function without connectivity

### Saved Trips
- **Save Route** button on every transport card — persists trip details to Supabase `saved_trips` table
- **SavedRoutes panel** — collapsible sidebar showing all bookmarked trips with mode, origin, destination, and date
- **Click-to-reload** — clicking a saved trip re-executes the original query via `pendingQuery` prop system
- **Delete** — remove saved trips with confirmation
- Full CRUD operations: `saveTrip()`, `getSavedTrips()`, `deleteSavedTrip()` in supabaseClient.js

### Offline Fallback Mode
- **offlineCache.js** — localStorage-based cache with per-category TTLs:
  - AI responses: 2 hours
  - Weather data: 30 minutes
  - Route intel: 1 hour
- **Automatic cache read/write** integrated into `aiService.js`, `weatherService.js`, and `routeService.js`
- **Offline detection** — `navigator.onLine` + event listeners + 3-second polling in DashboardPage
- **Red OFFLINE badge** displayed in the dashboard status bar when connectivity is lost
- Cached responses served transparently — users can still see their last AI response, weather, and routes

### Dashboard UX
- **Live Decision Mode**: 8-step animated AI reasoning sequence shown while the AI processes
- **Staggered card reveal**: Transport cards animate in sequentially; best card glows
- **Animated background**: CSS-only gradient, noise texture, floating orbs, scan line, grid overlay (hidden on mobile for performance)
- **6 status indicators**: AUTH, DATABASE, AI ENGINE, WEATHER, MAPS, ROUTES — live state
- **Interactive map**: Leaflet.js dark tiles (CartoDB Dark Matter), user pin, place markers, route polyline
- **Professional icon system**: All emoji/cartoonish icons replaced with geometric Unicode symbols:
  - Intent icons: ◈ ◇ ▣ ◉ ▸ ◆
  - Safety: ◉ | Eco: ◇ | Peak warning: ▲ | Save route: ☆
  - Transport modes: ■ ◆ ▣ ◈ ○ ▸

### Mobile-First Responsive Design
The entire UI is built mobile-first for 360px–430px phones while preserving the full desktop experience:

| Layer | Approach |
|---|---|
| **Breakpoint** | Primary: 768px — all layouts adapt below this |
| **Typography** | `clamp()` fluid scaling on all headlines, stats, and CTAs |
| **Grids** | `repeat(auto-fit, minmax(…))` — columns collapse naturally with no media-query hacks |
| **Touch targets** | Minimum 44px tap areas on all interactive elements |
| **Navigation** | 3-bar hamburger → X close animation → fullscreen overlay menu on mobile |
| **Performance** | Heavy BG effects (orbs, scan line, noise texture) hidden on mobile via CSS |
| **Cursor** | Custom cursor hidden on touch devices via `@media (hover: none)` |
| **Animations** | Reduced `transform` intensity (60–80px → 24px) on mobile for smoother rendering |
| **Safe areas** | `env(safe-area-inset-bottom)` support for notched/gesture-nav devices |
| **Touch feedback** | `[data-hover]:active` → subtle opacity + scale pulse on tap |
| **Map** | Height scales from 280px to 400px via `clamp()` |

**Components with specific mobile adaptations:**
- Navbar: hamburger menu with fullscreen overlay, auto-close on resize
- HeroSection: hidden VortexText/GridBackground, full-width CTA buttons, grid-based stats
- StatsSection: 2-per-row grid on mobile (CSS class hook)
- WorkSection / IntroSection / ContactSection: single-column auto-fit grids
- Footer: stacked layout via CSS class hooks
- DashboardPage: reduced padding, responsive status grid, safe-area bottom
- AIChat / IntentInput: reduced button padding to prevent horizontal overflow
- LocationBar: flex-based input width (no fixed pixels)
- WeatherBadge: flex-wrap on PM2.5/PM10 row
- RoutePanel: flex-wrap on station chains, reduced stat gaps
- SmartSuggestions: flex-wrap on attraction/food rows
- MapView: responsive height via `clamp(280px, 50vw, 400px)`
- FeatureCard: reduced padding for tighter mobile cards

### Landing Page
- **Auth-aware buttons**: "GET CONNECTED" and product preview cards detect Clerk auth state
- **Accurate feature cards**: 8 feature cards reflecting only implemented capabilities (AI Chat, Live Location, Smart Transport, Weather + AQI, Safety Intelligence, SOS Emergency, Eco Travel Score, Offline Mode)
- **Real metrics**: Stats section shows actual product stats (6 Transport Modes, 61 Safety Zones, 5 Live APIs, 100% Offline Ready)
- **Updated skill tags**: "AI ENGINE +", "MULTI-MODAL +", "SAFETY + SOS +", "LIVE DATA +"
- **Fully responsive**: All sections adapt to mobile viewports — stacked grids, fluid typography, touch-friendly CTAs

---

## 5. System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        BROWSER CLIENT                           │
│                                                                 │
│  ┌─────────────┐   ┌──────────────┐   ┌────────────────────┐  │
│  │   Clerk     │   │  React SPA   │   │   Leaflet Maps     │  │
│  │   Auth      │──▶│  (Vite 5)    │──▶│  (CartoDB tiles)   │  │
│  └─────────────┘   └──────┬───────┘   └────────────────────┘  │
│                            │                                    │
│          ┌─────────────────┼──────────────────┐                │
│          ▼                 ▼                  ▼                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
│  │ intentClassi-│  │  aiService   │  │   routeService       │ │
│  │ fier.js      │  │  (Groq AI)   │  │  + metroService      │ │
│  │ 6 intent     │  │  llama-3.3   │  │  + busService        │ │
│  │ types        │  │  -70b        │  │  + safetyService     │ │
│  └──────────────┘  └──────────────┘  │  + ecoScoreService   │ │
│                                       └──────────────────────┘ │
│                                                                 │
│  ┌──────────────────┐  ┌──────────────────────┐                │
│  │  weatherService  │  │  explainRouteService │                │
│  │  Open-Meteo API  │  │  Reasoning engine    │                │
│  │  AQI + Rain      │  │  ETA / cost / AQI    │                │
│  └──────────────────┘  └──────────────────────┘                │
│                                                                 │
│  ┌──────────────────┐  ┌──────────────────────┐                │
│  │  offlineCache.js │  │  sosService.js       │                │
│  │  localStorage    │  │  GPS + SOS + Audio   │                │
│  │  TTL cache layer │  │  Emergency system    │                │
│  └──────────────────┘  └──────────────────────┘                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────────┐
              │         SUPABASE              │
              │  users · trips · ai_history   │
              │  intents · environment_logs   │
              │  saved_trips · sos_logs       │
              └───────────────────────────────┘

              ┌───────────────────────────────┐
              │   OPENROUTESERVICE (ORS)       │
              │   Real road distance + geom    │
              │   Haversine fallback if down   │
              └───────────────────────────────┘
```

---

## 6. Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Frontend | React | 18.2.0 |
| Build tool | Vite | 5.0.0 |
| Routing | React Router DOM | 7.13.1 |
| Authentication | Clerk | 5.61.3 |
| Database | Supabase (PostgreSQL) | 2.98.0 |
| AI Model | Groq — `llama-3.3-70b-versatile` | — |
| Maps | React Leaflet + Leaflet.js | 4.2.1 / 1.9.4 |
| Weather / AQI | Open-Meteo API | Free tier |
| Geocoding | Nominatim (OpenStreetMap) | Free |
| Routing distance | OpenRouteService | Free tier |
| Icons | Lucide React | 0.575.0 |
| Styling | CSS-in-JS (inline styles) + global CSS | — |
| Responsive | CSS media queries + `clamp()` + `auto-fit` grids | 768px breakpoint |

No Tailwind. All styles are hand-crafted inline or in `global.css` for full design control. Responsive behaviour uses CSS media queries in `global.css` with className hooks on components, plus responsive inline styles (`clamp()`, `auto-fit` grids, `flexWrap`).

---

## 7. AI Workflow

```
User types query
      │
      ▼
intentClassifier.js
  → keyword matching against 6 intent types
  → confidence scoring (0–1)
  → buildIntentPrompt() generates mode-specific instructions
      │
      ▼
askMargDarshak() — aiService.js
  → Injects: system prompt + location context + weather context + intent context
  → Sends to Groq API (llama-3.3-70b-versatile, JSON mode)
  → Returns typed JSON:
      {
        places[], estimatedBudget, bestTime, tips[],
        summary, detectedIntent, transportOptions[],
        smartSuggestions { quickActions[], localTips[],
                          safetyAlerts[], budgetHacks[] }
      }
      │
      ▼
enrichWithEco() — client-side
  → Parses AI duration strings → estimates distance (km)
  → Calculates CO₂ per mode using emission factors
  → Attaches ecoScore, co2PerKm, ecoLabel to each transport option
      │
      ▼
TransportReveal component
  → Staggered card animation with eco badges + safety scores
  → Best card auto-highlighted
      │
      ▼
explainBestRoute() — explainRouteService.js
  → Compares best option against all alternatives
  → Generates reasons[] using: ETA diff, cost diff, AQI, peak hours,
    crowd level, safety score, rain probability
      │
      ▼
WhyThisRoute → JourneyExplainer → SmartSuggestions
  → WhyThisRoute: ✓ checkmark list of AI reasoning
  → JourneyExplainer: word-by-word animated narration of the journey
  → SmartSuggestions: 4-section contextual advice panel
```

**Intent types and their effects:**

| Intent | Trigger keywords | AI mode |
|---|---|---|
| `sightseeing` | monument, tourist, visit, heritage... | Recommends tourist spots with costs & timings |
| `food` | restaurant, eat, biryani, chai, street food... | Street food + restaurant breakdown in INR |
| `budget` | cheap, affordable, save money, budget... | Cost breakdown + money-saving tips |
| `safety` | safe, night, solo, women, avoid... | Safety ratings + emergency contacts |
| `quick_trip` | quick, layover, 2 hours, half day... | Top 2–3 clustered spots only |
| `route` | how to reach, metro, station, train, bus... | Full transport analysis with all modes |

---

## 8. Folder Structure

```
client/
├── index.html
├── package.json
├── vite.config.js
├── .env.example
│
├── supabase/
│   └── migrations/
│       └── full_schema.sql          # All 7 tables + RLS policies
│
└── src/
    ├── main.jsx                     # App entry, Clerk provider, ErrorBoundary
    ├── App.jsx                      # Route definitions
    │
    ├── constants/
    │   └── theme.js                 # Y="#CCFF00", BK="#000", WH="#fff"
    │
    ├── data/
    │   └── safetyZones.json         # 61 Mumbai zones with safety scores
    │
    ├── hooks/
    │   ├── useClerkAvailable.jsx    # Clerk availability context
    │   ├── useGeolocation.js        # GPS + reverse geocoding + manual override
    │   ├── useInView.js             # Intersection observer hook
    │   └── useUserSync.js           # Sync Clerk user to Supabase users table
    │
    ├── utils/
    │   └── offlineCache.js          # localStorage cache with per-category TTLs
    │
    ├── services/
    │   ├── aiService.js             # Groq API wrapper, system prompt, JSON mode, offline cache
    │   ├── busService.js            # 85 Mumbai BEST stops, 42 routes, fare calc
    │   ├── ecoScoreService.js       # CO₂ factors per mode, calculateEcoScore(), attachEcoScores()
    │   ├── environmentService.js    # Weather+AQI wrapper + Supabase logging
    │   ├── explainRouteService.js   # Explainable AI reasoning engine
    │   ├── intentClassifier.js      # 6-intent keyword classifier, confidence scoring
    │   ├── metroService.js          # Mumbai metro data, interchange pathfinding
    │   ├── routeService.js          # ORS + haversine, mode builder, best-pick algo, offline cache
    │   ├── safetyService.js         # Zone-based safety scoring, night penalties
    │   ├── sosService.js            # GPS fallback, reverse geocode, emergency message, audio alert, AI safety guidance
    │   ├── supabaseClient.js        # All Supabase CRUD (users, trips, AI history, saved trips, SOS logs)
    │   └── weatherService.js        # Open-Meteo: weather, AQI, rain probability, offline cache
    │
    ├── components/
    │   ├── AIChat.jsx               # Main AI chat interface, transport cards, eco enrichment, all panels
    │   ├── Cursor.jsx               # Custom animated cursor
    │   ├── FeatureCard.jsx          # Landing page feature block
    │   ├── Footer.jsx               # Site footer
    │   ├── IntentInput.jsx          # Intent query input + history display
    │   ├── JourneyExplainer.jsx     # Animated word-by-word journey narration
    │   ├── LocationBar.jsx          # Location display + manual city override
    │   ├── MapView.jsx              # Leaflet map, dark tiles, markers, polyline
    │   ├── NavAuthButtons.jsx       # Auth-aware nav buttons (LOGIN / DASHBOARD + UserButton)
    │   ├── Navbar.jsx               # Top navigation bar with auth-aware fallback
    │   ├── ProtectedRoute.jsx       # Auth guard component
    │   ├── RoutePanel.jsx           # Route comparison panel with mode cards + eco stats
    │   ├── SavedRoutes.jsx          # Saved trips panel with click-to-reload
    │   ├── SmartSuggestions.jsx     # 4-section AI suggestion panel
    │   ├── SOSButton.jsx            # Floating SOS button + full-screen emergency panel
    │   ├── Ticker.jsx               # Scrolling text ticker
    │   ├── WeatherBadge.jsx         # Weather + AQI + rain probability display
    │   └── WhyThisRoute.jsx         # Explainable AI "Why this route?" panel
    │
    ├── pages/
    │   ├── DashboardPage.jsx        # Main app dashboard (offline detection, saved routes, SOS)
    │   ├── LandingPage.jsx          # Marketing landing page
    │   ├── SignInPage.jsx           # Clerk-hosted sign in
    │   └── SignUpPage.jsx           # Clerk-hosted sign up
    │
    ├── sections/                    # Landing page sections (auth-aware)
    │   ├── ContactSection.jsx
    │   ├── FeaturesSection.jsx      # 8 accurate feature cards
    │   ├── HeroSection.jsx          # Auth-aware CTAs
    │   ├── IntroSection.jsx         # Updated skill tags
    │   ├── StatsSection.jsx         # Real product metrics
    │   ├── TickerSection.jsx
    │   └── WorkSection.jsx          # Auth-aware product preview cards
    │
    └── styles/
        └── global.css               # Animations, keyframes, dark theme, responsive media queries
```

---

## 9. Local Setup

### Prerequisites
- Node.js 18+
- npm 9+
- A free account on: [Clerk](https://clerk.com), [Supabase](https://supabase.com), [Groq](https://console.groq.com), [OpenRouteService](https://openrouteservice.org)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/margdarshak.git
cd margdarshak

# 2. Install dependencies
cd client
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your real API keys (see section below)

# 4. Set up the Supabase database
# Go to: Supabase Dashboard → SQL Editor
# Paste and run the contents of: client/supabase/migrations/full_schema.sql

# 5. Start the development server
npm run dev
# App runs at http://localhost:5173
```

---

## 10. Environment Variables

Create `client/.env` with the following keys:

```env
# Clerk Authentication
# Get from: https://dashboard.clerk.com → Your App → API Keys
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...

# Supabase
# Get from: https://supabase.com → Project → Settings → API
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...

# Groq AI (free tier — 500 req/day on free plan)
# Get from: https://console.groq.com → API Keys
VITE_GROQ_API_KEY=gsk_...

# OpenRouteService (free tier — 2000 req/day)
# Get from: https://openrouteservice.org/dev/#/signup
# Use the JWT token format (Authorization header)
VITE_ORS_API_KEY=eyJvcmci...
```

All keys are required for full functionality. The app degrades gracefully:
- Missing Clerk key → auth disabled, dashboard inaccessible
- Missing Groq key → AI chat returns config error message
- Missing ORS key → route distances fall back to haversine calculation
- Missing Supabase key → persistence disabled, app still functional

---

## 11. API Integrations

| Service | Purpose | Auth | Free Tier |
|---|---|---|---|
| **Groq** | LLM inference (`llama-3.3-70b-versatile`) | Bearer token | 500 req/day |
| **Supabase** | PostgreSQL database + Row Level Security | Anon key | 500 MB storage |
| **Clerk** | Authentication (Google OAuth + Email OTP) | Publishable key | 10,000 MAU |
| **Open-Meteo** | Weather, AQI, rain probability (hourly) | No key required | Unlimited |
| **OpenRouteService** | Real road distance + GeoJSON geometry | JWT Bearer | 2,000 req/day |
| **Nominatim** | Reverse + forward geocoding (GPS + SOS) | No key (User-Agent) | Fair use |

### Supabase Tables

| Table | Purpose |
|---|---|
| `users` | Clerk user sync, last known location |
| `trips` | Saved trip intents (future feature) |
| `ai_history` | Full chat history per user |
| `intents` | Intent query log for analytics |
| `environment_logs` | Weather + AQI snapshots per session |
| `saved_trips` | Bookmarked routes with mode, origin, destination, query |
| `sos_logs` | Emergency SOS triggers with GPS coordinates, address, timestamp |

All tables have Row Level Security (RLS) enabled — users can only access their own data.

---

## 12. Deployed Link

> **Live URL**: [MargDarshak](https://margdarshak-2026.vercel.app/)

<!-- Example: https://margdarshak.vercel.app -->

---

## 13. Future Roadmap

### Near-term (v1.1)
- [ ] **Delhi NCR metro** — extend metro service to Red/Yellow/Blue/Magenta lines
- [ ] **Bangalore metro** — Purple and Green line support
- [ ] **Service Worker offline** — full PWA with service worker caching beyond localStorage

### Medium-term (v1.2)
- [ ] **Real-time bus tracking** — BEST Mumbai GTFS-RT integration
- [ ] **Multi-city safety zones** — Delhi, Bangalore, Hyderabad datasets
- [ ] **Personalized recommendations** — learn from chat history and intent patterns
- [ ] **Voice input** — Web Speech API for hands-free queries
- [ ] **Multi-language support** — Hindi, Marathi, Tamil query inputs

### Long-term
- [ ] **Multi-modal trip planning** — full A→B journey with transfers across all modes
- [ ] **Crowd-sourced safety** — user-submitted safety reports
- [ ] **Real-time crowd density** — transit crowd level estimation
- [ ] **Trip sharing** — share itineraries with friends/family

---

## 14. Impact

### Innovation
MargDarshak introduces six novel concepts to the Indian travel assistant space:

**1. Explainable AI for transport** — Most apps say *"take the metro."* MargDarshak says *"take the metro — it's 18 minutes faster, saves ₹150, and avoids peak-hour road congestion."* Every recommendation is justified.

**2. Multi-layered context fusion** — A single query triggers parallel evaluation across: intent classification, weather + AQI, safety zones, peak-hour detection, real transport data, eco scoring, and historical chat context. No app currently combines all of these.

**3. Night-aware urban safety** — Safety scores automatically reduce after 10 PM for risky zones, and the system actively recommends safer transport modes (cab over walk, metro over bus) with reasoning.

**4. Eco-conscious travel scoring** — Per-mode CO₂ emissions with green badges, savings comparisons, and environmental impact awareness baked into every route decision.

**5. One-tap SOS with AI guidance** — Emergency system with GPS fallback, reverse geocoding, audio alerts, and AI-powered contextual safety advice — all accessible from a single floating button.

**6. Mobile-first responsive design without a CSS framework** — Every component adapts to 360px–430px phones using hand-crafted CSS media queries, `clamp()` fluid typography, `auto-fit` grids, and touch-optimised tap targets — no Tailwind, no Bootstrap, no framework overhead.

### Feasibility
- **Fully functional today** — not a prototype. Every feature listed in this README is implemented and running.
- **Fully responsive** — tested across 360px phones to 1440px desktops, no horizontal overflow, no broken layouts.
- **All APIs are free-tier** — no infrastructure costs for MVP deployment.
- **No ML training required** — intelligence comes from Groq's hosted LLM + deterministic service logic.
- **Deployable in one click** — Vite + Vercel/Netlify compatible.
- **Offline-resilient** — cached AI, weather, and route data ensures usability without connectivity.

### Social Impact
- **Target users**: 50M+ daily urban commuters across Indian metros
- **Problem solved**: Poor, dangerous, or expensive transport choices made from lack of information
- **Reach**: Mumbai → Delhi → Bangalore → all major metros with minimal dataset extensions
- **Equity**: Free-tier APIs mean no paywall; accessible on any modern smartphone browser
- **Safety**: One-tap SOS with location sharing addresses personal safety — especially for women and solo travelers

---

<div align="center">

**Built with ♥ for Indian urban travelers**

[Live Demo](#) · [Report Bug](https://github.com/YOUR_USERNAME/margdarshak/issues) · [Request Feature](https://github.com/YOUR_USERNAME/margdarshak/issues)

</div>
