# SOFTWARE REQUIREMENTS SPECIFICATION (SRS)

# MediQueue AI — Intelligent Patient Queue Management System

---

| **Document Information** | |
|---|---|
| **Project Title** | MediQueue AI |
| **Version** | 1.0 |
| **Date** | March 26, 2026 |
| **Prepared By** | Development Team |
| **Document Type** | Software Requirements Specification (SRS) |
| **Status** | Final |

---

## TABLE OF CONTENTS

1. [Introduction](#1-introduction)
2. [Overall Description](#2-overall-description)
3. [System Architecture](#3-system-architecture)
4. [Functional Requirements](#4-functional-requirements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [Data Models & Database Design](#6-data-models--database-design)
7. [API Specification](#7-api-specification)
8. [User Interface Requirements](#8-user-interface-requirements)
9. [Technology Stack](#9-technology-stack)
10. [Dependencies & Libraries](#10-dependencies--libraries)
11. [Constraints & Assumptions](#11-constraints--assumptions)
12. [Glossary](#12-glossary)
13. [Appendix](#13-appendix)

---

## 1. INTRODUCTION

### 1.1 Purpose

This Software Requirements Specification (SRS) document defines the complete functional and non-functional requirements for **MediQueue AI** — an AI-powered patient queue management system designed for hospitals and clinics. The system aims to reduce patient waiting times, dynamically prioritize urgent cases, predict consultation delays using an AI triage engine, and provide hospital staff with an efficient real-time dashboard for managing patient flow.

### 1.2 Scope

MediQueue AI is a full-stack web application with the following high-level capabilities:

- **AI-Based Triage & Prioritization**: Automatically assigns priority scores to patients based on symptoms, age, visit type, and wait time using a rule-based AI engine.
- **Real-Time Queue Management**: Maintains a live, auto-refreshing priority queue across all hospital departments.
- **Multi-Role Dashboards**: Provides separate, tailored views for Admins, Doctors, Receptionists, and Patients.
- **Analytics & Reporting**: Offers data-driven visual analytics including department load, wait time trends, priority distributions, and doctor workload comparisons.
- **Token-Based Patient Tracking**: Patients can look up their queue status in real-time using a unique token number.

### 1.3 Intended Audience

| Audience | Usage |
|---|---|
| Hospital Administrators | System oversight, patient record management, queue monitoring |
| Doctors | View assigned patient queue, manage consultations |
| Receptionists | Register walk-in patients, assign departments |
| Patients | Check wait time and queue position via token lookup |
| Developers | Implementation reference and maintenance guide |
| Project Evaluators | Academic or professional assessment of the system |

### 1.4 Definitions & Acronyms

| Term | Definition |
|---|---|
| **SRS** | Software Requirements Specification |
| **AI** | Artificial Intelligence |
| **API** | Application Programming Interface |
| **CORS** | Cross-Origin Resource Sharing |
| **SPA** | Single Page Application |
| **KPI** | Key Performance Indicator |
| **CRUD** | Create, Read, Update, Delete |
| **REST** | Representational State Transfer |
| **HMR** | Hot Module Replacement |
| **JWT** | JSON Web Token (planned) |

---

## 2. OVERALL DESCRIPTION

### 2.1 Product Perspective

MediQueue AI is a standalone, self-contained web-based application. It operates as a client-server system where:

- The **Frontend** (React SPA) runs in the user's browser and communicates with the backend via REST API calls.
- The **Backend** (FastAPI Python server) processes requests, executes the AI triage logic, and manages the in-memory patient database.

The frontend can run independently during development (via Vite dev server) or be served directly by the backend as a static build in production mode.

### 2.2 Product Features Summary

| Feature | Description |
|---|---|
| **Patient Registration** | Walk-in patient intake with auto-token generation |
| **AI Triage Engine** | Symptom keyword analysis, age scoring, emergency override, wait-time adjustment |
| **Dynamic Priority Queue** | Auto-sorting queue refreshed every 15 seconds |
| **Admin Command Center** | KPI dashboard with full queue visibility and edit capabilities |
| **Doctor's Suite** | Personal patient queue, call next, complete/mark no-show |
| **Patient Portal** | Token-based lookup for queue position and estimated wait |
| **Reception Desk** | Streamlined registration form with emergency flag toggle |
| **Analytics Dashboard** | Interactive charts — wait trends, department load, priority distribution, doctor workload |
| **Real-Time Notifications** | Toast-based notification system for status updates |

### 2.3 User Classes and Roles

| Role | Access Level | Primary Functions |
|---|---|---|
| **Admin** | Full Access | View all patients, edit records, monitor KPIs, view analytics |
| **Doctor** | Department-Scoped | View assigned queue, call next patient, complete consultation, mark no-show |
| **Receptionist** | Registration Access | Register new patients, assign departments, flag emergencies |
| **Patient** | Read-Only (Self) | Search by token, view own queue status and estimated wait time |

### 2.4 Operating Environment

| Component | Requirement |
|---|---|
| **Client Browser** | Any modern browser (Chrome, Firefox, Edge, Safari) |
| **Server OS** | Windows, macOS, or Linux |
| **Node.js** | v18+ (for frontend build) |
| **Python** | 3.9+ (for backend server) |
| **Network** | Localhost or LAN deployment |

---

## 3. SYSTEM ARCHITECTURE

### 3.1 Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                       │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                  React SPA (Vite)                        │ │
│  │  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌─────────┐ │ │
│  │  │  Admin    │ │  Doctor   │ │ Reception │ │ Patient │ │ │
│  │  │ Dashboard │ │ Dashboard │ │   Desk    │ │  View   │ │ │
│  │  └───────────┘ └───────────┘ └───────────┘ └─────────┘ │ │
│  │  ┌───────────┐ ┌───────────┐ ┌───────────────────────┐ │ │
│  │  │ Analytics │ │  Sidebar  │ │   Zustand State Store │ │ │
│  │  └───────────┘ └───────────┘ └───────────────────────┘ │ │
│  └─────────────────────────┬───────────────────────────────┘ │
│                            │ HTTP REST (fetch)                │
└────────────────────────────┼─────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │  FastAPI Server  │
                    │  (Python 3.9+)  │
                    │                 │
                    │ ┌─────────────┐ │
                    │ │  REST API   │ │
                    │ │  Endpoints  │ │
                    │ └──────┬──────┘ │
                    │        │        │
                    │ ┌──────▼──────┐ │
                    │ │  AI Triage  │ │
                    │ │   Engine    │ │
                    │ └──────┬──────┘ │
                    │        │        │
                    │ ┌──────▼──────┐ │
                    │ │  In-Memory  │ │
                    │ │  Database   │ │
                    │ └─────────────┘ │
                    └─────────────────┘
```

### 3.2 Component Breakdown

| Component | Technology | Purpose |
|---|---|---|
| **Frontend SPA** | React 19 + Vite 8 | User interface rendering and routing |
| **State Management** | Zustand 5 | Centralized client-side state with API integration |
| **AI Engine (Client)** | JavaScript module | Client-side priority calculation (mirrored from server) |
| **AI Engine (Server)** | Python function | Server-side triage computation for authoritative scoring |
| **REST API** | FastAPI | CRUD endpoints for patients, doctors, departments |
| **Data Layer** | In-Memory Python List | Patient and doctor data storage |
| **Static Server** | FastAPI StaticFiles | Serves production-built React assets |
| **Charting** | Recharts 3.8 | Interactive analytics visualizations |
| **Icons** | Lucide React | Consistent iconography throughout UI |
| **Routing** | React Router DOM 7 | Client-side page navigation |

### 3.3 Data Flow

```
Patient Registration Flow:
─────────────────────────
Reception Form → POST /api/patients → Backend validates →
AI Engine calculates priority → Token generated →
Patient added to queue → Queue re-sorted →
Response returned → Client state updated → UI refreshed

Queue Refresh Flow (every 15 seconds):
──────────────────────────────────────
setInterval → GET /api/patients → Backend recalculates all
wait times → Re-sorts queue by priority → Returns updated
list → Zustand store updated → All components re-render

Doctor Consultation Flow:
─────────────────────────
Doctor clicks "Call Next" → PUT /api/patients/{id} (status:
in-consultation) → Complete current → PUT (status: completed)
→ Auto-call next waiting patient → Queue refreshed
```

---

## 4. FUNCTIONAL REQUIREMENTS

### 4.1 Module FR-01: Patient Registration (Reception Desk)

| Req ID | Requirement | Priority |
|---|---|---|
| FR-01.1 | System shall provide a registration form capturing: Full Name, Age, Gender, Phone Number, Symptoms, Department, Visit Type, Arrival Time | **Must Have** |
| FR-01.2 | System shall support Visit Types: "New Consultation" and "Follow-up" | **Must Have** |
| FR-01.3 | System shall allow marking a patient as Emergency via a prominent toggle | **Must Have** |
| FR-01.4 | System shall auto-generate a unique Token Number in format `{DepartmentPrefix}-{3-digit random}` (e.g., C-001 for Cardiology) | **Must Have** |
| FR-01.5 | System shall auto-assign a doctor from the selected department (random selection from available doctors) | **Must Have** |
| FR-01.6 | If Arrival Time is left blank, system shall default to current timestamp | **Should Have** |
| FR-01.7 | Upon successful registration, system shall display a success notification with patient name and priority level | **Must Have** |
| FR-01.8 | Emergency-flagged patients shall receive a "Critical" notification type (red alert) | **Must Have** |
| FR-01.9 | System shall display department availability status (Open/Closed) | **Should Have** |
| FR-01.10 | System shall display AI Triage Engine priority level legend (Critical, High, Medium, Low with score thresholds) | **Should Have** |

### 4.2 Module FR-02: AI Triage Engine

| Req ID | Requirement | Priority |
|---|---|---|
| FR-02.1 | System shall compute a numeric Priority Score for each patient based on multiple weighted factors | **Must Have** |
| FR-02.2 | **Emergency Override**: If `isEmergency=true` OR `visitType='emergency'`, score += 1000, level = "Critical", bypass all other checks | **Must Have** |
| FR-02.3 | **Age Factor**: Infants (age < 5) receive +30 points; Seniors (age > 65) receive +25 points | **Must Have** |
| FR-02.4 | **Symptom Keyword Matching** (NLP Simulation): | **Must Have** |
| | - High-risk keywords: `chest pain`, `breathing`, `bleeding`, `unconscious`, `seizure`, `severe pain` → +50 per match | |
| | - Medium-risk keywords: `fever`, `fracture`, `headache`, `vomiting`, `dizzy`, `infection` → +20 per match | |
| | - Low-risk keywords: `rash`, `checkup`, `follow-up`, `cough`, `cold`, `sore throat` → +5 per match | |
| FR-02.5 | Medium and Low keywords are only checked if no High-risk keywords were matched | **Must Have** |
| FR-02.6 | **Visit Type Adjustment**: Follow-up visits receive -10 points | **Should Have** |
| FR-02.7 | **Wait Time Factor**: +1 point for every 5 minutes waited (dynamic, increases over time) | **Must Have** |
| FR-02.8 | If wait time bonus exceeds 10 points, add "Extended wait time adjusted" explanation | **Should Have** |
| FR-02.9 | **Priority Level Classification**: | **Must Have** |
| | - Critical: Score ≥ 1000 | |
| | - High: Score ≥ 60 | |
| | - Medium: Score ≥ 30 | |
| | - Low: Score < 30 | |
| FR-02.10 | System shall generate a human-readable AI Explanation string joining all contributing reasons with `" | "` separator | **Must Have** |
| FR-02.11 | AI engine logic shall be implemented on both client-side (JavaScript) and server-side (Python) with consistent behavior | **Must Have** |

### 4.3 Module FR-03: Dynamic Priority Queue

| Req ID | Requirement | Priority |
|---|---|---|
| FR-03.1 | System shall maintain a sorted queue of all patients ordered by: (1) Critical status first, (2) Priority Score descending, (3) Arrival Time ascending | **Must Have** |
| FR-03.2 | Queue shall auto-refresh every 15 seconds from the backend | **Must Have** |
| FR-03.3 | Each refresh shall recalculate all priority scores (to account for increasing wait times) | **Must Have** |
| FR-03.4 | Estimated Wait Time shall be calculated as: `position_in_doctor_queue × doctor_avg_consult_time` | **Must Have** |
| FR-03.5 | Follow-up visit wait times shall receive a 5-minute reduction (minimum 0) | **Should Have** |
| FR-03.6 | Patients with status `in-consultation`, `completed`, or `missed` shall have zero estimated wait time | **Must Have** |

### 4.4 Module FR-04: Admin Dashboard (Hospital Command Center)

| Req ID | Requirement | Priority |
|---|---|---|
| FR-04.1 | Dashboard shall display 4 KPI cards: Total Patients, In Waiting Room, Average Wait Time, Emergencies | **Must Have** |
| FR-04.2 | Emergency KPI card shall visually highlight (red border/background) when count > 0 | **Must Have** |
| FR-04.3 | Dashboard shall display a Global Priority Queue table showing up to 20 patients | **Must Have** |
| FR-04.4 | Table columns: Token, Patient (Name/Age/Gender/Visit Type/Symptoms), Department, Status, AI Priority (Level + Explanation), Estimated Wait, Actions | **Must Have** |
| FR-04.5 | Status shall be color-coded: Waiting (orange), In Consultation (green), Completed (gray), Missed (red) | **Must Have** |
| FR-04.6 | Admin shall be able to Edit patient records (Name, Age, Symptoms) via a modal dialog | **Must Have** |
| FR-04.7 | Table shall display "AI-sorted by priority score" indicator | **Should Have** |
| FR-04.8 | Priority badges shall be color-coded per level (Critical=Red, High=Orange, Medium=Yellow, Low=Green) | **Must Have** |

### 4.5 Module FR-05: Doctor Dashboard (Doctor's Suite)

| Req ID | Requirement | Priority |
|---|---|---|
| FR-05.1 | Dashboard shall show the currently consulting patient with full details (Token, Name, Age, Gender, Priority, Symptoms) | **Must Have** |
| FR-05.2 | Doctor shall be able to "Complete Consultation" for the current patient | **Must Have** |
| FR-05.3 | Doctor shall be able to "Mark No-Show" for the current patient (changes status to `missed`) | **Must Have** |
| FR-05.4 | Dashboard shall show waiting queue sidebar displaying all assigned waiting patients with priority and estimated wait | **Must Have** |
| FR-05.5 | "Call Next Patient" button shall: (a) complete current patient (if any), (b) set next waiting patient to `in-consultation` | **Must Have** |
| FR-05.6 | Dashboard shall show a "Next in Queue" preview card when no patient is in consultation | **Should Have** |
| FR-05.7 | Waiting list count badge shall be prominently displayed | **Should Have** |
| FR-05.8 | System shall display notification toast when a patient is called (with token number) | **Must Have** |

### 4.6 Module FR-06: Patient View (Patient Portal)

| Req ID | Requirement | Priority |
|---|---|---|
| FR-06.1 | System shall provide a token search input field (supports uppercase matching) | **Must Have** |
| FR-06.2 | Upon valid token entry, display: Token Number, Priority Level, Status, Estimated Wait Time, Department | **Must Have** |
| FR-06.3 | Status display shall use emoji indicators: 🟢 Called, 🟠 Waiting, ✓ Done | **Should Have** |
| FR-06.4 | Critical priority patients shall see a special alert: "Your case is marked CRITICAL. A doctor will attend to you immediately." | **Must Have** |
| FR-06.5 | Invalid token entry shall show "Token not found. Please verify your slip." message | **Must Have** |
| FR-06.6 | Page shall display live queue statistics: In Queue count, In Consultation count, Total Today count | **Must Have** |
| FR-06.7 | "Now Serving" section shall list all patients currently in consultation with room numbers | **Must Have** |
| FR-06.8 | Now Serving cards shall include pulse animation on the status indicator dot | **Should Have** |

### 4.7 Module FR-07: Analytics Dashboard

| Req ID | Requirement | Priority |
|---|---|---|
| FR-07.1 | System shall display an "Average Wait Time Trend" line chart showing hourly wait times | **Must Have** |
| FR-07.2 | System shall display an "AI Triage Distribution" donut/pie chart with percentage breakdown by priority level | **Must Have** |
| FR-07.3 | System shall display a "Department Load" stacked bar chart comparing waiting vs. completed patients per department | **Must Have** |
| FR-07.4 | System shall display an "Active Doctor Workload" horizontal bar chart comparing patients seen vs. pending per doctor | **Must Have** |
| FR-07.5 | All charts shall be interactive with hover tooltips | **Should Have** |
| FR-07.6 | Charts shall use the application's design system color variables | **Should Have** |

### 4.8 Module FR-08: Notification System

| Req ID | Requirement | Priority |
|---|---|---|
| FR-08.1 | System shall support toast notifications with types: `info`, `success`, `error` | **Must Have** |
| FR-08.2 | Notifications shall auto-dismiss after 5 seconds | **Must Have** |
| FR-08.3 | Notifications shall stack vertically with newest on top | **Should Have** |
| FR-08.4 | Registration success notification shall include patient name and priority level | **Must Have** |
| FR-08.5 | Critical registrations shall trigger `error`-type (red) notifications | **Must Have** |

### 4.9 Module FR-09: Navigation & Layout

| Req ID | Requirement | Priority |
|---|---|---|
| FR-09.1 | Application shall have a persistent Sidebar with navigation links to: Admin, Reception, Doctor, Patient, Analytics, Settings | **Must Have** |
| FR-09.2 | Application shall have a Top Header bar displayed on all pages | **Must Have** |
| FR-09.3 | Root URL (`/`) shall redirect to Admin Dashboard (`/admin`) | **Must Have** |
| FR-09.4 | All pages shall share a common Layout wrapper (Sidebar + TopHeader + Content Area) | **Must Have** |
| FR-09.5 | Settings page shall display a placeholder "Settings (Pending)" message | **Could Have** |

---

## 5. NON-FUNCTIONAL REQUIREMENTS

### 5.1 Performance

| Req ID | Requirement | Target |
|---|---|---|
| NFR-01 | Page initial load time | < 3 seconds |
| NFR-02 | Queue refresh API response time | < 500ms |
| NFR-03 | Patient registration API response time | < 1 second |
| NFR-04 | AI Priority calculation per patient | < 10ms |
| NFR-05 | Simultaneous patients in queue | Up to 200 |
| NFR-06 | Auto-refresh interval | 15 seconds |

### 5.2 Usability

| Req ID | Requirement |
|---|---|
| NFR-07 | UI shall follow a dark theme (glassmorphism aesthetic) with premium hospital-grade design |
| NFR-08 | All interactive elements shall have hover effects and smooth transitions |
| NFR-09 | Forms shall validate required fields before submission |
| NFR-10 | Priority levels shall be consistently color-coded across all views |
| NFR-11 | Typography shall use modern fonts (Inter / system stack) |
| NFR-12 | Interface shall include micro-animations (fade-in, slide-up, pulse) for dynamic content |

### 5.3 Reliability

| Req ID | Requirement |
|---|---|
| NFR-13 | System shall gracefully handle API failures with console error logging |
| NFR-14 | Failed patient registration shall trigger an error notification to the user |
| NFR-15 | In-memory data shall persist for the lifetime of the backend process |

### 5.4 Compatibility

| Req ID | Requirement |
|---|---|
| NFR-16 | Frontend shall be compatible with Chrome 90+, Firefox 88+, Safari 15+, Edge 90+ |
| NFR-17 | Backend shall support CORS for cross-origin development |
| NFR-18 | Frontend shall work with Vite HMR during development |

### 5.5 Security (Current Scope)

| Req ID | Requirement |
|---|---|
| NFR-19 | CORS is configured with wildcard (`*`) origins for development convenience |
| NFR-20 | No authentication is required for the current prototype stage |
| NFR-21 | API accepts all HTTP methods and headers (development mode) |

---

## 6. DATA MODELS & DATABASE DESIGN

### 6.1 Patient Model

```
Patient {
    id              : String        // Unique ID (e.g., "pat-1001" or timestamp-based)
    name            : String        // Full name
    age             : Integer       // Age in years (0–120)
    gender          : String        // "Male", "Female", "Other"
    phone           : String        // Contact number
    symptoms        : String        // Free-text symptom description
    department      : String        // Assigned department name
    visitType       : String        // "new" | "follow-up" | "emergency"
    isEmergency     : Boolean       // Emergency flag
    arrivalTime     : String (ISO)  // ISO 8601 timestamp
    tokenNumber     : String        // Generated token (e.g., "C-001")
    status          : String        // "waiting" | "in-consultation" | "completed" | "missed"
    assignedDoctorId: String?       // FK to Doctor.id (nullable)
    priorityScore   : Integer       // AI-computed numeric score
    priorityLevel   : String        // "Critical" | "High" | "Medium" | "Low"
    aiExplanation   : String        // Human-readable AI reasoning
    estimatedWaitTime: Integer      // Minutes (dynamically computed)
    appointmentType : String        // "walk-in" (default)
}
```

### 6.2 Doctor Model

```
Doctor {
    id              : String        // Unique ID (e.g., "doc-1")
    name            : String        // Full name with title (e.g., "Dr. Sarah Jenkins")
    department      : String        // Department name
    status          : String        // "active" | "break" | "offline"
    patientsSeen    : Integer       // Count of patients seen today
    avgConsultTime  : Integer       // Average consultation time in minutes
}
```

### 6.3 Notification Model (Client-Side Only)

```
Notification {
    id      : String        // Timestamp-based unique ID
    message : String        // Display message
    type    : String        // "info" | "success" | "error"
    time    : String (ISO)  // Creation timestamp
}
```

### 6.4 Pre-Loaded Data

**Departments (7):**
- General Medicine, Cardiology, Orthopedics, Pediatrics, Dermatology, Neurology, Emergency

**Doctors (10):**

| ID | Name | Department | Avg Consult (min) |
|---|---|---|---|
| doc-1 | Dr. Sarah Jenkins | Cardiology | 18 |
| doc-2 | Dr. Marcus Webb | Cardiology | 22 |
| doc-3 | Dr. Emily Chen | Pediatrics | 12 |
| doc-4 | Dr. Michael Scott | General Medicine | 10 |
| doc-5 | Dr. Olivia Martinez | General Medicine | 14 |
| doc-6 | Dr. James Wilson | Orthopedics | 25 |
| doc-7 | Dr. Lisa Cuddy | Dermatology | 15 |
| doc-8 | Dr. Robert Chase | Emergency | 8 |
| doc-9 | Dr. Allison Cameron | Neurology | 35 |
| doc-10 | Dr. Gregory House | General Medicine | 45 |

---

## 7. API SPECIFICATION

### 7.1 Base URL

```
http://localhost:8000/api
```

### 7.2 Endpoints

#### GET /api/departments
- **Description**: Retrieve all hospital departments
- **Response**: `200 OK` — Array of department name strings
- **Example Response**:
```json
["General Medicine", "Cardiology", "Orthopedics", "Pediatrics", "Dermatology", "Neurology", "Emergency"]
```

#### GET /api/doctors
- **Description**: Retrieve all registered doctors
- **Response**: `200 OK` — Array of Doctor objects

#### GET /api/patients
- **Description**: Retrieve all patients (triggers queue refresh with recalculated priorities)
- **Response**: `200 OK` — Array of Patient objects sorted by priority
- **Side Effect**: Recalculates all priority scores and wait times before responding

#### POST /api/patients
- **Description**: Register a new patient
- **Request Body**:
```json
{
    "name": "John Doe",
    "age": 45,
    "gender": "Male",
    "phone": "555-0199",
    "symptoms": "Mild chest pain",
    "department": "Cardiology",
    "visitType": "new",
    "isEmergency": false,
    "arrivalTime": "2026-03-26T10:00:00Z"
}
```
- **Response**: `200 OK` — Created Patient object with generated token, ID, priority score
- **Server Actions**: Generate ID, generate token, assign random doctor from department, calculate AI priority, add to queue, refresh queue

#### PUT /api/patients/{patient_id}
- **Description**: Update an existing patient's details or status
- **Path Parameter**: `patient_id` — Patient's unique ID string
- **Request Body** (all fields optional):
```json
{
    "name": "Updated Name",
    "age": 46,
    "symptoms": "Updated symptoms",
    "status": "in-consultation",
    "priorityLevel": "Critical"
}
```
- **Response**: `200 OK` — Updated Patient object
- **Error**: `404 Not Found` — `{"detail": "Patient not found"}`
- **Special Logic**: Setting `priorityLevel` to "Critical" auto-sets `priorityScore` to 1000

### 7.3 Static File Serving (Production)

| Route | Behavior |
|---|---|
| `/assets/*` | Serves built React JS/CSS/image assets |
| `/favicon.svg` | Serves favicon |
| `/{any_path}` | SPA catch-all — returns `index.html` |

---

## 8. USER INTERFACE REQUIREMENTS

### 8.1 Design System

| Property | Specification |
|---|---|
| **Theme** | Dark mode with glassmorphism effects |
| **Color Palette** | Blues, purples, with semantic status colors |
| **Typography** | Modern sans-serif (Inter/system stack) |
| **Border Radius** | Rounded corners (8px–16px across components) |
| **Animations** | fadeSlideUp, pulse-ring, smooth transitions (0.2s–0.4s) |
| **Card Style** | Semi-transparent backgrounds with subtle borders |

### 8.2 Priority Color Mapping

| Level | Color | Background |
|---|---|---|
| Critical | Red (#EF4444) | rgba(239,68,68, 0.1) |
| High | Orange (#F97316) | rgba(249,115,22, 0.1) |
| Medium | Yellow (#EAB308) | rgba(234,179,8, 0.1) |
| Low | Green (#22C55E) | rgba(34,197,94, 0.1) |

### 8.3 Page-Specific UI Requirements

| Page | Key UI Elements |
|---|---|
| **Admin Dashboard** | 4 KPI cards (top), Priority queue table, Edit modal |
| **Reception Desk** | 2-column layout (registration form + info panel), Emergency toggle, AI triage legend |
| **Doctor's Suite** | 2-column layout (active consultation + queue sidebar), Call/Complete buttons |
| **Patient View** | Centered search input, Token status card with gradient, Now Serving list |
| **Analytics** | 2×2 chart grid with responsive containers |

### 8.4 Responsive Design

| Viewport | Behavior |
|---|---|
| Desktop (≥1200px) | Full sidebar + multi-column layouts |
| Tablet (768px–1199px) | Collapsed sidebar, single-column fallback |
| Mobile (<768px) | Hidden sidebar, stacked layouts |

---

## 9. TECHNOLOGY STACK

### 9.1 Frontend Stack

| Technology | Version | Purpose |
|---|---|---|
| **React** | 19.2.4 | UI component library |
| **Vite** | 8.0.0 | Build tool and dev server with HMR |
| **React Router DOM** | 7.13.1 | Client-side routing |
| **Zustand** | 5.0.12 | Lightweight state management |
| **Recharts** | 3.8.0 | Data visualization (charts) |
| **Lucide React** | 0.577.0 | Icon library |
| **date-fns** | 4.1.0 | Date utility functions |
| **clsx** | 2.1.1 | Conditional CSS class composition |
| **ESLint** | 9.39.4 | Code linting |

### 9.2 Backend Stack

| Technology | Version | Purpose |
|---|---|---|
| **Python** | 3.9+ | Server-side runtime |
| **FastAPI** | Latest | REST API framework |
| **Uvicorn** | Latest | ASGI server |
| **Pydantic** | Latest | Data validation and serialization |
| **aiofiles** | Latest | Async file handling |

---

## 10. DEPENDENCIES & LIBRARIES

### 10.1 Frontend Dependencies (package.json)

**Production:**
```
clsx: ^2.1.1
date-fns: ^4.1.0
lucide-react: ^0.577.0
react: ^19.2.4
react-dom: ^19.2.4
react-router-dom: ^7.13.1
recharts: ^3.8.0
zustand: ^5.0.12
```

**Development:**
```
@eslint/js: ^9.39.4
@types/react: ^19.2.14
@types/react-dom: ^19.2.3
@vitejs/plugin-react: ^6.0.0
eslint: ^9.39.4
eslint-plugin-react-hooks: ^7.0.1
eslint-plugin-react-refresh: ^0.5.2
globals: ^17.4.0
vite: ^8.0.0
```

### 10.2 Backend Dependencies (requirements.txt)

```
fastapi
uvicorn
pydantic
aiofiles
```

---

## 11. CONSTRAINTS & ASSUMPTIONS

### 11.1 Constraints

| # | Constraint |
|---|---|
| C-01 | Data is stored in-memory; all data is lost when the backend server restarts |
| C-02 | No persistent database is used in the current version |
| C-03 | Authentication and authorization are not implemented |
| C-04 | AI triage uses rule-based keyword matching, not machine learning |
| C-05 | Only one doctor profile is demonstrated (doc-1, Dr. Sarah Jenkins) in the Doctor Dashboard |
| C-06 | CORS is wide-open for development (not production-ready) |
| C-07 | No real-time WebSocket push; relies on polling every 15 seconds |
| C-08 | Settings page is a placeholder and not functional |

### 11.2 Assumptions

| # | Assumption |
|---|---|
| A-01 | The system will be deployed on localhost or intranet (not public internet) |
| A-02 | Users access the system via modern web browsers |
| A-03 | All patient data entered via the Reception form is accurate |
| A-04 | Doctors are pre-configured and cannot be added dynamically at runtime |
| A-05 | The 15-second refresh interval is sufficient for near-real-time behavior |
| A-06 | Mock/dummy data is acceptable for the prototype demonstration |

---

## 12. GLOSSARY

| Term | Definition |
|---|---|
| **AI Triage Engine** | A rule-based algorithm that computes a priority score for each patient based on symptoms, age, visit type, and wait time |
| **Token Number** | A unique alphanumeric code assigned to each registered patient (e.g., C-001) used for queue tracking |
| **Priority Score** | A numeric value computed by the AI Triage Engine; higher scores indicate higher urgency |
| **Priority Level** | A categorical classification (Critical, High, Medium, Low) derived from the priority score |
| **Walk-in** | A patient who arrives without a prior appointment |
| **Emergency Override** | A mechanism that immediately assigns Critical priority bypassing normal scoring logic |
| **Glassmorphism** | A UI design trend using transparency, blur effects, and gradient backgrounds to create a glass-like aesthetic |
| **SPA** | Single Page Application — a web application that loads a single HTML page and dynamically updates content |
| **Zustand** | A lightweight React state management library |
| **FastAPI** | A modern Python web framework for building RESTful APIs |
| **ASGI** | Asynchronous Server Gateway Interface — a Python standard for asynchronous web servers |

---

## 13. APPENDIX

### 13.1 File Structure

```
website/
├── backend/
│   ├── main.py                    # FastAPI server + AI Engine + REST endpoints
│   ├── requirements.txt           # Python dependencies
│   └── static/                    # Built frontend assets (production)
├── src/
│   ├── App.jsx                    # Root component with routing
│   ├── main.jsx                   # React entry point
│   ├── App.css                    # Global application styles
│   ├── index.css                  # Base CSS resets
│   ├── components/
│   │   ├── Sidebar.jsx            # Navigation sidebar
│   │   ├── TopHeader.jsx          # Top header bar
│   │   └── ToastContainer.jsx     # Notification toast container
│   ├── pages/
│   │   ├── AdminDashboard.jsx     # Admin Command Center
│   │   ├── DoctorDashboard.jsx    # Doctor's Suite
│   │   ├── Reception.jsx          # Reception Desk
│   │   ├── PatientView.jsx        # Patient Portal
│   │   └── Analytics.jsx          # Analytics & Reports
│   ├── store/
│   │   ├── store.js               # Zustand store with API calls
│   │   ├── aiEngine.js            # Client-side AI triage engine
│   │   └── mockData.js            # Mock data generators
│   └── styles/
│       └── components.css         # Component-level CSS
├── index.html                     # HTML entry point
├── package.json                   # Node.js dependencies & scripts
├── vite.config.js                 # Vite build configuration
└── README.md                      # Project description
```

### 13.2 How to Run

**Frontend (Development):**
```bash
npm install
npm run dev
# Opens at http://localhost:5173
```

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
# API at http://localhost:8000
```

**Production Build:**
```bash
npm run build
# Output goes to backend/static/
# Then serve via: uvicorn backend.main:app
```

### 13.3 Future Enhancements (Out of Scope)

| Feature | Description |
|---|---|
| User Authentication | JWT-based login for all roles |
| Persistent Database | PostgreSQL/MongoDB integration |
| Real-Time Updates | WebSocket-based push notifications |
| ML-Based Triage | Machine learning model for symptom analysis |
| Appointment Scheduling | Pre-booking and slot management |
| SMS/Email Notifications | Notify patients when their turn is near |
| Multi-Hospital Support | Centralized management across branches |
| Audit Logging | Track all user actions for compliance |
| Mobile App | Native iOS/Android companion app |

---

**— End of Document —**

*MediQueue AI — Software Requirements Specification v1.0*
*Prepared on March 26, 2026*
