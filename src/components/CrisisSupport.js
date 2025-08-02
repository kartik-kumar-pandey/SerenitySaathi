import React from 'react';
import { motion } from 'framer-motion';
import { Phone, AlertTriangle, Shield, Heart, Clock, Users, Globe } from 'lucide-react';

const CrisisSupport = () => {

  const crisisResources = [
    {
      name: "National Suicide Prevention Helpline",
      number: "1800-121-3667",
      website: "https://www.icallhelpline.org",
      description: "24/7 free and confidential support",
      icon: Phone,
      color: "from-red-500 to-pink-500",
      hoverColor: "text-red-400",
      urgency: "high"
    },
    {
      name: "Emergency Services",
      number: "112",
      website: "https://www.112.gov.in",
      description: "For immediate emergency situations",
      icon: AlertTriangle,
      color: "from-orange-500 to-red-500",
      hoverColor: "text-orange-400",
      urgency: "critical"
    }
  ];

  const immediateActions = [
    {
      title: "Stay Safe",
      description: "Remove yourself from any dangerous situations",
      icon: Shield,
      color: "from-blue-500 to-cyan-500",
      hoverColor: "text-blue-400"
    },
    {
      title: "Reach Out",
      description: "Contact a trusted friend, family member, or professional",
      icon: Users,
      color: "from-green-500 to-emerald-500",
      hoverColor: "text-green-400"
    },
    {
      title: "Take Time",
      description: "Give yourself space to process your feelings",
      icon: Clock,
      color: "from-purple-500 to-indigo-500",
      hoverColor: "text-purple-400"
    },
    {
      title: "Be Kind",
      description: "Treat yourself with the same compassion you'd offer others",
      icon: Heart,
      color: "from-pink-500 to-rose-500",
      hoverColor: "text-pink-400"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mb-4 shadow-lg">
          <AlertTriangle className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white dark:text-white text-gray-800 mb-4">
          Crisis Support
        </h2>
        <p className="text-white/80 dark:text-white/80 text-gray-700 max-w-2xl mx-auto">
          If you're experiencing a mental health crisis, help is available 24/7. You don't have to face this alone.
        </p>
      </motion.div>

      {/* Emergency Contacts */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-white dark:text-white text-gray-800 text-center">
          Emergency Contacts
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {crisisResources.map((resource, index) => (
            <motion.div
              key={resource.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
                             <div 
                 className="card hover-lift h-full relative overflow-hidden"
                 onMouseEnter={(e) => {
                   const icon = e.currentTarget.querySelector('svg');
                   if (icon && icon._resource) {
                     const resource = icon._resource;
                     icon.style.color = resource.hoverColor.replace('text-', '').includes('red') ? '#f87171' :
                                       resource.hoverColor.replace('text-', '').includes('orange') ? '#fb923c' : '#f87171';
                   }
                 }}
                 onMouseLeave={(e) => {
                   const icon = e.currentTarget.querySelector('svg');
                   if (icon) {
                     icon.style.color = '#1f2937';
                   }
                 }}
               >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${resource.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
                
                {/* Urgency Badge */}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${
                  resource.urgency === 'critical' 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'bg-orange-500 text-white'
                }`}>
                  {resource.urgency === 'critical' ? 'CRITICAL' : 'HIGH PRIORITY'}
                </div>

                <div className="relative p-6">
                                  {/* Icon */}
                                <div className={`w-12 h-12 bg-gradient-to-br ${resource.color} rounded-xl flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <resource.icon 
                    className="w-6 h-6 transition-colors duration-300" 
                    style={{ 
                      color: '#1f2937',
                      filter: 'brightness(1)',
                      transition: 'all 0.3s ease'
                    }}
                    ref={(el) => {
                      if (el) {
                        el._resource = resource;
                      }
                    }}
                  />
                </div>

                  {/* Content */}
                  <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                    {resource.name}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    {resource.description}
                  </p>

                  {/* Contact Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* Phone Number */}
                    <motion.a
                      href={`tel:${resource.number}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex-1 inline-flex items-center justify-center space-x-2 bg-gradient-to-r ${resource.color} text-white py-3 px-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300`}
                    >
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{resource.number}</span>
                    </motion.a>
                    
                    {/* Website Link */}
                    <motion.a
                      href={resource.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 inline-flex items-center justify-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Globe className="w-4 h-4" />
                      <span className="text-sm">Website</span>
                    </motion.a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Immediate Actions */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-white dark:text-white text-gray-800 text-center">
          Immediate Actions You Can Take
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {immediateActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
                             <div 
                 className="card hover-lift h-full text-center group"
                 onMouseEnter={(e) => {
                   const icon = e.currentTarget.querySelector('svg');
                   if (icon && icon._action) {
                     const action = icon._action;
                     icon.style.color = action.hoverColor.replace('text-', '').includes('blue') ? '#60a5fa' :
                                      action.hoverColor.replace('text-', '').includes('green') ? '#4ade80' :
                                      action.hoverColor.replace('text-', '').includes('purple') ? '#a78bfa' :
                                      action.hoverColor.replace('text-', '').includes('pink') ? '#f472b6' : '#60a5fa';
                   }
                 }}
                 onMouseLeave={(e) => {
                   const icon = e.currentTarget.querySelector('svg');
                   if (icon) {
                     icon.style.color = '#1f2937';
                   }
                 }}
               >
                {/* Icon */}
                                <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4 group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                  <action.icon 
                    className="w-6 h-6 transition-colors duration-300" 
                    style={{ 
                      color: '#1f2937',
                      filter: 'brightness(1)',
                      transition: 'all 0.3s ease'
                    }}
                    ref={(el) => {
                      if (el) {
                        el._action = action;
                      }
                    }}
                  />
                </div>

                {/* Content */}
                <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                  {action.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {action.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Important Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20"
      >
        <div className="p-6">
          <div className="flex items-start space-x-4">
            <AlertTriangle className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
            <div>
              <h4 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                Important Notice
              </h4>
              <p className="text-red-700 dark:text-red-300 text-sm leading-relaxed">
                SerenitySaathi is not a substitute for professional mental health care. If you're experiencing thoughts of self-harm or suicide, please contact emergency services immediately. Your safety is the most important thing.
              </p>
            </div>
          </div>
        </div>
      </motion.div>


    </div>
  );
};

export default CrisisSupport; 