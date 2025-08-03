# 🧠 SerenitySaathi — Your Secure Mental Health Companion Mitra

A beautiful, empathetic mental health chatbot built with React and Supabase, designed to provide supportive conversations, mental wellness resources, and secure user management.

## ✨ Features

### 🔐 **Authentication & Security**
- **Full User Authentication** - Secure sign up, login, and logout with email/password
- **Password Reset** - Email-based password recovery system
- **User Profiles** - Personal settings, preferences, and account management
- **End-to-End Encryption** - AES-256 encryption for all chat messages
- **Data Privacy** - Row Level Security (RLS) ensures complete user data isolation
- **Session Management** - Automatic session handling and secure logout
- **Privacy Controls** - User-specific encryption keys and privacy settings

### 💬 **Chat & Communication**
- **AI-Powered Conversations** - Powered by Google Gemini 2.0 Flash for intelligent, empathetic responses
- **Conversation History** - All chats saved and restored across sessions with encryption
- **Smart Suggestions** - Helpful prompts to get started with conversations
- **Multi-language Support** - English and Hindi language options with automatic language detection
- **Encrypted Chat Export** - Secure export of conversation history
- **Context-Aware Responses** - AI remembers conversation context for personalized interactions

### 🎨 **User Experience**
- **Responsive Design** - Works perfectly on mobile and desktop
- **Dark/Light Mode** - Theme switching with automatic preference saving
- **Beautiful UI** - Modern, calming interface with smooth animations
- **Accessibility** - Designed with mental health and accessibility in mind

### 🧠 **Mental Health Features**
- **Mental Health Resources** - Anxiety relief, meditation tips, and self-care guidance
- **Mood Tracking** - Track and save your mood history
- **Crisis Support** - Emergency contact information and immediate resources
- **Breathing Exercises** - Guided breathing techniques for relaxation
- **Resource Library** - Comprehensive mental health resources and tips

### 💾 **Data Management**
- **Data Persistence** - Chat history, mood tracking, and preferences saved
- **Real-time Sync** - Automatic data synchronization across sessions
- **User Preferences** - Customizable settings for notifications, auto-save, and more
- **Account Management** - Complete user profile with account information

## 🛠️ Tech Stack

### **Frontend**
- **React 18** - Modern React with hooks and functional components
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful, customizable icons
- **CryptoJS** - AES-256 encryption for message security

### **Backend & Database**
- **Supabase** - Backend-as-a-Service with PostgreSQL database
- **Supabase Auth** - Built-in authentication system
- **Row Level Security (RLS)** - Database-level security policies
- **Real-time Subscriptions** - Live data synchronization
- **Encrypted Data Storage** - Application-level encryption before database storage

### **AI & Machine Learning**
- **Google Gemini 2.0 Flash** - Advanced AI model for natural conversations
- **Mental Health Specialization** - Custom prompts for empathetic mental health support
- **Multi-language AI** - Automatic language detection and response generation
- **Context Awareness** - AI maintains conversation context for personalized interactions

### **Development Tools**
- **Create React App** - React development environment
- **PostCSS** - CSS processing
- **ESLint** - Code linting and quality assurance

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Supabase account (free tier available)
- Google Gemini API key (for AI chat functionality)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd serenitasaathi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   - Copy `env.example` to `.env`
   - Update the following variables in your `.env` file:
     ```bash
     REACT_APP_SUPABASE_URL=your_supabase_url
     REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
     REACT_APP_GEMINI_API_KEY=your_gemini_api_key
     REACT_APP_GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent
     ```

4. **Get API Keys**
   - **Supabase**: Follow the [Supabase Setup Guide](SUPABASE_SETUP.md) to get your credentials
   - **Google Gemini**: Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎯 Project Structure

```
serenitasaathi/
├── public/
│   ├── index.html
│   └── logo_SerenitySaathi.png       # App logo
├── src/
│   ├── components/
│   │   ├── ChatInterface.js          # Main chat component with Gemini AI integration
│   │   ├── UserProfile.js            # User profile and settings
│   │   ├── LoginModal.js             # Authentication modal
│   │   ├── PasswordResetModal.js     # Password reset functionality
│   │   ├── ResourceCard.js           # Mental health resources
│   │   ├── CrisisSupport.js          # Emergency support info
│   │   ├── Disclaimer.js             # App disclaimer
│   │   ├── MoodTracker.js            # Mood tracking component
│   │   ├── BreathingExercise.js      # Breathing exercises
│   │   └── PrivacyIndicator.js       # Privacy and encryption status
│   ├── contexts/
│   │   ├── AppContext.js             # Global app state
│   │   ├── SupabaseAuthContext.js    # Authentication context
│   │   └── LanguageContext.js        # Multi-language support
│   ├── hooks/
│   │   └── useSupabaseAuth.js        # Custom auth hooks
│   ├── utils/
│   │   └── encryption.js             # Message encryption utilities
│   ├── App.js                        # Main app component
│   ├── supabase.js                   # Supabase configuration
│   ├── index.js                      # React entry point
│   └── index.css                     # Global styles
├── SUPABASE_SETUP.md                 # Supabase configuration guide
├── WORKFLOW.md                       # Application workflow documentation
├── package.json
├── tailwind.config.js
└── README.md
```

## 🔐 Authentication Features

### User Registration & Login
- **Email/Password Registration**: Secure account creation
- **Email/Password Login**: Standard authentication flow
- **Password Reset**: Email-based password recovery
- **Session Management**: Automatic session handling
- **Secure Logout**: Proper session cleanup

