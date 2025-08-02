import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    appTitle: "SerenitySaathi",
    appSubtitle: "Your friendly mental health companion. A safe space for empathetic conversations and wellness resources.",
    
    chat: "Chat",
    mood: "Mood",
    breathe: "Breathe",
    resources: "Resources",
    crisis: "Crisis",
    
    welcomeMessage: "Hello! I'm Mitra, your friendly mental health companion. I'm here to listen and chat with you. How are you feeling today?",
    placeholder: "Type your message here...",
    tryStartingWith: "Try starting with:",
    exportChat: "Export Chat",
    clearChat: "Clear Chat",
    chatHistory: "Chat History",
    newChat: "New Chat",
    noChatHistory: "No chat history yet",
    startConversation: "Start a conversation to see it here",
    clearAllHistory: "Clear All History",
    clearConfirm: "Are you sure you want to clear all chat history? This action cannot be undone.",
    clearChatConfirm: "Are you sure you want to clear the chat history?",
    
    suggestions: [
      "I'm feeling anxious today",
      "I need help with stress",
      "I'm having trouble sleeping",
      "I feel overwhelmed",
      "I want to talk about my feelings"
    ],
    
    moodTitle: "How are you feeling today?",
    moodSubtitle: "Track your mood to understand your emotional patterns",
    saveMoodEntry: "Save Mood Entry",
    intensity: "Intensity",
    notes: "Notes (optional)",
    notesPlaceholder: "What's on your mind?",
    low: "Low",
    high: "High",
    moodInsights: "Your Mood Insights",
    entriesThisWeek: "Entries this week",
    averageIntensity: "Average intensity",
    mostFrequentMood: "Most frequent mood",
    
    moods: [
      { id: 'happy', emoji: '😊', label: 'Happy' },
      { id: 'excited', emoji: '🤩', label: 'Excited' },
      { id: 'loved', emoji: '🥰', label: 'Loved' },
      { id: 'neutral', emoji: '😐', label: 'Neutral' },
      { id: 'sad', emoji: '😔', label: 'Sad' },
      { id: 'anxious', emoji: '😰', label: 'Anxious' }
    ],
    
    breathingTitle: "Breathing Exercise",
    breathingSubtitle: "Take a moment to breathe mindfully and find your calm",
    startExercise: "Start Exercise",
    pause: "Pause",
    reset: "Reset",
    numberOfCycles: "Number of Cycles",
    instructions: "Instructions",
    breathingInstructions: [
      "Find a comfortable position",
      "Close your eyes and focus on your breath",
      "Follow the visual guide and timing",
      "Practice regularly for best results"
    ],
    
    breathingPatterns: [
      {
        id: 'box',
        name: 'Box Breathing',
        description: 'Equal inhale, hold, exhale, hold (4-4-4-4)'
      },
      {
        id: '478',
        name: '4-7-8 Breathing',
        description: 'Inhale 4, hold 7, exhale 8'
      },
      {
        id: 'deep',
        name: 'Deep Breathing',
        description: 'Slow, deep breaths (6-2-6-2)'
      }
    ],
    
    crisisTitle: "Crisis Support",
    crisisSubtitle: "If you're in crisis, help is available 24/7",
    immediateActions: "Immediate Actions",
    crisisDescription: "If you're experiencing thoughts of self-harm or suicide, please reach out immediately.",
    callNow: "Call Now",
    
    footerText: "SerenitySaathi is not a substitute for professional mental health care. If you're experiencing a crisis, please contact emergency services immediately.",
    
    disclaimerTitle: "Welcome to SerenitySaathi",
    disclaimerText: "Mitra is an AI-powered mental health companion designed to provide supportive conversations and wellness resources. Please note that this is not a substitute for professional mental health care.",
    disclaimerPoints: [
      "This is not a replacement for professional therapy or medical advice",
      "If you're in crisis, please contact emergency services immediately",
      "Your conversations are private and not stored on our servers",
      "This tool is designed to provide general support and resources"
    ],
    accept: "I Understand & Accept",
    
    // Error messages
    apiError: "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
    
    // AI prompts - English version
    aiPrompt: `You are Mitra, a supportive AI companion for mental wellness conversations. 
    Your role is to be empathetic, non-judgmental, and helpful.
    
    Guidelines:
    - Be supportive and understanding
    - Offer gentle encouragement
    - Suggest practical coping strategies when appropriate
    - Keep responses concise (2-3 sentences max)
    - If someone mentions self-harm or suicide, provide crisis resources
    - Be warm and caring in tone
    
    IMPORTANT: If the user mentions self-harm, suicide, or wanting to end their life, include this crisis support information in your response:
    "If you're having thoughts of self-harm, please call 1800-121-3667 (National Suicide Prevention Helpline) or 112 (Emergency Services) immediately. You matter."
    
    User message: {message}
    
    Please respond as Mitra:`
  },
  
  hi: {
    aiPrompt: `आप मित्र हैं, मानसिक कल्याण बातचीत के लिए एक सहायक AI साथी।
    आपकी भूमिका सहानुभूतिपूर्ण, निर्णय-मुक्त और सहायक होना है।
    
    दिशानिर्देश:
    - सहायक और समझदार बनें
    - कोमल प्रोत्साहन दें
    - उचित होने पर व्यावहारिक मुकाबला रणनीतियां सुझाएं
    - प्रतिक्रियाएं संक्षिप्त रखें (अधिकतम 2-3 वाक्य)
    - यदि कोई आत्महत्या या आत्महत्या का उल्लेख करता है, तो संकट संसाधन प्रदान करें
    - स्वर में गर्म और देखभाल करने वाला बनें
    
    महत्वपूर्ण: यदि उपयोगकर्ता आत्महत्या, आत्महत्या, या अपनी जान लेने की इच्छा का उल्लेख करता है, तो अपनी प्रतिक्रिया में यह संकट सहायता जानकारी शामिल करें:
    "यदि आपके मन में आत्महत्या के विचार हैं, तो कृपया तुरंत 1800-121-3667 (राष्ट्रीय आत्महत्या रोकथाम हेल्पलाइन) या 112 (आपातकालीन सेवाएं) पर कॉल करें। आप महत्वपूर्ण हैं।"
    
    उपयोगकर्ता संदेश: {message}
    
    कृपया मित्र के रूप में जवाब दें:`
  }
};

const detectLanguage = (text) => {
  if (!text || typeof text !== 'string') return 'en';
  
  const hindiChars = text.match(/[\u0900-\u097F]/g) || [];
  const totalChars = text.replace(/\s/g, '').length;
  const hindiPercentage = totalChars > 0 ? (hindiChars.length / totalChars) * 100 : 0;
  
  return hindiPercentage > 30 ? 'hi' : 'en';
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('mitra_language');
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('mitra_language', language);
  }, [language]);

  const detectAndSetLanguage = (userInput) => {
    const detectedLanguage = detectLanguage(userInput);
    setLanguage(detectedLanguage);
    return detectedLanguage;
  };

  const t = (key, params = {}) => {
    let text = translations.en[key] || key;
    
    if (key === 'aiPrompt' && language === 'hi') {
      text = translations.hi[key] || translations.en[key];
    }
    
    Object.keys(params).forEach(param => {
      text = text.replace(`{${param}}`, params[param]);
    });
    
    return text;
  };

  const value = {
    language,
    setLanguage,
    detectAndSetLanguage,
    t,
    translations: translations.en
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 