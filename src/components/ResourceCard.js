import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const ResourceCard = ({ title, description, icon, color, onLearnMore }) => {



  const handleLearnMore = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onLearnMore) {
      onLearnMore({ title, description, icon, color });
    }
  };

  return (
    <motion.div
      whileHover={{ 
        scale: 1.02, 
        y: -5,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      className="group relative overflow-hidden"
    >
      <div className="card hover-lift h-full">
        {/* Gradient Background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
        
        {/* Content */}
        <div className="relative p-6">
          {/* Icon */}
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
              <span className="text-2xl">{icon}</span>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              whileHover={{ opacity: 1, x: 0 }}
              className="opacity-0 group-hover:opacity-100 transition-all duration-300"
            >
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-500 transition-colors duration-300" />
            </motion.div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
            {title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
            {description}
          </p>

          {/* Action Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLearnMore}
            className={`w-full bg-gradient-to-r ${color} text-white py-3 px-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 group-hover:bg-opacity-90 cursor-pointer relative z-10`}
            style={{ pointerEvents: 'auto' }}
          >
            <span>Learn More</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </motion.button>

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-8 -translate-x-8"></div>
        </div>

        {/* Hover Effect Border */}
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl`}></div>
      </div>
    </motion.div>
  );
};



export default ResourceCard; 