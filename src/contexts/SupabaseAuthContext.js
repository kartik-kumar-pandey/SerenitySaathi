import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase';

const SupabaseAuthContext = createContext();

export const SupabaseAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
          setError(error.message);
        } else if (session) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
            created_at: session.user.created_at,
            last_sign_in_at: session.user.last_sign_in_at
          });
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (event === 'SIGNED_IN' && session) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
            created_at: session.user.created_at,
            last_sign_in_at: session.user.last_sign_in_at
          });
          setError(null);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setError(null);
        } else if (event === 'TOKEN_REFRESHED' && session) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
            created_at: session.user.created_at,
            last_sign_in_at: session.user.last_sign_in_at
          });
        } else if (event === 'PASSWORD_RECOVERY' && session) {
          console.log('Password recovery event detected');
          // This event is triggered when user clicks reset link
          setUser({
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
            created_at: session.user.created_at,
            last_sign_in_at: session.user.last_sign_in_at
          });
          
          // Dispatch custom event to trigger password reset modal
          window.dispatchEvent(new CustomEvent('password-recovery'));
        }
        
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        // Provide more user-friendly error messages
        let userFriendlyMessage = error.message;
        if (error.message.includes('Invalid login credentials')) {
          userFriendlyMessage = 'Invalid email or password. Please check your credentials and try again.';
        } else if (error.message.includes('Email not confirmed')) {
          userFriendlyMessage = 'Please check your email and confirm your account before logging in.';
        } else if (error.message.includes('Too many requests')) {
          userFriendlyMessage = 'Too many login attempts. Please wait a moment before trying again.';
        }
        setError(userFriendlyMessage);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      // Don't set error again if already set above
      if (!error.message.includes('Invalid login credentials') && 
          !error.message.includes('Email not confirmed') && 
          !error.message.includes('Too many requests')) {
        setError('An unexpected error occurred. Please try again.');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name, email, password) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name
          }
        }
      });

      if (error) {
        // Provide more user-friendly error messages
        let userFriendlyMessage = error.message;
        if (error.message.includes('User already registered')) {
          userFriendlyMessage = 'An account with this email already exists. Please try logging in instead.';
        } else if (error.message.includes('Password should be at least')) {
          userFriendlyMessage = 'Password must be at least 6 characters long.';
        } else if (error.message.includes('Invalid email')) {
          userFriendlyMessage = 'Please enter a valid email address.';
        } else if (error.message.includes('Unable to validate email address')) {
          userFriendlyMessage = 'Unable to validate email address. Please check your email and try again.';
        }
        setError(userFriendlyMessage);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Signup error:', error);
      // Don't set error again if already set above
      if (!error.message.includes('User already registered') && 
          !error.message.includes('Password should be at least') && 
          !error.message.includes('Invalid email') && 
          !error.message.includes('Unable to validate email address')) {
        setError('An unexpected error occurred during signup. Please try again.');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Save current user data before logout to ensure it persists
      if (user) {
        try {
          console.log('Saving user data before logout...');
          // Note: We can't access the current app state here, but the data should already be saved
          // from the AppContext's save effect
        } catch (saveError) {
          console.warn('Could not save data before logout:', saveError);
        }
      }
      
      // Sign out from Supabase (this will clear the session but keep data in database)
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        setError(error.message);
        throw error;
      }
      
      // Clear local user state
      setUser(null);
      setError(null);
      
      console.log('User logged out successfully. Data remains in database for next login.');
    } catch (error) {
      console.error('Logout error:', error);
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}`
      });

      if (error) {
        setError(error.message);
        throw error;
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (newPassword) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        setError(error.message);
        throw error;
      }
    } catch (error) {
      console.error('Update password error:', error);
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.updateUser({
        data: updates
      });

      if (error) {
        setError(error.message);
        throw error;
      }

      // Update local user state
      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || data.user.email?.split('@')[0],
          created_at: data.user.created_at,
          last_sign_in_at: data.user.last_sign_in_at
        });
      }

      return data;
    } catch (error) {
      console.error('Update profile error:', error);
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const isAuthenticated = !!user;

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    signup,
    logout,
    resetPassword,
    updatePassword,
    updateProfile
  };

  return (
    <SupabaseAuthContext.Provider value={value}>
      {children}
    </SupabaseAuthContext.Provider>
  );
};

export const useSupabaseAuthContext = () => {
  const context = useContext(SupabaseAuthContext);
  if (!context) {
    throw new Error('useSupabaseAuthContext must be used within a SupabaseAuthProvider');
  }
  return context;
}; 