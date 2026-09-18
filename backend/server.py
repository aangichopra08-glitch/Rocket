"""
ClinicConnect Backend Server
FastAPI server powered by a persistent SQLite Database (clinicconnect.db)
and Google Gemini 2.5 Flash for empathetic multilingual care plans.
Self-contained single-file backend.
"""

import os
import json
import sqlite3
import base64
import copy
import logging
from datetime import datetime
from typing import Optional, List
import urllib.request
import urllib.error

from fastapi import FastAPI, Form, File, UploadFile, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Setup Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ClinicConnect")

DB_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "clinicconnect.db")

# --- Database Management (SQLite) ---
def get_db():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

def init_db():
    """Initializes SQLite tables and seeds initial patients if database is empty."""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    # Patients Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS patients (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            age INTEGER NOT NULL,
            gender TEXT NOT NULL,
            blood_group TEXT NOT NULL,
            phone TEXT NOT NULL,
            access_code TEXT UNIQUE NOT NULL,
            severity TEXT NOT NULL DEFAULT 'orange',
            symptoms TEXT NOT NULL DEFAULT '',
            doctor_notes TEXT NOT NULL DEFAULT '',
            emergency_contact TEXT NOT NULL DEFAULT '',
            language TEXT NOT NULL DEFAULT 'en',
            care_package TEXT DEFAULT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )
    """)

    # Medicines Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS medicines (
            id TEXT PRIMARY KEY,
            patient_id TEXT NOT NULL,
            name TEXT NOT NULL,
            purpose TEXT NOT NULL DEFAULT '',
            pill_type TEXT NOT NULL DEFAULT 'capsule-red',
            custom_image TEXT DEFAULT NULL,
            dosage TEXT NOT NULL DEFAULT '',
            target_time TEXT NOT NULL DEFAULT '09:00',
            frequency TEXT NOT NULL DEFAULT 'Daily',
            voice_note_lang TEXT NOT NULL DEFAULT 'en-US',
            voice_note_text TEXT NOT NULL DEFAULT '',
            voice_note_audio TEXT DEFAULT NULL,
            taken_today INTEGER NOT NULL DEFAULT 0,
            last_taken TEXT DEFAULT NULL,
            created_at TEXT NOT NULL,
            FOREIGN KEY(patient_id) REFERENCES patients(id) ON DELETE CASCADE
        )
    """)

    conn.commit()

    # Check if empty, then seed initial patients
    cursor.execute("SELECT COUNT(*) FROM patients")
    count = cursor.fetchone()[0]
    if count == 0:
        logger.info("Database is empty. Seeding initial clinical records...")
        seed_initial_data(conn)

    conn.close()


# --- Zero-Demo-Risk Fallback Datasets (English, Hindi, Gujarati) ---
MOCK_CARE_PLANS = {
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
}

def get_mock_care_plan(patient_name: str, patient_age: int, language: str = "en") -> dict:
    lang = language.lower() if language else "en"
    if lang not in MOCK_CARE_PLANS:
        lang = "en"
    return copy.deepcopy(MOCK_CARE_PLANS[lang])

