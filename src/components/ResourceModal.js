import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, BookOpen, Lightbulb, Clock, Star, CheckCircle } from 'lucide-react';

const ResourceModal = ({ isOpen, onClose, resource }) => {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationData, setNotificationData] = useState(null);



  const handleStartJourney = () => {
    const journeyActions = {
      "Understanding Anxiety": {
        title: "Let's begin your anxiety management journey!",
        icon: "🧘‍♀️",
        steps: [
          "Download a meditation app",
          "Schedule a consultation with NIMHANS",
          "Practice the breathing exercises we discussed",
          "Keep a daily mood journal"
        ],
        color: "from-blue-500 to-purple-600"
      },
      "Stress Management": {
        title: "Ready to master stress management!",
        icon: "🌿",
        steps: [
          "Try the Art of Living breathing techniques",
          "Start with 10 minutes of daily meditation",
          "Practice the 'Karma Yoga' principle from Geeta",
          "Create a stress-free environment at home"
        ],
        color: "from-green-500 to-teal-600"
      },
      "Sleep Better": {
        title: "Time to transform your sleep!",
        icon: "😴",
        steps: [
          "Create a peaceful bedtime routine",
          "Practice gratitude before sleep",
          "Follow Ayurvedic sleep principles",
          "Set a consistent sleep schedule"
        ],
        color: "from-indigo-500 to-purple-600"
      },
      "Mindfulness": {
        title: "Embark on your mindfulness journey!",
        icon: "🌸",
        steps: [
          "5-minute daily meditation sessions",
          "Practice Pranayama breathing",
          "Try mindful eating at your next meal",
          "Take a mindful walk in nature"
        ],
        color: "from-pink-500 to-rose-600"
      },
      "Self-Care": {
        title: "Your self-care journey begins now!",
        icon: "💖",
        steps: [
          "Schedule 30 minutes daily for yourself",
          "Try a new Yoga asana",
          "Connect with a loved one",
          "Practice the 'body as temple' principle"
        ],
        color: "from-red-500 to-pink-600"
      },
      "Building Resilience": {
        title: "Ready to build your resilience!",
        icon: "🛡️",
        steps: [
          "Developing problem-solving skills",
          "Building your support network",
          "Practicing daily gratitude",
          "Learning from challenges as opportunities"
        ],
        color: "from-orange-500 to-red-600"
      }
    };

    const journey = journeyActions[resource.title];
    if (journey) {
      setNotificationData(journey);
    } else {
      setNotificationData({
        title: "Ready to start your mental health journey!",
        icon: "🌟",
        steps: [
          "Practice the tips we discussed",
          "Visit the resources we shared",
          "Start with small, daily practices",
          "Be patient and kind to yourself"
        ],
        color: "from-yellow-500 to-orange-600"
      });
    }
    
    setShowNotification(true);
    

  };

  const closeNotification = () => {
    setShowNotification(false);
    setNotificationData(null);
  };

  if (!resource) return null;

  const resourceDetails = {
    "Understanding Anxiety": {
      content: [
        "Anxiety is a natural response to stress, but when it becomes overwhelming, it can interfere with daily life. As the Bhagwat Geeta teaches us, 'Yoga is the journey of the self, through the self, to the self' - understanding our inner turmoil is the first step to peace.",
        "Common symptoms include excessive worry, restlessness, difficulty concentrating, and physical symptoms like rapid heartbeat. The Geeta reminds us that 'The mind acts like an enemy for those who do not control it' - highlighting the importance of mastering our thoughts.",
        "Understanding your anxiety triggers is the first step toward managing them effectively. The ancient wisdom suggests that true peace comes from within, not from external circumstances."
      ],
      tips: [
        "Practice deep breathing exercises (Pranayama as mentioned in ancient texts)",
        "Identify and challenge negative thoughts - remember the Geeta's teaching about controlling the mind",
        "Maintain a regular sleep schedule for mental clarity",
        "Limit caffeine and alcohol intake",
        "Consider talking to a mental health professional"
      ],
      resources: [
        { name: "NIMHANS Bangalore - Anxiety Resources", url: "https://nimhans.ac.in" },
        { name: "Vandrevala Foundation - Mental Health Support", url: "https://vandrevalafoundation.com" },
        { name: "The Live Love Laugh Foundation", url: "https://thelivelovelaughfoundation.org" },
        { name: "Mindful.org - Anxiety Resources", url: "https://mindful.org" }
      ],
      duration: "5-10 minutes daily",
      difficulty: "Beginner friendly"
    },
    "Stress Management": {
      content: [
        "Stress is your body's way of responding to any kind of demand or threat. While some stress can be beneficial, chronic stress can harm your health. The Bhagwat Geeta teaches us to perform our duties without attachment to results - 'Karmanye Vadhikaraste Ma Phaleshu Kadachana'.",
        "Effective stress management involves identifying stressors and developing healthy coping mechanisms. The ancient wisdom emphasizes that true strength comes from maintaining equanimity in both success and failure.",
        "Regular stress management practices can improve your overall well-being and quality of life. As the Geeta says, 'Yoga is evenness of mind' - finding balance in all situations."
      ],
      tips: [
        "Practice progressive muscle relaxation and meditation",
        "Engage in regular physical activity (Yoga asanas)",
        "Maintain a balanced diet (Sattvic food principles)",
        "Set realistic goals and priorities",
        "Learn to say no when necessary - practice detachment"
      ],
      resources: [
        { name: "Art of Living Foundation", url: "https://artofliving.org" },
        { name: "Isha Foundation - Stress Management", url: "https://isha.sadhguru.org" },
        { name: "Brahmananda Saraswati Foundation", url: "https://brahmananda.org" },
        { name: "American Psychological Association", url: "https://apa.org" }
      ],
      duration: "10-15 minutes daily",
      difficulty: "All levels"
    },
    "Sleep Better": {
      content: [
        "Quality sleep is essential for mental and physical health. Poor sleep can contribute to anxiety, depression, and other mental health issues. The Bhagwat Geeta teaches us about the importance of maintaining natural rhythms and finding rest in the divine.",
        "Establishing a consistent sleep routine and creating a sleep-friendly environment can significantly improve sleep quality. Ancient wisdom suggests that peaceful sleep comes from a peaceful mind.",
        "Good sleep hygiene practices can help you fall asleep faster and stay asleep longer. The Geeta's teachings about surrendering worries can be particularly helpful for those struggling with sleep."
      ],
      tips: [
        "Maintain a consistent sleep schedule (following natural circadian rhythms)",
        "Create a relaxing bedtime routine with meditation",
        "Keep your bedroom cool, dark, and quiet",
        "Avoid screens 1 hour before bedtime",
        "Practice gratitude before sleep - as the Geeta teaches contentment"
      ],
      resources: [
        { name: "Sleep Foundation India", url: "https://sleepfoundationindia.org" },
        { name: "Ayurvedic Sleep Solutions", url: "https://ayurveda.com" },
        { name: "Brahmananda Saraswati Foundation - Sleep", url: "https://brahmananda.org" },
        { name: "National Sleep Foundation", url: "https://thensf.org" }
      ],
      duration: "7-9 hours nightly",
      difficulty: "Beginner friendly"
    },
    "Mindfulness": {
      content: [
        "Mindfulness is the practice of being fully present in the moment, without judgment. It can help reduce stress, anxiety, and improve overall well-being. The Bhagwat Geeta's teachings on meditation and self-awareness form the foundation of mindfulness practices.",
        "Regular mindfulness practice can help you develop greater awareness of your thoughts, feelings, and bodily sensations. The Geeta teaches us to observe the mind as a witness, not as the mind itself.",
        "Mindfulness can be practiced through meditation, breathing exercises, or simply paying attention to daily activities. Ancient Indian wisdom has long emphasized the power of present-moment awareness."
      ],
      tips: [
        "Start with short 5-minute sessions (Dhyana practice)",
        "Focus on your breath (Pranayama techniques)",
        "Practice mindful eating (conscious consumption)",
        "Take mindful walks in nature (connecting with creation)",
        "Use guided meditation apps with Indian wisdom"
      ],
      resources: [
        { name: "Vipassana Research Institute", url: "https://www.vridhamma.org" },
        { name: "Krishnamurti Foundation India", url: "https://kfionline.org" },
        { name: "Ramakrishna Mission - Meditation", url: "https://belurmath.org" },
        { name: "Mindful.org", url: "https://mindful.org" }
      ],
      duration: "5-20 minutes daily",
      difficulty: "Beginner to advanced"
    },
    "Self-Care": {
      content: [
        "Self-care is the practice of taking action to preserve or improve your own health, well-being, and happiness. The Bhagwat Geeta teaches us that taking care of our body and mind is a sacred duty - 'Deho Devalaya Prokto' (the body is a temple).",
        "Self-care is not selfish—it's essential for maintaining good mental health and being able to care for others. The ancient wisdom emphasizes that we must first be well to serve others effectively.",
        "Self-care practices can include physical, emotional, social, and spiritual activities that nourish your mind, body, and soul. The Geeta's holistic approach to wellness includes physical, mental, and spiritual well-being."
      ],
      tips: [
        "Practice regular physical activity (Yoga and exercise)",
        "Maintain healthy eating habits (Sattvic diet principles)",
        "Connect with loved ones regularly (building community)",
        "Engage in hobbies and interests (finding joy in activities)",
        "Set boundaries and learn to say no (practicing self-respect)"
      ],
      resources: [
        { name: "Swasthya - Indian Wellness Platform", url: "https://swasthya.com" },
        { name: "Ayurvedic Self-Care Resources", url: "https://ayurveda.com" },
        { name: "Art of Living - Self-Care Programs", url: "https://artofliving.org" },
        { name: "Psychology Today - Self-Care", url: "https://psychologytoday.com" }
      ],
      duration: "30 minutes daily",
      difficulty: "All levels"
    },
    "Building Resilience": {
      content: [
        "Resilience is the ability to bounce back from difficult experiences and adapt to change. It's a skill that can be developed and strengthened over time. The Bhagwat Geeta teaches us that challenges are opportunities for growth - 'Whatever happened, happened for the good'.",
        "Building resilience involves developing healthy coping mechanisms, maintaining strong relationships, and cultivating a positive mindset. The ancient wisdom emphasizes that true strength comes from inner stability and faith.",
        "Resilient people are better able to handle stress, overcome challenges, and maintain good mental health. The Geeta's teachings on equanimity and acceptance help us develop this inner strength."
      ],
      tips: [
        "Develop problem-solving skills (practical wisdom)",
        "Build strong support networks (community connection)",
        "Practice optimism and gratitude (positive mindset)",
        "Learn from past experiences (growth mindset)",
        "Maintain physical and mental health (holistic wellness)"
      ],
      resources: [
        { name: "Indian Association of Clinical Psychologists", url: "https://iacp.in" },
        { name: "Mental Health Foundation India", url: "https://mhfi.org" },
        { name: "Brahmananda Saraswati Foundation - Resilience", url: "https://brahmananda.org" },
        { name: "Greater Good Science Center", url: "https://greatergood.berkeley.edu" }
      ],
      duration: "Ongoing practice",
      difficulty: "All levels"
    }
  };

  const details = resourceDetails[resource.title] || {
    content: ["Information coming soon..."],
    tips: ["More tips will be added soon"],
    resources: [],
    duration: "Varies",
    difficulty: "All levels"
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
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
              className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl ${resource.color} bg-opacity-5`}
            >
              {/* Header */}
              <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 rounded-t-2xl">
                <div className="flex items-center justify-between p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${resource.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <span className="text-2xl">{resource.icon}</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        {resource.title}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300">
                        {resource.description}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-8">
                {/* Overview */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-primary-500" />
                    Overview
                  </h3>
                  <div className="space-y-3">
                    {details.content.map((paragraph, index) => (
                      <p key={index} className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="w-4 h-4 text-primary-500" />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Time Commitment</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-800 dark:text-white">{details.duration}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Star className="w-4 h-4 text-primary-500" />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Difficulty Level</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-800 dark:text-white">{details.difficulty}</p>
                  </div>
                </div>

                {/* Practical Tips */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                    <Lightbulb className="w-5 h-5 mr-2 text-primary-500" />
                    Practical Tips
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {details.tips.map((tip, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Resources */}
                {details.resources.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                      <ExternalLink className="w-5 h-5 mr-2 text-primary-500" />
                      Additional Resources
                    </h3>
                    <div className="space-y-3">
                      {details.resources.map((resource, index) => (
                        <a
                          key={index}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-gray-800 dark:text-white font-medium group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
                              {resource.name}
                            </span>
                            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary-500 transition-colors duration-200" />
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Call to Action */}
                <div className="bg-gradient-to-r from-blue-500 to-amber-100 rounded-xl p-6 text-center">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Ready to Get Started?
                  </h3>
                  <p className="text-white/90 mb-4">
                    Take the first step toward better mental health today.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleStartJourney}
                    className="bg-white text-blue-600 px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Start Your Journey
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Beautiful Custom Notification */}
      <AnimatePresence>
        {showNotification && notificationData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              onClick={closeNotification}
            />
            
            {/* Notification Card */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border-2 overflow-hidden ${notificationData.color.replace('from-', 'border-').replace('to-', '')} border-opacity-30`}
            >
              {/* Gradient Header */}
              <div className={`bg-gradient-to-r ${notificationData.color} p-6 text-white relative overflow-hidden`}>
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
                
                <div className="flex items-center space-x-4 relative z-10">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <span className="text-4xl">{notificationData.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{notificationData.title}</h3>
                    <p className="text-white/80 text-sm mt-1">Your personalized journey guide</p>
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
                <div className="space-y-4">
                  <h4 className="text-xl font-bold mb-4 text-black dark:text-white">
                    Next Steps for Your Journey:
                  </h4>
                  
                  {notificationData.steps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-start space-x-4 p-4 rounded-2xl border-2 border-opacity-50 ${
                        index === 0 ? 'bg-blue-50 border-blue-500 dark:bg-blue-900/20 dark:border-blue-700' :
                        index === 1 ? 'bg-green-50 border-green-500 dark:bg-green-900/20 dark:border-green-700' :
                        index === 2 ? 'bg-purple-50 border-purple-500 dark:bg-purple-900/20 dark:border-purple-700' :
                        'bg-orange-50 border-orange-500 dark:bg-orange-900/20 dark:border-orange-700'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        index === 0 ? 'bg-blue-600 text-white' :
                        index === 1 ? 'bg-green-600 text-white' :
                        index === 2 ? 'bg-purple-600 text-white' :
                        'bg-orange-600 text-white'
                      }`}>
                        <span className="text-sm font-bold">{index + 1}</span>
                      </div>
                      <p className="text-base leading-relaxed font-bold text-black dark:text-white">{step}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Footer */}
              <div className="bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">🌟</span>
                  <span className="text-sm font-bold text-black dark:text-white">Your journey begins now!</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={closeNotification}
                  className={`bg-gradient-to-r ${notificationData.color} text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2`}
                >
                  <span>Got it!</span>
                  <CheckCircle className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ResourceModal; 