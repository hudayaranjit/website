/**
 * AI Triage Engine Simulator
 * Computes a priority score based on multiple factors.
 * Higher score = Higher priority.
 */

export const calculateAIPriority = (patient) => {
  let score = 0;
  let reasons = [];

  // 1. Emergency Override
  if (patient.isEmergency || patient.visitType === 'emergency') {
    score += 1000;
    reasons.push('Emergency override active');
    return {
      score,
      level: 'Critical',
      explanation: reasons.join(' | ')
    };
  }

  // 2. Age Factor (Vulnerable populations get higher priority)
  if (patient.age < 5) {
    score += 30;
    reasons.push('Infant/Toddler priority');
  } else if (patient.age > 65) {
    score += 25;
    reasons.push('Senior citizen priority');
  }

  // 3. Symptom Keyword Matching (Very basic NLP simulation)
  const symptomsLower = patient.symptoms.toLowerCase();
  
  const highRiskKeywords = [
    'chest pain', 'breathing', 'bleeding', 'unconscious', 'seizure', 'severe pain',
    'stroke', 'heart attack', 'paralysis', 'nervous system changes', 'anaphylaxis', 'choking',
    'poisoning', 'suicidal', 'gunshot', 'stabbing', 'coma', 'loss of consciousness',
    'extreme fatigue', 'shortness of breath', 'difficulty breathing', 'chest pressure',
    'confusion', 'slurred speech', 'facial drooping', 'head trauma', 'severe burn',
    'coughing blood', 'vomiting blood', 'sudden weakness', 'unresponsive', 'cardiac arrest'
  ];
  const mediumRiskKeywords = [
    'fever', 'fracture', 'headache', 'vomiting', 'dizzy', 'infection', 'swelling',
    'abdominal pain', 'burn', 'dislocation', 'laceration', 'asthma', 'dehydration',
    'allergic reaction', 'migraine', 'vision changes', 'palpitations', 'kidney stone',
    'appendicitis', 'concussion', 'extreme pain', 'blood in urine', 'fainting',
    'skin changes', 'numbness', 'tingling', 'severe diarrhea', 'wheezing'
  ];
  const lowRiskKeywords = [
    'rash', 'checkup', 'follow-up', 'cough', 'cold', 'sore throat', 'runny nose',
    'mild pain', 'sprain', 'minor cut', 'bruise', 'toothache', 'earache',
    'back pain', 'joint pain', 'muscle ache', 'itchy', 'mild fever', 'congestion',
    'indigestion', 'heartburn', 'fatigue', 'acne', 'routine', 'prescription renewal'
  ];

  let matchedHigh = false;
  let matchedMedium = false;

  highRiskKeywords.forEach(kw => {
    if (symptomsLower.includes(kw)) {
      score += 50;
      if(!matchedHigh) { reasons.push(`High-risk symptom detected: ${kw}`); matchedHigh = true; }
    }
  });

  if(!matchedHigh) {
    mediumRiskKeywords.forEach(kw => {
      if (symptomsLower.includes(kw)) {
        score += 20;
        if(!matchedMedium) { reasons.push(`Moderate symptom detected: ${kw}`); matchedMedium = true; }
      }
    });
  }

  if(!matchedHigh && !matchedMedium) {
    lowRiskKeywords.forEach(kw => {
      if (symptomsLower.includes(kw)) {
        score += 5;
      }
    });
  }

  // 4. Visit Type
  if (patient.visitType === 'follow-up') {
    // Follow-ups are generally lower priority but faster
    score -= 10;
    reasons.push('Routine follow-up');
  }

  // 5. Time Waiting (Wait Factor)
  // Give 1 point for every 5 minutes waited
  const minutesWaited = Math.floor((new Date() - new Date(patient.arrivalTime)) / 60000);
  if (minutesWaited > 0) {
    const timeScore = Math.floor(minutesWaited / 5);
    score += timeScore;
    if (timeScore > 10) {
      reasons.push('Extended wait time adjusted');
    }
  }

  // Default reason if empty
  if (reasons.length === 0) {
    reasons.push('Standard queue protocol');
  }

  // Determine Level
  let level = 'Low';
  if (score >= 1000) level = 'Critical';
  else if (score >= 60) level = 'High';
  else if (score >= 30) level = 'Medium';

  return {
    score,
    level,
    explanation: reasons.join(' | ')
  };
};

/**
 * Predicts the waiting time for a patient based on the doctor's queue.
 */
export const calculateWaitTime = (patient, queueForDoctor, doctorAvgConsultTime) => {
  if (patient.status === 'in-consultation') return 0;
  if (patient.status === 'completed' || patient.status === 'missed') return 0;

  // Find how many patients are ahead of this patient in the *sorted* priority queue
  const positionIndex = queueForDoctor.findIndex(p => p.id === patient.id);
  
  if (positionIndex === -1) return 0; // Not in queue yet
  
  // Baseline: Position * Avg Consult Time
  let estimatedTime = positionIndex * doctorAvgConsultTime;

  // Adjust for follow-ups being generally faster
  if (patient.visitType === 'follow-up') {
      estimatedTime = Math.max(0, estimatedTime - 5);
  }

  // Cap minimum to avoid weird numbers
  return Math.max(estimatedTime, 0);
};