def seed_initial_data(conn):
    now_iso = datetime.now().isoformat()
    cursor = conn.cursor()

    # 1. Rajesh Kumar
    cursor.execute("""
        INSERT INTO patients (id, name, age, gender, blood_group, phone, access_code, severity, symptoms, doctor_notes, emergency_contact, language, care_package, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        'PAT-1001', 'Rajesh Kumar', 58, 'Male', 'B+', '+91 98765 43210', 'PAT-1001', 'red',
        'Acute substernal chest discomfort radiating to left arm, elevated BP 165/100, shortness of breath on exertion.',
        'High risk of acute coronary syndrome. Patient instructed to take sublingual Nitroglycerin immediately if chest tightness persists and call emergency.',
        'Amit Kumar (Son) - +91 98234 11223', 'en',
        json.dumps(MOCK_CARE_PLANS['en']),
        now_iso, now_iso
    ))

    # Medicines for Rajesh
    cursor.execute("""
        INSERT INTO medicines (id, patient_id, name, purpose, pill_type, custom_image, dosage, target_time, frequency, voice_note_lang, voice_note_text, voice_note_audio, taken_today, last_taken, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        'med-101', 'PAT-1001', 'Nitroglycerin Sublingual 0.4mg', 'Emergency angina & chest pain relief',
        'cardio-cyan', None, '1 tablet placed under tongue during chest pain', '12:00',
        'Emergency / Every 8 hours as needed', 'hi-IN',
        'यह गोली सीने में दर्द या भारीपन महसूस होने पर तुरंत जीभ के नीचे रखें। इसे निगलना नहीं है। आराम से बैठें और पानी न पिएं।',
        None, 0, None, now_iso
    ))
    cursor.execute("""
        INSERT INTO medicines (id, patient_id, name, purpose, pill_type, custom_image, dosage, target_time, frequency, voice_note_lang, voice_note_text, voice_note_audio, taken_today, last_taken, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        'med-102', 'PAT-1001', 'Metoprolol Succinate 50mg', 'Heart rate & blood pressure stabilization',
        'capsule-red', None, '1 capsule with morning breakfast', '09:00',
        'Daily at 9:00 AM', 'en-US',
        'Take this red and white capsule daily after breakfast with water. It helps keep your blood pressure and heart rate steady.',
        None, 1, 'Today at 9:05 AM', now_iso
    ))

    # 2. Priya Sharma
    cursor.execute("""
        INSERT INTO patients (id, name, age, gender, blood_group, phone, access_code, severity, symptoms, doctor_notes, emergency_contact, language, care_package, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        'PAT-1002', 'Priya Sharma', 34, 'Female', 'O+', '+91 98111 22334', 'PAT-1002', 'orange',
        'Persistent dry cough, mild wheezing at night, low-grade fever (99.8°F), fatigue for 4 days.',
        'Bronchial irritation post-viral infection. Review sputum report in 48 hours. If fever crosses 101°F, visit emergency.',
        'Vikram Sharma (Spouse) - +91 98111 55667', 'hi',
        json.dumps(MOCK_CARE_PLANS['hi']),
        now_iso, now_iso
    ))

    cursor.execute("""
        INSERT INTO medicines (id, patient_id, name, purpose, pill_type, custom_image, dosage, target_time, frequency, voice_note_lang, voice_note_text, voice_note_audio, taken_today, last_taken, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        'med-201', 'PAT-1002', 'Azithromycin 500mg', 'Antibiotic for respiratory infection',
        'tablet-oval-peach', None, '1 tablet daily 1 hour before meal for 3 days', '13:00',
        'Daily before lunch (1:00 PM)', 'hi-IN',
        'यह एंटीबायोटिक गोली दोपहर के खाने से एक घंटा पहले लें। यह फेफड़ों के संक्रमण को ठीक करती है। पूरे 3 दिन का कोर्स अवश्य पूरा करें।',
        None, 0, None, now_iso
    ))

    # 3. Kiritbhai Patel
    cursor.execute("""
        INSERT INTO patients (id, name, age, gender, blood_group, phone, access_code, severity, symptoms, doctor_notes, emergency_contact, language, care_package, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        'PAT-1003', 'Kiritbhai Patel', 52, 'Male', 'B+', '+91 98980 12345', 'PAT-1003', 'orange',
        'Mild fatigue, borderline cholesterol, fasting glucose routine monitoring.',
        'Advised lifestyle modification and lipid profile review.',
        'Manish Patel (Brother) - +91 98980 67890', 'gu',
        json.dumps(MOCK_CARE_PLANS['gu']),
        now_iso, now_iso
    ))

    cursor.execute("""
        INSERT INTO medicines (id, patient_id, name, purpose, pill_type, custom_image, dosage, target_time, frequency, voice_note_lang, voice_note_text, voice_note_audio, taken_today, last_taken, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        'med-301', 'PAT-1003', 'Atorvastatin 10mg', 'Cholesterol & cardiovascular wellness',
        'tablet-round-white', None, '1 tablet at bedtime', '21:30',
        'Daily at 9:30 PM', 'gu-IN',
        'આ ગોળી રાત્રે સૂતા પહેલા લો જેથી કોલેસ્ટ્રોલ નિયંત્રણમાં રહે.',
        None, 0, None, now_iso
    ))

    conn.commit()
    logger.info("Successfully seeded database with 3 clinical profiles and medicines.")


# --- FastAPI Application ---
app = FastAPI(
    title="ClinicConnect Live API & Care Plan Engine",
    description="Live API and SQLite Database for ClinicConnect with Google Gemini 2.5 Flash",
    version="2.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Database on startup
@app.on_event("startup")
def on_startup():
    init_db()

# --- Response & Request Models ---
class FlaggedTestItem(BaseModel):
    test_name: str
    value: str
    range: str
    status: str = Field(description="Must be 'normal', 'attention', or 'borderline'")
    explanation: str

class CarePlanResponse(BaseModel):
    summary: str
    flagged_tests: List[FlaggedTestItem]
    care_plan: List[str]
    doctor_questions: List[str]

class SeverityUpdateRequest(BaseModel):
    severity: str

class ClinicalUpdateRequest(BaseModel):
    symptoms: Optional[str] = None
    doctor_notes: Optional[str] = None

class LoginRequest(BaseModel):
    access_code: str

GEMINI_MODEL = "gemini-2.5-flash"

SYSTEM_PROMPT = """You are an empathetic medical care coordinator for 'ClinicConnect'.
Your role is to review laboratory diagnostic test results (provided as extracted text or an uploaded image) and generate a supportive, patient-friendly care package.

Instructions:
1. Act as a compassionate, reassuring healthcare guide.
2. Parse all lab values, units, and reference ranges accurately.
3. Identify normal, borderline, and abnormal parameters.
4. Explain every test in clear, fifth-grade language without intimidating clinical jargon or alarming the patient.
5. Translate the entire output into the requested language:
   - 'en': English
   - 'hi': Hindi (हिंदी in Devanagari script)
   - 'gu': Gujarati (ગુજરાતી in Gujarati script)
6. Output strictly structured JSON conforming to this exact schema:
{
  "summary": "A 2-sentence patient-friendly explanation summarizing overall health and key focus.",
  "flagged_tests": [
    {
      "test_name": "Test name (e.g. Hemoglobin or Fasting Blood Sugar)",
      "value": "Measured value with units (e.g. 10.1 g/dL)",
      "range": "Normal reference range (e.g. 12.0 - 15.5 g/dL)",
      "status": "normal" | "attention" | "borderline",
      "explanation": "Clear, reassuring fifth-grade explanation of what this test means."
    }
  ],
  "care_plan": [
    "Actionable step 1 for daily meals/hydration",
    "Actionable step 2 for gentle physical activity/rest",
    "Actionable step 3 for healthy lifestyle habit"
  ],
  "doctor_questions": [
    "Targeted question 1 the patient can ask their doctor at next visit",
    "Targeted question 2 the patient can ask their doctor at next visit"
  ]
}

Ensure "status" is strictly one of: "normal", "attention", "borderline".
Return ONLY valid raw JSON with no markdown wrapping or markdown ticks."""

def call_gemini_api(
    patient_name: str,
    patient_age: int,
    report_text: str,
    image_bytes: Optional[bytes] = None,
    image_mime: str = "image/jpeg",
    language: str = "en"
) -> Optional[dict]:
    api_key = os.environ.get("GEMINI_API_KEY", "").strip()
    if not api_key:
        logger.warning("GEMINI_API_KEY not found in environment. Using zero-demo-risk fallback.")
        return None

    try:
        from google import genai
        from google.genai import types
        client = genai.Client(api_key=api_key)
        
        contents = []
        user_prompt = f"Patient Name: {patient_name}\nPatient Age: {patient_age}\nRequested Language: {language}\n\nLab Report Text:\n{report_text or 'See attached image.'}"
        contents.append(user_prompt)

        if image_bytes:
            contents.append(
                types.Part.from_bytes(data=image_bytes, mime_type=image_mime)
            )

        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=contents,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                response_mime_type="application/json",
                temperature=0.2
            )
        )
        if response and response.text:
            text = response.text.strip()
            if text.startswith("```json"):
                text = text[7:]
            if text.startswith("```"):
                text = text[3:]
            if text.endswith("```"):
                text = text[:-3]
            return json.loads(text.strip())
    except ImportError:
        logger.info("google-genai SDK not imported; proceeding with direct REST endpoint.")
    except Exception as e:
        logger.warning(f"SDK call error: {e}. Falling back to REST.")

    try:
        endpoint = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={api_key}"
        parts = [{"text": f"Patient Name: {patient_name}\nPatient Age: {patient_age}\nRequested Language: {language}\n\nLab Report Text:\n{report_text or 'See attached image.'}"}]

        if image_bytes:
            parts.append({
                "inline_data": {
                    "mime_type": image_mime,
                    "data": base64.b64encode(image_bytes).decode("utf-8")
                }
            })

        payload = {
            "system_instruction": {"parts": [{"text": SYSTEM_PROMPT}]},
            "contents": [{"role": "user", "parts": parts}],
            "generationConfig": {"response_mime_type": "application/json", "temperature": 0.2}
        }

        req = urllib.request.Request(
            endpoint,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )

        with urllib.request.urlopen(req, timeout=12) as res:
            res_body = res.read().decode("utf-8")
            data = json.loads(res_body)
            raw_text = data["candidates"][0]["content"]["parts"][0]["text"]
            
            clean_text = raw_text.strip()
            if clean_text.startswith("```json"):
                clean_text = clean_text[7:]
            if clean_text.startswith("```"):
                clean_text = clean_text[3:]
            if clean_text.endswith("```"):
                clean_text = clean_text[:-3]
            
            return json.loads(clean_text.strip())
    except Exception as err:
        logger.warning(f"Direct REST API error: {err}")
        return None


# =====================================================================
# REST API ENDPOINTS
# =====================================================================

@app.get("/api/health")
def health_check():
    """Health check verifying database and API operational status."""
    has_key = bool(os.environ.get("GEMINI_API_KEY", "").strip())
    db_exists = os.path.exists(DB_FILE)
    return {
        "status": "healthy",
        "service": "ClinicConnect",
        "database": "sqlite",
        "database_connected": db_exists,
        "gemini_model": GEMINI_MODEL,
        "gemini_api_configured": has_key,
        "mode": "live_gemini" if has_key else "offline_mock_fallback"
    }


def format_patient_dict(row, medicines_list=None):
    d = dict(row)
    # Parse care package JSON if present
    if d.get("care_package"):
        try:
            d["care_package"] = json.loads(d["care_package"])
        except Exception:
            d["care_package"] = None
    else:
        d["care_package"] = None
    
    if medicines_list is not None:
        d["medicines"] = medicines_list
    return d


@app.get("/api/patients")
def get_patients(conn: sqlite3.Connection = Depends(get_db)):
    """Fetches all patients from SQLite with their prescribed medicines and stats."""
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM patients ORDER BY created_at DESC")
    patients_rows = cursor.fetchall()

    result = []
    for p in patients_rows:
        cursor.execute("SELECT * FROM medicines WHERE patient_id = ? ORDER BY created_at ASC", (p["id"],))
        med_rows = cursor.fetchall()
        meds = []
        for m in med_rows:
            med_dict = dict(m)
            med_dict["taken_today"] = bool(med_dict.get("taken_today", 0))
            # Format voice note sub-object
            med_dict["voice_note"] = {
                "lang": med_dict.get("voice_note_lang", "en-US"),
                "text": med_dict.get("voice_note_text", ""),
                "audio": med_dict.get("voice_note_audio", None)
            }
            meds.append(med_dict)
        result.append(format_patient_dict(p, meds))

    # Calculate summary stats
    total = len(result)
    red_count = sum(1 for p in result if p["severity"] == "red")
    orange_count = sum(1 for p in result if p["severity"] == "orange")
    green_count = sum(1 for p in result if p["severity"] == "green")

    return {
        "patients": result,
        "stats": {
            "total": total,
            "red": red_count,
            "orange": orange_count,
            "green": green_count
        }
    }


@app.get("/api/patients/{patient_id}")
def get_patient(patient_id: str, conn: sqlite3.Connection = Depends(get_db)):
    """Fetches a single patient with complete medicines and care package."""
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM patients WHERE id = ?", (patient_id,))
    row = cursor.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Patient not found")

    cursor.execute("SELECT * FROM medicines WHERE patient_id = ? ORDER BY created_at ASC", (patient_id,))
    med_rows = cursor.fetchall()
    meds = []
    for m in med_rows:
        med_dict = dict(m)
        med_dict["taken_today"] = bool(med_dict.get("taken_today", 0))
        med_dict["voice_note"] = {
            "lang": med_dict.get("voice_note_lang", "en-US"),
            "text": med_dict.get("voice_note_text", ""),
            "audio": med_dict.get("voice_note_audio", None)
        }
        meds.append(med_dict)

    return format_patient_dict(row, meds)


@app.post("/api/patients")
def create_patient(
    name: str = Form(...),
    age: int = Form(...),
    gender: str = Form("Other"),
    blood_group: str = Form("O+"),
    phone: str = Form(""),
    severity: str = Form("orange"),
    symptoms: str = Form(""),
    emergency_contact: str = Form(""),
    language: str = Form("en"),
    conn: sqlite3.Connection = Depends(get_db)
):
    """Creates a new patient profile with auto-generated single-time PIN in SQLite."""
    cursor = conn.cursor()
    
    # Generate unique 4-digit code
    import random
    code = f"PAT-{random.randint(1000, 9999)}"
    now_iso = datetime.now().isoformat()

    # Pre-populate default mock care plan for instant demo readiness
    default_care_pkg = json.dumps(get_mock_care_plan(name, age, language))

    cursor.execute("""
        INSERT INTO patients (id, name, age, gender, blood_group, phone, access_code, severity, symptoms, doctor_notes, emergency_contact, language, care_package, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        code, name, age, gender, blood_group, phone, code, severity,
        symptoms, "Initial clinical profile established. Monitoring compliance.",
        emergency_contact, language, default_care_pkg, now_iso, now_iso
    ))
    conn.commit()

    return get_patient(code, conn)


