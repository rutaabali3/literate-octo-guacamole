# PulseForge — MERN Stack Fitness Tracker eProject Blueprint & Architecture Plan

Comprehensive full-stack system architecture, database schema design, REST API contract, frontend component hierarchy, directory structure, and step-by-step implementation roadmap for the **Aptech MERN Stack Fitness Tracker eProject**.

---

## 0. Refined Master Engineering Prompt

Below is the structured, production-grade version of your prompt. You can reuse this exact prompt template whenever briefing developers, AI coding assistants, or project evaluators:

> **Role & Objective:**
> Act as a Principal Full-Stack MERN Architect. Design and prototype a production-ready **Fitness Tracker Web Application** using **MongoDB, Express.js, React.js, and Node.js (MERN)** that satisfies every Functional and Non-Functional Requirement specified in the Aptech `MERN-Fitness_Tracker.docx` eProject specification.
>
> **Execution Order & Deliverables:**
> 1. **Requirements Traceability Table First:** Enumerate all 15 Functional Requirements (FR-01 to FR-15) and 9 Non-Functional Requirement categories (NFR-01 to NFR-09) upfront, mapping each requirement to its exact MongoDB collection, Express API endpoint, and React UI component.
> 2. **Full-Stack Architecture & Data Alignment:**
>    - Define a layered 3-tier architecture (React SPA Client $\leftrightarrow$ Express/Node REST API + JWT Auth Middleware $\leftrightarrow$ MongoDB Atlas with Mongoose ODM & Compound Indexes).
>    - Provide complete, strictly typed Mongoose schemas (`User`, `Workout`, `NutritionLog`, `ProgressEntry`, `Reminder`, `Notification`, `SupportTicket`) with validation, foreign-key references, and indexing strategies.
>    - Specify RESTful API routes, HTTP verbs, request payloads, status codes, and middleware chains (JWT verification, RBAC/ownership checks, rate-limiting, request sanitization).
>    - Detail the React frontend state architecture (Context API / Zustand + Axios interceptors), responsive component tree, and data-flow lifecycle.
> 3. **Complete Repository File Structure & Phased Build Plan (`README.md`):** Document the monorepo folder tree (`client/`, `server/`, `docs/`, `tests/`) alongside a laddered 6-phase engineering roadmap, environment variables, testing strategy, and deployment guide.
> 4. **Interactive Working Prototype (`fitness-tracker-prototype.html`):** Build a self-contained, responsive, interactive web application prototype demonstrating end-to-end user flows: Authentication & Profile Management, Workout CRUD with Categories/Tags, Daily Nutrition & Macro Logging, Body & Performance Progress Tracking, Interactive Analytics Charts (Chart.js), Global Search & Multi-Facet Filtering, Reminders/Alerts & Notification Center, CSV & Print/PDF Report Export, Unit/Theme Preferences, and User Support Ticket submission.

---

## 1. Requirements First — Complete Traceability Matrix

Every requirement from the Aptech `MERN-Fitness_Tracker.docx` specification is cataloged below and mapped directly to its backend schema, API route, and frontend module.

### 1.1 Functional Requirements Matrix (FR-01 through FR-15)

