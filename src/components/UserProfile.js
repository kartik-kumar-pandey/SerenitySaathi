import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Settings, LogOut, Shield, Bell, Globe, Save, Moon, Sun } from 'lucide-react';
import { useSupabaseAuthContext } from '../contexts/SupabaseAuthContext';
import { useApp } from '../contexts/AppContext';
import { useLanguage } from '../contexts/LanguageContext';
import PrivacyIndicator from './PrivacyIndicator';

const UserProfile = ({ isOpen, onClose }) => {
  const { user, logout } = useSupabaseAuthContext();
  const { isDarkMode, toggleDarkMode, userPreferences, updatePreferences } = useApp();
  const { currentLanguage, setLanguage } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');



  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      onClose();
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreferenceChange = (key, value) => {
    updatePreferences({ [key]: value });
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'privacy', label: 'Privacy', icon: Shield }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700"
        >
                     {/* Header */}
           <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
             <h2 className="text-2xl font-bold text-gray-500 dark:text-gray-300">User Profile</h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-blue-800 dark:text-blue-400 bg-white dark:bg-gray-900'
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-800 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 dark:bg-blue-400"></div>
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                        {user?.name || user?.email?.split('@')[0] || 'User'}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">{user?.email || 'No email available'}</p>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <h4 className="text-gray-800 dark:text-white font-medium mb-2">Account Information</h4>
                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                          <div className="flex justify-between">
                            <span>User ID:</span>
                            <span className="font-mono text-xs">{user?.id || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Member since:</span>
                            <span>{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Last login:</span>
                            <span>{user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'N/A'}</span>
                          </div>
                        </div>
                      </div>

                      
                    </div>
                  </div>
                )}

                {activeTab === 'preferences' && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white">App Preferences</h3>
                      
                      {/* Dark Mode Toggle */}
                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-3">
                                                     <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                             {isDarkMode ? <Moon className="w-5 h-5 text-blue-800 dark:text-blue-400" /> : <Sun className="w-5 h-5 text-blue-800 dark:text-blue-400" />}
                           </div>
                          <div>
                            <p className="text-gray-800 dark:text-white font-medium">Dark Mode</p>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">Switch between light and dark themes</p>
                          </div>
                        </div>
                        <button
                          onClick={toggleDarkMode}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            isDarkMode ? 'bg-blue-500' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              isDarkMode ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Language Selection */}
                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                            <Globe className="w-5 h-5 text-blue-800 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="text-gray-800 dark:text-white font-medium">Language</p>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">Choose your preferred language</p>
                          </div>
                        </div>
                        <select
                          value={currentLanguage}
                          onChange={(e) => setLanguage(e.target.value)}
                          className="bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg px-3 py-2 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="en">English</option>
                          <option value="hi">हिंदी (Hindi)</option>
                        </select>
                      </div>

                      {/* Notifications */}
                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                            <Bell className="w-5 h-5 text-blue-800 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="text-gray-800 dark:text-white font-medium">Notifications</p>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">Receive app notifications</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handlePreferenceChange('notifications', !userPreferences.notifications)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            userPreferences.notifications ? 'bg-blue-500' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              userPreferences.notifications ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Auto Save */}
                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                            <Save className="w-5 h-5 text-blue-800 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="text-gray-800 dark:text-white font-medium">Auto Save</p>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">Automatically save your data</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handlePreferenceChange('autoSave', !userPreferences.autoSave)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            userPreferences.autoSave ? 'bg-blue-500' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              userPreferences.autoSave ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'privacy' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Privacy & Security</h3>
                    
                    {/* Privacy Indicator Component */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-4">
                      <PrivacyIndicator isEncrypted={true} encryptionLevel="AES-256" />
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <h4 className="text-gray-800 dark:text-white font-medium mb-2">Data Privacy</h4>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                          Your data is encrypted and stored securely. We never share your personal information with third parties.
                        </p>
                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>End-to-end encryption</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>GDPR compliant</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>No data sharing</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <h4 className="text-gray-800 dark:text-white font-medium mb-2">Account Security</h4>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                          Your account is protected with industry-standard security measures.
                        </p>
                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Secure authentication</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Regular security updates</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Activity monitoring</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              disabled={isLoading}
              className="flex items-center space-x-2 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              <LogOut className="w-4 h-4" />
              <span>{isLoading ? 'Logging out...' : 'Logout'}</span>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UserProfile; 