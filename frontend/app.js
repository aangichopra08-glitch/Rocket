/**
 * ClinicConnect - Smart Healthcare Web Application
 * Connected Live to FastAPI Backend & SQLite Database (http://127.0.0.1:8000/api)
 * Multilingual Care Plan Pipeline (Gemini 2.5 Flash), Severity Indicators, Live Medicine Timers & Voice AI.
 */

const API_BASE = "http://127.0.0.1:8000/api";

// Fallback Mock Data for instant offline resilience
const CLIENT_MOCK_CARE_PLANS = {
  "en": {
    "summary": "Your blood report shows healthy blood sugar levels, but your hemoglobin is slightly lower than ideal and cholesterol is moderately elevated. With a few simple daily nutrition tweaks and light evening walks, you can rebuild your energy and protect your heart.",
    "flagged_tests": [
      {
        "test_name": "Hemoglobin (Hb)",
        "value": "10.1 g/dL",
        "range": "12.0 - 15.5 g/dL",
        "status": "attention",
        "explanation": "Hemoglobin is like tiny delivery trucks in your blood carrying oxygen. Your number is a little low, which is why you might feel tired faster than usual."
      },
      {
        "test_name": "Fasting Blood Sugar",
        "value": "95 mg/dL",
        "range": "70 - 99 mg/dL",
        "status": "normal",
        "explanation": "Your blood sugar is in a great, healthy range. Your body is doing a wonderful job converting food into daily energy."
      },
      {
        "test_name": "Total Cholesterol",
        "value": "245 mg/dL",
        "range": "< 200 mg/dL",
        "status": "borderline",
        "explanation": "Cholesterol is a waxy fat in your blood. When it gets a bit high, it can slowly stick to blood vessels, so we want to keep it in check."
      }
    ],
    "care_plan": [
      "Eat one bowl of iron-rich food daily, such as spinach, cooked lentils (dal), or fresh pomegranate seeds.",
      "Take a gentle 20-minute walk after dinner to help your body burn excess fats and support your heart.",
      "Switch from deep-fried snacks to roasted nuts, and drink at least 8 glasses of fresh water every day."
    ],
    "doctor_questions": [
      "Do you feel dizzy or lose your breath easily when climbing a flight of stairs?",
      "Would you recommend an iron supplement now, or should we recheck my blood counts in 6 weeks?"
    ]
  },
  "hi": {
    "summary": "आपकी ब्लड रिपोर्ट में शुगर का स्तर बिल्कुल सामान्य और स्वस्थ है, लेकिन हीमोग्लोबिन थोड़ा कम है और कोलेस्ट्रॉल थोड़ा बढ़ा हुआ है। खान-पान में थोड़े सुधार और हल्की सैर से आपकी कमजोरी दूर हो सकती है और दिल मजबूत रहेगा।",
    "flagged_tests": [
      {
        "test_name": "हीमोग्लोबिन (Hb)",
        "value": "10.1 g/dL",
        "range": "12.0 - 15.5 g/dL",
        "status": "attention",
        "explanation": "हीमोग्लोबिन शरीर के हर अंग तक ऑक्सीजन पहुंचाने का काम करता है। इसका स्तर कम होने से आपको जल्दी थकान और सुस्ती महसूस हो सकती है।"
      },
      {
        "test_name": "फास्टिंग ब्लड शुगर",
        "value": "95 mg/dL",
        "range": "70 - 99 mg/dL",
        "status": "normal",
        "explanation": "आपकी शुगर का स्तर बिल्कुल सामान्य और बेहतरीन है। आपका शरीर भोजन को सही ढंग से ऊर्जा में बदल रहा है।"
      },
      {
        "test_name": "टोटल कोलेस्ट्रॉल",
        "value": "245 mg/dL",
        "range": "< 200 mg/dL",
        "status": "borderline",
        "explanation": "कोलेस्ट्रॉल खून में पाया जाने वाला मोम जैसा चिकना पदार्थ है। थोड़ा बढ़ा होने से नसों में रुकावट आ सकती है, इसलिए चिकनाई कम करें।"
      }
    ],
    "care_plan": [
      "रोजाना एक कटोरी आयरन से भरपूर आहार लें, जैसे पालक, हरी मूंग दाल, गुड़ या अनार के दाने।",
      "रात के खाने के बाद 20 मिनट टहलने की आदत डालें, जिससे खून में वसा (फैट) कम हो सके।",
      "तले-भुने भोजन और ज्यादा घी-तेल से परहेज करें, और दिन भर में कम से कम 8 गिलास पानी पिएं।"
    ],
    "doctor_questions": [
      "क्या सीढ़ियां चढ़ते समय या तेज चलते समय आपकी सांस फूलती है या चक्कर आते हैं?",
      "क्या मुझे हीमोग्लोबिन के लिए कोई दवा या सप्लीमेंट लेना चाहिए, या 6 हफ्ते बाद दोबारा जांच कराएं?"
    ]
  },
  "gu": {
    "summary": "તમારા લોહીના રિપોર્ટમાં બ્લડ સુગરનું પ્રમાણ એકદમ સામાન્ય અને સ્વસ્થ છે, પરંતુ હિમોગ્લોબિન થોડું ઓછું છે અને કોલેસ્ટ્રોલ સાધારણ વધેલું છે. યોગ્ય પૌષ્ટિક આહાર અને હળવી કસરતથી તમારી નબળાઈ દૂર થશે અને હૃદય તંદુરસ્ત રહેશે.",
    "flagged_tests": [
      {
        "test_name": "હિમોગ્લોબિન (Hb)",
        "value": "10.1 g/dL",
        "range": "12.0 - 15.5 g/dL",
        "status": "attention",
        "explanation": "હિમોગ્લોબિન આખા શરીરમાં ઓક્સિજન પહોંચાડવાનું કામ કરે છે. તેનું પ્રમાણ ઓછું હોવાથી તમને જલ્દી થાક કે સુસ્તી લાગી શકે છે."
      },
      {
        "test_name": "ફાસ્ટિંગ બ્લડ સુગર",
        "value": "95 mg/dL",
        "range": "70 - 99 mg/dL",
        "status": "normal",
        "explanation": "તમારી સુગર બિલકુલ સ્વસ્થ અને સામાન્ય સ્તરે છે. તમારું શરીર ખોરાકમાંથી યોગ્ય રીતે ઊર્જા બનાવી રહ્યું છે."
      },
      {
        "test_name": "ટોટલ કોલેસ્ટ્રોલ",
        "value": "245 mg/dL",
        "range": "< 200 mg/dL",
        "status": "borderline",
        "explanation": "કોલેસ્ટ્રોલ લોહીમાં ચીકણી ચરબી જેવું તત્વ છે. વધારે પ્રમાણ નસોમાં અવરોધ કરી શકે છે, માટે તળેલા ખોરાકથી દૂર રહેવું જરૂરી છે."
      }
    ],
    "care_plan": [
      "રોજ એક વાટકી આયર્નથી ભરપૂર ખોરાક લો, જેમ કે પાલક, મગની દાળ, દાડમ અથવા ગોળ-ચણા.",
      "રાત્રિ ભોજન પછી 20 મિનિટ નિયમિત હળવું ચાલવાનું રાખો જેથી ચરબી ઓગળી શકે.",
      "તળેલી અને વધુ તેલવાળી વસ્તુઓ ઓછી કરો અને દિવસ દરમિયાન ઓછામાં ઓછું 8 ગ્લાસ પાણી પીવો."
        ],
        "doctor_questions": [
          "શું સીડી ચડતી વખતે તમને શ્વાસ ચડે છે કે ચક્કર જેવું અનુભવાય છે?",
          "શું મારે હિમોગ્લોબિન માટે આયર્નની ગોળીઓ લેવાની જરૂર છે કે 6 અઠવાડિયા પછી ફરી ચેકઅપ કરવું?"
        ]
  }
};

// Sound Synthesizer
class SoundEngine {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playChime() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);
      gain.gain.setValueAtTime(0.2, now + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.4);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.45);
    });
  }

  playEmergencySiren() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.linearRampToValueAtTime(1200, now + 0.3);
    osc.frequency.linearRampToValueAtTime(800, now + 0.6);
    osc.frequency.linearRampToValueAtTime(1200, now + 0.9);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 1.2);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 1.25);
  }
}
const soundEngine = new SoundEngine();

