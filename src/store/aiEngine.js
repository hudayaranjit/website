/**
 * AI Triage Engine — Enhanced v2.0
 * Multi-factor priority scoring with symptom combinations,
 * time-decay boosting, department urgency weighting,
 * and confidence scoring.
 */

// --- Symptom Keyword Dictionaries ---
const HIGH_RISK_KEYWORDS = [
  'chest pain', 'breathing', 'bleeding', 'unconscious', 'seizure', 'severe pain',
  'stroke', 'heart attack', 'paralysis', 'nervous system changes', 'anaphylaxis', 'choking',
  'poisoning', 'suicidal', 'gunshot', 'stabbing', 'coma', 'loss of consciousness',
  'extreme fatigue', 'shortness of breath', 'difficulty breathing', 'chest pressure',
  'confusion', 'slurred speech', 'facial drooping', 'head trauma', 'severe burn',
  'coughing blood', 'vomiting blood', 'sudden weakness', 'unresponsive', 'cardiac arrest',
  'severe allergic reaction', 'overdose', 'drowning', 'electrocution', 'severe infection',
  'sepsis', 'meningitis', 'blood clot', 'pulmonary embolism', 'aortic dissection',
];

const MEDIUM_RISK_KEYWORDS = [
  'fever', 'fracture', 'headache', 'vomiting', 'dizzy', 'infection', 'swelling',
  'abdominal pain', 'burn', 'dislocation', 'laceration', 'asthma', 'dehydration',
  'allergic reaction', 'migraine', 'vision changes', 'palpitations', 'kidney stone',
  'appendicitis', 'concussion', 'extreme pain', 'blood in urine', 'fainting',
  'skin changes', 'numbness', 'tingling', 'severe diarrhea', 'wheezing',
  'chest tightness', 'high blood pressure', 'low blood sugar', 'pneumonia',
  'urinary tract infection', 'gallstones', 'pancreatitis', 'blood in stool',
];

const LOW_RISK_KEYWORDS = [
  'rash', 'checkup', 'follow-up', 'cough', 'cold', 'sore throat', 'runny nose',
  'mild pain', 'sprain', 'minor cut', 'bruise', 'toothache', 'earache',
  'back pain', 'joint pain', 'muscle ache', 'itchy', 'mild fever', 'congestion',
  'indigestion', 'heartburn', 'fatigue', 'acne', 'routine', 'prescription renewal',
  'vaccination', 'physical exam', 'dry skin', 'eye strain', 'sneezing',
];

const WHO_EPIDEMIC_KWS = [
  'covid-19', 'crimean-congo haemorrhagic fever', 'ebola', 'marburg', 'lassa fever',
  'mers-cov', 'severe acute respiratory syndrome', 'sars', 'nipah', 'henipaviral',
  'rift valley fever', 'zika', 'disease x'
];
const WHO_BACTERIAL_CRITICAL_KWS = [
  'carbapenem-resistant acinetobacter baumannii', 'carbapenem-resistant pseudomonas aeruginosa',
  'carbapenem-resistant enterobacteriaceae', 'third-generation cephalosporin-resistant enterobacteriaceae'
];
const WHO_BACTERIAL_HIGH_KWS = [
  'vancomycin-resistant enterococcus faecium', 'meticillin-resistant staphylococcus aureus',
  'mrsa', 'clarithromycin-resistant helicobacter pylori', 'fluoroquinolone-resistant campylobacter',
  'fluoroquinolone-resistant salmonellae', 'cephalosporin-resistant neisseria gonorrhoeae',
  'fluoroquinolone-resistant neisseria gonorrhoeae'
];
const WHO_BACTERIAL_MEDIUM_KWS = [
  'penicillin non-susceptible streptococcus pneumoniae', 'ampicillin-resistant haemophilus influenzae',
  'macrolide-resistant streptococcus pneumoniae', 'group a streptococci'
];
const WHO_DIAGNOSTIC_PRIORITY_KWS = [
  'hiv', 'tuberculosis', 'malaria', 'hepatitis b', 'hepatitis c', 'human papillomavirus', 'hpv', 'syphilis'
];

