from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import math
import random
import os

app = FastAPI(title="MediQueue API")

# Path to the built React app
STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")

# Enable CORS (needed during dev when vite runs separately)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Models ---
class PatientBase(BaseModel):
    name: str
    age: int
    gender: str
    phone: str
    symptoms: str
    department: str
    visitType: str = "new"
    isEmergency: bool = False
    arrivalTime: str

class PatientCreate(PatientBase):
    pass

class PatientUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    symptoms: Optional[str] = None
    status: Optional[str] = None
    priorityLevel: Optional[str] = None

class Patient(PatientBase):
    id: str
    tokenNumber: str
    status: str
    assignedDoctorId: Optional[str] = None
    priorityScore: int
    priorityLevel: str
    aiExplanation: str
    estimatedWaitTime: int = 0
    appointmentType: str = "walk-in"

class Doctor(BaseModel):
    id: str
    name: str
    department: str
    status: str
    patientsSeen: int
    avgConsultTime: int

# --- Mock Data ---
DEPARTMENTS = [
    'General Medicine', 'Cardiology', 'Orthopedics', 'Pediatrics',
    'Dermatology', 'Neurology', 'Emergency'
]

DOCTORS = [
    Doctor.model_validate({'id': 'doc-1', 'name': 'Dr. Sarah Jenkins', 'department': 'Cardiology', 'status': 'active', 'patientsSeen': 14, 'avgConsultTime': 18}),
    Doctor.model_validate({'id': 'doc-2', 'name': 'Dr. Marcus Webb', 'department': 'Cardiology', 'status': 'active', 'patientsSeen': 12, 'avgConsultTime': 22}),
    Doctor.model_validate({'id': 'doc-3', 'name': 'Dr. Emily Chen', 'department': 'Pediatrics', 'status': 'active', 'patientsSeen': 20, 'avgConsultTime': 12}),
    Doctor.model_validate({'id': 'doc-4', 'name': 'Dr. Michael Scott', 'department': 'General Medicine', 'status': 'active', 'patientsSeen': 25, 'avgConsultTime': 10}),
    Doctor.model_validate({'id': 'doc-5', 'name': 'Dr. Olivia Martinez', 'department': 'General Medicine', 'status': 'active', 'patientsSeen': 22, 'avgConsultTime': 14}),
    Doctor.model_validate({'id': 'doc-6', 'name': 'Dr. James Wilson', 'department': 'Orthopedics', 'status': 'active', 'patientsSeen': 8, 'avgConsultTime': 25}),
    Doctor.model_validate({'id': 'doc-7', 'name': 'Dr. Lisa Cuddy', 'department': 'Dermatology', 'status': 'active', 'patientsSeen': 18, 'avgConsultTime': 15}),
    Doctor.model_validate({'id': 'doc-8', 'name': 'Dr. Robert Chase', 'department': 'Emergency', 'status': 'active', 'patientsSeen': 30, 'avgConsultTime': 8}),
    Doctor.model_validate({'id': 'doc-9', 'name': 'Dr. Allison Cameron', 'department': 'Neurology', 'status': 'active', 'patientsSeen': 5, 'avgConsultTime': 35}),
    Doctor.model_validate({'id': 'doc-10', 'name': 'Dr. Gregory House', 'department': 'General Medicine', 'status': 'break', 'patientsSeen': 2, 'avgConsultTime': 45}),
]

patients_db: List[Patient] = []