| Req ID | Category | Specification Requirement | MongoDB Schema(s) | Express API Endpoint(s) | React Frontend Component / View | Prototype Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **FR-01** | **User Management** | **User Registration**: Unique username & password, name, email, profile picture. | `User` | `POST /api/v1/auth/register` | `AuthModal.jsx` (`RegisterForm`), Avatar Picker | Implemented |
| **FR-02** | **User Management** | **User Login**: Secure credential login with session/token persistence. | `User` | `POST /api/v1/auth/login` `POST /api/v1/auth/refresh` | `AuthModal.jsx` (`LoginForm`), JWT Auth Context | Implemented |
| **FR-03** | **User Management** | **User Profiles**: Personalized profile view & edit (avatar, name, bio, fitness goals, following). | `User` | `GET /api/v1/users/me` `PUT /api/v1/users/me` | `ProfileModal.jsx`, `SettingsView.jsx` | Implemented |
| **FR-04** | **Fitness Tracking** | **Workout Tracking**: Create, edit, delete workout routines with exercise name, sets, reps, weights, notes, category (`Strength`, `Cardio`, `HIIT`, `Mobility`), and tags. | `Workout` | `GET /api/v1/workouts` `POST /api/v1/workouts` `PUT /api/v1/workouts/:id` `DELETE /api/v1/workouts/:id` | `WorkoutsView.jsx`, `WorkoutFormModal.jsx`, `ExerciseRowBuilder.jsx` | Implemented |
| **FR-05** | **Fitness Tracking** | **Nutrition Tracking**: Log daily food intake by meal type (`Breakfast`, `Lunch`, `Dinner`, `Snacks`) with food items, quantities, calories, and macros (protein, carbs, fats). | `NutritionLog` | `GET /api/v1/nutrition` `POST /api/v1/nutrition` `PUT /api/v1/nutrition/:id` `DELETE /api/v1/nutrition/:id` | `NutritionView.jsx`, `MealLogModal.jsx`, `MacroRingCard.jsx` | Implemented |
| **FR-06** | **Fitness Tracking** | **Progress Tracking**: Record body weight, body measurements (waist, chest, arms, body fat %), and performance metrics (5K run time, bench/squat/deadlift PRs) with time-series graphs. | `ProgressEntry` | `GET /api/v1/progress` `POST /api/v1/progress` `DELETE /api/v1/progress/:id` | `ProgressView.jsx`, `ProgressEntryModal.jsx`, `MeasurementTrendChart.jsx` | Implemented |
| **FR-07** | **Dashboard** | **Personalized User Dashboard**: Unified overview displaying KPI summary cards, recent workouts, today's nutrition macro breakdown, and latest fitness progress trends. | Aggregated (`Workout`, `NutritionLog`, `ProgressEntry`) | `GET /api/v1/dashboard/summary` | `DashboardView.jsx`, `KpiStrip.jsx`, `RecentActivityFeed.jsx` | Implemented |
| **FR-08** | **Data Visualization** | **Workout Analytics**: Interactive charts of lifting volume progression, workout frequency by week, category split, and exercise PR history. | `Workout` (Aggregation Pipeline) | `GET /api/v1/analytics/workouts` | `AnalyticsView.jsx` (`VolumeLineChart`, `CategoryBarChart`) | Implemented |
| **FR-09** | **Data Visualization** | **Nutrition Analytics**: Calorie intake vs. target trend chart, macronutrient distribution doughnut chart (Protein/Carbs/Fat %), and daily consumption insights. | `NutritionLog` (Aggregation Pipeline) | `GET /api/v1/analytics/nutrition` | `AnalyticsView.jsx` (`MacroDoughnutChart`, `CalorieTrendChart`) | Implemented |
| **FR-10** | **Activity Notifications** | **Notifications Feed**: Real-time/in-app notifications for workout completion, goal achievement, new community followers, and forum/support responses. | `Notification` | `GET /api/v1/notifications` `PATCH /api/v1/notifications/:id/read` `POST /api/v1/notifications/read-all` | `NotificationDrawer.jsx`, `TopNavBellBadge.jsx` | Implemented |
| **FR-11** | **Search & Filtering** | **Global Search & Multi-Facet Filter**: Search across workouts, nutrition entries, and community athletes; filter by category, tag, meal type, date range, and sort order. | Text Indexes on `Workout`, `NutritionLog`, `User` | `GET /api/v1/search?q=&type=&category=&tag=&from=&to=` | `GlobalSearchBar.jsx`, `FilterBar.jsx`, `CommunityDirectory.jsx` | Implemented |
| **FR-12** | **Mobile Compatibility** | **Responsive Multi-Device UI**: Fluid layout across mobile phones (`<640px`), tablets (`768px`), and desktop (`1280px+`) with adaptive bottom/sidebar navigation. | N/A (Client UI Layer) | N/A | Responsive Tailwind Grid, Mobile Bottom Nav & Collapsible Drawer | Implemented |
| **FR-13** | **Reporting & Export** | **Progress & Nutrition Reports**: Generate structured summary reports with 1-click export to **CSV** (spreadsheet-ready) and **PDF / Print Report** format. | `Workout`, `NutritionLog`, `ProgressEntry` | `GET /api/v1/reports/export?format=csv\|pdf&range=30d` | `ReportsModal.jsx`, `exportCsv()`, `printFormattedReport()` | Implemented |
| **FR-14** | **Notifications & Alerts** | **Reminders & Goal Alerts**: Configure custom scheduled reminders for workouts, meal logging times, hydration, and target weight/strength goals. | `Reminder` | `GET /api/v1/reminders` `POST /api/v1/reminders` `PATCH /api/v1/reminders/:id/toggle` `DELETE /api/v1/reminders/:id` | `RemindersPanel.jsx`, `ReminderModal.jsx` | Implemented |
| **FR-15** | **Settings & Support** | **User Preferences & Support System**: Customize units (`kg/km` vs. `lbs/mi`), theme (`Dark` / `Light`), notification toggles, GDPR privacy consent, and submit/track support or issue tickets. | `User.preferences`, `SupportTicket` | `PATCH /api/v1/users/me/preferences` `POST /api/v1/support/tickets` `GET /api/v1/support/tickets` | `SettingsView.jsx`, `SupportCenterModal.jsx`, `FaqAccordion.jsx` | Implemented |

### 1.2 Non-Functional Requirements Mapping (NFR-01 through NFR-09)

