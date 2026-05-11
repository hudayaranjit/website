import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';
import { calculateAIPriority, calculateWaitTime } from './aiEngine';

// Helper functions to map snake_case (Database) to camelCase (React UI)
const mapPatient = (p) => ({
  ...p,
  tokenNumber: p.token_number,
  visitType: p.visit_type,
  appointmentType: p.appointment_type,
  isEmergency: p.is_emergency,
  arrivalTime: p.arrival_time,
  assignedDoctorId: p.assigned_doctor_id,
  priorityScore: p.priority_score,
  priorityLevel: p.priority_level,
  aiExplanation: p.ai_explanation,
  estimatedWaitTime: p.estimated_wait_time,
});

const mapDoctor = (d) => ({
  ...d,
  patientsSeen: d.patients_seen,
  avgConsultTime: d.avg_consult_time,
});

export const useStore = create((set, get) => ({
  // Core State
  patients: [],
  doctors: [],
  departments: [],
  currentUserRole: null, // 'admin', 'doctor', 'reception', 'patient'
  currentUserId: null,
  notifications: [],
  subscriptionsSet: false,

  // --- Realtime Subscriptions ---
  setupRealtimeSubscriptions: () => {
    // Listen to Patients changes
    supabase
      .channel('public:patients')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'patients' }, (payload) => {
        console.log('Realtime Patient Update:', payload);
        get().refreshQueue(); // Fetch newest sorted queue
        
        if (payload.eventType === 'INSERT') {
          get().addNotification(`New patient added to queue: ${payload.new.name}`, 'info');
        } else if (payload.eventType === 'UPDATE' && payload.new.status !== payload.old.status) {
           // Notify on status change
           if (payload.new.status === 'in-consultation') {
             get().addNotification(`Token ${payload.new.token_number} is now in consultation.`, 'success');
           }
        }
      })
      .subscribe();

    // Listen to Doctors changes
    supabase
      .channel('public:doctors')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'doctors' }, (payload) => {
        console.log('Realtime Doctor Update:', payload);
        get().refreshDoctors(); // Refresh doctors
      })
      .subscribe();
  },

  // --- Initialization ---
  fetchInitialData: async () => {
    try {
      const { data: doctorsData } = await supabase.from('doctors').select('*');
      const { data: patientsData } = await supabase.from('patients').select('*').order('priority_score', { ascending: false });
      
      const departments = ['General Medicine', 'Cardiology', 'Orthopedics', 'Pediatrics', 'Dermatology', 'Neurology', 'Emergency'];
      
      const doctors = doctorsData ? doctorsData.map(mapDoctor) : [];
      set({ departments, doctors });

      // After doctors are set, we can refresh the queue to calculate wait times
      if (patientsData) {
        get().refreshQueue();
      }

      // Initialize real-time listeners once
      if (!get().subscriptionsSet) {
        get().setupRealtimeSubscriptions();
        set({ subscriptionsSet: true });
      }
    } catch (e) {
      console.error("Failed to fetch initial data", e);
    }
  },


  // --- Auth Actions ---
  login: (role, id = null) => set({ currentUserRole: role, currentUserId: id }),
  logout: () => set({ currentUserRole: null, currentUserId: null }),

  // --- Notifications ---
  addNotification: (message, type = 'info') => {
    const id = Date.now().toString();
    set((state) => ({
      notifications: [{ id, message, type, time: new Date().toISOString() }, ...state.notifications]
    }));
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      }));
    }, 5000);
  },

  // --- Queue Engine Actions ---
  refreshQueue: async () => {
    try {
      const { data: patientsData } = await supabase.from('patients').select('*').order('priority_score', { ascending: false });
      if (patientsData) {
        const doctors = get().doctors;
        const mappedPatients = patientsData.map(mapPatient);
        
        // Calculate estimated wait time for each patient based on their doctor's queue
        const updatedPatients = mappedPatients.map(p => {
          if (p.status !== 'waiting') return p;
          
          const doctor = doctors.find(d => d.id === p.assignedDoctorId);
          const doctorAvgTime = doctor?.avgConsultTime || 15; // fallback to 15m
          
          // Filter the sorted queue for this doctor and only those who are waiting
          const doctorQueue = mappedPatients.filter(dp => 
            dp.assignedDoctorId === p.assignedDoctorId && 
            dp.status === 'waiting'
          );
          
          // Check if the doctor is currently busy with a consultation
          const isBusy = mappedPatients.some(dp => 
            dp.assignedDoctorId === p.assignedDoctorId && 
            dp.status === 'in-consultation'
          );
          
          const waitTime = calculateWaitTime(p, doctorQueue, doctorAvgTime, isBusy);
          return { ...p, estimatedWaitTime: waitTime };
        });

        set({ patients: updatedPatients });
      }
    } catch(e) {
      console.error("Failed to refresh queue", e);
    }
  },


  refreshDoctors: async () => {
    try {
      const { data: doctorsData } = await supabase.from('doctors').select('*');
      if (doctorsData) {
        set({ doctors: doctorsData.map(mapDoctor) });
        // Recalculate wait times when doctors are updated (e.g. status or avg time changes)
        get().refreshQueue();
      }
    } catch(e) {
      console.error("Failed to refresh doctors", e);
    }
  },


  // Register a new patient
  addPatient: async (patientData) => {
    try {
      // Auto-assign doctor based on department if not provided
      let assignedDocId = patientData.assignedDoctorId;
      if (!assignedDocId) {
        const state = get();
        const doctorsInDept = state.doctors.filter(d => d.department === patientData.department);
        if (doctorsInDept.length > 0) {
          // simple random assignment or first available
          assignedDocId = doctorsInDept[Math.floor(Math.random() * doctorsInDept.length)].id;
        }
      }

      // Run the AI Triage Engine
      const aiResult = calculateAIPriority({
        ...patientData,
        arrivalTime: new Date().toISOString()
      });

      // Map JS camelCase back to DB snake_case
      const dbData = {
        id: `pat-${Date.now()}`,
        token_number: `T-${Math.floor(Math.random() * 1000)}`,
        name: patientData.name,
        age: patientData.age,
        gender: patientData.gender,
        phone: patientData.phone,
        symptoms: patientData.symptoms,
        visit_type: patientData.visitType || 'new',
        department: patientData.department,
        appointment_type: patientData.appointmentType || 'walk-in',
        priority_level: aiResult.level,
        priority_score: aiResult.score,
        ai_explanation: aiResult.explanation,
        status: 'waiting',
        assigned_doctor_id: assignedDocId || null
      };

      const { error } = await supabase.from('patients').insert([dbData]);
      if (error) throw error;
      
      // We do NOT need to manually call set() here because our Realtime Subscription will detect the INSERT and refresh the queue automatically!
      
    } catch(e) {
      console.error("Failed to add patient", e);
      get().addNotification("Failed to register patient.", "error");
    }
  },

  // Admin/Doctor Actions
  updatePatientStatus: async (patientId, newStatus) => {
    try {
      const { error } = await supabase.from('patients').update({ status: newStatus }).eq('id', patientId);
      if (error) throw error;
      // Realtime subscription will handle UI updates automatically
    } catch(e) {
      console.error("Failed to update status", e);
    }
  },

  updatePatientDetails: async (patientId, data) => {
    try {
      // Map UI names to DB names before updating
      const dbData = { ...data };
      if (data.assignedDoctorId) {
        dbData.assigned_doctor_id = data.assignedDoctorId;
        delete dbData.assignedDoctorId;
      }
      
      const { error } = await supabase.from('patients').update(dbData).eq('id', patientId);
      if (error) throw error;
    } catch(e) {
      console.error("Failed to update patient details", e);
    }
  },

  callNextPatient: async (doctorId) => {
    const state = get();
    const currentList = state.patients;
    
    // Complete current
    const currentInConsult = currentList.find(p => p.assignedDoctorId === doctorId && p.status === 'in-consultation');
    if (currentInConsult) {
      await get().updatePatientStatus(currentInConsult.id, 'completed');
    }

    // Call next
    const nextPatient = currentList.find(p => p.assignedDoctorId === doctorId && p.status === 'waiting');
    
    if (nextPatient) {
      await get().updatePatientStatus(nextPatient.id, 'in-consultation');
    }
  },

}));