# AI Engine translated to Python
def calculate_ai_priority(patient: Patient) -> dict:
    score: int = 0
    reasons = []

    if patient.isEmergency or patient.visitType == 'emergency':
        score = score + 1000
        reasons.append('Emergency override active')
        return {"score": score, "level": 'Critical', "explanation": ' | '.join(reasons)}

    if patient.age < 5:
        score = score + 30
        reasons.append('Infant/Toddler priority')
    elif patient.age > 65:
        score = score + 25
        reasons.append('Senior citizen priority')

    symptoms_lower = patient.symptoms.lower()
    high_risk_kws = [
        'chest pain', 'breathing', 'bleeding', 'unconscious', 'seizure', 'severe pain',
        'stroke', 'heart attack', 'paralysis', 'nervous system changes', 'anaphylaxis', 'choking',
        'poisoning', 'suicidal', 'gunshot', 'stabbing', 'coma', 'loss of consciousness',
        'extreme fatigue', 'shortness of breath', 'difficulty breathing', 'chest pressure',
        'confusion', 'slurred speech', 'facial drooping', 'head trauma', 'severe burn',
        'coughing blood', 'vomiting blood', 'sudden weakness', 'unresponsive', 'cardiac arrest'
    ]
    med_risk_kws = [
        'fever', 'fracture', 'headache', 'vomiting', 'dizzy', 'infection', 'swelling',
        'abdominal pain', 'burn', 'dislocation', 'laceration', 'asthma', 'dehydration',
        'allergic reaction', 'migraine', 'vision changes', 'palpitations', 'kidney stone',
        'appendicitis', 'concussion', 'extreme pain', 'blood in urine', 'fainting',
        'skin changes', 'numbness', 'tingling', 'severe diarrhea', 'wheezing'
    ]
    low_risk_kws = [
        'rash', 'checkup', 'follow-up', 'cough', 'cold', 'sore throat', 'runny nose',
        'mild pain', 'sprain', 'minor cut', 'bruise', 'toothache', 'earache',
        'back pain', 'joint pain', 'muscle ache', 'itchy', 'mild fever', 'congestion',
        'indigestion', 'heartburn', 'fatigue', 'acne', 'routine', 'prescription renewal'
    ]

    matched_high = False
    matched_med = False

    for kw in high_risk_kws:
        if kw in symptoms_lower:
            score = score + 50  # type: ignore
            if not matched_high:
                reasons.append(f'High-risk symptom detected: {kw}')
                matched_high = True

    if not matched_high:
        for kw in med_risk_kws:
            if kw in symptoms_lower:
                score = score + 20  # type: ignore
                if not matched_med:
                    reasons.append(f'Moderate symptom detected: {kw}')
                    matched_med = True

    if not matched_high and not matched_med:
        for kw in low_risk_kws:
            if kw in symptoms_lower:
                score = score + 5  # type: ignore

    if patient.visitType == 'follow-up':
        score = score - 10  # type: ignore
        reasons.append('Routine follow-up')

    try:
        arrival_dt = datetime.fromisoformat(patient.arrivalTime.replace('Z', '+00:00'))
        minutes_waited = math.floor((datetime.now().astimezone() - arrival_dt).total_seconds() / 60)
        if minutes_waited > 0:
            time_score = math.floor(minutes_waited / 5)
            score = score + time_score  # type: ignore
            if time_score > 10:
                reasons.append('Extended wait time adjusted')
    except:
        pass

    if not reasons:
        reasons.append('Standard queue protocol')

    level = 'Low'
    if score >= 1000: level = 'Critical'  # type: ignore
    elif score >= 60: level = 'High'  # type: ignore
    elif score >= 30: level = 'Medium'  # type: ignore

    return {"score": score, "level": level, "explanation": ' | '.join(reasons)}

def calculate_wait_time(patient: Patient, queue_for_doctor: List[Patient], avg_consult_time: int) -> int:
    if patient.status in ['in-consultation', 'completed', 'missed']: return 0
    try:
        idx = [p.id for p in queue_for_doctor].index(patient.id)
        est = idx * avg_consult_time
        if patient.visitType == 'follow-up':
            est = max(0, est - 5)
        return max(est, 0)
    except ValueError:
        return 0

def sort_queue(patients: List[Patient]) -> List[Patient]:
    def sort_key(p: Patient):
        is_critical = 1 if p.priorityLevel == 'Critical' else 0
        try:
            arrival = datetime.fromisoformat(p.arrivalTime.replace('Z', '+00:00')).timestamp()
        except:
            arrival = datetime.now().timestamp()
        # sort by critical first(desc), then score(desc), then arrival(asc, so negative desc)
        return (is_critical, p.priorityScore, -arrival)
    
    return sorted(patients, key=sort_key, reverse=True)

