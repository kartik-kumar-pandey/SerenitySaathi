import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, BarChart3, TrendingUp, Calendar, Save, Plus } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useLanguage } from '../contexts/LanguageContext';

const MoodTracker = () => {
  const { addMoodEntry, getMoodAnalytics, isDarkMode } = useApp();
  const { t } = useLanguage();
  
  const [selectedMood, setSelectedMood] = useState(null);
  const [intensity, setIntensity] = useState(5);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const moods = [
    { 
      id: 'happy', 
      emoji: '😊', 
      label: 'Happy', 
      color: 'from-green-400 to-emerald-500',
      gradient: 'from-green-200 via-emerald-200 to-teal-200',
      cardColor: 'from-green-500 to-emerald-500'
    },
    { 
      id: 'excited', 
      emoji: '🤩', 
      label: 'Excited', 
      color: 'from-yellow-400 to-orange-500',
      gradient: 'from-yellow-200 via-orange-200 to-red-200',
      cardColor: 'from-yellow-500 to-orange-500'
    },
    { 
      id: 'loved', 
      emoji: '🥰', 
      label: 'Loved', 
      color: 'from-pink-400 to-rose-500',
      gradient: 'from-pink-200 via-rose-200 to-fuchsia-200',
      cardColor: 'from-pink-500 to-rose-500'
    },
    { 
      id: 'neutral', 
      emoji: '😐', 
      label: 'Neutral', 
      color: 'from-gray-400 to-slate-500',
      gradient: 'from-gray-200 via-slate-200 to-zinc-200',
      cardColor: 'from-gray-500 to-slate-500'
    },
    { 
      id: 'sad', 
      emoji: '😔', 
      label: 'Sad', 
      color: 'from-blue-400 to-indigo-500',
      gradient: 'from-blue-200 via-indigo-200 to-purple-200',
      cardColor: 'from-blue-500 to-indigo-500'
    },
    { 
      id: 'anxious', 
      emoji: '😰', 
      label: 'Anxious', 
      color: 'from-purple-400 to-violet-500',
      gradient: 'from-purple-200 via-violet-200 to-indigo-200',
      cardColor: 'from-purple-500 to-violet-500'
    }
  ];

  const analytics = getMoodAnalytics();

  const handleSubmit = async () => {
    if (!selectedMood) return;
    
    setIsSubmitting(true);
    try {
      addMoodEntry(selectedMood, intensity, notes);
      setSelectedMood(null);
      setIntensity(5);
      setNotes('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full mb-4 shadow-lg">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white dark:text-white text-gray-800 mb-4">
          Mood Tracker
        </h2>
        <p className="text-white/80 dark:text-white/80 text-gray-700 max-w-2xl mx-auto">
          Track your emotional patterns and understand your mental well-being journey.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mood Entry Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="group relative overflow-hidden">
            <div className="card hover-lift h-full">
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
              
              {/* Content */}
              <div className="relative p-6">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
                  <Plus className="w-5 h-5 mr-2" />
                  How are you feeling today?
                </h3>

                {/* Mood Selection */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 relative z-10">
                  {moods.map((mood) => (
                    <motion.button
                      key={mood.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedMood(mood.id)}
                      className={`group relative overflow-hidden p-4 rounded-xl border-2 transition-all duration-200 z-10 ${
                        selectedMood === mood.id
                          ? `border-primary-500 bg-gradient-to-r ${mood.color} text-white shadow-lg`
                          : `border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-400 bg-gradient-to-br ${mood.gradient} dark:bg-gray-700`
                      }`}
                    >
                      {/* Gradient Background for unselected buttons */}
                      {selectedMood !== mood.id && (
                        <div className={`absolute inset-0 bg-gradient-to-br ${mood.cardColor} opacity-10 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none`}></div>
                      )}
                      
                      <div className="relative z-10">
                        <div className="text-2xl mb-2">{mood.emoji}</div>
                        <div className={`text-sm font-medium ${selectedMood === mood.id ? 'text-white' : 'text-gray-800 dark:text-white'}`}>
                          {mood.label}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Intensity Slider */}
                <div className="mb-6 relative z-10">
                  <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">
                    Intensity: {intensity}/10
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={intensity}
                    onChange={(e) => setIntensity(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider relative z-10"
                  />
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>

                {/* Notes */}
                <div className="mb-6 relative z-10">
                  <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">
                    Notes (optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="What's on your mind?"
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gradient-to-br from-green-100 to-blue-100 dark:from-gray-700 dark:to-gray-600 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 relative z-10"
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={!selectedMood || isSubmitting}
                  className="w-full bg-gradient-to-r from-primary-500 to-mental-500 text-white py-3 px-6 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center relative z-10"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Save Mood Entry
                    </>
                  )}
                </motion.button>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-10 translate-x-10 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-8 -translate-x-8 pointer-events-none"></div>
              </div>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
            </div>
          </div>
        </motion.div>

        {/* Analytics */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="group relative overflow-hidden">
            <div className="card hover-lift h-full">
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
              
              {/* Content */}
              <div className="relative p-6">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Your Mood Insights
                </h3>

                {analytics.totalEntries === 0 ? (
                  <div className="text-center py-8">
                    <TrendingUp className="w-12 h-12 text-gray-500 dark:text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Start tracking your mood to see insights here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="group relative overflow-hidden bg-gradient-to-br from-blue-200 to-cyan-200 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-10 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"></div>
                        <div className="relative">
                          <div className="text-2xl font-bold text-blue-800 dark:text-blue-400">
                            {analytics.totalEntries}
                          </div>
                          <div className="text-sm text-blue-700 dark:text-blue-400">
                            Entries This Week
                          </div>
                        </div>
                      </div>
                      <div className="group relative overflow-hidden bg-gradient-to-br from-green-200 to-emerald-200 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 opacity-10 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"></div>
                        <div className="relative">
                          <div className="text-2xl font-bold text-green-800 dark:text-green-400">
                            {analytics.averageIntensity.toFixed(1)}
                          </div>
                          <div className="text-sm text-green-700 dark:text-green-400">
                            Avg Intensity
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Most Frequent Mood */}
                    <div className="group relative overflow-hidden bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-10 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"></div>
                      <div className="relative">
                        <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">
                          Most Frequent Mood
                        </h4>
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">
                            {moods.find(m => m.id === analytics.mostFrequentMood)?.emoji}
                          </span>
                          <span className="text-purple-800 dark:text-purple-300 capitalize">
                            {analytics.mostFrequentMood}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Mood Distribution */}
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-3">
                        Mood Distribution
                      </h4>
                      <div className="space-y-2">
                        {Object.entries(analytics.moodCounts).map(([mood, count]) => {
                          const moodData = moods.find(m => m.id === mood);
                          const percentage = (count / analytics.totalEntries) * 100;
                          
                          return (
                            <div key={mood} className="flex items-center">
                              <span className="text-lg mr-3">{moodData?.emoji}</span>
                              <div className="flex-1">
                                <div className="flex justify-between text-sm text-gray-700 dark:text-gray-400 mb-1">
                                  <span className="capitalize">{mood}</span>
                                  <span>{count} ({percentage.toFixed(0)}%)</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full bg-gradient-to-r ${moodData?.color}`}
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-10 translate-x-10 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-8 -translate-x-8 pointer-events-none"></div>
              </div>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MoodTracker; 