// --- Dangerous Symptom Combinations ---
const DANGEROUS_COMBOS = [
  { keywords: ['chest pain', 'shortness of breath'], bonus: 40, label: 'Possible cardiac event' },
  { keywords: ['chest pain', 'sweating'], bonus: 35, label: 'Possible MI indicators' },
  { keywords: ['headache', 'confusion'], bonus: 30, label: 'Possible neurological emergency' },
  { keywords: ['fever', 'stiff neck'], bonus: 35, label: 'Possible meningitis' },
  { keywords: ['abdominal pain', 'vomiting'], bonus: 15, label: 'Acute abdominal distress' },
  { keywords: ['numbness', 'slurred speech'], bonus: 40, label: 'Possible stroke symptoms' },
  { keywords: ['difficulty breathing', 'swelling'], bonus: 30, label: 'Possible anaphylaxis' },
  { keywords: ['fever', 'bleeding'], bonus: 25, label: 'Infection with hemorrhage risk' },
  { keywords: ['seizure', 'fever'], bonus: 30, label: 'Febrile seizure risk' },
  { keywords: ['vomiting', 'dehydration'], bonus: 20, label: 'Severe fluid loss risk' },
];

// --- Department Urgency Weights ---
const DEPARTMENT_URGENCY = {
  'Emergency': 15,
  'Cardiology': 8,
  'Neurology': 8,
  'Pediatrics': 5,
  'Orthopedics': 3,
  'General Medicine': 0,
  'Dermatology': 0,
};


/**
 * Main AI Priority Calculator
 */