def refresh_queue_state():
    global patients_db
    for p in patients_db:
        if p.status == 'waiting':
            triage = calculate_ai_priority(p)
            p.priorityScore = triage['score']
            p.priorityLevel = triage['level']
            p.aiExplanation = triage['explanation']
    
    patients_db = sort_queue(patients_db)
    
    for p in patients_db:
        if p.status == 'waiting':
            doc = next((d for d in DOCTORS if d.id == p.assignedDoctorId), None)
            if doc:
                doc_q = [dp for dp in patients_db if dp.assignedDoctorId == doc.id and dp.status == 'waiting']
                p.estimatedWaitTime = calculate_wait_time(p, doc_q, doc.avgConsultTime)

# INITIAL MOCK DATA PORT
def init_mock_patients():
    def get_time(h_start):
        import time
        t = time.time() - (h_start * 3600)
        return datetime.fromtimestamp(t).isoformat() + "Z"

    mocks = [
        {"id": "pat-1001", "name": "John Doe", "age": 45, "gender": "Male", "department": "Cardiology", "status": "waiting", "assignedDoctorId": "doc-1", "symptoms": "Mild chest pain", "phone":"555", "arrivalTime": get_time(1), "tokenNumber": "C-001"}
    ]
    for m in mocks:
        p_data = {**m, "visitType": "new", "isEmergency": False, "priorityScore": 0, "priorityLevel": "Low", "aiExplanation": ""}
        p = Patient.model_validate(p_data)
        tr = calculate_ai_priority(p)
        p.priorityScore = tr['score']
        p.priorityLevel = tr['level']
        p.aiExplanation = tr['explanation']
        patients_db.append(p)
    refresh_queue_state()

init_mock_patients()

# --- Endpoints ---
@app.get("/api/departments")
def get_departments():
    return DEPARTMENTS

@app.get("/api/doctors")
def get_doctors():
    return DOCTORS

@app.get("/api/patients")
def get_patients():
    refresh_queue_state()
    return patients_db

@app.post("/api/patients", response_model=Patient)
def create_patient(patient_in: PatientCreate):
    new_id = f"pat-{int(datetime.now().timestamp()*1000)}"
    dept_prefix = patient_in.department[0].upper()
    token_number = f"{dept_prefix}-{random.randint(100, 999)}"
    
    p_dict = patient_in.dict()
    p_dict.update({
        "id": new_id,
        "tokenNumber": token_number,
        "status": "waiting",
        "priorityScore": 0,
        "priorityLevel": "Low",
        "aiExplanation": "",
        "estimatedWaitTime": 0
    })
    p = Patient.model_validate(p_dict)
    
    # Assign a random doctor for that department
    docs_in_dept = [d for d in DOCTORS if d.department == p.department]
    if docs_in_dept:
        p.assignedDoctorId = random.choice(docs_in_dept).id
        
    triage = calculate_ai_priority(p)
    p.priorityScore = triage['score']
    p.priorityLevel = triage['level']
    p.aiExplanation = triage['explanation']
    
    patients_db.append(p)
    refresh_queue_state()
    return p

@app.put("/api/patients/{patient_id}", response_model=Patient)
def update_patient(patient_id: str, update_data: PatientUpdate):
    for p in patients_db:
        if p.id == patient_id:
            update_dict = update_data.dict(exclude_unset=True)
            for k, v in update_dict.items():
                setattr(p, k, v)
            if update_data.priorityLevel == 'Critical':
                p.priorityScore = 1000
            refresh_queue_state()
            return p
    raise HTTPException(status_code=404, detail="Patient not found")


# ── Serve React SPA ──────────────────────────────────────────────────────────
# Mount the built React assets (JS, CSS, images) AFTER API routes
if os.path.isdir(STATIC_DIR):
    app.mount("/assets", StaticFiles(directory=os.path.join(STATIC_DIR, "assets")), name="assets")

    @app.get("/favicon.svg")
    def favicon():
        return FileResponse(os.path.join(STATIC_DIR, "favicon.svg"))

    # SPA catch-all: any route not matched above returns index.html
    @app.get("/{full_path:path}")
    def serve_spa(full_path: str):
        index = os.path.join(STATIC_DIR, "index.html")
        if os.path.isfile(index):
            return FileResponse(index)
        return {"error": "Frontend not built yet. Run: npm run build"}
else:
    @app.get("/")
    def root():
        return {"message": "MediQueue API running. Build the frontend with: npm run build"}
