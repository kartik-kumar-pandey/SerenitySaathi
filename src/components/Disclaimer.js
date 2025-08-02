import React from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, AlertTriangle, Heart, Lock, Users } from 'lucide-react';


const Disclaimer = ({ onAccept }) => {

  const disclaimerPoints = [
    {
      icon: AlertTriangle,
      title: "Not Medical Advice",
      description: "This is not a substitute for professional medical or therapeutic advice",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Shield,
      title: "Crisis Support",
      description: "If you're in crisis, please contact emergency services immediately",
      color: "from-red-500 to-pink-500"
    },
    {
      icon: Lock,
      title: "Privacy Protected",
      description: "Your conversations are private and not stored on our servers",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Heart,
      title: "Supportive Environment",
      description: "Designed to provide general support and wellness resources",
      color: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-mental-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-4xl"
      >
        <div className="card backdrop-blur-md border border-white/20 shadow-strong">
          {/* Header */}
          <div className="text-center p-8 border-b border-gray-200 dark:border-gray-700">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary-500 to-mental-500 rounded-full mb-6 shadow-lg"
            >
              <Shield className="w-10 h-10 text-white" />
            </motion.div>
            
                         <motion.h1
               initial={{ y: -20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.3 }}
               className="text-3xl font-bold text-gray-800 dark:text-white mb-4"
               style={{ color: '#111827' }}
             >
               Welcome to SerenitySaathi
             </motion.h1>
            
            <motion.p
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-900 dark:text-gray-200 text-lg leading-relaxed max-w-2xl mx-auto"
              style={{ color: '#111827' }}
            >
              Please read this important information before using the app
            </motion.p>
          </div>

          {/* Disclaimer Points */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {disclaimerPoints.map((point, index) => (
                <motion.div
                  key={point.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-start space-x-4 group"
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${point.color} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300 flex-shrink-0`}>
                    <point.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                                         <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2" style={{ color: '#111827' }}>
                       {point.title}
                     </h3>
                    <p className="text-gray-900 dark:text-gray-200 text-sm leading-relaxed" style={{ color: '#111827' }}>
                      {point.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Additional Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-gradient-to-r from-primary-50 to-mental-50 dark:from-primary-900/20 dark:to-mental-900/20 rounded-xl p-6 mb-8"
            >
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-mental-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                                     <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2" style={{ color: '#111827' }}>
                     About Mitra
                   </h4>
                  <p className="text-gray-900 dark:text-gray-200 text-sm leading-relaxed" style={{ color: '#111827' }}>
                    Mitra is an AI-powered mental health companion designed to provide supportive conversations and wellness resources. 
                    It's here to listen, offer guidance, and help you explore your feelings in a safe, judgment-free environment.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Safety Notice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r-xl p-6 mb-8"
            >
              <div className="flex items-start space-x-4">
                <AlertTriangle className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
                <div>
                                     <h4 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2" style={{ color: '#7f1d1d' }}>
                     Safety First
                   </h4>
                  <p className="text-red-900 dark:text-red-200 text-sm leading-relaxed" style={{ color: '#7f1d1d' }}>
                    If you're experiencing thoughts of self-harm, suicide, or are in immediate danger, 
                    please contact emergency services (112) or the National Suicide Prevention Helpline (1800-121-3667) immediately. 
                    Your safety is the most important thing.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Action Button */}
          <div className="p-8 border-t border-gray-200 dark:border-gray-700 text-center">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onAccept}
              className="bg-gradient-to-r from-primary-500 to-mental-500 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-3 mx-auto"
            >
              <CheckCircle className="w-6 h-6" />
              <span>I Understand and Accept</span>
            </motion.button>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="text-gray-900 dark:text-gray-300 text-sm mt-4"
              style={{ color: '#111827' }}
            >
              By clicking this button, you acknowledge that you've read and understood this information
            </motion.p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Disclaimer; 