export const calculateAIPriority = (patient) => {
  let score = 0;
  let reasons = [];
  let matchedKeywords = [];
  let confidenceFactors = 0;
  let maxConfidenceFactors = 6; // Total factors we evaluate

  // ──────────────────────────────────────
  // 1. Emergency Override
  // ──────────────────────────────────────
  if (patient.isEmergency || patient.visitType === 'emergency') {
    score += 1000;
    reasons.push('Emergency override active');
    return {
      score,
      level: 'Critical',
      explanation: reasons.join(' | '),
      confidence: 99,
    };
  }

  // ──────────────────────────────────────
  // 2. Age Factor (Vulnerable populations)
  // ──────────────────────────────────────
  if (patient.age !== undefined && patient.age !== null) {
    confidenceFactors++;
    if (patient.age < 2) {
      score += 35;
      reasons.push('Neonate/infant — highest vulnerability');
    } else if (patient.age < 5) {
      score += 30;
      reasons.push('Toddler priority');
    } else if (patient.age < 12) {
      score += 15;
      reasons.push('Pediatric patient');
    } else if (patient.age > 80) {
      score += 30;
      reasons.push('Elderly patient (80+)');
    } else if (patient.age > 65) {
      score += 25;
      reasons.push('Senior citizen priority');
    }
  }

  // ──────────────────────────────────────
  // 3. Multi-Symptom Keyword Analysis
  // ──────────────────────────────────────
  const symptomsLower = (patient.symptoms || '').toLowerCase();

  if (symptomsLower.length > 0) {
    confidenceFactors++;

    let whoMatches = [];
    let highMatches = [];
    let mediumMatches = [];
    let lowMatches = [];

    const allWhoCritical = [...WHO_EPIDEMIC_KWS, ...WHO_BACTERIAL_CRITICAL_KWS];
    allWhoCritical.forEach(kw => {
      if (symptomsLower.includes(kw)) {
        score += 100;
        if (whoMatches.length === 0) reasons.push(`WHO Critical Priority Disease/Pathogen detected: ${kw}`);
        whoMatches.push(kw);
        matchedKeywords.push(kw);
      }
    });

    const allWhoHigh = [...WHO_BACTERIAL_HIGH_KWS, ...WHO_DIAGNOSTIC_PRIORITY_KWS];
    allWhoHigh.forEach(kw => {
      if (symptomsLower.includes(kw)) {
        score += 50;
        if (whoMatches.length === 0) reasons.push(`WHO High Priority Disease/Pathogen detected: ${kw}`);
        whoMatches.push(kw);
        matchedKeywords.push(kw);
      }
    });

    WHO_BACTERIAL_MEDIUM_KWS.forEach(kw => {
      if (symptomsLower.includes(kw)) {
        score += 20;
        if (whoMatches.length === 0) reasons.push(`WHO Medium Priority Pathogen detected: ${kw}`);
        whoMatches.push(kw);
        matchedKeywords.push(kw);
      }
    });

    if (whoMatches.length > 0) {
      confidenceFactors++;
    }

    HIGH_RISK_KEYWORDS.forEach(kw => {
      if (symptomsLower.includes(kw)) {
        highMatches.push(kw);
        matchedKeywords.push(kw);
      }
    });

    MEDIUM_RISK_KEYWORDS.forEach(kw => {
      if (symptomsLower.includes(kw)) {
        mediumMatches.push(kw);
        matchedKeywords.push(kw);
      }
    });

    LOW_RISK_KEYWORDS.forEach(kw => {
      if (symptomsLower.includes(kw)) {
        lowMatches.push(kw);
        matchedKeywords.push(kw);
      }
    });

    // Score high-risk: first match = 50, additional = 15 each (compound severity)
    if (highMatches.length > 0) {
      score += 50 + (highMatches.length - 1) * 15;
      reasons.push(`High-risk: ${highMatches.slice(0, 3).join(', ')}${highMatches.length > 3 ? ` (+${highMatches.length - 3} more)` : ''}`);
      confidenceFactors++;
    }

    // Score medium-risk: first = 20, additional = 8 each
    if (mediumMatches.length > 0) {
      score += 20 + (mediumMatches.length - 1) * 8;
      if (highMatches.length === 0) {
        reasons.push(`Moderate: ${mediumMatches.slice(0, 3).join(', ')}${mediumMatches.length > 3 ? ` (+${mediumMatches.length - 3} more)` : ''}`);
      }
      confidenceFactors++;
    }

    // Score low-risk
    if (lowMatches.length > 0) {
      score += lowMatches.length * 5;
    }

    // ──────────────────────────────────────
    // 4. Dangerous Symptom Combinations
    // ──────────────────────────────────────
    DANGEROUS_COMBOS.forEach(combo => {
      const allPresent = combo.keywords.every(kw => symptomsLower.includes(kw));
      if (allPresent) {
        score += combo.bonus;
        reasons.push(`⚠ ${combo.label}`);
        confidenceFactors++;
      }
    });
  }

  // ──────────────────────────────────────
  // 5. Visit Type Factor
  // ──────────────────────────────────────
  if (patient.visitType) {
    confidenceFactors++;
    if (patient.visitType === 'follow-up') {
      score -= 10;
      reasons.push('Routine follow-up (reduced priority)');
    } else if (patient.visitType === 'new') {
      score += 5;
    }
  }

  // ──────────────────────────────────────
  // 6. Department Urgency Weighting
  // ──────────────────────────────────────
  if (patient.department) {
    const deptBoost = DEPARTMENT_URGENCY[patient.department] || 0;
    if (deptBoost > 0) {
      score += deptBoost;
      reasons.push(`${patient.department} dept urgency +${deptBoost}`);
    }
  }

  // ──────────────────────────────────────
  // 7. Time-Decay Priority Boost
  // ──────────────────────────────────────
  if (patient.arrivalTime) {
    const minutesWaited = Math.floor((new Date() - new Date(patient.arrivalTime)) / 60000);
    if (minutesWaited > 0) {
      // Progressive: 1 point per 5 min for first 30 min, then 2 points per 5 min after
      let timeScore = 0;
      if (minutesWaited <= 30) {
        timeScore = Math.floor(minutesWaited / 5);
      } else {
        timeScore = 6 + Math.floor((minutesWaited - 30) / 5) * 2;
      }
      score += timeScore;
      if (minutesWaited > 45) {
        reasons.push(`Extended wait: ${minutesWaited}min — priority escalated`);
      } else if (minutesWaited > 15) {
        reasons.push(`Wait factor: +${timeScore} (${minutesWaited}min)`);
      }
    }
  }

  // ──────────────────────────────────────
  // Default reason if empty
  // ──────────────────────────────────────
  if (reasons.length === 0) {
    reasons.push('Standard queue protocol');
  }

  // ──────────────────────────────────────
  // Determine Level
  // ──────────────────────────────────────
  let level = 'Low';
  if (score >= 1000) level = 'Critical';
  else if (score >= 60) level = 'High';
  else if (score >= 30) level = 'Medium';

  // ──────────────────────────────────────
  // Confidence Score (0–100)
  // ──────────────────────────────────────
  // Based on how many data factors we could evaluate
  const dataCompleteness = Math.min((confidenceFactors / maxConfidenceFactors) * 100, 100);
  // Keyword match confidence — more matches = higher confidence
  const keywordConfidence = matchedKeywords.length > 0 ? Math.min(matchedKeywords.length * 20, 80) : 10;
  const confidence = Math.round((dataCompleteness * 0.5) + (keywordConfidence * 0.5));

  return {
    score,
    level,
    explanation: reasons.join(' | '),
    confidence: Math.min(confidence, 99),
    matchedSymptoms: matchedKeywords.slice(0, 5),
  };
};