| NFR ID | Domain | Requirement Specification | Architectural Implementation in MERN Stack |
| :--- | :--- | :--- | :--- |
| **NFR-01** | **Performance** | `< 1–2s` response time; supports hundreds of concurrent users. | Compound MongoDB indexes on `{ userId: 1, date: -1 }`, lean Mongoose queries (`.lean()`), cursor pagination, `compression` gzip middleware, and React memoization (`useMemo`). |
| **NFR-02** | **Security** | Encryption in transit/at rest; industry-standard Auth & RBAC. | Passwords hashed with `bcryptjs` (12 salt rounds); short-lived JWT Access Tokens (`15m`) + HTTP-only Refresh Tokens (`7d`); `helmet` security headers; `express-mongo-sanitize` & `zod` schema validation; strict document ownership middleware (`req.user.id === resource.userId`). |
| **NFR-03** | **Privacy (GDPR)** | Informed consent, data visibility controls, account data export/erasure. | Explicit `gdprConsent` timestamp on registration, profile visibility toggle (`public` / `followers` / `private`), full JSON/CSV data portability export, and cascading account deletion (`DELETE /api/v1/users/me`). |
| **NFR-04** | **Reliability** | `99%+` uptime target & automated data backups. | MongoDB Atlas replica set (3 nodes) with continuous point-in-time backups, graceful Node.js `SIGTERM` shutdown handlers, and health check endpoint (`GET /api/v1/health`). |
| **NFR-05** | **Usability & Accessibility** | Intuitive navigation and WCAG 2.1 AA compliance. | Semantic HTML5 landmarks (`<nav>`, `<main>`, `<section>`), ARIA labels on icon buttons/modals, keyboard Esc/Tab navigation, and $\ge 4.5:1$ contrast ratios across both Dark and Light themes. |
| **NFR-06** | **Compatibility** | Cross-browser (Chrome, Firefox, Safari, Edge) & mobile responsive. | Standard ES2022 transpiled via Vite, CSS Flexbox/Grid with responsive breakpoints, and touch-friendly `44px` minimum tap targets. |
| **NFR-07** | **Horizontal Scalability** | Stateless API tier capable of horizontal scaling. | Stateless JWT authentication (no sticky server sessions required), allowing Node.js cluster mode (`pm2 -i max`) or containerized auto-scaling behind Nginx / AWS ALB. |
| **NFR-08** | **Monitoring & Logging** | Structured logging of performance, errors, and activity. | `morgan` HTTP request logging piped into `winston` structured JSON logs (`logs/error.log`, `logs/combined.log`) with request duration telemetry (`X-Response-Time`). |
| **NFR-09** | **Testing & QA** | Unit, integration, E2E, and security testing suites. | `Jest` + `Supertest` + `mongodb-memory-server` for backend API integration tests; `Vitest` + `React Testing Library` for UI components; `Playwright` for E2E user flows; `npm audit` + OWASP ZAP security scans. |

---

## 2. System Architecture & Data Flow Design

### 2.1 High-Level 3-Tier MERN Architecture

```
+---------------------------------------------------------------------------------------------------+
|                                     CLIENT TIER (React 18 + Vite)                                 |
|                                                                                                   |
|  +-----------------+  +------------------+  +------------------+  +----------------------------+  |
|  |  Views / Pages  |  |  Chart.js Engine |  |  CSV / Print PDF |  | Global State (Context/Store|  |
|  |  - Dashboard    |  |  - Volume Trend  |  |  Report Exporter |  |  - AuthUser & Preferences  |  |
|  |  - Workouts     |  |  - Macro Split   |  |  - Client CSV    |  |  - Workouts & Nutrition    |  |
|  |  - Nutrition    |  |  - Body Metrics  |  |  - Print Sheet   |  |  - Progress & Reminders    |  |
|  |  - Progress     |  |  - Frequency Bar |  +------------------+  |  - Notifications & Tickets |  |
|  |  - Community    |  +------------------+                        +-------------+--------------+  |
|  |  - Settings/FAQ |                                                            |                 |
|  +-----------------+                                                            v                 |
|                                                                   +----------------------------+  |
|                                                                   | Axios API Client           |  |
|                                                                   | (JWT Bearer Interceptor)   |  |
|                                                                   +-------------+--------------+  |
+---------------------------------------------------------------------------------|-----------------+
                                                                                  | HTTPS / JSON
                                                                                  v
+---------------------------------------------------------------------------------------------------+
|                              APPLICATION TIER (Node.js + Express.js)                              |
|                                                                                                   |
|  +---------------------------------------------------------------------------------------------+  |
|  | Security & Observability Middleware Pipeline                                                |  |
|  | [Helmet] -> [CORS] -> [RateLimiter] -> [MongoSanitize] -> [Morgan/Winston] -> [JWT Verify]  |  |
|  +---------------------------------------------------------------------------------------------+  |
|          |                  |                   |                  |                  |           |
|          v                  v                   v                  v                  v           |
|  +---------------+  +---------------+  +----------------+  +---------------+  +----------------+  |
|  | Auth & Users  |  | Workouts API  |  | Nutrition API  |  | Progress &    |  | Alerts, Search |  |
|  | Controller    |  | Controller    |  | Controller     |  | Analytics API |  | & Support API  |  |
|  +-------+-------+  +-------+-------+  +--------+-------+  +-------+-------+  +--------+-------+  |
|          |                  |                   |                  |                   |          |
|          +------------------+-------------------+------------------+-------------------+          |
|                                                 |                                                 |
|                                                 v                                                 |
|  +---------------------------------------------------------------------------------------------+  |
|  | Mongoose ODM Data Access Layer (Schema Validation, Virtuals, Pre-Save Hooks, Aggregations)  |  |
|  +----------------------------------------------+----------------------------------------------+  |
+-------------------------------------------------|-------------------------------------------------+
                                                  | MongoDB Wire Protocol (TLS)
                                                  v
+---------------------------------------------------------------------------------------------------+
|                                   DATA TIER (MongoDB Atlas Cluster)                               |
|                                                                                                   |
|  +--------------+  +--------------+  +----------------+  +-----------------+  +----------------+  |
|  | users        |  | workouts     |  | nutrition_logs |  | progress_entries|  | notifications  |  |
|  | (Unique Idx) |  | (Compound &  |  | (Compound &    |  | (Time-Series    |  | reminders      |  |
|  |              |  |  Text Idx)   |  |  Text Idx)     |  |  Compound Idx)  |  | support_tickets|  |
|  +--------------+  +--------------+  +----------------+  +-----------------+  +----------------+  |
+---------------------------------------------------------------------------------------------------+
```