### User Profile Management
- **Personal Information**: Display user name, email, and account details
- **Preferences Tab**: Dark mode toggle, language selection, notifications, auto-save
- **Privacy Tab**: Data privacy information and security details
- **Account Information**: User ID, member since date, last login

## 💾 Data Persistence

### What Gets Saved
- **Chat History**: All conversations with timestamps
- **Mood Tracking**: Daily mood entries and patterns
- **User Preferences**: Theme, language, notification settings
- **Account Data**: User profile and authentication information

### Data Security
- **Row Level Security (RLS)**: Database-level user data isolation
- **End-to-End Encryption**: AES-256 encryption for all chat messages
- **User-Specific Keys**: Each user has unique encryption keys
- **Encrypted Storage**: All data encrypted at rest and in transit
- **User Isolation**: Each user can only access their own data
- **No Data Sharing**: User data is never shared with third parties
- **Privacy Controls**: Visual indicators and privacy settings

## 🎨 Customization

### Colors & Theme

The app uses a custom mental health color palette defined in `tailwind.config.js`:

- **Primary**: Blue tones for trust and calm
- **Mental**: Purple tones for creativity and wisdom
- **Calm**: Teal tones for tranquility
- **Support**: Green tones for growth and healing

### Adding Resources

To add new mental health resources, update the `resources` array in `App.js`:

```javascript
const resources = [
  {
    id: 4,
    title: "New Resource",
    description: "Description here",
    icon: YourIcon,
    color: "bg-your-color text-your-text",
    tips: ["Tip 1", "Tip 2", "Tip 3"]
  }
];
```

### Language Support

To add new languages, update the `LanguageContext.js`:

```javascript
const translations = {
  en: { /* English translations */ },
  hi: { /* Hindi translations */ },
  es: { /* Spanish translations */ } // Add new language
};
```

## 📱 Deployment

### Frontend (Vercel)

1. **Connect to Vercel**
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

### Backend (Supabase)

1. **Production Setup**
   - Update site URL in Supabase dashboard
   - Configure production redirect URLs
   - Set up environment variables

2. **Environment Variables**
   ```bash
   REACT_APP_SUPABASE_URL=your-production-supabase-url
   REACT_APP_SUPABASE_ANON_KEY=your-production-anon-key
   ```

## 🔒 Privacy & Ethics

- **End-to-End Encryption**: AES-256 encryption for all chat messages
- **User-Specific Encryption Keys**: Each user has unique keys derived from their credentials
- **Secure Authentication**: Supabase Auth with industry-standard security
- **Data Encryption**: All data encrypted at rest and in transit
- **User Control**: Users can manage their own data and preferences
- **Privacy Indicators**: Visual feedback showing encryption status
- **Crisis Awareness**: Clear disclaimers and emergency resources
- **Professional Boundaries**: Clear limitations and professional help guidance
- **GDPR Compliant**: Built with privacy regulations in mind
- **No Backdoor Access**: Even administrators cannot decrypt user messages

## 🆘 Crisis Support

The app includes emergency resources for users in crisis:

- **1800-121-3667** - National Suicide Prevention Helpline
- **112** - Emergency Services
- **Local Resources** - Country-specific emergency contacts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow React best practices
- Use TypeScript for new components (optional)
- Maintain accessibility standards
- Test all authentication flows
- Ensure data persistence works correctly

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Important Disclaimer

SerenitySaathi is designed to provide supportive conversations and mental health resources, but it is **not a substitute for professional mental health care**. 

- For emergencies, call 988 or 911 immediately
- For professional help, contact a licensed mental health provider
- This tool is meant to complement, not replace, professional treatment
- Always prioritize your safety and well-being

## 🎉 Recent Updates

### Version 2.1 Features
- ✅ **End-to-End Encryption** - AES-256 encryption for all chat messages
- ✅ **User-Specific Encryption Keys** - Unique keys for each user
- ✅ **Privacy Indicators** - Visual encryption status and privacy controls
- ✅ **Enhanced Security** - No backdoor access to encrypted messages
- ✅ **Privacy Settings** - Comprehensive privacy and security information
- ✅ **Google Gemini 2.0 Flash Integration** - Advanced AI for intelligent conversations
- ✅ **Multi-language AI Support** - Automatic language detection and response generation

### Version 2.0 Features
- ✅ **Complete Authentication System** - Full user registration and login
- ✅ **Password Reset** - Email-based password recovery
- ✅ **User Profiles** - Comprehensive user management
- ✅ **Data Persistence** - Chat history and preferences saved
- ✅ **Multi-language Support** - English and Hindi
- ✅ **Dark/Light Mode** - Theme switching with persistence
- ✅ **Crisis Support** - Emergency resources and contacts
- ✅ **Mood Tracking** - Daily mood monitoring
- ✅ **Breathing Exercises** - Guided relaxation techniques
- ✅ **Responsive Design** - Works on all devices

## 🙏 Acknowledgments

- Built with ❤️ for mental health awareness
- Inspired by the need for accessible mental health support
- Thanks to the open-source community for amazing tools and libraries
- Special thanks to Supabase for the excellent backend platform

---

**Remember**: You are not alone. Help is always available. 💙

**Need help setting up?** Check out our [Supabase Setup Guide](SUPABASE_SETUP.md) for detailed instructions. 