/**
 * Predicts the waiting time for a patient based on the doctor's queue.
 * Enhanced with variance estimation.
 */
export const calculateWaitTime = (patient, queueForDoctor, doctorAvgConsultTime, isDoctorBusy = false) => {
  if (patient.status === 'in-consultation') return 0;
  if (patient.status === 'completed' || patient.status === 'missed') return 0;

  // Find position in the sorted priority queue
  const positionIndex = queueForDoctor.findIndex(p => p.id === patient.id);
  if (positionIndex === -1) return 0;

  // Baseline: Position × Avg Consult Time
  let estimatedTime = positionIndex * doctorAvgConsultTime;

  // If doctor is busy, add remaining consultation estimate
  if (isDoctorBusy) {
    estimatedTime += Math.round(doctorAvgConsultTime * 0.7); // 70% of avg as estimate for remaining
  }

  // Adjust for follow-ups being generally faster
  if (patient.visitType === 'follow-up') {
    estimatedTime = Math.max(0, estimatedTime - 5);
  }

  // Cap minimum
  return Math.max(estimatedTime, 0);
};


/**
 * Generate AI Insights summary for analytics
 */
export const generateAIInsights = (patients, doctors) => {
  const waiting = patients.filter(p => p.status === 'waiting');
  const completed = patients.filter(p => p.status === 'completed');
  const critical = patients.filter(p => p.priorityLevel === 'Critical');

  const avgWait = waiting.length > 0
    ? Math.round(waiting.reduce((a, p) => a + (p.estimatedWaitTime || 0), 0) / waiting.length)
    : 0;

  const busiestDept = (() => {
    const deptCount = {};
    waiting.forEach(p => { deptCount[p.department] = (deptCount[p.department] || 0) + 1; });
    let max = 0, name = 'N/A';
    Object.entries(deptCount).forEach(([dept, count]) => {
      if (count > max) { max = count; name = dept; }
    });
    return { name, count: max };
  })();

  const busiestDoctor = (() => {
    const docCount = {};
    waiting.forEach(p => { docCount[p.assignedDoctorId] = (docCount[p.assignedDoctorId] || 0) + 1; });
    let max = 0, id = null;
    Object.entries(docCount).forEach(([docId, count]) => {
      if (count > max) { max = count; id = docId; }
    });
    const doc = doctors.find(d => d.id === id);
    return { name: doc?.name || 'N/A', count: max };
  })();

  const insights = [];

  if (critical.length > 0) {
    insights.push({
      type: 'critical',
      message: `${critical.length} critical patient${critical.length > 1 ? 's' : ''} require${critical.length === 1 ? 's' : ''} immediate attention`,
    });
  }

  if (avgWait > 30) {
    insights.push({
      type: 'warning',
      message: `Average wait time is ${avgWait}min — consider adding staff to ${busiestDept.name}`,
    });
  }

  if (busiestDoctor.count > 3) {
    insights.push({
      type: 'info',
      message: `${busiestDoctor.name} has ${busiestDoctor.count} patients in queue — may need load balancing`,
    });
  }

  if (completed.length > 0 && waiting.length === 0) {
    insights.push({
      type: 'success',
      message: 'All patients have been seen — queue is clear!',
    });
  }

  if (insights.length === 0) {
    insights.push({
      type: 'success',
      message: 'System operating normally — all queues within expected parameters',
    });
  }

  return {
    avgWait,
    busiestDept,
    busiestDoctor,
    insights,
    totalWaiting: waiting.length,
    totalCompleted: completed.length,
    criticalCount: critical.length,
  };
};