### 2.2 End-to-End Request Lifecycle (Workout Completion Flow)

1. **User Action (React Client):** User submits the "Log Workout" form (`WorkoutFormModal.jsx`) with exercises, sets, reps, weights, category (`Strength`), and tags (`#push`, `#hypertrophy`).
2. **Client Validation & Dispatch:** Form payload is validated client-side and dispatched via Axios `POST /api/v1/workouts` with header `Authorization: Bearer <accessToken>`.
3. **Middleware Pipeline (Express):**
   - `authMiddleware` verifies the JWT signature and attaches `req.user = { id, username, unitSystem }`.
   - `validateRequest(workoutZodSchema)` ensures `sets >= 1`, `reps >= 1`, `weight >= 0`, and sanitizes string inputs.
4. **Controller & Service Execution:**
   - `workoutController.createWorkout` calculates total session volume ($\sum \text{sets} \times \text{reps} \times \text{weight}$) and persists the `Workout` document in MongoDB.
   - `notificationService.triggerGoalCheck(req.user.id, workout)` evaluates whether the workout sets a new exercise Personal Record (PR) or completes the user's weekly workout target, creating a `Notification` document if triggered.
5. **Response & Reactive UI Update:** Express returns `201 Created` with the populated workout and any new notification badge count; React updates the store, re-renders the Dashboard KPI cards, and updates the Chart.js analytics canvas immediately.

---

## 3. Database Schema Design (MongoDB + Mongoose ODM)

All collections use `timestamps: true` (`createdAt`, `updatedAt`) and enforce ownership via indexed `userId` references.

### 3.1 `User` Schema (`server/src/models/User.model.js`)

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minlength: 3,
    maxlength: 30,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
  },
  passwordHash: {
    type: String,
    required: true,
    select: false // Never returned in queries by default
  },
  profile: {
    fullName: { type: String, required: true, trim: true, maxlength: 80 },
    avatarUrl: { type: String, default: '/assets/avatars/default-athlete.svg' },
    bio: { type: String, maxlength: 280, default: '' },
    fitnessGoal: {
      type: String,
      enum: ['Strength & Hypertrophy', 'Fat Loss & Conditioning', 'Endurance & Marathon', 'General Wellness'],
      default: 'Strength & Hypertrophy'
    },
    targetWeightKg: { type: Number, min: 30, max: 300, default: 75 },
    dailyCalorieTarget: { type: Number, min: 1000, max: 6000, default: 2400 },
    macroTargets: {
      proteinGrams: { type: Number, default: 180 },
      carbsGrams: { type: Number, default: 240 },
      fatGrams: { type: Number, default: 75 }
    },
    weeklyWorkoutGoal: { type: Number, min: 1, max: 14, default: 4 }
  },
  preferences: {
    unitSystem: { type: String, enum: ['metric', 'imperial'], default: 'metric' }, // metric (kg/km/cm) vs imperial (lbs/mi/in)
    theme: { type: String, enum: ['dark', 'light'], default: 'dark' },
    profileVisibility: { type: String, enum: ['public', 'followers', 'private'], default: 'public' },
    notifications: {
      workoutCompletion: { type: Boolean, default: true },
      goalAchievement: { type: Boolean, default: true },
      newFollowers: { type: Boolean, default: true },
      forumResponses: { type: Boolean, default: true },
      remindersEnabled: { type: Boolean, default: true }
    },
    gdprConsent: {
      accepted: { type: Boolean, required: true, default: true },
      acceptedAt: { type: Date, default: Date.now }
    }
  },
  social: {
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  }
}, { timestamps: true });

UserSchema.index({ 'profile.fullName': 'text', username: 'text', 'profile.fitnessGoal': 'text' });

UserSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  next();
});

UserSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

module.exports = mongoose.model('User', UserSchema);
```

### 3.2 `Workout` Schema (`server/src/models/Workout.model.js`)

```javascript
const mongoose = require('mongoose');

const ExerciseSetSchema = new mongoose.Schema({
  exerciseName: { type: String, required: true, trim: true },
  sets: { type: Number, required: true, min: 1, max: 50 },
  reps: { type: Number, required: true, min: 1, max: 500 },
  weightKg: { type: Number, required: true, min: 0, max: 1000 },
  rpe: { type: Number, min: 1, max: 10, default: 8 },
  notes: { type: String, trim: true, maxlength: 200, default: '' }
}, { _id: false });

const WorkoutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 100 },
  category: {
    type: String,
    required: true,
    enum: ['Strength', 'Cardio', 'HIIT', 'Mobility', 'CrossFit'],
    index: true
  },
  tags: [{ type: String, trim: true, lowercase: true }],
  performedAt: { type: Date, required: true, default: Date.now, index: true },
  durationMinutes: { type: Number, required: true, min: 1, max: 600 },
  caloriesBurned: { type: Number, min: 0, default: 0 },
  totalVolumeKg: { type: Number, min: 0, default: 0 }, // Auto-calculated: sum(sets * reps * weightKg)
  exercises: {
    type: [ExerciseSetSchema],
    validate: [arr => arr.length > 0, 'At least one exercise is required']
  },
  notes: { type: String, trim: true, maxlength: 500, default: '' },
  completed: { type: Boolean, default: true }
}, { timestamps: true });

// Compound index for fast user timeline & analytics queries
WorkoutSchema.index({ userId: 1, performedAt: -1 });
WorkoutSchema.index({ title: 'text', tags: 'text', 'exercises.exerciseName': 'text', notes: 'text' });

WorkoutSchema.pre('validate', function (next) {
  if (Array.isArray(this.exercises)) {
    this.totalVolumeKg = this.exercises.reduce(
      (sum, ex) => sum + (Number(ex.sets || 0) * Number(ex.reps || 0) * Number(ex.weightKg || 0)),
      0
    );
  }
  next();
});

module.exports = mongoose.model('Workout', WorkoutSchema);
```

### 3.3 `NutritionLog` Schema (`server/src/models/NutritionLog.model.js`)

```javascript
const mongoose = require('mongoose');

const FoodItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  quantity: { type: Number, required: true, min: 0.1 },
  unit: { type: String, required: true, default: 'g' }, // g, ml, oz, serving, scoop
  calories: { type: Number, required: true, min: 0 },
  proteinGrams: { type: Number, required: true, min: 0 },
  carbsGrams: { type: Number, required: true, min: 0 },
  fatGrams: { type: Number, required: true, min: 0 }
}, { _id: false });

const NutritionLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  loggedDate: { type: Date, required: true, default: Date.now, index: true },
  mealType: {
    type: String,
    required: true,
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Snacks'],
    index: true
  },
  items: {
    type: [FoodItemSchema],
    validate: [arr => arr.length > 0, 'At least one food item is required']
  },
  totals: {
    calories: { type: Number, default: 0 },
    proteinGrams: { type: Number, default: 0 },
    carbsGrams: { type: Number, default: 0 },
    fatGrams: { type: Number, default: 0 }
  },
  waterMl: { type: Number, min: 0, default: 0 },
  notes: { type: String, trim: true, maxlength: 300, default: '' }
}, { timestamps: true });

NutritionLogSchema.index({ userId: 1, loggedDate: -1 });
NutritionLogSchema.index({ 'items.name': 'text', mealType: 'text', notes: 'text' });

NutritionLogSchema.pre('validate', function (next) {
  if (Array.isArray(this.items)) {
    this.totals = this.items.reduce(
      (acc, item) => ({
        calories: acc.calories + Number(item.calories || 0),
        proteinGrams: +(acc.proteinGrams + Number(item.proteinGrams || 0)).toFixed(1),
        carbsGrams: +(acc.carbsGrams + Number(item.carbsGrams || 0)).toFixed(1),
        fatGrams: +(acc.fatGrams + Number(item.fatGrams || 0)).toFixed(1)
      }),
      { calories: 0, proteinGrams: 0, carbsGrams: 0, fatGrams: 0 }
    );
  }
  next();
});

module.exports = mongoose.model('NutritionLog', NutritionLogSchema);
```

### 3.4 `ProgressEntry` Schema (`server/src/models/ProgressEntry.model.js`)

```javascript
const mongoose = require('mongoose');

const ProgressEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  recordedAt: { type: Date, required: true, default: Date.now, index: true },
  weightKg: { type: Number, required: true, min: 25, max: 350 },
  bodyFatPct: { type: Number, min: 2, max: 65 },
  measurementsCm: {
    waist: { type: Number, min: 30, max: 250 },
    chest: { type: Number, min: 40, max: 250 },
    arms: { type: Number, min: 15, max: 100 },
    thighs: { type: Number, min: 25, max: 150 }
  },
  performanceMetrics: {
    benchPressMaxKg: { type: Number, min: 0, default: 0 },
    squatMaxKg: { type: Number, min: 0, default: 0 },
    deadliftMaxKg: { type: Number, min: 0, default: 0 },
    run5kTimeMinutes: { type: Number, min: 0, default: 0 }
  },
  notes: { type: String, trim: true, maxlength: 300, default: '' }
}, { timestamps: true });

ProgressEntrySchema.index({ userId: 1, recordedAt: -1 });

module.exports = mongoose.model('ProgressEntry', ProgressEntrySchema);
```

### 3.5 `Reminder`, `Notification` & `SupportTicket` Schemas

```javascript
// server/src/models/Reminder.model.js
const ReminderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 100 },
  type: { type: String, enum: ['Workout', 'Meal', 'Goal', 'Hydration'], required: true },
  timeOfDay: { type: String, required: true, match: /^([01]\d|2[0-3]):([0-5]\d)$/ }, // HH:mm
  daysOfWeek: [{ type: String, enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] }],
  enabled: { type: Boolean, default: true }
}, { timestamps: true });

