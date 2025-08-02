import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Play, Pause, RotateCcw, Timer, Heart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const BreathingExercise = () => {
  const { t } = useLanguage();
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('inhale');
  const [timeLeft, setTimeLeft] = useState(4);
  const [cycle, setCycle] = useState(1);
  const [totalCycles, setTotalCycles] = useState(5);
  const intervalRef = useRef(null);

  const phases = {
    inhale: { duration: 4, instruction: 'Breathe in slowly', color: 'from-blue-400 to-cyan-500' },
    hold: { duration: 4, instruction: 'Hold your breath', color: 'from-purple-400 to-indigo-500' },
    exhale: { duration: 6, instruction: 'Breathe out slowly', color: 'from-green-400 to-emerald-500' },
    rest: { duration: 2, instruction: 'Relax', color: 'from-gray-400 to-slate-500' }
  };

  const phaseOrder = ['inhale', 'hold', 'exhale', 'rest'];

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            const currentPhaseIndex = phaseOrder.indexOf(currentPhase);
            const nextPhaseIndex = (currentPhaseIndex + 1) % phaseOrder.length;
            const nextPhase = phaseOrder[nextPhaseIndex];
            
            if (nextPhase === 'inhale') {
              setCycle((prevCycle) => {
                if (prevCycle >= totalCycles) {
                  setIsActive(false);
                  setCycle(1);
                  setCurrentPhase('inhale');
                  setTimeLeft(4);
                  return 1;
                }
                return prevCycle + 1;
              });
            }
            
            setCurrentPhase(nextPhase);
            return phases[nextPhase].duration;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, currentPhase, cycle, totalCycles]);

  const startExercise = () => {
    setIsActive(true);
    setCycle(1);
    setCurrentPhase('inhale');
    setTimeLeft(4);
  };

  const pauseExercise = () => {
    setIsActive(false);
  };

  const resetExercise = () => {
    setIsActive(false);
    setCycle(1);
    setCurrentPhase('inhale');
    setTimeLeft(4);
  };

  const getCircleScale = () => {
    if (currentPhase === 'inhale') {
      return 1 + (4 - timeLeft) * 0.1;
    } else if (currentPhase === 'exhale') {
      return 1.4 - (6 - timeLeft) * 0.067;
    }
    return 1.4;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mb-4 shadow-lg">
          <Wind className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white dark:text-white text-gray-800 mb-4">
          Breathing Exercise
        </h2>
        <p className="text-white/80 dark:text-white/80 text-gray-700 max-w-2xl mx-auto">
          Practice mindful breathing to reduce stress and improve focus. Follow the guided rhythm.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Breathing Circle */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center justify-center"
        >
          <div className="relative">
            {/* Background Circle */}
            <div className="w-80 h-80 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center shadow-lg">
              {/* Breathing Circle */}
              <motion.div
                animate={{
                  scale: getCircleScale(),
                  backgroundColor: phases[currentPhase].color.includes('from-') 
                    ? 'transparent' 
                    : phases[currentPhase].color
                }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className={`w-64 h-64 rounded-full bg-gradient-to-r ${phases[currentPhase].color} flex items-center justify-center shadow-xl`}
              >
                <div className="text-center text-white">
                  <div className="text-6xl font-bold mb-2">{timeLeft}</div>
                  <div className="text-lg font-medium">{phases[currentPhase].instruction}</div>
                </div>
              </motion.div>
            </div>

            {/* Progress Ring */}
            <svg className="absolute inset-0 w-80 h-80 transform -rotate-90">
              <circle
                cx="160"
                cy="160"
                r="150"
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="4"
                fill="none"
              />
              <motion.circle
                cx="160"
                cy="160"
                r="150"
                stroke="rgba(255, 255, 255, 0.8)"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                initial={{ strokeDasharray: "0 942" }}
                animate={{
                  strokeDasharray: `${(timeLeft / phases[currentPhase].duration) * 942} 942`
                }}
                transition={{ duration: 1 }}
              />
            </svg>
          </div>
        </motion.div>

        {/* Controls and Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Controls */}
          <div className="card">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
                <Timer className="w-5 h-5 mr-2" />
                Exercise Controls
              </h3>

              {/* Control Buttons */}
              <div className="flex items-center justify-center space-x-4 mb-6">
                {!isActive ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startExercise}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={pauseExercise}
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center"
                  >
                    <Pause className="w-5 h-5 mr-2" />
                    Pause
                  </motion.button>
                )}
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetExercise}
                  className="bg-gradient-to-r from-gray-500 to-slate-500 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Reset
                </motion.button>
              </div>

              {/* Progress Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {cycle}/{totalCycles}
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">
                    Cycles
                  </div>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {timeLeft}s
                  </div>
                  <div className="text-sm text-purple-600 dark:text-purple-400">
                    Time Left
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="card">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
                <Heart className="w-5 h-5 mr-2" />
                How to Practice
              </h3>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white">Find a comfortable position</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Sit or lie down in a comfortable position with your back straight.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white">Follow the rhythm</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Breathe in for 4 seconds, hold for 4, exhale for 6, rest for 2.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white">Focus on your breath</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Pay attention to the sensation of breathing and let thoughts pass by.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    4
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white">Practice regularly</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Try to practice this exercise daily for best results.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="card">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Benefits of Deep Breathing
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Reduces stress and anxiety</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Improves focus and concentration</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Lowers blood pressure</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Promotes better sleep</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BreathingExercise; 