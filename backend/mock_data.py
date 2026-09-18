"""
Mock data fallback for ClinicConnect.
Provides zero-demo-risk pre-computed responses in English ('en'), Hindi ('hi'), and Gujarati ('gu')
for sample CBC/Lipid test (Hemoglobin: 10.1 g/dL, Fasting Sugar: 95 mg/dL, Total Cholesterol: 245 mg/dL).
"""

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
    
    base_plan = MOCK_CARE_PLANS[lang]
    # Return deep copy so caller can manipulate if needed
    import copy
    return copy.deepcopy(base_plan)