// server/src/models/Notification.model.js
const NotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  category: {
    type: String,
    enum: ['workout_completed', 'goal_achieved', 'new_follower', 'forum_reply', 'system_alert'],
    required: true
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false, index: true }
}, { timestamps: true });

// server/src/models/SupportTicket.model.js
const SupportTicketSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  subject: { type: String, required: true, trim: true, maxlength: 120 },
  category: { type: String, enum: ['Bug Report', 'Feature Request', 'Account & Privacy', 'General Help'], required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  description: { type: String, required: true, maxlength: 1500 },
  status: { type: String, enum: ['Open', 'In Progress', 'Resolved'], default: 'Open' },
  staffResponse: { type: String, default: '' }
}, { timestamps: true });
```

---

## 4. Complete REST API Specification

Base URL: `/api/v1` | Authentication: `Authorization: Bearer <JWT>`

| Method | Endpoint | Auth | Description | Request Body / Query Params | Success Response |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Public | Register new athlete account | `{ username, email, password, fullName, fitnessGoal }` | `201 { user, accessToken }` |
| `POST` | `/auth/login` | Public | Authenticate & issue JWT | `{ usernameOrEmail, password }` | `200 { user, accessToken }` |
| `GET` | `/users/me` | Bearer | Fetch current user profile & preferences | — | `200 { user }` |
| `PUT` | `/users/me` | Bearer | Update profile bio, avatar, targets | `{ fullName, bio, avatarUrl, fitnessGoal, dailyCalorieTarget, macroTargets, targetWeightKg }` | `200 { user }` |
| `PATCH` | `/users/me/preferences` | Bearer | Update unit system, theme, notification toggles | `{ unitSystem, theme, notifications, profileVisibility }` | `200 { preferences }` |
| `GET` | `/workouts` | Bearer | List user workouts with filtering | `?category=Strength&tag=push&from=2026-10-01&to=2026-11-11&q=bench` | `200 { items, totalVolume, count }` |
| `POST` | `/workouts` | Bearer | Create workout routine entry | `{ title, category, tags, performedAt, durationMinutes, caloriesBurned, exercises, notes }` | `201 { workout, newNotifications }` |
| `PUT` | `/workouts/:id` | Bearer | Edit existing workout routine | `{ title, category, tags, durationMinutes, exercises, notes }` | `200 { workout }` |
| `DELETE` | `/workouts/:id` | Bearer | Delete workout entry | — | `200 { deletedId }` |
| `GET` | `/nutrition` | Bearer | List nutrition logs by date/meal type | `?date=2026-11-11&mealType=Breakfast&q=oats` | `200 { logs, dailyTotals }` |
| `POST` | `/nutrition` | Bearer | Log meal with food items & macros | `{ loggedDate, mealType, items: [{ name, quantity, unit, calories, proteinGrams, carbsGrams, fatGrams }], waterMl }` | `201 { log, dailyTotals }` |
| `PUT` | `/nutrition/:id` | Bearer | Update logged meal items | `{ mealType, items, waterMl, notes }` | `200 { log }` |
| `DELETE` | `/nutrition/:id` | Bearer | Delete meal entry | — | `200 { deletedId }` |
| `GET` | `/progress` | Bearer | Get chronological body & PR logs | `?range=90d` | `200 { entries, deltas }` |
| `POST` | `/progress` | Bearer | Record weight, measurements & PRs | `{ recordedAt, weightKg, bodyFatPct, measurementsCm, performanceMetrics, notes }` | `201 { entry, newNotifications }` |
| `GET` | `/analytics/overview` | Bearer | Aggregated workout + nutrition + body charts | `?range=30d` | `200 { volumeSeries, macroSplit, calorieSeries, weightSeries, prSummary }` |
| `GET` | `/search` | Bearer | Global search across workouts, meals & users | `?q=squat&scope=all\|workouts\|nutrition\|users&category=` | `200 { workouts, nutrition, users }` |
| `GET` | `/reminders` | Bearer | List scheduled alerts & reminders | — | `200 { reminders }` |
| `POST` | `/reminders` | Bearer | Create workout/meal/goal reminder | `{ title, type, timeOfDay, daysOfWeek }` | `201 { reminder }` |
| `PATCH` | `/reminders/:id/toggle` | Bearer | Enable/disable a reminder | `{ enabled }` | `200 { reminder }` |
| `GET` | `/notifications` | Bearer | Fetch activity notification feed | `?unreadOnly=false` | `200 { notifications, unreadCount }` |
| `PATCH` | `/notifications/read-all` | Bearer | Mark all notifications as read | — | `200 { updatedCount }` |
| `GET` | `/reports/export` | Bearer | Export user fitness & nutrition dataset | `?format=csv&scope=all\|workouts\|nutrition\|progress` | `200 text/csv` or JSON report payload |
| `POST` | `/support/tickets` | Bearer | Submit support / feedback ticket | `{ subject, category, priority, description }` | `201 { ticket }` |

---

## 5. Complete Monorepo File Structure

```text
mern-fitness-tracker/
├── README.md                                  # Master Architecture Plan & Developer Documentation
├── docker-compose.yml                         # Local MongoDB + Express API + React Client orchestration
├── .env.example                               # Template environment variables
│
├── server/                                    # BACKEND: Node.js + Express.js + Mongoose
│   ├── package.json
│   ├── src/
│   │   ├── server.js                          # Entry point: HTTP server & graceful shutdown
│   │   ├── app.js                             # Express app, middleware pipeline & route mounting
│   │   ├── config/
│   │   │   ├── db.js                          # MongoDB Atlas connection pool & retry logic
│   │   │   ├── env.js                         # Validated environment config
│   │   │   └── logger.js                      # Winston + Morgan structured logging (NFR-08)
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js             # JWT verification & req.user attachment (NFR-02)
│   │   │   ├── validate.middleware.js         # Zod request body/query validation
│   │   │   ├── rateLimiter.middleware.js      # Express-rate-limit protection
│   │   │   └── error.middleware.js            # Centralized error formatting
│   │   ├── models/
│   │   │   ├── User.model.js                  # FR-01, FR-02, FR-03, FR-15
│   │   │   ├── Workout.model.js               # FR-04, FR-08
│   │   │   ├── NutritionLog.model.js          # FR-05, FR-09
│   │   │   ├── ProgressEntry.model.js         # FR-06
│   │   │   ├── Reminder.model.js              # FR-14
│   │   │   ├── Notification.model.js          # FR-10
│   │   │   └── SupportTicket.model.js         # FR-15
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── user.controller.js
│   │   │   ├── workout.controller.js
│   │   │   ├── nutrition.controller.js
│   │   │   ├── progress.controller.js
│   │   │   ├── analytics.controller.js
│   │   │   ├── search.controller.js
│   │   │   ├── reminder.controller.js
│   │   │   ├── notification.controller.js
│   │   │   ├── report.controller.js
│   │   │   └── support.controller.js
│   │   ├── routes/
│   │   │   ├── index.js                       # Aggregates /api/v1/* routes
│   │   │   ├── auth.routes.js
│   │   │   ├── user.routes.js
│   │   │   ├── workout.routes.js
│   │   │   ├── nutrition.routes.js
│   │   │   ├── progress.routes.js
│   │   │   ├── analytics.routes.js
│   │   │   ├── search.routes.js
│   │   │   ├── reminder.routes.js
│   │   │   ├── notification.routes.js
│   │   │   ├── report.routes.js
│   │   │   └── support.routes.js
│   │   └── utils/
│   │       ├── csvExporter.js                 # Server-side CSV report generator (FR-13)
│   │       ├── unitConverter.js               # Metric <-> Imperial conversion helpers (FR-15)
│   │       └── seedDatabase.js                # Sample athlete dataset seeder
│   └── tests/                                 # Backend Jest + Supertest suites (NFR-09)
│       ├── auth.test.js
│       ├── workouts.test.js
│       ├── nutrition.test.js
│       └── progress.test.js
│
├── client/                                    # FRONTEND: React 18 + Vite + Tailwind CSS + Chart.js
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── api/
│       │   └── axiosClient.js                 # Axios instance with JWT refresh interceptor
│       ├── context/
│       │   ├── AuthContext.jsx                # User session, login/register/profile actions
│       │   ├── FitnessDataContext.jsx         # Workouts, Nutrition, Progress, Reminders state
│       │   └── ThemeUnitContext.jsx           # Dark/Light theme & kg/lbs unit conversion hooks
│       ├── components/
│       │   ├── layout/
│       │   │   ├── SidebarNav.jsx             # Desktop navigation rail
│       │   │   ├── MobileBottomNav.jsx        # Responsive mobile bar (FR-12)
│       │   │   ├── TopHeaderBar.jsx           # Search bar, unit badge, notification bell, profile
│       │   │   └── NotificationDrawer.jsx     # Slide-over activity notification feed (FR-10)
│       │   ├── dashboard/
│       │   │   ├── KpiSummaryGrid.jsx         # Calories, Volume, Streak, Active Weight cards (FR-07)
│       │   │   └── RecentActivityTimeline.jsx # Combined recent workouts & meals
│       │   ├── workouts/
│       │   │   ├── WorkoutCard.jsx            # Routine display with category badge & tags
│       │   │   └── WorkoutFormModal.jsx       # Dynamic exercise row builder (FR-04)
│       │   ├── nutrition/
│       │   │   ├── MealSectionCard.jsx        # Breakfast, Lunch, Dinner, Snacks breakdown
│       │   │   ├── MacroProgressBars.jsx      # Protein, Carbs, Fats vs daily goals
│       │   │   └── MealLogModal.jsx           # Multi-item food & macro logger (FR-05)
│       │   ├── progress/
│       │   │   ├── BodyMetricsTable.jsx       # Weight, body fat %, waist/chest/arms log
│       │   │   ├── PersonalRecordsGrid.jsx    # Bench, Squat, Deadlift, 5K Run PR cards
│       │   │   └── ProgressEntryModal.jsx     # Log new body/performance check-in (FR-06)
│       │   ├── analytics/
│       │   │   ├── WorkoutVolumeChart.jsx     # Chart.js line/bar chart for lifting volume (FR-08)
│       │   │   ├── MacroDistributionChart.jsx # Chart.js doughnut + calorie bar chart (FR-09)
│       │   │   └── BodyCompositionChart.jsx   # Weight & body fat % dual-axis trend (FR-06)
│       │   ├── search/
│       │   │   └── GlobalSearchFilterView.jsx # Multi-entity search, tag/category filter & community (FR-11)
│       │   ├── reminders/
│       │   │   └── RemindersManager.jsx       # Workout, meal & hydration alert scheduler (FR-14)
│       │   ├── reports/
│       │   │   └── ExportReportModal.jsx      # CSV download & printable PDF report view (FR-13)
│       │   └── settings/
│       │       ├── PreferencesPanel.jsx       # Units, theme, privacy, notification toggles (FR-15)
│       │       └── SupportTicketPanel.jsx     # Issue reporting form, ticket tracker & FAQ (FR-15)
│       └── utils/
│           ├── formatUnits.js                 # Automatic kg<->lbs and cm<->in display formatting
│           └── exportHelpers.js               # Browser CSV blob generator & print stylesheet trigger
│
└── docs/                                      # Project Documentation & eProject Submission Artifacts
    ├── API_POSTMAN_COLLECTION.json
    ├── USER_GUIDE.md
    └── DEMO_VIDEO_SCRIPT.md