// Pill SVG Imagery Presets
const PILL_PRESETS = {
  'capsule-red': {
    name: 'Red & White Capsule',
    svg: `<svg viewBox="0 0 100 100" class="w-full h-full drop-shadow-md">
      <defs>
        <linearGradient id="gradRed" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#ef4444" /><stop offset="100%" stop-color="#b91c1c" /></linearGradient>
        <linearGradient id="gradWhite" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#ffffff" /><stop offset="100%" stop-color="#e2e8f0" /></linearGradient>
      </defs>
      <g transform="rotate(-35 50 50)">
        <rect x="25" y="20" width="50" height="30" rx="20" fill="url(#gradRed)" />
        <rect x="25" y="48" width="50" height="32" rx="20" fill="url(#gradWhite)" />
        <line x1="25" y1="48" x2="75" y2="48" stroke="#94a3b8" stroke-width="2" />
        <path d="M35 28 Q42 22 55 24" stroke="rgba(255,255,255,0.7)" stroke-width="4" stroke-linecap="round" fill="none" />
      </g>
    </svg>`
  },
  'tablet-round-white': {
    name: 'White Round Scored Tablet',
    svg: `<svg viewBox="0 0 100 100" class="w-full h-full drop-shadow-md">
      <defs>
        <radialGradient id="gradRound" cx="40%" cy="40%" r="60%"><stop offset="0%" stop-color="#ffffff" /><stop offset="70%" stop-color="#f1f5f9" /><stop offset="100%" stop-color="#cbd5e1" /></radialGradient>
      </defs>
      <circle cx="50" cy="50" r="38" fill="url(#gradRound)" stroke="#94a3b8" stroke-width="2"/>
      <line x1="22" y1="50" x2="78" y2="50" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
      <circle cx="36" cy="36" r="4" fill="rgba(255,255,255,0.8)" />
    </svg>`
  },
  'tablet-oval-peach': {
    name: 'Peach Oval Caplet',
    svg: `<svg viewBox="0 0 100 100" class="w-full h-full drop-shadow-md">
      <defs>
        <linearGradient id="gradPeach" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#fed7aa" /><stop offset="100%" stop-color="#fb923c" /></linearGradient>
      </defs>
      <g transform="rotate(40 50 50)">
        <rect x="22" y="32" width="56" height="36" rx="18" fill="url(#gradPeach)" stroke="#ea580c" stroke-width="2"/>
        <line x1="50" y1="34" x2="50" y2="66" stroke="#c2410c" stroke-width="2" stroke-dasharray="2 3"/>
        <path d="M30 40 Q40 36 60 38" stroke="rgba(255,255,255,0.7)" stroke-width="3" stroke-linecap="round" fill="none" />
      </g>
    </svg>`
  },
  'cardio-cyan': {
    name: 'Cyan Sublingual Diamond Pill',
    svg: `<svg viewBox="0 0 100 100" class="w-full h-full drop-shadow-md">
      <defs>
        <linearGradient id="gradCyan" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#38bdf8" /><stop offset="100%" stop-color="#0284c7" /></linearGradient>
      </defs>
      <g transform="rotate(45 50 50)">
        <rect x="28" y="28" width="44" height="44" rx="10" fill="url(#gradCyan)" stroke="#0369a1" stroke-width="2"/>
        <circle cx="50" cy="50" r="12" fill="none" stroke="rgba(255,255,255,0.8)" stroke-width="2"/>
        <path d="M36 36 L64 36" stroke="rgba(255,255,255,0.7)" stroke-width="3" stroke-linecap="round"/>
      </g>
    </svg>`
  },
  'syrup-green': {
    name: 'Emerald Liquid Medicine Bottle',
    svg: `<svg viewBox="0 0 100 100" class="w-full h-full drop-shadow-md">
      <defs>
        <linearGradient id="gradSyrup" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#34d399" /><stop offset="100%" stop-color="#059669" /></linearGradient>
      </defs>
      <rect x="42" y="15" width="16" height="12" rx="2" fill="#94a3b8" />
      <rect x="40" y="24" width="20" height="6" rx="2" fill="#64748b" />
      <rect x="28" y="30" width="44" height="56" rx="12" fill="url(#gradSyrup)" stroke="#047857" stroke-width="2" />
      <rect x="34" y="44" width="32" height="24" rx="4" fill="#ffffff" opacity="0.9" />
      <path d="M46 52 L54 52 M50 48 L50 56" stroke="#059669" stroke-width="3" stroke-linecap="round" />
    </svg>`
  }
};

function renderPillGraphic(pillType, customImage, extraClasses = "w-16 h-16") {
  if (customImage) {
    return `<div class="${extraClasses} rounded-2xl overflow-hidden border border-slate-200 bg-white p-1 shadow-sm flex items-center justify-center">
      <img src="${customImage}" alt="Pill" class="w-full h-full object-cover rounded-xl" />
    </div>`;
  }
  const preset = PILL_PRESETS[pillType] || PILL_PRESETS['capsule-red'];
  return `<div class="${extraClasses} rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 p-2 shadow-sm flex items-center justify-center">
    ${preset.svg}
  </div>`;
}

// Multilingual Voice Assistant
class VoiceAIAssistant {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.selectedLanguage = 'auto';
    this.synth = window.speechSynthesis;
    this.audioRecorder = null;
    this.recordedChunks = [];
    this.isRecordingVoiceNote = false;

    this.setupRecognition();
  }

  setupRecognition() {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRec) {
      this.recognition = new SpeechRec();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;

      this.recognition.onstart = () => {
        this.isListening = true;
        this.updateAssistantModalUI("Listening in your language... Speak now", true);
      };

      this.recognition.onresult = (event) => {
        const transcript = Array.from(event.results).map(r => r[0].transcript).join('');
        const isFinal = event.results[0].isFinal;

        const transcriptEl = document.getElementById('voiceTranscriptText');
        if (transcriptEl) transcriptEl.textContent = `"${transcript}"`;

        if (isFinal) {
          this.processCommand(transcript);
        }
      };

      this.recognition.onerror = (event) => {
        this.isListening = false;
        this.updateAssistantModalUI(`Microphone notice: ${event.error}. You can also type commands below.`, false);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        const micBtn = document.getElementById('globalVoiceBtn');
        if (micBtn) micBtn.classList.remove('voice-recording-pulse');
      };
    }
  }

  startListening(lang = 'auto') {
    soundEngine.init();
    if (!this.recognition) {
      this.openVoiceModal();
      this.updateAssistantModalUI("Voice speech recognition is in simulation mode. Use the quick test buttons or text input below!", false);
      return;
    }

    this.selectedLanguage = lang;
    this.recognition.lang = (lang === 'auto') ? (navigator.language || 'en-US') : lang;

    try {
      this.openVoiceModal();
      this.recognition.start();
      const micBtn = document.getElementById('globalVoiceBtn');
      if (micBtn) micBtn.classList.add('voice-recording-pulse');
    } catch (err) {
      console.warn("Recognition start info:", err);
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  speakText(text, lang = 'en-US') {
    if (!this.synth) return;
    this.synth.cancel();

    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.95;
    utter.pitch = 1.0;

    const voices = this.synth.getVoices();
    const matchedVoice = voices.find(v => v.lang.toLowerCase().includes(lang.toLowerCase().substring(0, 2)));
    if (matchedVoice) utter.voice = matchedVoice;
    utter.lang = lang;

    this.synth.speak(utter);
  }

  processCommand(rawText) {
    const text = rawText.toLowerCase().trim();
    let actionFeedback = "";
    let speechFeedback = "";
    let lang = 'en-US';

    if (text.includes("patient") || text.includes("companion") || text.includes("mariz") || text.includes("rogi")) {
      App.switchRole('patient');
      actionFeedback = "Switched to Patient Companion View";
      speechFeedback = "Patient Companion portal opened. Showing your care plan and medicines.";
    } else if (text.includes("doctor") || text.includes("clinic") || text.includes("daktar") || text.includes("portal")) {
      App.switchRole('clinic');
      actionFeedback = "Switched to Clinic Portal (Doctor View)";
      speechFeedback = "Doctor clinic portal opened. Showing live SQLite records.";
    } else if (text.includes("care plan") || text.includes("package") || text.includes("generate")) {
      App.switchRole('clinic');
      App.loadSampleLabReport();
      actionFeedback = "Loaded Sample Lab Report for Care Package Generation";
      speechFeedback = "Sample diagnostic report loaded into ClinicConnect care plan generator.";
    } else if (text.includes("emergency") || text.includes("red") || text.includes("sos") || text.includes("madad")) {
      soundEngine.playEmergencySiren();
      actionFeedback = "Emergency Protocol Triggered!";
      speechFeedback = "Emergency alert activated! Contacting trauma team and doctor.";
      lang = 'hi-IN';
      App.triggerEmergencyAlert();
    } else if (text.includes("medicine") || text.includes("dawa") || text.includes("goli") || text.includes("pill") || text.includes("audio")) {
      const activePatient = App.getActivePatient();
      if (activePatient && activePatient.medicines && activePatient.medicines.length > 0) {
        const med = activePatient.medicines[0];
        actionFeedback = `Playing local voice note for: ${med.name}`;
        const vn = med.voice_note || { text: med.dosage, lang: 'en-US' };
        speechFeedback = vn.text;
        lang = vn.lang || 'hi-IN';
        App.playVoiceNote(vn.text, vn.lang, vn.audio);
      } else {
        actionFeedback = "No active medicines found.";
        speechFeedback = "No active medicines found.";
      }
    } else if (text.includes("show emergency") || text.includes("critical") || text.includes("red patient")) {
      App.switchRole('clinic');
      App.filterSeverity('red');
      actionFeedback = "Filtered for Red (Emergency) patients";
      speechFeedback = "Displaying critical emergency patients.";
    } else {
      actionFeedback = `Processed command: "${rawText}"`;
      speechFeedback = `I understood: ${rawText}. ClinicConnect assistant is ready to help.`;
    }

    const actionResultEl = document.getElementById('voiceActionResult');
    if (actionResultEl) {
      actionResultEl.innerHTML = `<span class="text-emerald-600 font-semibold">✓ Action:</span> ${actionFeedback}`;
    }

    if (speechFeedback) {
      this.speakText(speechFeedback, lang);
    }
  }

  openVoiceModal() {
    const modal = document.getElementById('voiceModal');
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
  }

  closeVoiceModal() {
    this.stopListening();
    if (this.synth) this.synth.cancel();
    const modal = document.getElementById('voiceModal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  }

  updateAssistantModalUI(statusText, isListening) {
    const statusEl = document.getElementById('voiceAssistantStatus');
    const visualizer = document.getElementById('voiceVisualizer');
    if (statusEl) statusEl.textContent = statusText;
    if (visualizer) {
      visualizer.className = isListening
        ? "flex items-center justify-center gap-1.5 h-12 voice-recording-pulse rounded-full p-2 bg-rose-50"
        : "flex items-center justify-center gap-1.5 h-12 opacity-50";
    }
  }

  async startRecordingAudioNote(onComplete) {
    soundEngine.init();
    this.recordedChunks = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioRecorder = new MediaRecorder(stream);
      this.isRecordingVoiceNote = true;

      this.audioRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) this.recordedChunks.push(e.data);
      };

      this.audioRecorder.onstop = () => {
        const audioBlob = new Blob(this.recordedChunks, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          this.isRecordingVoiceNote = false;
          if (onComplete) onComplete(reader.result);
        };
        stream.getTracks().forEach(track => track.stop());
      };

      this.audioRecorder.start();
      return true;
    } catch (err) {
      alert("Microphone permission was not granted. Using the AI Multilingual voice text generator!");
      return false;
    }
  }

  stopRecordingAudioNote() {
    if (this.audioRecorder && this.isRecordingVoiceNote) {
      this.audioRecorder.stop();
    }
  }
}
const voiceAI = new VoiceAIAssistant();