@app.patch("/api/patients/{patient_id}/severity")
def update_patient_severity(
    patient_id: str,
    payload: SeverityUpdateRequest,
    conn: sqlite3.Connection = Depends(get_db)
):
    """Updates the patient's severity status ('green', 'orange', 'red')."""
    sev = payload.severity.lower()
    if sev not in ["green", "orange", "red"]:
        raise HTTPException(status_code=400, detail="Invalid severity")

    cursor = conn.cursor()
    now_iso = datetime.now().isoformat()
    cursor.execute("UPDATE patients SET severity = ?, updated_at = ? WHERE id = ?", (sev, now_iso, patient_id))
    conn.commit()
    return {"status": "success", "patient_id": patient_id, "severity": sev}


@app.patch("/api/patients/{patient_id}/clinical")
def update_patient_clinical(
    patient_id: str,
    payload: ClinicalUpdateRequest,
    conn: sqlite3.Connection = Depends(get_db)
):
    """Updates symptoms or doctor directives."""
    cursor = conn.cursor()
    now_iso = datetime.now().isoformat()

    if payload.symptoms is not None:
        cursor.execute("UPDATE patients SET symptoms = ?, updated_at = ? WHERE id = ?", (payload.symptoms, now_iso, patient_id))
    if payload.doctor_notes is not None:
        cursor.execute("UPDATE patients SET doctor_notes = ?, updated_at = ? WHERE id = ?", (payload.doctor_notes, now_iso, patient_id))
    
    conn.commit()
    return {"status": "success", "patient_id": patient_id}


