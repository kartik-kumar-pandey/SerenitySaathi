import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase';

const SupabaseAuthContext = createContext();

export const SupabaseAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getInitialSession = async () => {
             try {
         const { data: { session }, error } = await supabase.auth.getSession();
         if (error) {
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
         setError(error.message);
       } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

         const { data: { subscription } } = supabase.auth.onAuthStateChange(
       async (event, session) => {
        
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
          setUser({
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
            created_at: session.user.created_at,
            last_sign_in_at: session.user.last_sign_in_at
          });
          
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
        let userFriendlyMessage = error.message;
        if (error.message.includes('Invalid login credentials')) {
          userFriendlyMessage = 'Invalid email or password. Please check your credentials and try again.';
        } else if (error.message.includes('Email not confirmed')) {
          userFriendlyMessage = 'Please check your email and confirm your account before logging in.';
        } else if (error.message.includes('Too many requests')) {
          userFriendlyMessage = 'Too many login attempts. Please wait a moment before trying again.';
        }
        throw new Error(userFriendlyMessage);
      }

      return data;
    } catch (error) {
      if (error.message.includes('Invalid email or password') || 
          error.message.includes('Please check your email') || 
          error.message.includes('Too many login attempts')) {
        throw error;
      }
      throw new Error('An unexpected error occurred. Please try again.');
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
        throw new Error(userFriendlyMessage);
      }

      return data;
    } catch (error) {
      if (error.message.includes('An account with this email already exists') || 
          error.message.includes('Password must be at least') || 
          error.message.includes('Please enter a valid email') || 
          error.message.includes('Unable to validate email address')) {
        throw error;
      }
      throw new Error('An unexpected error occurred during signup. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
       if (user) {
         try {
         } catch (saveError) {
         }
       }
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        setError(error.message);
        throw error;
      }
      
       setUser(null);
       setError(null);
    } catch (error) {
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