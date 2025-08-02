import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Heart, Wind, BookOpen, Shield, Sun, Moon, Sparkles, User } from 'lucide-react';
import ChatInterface from './components/ChatInterface';
import ResourceCard from './components/ResourceCard';
import ResourceModal from './components/ResourceModal';
import CrisisSupport from './components/CrisisSupport';
import Disclaimer from './components/Disclaimer';
import MoodTracker from './components/MoodTracker';
import BreathingExercise from './components/BreathingExercise';
import LoginModal from './components/LoginModal';
import PasswordResetModal from './components/PasswordResetModal';
import UserProfile from './components/UserProfile';

import { AppProvider, useApp } from './contexts/AppContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { SupabaseAuthProvider, useSupabaseAuthContext } from './contexts/SupabaseAuthContext';

function AppContent() {
  const { isDarkMode, toggleDarkMode } = useApp();
  const { t } = useLanguage();
  const { user, isAuthenticated, isLoading, login, signup, resetPassword } = useSupabaseAuthContext();
  
  // Listen for password recovery events
  useEffect(() => {
    const handlePasswordRecovery = () => {
      console.log('Password recovery detected, showing reset modal');
      setShowPasswordResetModal(true);
    };

    // Listen for custom event that might be triggered by auth context
    window.addEventListener('password-recovery', handlePasswordRecovery);
    
    return () => {
      window.removeEventListener('password-recovery', handlePasswordRecovery);
    };
  }, []);
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  // Check if user has already accepted disclaimer
  useEffect(() => {
    if (user) {
      const disclaimerKey = `mitra_disclaimer_accepted_${user.id}`;
      const hasAccepted = localStorage.getItem(disclaimerKey);
      if (hasAccepted === 'true') {
        setShowDisclaimer(false);
      }
    }
  }, [user]);

  // Check for password reset tokens in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access_token');
    const refreshToken = urlParams.get('refresh_token');
    const type = urlParams.get('type');
    const error = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');
    
    // Debug: Log all URL parameters
    console.log('URL Parameters:', {
      accessToken: accessToken ? 'present' : 'missing',
      refreshToken: refreshToken ? 'present' : 'missing',
      type,
      error,
      errorDescription,
      fullUrl: window.location.href
    });
    
    // Check if this is a password recovery flow
    // Supabase can send different combinations of parameters
    if (accessToken && refreshToken && (type === 'recovery' || type === 'password_recovery')) {
      console.log('Password reset tokens detected in URL');
      setShowPasswordResetModal(true);
      
      // Clean up the URL by removing the tokens
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    } else if (accessToken && refreshToken) {
      // If we have tokens but no type, still show the modal
      console.log('Tokens detected without type, showing password reset modal');
      setShowPasswordResetModal(true);
      
      // Clean up the URL by removing the tokens
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    } else if (error) {
      console.error('Password reset error:', error, errorDescription);
      // You could show an error message here if needed
    }
  }, []);

  const handleDisclaimerAccept = () => {
    if (user) {
      const disclaimerKey = `mitra_disclaimer_accepted_${user.id}`;
      localStorage.setItem(disclaimerKey, 'true');
    }
    setShowDisclaimer(false);
  };
  const [activeTab, setActiveTab] = useState('chat');
  const [selectedResource, setSelectedResource] = useState(null);
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);


  const navigationItems = [
    { id: 'chat', icon: MessageCircle, label: t('chat') },
    { id: 'mood', icon: Heart, label: t('mood') },
    { id: 'breathe', icon: Wind, label: t('breathe') },
    { id: 'resources', icon: BookOpen, label: t('resources') },
    { id: 'crisis', icon: Shield, label: t('crisis') }
  ];

  const resources = [
    {
      title: "Understanding Anxiety",
      description: "Learn about anxiety symptoms, causes, and coping strategies",
      icon: "🧠",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Stress Management",
      description: "Effective techniques to manage and reduce stress levels",
      icon: "🌿",
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Sleep Better",
      description: "Tips and techniques for improving sleep quality",
      icon: "😴",
      color: "from-purple-500 to-indigo-500"
    },
    {
      title: "Mindfulness",
      description: "Practice mindfulness and meditation for mental clarity",
      icon: "🧘",
      color: "from-orange-500 to-red-500"
    },
    {
      title: "Self-Care",
      description: "Essential self-care practices for mental well-being",
      icon: "💝",
      color: "from-pink-500 to-rose-500"
    },
    {
      title: "Building Resilience",
      description: "Develop emotional resilience and coping skills",
      icon: "🛡️",
      color: "from-yellow-500 to-amber-500"
    }
  ];

  const handleLearnMore = (resource) => {
    setSelectedResource(resource);
    setIsResourceModalOpen(true);
  };

  const closeResourceModal = () => {
    setIsResourceModalOpen(false);
    setSelectedResource(null);
  };

  // Show loading screen while auth is initializing
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(to bottom right, #3631bb, #cab2e2, #1a5ab2)'
      }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Loading SerenitySaathi...</p>
        </div>
      </div>
    );
  }

  // Show disclaimer if not accepted and user is authenticated
  if (showDisclaimer && isAuthenticated) {
    return <Disclaimer onAccept={handleDisclaimerAccept} />;
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <div className="min-h-screen relative overflow-hidden" style={{
          background: 'linear-gradient(to bottom right, #3631bb, #cab2e2, #1a5ab2)'
        }}>
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="text-center max-w-2xl">
            {/* Main Icon with Animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl"
            >
              <Shield className="w-16 h-16 text-white" />
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl font-bold text-white mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent"
            >
              Welcome to SerenitySaathi
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-white/90 mb-12 leading-relaxed max-w-lg mx-auto"
            >
              Your secure mental health companion. 
              <br />
              <span className="text-blue-200 font-medium">Sign in to start your journey.</span>
            </motion.p>

            {/* Feature Highlights */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <Heart className="w-8 h-8 text-pink-400 mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">Compassionate Care</h3>
                <p className="text-white/70 text-sm">24/7 mental health support with empathy and understanding</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <Shield className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">Secure & Private</h3>
                <p className="text-white/70 text-sm">Your data is encrypted and protected with bank-level security</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">AI-Powered</h3>
                <p className="text-white/70 text-sm">Advanced AI that adapts to your unique needs and preferences</p>
              </div>
            </motion.div>

            {/* Get Started Button */}
            <motion.button
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowLoginModal(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-12 py-5 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <span className="flex items-center justify-center space-x-3">
                <Sparkles className="w-6 h-6" />
                <span>Get Started</span>
                <Sparkles className="w-6 h-6" />
              </span>
            </motion.button>

            {/* Trust Indicators */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="mt-12 flex items-center justify-center space-x-8 text-white/60 text-sm"
            >
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-4 h-4" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4" />
                <span>Trusted by 10K+ Users</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Login Modal for Welcome Page */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={async (email, password) => {
          try {
            await login(email, password);
            setShowLoginModal(false);
          } catch (error) {
            // Error is handled by AuthContext
          }
        }}
        onSignup={async (name, email, password) => {
          try {
            await signup(name, email, password);
            setShowLoginModal(false);
          } catch (error) {
            // Error is handled by AuthContext
          }
        }}
        onResetPassword={async (email) => {
          try {
            await resetPassword(email);
          } catch (error) {
            // Error is handled by AuthContext
          }
        }}
      />

      {/* Password Reset Modal for Welcome Page */}
      <PasswordResetModal
        isOpen={showPasswordResetModal}
        onClose={() => setShowPasswordResetModal(false)}
      />
      </>
    );
  }

  return (
    <>
      <div className={`min-h-screen ${isDarkMode ? 'dark' : 'light'}`}>
      {/* Background with animated gradient */}
      <div className="fixed inset-0 gradient-hero">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-mental-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <motion.header 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="glass backdrop-blur-md border-b border-white/20 sticky top-0 z-50"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo and Title */}
              <motion.div 
                className="flex items-center space-x-3"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="relative">
                  <div className="w-14 h-14 flex items-center justify-center">
                    <img 
                      src="/logo_SerenitySaathi.png" 
                      alt="SerenitySaathi Logo" 
                      className="w-12 h-12 object-contain drop-shadow-lg"
                      onError={(e) => {
                        // Fallback to Sparkles icon if image fails to load
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-mental-500 rounded-xl flex items-center justify-center shadow-lg hidden">
                      <Sparkles className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                <div className="ml-3">
                  <h1 className="text-2xl font-bold text-gray-800 dark:text-white drop-shadow-lg">
                    {t('appTitle')}
                  </h1>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-pulse"></div>
                    <p className="text-sm font-medium text-gray-600 dark:text-white/90 tracking-wide">
                      Mitra - Your mental health companion
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Navigation */}
              <nav className="hidden md:flex items-center space-x-1">
                {navigationItems.map((item) => (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
                      activeTab === item.id
                        ? 'bg-white/20 text-white dark:text-white text-gray-800 shadow-lg'
                        : 'text-white/80 dark:text-white/80 text-gray-700 hover:text-white dark:hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </motion.button>
                ))}
              </nav>

              {/* User Menu */}
              <div className="flex items-center space-x-2">
                {/* Dark Mode Toggle */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleDarkMode}
                  className="p-2 rounded-full bg-white/20 backdrop-blur-sm text-white dark:text-white text-gray-800 hover:bg-white/30 transition-all duration-200 shadow-lg"
                  title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </motion.button>



                {/* User Profile Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowUserProfile(true)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white dark:text-white text-gray-800 hover:bg-white/30 transition-all duration-200 shadow-lg"
                  title="Profile Settings"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium hidden sm:block">{user?.name}</span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Mobile Navigation */}
        <div className="md:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="glass rounded-full p-2 shadow-strong">
            <div className="flex items-center space-x-1">
              {navigationItems.map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setActiveTab(item.id)}
                  className={`p-3 rounded-full transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-white/20 text-white dark:text-white text-gray-800 shadow-lg'
                      : 'text-white/80 dark:text-white/80 text-gray-700 hover:text-white dark:hover:text-white hover:bg-white/10'
                  }`}
                  title={item.label}
                >
                  <item.icon className="w-5 h-5" />
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="min-h-[calc(100vh-200px)]"
            >
              {activeTab === 'chat' && <ChatInterface />}
              {activeTab === 'mood' && <MoodTracker />}
              {activeTab === 'breathe' && <BreathingExercise />}
              {activeTab === 'resources' && (
                <div className="space-y-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                  >
                                         <h2 className="text-3xl font-bold text-white dark:text-white text-gray-800 mb-4">
                       Mental Health Resources
                     </h2>
                     <p className="text-white/80 dark:text-white/80 text-gray-700 max-w-2xl mx-auto">
                       Explore helpful resources and information to support your mental well-being journey.
                     </p>
                  </motion.div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resources.map((resource, index) => (
                      <motion.div
                        key={resource.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <ResourceCard {...resource} onLearnMore={handleLearnMore} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
              {activeTab === 'crisis' && <CrisisSupport />}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Resource Modal */}
        <ResourceModal
          isOpen={isResourceModalOpen}
          onClose={closeResourceModal}
          resource={selectedResource}
        />

        {/* Login Modal */}
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLogin={async (email, password) => {
            try {
              await login(email, password);
              setShowLoginModal(false);
            } catch (error) {
              // Error is handled by AuthContext
            }
          }}
          onSignup={async (name, email, password) => {
            try {
              await signup(name, email, password);
              setShowLoginModal(false);
            } catch (error) {
              // Error is handled by AuthContext
            }
          }}
          onResetPassword={async (email) => {
            try {
              await resetPassword(email);
            } catch (error) {
              // Error is handled by AuthContext
            }
          }}
        />

        {/* User Profile Modal */}
        <UserProfile
          isOpen={showUserProfile}
          onClose={() => setShowUserProfile(false)}
        />

        {/* Password Reset Modal */}
        <PasswordResetModal
          isOpen={showPasswordResetModal}
          onClose={() => setShowPasswordResetModal(false)}
        />



        {/* Footer */}
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="glass backdrop-blur-md border-t border-white/20 mt-auto"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center">
                             <p className="text-white/60 dark:text-white/60 text-gray-600 text-sm">
                 {t('footerText')}
               </p>
               <div className="mt-4 flex items-center justify-center space-x-4">
                 <div className="flex items-center space-x-2 text-white/60 dark:text-white/60 text-gray-600 text-xs">
                   <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                   <span>Secure & Private</span>
                 </div>
                 <div className="flex items-center space-x-2 text-white/60 dark:text-white/60 text-gray-600 text-xs">
                   <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-500"></div>
                   <span>24/7 Available</span>
                 </div>
                 <div className="flex items-center space-x-2 text-white/60 dark:text-white/60 text-gray-600 text-xs">
                   <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-1000"></div>
                   <span>AI Powered</span>
                 </div>
               </div>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
    </>
  );
}

function App() {
  return (
                <SupabaseAuthProvider>
        <AppProvider>
          <LanguageProvider>
            <AppContent />
          </LanguageProvider>
        </AppProvider>
      </SupabaseAuthProvider>
  );
}

export default App; 