# Supabase Setup Guide for SerenitySaathi

A comprehensive guide to set up Supabase backend for SerenitySaathi - Your secure mental health companion with full authentication, data persistence, and user management.

## 🚀 Quick Overview

SerenitySaathi now includes:
- ✅ **Full User Authentication** - Sign up, login, logout with email/password
- ✅ **Password Reset** - Secure email-based password recovery
- ✅ **User Profiles** - Personal settings, preferences, and account management
- ✅ **Data Persistence** - Chat history, mood tracking, and user preferences
- ✅ **Multi-language Support** - English and Hindi
- ✅ **Dark/Light Mode** - User preference with automatic saving
- ✅ **Real-time Data Sync** - Automatic data synchronization across sessions
- ✅ **Row Level Security** - Complete data isolation between users

## Step 1: Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Sign up for a free account
3. Create a new project

## Step 2: Get Your Credentials
1. In your Supabase dashboard, go to Settings > API
2. Copy your Project URL and anon/public key
3. Update `src/supabase.js` with your credentials:

```javascript
const supabaseUrl = 'https://your-project-id.supabase.co'
const supabaseAnonKey = 'your-anon-key-here'
```

## Step 3: Configure Authentication
1. Go to Authentication > Settings in your Supabase dashboard
2. **Enable Email Auth**: Make sure "Enable email confirmations" is OFF for testing
3. **Configure Site URL**: Set your site URL to `http://localhost:3000` for development
4. **Add Redirect URLs**: Add `http://localhost:3000` to the redirect URLs list
5. **Password Reset**: The app automatically handles password reset when users click the reset link from their email

## Step 4: Create Database Table
1. Go to SQL Editor in your Supabase dashboard
2. Run this SQL to create the user_data table:

```sql
-- Create the user_data table
CREATE TABLE IF NOT EXISTS user_data (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  conversations JSONB DEFAULT '[]',
  mood_history JSONB DEFAULT '[]',
  preferences JSONB DEFAULT '{"language": "en", "notifications": true, "autoSave": true}',
  dark_mode BOOLEAN DEFAULT false,
  current_conversation_id BIGINT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_data_user_id ON user_data(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can access own data" ON user_data;
DROP POLICY IF EXISTS "Users can insert own data" ON user_data;
DROP POLICY IF EXISTS "Users can update own data" ON user_data;
DROP POLICY IF EXISTS "Users can delete own data" ON user_data;

-- Create comprehensive policies
CREATE POLICY "Users can access own data" ON user_data
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own data" ON user_data
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own data" ON user_data
  FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own data" ON user_data
  FOR DELETE USING (auth.uid()::text = user_id);
```

## Step 5: Test All Features
1. Start your React app with `npm start`
2. **Test User Registration**: Create a new account with email/password
3. **Test Login**: Log in with the created account
4. **Test Password Reset**: Use "Forgot Password" feature
5. **Test User Profile**: Access profile settings and preferences
6. **Test Data Persistence**: Create chat messages, then logout/login to verify data is saved
7. **Test Dark Mode**: Toggle dark/light mode in user preferences
8. **Test Language**: Switch between English and Hindi
9. Check the browser console for any errors

## Step 6: Troubleshooting Common Issues

### "Invalid login credentials" Error
- **Cause**: User doesn't exist or email confirmation is required
- **Solution**: 
  1. Disable email confirmation in Authentication > Settings
  2. Or check your email and confirm the account
  3. Make sure you're using the correct email/password

### "Failed to load resource: 400" Error
- **Cause**: Supabase project not properly configured
- **Solution**:
  1. Check your credentials in `src/supabase.js`
  2. Make sure your Supabase project is active
  3. Verify the project URL is correct

### "RLS Policy Violation" Error
- **Cause**: Row Level Security policies not set up correctly
- **Solution**: Run the SQL commands from Step 4 again

### "Connection Refused" Error
- **Cause**: Wrong Supabase URL or project is paused
- **Solution**:
  1. Check your project URL in the Supabase dashboard
  2. Make sure your project is not paused
  3. Verify your internet connection

### Password Reset Not Working
- **Cause**: Redirect URL not configured properly
- **Solution**:
  1. Make sure `http://localhost:3000` is in your redirect URLs
  2. Check that the password reset email is being sent
  3. Verify the reset link redirects to your app

### Data Not Persisting After Login
- **Cause**: RLS policies or user data table issues
- **Solution**:
  1. Check that the user_data table exists
  2. Verify RLS policies are active
  3. Check browser console for specific error messages

## Step 7: Development vs Production
- **Development**: Use `http://localhost:3000` as site URL
- **Production**: Update site URL to your actual domain
- **Environment Variables**: Consider using `.env` files for credentials

## 🎯 Current Features

### Authentication System
- **Email/Password Registration**: Secure user account creation
- **Email/Password Login**: Standard authentication flow
- **Password Reset**: Email-based password recovery
- **Session Management**: Automatic session handling
- **Secure Logout**: Proper session cleanup

### User Profile Management
- **Personal Information**: Display user name, email, and account details
- **Preferences Tab**: Dark mode toggle, language selection, notifications, auto-save
- **Privacy Tab**: Data privacy information and security details
- **Account Information**: User ID, member since date, last login

### Data Persistence
- **Chat History**: All conversations saved and restored
- **Mood Tracking**: User mood history preserved
- **User Preferences**: Settings saved across sessions
- **Real-time Sync**: Automatic data synchronization

### UI/UX Features
- **Responsive Design**: Works on all device sizes
- **Dark/Light Mode**: Theme switching with persistence
- **Multi-language**: English and Hindi support
- **Smooth Animations**: Framer Motion powered transitions
- **Modern Icons**: Lucide React icon library

## Benefits of Supabase:
- ✅ **Free Tier**: 500MB database, 50MB file storage, 2GB bandwidth
- ✅ **Real-time**: Automatic data synchronization
- ✅ **Secure**: Built-in authentication and row-level security
- ✅ **Scalable**: Easy to upgrade as your app grows
- ✅ **User Isolation**: Each user gets their own data space
- ✅ **Password Reset**: Built-in email-based password recovery
- ✅ **Session Management**: Automatic session handling

## Quick Test Commands
After setup, you can test with these commands in the SQL Editor:

```sql
-- Check if table exists
SELECT * FROM user_data LIMIT 1;

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'user_data';

-- Check user data (replace with actual user_id)
SELECT * FROM user_data WHERE user_id = 'your-user-id';
```

## 🔧 Advanced Configuration

### Environment Variables
Create a `.env` file in your project root:
```
REACT_APP_SUPABASE_URL=your-supabase-url
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Custom Authentication
The app uses Supabase Auth with these features:
- Email/password authentication
- Password reset via email
- Session management
- Row Level Security (RLS)

### Database Schema
The `user_data` table stores:
- `user_id`: Unique user identifier
- `conversations`: JSON array of chat messages
- `mood_history`: JSON array of mood entries
- `preferences`: JSON object of user settings
- `dark_mode`: Boolean for theme preference
- `current_conversation_id`: Active conversation reference

## Need Help?
- Check the [Supabase Documentation](https://supabase.com/docs)
- Visit the [Supabase Community](https://github.com/supabase/supabase/discussions)
- Review the browser console for detailed error messages
- Check the React app console for authentication and data flow logs

## 🎉 Success Indicators
Your setup is complete when you can:
- ✅ Register new users
- ✅ Login with existing users
- ✅ Reset passwords via email
- ✅ Access user profile and preferences
- ✅ Toggle dark/light mode
- ✅ Switch between languages
- ✅ Chat messages persist after logout/login
- ✅ No console errors related to Supabase 