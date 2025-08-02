import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export const useSupabaseAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Listen for auth state changes
  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
          createdAt: session.user.created_at,
          lastSignIn: session.user.last_sign_in_at
        });
      }
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
            createdAt: session.user.created_at,
            lastSignIn: session.user.last_sign_in_at
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Sign up function
  const signup = async (name, email, password) => {
    setError(null);
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name
          }
        }
      });

      if (error) throw error;

      return data.user;
    } catch (error) {
      let errorMessage = 'An error occurred during signup';
      
      switch (error.message) {
        case 'User already registered':
          errorMessage = 'An account with this email already exists';
          break;
        case 'Invalid email':
          errorMessage = 'Please enter a valid email address';
          break;
        case 'Password should be at least 6 characters':
          errorMessage = 'Password should be at least 6 characters long';
          break;
        default:
          errorMessage = error.message;
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email, password) => {
    setError(null);
    setLoading(true);
    
    try {
      console.log('Attempting Supabase login with:', { email, password: '***' });
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      console.log('Supabase login successful:', data.user);
      return data.user;
    } catch (error) {
      console.error('Supabase login error:', error);
      let errorMessage = 'An error occurred during login';
      
      switch (error.message) {
        case 'Invalid login credentials':
          errorMessage = 'Invalid email or password';
          break;
        case 'Email not confirmed':
          errorMessage = 'Please check your email and confirm your account';
          break;
        case 'Too many requests':
          errorMessage = 'Too many failed attempts. Please try again later';
          break;
        default:
          errorMessage = `Login failed: ${error.message}`;
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setError(null);
    try {
      // Clear user data from local state first
      setUser(null);
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      console.log('User logged out successfully');
    } catch (error) {
      setError('An error occurred during logout');
      throw error;
    }
  };

  // Password reset function
  const resetPassword = async (email) => {
    setError(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
    } catch (error) {
      let errorMessage = 'An error occurred while sending reset email';
      
      switch (error.message) {
        case 'User not found':
          errorMessage = 'No account found with this email address';
          break;
        case 'Invalid email':
          errorMessage = 'Please enter a valid email address';
          break;
        default:
          errorMessage = error.message;
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Update user profile
  const updateUserProfile = async (updates) => {
    setError(null);
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: updates
      });

      if (error) throw error;

      // Update local user state
      if (data.user) {
        setUser(prev => ({
          ...prev,
          ...updates
        }));
      }
    } catch (error) {
      setError('Failed to update profile');
      throw error;
    }
  };

  return {
    user,
    loading,
    error,
    signup,
    login,
    logout,
    resetPassword,
    updateUserProfile,
    isAuthenticated: !!user
  };
}; 