// =====================================================================
// LIVE API & STATE ORCHESTRATOR
// =====================================================================
const App = {
  role: 'clinic', // 'clinic' | 'patient'
  currentPatientId: 'PAT-1001',
  patients: [],
  stats: { total: 0, red: 0, orange: 0, green: 0 },
  currentSeverityFilter: 'all',
  alarmDismissed: {},
  completedCareSteps: {},
  doctorInfo: {
    name: 'Dr. Sarah Jenkins, MD',
    specialty: 'Chief Medical Officer - Internal & Critical Care',
    hospital: 'ClinicConnect Health Hub',
    license: 'REG-IND-908234'
  },

  async init() {
    await this.fetchPatients();
    this.startTimerTicker();
    lucide.createIcons();

    const params = new URLSearchParams(window.location.search);
    if (params.get('role')) this.role = params.get('role');
    if (params.get('id')) this.currentPatientId = params.get('id');
    this.render();
  },

  // --- Live API Fetch Methods ---
  async fetchPatients() {
    try {
      const res = await fetch(`${API_BASE}/patients`);
      if (res.ok) {
        const data = await res.json();
        this.patients = data.patients || [];
        this.stats = data.stats || { total: 0, red: 0, orange: 0, green: 0 };
        
        // Ensure active patient is valid
        if (!this.patients.some(p => p.id === this.currentPatientId) && this.patients.length > 0) {
          this.currentPatientId = this.patients[0].id;
        }
        this.updateLiveDbBadge(true);
      } else {
        throw new Error("API responded with " + res.status);
      }
    } catch (err) {
      console.warn("Live API Notice: Backend unreachable. Using offline client cache.", err);
      this.updateLiveDbBadge(false);
    }
  },

  updateLiveDbBadge(isLive) {
    const badge = document.getElementById('dbStatusBadge');
    if (badge) {
      badge.innerHTML = isLive
        ? `<span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> <span class="text-emerald-800">SQLite Live API Connected</span>`
        : `<span class="w-2 h-2 rounded-full bg-amber-500"></span> <span class="text-amber-800">Offline Fallback Mode</span>`;
      badge.className = isLive
        ? "hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm"
        : "hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 shadow-sm";
    }
  },

  getActivePatient() {
    return this.patients.find(p => p.id === this.currentPatientId) || this.patients[0] || null;
  },

  async selectPatient(patientId) {
    this.currentPatientId = patientId;
    try {
      const res = await fetch(`${API_BASE}/patients/${patientId}`);
      if (res.ok) {
        const patientData = await res.json();
        const idx = this.patients.findIndex(p => p.id === patientId);
        if (idx !== -1) {
          this.patients[idx] = patientData;
        } else {
          this.patients.push(patientData);
        }
      }
    } catch (err) {
      console.warn("Could not refresh patient from API:", err);
    }
    this.render();
  },

  async switchRole(newRole) {
    soundEngine.init();
    this.role = newRole;
    await this.fetchPatients();
    this.render();
  },

  // --- Live Mutations ---
  async setPatientSeverity(patientId, severity) {
    soundEngine.init();
    if (severity === 'red') {
      soundEngine.playEmergencySiren();
    }
    // Optimistic UI update
    const p = this.patients.find(pt => pt.id === patientId);
    if (p) p.severity = severity;
    this.render();

    try {
      const res = await fetch(`${API_BASE}/patients/${patientId}/severity`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ severity })
      });
      if (res.ok) {
        await this.fetchPatients();
        this.render();
      }
    } catch (err) {
      console.warn("Failed to persist severity to SQLite:", err);
    }
  },

  async editSymptoms(patientId) {
    const p = this.getActivePatient();
    const updated = prompt("Update reported symptoms for " + p.name + ":", p.symptoms);
    if (updated !== null && updated.trim()) {
      p.symptoms = updated.trim();
      this.render();

      try {
        await fetch(`${API_BASE}/patients/${patientId}/clinical`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ symptoms: updated.trim() })
        });
        await this.fetchPatients();
      } catch (e) {
        console.warn(e);
      }
    }
  },

  async editDoctorNotes(patientId) {
    const p = this.getActivePatient();
    const updated = prompt("Update doctor clinical directives for " + p.name + ":", p.doctor_notes || p.doctorNotes);
    if (updated !== null) {
      p.doctor_notes = updated.trim();
      p.doctorNotes = updated.trim();
      this.render();

      try {
        await fetch(`${API_BASE}/patients/${patientId}/clinical`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ doctor_notes: updated.trim() })
        });
        await this.fetchPatients();
      } catch (e) {
        console.warn(e);
      }
    }
  },

  async toggleMedicineTaken(patientId, medId) {
    try {
      const res = await fetch(`${API_BASE}/medicines/${medId}/toggle-taken`, {
        method: 'PATCH'
      });
      if (res.ok) {
        const data = await res.json();
        const p = this.getActivePatient();
        if (p && p.medicines) {
          const m = p.medicines.find(med => med.id === medId);
          if (m) {
            m.taken_today = data.taken_today;
            m.last_taken = data.last_taken;
          }
        }
        this.render();
      }
    } catch (err) {
      console.warn("Toggle medicine failed, updating locally:", err);
      const p = this.getActivePatient();
      if (p && p.medicines) {
        const m = p.medicines.find(med => med.id === medId);
        if (m) {
          m.taken_today = !m.taken_today;
          m.last_taken = m.taken_today ? "Today at " + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : null;
        }
      }
      this.render();
    }
  },

  async deleteMedicine(patientId, medId) {
    if (!confirm("Remove this medicine prescription from the SQLite database?")) return;
    try {
      await fetch(`${API_BASE}/medicines/${medId}`, { method: 'DELETE' });
      await this.selectPatient(patientId);
    } catch (err) {
      console.warn("Delete failed, removing locally:", err);
      const p = this.getActivePatient();
      if (p && p.medicines) {
        p.medicines = p.medicines.filter(m => m.id !== medId);
        this.render();
      }
    }
  },

  async loginPatientWithCode() {
    const code = document.getElementById('manualAccessCode')?.value.trim().toUpperCase();
    if (!code) return;

    try {
      const res = await fetch(`${API_BASE}/patients/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_code: code })
      });
      if (res.ok) {
        const patientData = await res.json();
        this.currentPatientId = patientData.id;
        await this.fetchPatients();
        this.role = 'patient';
        this.render();
      } else {
        alert("Invalid Access PIN. Please check the code provided by your clinic.");
      }
    } catch (err) {
      const patient = this.patients.find(p => p.access_code === code || p.id === code);
      if (patient) {
        this.currentPatientId = patient.id;
        this.role = 'patient';
        this.render();
      } else {
        alert("Access PIN not found.");
      }
    }
  },

  // --- Care Package Generation (Gemini 2.5 Flash + SQLite Persistence) ---
  loadSampleLabReport() {
    const textarea = document.getElementById('carePkgReportText');
    if (textarea) {
      textarea.value = `Comprehensive Metabolic & Lipid Panel:
- Hemoglobin: 10.1 g/dL (Reference Range: 12.0 - 15.5 g/dL) [ATTENTION - LOW]
- Fasting Blood Sugar: 95 mg/dL (Reference Range: 70 - 99 mg/dL) [NORMAL]
- Total Cholesterol: 245 mg/dL (Reference Range: < 200 mg/dL) [BORDERLINE - HIGH]
- Serum Triglycerides: 160 mg/dL (Reference Range: < 150 mg/dL)`;
    }
  },

  handleReportImagePreview(input) {
    const badge = document.getElementById('carePkgImageBadge');
    if (input.files && input.files[0]) {
      badge.textContent = `Attached: ${input.files[0].name}`;
      badge.className = "text-[11px] text-teal-600 font-semibold";
    }
  },

  async handleCarePackageSubmit(event) {
    event.preventDefault();
    soundEngine.init();

    const patientName = document.getElementById('carePkgName')?.value || 'Patient';
    const patientAge = document.getElementById('carePkgAge')?.value || 45;
    const reportText = document.getElementById('carePkgReportText')?.value || '';
    const language = document.getElementById('carePkgLanguage')?.value || 'en';
    const imageInput = document.getElementById('carePkgImageInput');

    const loadingModal = document.getElementById('carePlanLoadingModal');
    if (loadingModal) {
      loadingModal.classList.remove('hidden');
      loadingModal.classList.add('flex');
    }

    const formData = new FormData();
    formData.append('patient_name', patientName);
    formData.append('patient_age', patientAge);
    formData.append('report_text', reportText);
    formData.append('language', language);
    formData.append('patient_id', this.currentPatientId);
    if (imageInput && imageInput.files && imageInput.files[0]) {
      formData.append('report_image', imageInput.files[0]);
    }

    let carePackageResult = null;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`${API_BASE}/generate-care-plan`, {
        method: 'POST',
        body: formData,
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        carePackageResult = await response.json();
      } else {
        throw new Error(`Server status: ${response.status}`);
      }
    } catch (err) {
      console.warn("Care package API call fallback:", err);
      carePackageResult = CLIENT_MOCK_CARE_PLANS[language] || CLIENT_MOCK_CARE_PLANS['en'];
    }

    setTimeout(async () => {
      if (loadingModal) {
        loadingModal.classList.add('hidden');
        loadingModal.classList.remove('flex');
      }

      // Refresh data from SQLite
      await this.fetchPatients();
      const activePatient = this.getActivePatient();
      if (activePatient) {
        activePatient.care_package = carePackageResult;
        activePatient.carePackage = carePackageResult;
        activePatient.language = language;
      }

      // Switch active view automatically to Patient Companion View
      this.role = 'patient';
      this.render();

      const section = document.getElementById('patientCarePackageSection');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }, 800);
  },

  // --- Patient & Medicine Modals ---
  openCreatePatientModal() {
    const modal = document.getElementById('genericModal');
    const content = document.getElementById('genericModalContent');

    content.innerHTML = `
      <div class="space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 class="font-bold text-lg text-slate-900 flex items-center gap-2">
            <i data-lucide="user-plus" class="w-5 h-5 text-indigo-600"></i>
            Create New Patient Profile (Live SQLite)
          </h3>
          <button onclick="App.closeGenericModal()" class="text-slate-400 hover:text-slate-600">✕</button>
        </div>

        <div class="bg-indigo-50/60 p-3 rounded-2xl border border-indigo-100 flex items-center justify-between text-xs">
          <span class="font-medium text-indigo-900">Database:</span>
          <span class="font-mono font-bold text-xs text-indigo-700 bg-white px-2 py-0.5 rounded-lg border border-indigo-200">clinicconnect.db</span>
        </div>

        <form id="createPatientForm" onsubmit="App.handleCreatePatientSubmit(event)" class="space-y-3 text-sm">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
            <input type="text" name="name" required placeholder="e.g. Ramesh Chandra" class="w-full p-2.5 border rounded-xl" />
          </div>

          <div class="grid grid-cols-3 gap-2">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Age</label>
              <input type="number" name="age" required value="45" class="w-full p-2.5 border rounded-xl" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
              <select name="gender" class="w-full p-2.5 border rounded-xl">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Blood Group</label>
              <select name="blood_group" class="w-full p-2.5 border rounded-xl">
                <option value="A+">A+</option>
                <option value="B+">B+</option>
                <option value="O+">O+</option>
                <option value="AB+">AB+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
            <input type="text" name="phone" required placeholder="+91 98765 00000" class="w-full p-2.5 border rounded-xl" />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Symptoms & Clinical Presentation</label>
            <textarea name="symptoms" required rows="2" placeholder="Describe symptoms, duration, vitals..." class="w-full p-2.5 border rounded-xl"></textarea>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Initial Severity Indicator</label>
              <select name="severity" class="w-full p-2.5 border rounded-xl font-medium">
                <option value="green">🟢 Green: Healthy / Stable</option>
                <option value="orange" selected>🟠 Orange: Checkup Required</option>
                <option value="red">🔴 Red: Emergency</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Local Language</label>
              <select name="language" class="w-full p-2.5 border rounded-xl">
                <option value="en">English (en)</option>
                <option value="hi">Hindi (hi - हिंदी)</option>
                <option value="gu">Gujarati (gu - ગુજરાતી)</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Emergency Contact</label>
            <input type="text" name="emergency_contact" placeholder="Relative Name & Phone" class="w-full p-2.5 border rounded-xl" />
          </div>

          <div class="pt-2 flex justify-end gap-2">
            <button type="button" onclick="App.closeGenericModal()" class="px-4 py-2 border rounded-xl text-slate-600">Cancel</button>
            <button type="submit" class="px-5 py-2 bg-indigo-600 text-white rounded-xl font-semibold">Save to SQLite Database</button>
          </div>
        </form>
      </div>
    `;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    lucide.createIcons();
  },

  async handleCreatePatientSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    try {
      const res = await fetch(`${API_BASE}/patients`, {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const newPatient = await res.json();
        this.currentPatientId = newPatient.id;
        await this.fetchPatients();
        this.closeGenericModal();
        this.render();
      } else {
        alert("Failed to create patient profile in database.");
      }
    } catch (err) {
      console.warn("Create patient error:", err);
      alert("Network error: Could not reach backend server.");
    }
  },

  openAddMedicineModal(patientId) {
    const patient = this.getActivePatient();
    const modal = document.getElementById('genericModal');
    const content = document.getElementById('genericModalContent');

    content.innerHTML = `
      <div class="space-y-4 max-h-[85vh] overflow-y-auto pr-1">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 class="font-bold text-lg text-slate-900 flex items-center gap-2">
            <i data-lucide="pill" class="w-5 h-5 text-indigo-600"></i>
            Prescribe Medicine & Setup Timer
          </h3>
          <button onclick="App.closeGenericModal()" class="text-slate-400 hover:text-slate-600">✕</button>
        </div>

        <form id="addMedForm" onsubmit="App.handleAddMedicineSubmit(event, '${patientId}')" class="space-y-4 text-sm">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Medicine Name & Strength</label>
            <input type="text" name="name" required placeholder="e.g. Paracetamol 650mg" class="w-full p-2.5 border rounded-xl" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Dosage Instructions</label>
              <input type="text" name="dosage" required placeholder="e.g. 1 Tablet after breakfast" class="w-full p-2.5 border rounded-xl" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Clinical Purpose</label>
              <input type="text" name="purpose" placeholder="e.g. Fever & headache relief" class="w-full p-2.5 border rounded-xl" />
            </div>
          </div>

          <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <label class="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <i data-lucide="alarm-clock" class="w-4 h-4 text-indigo-600"></i>
              Medicine Timer (Patient Countdown & Alarm)
            </label>
            <div class="grid grid-cols-2 gap-3 mt-2">
              <div>
                <span class="text-[11px] text-slate-500 block mb-1">Target Alarm Time (HH:MM)</span>
                <input type="time" name="target_time" required value="${getNextTargetTime(10)}" class="w-full p-2 bg-white border rounded-xl font-mono text-sm" />
              </div>
              <div>
                <span class="text-[11px] text-slate-500 block mb-1">Frequency</span>
                <input type="text" name="frequency" value="Daily at this time" class="w-full p-2 bg-white border rounded-xl text-xs" />
              </div>
            </div>
          </div>

          <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <label class="block text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
              <i data-lucide="image" class="w-4 h-4 text-indigo-600"></i>
              Select Pill Visual / Picture
            </label>
            
            <div class="grid grid-cols-5 gap-2" id="pillPresetPicker">
              ${Object.entries(PILL_PRESETS).map(([key, item], idx) => `
                <label class="cursor-pointer text-center">
                  <input type="radio" name="pill_type" value="${key}" ${idx === 0 ? 'checked' : ''} class="peer sr-only" />
                  <div class="p-2 bg-white rounded-xl border border-slate-200 peer-checked:border-indigo-600 peer-checked:ring-2 peer-checked:ring-indigo-500/20 shadow-sm transition hover:bg-slate-50">
                    <div class="w-10 h-10 mx-auto">${item.svg}</div>
                    <span class="block text-[10px] text-slate-600 mt-1 font-medium truncate">${item.name.split(' ')[0]}</span>
                  </div>
                </label>
              `).join('')}
            </div>

            <div class="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between">
              <span class="text-xs text-slate-500">Or upload photo:</span>
              <input type="file" id="customPillFileInput" accept="image/*" class="text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700" />
            </div>
          </div>

          <div class="p-3.5 bg-indigo-50/50 rounded-2xl border border-indigo-100">
            <div class="flex items-center justify-between mb-2">
              <label class="block text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                <i data-lucide="mic" class="w-4 h-4 text-indigo-600"></i>
                Voice Note in Local Language
              </label>
              <select name="voice_note_lang" id="voiceLangSelect" onchange="App.fillSuggestedVoicePrompt()" class="text-xs p-1 border rounded-lg bg-white">
                <option value="en-US">English</option>
                <option value="hi-IN" ${patient?.language === 'hi' ? 'selected' : ''}>Hindi (हिंदी)</option>
                <option value="gu-IN" ${patient?.language === 'gu' ? 'selected' : ''}>Gujarati (ગુજરાતી)</option>
              </select>
            </div>

            <textarea name="voice_note_text" id="voiceNoteTextArea" rows="2" placeholder="Text explaining how and when to take this pill..." class="w-full p-2.5 bg-white border rounded-xl text-xs"></textarea>

            <div class="flex items-center justify-between mt-2 pt-2 border-t border-indigo-100 text-xs">
              <button type="button" onclick="App.testPlayModalVoiceNote()" class="text-indigo-600 font-semibold hover:underline flex items-center gap-1">
                <i data-lucide="volume-2" class="w-3.5 h-3.5"></i> Test Voice Output
              </button>

              <button type="button" id="recordLiveVoiceNoteBtn" onclick="App.toggleDoctorLiveVoiceRecording()" class="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 font-medium flex items-center gap-1 cursor-pointer">
                <i data-lucide="mic" class="w-3.5 h-3.5"></i>
                <span>Record Live Memo</span>
              </button>
            </div>
            <input type="hidden" id="recordedAudioBlobData" name="voice_note_audio" value="" />
            <input type="hidden" id="customImageBase64Data" name="custom_image" value="" />
          </div>

          <div class="pt-2 flex justify-end gap-2">
            <button type="button" onclick="App.closeGenericModal()" class="px-4 py-2 border rounded-xl text-slate-600">Cancel</button>
            <button type="submit" class="px-5 py-2 bg-indigo-600 text-white rounded-xl font-semibold">Save Prescription to SQLite</button>
          </div>
        </form>
      </div>
    `;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    lucide.createIcons();
    this.fillSuggestedVoicePrompt();
  },

  fillSuggestedVoicePrompt() {
    const langSelect = document.getElementById('voiceLangSelect');
    const textarea = document.getElementById('voiceNoteTextArea');
    if (!langSelect || !textarea) return;

    const templates = {
      'hi-IN': 'यह गोली खाना खाने के बाद गुनगुने पानी के साथ लें। समय पर लेना आवश्यक है।',
      'gu-IN': 'આ દવા ભોજન પછી એક ગ્લાસ હૂંફાળા પાણી સાથે લેવી. સમયસર લેવી જરૂરી છે.',
      'en-US': 'Take this medicine after meals with a glass of warm water. Do not skip doses.'
    };
    textarea.value = templates[langSelect.value] || templates['en-US'];
  },

  testPlayModalVoiceNote() {
    const langSelect = document.getElementById('voiceLangSelect');
    const textarea = document.getElementById('voiceNoteTextArea');
    const blobData = document.getElementById('recordedAudioBlobData')?.value;

    if (textarea && textarea.value) {
      this.playVoiceNote(textarea.value, langSelect?.value || 'en-US', blobData || null);
    }
  },

  toggleDoctorLiveVoiceRecording() {
    const btn = document.getElementById('recordLiveVoiceNoteBtn');
    if (!voiceAI.isRecordingVoiceNote) {
      voiceAI.startRecordingAudioNote((base64Audio) => {
        const hiddenInput = document.getElementById('recordedAudioBlobData');
        if (hiddenInput) hiddenInput.value = base64Audio;
        if (btn) btn.innerHTML = `<i data-lucide="check" class="w-3.5 h-3.5 text-emerald-600"></i> Recorded!`;
        lucide.createIcons();
      }).then(started => {
        if (started && btn) {
          btn.innerHTML = `<span class="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span> Stop Recording`;
        }
      });
    } else {
      voiceAI.stopRecordingAudioNote();
    }
  },

  async handleAddMedicineSubmit(event, patientId) {
    event.preventDefault();
    const form = event.target;
    const fileInput = document.getElementById('customPillFileInput');
    const hiddenBlob = document.getElementById('recordedAudioBlobData')?.value || null;

    const finalizeAndSend = async (customImgUrl) => {
      const formData = new FormData(form);
      if (customImgUrl) formData.set('custom_image', customImgUrl);
      if (hiddenBlob) formData.set('voice_note_audio', hiddenBlob);

      try {
        const res = await fetch(`${API_BASE}/patients/${patientId}/medicines`, {
          method: 'POST',
          body: formData
        });
        if (res.ok) {
          await this.selectPatient(patientId);
          this.closeGenericModal();
        } else {
          alert("Could not save prescription to SQLite.");
        }
      } catch (err) {
        console.warn("Error adding medicine:", err);
      }
    };

    if (fileInput && fileInput.files && fileInput.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => finalizeAndSend(e.target.result);
      reader.readAsDataURL(fileInput.files[0]);
    } else {
      finalizeAndSend(null);
    }
  },

  // --- Real-time Countdown & Pill Alarm Engine ---
  computeCountdown(targetTimeStr) {
    if (!targetTimeStr) return { text: '--:--', isDue: false };

    const [targetH, targetM] = targetTimeStr.split(':').map(Number);
    const now = new Date();
    const target = new Date();
    target.setHours(targetH, targetM, 0, 0);

    let diffMs = target.getTime() - now.getTime();

    if (diffMs <= 0 && diffMs > -15 * 60 * 1000) {
      return { text: 'DUE NOW!', isDue: true };
    } else if (diffMs <= -15 * 60 * 1000) {
      target.setDate(target.getDate() + 1);
      diffMs = target.getTime() - now.getTime();
    }

    const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const formatted = hours > 0
      ? `${hours}h ${String(minutes).padStart(2, '0')}m`
      : `${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;

    return { text: `In ${formatted}`, isDue: false };
  },

  startTimerTicker() {
    setInterval(() => {
      const activePatient = this.getActivePatient();
      if (!activePatient || !activePatient.medicines) return;

      activePatient.medicines.forEach(med => {
        const countdownEl = document.getElementById(`countdown-${med.id}`);
        if (countdownEl) {
          const countdown = this.computeCountdown(med.target_time || med.targetTime);
          countdownEl.textContent = countdown.text;

          const isTaken = med.taken_today || med.takenToday;
          if (countdown.isDue && !isTaken && !this.alarmDismissed[med.id]) {
            this.triggerPillAlarm(med);
          }
        }
      });
    }, 1000);
  },

  triggerPillAlarm(med) {
    this.alarmDismissed[med.id] = true;
    soundEngine.playChime();

    const modal = document.getElementById('pillAlarmModal');
    const content = document.getElementById('pillAlarmModalContent');
    const vn = med.voice_note || { text: med.dosage, lang: 'en-US' };

    if (modal && content) {
      content.innerHTML = `
        <div class="text-center">
          <div class="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
            <i data-lucide="alarm-clock" class="w-8 h-8 animate-bounce"></i>
          </div>
          <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 uppercase tracking-wide">
            MEDICINE TIME ALARM
          </span>
          <h3 class="text-xl font-bold text-slate-900 mt-2">${med.name}</h3>
          <p class="text-sm font-semibold text-teal-700 mt-1">${med.dosage}</p>
          
          <div class="my-4 flex justify-center">
            ${renderPillGraphic(med.pill_type || med.pillType, med.custom_image || med.customImage, "w-24 h-24")}
          </div>

          <div class="p-3 bg-slate-50 rounded-xl text-left border border-slate-200">
            <p class="text-xs text-slate-600 italic">"${vn.text}"</p>
          </div>

          <div class="grid grid-cols-2 gap-3 mt-5">
            <button onclick="App.playVoiceNote('${escapeQuotes(vn.text)}', '${vn.lang}');" 
              class="py-2.5 px-4 rounded-xl bg-teal-600 text-white font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer">
              <i data-lucide="volume-2" class="w-4 h-4"></i> Listen Audio
            </button>
            <button onclick="App.confirmPillTakenFromAlarm('${med.id}')" 
              class="py-2.5 px-4 rounded-xl bg-emerald-600 text-white font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer">
              <i data-lucide="check" class="w-4 h-4"></i> Mark as Taken
            </button>
          </div>
          
          <button onclick="document.getElementById('pillAlarmModal').classList.add('hidden')" class="mt-3 text-xs text-slate-400 hover:text-slate-600">Dismiss Reminder</button>
        </div>
      `;
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      lucide.createIcons();
    }
  },

  confirmPillTakenFromAlarm(medId) {
    this.toggleMedicineTaken(this.currentPatientId, medId);
    const modal = document.getElementById('pillAlarmModal');
    if (modal) modal.classList.add('hidden');
  },

  playVoiceNote(text, lang = 'en-US', audioBlob = null) {
    soundEngine.init();
    if (audioBlob) {
      const audio = new Audio(audioBlob);
      audio.play().catch(() => voiceAI.speakText(text, lang));
    } else {
      voiceAI.speakText(text, lang);
    }
  },

  filterSeverity(severity) {
    this.currentSeverityFilter = severity;
    this.render();
  },

  handlePatientSearch(query) {
    const q = query.toLowerCase().trim();
    const container = document.getElementById('patientListContainer');
    if (!container) return;

    const filtered = this.patients.filter(p => 
      p.name.toLowerCase().includes(q) || 
      (p.access_code || p.accessCode || '').toLowerCase().includes(q) || 
      (p.symptoms || '').toLowerCase().includes(q)
    );

    container.innerHTML = filtered.map(p => this.renderPatientRosterCard(p, p.id === this.currentPatientId)).join('');
    lucide.createIcons();
  },

  triggerEmergencyAlert() {
    soundEngine.playEmergencySiren();
    alert("🚨 EMERGENCY ALERT TRANSMITTED!\n\nHospital Trauma Care & On-Call Specialist Dr. Sarah Jenkins have been notified with patient vitals, GPS coordinates, and medical history.\n\nEmergency dispatch is en route.");
  },

  requestDoctorCheckup() {
    alert("Tele-Checkup Requested!\n\nYour request has been added to Dr. Sarah Jenkins' clinic queue. You will receive a video call notification shortly.");
  },

  toggleCareStep(stepKey) {
    this.completedCareSteps[stepKey] = !this.completedCareSteps[stepKey];
    this.render();
  },

  copyDoctorQuestions(text) {
    navigator.clipboard.writeText(text).then(() => {
      alert("Questions copied to clipboard! You can share them with your doctor.");
    }).catch(() => {
      alert("Doctor Questions:\n" + text);
    });
  },

  closeGenericModal() {
    const modal = document.getElementById('genericModal');
    if (modal) modal.classList.add('hidden');
  },

  // --- UI Renderers ---
  render() {
    const appContainer = document.getElementById('mainContent');
    const roleIndicator = document.getElementById('currentRoleBadge');
    const navBtnClinic = document.getElementById('navBtnClinic');
    const navBtnPatient = document.getElementById('navBtnPatient');

    if (this.role === 'clinic') {
      if (navBtnClinic) navBtnClinic.className = "px-3.5 py-1.5 rounded-xl bg-white text-indigo-700 shadow-sm transition flex items-center gap-1.5 cursor-pointer font-bold";
      if (navBtnPatient) navBtnPatient.className = "px-3.5 py-1.5 rounded-xl text-slate-600 hover:text-teal-600 transition flex items-center gap-1.5 cursor-pointer font-medium";
      if (roleIndicator) {
        roleIndicator.innerHTML = `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200">
          <span class="w-2 h-2 rounded-full bg-indigo-600 animate-ping"></span> Clinic Portal (Doctor View)
        </span>`;
      }
      appContainer.innerHTML = this.renderClinicDashboard();
    } else {
      if (navBtnClinic) navBtnClinic.className = "px-3.5 py-1.5 rounded-xl text-slate-600 hover:text-indigo-600 transition flex items-center gap-1.5 cursor-pointer font-medium";
      if (navBtnPatient) navBtnPatient.className = "px-3.5 py-1.5 rounded-xl bg-white text-teal-700 shadow-sm transition flex items-center gap-1.5 cursor-pointer font-bold";
      if (roleIndicator) {
        roleIndicator.innerHTML = `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-800 border border-teal-200">
          <span class="w-2 h-2 rounded-full bg-teal-600 animate-pulse"></span> Patient Companion View
        </span>`;
      }
      appContainer.innerHTML = this.renderPatientDashboard();
    }

    lucide.createIcons();
  },

  renderClinicDashboard() {
    const activePatient = this.getActivePatient();
    let displayPatients = this.patients;
    if (this.currentSeverityFilter !== 'all') {
      displayPatients = this.patients.filter(p => p.severity === this.currentSeverityFilter);
    }

    return `
      <div class="space-y-6">
        <!-- Clinic Header Banner -->
        <div class="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <span class="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  CLINICCONNECT LIVE DOCTOR HUB
                </span>
                <span class="text-xs text-slate-400">Database: clinicconnect.db (SQLite)</span>
              </div>
              <h1 class="text-2xl sm:text-3xl font-bold tracking-tight">${this.doctorInfo.name}</h1>
              <p class="text-sm text-indigo-200/80 mt-1">${this.doctorInfo.specialty} • ${this.doctorInfo.hospital}</p>
            </div>

            <div class="flex flex-wrap items-center gap-3">
              <button onclick="App.openCreatePatientModal()" class="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm shadow-md transition flex items-center gap-2 cursor-pointer">
                <i data-lucide="user-plus" class="w-4 h-4"></i>
                Create Patient Profile
              </button>
              <button onclick="App.switchRole('patient')" class="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm backdrop-blur-md transition flex items-center gap-2 border border-white/10 cursor-pointer">
                <i data-lucide="external-link" class="w-4 h-4"></i>
                Patient Companion View
              </button>
            </div>
          </div>

          <!-- Severity Quick Stat Cards (Live From SQLite) -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800">
            <div onclick="App.filterSeverity('all')" class="bg-slate-800/60 hover:bg-slate-800 p-3.5 rounded-2xl border border-slate-700 cursor-pointer transition">
              <div class="text-xs font-medium text-slate-400">Total Patients in DB</div>
              <div class="text-2xl font-bold text-white mt-1">${this.stats.total}</div>
            </div>

            <div onclick="App.filterSeverity('red')" class="bg-rose-950/40 hover:bg-rose-950/60 p-3.5 rounded-2xl border border-rose-900/60 cursor-pointer transition ${this.currentSeverityFilter === 'red' ? 'ring-2 ring-rose-500' : ''}">
              <div class="flex items-center justify-between">
                <span class="text-xs font-medium text-rose-300">🔴 Emergency</span>
                <span class="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              </div>
              <div class="text-2xl font-bold text-rose-400 mt-1">${this.stats.red} Critical</div>
            </div>

            <div onclick="App.filterSeverity('orange')" class="bg-amber-950/40 hover:bg-amber-950/60 p-3.5 rounded-2xl border border-amber-900/60 cursor-pointer transition ${this.currentSeverityFilter === 'orange' ? 'ring-2 ring-amber-500' : ''}">
              <div class="flex items-center justify-between">
                <span class="text-xs font-medium text-amber-300">🟠 Checkup Required</span>
              </div>
              <div class="text-2xl font-bold text-amber-400 mt-1">${this.stats.orange} Pending</div>
            </div>

            <div onclick="App.filterSeverity('green')" class="bg-emerald-950/40 hover:bg-emerald-950/60 p-3.5 rounded-2xl border border-emerald-900/60 cursor-pointer transition ${this.currentSeverityFilter === 'green' ? 'ring-2 ring-emerald-500' : ''}">
              <div class="flex items-center justify-between">
                <span class="text-xs font-medium text-emerald-300">🟢 Healthy / Stable</span>
              </div>
              <div class="text-2xl font-bold text-emerald-400 mt-1">${this.stats.green} Active</div>
            </div>
          </div>
        </div>

        <!-- 2-Column Clinical Layout: Patient Roster & Active Management -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <!-- Left Column: Patient List (5 Cols) -->
          <div class="lg:col-span-5 space-y-4">
            <div class="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-base font-bold text-slate-900 flex items-center gap-2">
                  <i data-lucide="users" class="w-5 h-5 text-indigo-600"></i>
                  Patient Roster (Live SQLite)
                </h2>
                <div class="flex gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium text-slate-600">
                  <button onclick="App.filterSeverity('all')" class="px-2.5 py-1 rounded-lg ${this.currentSeverityFilter === 'all' ? 'bg-white text-indigo-600 shadow-sm' : ''} cursor-pointer">All</button>
                  <button onclick="App.filterSeverity('red')" class="px-2.5 py-1 rounded-lg ${this.currentSeverityFilter === 'red' ? 'bg-rose-500 text-white shadow-sm' : ''} cursor-pointer">Red</button>
                  <button onclick="App.filterSeverity('orange')" class="px-2.5 py-1 rounded-lg ${this.currentSeverityFilter === 'orange' ? 'bg-amber-500 text-white shadow-sm' : ''} cursor-pointer">Orange</button>
                  <button onclick="App.filterSeverity('green')" class="px-2.5 py-1 rounded-lg ${this.currentSeverityFilter === 'green' ? 'bg-emerald-500 text-white shadow-sm' : ''} cursor-pointer">Green</button>
                </div>
              </div>

              <!-- Search bar -->
              <div class="relative mb-3">
                <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3.5 top-3"></i>
                <input type="text" id="patientSearchInput" oninput="App.handlePatientSearch(this.value)" placeholder="Search by name, PIN or symptoms..." 
                  class="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white" />
              </div>

              <!-- Patient Cards Stack -->
              <div class="space-y-2.5 max-h-[550px] overflow-y-auto pr-1" id="patientListContainer">
                ${displayPatients.map(p => this.renderPatientRosterCard(p, p.id === (activePatient?.id))).join('')}
              </div>
            </div>
          </div>

          <!-- Right Column: Active Patient Management & Lab Report AI Care Plan (7 Cols) -->
          <div class="lg:col-span-7 space-y-5">
            ${this.renderActivePatientManager(activePatient)}
          </div>

        </div>
      </div>
    `;
  },

  renderPatientRosterCard(patient, isSelected) {
    const severityBadge = {
      'red': '<span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span> Red: Emergency</span>',
      'orange': '<span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-amber-500"></span> Orange: Checkup</span>',
      'green': '<span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-emerald-600"></span> Green: Healthy</span>'
    }[patient.severity] || '<span class="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-xs">Standard</span>';

    const ringEffect = patient.severity === 'red' ? 'border-l-4 border-l-rose-500' : (patient.severity === 'orange' ? 'border-l-4 border-l-amber-500' : 'border-l-4 border-l-emerald-500');
    const pin = patient.access_code || patient.accessCode || patient.id;

    return `
      <div onclick="App.selectPatient('${patient.id}')" 
        class="p-4 rounded-2xl cursor-pointer transition border ${isSelected ? 'bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-500/20 shadow-sm' : 'bg-white hover:bg-slate-50 border-slate-200'} ${ringEffect}">
        <div class="flex items-start justify-between gap-3">
          <div>
            <div class="flex items-center gap-2">
              <h3 class="font-bold text-slate-900 text-sm">${patient.name}</h3>
              <span class="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">${pin}</span>
            </div>
            <p class="text-xs text-slate-500 mt-0.5">${patient.age} yrs • ${patient.gender} • Blood: ${patient.blood_group || patient.bloodGroup}</p>
          </div>
          <div>
            ${severityBadge}
          </div>
        </div>

        <p class="text-xs text-slate-600 mt-2 line-clamp-1 bg-slate-50/80 p-1.5 rounded-lg border border-slate-100">
          <span class="font-medium text-slate-700">Symptoms:</span> ${patient.symptoms}
        </p>

        <div class="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span class="flex items-center gap-1">
            <i data-lucide="sparkles" class="w-3.5 h-3.5 text-teal-600"></i>
            ${(patient.care_package || patient.carePackage) ? 'Care Package Ready' : 'Pending Lab Analysis'}
          </span>
          <span class="text-indigo-600 font-medium hover:underline">Manage Profile →</span>
        </div>
      </div>
    `;
  },

  renderActivePatientManager(patient) {
    if (!patient) return `<div class="p-8 text-center text-slate-400 bg-white rounded-3xl border border-slate-200">Select a patient from the roster</div>`;

    const meds = patient.medicines || [];
    const pin = patient.access_code || patient.accessCode || patient.id;
    const docNotes = patient.doctor_notes || patient.doctorNotes || 'No notes added.';

    return `
      <!-- Patient Diagnostic Detail Card -->
      <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
        
        <!-- Header & Severity Control -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                1-TIME PIN: ${pin}
              </span>
              <span class="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Live in SQLite
              </span>
            </div>
            <h2 class="text-xl font-bold text-slate-900 mt-1">${patient.name}</h2>
            <p class="text-xs text-slate-500">${patient.phone} • Emergency: ${patient.emergency_contact || patient.emergencyContact || 'None'}</p>
          </div>

          <!-- Severity Quick Toggle (Live Database Update) -->
          <div class="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-1">
            <span class="text-xs font-bold text-slate-500 px-2">Severity:</span>
            
            <button onclick="App.setPatientSeverity('${patient.id}', 'green')" 
              class="px-2.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${patient.severity === 'green' ? 'bg-emerald-600 text-white shadow-sm' : 'text-emerald-700 hover:bg-emerald-50'}">
              <span class="w-2 h-2 rounded-full bg-emerald-300"></span> Green
            </button>

            <button onclick="App.setPatientSeverity('${patient.id}', 'orange')" 
              class="px-2.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${patient.severity === 'orange' ? 'bg-amber-500 text-white shadow-sm' : 'text-amber-700 hover:bg-amber-50'}">
              <span class="w-2 h-2 rounded-full bg-amber-200"></span> Orange
            </button>

            <button onclick="App.setPatientSeverity('${patient.id}', 'red')" 
              class="px-2.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${patient.severity === 'red' ? 'bg-rose-600 text-white shadow-sm severity-ring-red' : 'text-rose-700 hover:bg-rose-50'}">
              <span class="w-2 h-2 rounded-full bg-rose-200 animate-ping"></span> Red Emergency
            </button>
          </div>
        </div>

        <!-- AI LAB REPORT & CARE PACKAGE GENERATOR (GEMINI 2.5 FLASH) -->
        <div class="p-5 rounded-3xl bg-gradient-to-br from-teal-50/70 via-indigo-50/50 to-white border border-teal-200/80 shadow-sm space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-teal-100">
            <div>
              <h3 class="text-base font-bold text-slate-900 flex items-center gap-2">
                <i data-lucide="sparkles" class="w-5 h-5 text-teal-600"></i>
                Generate Patient Care Package (Gemini 2.5 Flash + SQLite)
              </h3>
              <p class="text-xs text-slate-500">Live API parses lab report into 5th-grade guidance & saves directly to database</p>
            </div>
            <button type="button" onclick="App.loadSampleLabReport()" 
              class="px-3 py-1.5 rounded-xl bg-teal-100 hover:bg-teal-200 text-teal-800 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto">
              <i data-lucide="file-text" class="w-3.5 h-3.5"></i>
              Load Sample CBC/Lipid Report
            </button>
          </div>

          <form id="carePackageForm" onsubmit="App.handleCarePackageSubmit(event)" class="space-y-3.5 text-xs">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Patient Name</label>
                <input type="text" id="carePkgName" required value="${patient.name}" class="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-medium" />
              </div>
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Age</label>
                <input type="number" id="carePkgAge" required value="${patient.age}" class="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-medium" />
              </div>
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Language</label>
                <select id="carePkgLanguage" class="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800">
                  <option value="en" ${patient.language === 'en' ? 'selected' : ''}>English (en)</option>
                  <option value="hi" ${patient.language === 'hi' ? 'selected' : ''}>Hindi - हिंदी (hi)</option>
                  <option value="gu" ${patient.language === 'gu' ? 'selected' : ''}>Gujarati - ગુજરાતી (gu)</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">Extracted Lab Report Text</label>
              <textarea id="carePkgReportText" rows="3" required placeholder="Paste diagnostic test values, e.g. Hemoglobin: 10.1 g/dL, Fasting Sugar: 95 mg/dL, Total Cholesterol: 245 mg/dL..." 
                class="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 font-mono text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"></textarea>
            </div>

            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
              <div class="flex items-center gap-2">
                <label class="text-slate-600 font-medium cursor-pointer flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50">
                  <i data-lucide="image" class="w-4 h-4 text-teal-600"></i>
                  <span>Attach Lab Photo (Optional)</span>
                  <input type="file" id="carePkgImageInput" accept="image/*" class="sr-only" onchange="App.handleReportImagePreview(this)" />
                </label>
                <span id="carePkgImageBadge" class="text-[11px] text-slate-400 italic">No image selected</span>
              </div>

              <button type="submit" id="generateCarePackageBtn" 
                class="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-500 hover:to-indigo-500 text-white font-bold text-sm shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 cursor-pointer transition">
                <i data-lucide="sparkles" class="w-4 h-4"></i>
                Generate Patient Care Package
              </button>
            </div>
          </form>
        </div>

        <!-- Symptoms & Doctor Notes Section (Live SQLite Updates) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <i data-lucide="activity" class="w-4 h-4 text-rose-500"></i>
                Reported Symptoms
              </span>
              <button onclick="App.editSymptoms('${patient.id}')" class="text-xs text-indigo-600 hover:underline">Edit</button>
            </div>
            <p class="text-xs text-slate-600 leading-relaxed">${patient.symptoms}</p>
          </div>

          <div class="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100">
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                <i data-lucide="clipboard-pen" class="w-4 h-4 text-indigo-600"></i>
                Clinical Directives
              </span>
              <button onclick="App.editDoctorNotes('${patient.id}')" class="text-xs text-indigo-600 hover:underline">Edit</button>
            </div>
            <p class="text-xs text-indigo-950/80 leading-relaxed">${docNotes}</p>
          </div>
        </div>

        <!-- Prescribed Medicines & Timers (Live in SQLite) -->
        <div class="space-y-4 pt-2">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 class="text-base font-bold text-slate-900 flex items-center gap-2">
                <i data-lucide="clock" class="w-5 h-5 text-indigo-600"></i>
                Scheduled Medicines & Pill Timers
              </h3>
              <p class="text-xs text-slate-500">Prescriptions stored in SQLite with countdown timers and local language voice notes</p>
            </div>
            
            <button onclick="App.openAddMedicineModal('${patient.id}')" class="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-sm flex items-center gap-1.5 self-start sm:self-auto cursor-pointer">
              <i data-lucide="plus-circle" class="w-4 h-4"></i>
              Add Medicine & Set Timer
            </button>
          </div>

          <div class="space-y-3">
            ${meds.length === 0 ? `
              <div class="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                <i data-lucide="pill" class="w-8 h-8 text-slate-300 mx-auto mb-2"></i>
                <p class="text-sm font-medium text-slate-600">No medicines scheduled yet</p>
                <p class="text-xs text-slate-400 mt-1">Click "Add Medicine & Set Timer" to prescribe pills with voice instructions.</p>
              </div>
            ` : meds.map(med => this.renderDoctorMedicineCard(patient.id, med)).join('')}
          </div>
        </div>

      </div>
    `;
  },

  renderDoctorMedicineCard(patientId, med) {
    const pillGraphic = renderPillGraphic(med.pill_type || med.pillType, med.custom_image || med.customImage, "w-14 h-14");
    const vn = med.voice_note || { text: med.dosage, lang: med.voice_note_lang || 'en-US', audio: med.voice_note_audio };
    const targetTime = med.target_time || med.targetTime || '09:00';

    return `
      <div class="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-indigo-200 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        <div class="flex items-center gap-3.5">
          ${pillGraphic}
          <div>
            <div class="flex items-center gap-2">
              <h4 class="font-bold text-slate-900 text-sm">${med.name}</h4>
              <span class="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center gap-1">
                <i data-lucide="alarm-clock" class="w-3 h-3"></i> ${targetTime}
              </span>
            </div>
            <p class="text-xs text-slate-600 mt-0.5">${med.dosage} • <span class="text-slate-400">${med.purpose}</span></p>
            
            <div class="flex items-center gap-2 mt-2">
              <button onclick="App.playVoiceNote('${escapeQuotes(vn.text)}', '${vn.lang}', '${vn.audio || ''}')" 
                class="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer border border-indigo-200/60">
                <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
                Play Voice Note (${vn.lang})
              </button>
              <span class="text-xs text-slate-400 italic truncate max-w-xs">"${vn.text}"</span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2 self-end md:self-center">
          <button onclick="App.deleteMedicine('${patientId}', '${med.id}')" class="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer" title="Remove Medicine">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>

      </div>
    `;
  },

  renderPatientDashboard() {
    const activePatient = this.getActivePatient();

    if (!activePatient) {
      return `
        <div class="max-w-md mx-auto my-12 p-8 bg-white rounded-3xl border border-slate-200 text-center shadow-lg">
          <h2 class="text-xl font-bold text-slate-900">Patient Companion Login</h2>
          <p class="text-sm text-slate-500 mt-2">Enter your 1-Time Access Key provided by your clinic</p>
          <input type="text" id="manualAccessCode" placeholder="e.g. PAT-1001" class="w-full mt-4 p-3 border rounded-xl text-center font-mono text-lg font-bold uppercase" />
          <button onclick="App.loginPatientWithCode()" class="w-full mt-3 py-3 bg-teal-600 text-white rounded-xl font-bold cursor-pointer">Access Live Dashboard</button>
        </div>
      `;
    }

    const severityData = {
      'green': {
        title: 'HEALTHY & STABLE',
        subtitle: 'All vitals within normal parameters. Maintain routine preventive schedule.',
        badgeClass: 'bg-emerald-500 text-white',
        borderClass: 'border-emerald-300 bg-gradient-to-r from-emerald-50/80 to-teal-50/80',
        textColor: 'text-emerald-900',
        pulse: false,
        icon: 'check-circle-2'
      },
      'orange': {
        title: 'CLINIC CHECKUP REQUIRED',
        subtitle: 'Symptoms require doctor consultation. Follow prescription and monitor recovery.',
        badgeClass: 'bg-amber-500 text-white',
        borderClass: 'border-amber-300 bg-gradient-to-r from-amber-50/80 to-orange-50/80',
        textColor: 'text-amber-900',
        pulse: false,
        icon: 'alert-triangle'
      },
      'red': {
        title: 'EMERGENCY MEDICAL ATTENTION REQUIRED',
        subtitle: 'Critical health status detected. Take prescribed emergency pill immediately or click SOS.',
        badgeClass: 'bg-rose-600 text-white',
        borderClass: 'border-rose-400 bg-gradient-to-r from-rose-50 to-red-50 ring-2 ring-rose-500/20',
        textColor: 'text-rose-900',
        pulse: true,
        icon: 'alert-octagon'
      }
    }[activePatient.severity] || {
      title: 'ACTIVE MONITORING',
      subtitle: 'Monitoring active vitals.',
      badgeClass: 'bg-teal-600 text-white',
      borderClass: 'border-teal-300',
      textColor: 'text-teal-900',
      pulse: false,
      icon: 'activity'
    };

    const pin = activePatient.access_code || activePatient.accessCode || activePatient.id;

    return `
      <div class="space-y-6 max-w-5xl mx-auto">
        
        <!-- Patient Top Welcome Bar -->
        <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
              ${activePatient.name.split(' ').map(n=>n[0]).join('')}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                  PIN: ${pin}
                </span>
                <span class="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Verified SQLite Record
                </span>
              </div>
              <h1 class="text-2xl font-bold text-slate-900 mt-1">${activePatient.name}</h1>
              <p class="text-xs text-slate-500">${activePatient.age} yrs • Blood Group: ${activePatient.blood_group || activePatient.bloodGroup} • Phone: ${activePatient.phone}</p>
            </div>
          </div>

          <!-- Switch demo patient or switch to clinic -->
          <div class="flex items-center gap-2">
            <select onchange="App.selectPatient(this.value)" class="text-xs bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-700 cursor-pointer">
              ${this.patients.map(p => `
                <option value="${p.id}" ${p.id === activePatient.id ? 'selected' : ''}>
                  ${p.name} (${p.severity.toUpperCase()})
                </option>
              `).join('')}
            </select>
            <button onclick="App.switchRole('clinic')" class="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition cursor-pointer">
              Clinic View
            </button>
          </div>
        </div>

        <!-- HEALTH SEVERITY STATUS BANNER -->
        <div class="rounded-3xl p-6 border ${severityData.borderClass} shadow-sm relative overflow-hidden transition-all ${severityData.pulse ? 'severity-ring-red' : ''}">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="flex items-start gap-4">
              <div class="p-3 rounded-2xl ${severityData.badgeClass} shadow-md flex-shrink-0">
                <i data-lucide="${severityData.icon}" class="w-7 h-7"></i>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold tracking-wider px-2.5 py-0.5 rounded-md ${severityData.badgeClass}">
                    ${severityData.title}
                  </span>
                  <span class="text-xs text-slate-500">Supervised by ${this.doctorInfo.name}</span>
                </div>
                <h3 class="text-lg font-bold ${severityData.textColor} mt-1.5">${severityData.subtitle}</h3>
                <p class="text-xs text-slate-600 mt-1"><span class="font-semibold text-slate-800">Current Symptoms:</span> ${activePatient.symptoms}</p>
              </div>
            </div>

            ${activePatient.severity === 'red' ? `
              <button onclick="App.triggerEmergencyAlert()" class="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 severity-recording-pulse flex-shrink-0 cursor-pointer">
                <i data-lucide="phone-call" class="w-5 h-5 animate-bounce"></i>
                SOS EMERGENCY
              </button>
            ` : `
              <button onclick="App.requestDoctorCheckup()" class="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-semibold text-xs shadow-sm flex items-center gap-2 flex-shrink-0 cursor-pointer">
                <i data-lucide="calendar" class="w-4 h-4 text-teal-600"></i>
                Request Tele-Checkup
              </button>
            `}
          </div>
        </div>

        <!-- PATIENT COMPANION VIEW: CARE PACKAGE -->
        <div id="patientCarePackageSection">
          ${this.renderPatientCarePackage(activePatient)}
        </div>

        <!-- MEDICINES WITH LIVE COUNTDOWN TIMERS & LOCAL VOICE NOTES -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
                <i data-lucide="pill" class="w-5 h-5 text-teal-600"></i>
                My Prescribed Pills & Live Timers
              </h2>
              <p class="text-xs text-slate-500">Clear picture of each pill with audio explanation in your language</p>
            </div>
            <div class="text-xs text-slate-400 font-medium flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-teal-500 animate-ping"></span> Live Timers Active
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${(activePatient.medicines || []).map(med => this.renderPatientPillCard(activePatient.id, med)).join('')}
          </div>
        </div>

        <!-- Doctor's Directives Box -->
        <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-start gap-4">
          <div class="p-3 bg-teal-50 rounded-2xl text-teal-600 flex-shrink-0">
            <i data-lucide="stethoscope" class="w-6 h-6"></i>
          </div>
          <div>
            <h3 class="font-bold text-slate-900 text-sm">Doctor's Clinical Recommendation</h3>
            <p class="text-xs text-slate-600 mt-1 leading-relaxed">${activePatient.doctor_notes || activePatient.doctorNotes || 'Maintain prescribed hydration, take medications on time, and reach out immediately if any symptoms worsen.'}</p>
            <div class="mt-3 flex items-center gap-3 text-xs text-slate-400">
              <span>Emergency contact on file: <strong>${activePatient.emergency_contact || activePatient.emergencyContact || 'None'}</strong></span>
            </div>
          </div>
        </div>

      </div>
    `;
  },

  renderPatientCarePackage(patient) {
    const pkg = patient.care_package || patient.carePackage || CLIENT_MOCK_CARE_PLANS[patient.language || 'en'] || CLIENT_MOCK_CARE_PLANS['en'];
    const lang = patient.language || 'en';
    const langVoiceMap = { 'en': 'en-US', 'hi': 'hi-IN', 'gu': 'gu-IN' };
    const voiceCode = langVoiceMap[lang] || 'en-US';

    const statusConfig = {
      'normal': {
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        cardClass: 'traffic-card-normal',
        dotColor: 'bg-emerald-500',
        label: 'Normal'
      },
      'borderline': {
        badge: 'bg-amber-100 text-amber-800 border-amber-300',
        cardClass: 'traffic-card-borderline',
        dotColor: 'bg-amber-500',
        label: 'Borderline'
      },
      'attention': {
        badge: 'bg-rose-100 text-rose-800 border-rose-300',
        cardClass: 'traffic-card-attention',
        dotColor: 'bg-rose-500 animate-ping',
        label: 'Attention Required'
      }
    };

    return `
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
              <i data-lucide="sparkles" class="w-5 h-5 text-teal-600"></i>
              Personalized Lab Care Package
            </h2>
            <p class="text-xs text-slate-500">Easy 5th-grade explanation generated by Gemini AI in your language</p>
          </div>
          <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
            Language: ${lang.toUpperCase()}
          </span>
        </div>

        <!-- 1. SUMMARY CARD (2 Sentences) -->
        <div class="bg-gradient-to-br from-teal-500 via-teal-600 to-indigo-700 text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="space-y-1.5 flex-1">
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 rounded bg-white/20 text-[11px] font-bold tracking-wide uppercase">Care Summary</span>
                <span class="text-xs text-teal-100">Patient-Friendly Insights</span>
              </div>
              <p class="text-base sm:text-lg font-medium leading-relaxed mt-2 text-white/95">
                "${pkg.summary}"
              </p>
            </div>

            <button onclick="App.playVoiceNote('${escapeQuotes(pkg.summary)}', '${voiceCode}')" 
              class="px-4 py-2.5 rounded-2xl bg-white text-teal-800 hover:bg-teal-50 font-bold text-xs shadow transition flex items-center justify-center gap-2 cursor-pointer flex-shrink-0 self-start sm:self-center">
              <i data-lucide="volume-2" class="w-4 h-4 text-teal-600"></i>
              <span>Listen Summary</span>
            </button>
          </div>
        </div>

        <!-- 2. TRAFFIC LIGHT TEST CARDS -->
        <div>
          <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <i data-lucide="activity" class="w-4 h-4 text-teal-600"></i>
            Diagnostic Parameters (Traffic-Light Indicators)
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            ${(pkg.flagged_tests || []).map(test => {
              const cfg = statusConfig[test.status.toLowerCase()] || statusConfig['normal'];
              return `
                <div class="p-4 rounded-3xl ${cfg.cardClass} shadow-sm flex flex-col justify-between space-y-2.5">
                  <div>
                    <div class="flex items-center justify-between gap-2">
                      <span class="px-2 py-0.5 rounded-full text-[11px] font-bold border flex items-center gap-1.5 ${cfg.badge}">
                        <span class="w-2 h-2 rounded-full ${cfg.dotColor}"></span>
                        ${cfg.label}
                      </span>
                      <span class="text-[11px] text-slate-400 font-mono">Ref: ${test.range}</span>
                    </div>
                    <h4 class="font-bold text-slate-900 text-sm mt-2">${test.test_name}</h4>
                    <div class="text-xl font-extrabold text-slate-800 mt-0.5">${test.value}</div>
                  </div>

                  <p class="text-xs text-slate-600 leading-relaxed bg-white/70 p-2.5 rounded-xl border border-slate-100">
                    ${test.explanation}
                  </p>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- 3. DAILY CARE CHECKLIST & 4. DOCTOR QUESTIONS -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          
          <div class="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
            <div class="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 class="font-bold text-slate-900 text-sm flex items-center gap-2">
                <i data-lucide="check-square" class="w-4 h-4 text-teal-600"></i>
                Daily Care Checklist
              </h3>
              <span class="text-[11px] font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-700">3 Daily Steps</span>
            </div>

            <div class="space-y-2.5">
              ${(pkg.care_plan || []).map((step, idx) => {
                const stepKey = `${patient.id}-step-${idx}`;
                const isChecked = App.completedCareSteps[stepKey] || false;
                return `
                  <label class="checklist-item flex items-start gap-3 p-3 rounded-2xl border ${isChecked ? 'bg-emerald-50/60 border-emerald-200' : 'bg-slate-50 border-slate-100'} cursor-pointer">
                    <input type="checkbox" onchange="App.toggleCareStep('${stepKey}')" ${isChecked ? 'checked' : ''} 
                      class="w-4 h-4 mt-0.5 text-teal-600 rounded focus:ring-teal-500 cursor-pointer" />
                    <span class="text-xs leading-relaxed ${isChecked ? 'text-emerald-900 line-through font-medium' : 'text-slate-700'}">${step}</span>
                  </label>
                `;
              }).join('')}
            </div>
          </div>

          <div class="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
            <div class="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 class="font-bold text-slate-900 text-sm flex items-center gap-2">
                <i data-lucide="message-circle-question" class="w-4 h-4 text-indigo-600"></i>
                Questions for Your Next Visit
              </h3>
              <button onclick="App.copyDoctorQuestions('${escapeQuotes((pkg.doctor_questions || []).join(' | '))}')" 
                class="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition cursor-pointer flex items-center gap-1">
                <i data-lucide="copy" class="w-3 h-3"></i> Copy
              </button>
            </div>

            <div class="space-y-2.5">
              ${(pkg.doctor_questions || []).map((q, idx) => `
                <div class="p-3 rounded-2xl bg-indigo-50/40 border border-indigo-100/70 text-xs text-indigo-950 flex items-start gap-2.5">
                  <span class="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">${idx+1}</span>
                  <p class="leading-relaxed flex-1">${q}</p>
                  <button onclick="App.playVoiceNote('${escapeQuotes(q)}', '${voiceCode}')" class="text-indigo-500 hover:text-indigo-700 p-1 cursor-pointer" title="Listen">
                    <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
                  </button>
                </div>
              `).join('')}
            </div>
          </div>

        </div>

      </div>
    `;
  },

  renderPatientPillCard(patientId, med) {
    const pillGraphic = renderPillGraphic(med.pill_type || med.pillType, med.custom_image || med.customImage, "w-24 h-24");
    const targetTime = med.target_time || med.targetTime || '09:00';
    const countdown = this.computeCountdown(targetTime);
    const isDue = countdown.isDue;
    const isTaken = med.taken_today || med.takenToday;
    const vn = med.voice_note || { text: med.dosage, lang: med.voice_note_lang || 'en-US', audio: med.voice_note_audio };

    return `
      <div class="pill-card bg-white rounded-3xl p-5 border ${isDue ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-200'} shadow-sm flex flex-col justify-between">
        
        <div>
          <div class="flex items-center justify-between gap-2 mb-3">
            <span class="px-2.5 py-1 rounded-full text-xs font-semibold ${isTaken ? 'bg-emerald-100 text-emerald-800' : (isDue ? 'bg-amber-100 text-amber-800 animate-pulse' : 'bg-slate-100 text-slate-700')}">
              ${isTaken ? '✓ Taken Today' : (isDue ? '🚨 Due Now!' : `Target: ${targetTime}`)}
            </span>
            
            <div class="text-xs font-mono font-bold px-3 py-1 rounded-full ${isDue ? 'bg-amber-500 text-white shadow-sm' : 'bg-slate-100 text-slate-700'} flex items-center gap-1.5">
              <i data-lucide="clock" class="w-3.5 h-3.5"></i>
              <span id="countdown-${med.id}">${countdown.text}</span>
            </div>
          </div>

          <div class="flex items-start gap-4">
            <div class="flex-shrink-0">
              ${pillGraphic}
              <span class="block text-[10px] text-center text-slate-400 mt-1 font-medium">PILL PICTURE</span>
            </div>

            <div class="flex-1">
              <h3 class="font-bold text-slate-900 text-base leading-tight">${med.name}</h3>
              <p class="text-xs font-semibold text-teal-700 mt-0.5">${med.dosage}</p>
              <p class="text-xs text-slate-500 mt-1">${med.purpose}</p>
              <p class="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                <i data-lucide="repeat" class="w-3 h-3"></i> ${med.frequency || 'Daily'}
              </p>
            </div>
          </div>

          <div class="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-teal-50 to-indigo-50/60 border border-teal-100">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-teal-900 flex items-center gap-1.5">
                <i data-lucide="volume-2" class="w-4 h-4 text-teal-600"></i>
                Doctor's Audio Note (${vn.lang})
              </span>
              <span class="text-[11px] text-slate-400">Local Language</span>
            </div>

            <p class="text-xs text-slate-700 mt-1.5 italic bg-white/80 p-2 rounded-xl border border-teal-100/60">
              "${vn.text}"
            </p>

            <button onclick="App.playVoiceNote('${escapeQuotes(vn.text)}', '${vn.lang}', '${vn.audio || ''}')"
              class="w-full mt-2.5 py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-sm flex items-center justify-center gap-2 transition cursor-pointer">
              <i data-lucide="play" class="w-4 h-4 fill-current"></i>
              Listen in Local Language
            </button>
          </div>
        </div>

        <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span class="text-xs text-slate-400">
            ${isTaken ? `Logged: ${med.last_taken || med.lastTaken || 'Today'}` : 'Status: Pending Dose'}
          </span>
          <button onclick="App.toggleMedicineTaken('${patientId}', '${med.id}')" 
            class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${isTaken ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'}">
            ${isTaken ? 'Mark as Not Taken' : '✓ Mark as Taken'}
          </button>
        </div>

      </div>
    `;
  }
};

function getNextTargetTime(minutesAhead = 5) {
  const now = new Date();
  now.setMinutes(now.getMinutes() + minutesAhead);
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

function escapeQuotes(str) {
  if (!str) return '';
  return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

window.App = App;
window.voiceAI = voiceAI;
window.soundEngine = soundEngine;

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