```

---

## 6. Frontend Architecture & State Synchronization

### 6.1 Reactive State & Unit Conversion Architecture

A critical design requirement in `MERN-Fitness_Tracker.docx` is seamless unit customization (`metric` vs. `imperial`) and real-time analytics updates across views.
- **Canonical Storage in Metric:** All database records store weights in `kg` and measurements in `cm` to prevent floating-point drift when users switch preferences.
- **Display-Layer Conversion Hook (`useUnitFormat`):**
  - Weight display: $\text{lbs} = \text{kg} \times 2.20462$ (rounded to 1 decimal place).
  - Length display: $\text{in} = \text{cm} \times 0.393701$.
  - Pace/Distance display: $\text{miles} = \text{km} \times 0.621371$.
- **Automatic Chart Re-Computation:** Whenever a workout, meal, or progress entry is added, edited, or deleted, the state store immediately recalculates:
  1. **Weekly Training Volume** ($\sum \text{sets} \times \text{reps} \times \text{weight}$).
  2. **Daily Macro Totals & Calorie Balance** ($\text{Calories Consumed} - \text{Daily Target}$).
  3. **Body Weight Delta & PR Progression** ($\text{Current Weight} - \text{Starting Weight}$).

---

## 7. Phased Implementation Plan (Laddered eProject Approach)

Following the Aptech eProject laddered methodology, build and verify the application in 6 structured milestones:

| Phase | Milestone Name | Key Deliverables & Verification Checkpoints |
| :--- | :--- | :--- |
| **Phase 1** | **Foundation, Database & Auth (FR-01–FR-03, NFR-02)** | Initialize Node/Express server, connect MongoDB Atlas, implement `User` schema with `bcryptjs` password hashing, JWT login/register endpoints, and React `AuthContext` + profile editor. |
| **Phase 2** | **Core Tracking Engines: Workouts, Nutrition & Progress (FR-04–FR-06)** | Build CRUD endpoints and Mongoose models for `Workout`, `NutritionLog`, and `ProgressEntry`. Implement dynamic exercise set builders, meal macro calculators, and body measurement logs in React. |
| **Phase 3** | **Dashboard & Data Visualization Engine (FR-07–FR-09)** | Build MongoDB aggregation pipelines for weekly volume, workout frequency, calorie trends, and macro ratios. Connect Chart.js canvases on the Dashboard and Analytics views. |
| **Phase 4** | **Search, Filtering, Notifications & Reminders (FR-10, FR-11, FR-14)** | Add MongoDB text indexes, build the unified `/api/v1/search` endpoint with category/tag/date filters, implement the activity notification drawer, and wire the reminder scheduler. |
| **Phase 5** | **Reporting/Export, Preferences & Support Desk (FR-13, FR-15)** | Implement CSV file generation and print-ready PDF report views, wire global `kg/lbs` and `Dark/Light` theme toggles, and add the `SupportTicket` submission & FAQ module. |
| **Phase 6** | **QA Testing, Accessibility Audit & Demo Video (NFR-01–NFR-09)** | Run Jest/Supertest API test suites, verify mobile responsiveness across 375px–1440px viewports, audit WCAG contrast, and record the end-to-end eProject submission walkthrough video. |

---

## 8. Quick-Start Setup & Environment Configuration

### 8.1 Environment Variables (`server/.env`)

```ini
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/pulseforge_fitness
JWT_ACCESS_SECRET=replace_with_64_byte_hex_secret_key_for_access_tokens
JWT_REFRESH_SECRET=replace_with_64_byte_hex_secret_key_for_refresh_tokens
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
```

### 8.2 Running the Full MERN Stack Locally

```bash
# 1. Install dependencies for both backend and frontend
cd server && npm install
cd ../client && npm install

# 2. Seed initial sample workouts, meals, progress logs, and community athletes
cd ../server && npm run seed

# 3. Start backend API (port 5000) and Vite React client (port 5173)
npm run dev
```
