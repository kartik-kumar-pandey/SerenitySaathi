import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { useSupabaseAuthContext } from './SupabaseAuthContext';
import { dbService } from '../supabase';
import { encryptMessages, decryptMessages, generateUserKey } from '../utils/encryption';

const AppContext = createContext();

const initialState = {
  isDarkMode: false,
  moodHistory: [],
  conversations: [],
  currentConversationId: null,
  userPreferences: {
    language: 'en',
    notifications: true,
    autoSave: true
  }
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_DARK_MODE':
      return {
        ...state,
        isDarkMode: !state.isDarkMode
      };
    
    case 'ADD_MOOD_ENTRY':
      return {
        ...state,
        moodHistory: [...state.moodHistory, {
          id: Date.now(),
          mood: action.payload.mood,
          intensity: action.payload.intensity,
          timestamp: new Date(),
          notes: action.payload.notes || ''
        }]
      };
    
    case 'CREATE_NEW_CONVERSATION':
      const newConversation = {
        id: Date.now(),
        title: action.payload.title || `Chat ${state.conversations.length + 1}`,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      return {
        ...state,
        conversations: [...state.conversations, newConversation],
        currentConversationId: newConversation.id
      };
    
    case 'RESTORE_CONVERSATION':
      return {
        ...state,
        conversations: [...state.conversations, action.payload]
      };
    
    case 'ADD_MESSAGE_TO_CONVERSATION':
      return {
        ...state,
        conversations: state.conversations.map(conv => {
          if (conv.id === action.payload.conversationId) {
            return {
              ...conv,
              messages: [...conv.messages, {
                id: Date.now(),
                text: action.payload.message,
                sender: action.payload.sender,
                timestamp: new Date()
              }],
              updatedAt: new Date()
            };
          }
          return conv;
        })
      };
    
    case 'SET_CURRENT_CONVERSATION':
      return {
        ...state,
        currentConversationId: action.payload.conversationId
      };
    
    case 'DELETE_CONVERSATION':
      return {
        ...state,
        conversations: state.conversations.filter(conv => conv.id !== action.payload.conversationId),
        currentConversationId: state.currentConversationId === action.payload.conversationId 
          ? (state.conversations.length > 1 ? state.conversations[0]?.id : null)
          : state.currentConversationId
      };
    
    case 'CLEAR_ALL_CONVERSATIONS':
      return {
        ...state,
        conversations: [],
        currentConversationId: null
      };
    
    case 'RESET_STATE':
      return {
        ...initialState,
        isDarkMode: state.isDarkMode
      };
    
    case 'UPDATE_PREFERENCES':
      return {
        ...state,
        userPreferences: {
          ...state.userPreferences,
          ...action.payload
        }
      };
    
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const { user } = useSupabaseAuthContext();
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [isInitialized, setIsInitialized] = useState(false);
  const [lastUserId, setLastUserId] = useState(null);
  const [isLoadingUserData, setIsLoadingUserData] = useState(false);

  useEffect(() => {

    
    if (!user) {
      dispatch({ type: 'RESET_STATE' });
      setIsInitialized(false);
      setLastUserId(null);
      setIsLoadingUserData(false);
      return;
    }

    if (lastUserId && lastUserId !== user.id) {
      dispatch({ type: 'RESET_STATE' });
      setIsInitialized(false);
      setIsLoadingUserData(false);
    }

    setLastUserId(user.id);

    if (!isLoadingUserData && !isInitialized) {
      setIsLoadingUserData(true);
      
      const loadUserData = async () => {
        try {
          const userData = await dbService.loadUserData(user.id);
          
          dispatch({ type: 'RESET_STATE' });
          
          if (userData.dark_mode) {
            dispatch({ type: 'TOGGLE_DARK_MODE' });
          }
          
          if (userData.mood_history && userData.mood_history.length > 0) {
            userData.mood_history.forEach(mood => {
              dispatch({ type: 'ADD_MOOD_ENTRY', payload: mood });
            });
          }
          
          if (userData.conversations && userData.conversations.length > 0) {
            const userKey = generateUserKey(user.id, user.email);
            
            userData.conversations.forEach(conv => {
              const decryptedMessages = decryptMessages(conv.messages, userKey);
              
              dispatch({ 
                type: 'RESTORE_CONVERSATION', 
                payload: { 
                  id: conv.id,
                  title: conv.title,
                  messages: decryptedMessages,
                  createdAt: conv.createdAt,
                  updatedAt: conv.updatedAt
                } 
              });
            });
          }
          
          if (userData.current_conversation_id) {
            const conversationExists = userData.conversations?.some(conv => conv.id === userData.current_conversation_id);
            if (conversationExists) {
              dispatch({ type: 'SET_CURRENT_CONVERSATION', payload: { conversationId: userData.current_conversation_id } });
            }
          }
          
          if (userData.preferences && Object.keys(userData.preferences).length > 0) {
            dispatch({ type: 'UPDATE_PREFERENCES', payload: userData.preferences });
          }
          
          try {
            await dbService.verifyUserDataIsolation(user.id);
          } catch (error) {
          }
          
          setIsInitialized(true);
        } catch (error) {
          setIsInitialized(true);
        } finally {
          setIsLoadingUserData(false);
        }
      };

      loadUserData();
    }
  }, [user?.id, lastUserId, isInitialized, isLoadingUserData, user]);



  useEffect(() => {
    if (!user || !isInitialized || isLoadingUserData) return;
    
    const saveData = async () => {
      try {
        const userId = user.id;
        
        // Generate user-specific encryption key
        const userKey = generateUserKey(userId, user.email);
        
        // Encrypt conversations before saving
        const encryptedConversations = state.conversations.map(conversation => ({
          ...conversation,
          messages: encryptMessages(conversation.messages, userKey)
        }));
        

        
        await dbService.saveUserData(userId, {
          conversations: encryptedConversations,
          moodHistory: state.moodHistory,
          userPreferences: state.userPreferences,
          isDarkMode: state.isDarkMode,
          currentConversationId: state.currentConversationId
        });
      } catch (error) {
      }
    };

    saveData();
  }, [state, user, isInitialized, isLoadingUserData]);

  const toggleDarkMode = () => {
    dispatch({ type: 'TOGGLE_DARK_MODE' });
  };

  const addMoodEntry = (mood, intensity, notes = '') => {
    dispatch({ 
      type: 'ADD_MOOD_ENTRY', 
      payload: { mood, intensity, notes } 
    });
  };

  const createNewConversation = (title) => {
    dispatch({ type: 'CREATE_NEW_CONVERSATION', payload: { title } });
  };

  const addMessageToConversation = (conversationId, message, sender) => {
    dispatch({ 
      type: 'ADD_MESSAGE_TO_CONVERSATION', 
      payload: { conversationId, message, sender } 
    });
  };

  const setCurrentConversation = (conversationId) => {
    dispatch({ type: 'SET_CURRENT_CONVERSATION', payload: { conversationId } });
  };

  const deleteConversation = (conversationId) => {
    dispatch({ type: 'DELETE_CONVERSATION', payload: { conversationId } });
  };

  const clearAllConversations = () => {
    dispatch({ type: 'CLEAR_ALL_CONVERSATIONS' });
  };

  const resetState = () => {
    dispatch({ type: 'RESET_STATE' });
  };

  const updatePreferences = (preferences) => {
    dispatch({ type: 'UPDATE_PREFERENCES', payload: preferences });
  };

  const getMoodAnalytics = () => {
    const last7Days = state.moodHistory.filter(mood => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(mood.timestamp) > weekAgo;
    });

    const moodCounts = last7Days.reduce((acc, mood) => {
      acc[mood.mood] = (acc[mood.mood] || 0) + 1;
      return acc;
    }, {});

    const averageIntensity = last7Days.length > 0 
      ? last7Days.reduce((sum, mood) => sum + mood.intensity, 0) / last7Days.length 
      : 0;

    return {
      moodCounts,
      averageIntensity,
      totalEntries: last7Days.length,
      mostFrequentMood: Object.keys(moodCounts).reduce((a, b) => 
        moodCounts[a] > moodCounts[b] ? a : b, 'neutral'
      )
    };
  };

  const getCurrentConversation = () => {
    return state.conversations.find(conv => conv.id === state.currentConversationId);
  };

  const value = {
    ...state,
    isInitialized,
    toggleDarkMode,
    addMoodEntry,
    createNewConversation,
    addMessageToConversation,
    setCurrentConversation,
    deleteConversation,
    clearAllConversations,
    resetState,
    updatePreferences,
    getMoodAnalytics,
    getCurrentConversation
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}; 