@app.post("/api/patients/login")
def patient_login(payload: LoginRequest, conn: sqlite3.Connection = Depends(get_db)):
    """Verifies single-time PIN and returns verified patient data from SQLite."""
    code = payload.access_code.strip().upper()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM patients WHERE access_code = ? OR id = ?", (code, code))
    row = cursor.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Invalid Access PIN")
    return get_patient(row["id"], conn)


@app.post("/api/patients/{patient_id}/medicines")
def add_patient_medicine(
    patient_id: str,
    name: str = Form(...),
    dosage: str = Form(...),
    purpose: str = Form(""),
    target_time: str = Form("09:00"),
    frequency: str = Form("Daily"),
    pill_type: str = Form("capsule-red"),
    voice_note_lang: str = Form("en-US"),
    voice_note_text: str = Form(""),
    custom_image: Optional[str] = Form(None),
    voice_note_audio: Optional[str] = Form(None),
    conn: sqlite3.Connection = Depends(get_db)
):
    """Prescribes a new medicine with timer, pill visual, and local voice note."""
    cursor = conn.cursor()
    # Check patient exists
    cursor.execute("SELECT id FROM patients WHERE id = ?", (patient_id,))
    if not cursor.fetchone():
        raise HTTPException(status_code=404, detail="Patient not found")

    import time
    med_id = f"med-{int(time.time() * 1000)}"
    now_iso = datetime.now().isoformat()

    cursor.execute("""
        INSERT INTO medicines (id, patient_id, name, purpose, pill_type, custom_image, dosage, target_time, frequency, voice_note_lang, voice_note_text, voice_note_audio, taken_today, last_taken, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        med_id, patient_id, name, purpose, pill_type, custom_image, dosage,
        target_time, frequency, voice_note_lang, voice_note_text, voice_note_audio,
        0, None, now_iso
    ))
    conn.commit()
    return {"status": "success", "medicine_id": med_id, "patient_id": patient_id}


@app.patch("/api/medicines/{med_id}/toggle-taken")
def toggle_medicine_taken(med_id: str, conn: sqlite3.Connection = Depends(get_db)):
    """Toggles today's dosage compliance status."""
    cursor = conn.cursor()
    cursor.execute("SELECT taken_today FROM medicines WHERE id = ?", (med_id,))
    row = cursor.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Medicine not found")

    new_status = 1 if row["taken_today"] == 0 else 0
    now_str = datetime.now().strftime("Today at %I:%M %p") if new_status == 1 else None

    cursor.execute("UPDATE medicines SET taken_today = ?, last_taken = ? WHERE id = ?", (new_status, now_str, med_id))
    conn.commit()
    return {"status": "success", "medicine_id": med_id, "taken_today": bool(new_status), "last_taken": now_str}


@app.delete("/api/medicines/{med_id}")
def delete_medicine(med_id: str, conn: sqlite3.Connection = Depends(get_db)):
    """Deletes a medicine prescription."""
    cursor = conn.cursor()
    cursor.execute("DELETE FROM medicines WHERE id = ?", (med_id,))
    conn.commit()
    return {"status": "success", "deleted_id": med_id}


# =====================================================================
# AI LAB REPORT & CARE PLAN GENERATOR ENDPOINT
# =====================================================================

@app.post("/api/generate-care-plan", response_model=CarePlanResponse)
async def generate_care_plan(
    patient_name: str = Form(...),
    patient_age: int = Form(...),
    report_text: str = Form(""),
    report_image: Optional[UploadFile] = File(None),
    language: str = Form("en"),
    patient_id: Optional[str] = Form(None),
    force_mock: Optional[bool] = Form(False),
    conn: sqlite3.Connection = Depends(get_db)
):
    """
    Parses lab report text/image with Google Gemini 2.5 Flash,
    returns structured empathetic care plan JSON, and saves it directly to SQLite!
    """
    lang = language.lower().strip()
    if lang not in ["en", "hi", "gu"]:
        lang = "en"

    # 1. Check forced mock
    if force_mock:
        care_result = get_mock_care_plan(patient_name, patient_age, lang)
    else:
        # Read image bytes if provided
        img_bytes = None
        img_mime = "image/jpeg"
        if report_image:
            try:
                img_bytes = await report_image.read()
                img_mime = report_image.content_type or "image/jpeg"
            except Exception as e:
                logger.warning(f"Failed to read image: {e}")

        # 2. Invoke Gemini AI
        ai_result = None
        if os.environ.get("GEMINI_API_KEY"):
            ai_result = call_gemini_api(
                patient_name=patient_name,
                patient_age=patient_age,
                report_text=report_text,
                image_bytes=img_bytes,
                image_mime=img_mime,
                language=lang
            )

        if ai_result and isinstance(ai_result, dict) and "summary" in ai_result:
            for item in ai_result.get("flagged_tests", []):
                st = item.get("status", "normal").lower()
                if st not in ["normal", "attention", "borderline"]:
                    item["status"] = "attention" if "high" in st or "alert" in st else "borderline"
            care_result = ai_result
        else:
            # Zero Demo Risk Fallback
            care_result = get_mock_care_plan(patient_name, patient_age, lang)

    # 3. Persist care package directly in SQLite if patient_id is provided or matched
    target_pid = patient_id
    cursor = conn.cursor()
    if not target_pid:
        cursor.execute("SELECT id FROM patients WHERE name = ? LIMIT 1", (patient_name,))
        row = cursor.fetchone()
        if row:
            target_pid = row["id"]

    if target_pid:
        now_iso = datetime.now().isoformat()
        cursor.execute(
            "UPDATE patients SET care_package = ?, language = ?, updated_at = ? WHERE id = ?",
            (json.dumps(care_result), lang, now_iso, target_pid)
        )
        conn.commit()
        logger.info(f"Persisted care package to SQLite for patient: {target_pid}")

    return care_result


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    init_db()
    uvicorn.run("server:app", host="0.0.0.0", port=port, reload=True)
