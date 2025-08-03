import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2, Download, Trash2, History, Plus, X, MessageCircle, Clock } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useLanguage } from '../contexts/LanguageContext';

const ChatInterface = () => {
  const { 
    conversations, 
    currentConversationId, 
    createNewConversation, 
    addMessageToConversation, 
    setCurrentConversation, 
    deleteConversation, 
    clearAllConversations,
    getCurrentConversation,
    isDarkMode,
    isInitialized
  } = useApp();
  const { t, language, detectAndSetLanguage } = useLanguage();
  
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const currentConversation = getCurrentConversation();
  const messages = useMemo(() => currentConversation?.messages || [], [currentConversation]);

  const welcomeMessagesAdded = useRef({});

  useEffect(() => {
    if (!isInitialized) return;

    if (conversations.length === 0) {
      createNewConversation("New Chat");
      return;
    }

    if (!currentConversationId && conversations.length > 0) {
      setCurrentConversation(conversations[0].id);
      return;
    }

    if (currentConversation && 
        currentConversation.messages.length === 0 && 
        !welcomeMessagesAdded.current[currentConversation.id]) {
      const welcomeMsg = t('welcomeMessage') || "Hello! I'm Mitra, your friendly mental health companion. I'm here to listen and chat with you. How are you feeling today?";
      addMessageToConversation(currentConversation.id, welcomeMsg, 'bot');
      welcomeMessagesAdded.current[currentConversation.id] = true;
    }
  }, [isInitialized, conversations, currentConversationId, currentConversation, createNewConversation, setCurrentConversation, addMessageToConversation, t]);

  const suggestions = [
    "I'm feeling anxious",
    "I'm stressed about work", 
    "I'm having trouble sleeping",
    "I feel overwhelmed",
    "I want to learn mindfulness",
    "I'm feeling sad"
  ];

  // Gemini API configuration
  const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
  const GEMINI_API_URL = process.env.REACT_APP_GEMINI_API_URL || "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
  
  if (!GEMINI_API_KEY) {
    throw new Error('Missing Gemini API key. Please check your .env file.');
  }

  const getAIResponse = async (userMessage, detectedLanguage) => {
    try {
      const conversationContext = currentConversation?.messages?.slice(-3) || [];
      const contextText = conversationContext.length > 0 
        ? `\n\nCONVERSATION CONTEXT (last 3 messages):\n${conversationContext.map(msg => `${msg.sender}: ${msg.text}`).join('\n')}`
        : '';

      const enhancedPrompt = `You are Mitra, an advanced AI mental health companion designed to provide empathetic, supportive, and evidence-based responses. 

IMPORTANT GUIDELINES:
- Always respond in the same language as the user's message (${detectedLanguage === 'hi' ? 'Hindi' : 'English'})
- Be warm, empathetic, and non-judgmental
- Provide practical, actionable advice when appropriate
- Use evidence-based mental health techniques (CBT, mindfulness, breathing exercises)
- Include Indian cultural context and references when relevant, but don't overuse cultural greetings
- Never give medical diagnosis or replace professional help
- Encourage professional help for serious concerns
- Keep responses conversational but informative
- Ask follow-up questions to better understand the user's situation
- Provide specific coping strategies and techniques
- Reference previous conversation context when relevant for continuity
- ALWAYS introduce yourself as "Mitra" when asked about your name or identity
- If the user asks "who are you", "what's your name", "introduce yourself", or similar questions, respond with "I'm Mitra, your mental health companion"

RESPONSE STYLE:
- Start with empathy and validation (DO NOT use "Namaste" or similar greetings in every response)
- Provide practical suggestions or techniques
- Include cultural sensitivity for Indian users when appropriate
- End with encouragement and support
- Keep responses between 2-4 sentences for better engagement
- If this is a follow-up to previous concerns, acknowledge the progress or changes
- Use natural, conversational language without forced cultural elements
- Avoid repetitive greetings - focus on the content and support

CONTEXT: This is a mental health support conversation. The user may be experiencing stress, anxiety, depression, or other mental health challenges.${contextText}

User message: "${userMessage}"

SPECIAL INSTRUCTIONS:
- If the user asks about your name, identity, or asks you to introduce yourself, respond with: "I'm Mitra, your mental health companion. I'm here to provide supportive conversations and help you with your mental wellness journey."
- If this is the first message in a conversation, introduce yourself as Mitra

Please provide a supportive, helpful response that follows these guidelines. DO NOT start with "Namaste" or similar greetings unless it's the very first greeting of the conversation.`;

      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: enhancedPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 300,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH", 
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Extract the response text from Gemini
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (aiResponse) {
        return aiResponse;
      } else {
        throw new Error('No response from Gemini API');
      }
    } catch (error) {
      // Enhanced fallback responses if API fails
      const fallbackResponses = detectedLanguage === 'hi' ? [
        "मैं आपकी बात सुन रहा हूं और आपकी भावनाएं पूरी तरह वैध हैं। क्या आप मुझे बता सकते हैं कि आप कैसा महसूस कर रहे हैं? मैं यहां आपका समर्थन करने के लिए हूं।",
        "आपकी भावनाओं को साझा करने के लिए धन्यवाद। यह साहस का काम है। क्या आप चाहेंगे कि हम कुछ सांस लेने के व्यायाम या ध्यान तकनीकों के बारे में बात करें?",
        "मैं समझता हूं कि यह कठिन समय हो सकता है। याद रखें, आप अकेले नहीं हैं। क्या आपको लगता है कि कुछ मिनट का गहरी सांस लेने का अभ्यास मदद कर सकता है?",
        "आपकी भावनाएं मायने रखती हैं। कभी-कभी हमारी परेशानी के बारे में बात करना ही पहला कदम होता है। क्या आप चाहेंगे कि हम कुछ आराम तकनीकों के बारे में बात करें?",
        "मुझे इस पर भरोसा करने के लिए धन्यवाद। यह सामान्य है और आप अकेले नहीं हैं। क्या आपको लगता है कि कुछ स्ट्रेचिंग या हल्का व्यायाम आपको बेहतर महसूस करने में मदद कर सकता है?"
      ] : [
        "I hear you, and your feelings are completely valid. Can you tell me more about how you're feeling? I'm here to support you through this.",
        "Thank you for sharing your feelings with me. It takes courage to open up. Would you like to talk about some breathing exercises or meditation techniques that might help?",
        "I understand this might be a difficult time. Remember, you're not alone in this. Do you think taking a few minutes for some deep breathing exercises might help right now?",
        "Your feelings matter, and I'm glad you're reaching out. Sometimes talking about what's troubling us is the first step toward feeling better. Would you like to explore some relaxation techniques?",
        "I appreciate you trusting me with this. It's completely normal to feel this way, and you're not alone. Do you think some gentle stretching or light exercise might help you feel better?"
      ];
      
      return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    }
  };

     const scrollToBottom = () => {
     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
   };

     useEffect(() => {
     scrollToBottom();
   }, [messages]);

  const handleSendMessage = async (messageText) => {
    if (!messageText.trim()) {
      return;
    }
    
    if (!currentConversationId) {
      createNewConversation("New Chat");
      setTimeout(() => {
        const newConversationId = getCurrentConversation()?.id;
        if (newConversationId) {
          sendMessageToConversation(newConversationId, messageText);
        }
      }, 100);
      return;
    }

    sendMessageToConversation(currentConversationId, messageText);
  };

  const sendMessageToConversation = async (conversationId, messageText) => {
    const detectedLanguage = detectAndSetLanguage(messageText);

    addMessageToConversation(conversationId, messageText, 'user');
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await getAIResponse(messageText, detectedLanguage);
      
      addMessageToConversation(conversationId, response, 'bot');
      
    } catch (error) {
      const errorMessage = t('apiError') || "I'm sorry, I'm having trouble responding right now. Please try again.";
      addMessageToConversation(conversationId, errorMessage, 'bot');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const exportChat = () => {
    if (!currentConversation) return;
    
    const chatText = currentConversation.messages.map(msg => 
              `${msg.sender === 'user' ? 'You' : 'Mitra'}: ${msg.text}`
    ).join('\n\n');
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
            a.download = `mitra-chat-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearCurrentChat = () => {
    if (!currentConversationId) return;
    
    if (window.confirm(t('clearChatConfirm'))) {
      deleteConversation(currentConversationId);
    }
  };

  const startNewChat = () => {
    createNewConversation("New Chat");
  };

  const handleSelectConversation = (conversationId) => {
    setCurrentConversation(conversationId);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const getConversationPreview = (conversation) => {
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    if (!lastMessage) return 'No messages yet';
    
    const text = lastMessage.text;
    return text.length > 40 ? text.substring(0, 40) + '...' : text;
  };

  const formatConversationTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="flex h-[calc(100vh-200px)] gap-2 sm:gap-4 lg:gap-6">
      {/* Chat Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop for mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            
            {/* Sidebar */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-72 sm:w-80 lg:w-96 bg-white dark:bg-gray-900 backdrop-blur-xl shadow-2xl z-50 lg:relative lg:translate-x-0 lg:ml-0 lg:rounded-2xl lg:border lg:border-gray-200/50 dark:lg:border-gray-700/50 lg:h-[calc(100vh-200px)] lg:flex lg:flex-col"
            >
                             {/* Header */}
               <div className="flex items-center justify-between p-3 sm:p-4 lg:p-6 border-b border-gray-200/60 dark:border-gray-700/60 bg-gradient-to-r from-blue-50/80 to-amber-50/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-sm flex-shrink-0">
                 <h2 className="text-base sm:text-lg lg:text-xl font-bold text-blue-600 dark:text-white bg-gradient-to-r from-blue-600 to-amber-600 bg-clip-text text-transparent">
                   {t('chatHistory')}
                 </h2>
                <div className="flex items-center space-x-3">
                                                        <motion.button
                     whileHover={{ scale: 1.05, rotate: 90 }}
                     whileTap={{ scale: 0.95 }}
                     onClick={startNewChat}
                     className="p-3 bg-white/90 dark:bg-gray-800/90 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-white dark:hover:bg-gray-700 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-200/50 dark:border-gray-600/50 backdrop-blur-sm"
                     title="New Chat"
                   >
                     <Plus className="w-5 h-5" />
                   </motion.button>
                                     <motion.button
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                     onClick={() => setIsSidebarOpen(false)}
                     className="p-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
                   >
                     <X className="w-5 h-5" />
                   </motion.button>
                </div>
              </div>

              {/* Clear All Button */}
              {conversations.length > 0 && (
                <div className="p-4 border-b border-gray-200/60 dark:border-gray-700/60 flex-shrink-0">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                                         onClick={() => {
                       if (window.confirm(t('clearConfirm'))) {
                         clearAllConversations();
                         // Don't close sidebar automatically - let user close it manually
                       }
                     }}
                    className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All Conversations
                  </motion.button>
                </div>
              )}

                             {/* Conversations List */}
               <div className="flex-1 overflow-y-auto p-2 sm:p-3 lg:p-4 bg-gray-50 dark:bg-gray-900 min-h-0 max-h-[calc(100vh-400px)] chat-history-scrollbar mobile-scroll">
                {conversations.length === 0 ? (
                  <div className="p-4 sm:p-8 text-center">
                                         <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-100 to-amber-100 dark:from-blue-900/30 dark:to-amber-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                       <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 dark:text-blue-400" />
                     </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                      {t('noChatHistory')}
                    </p>
                    <p className="text-gray-500 dark:text-gray-500 text-xs mt-2">
                      {t('startConversation')}
                    </p>
                  </div>
                ) : (
                                     <div className="space-y-3">
                     {[...conversations].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).map((conversation) => (
                      <motion.div
                        key={conversation.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                                                 className={`group rounded-2xl cursor-pointer transition-all duration-300 ${
                           currentConversationId === conversation.id
                             ? 'bg-white dark:bg-gray-800 border-2 border-blue-500 dark:border-blue-400 shadow-lg relative overflow-hidden'
                             : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300/30 dark:hover:border-blue-600/30 shadow-md hover:shadow-lg'
                         }`}
                      >
                                                 <div 
                           className="p-4 relative"
                           onClick={() => handleSelectConversation(conversation.id)}
                         >
                                                       {/* Active indicator for current conversation */}
                            {currentConversationId === conversation.id && (
                              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 dark:bg-blue-400 rounded-l-2xl"></div>
                            )}
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-3 mb-2">
                                                                 <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                                   currentConversationId === conversation.id
                                     ? 'bg-blue-500 dark:bg-blue-400 shadow-lg'
                                     : 'bg-gray-200 dark:bg-gray-700'
                                 }`}>
                                   <MessageCircle className={`w-4 h-4 ${
                                     currentConversationId === conversation.id
                                       ? 'text-white'
                                       : 'text-gray-500 dark:text-gray-400'
                                   }`} />
                                 </div>
                                                                                                  <h3 className={`text-sm font-semibold truncate ${
                                   currentConversationId === conversation.id
                                     ? 'text-blue-600 dark:text-blue-300 font-bold'
                                     : 'text-gray-800 dark:text-white'
                                 }`}>
                                   {conversation.title}
                                 </h3>
                              </div>
                                                                                            <p className={`text-xs truncate mb-3 ${
                                 currentConversationId === conversation.id
                                   ? 'text-blue-500 dark:text-blue-400 font-medium'
                                   : 'text-gray-600 dark:text-gray-400'
                               }`}>
                                 {getConversationPreview(conversation)}
                               </p>
                                                             <div className="flex items-center space-x-3">
                                 <div className="flex items-center space-x-1">
                                   <Clock className={`w-3 h-3 ${
                                     currentConversationId === conversation.id
                                       ? 'text-blue-500 dark:text-blue-400'
                                       : 'text-gray-400'
                                   }`} />
                                                                       <span className={`text-xs font-medium ${
                                      currentConversationId === conversation.id
                                        ? 'text-blue-500 dark:text-blue-400'
                                        : 'text-gray-400'
                                    }`}>
                                      {formatConversationTime(conversation.updatedAt)}
                                    </span>
                                 </div>
                                                                   <span className={`text-xs font-medium ${
                                    currentConversationId === conversation.id
                                      ? 'text-blue-500 dark:text-blue-400'
                                      : 'text-gray-400'
                                  }`}>
                                    {conversation.messages.length} messages
                                  </span>
                               </div>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1, rotate: 12 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm('Are you sure you want to delete this conversation?')) {
                                  deleteConversation(conversation.id);
                                }
                              }}
                              className="p-2 text-gray-400 hover:text-red-500 transition-all duration-300 opacity-0 group-hover:opacity-100 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                              title="Delete conversation"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className={`${isDarkMode ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden h-full flex flex-col border border-gray-200/50 dark:border-gray-700/50`}>
                     {/* Chat Header */}
           <div className={`${isDarkMode ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-r from-blue-500 to-amber-100'} p-3 sm:p-4 lg:p-6 text-white flex-shrink-0 shadow-xl relative overflow-hidden`}>
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="relative flex items-center justify-between">
              <div className="flex items-center flex-1 min-w-0">
                <motion.button
                  whileHover={{ scale: 1.05, rotate: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleSidebar}
                  className="p-2 sm:p-3 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl hover:bg-white/30 transition-all duration-300 mr-2 sm:mr-4 shadow-lg hover:shadow-xl border border-white/20"
                  title="Chat History"
                >
                  <History className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startNewChat}
                  className="p-2 sm:p-3 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl hover:bg-white/30 transition-all duration-300 mr-2 sm:mr-4 shadow-lg hover:shadow-xl border border-white/20"
                  title="New Chat"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.button>
                <div className="bg-white/25 backdrop-blur-sm p-2 sm:p-3 rounded-xl sm:rounded-2xl mr-3 sm:mr-5 shadow-lg border border-white/20">
                  <Bot className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                </div>
                <div className="min-w-0 flex-1">
                                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white drop-shadow-lg truncate">Mitra</h2>
                  <p className="text-white/95 text-xs sm:text-sm font-medium drop-shadow-sm">
                    <span className="hidden sm:inline">Your mental health companion</span>
                    <span className="sm:ml-3 text-xs bg-green-500/30 backdrop-blur-sm px-1.5 sm:px-2 lg:px-3 py-0.5 sm:py-1 rounded-full font-medium border border-green-400/20 text-green-100">
                      🔒 Encrypted
                    </span>
                    {language === 'hi' && (
                      <span className="ml-1.5 sm:ml-2 lg:ml-3 text-xs bg-white/30 backdrop-blur-sm px-1.5 sm:px-2 lg:px-3 py-0.5 sm:py-1 rounded-full font-medium border border-white/20">
                        हिंदी में बातचीत
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex space-x-1 sm:space-x-2 lg:space-x-3 flex-shrink-0">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={exportChat}
                  className="p-2 sm:p-3 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20"
                  title={t('exportChat')}
                >
                  <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearCurrentChat}
                  className="p-2 sm:p-3 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20"
                  title={t('clearChat')}
                >
                  <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Messages Container */}
                     <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4 lg:space-y-6 min-h-0 messages-scrollbar mobile-scroll bg-gradient-to-b from-gray-50/50 to-white/50 dark:from-gray-800/50 dark:to-gray-900/50">
            <AnimatePresence>
              {messages.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center items-center h-full"
                >
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-primary-100 to-mental-100 dark:from-primary-900/30 dark:to-mental-900/30 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <Bot className="w-10 h-10 text-primary-500 dark:text-primary-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3 bg-gradient-to-r from-primary-600 to-mental-600 bg-clip-text text-transparent">
                      Welcome to SerenitySaathi!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-lg font-medium max-w-md mx-auto leading-relaxed">
                      I'm here to listen and chat with you. How are you feeling today?
                    </p>
                  </div>
                </motion.div>
              ) : (
                                 messages.map((message) => (
                   <motion.div
                     key={message.id}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -20 }}
                     className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                   >
                    <div className={`flex items-start max-w-[260px] sm:max-w-xs lg:max-w-md ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                                                                                                                          <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg ${
                           message.sender === 'user' 
                             ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white ml-2 sm:ml-3' 
                             : 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-200 mr-2 sm:mr-3'
                       }`}>
                         {message.sender === 'user' ? <User className="w-4 h-4 sm:w-5 sm:h-5" /> : <Bot className="w-4 h-4 sm:w-5 sm:h-5" />}
                       </div>
                                             <div className={`rounded-2xl sm:rounded-3xl px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 shadow-lg backdrop-blur-sm ${
                         message.sender === 'user' 
                           ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-200' 
                           : 'bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-white border border-gray-200/50 dark:border-gray-700/50'
                       }`}>
                        <p className="text-xs sm:text-sm leading-relaxed font-medium break-words">{message.text}</p>
                                                                                                    <p className={`text-xs mt-2 sm:mt-3 font-medium ${
                             message.sender === 'user' 
                               ? 'text-blue-600' 
                               : 'text-gray-500 dark:text-gray-400'
                           }`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>

            {/* Typing Indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex items-start">
                  <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-600 dark:text-gray-300 w-10 h-10 rounded-2xl flex items-center justify-center mr-3 shadow-lg">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="bg-white/90 dark:bg-gray-800/90 rounded-3xl px-6 py-4 shadow-lg backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-primary-500 rounded-full animate-bounce"></div>
                      <div className="w-3 h-3 bg-mental-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-3 h-3 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Suggestions - Only show when there's just the welcome message */}
            {messages.length === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex items-start">
                  <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-600 dark:text-gray-300 w-10 h-10 rounded-2xl flex items-center justify-center mr-3 shadow-lg">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="bg-white/90 dark:bg-gray-800/90 rounded-3xl px-4 py-3 shadow-lg backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 max-w-md">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-medium">{t('tryStartingWith')}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {suggestions.map((suggestion, index) => (
                        <motion.button
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="bg-white/80 dark:bg-gray-800/80 hover:bg-gradient-to-r hover:from-primary-100 hover:to-mental-100 dark:hover:from-primary-900/30 dark:hover:to-mental-900/30 text-gray-700 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-300 px-2 py-1 rounded-lg text-xs font-medium transition-all duration-300 shadow-sm hover:shadow-md border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm hover:scale-105 whitespace-nowrap"
                        >
                          {suggestion}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area - Fixed at bottom */}
          <div className={`p-3 sm:p-4 lg:p-6 border-t border-gray-200/60 dark:border-gray-700/60 flex-shrink-0 bg-gradient-to-t from-white/95 to-white/80 dark:from-gray-900/95 dark:to-gray-900/80 backdrop-blur-xl`}>
            <div className="flex space-x-2 sm:space-x-3 lg:space-x-4">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputMessage)}
                placeholder={t('placeholder')}
                className={`flex-1 px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 lg:py-4 border-2 rounded-lg sm:rounded-xl lg:rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 font-medium text-sm sm:text-base mobile-text-size ${
                  isDarkMode 
                    ? 'border-gray-600/50 bg-gray-800/80 text-white placeholder-gray-400 backdrop-blur-sm' 
                    : 'border-gray-300/50 bg-white/80 text-gray-800 placeholder-gray-500 backdrop-blur-sm'
                }`}
                disabled={isLoading}
              />
              <motion.button
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSendMessage(inputMessage)}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-gradient-to-r from-primary-500 to-mental-500 hover:from-primary-600 hover:to-mental-600 disabled:from-gray-300 disabled:to-gray-400 text-white p-2.5 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl lg:rounded-2xl transition-all duration-300 disabled:cursor-not-allowed shadow-lg hover:shadow-xl border-2 border-primary-400/20 hover:border-primary-400/40"
              >
                {isLoading ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 animate-spin" /> : <Send className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface; 