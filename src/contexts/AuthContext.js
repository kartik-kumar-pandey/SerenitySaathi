import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from localStorage on app start
  useEffect(() => {
    const loadUser = () => {
      try {
        const savedUser = localStorage.getItem('mitra_user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        localStorage.removeItem('mitra_user');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Save user data to localStorage
  const saveUserToStorage = (userData) => {
    try {
              localStorage.setItem('mitra_user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  // Clear user data from localStorage
  const clearUserFromStorage = () => {
    try {
              localStorage.removeItem('mitra_user');
      // Also clear any user-specific data
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('mitra_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  };

  // Sign up function
  const signup = async (name, email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call - in a real app, this would be a backend API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if user already exists (simulate)
      const existingUsers = JSON.parse(localStorage.getItem('mitra_users') || '[]');
      const existingUser = existingUsers.find(u => u.email === email);
      
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password: btoa(password), // Simple encoding - in real app, use proper hashing
        createdAt: new Date().toISOString(),
        preferences: {
          theme: 'light',
          language: 'en',
          notifications: true
        }
      };

      // Save to users list
      existingUsers.push(newUser);
              localStorage.setItem('mitra_users', JSON.stringify(existingUsers));

      // Set current user
      const userData = { ...newUser };
      delete userData.password; // Don't store password in user state
      setUser(userData);
      saveUserToStorage(userData);

      return userData;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check user credentials
      const users = JSON.parse(localStorage.getItem('mitra_users') || '[]');
      const user = users.find(u => u.email === email && btoa(password) === u.password);

      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Set current user
      const userData = { ...user };
      delete userData.password; // Don't store password in user state
      setUser(userData);
      saveUserToStorage(userData);

      return userData;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    clearUserFromStorage();
    setError(null);
  };

  // Update user preferences
  const updateUserPreferences = (preferences) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      preferences: {
        ...user.preferences,
        ...preferences
      }
    };

    setUser(updatedUser);
    saveUserToStorage(updatedUser);

    // Update in users list
    const users = JSON.parse(localStorage.getItem('mitra_users') || '[]');
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], preferences: updatedUser.preferences };
      localStorage.setItem('mitra_users', JSON.stringify(users));
    }
  };

  // Update user profile
  const updateProfile = (updates) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      ...updates
    };

    setUser(updatedUser);
    saveUserToStorage(updatedUser);

    // Update in users list
    const users = JSON.parse(localStorage.getItem('mitra_users') || '[]');
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      localStorage.setItem('mitra_users', JSON.stringify(users));
    }
  };

  // Get user-specific data key
  const getUserDataKey = (key) => {
    return user ? `mitra_${user.id}_${key}` : null;
  };

  // Save user-specific data
  const saveUserData = (key, data) => {
    const dataKey = getUserDataKey(key);
    if (dataKey) {
      try {
        localStorage.setItem(dataKey, JSON.stringify(data));
      } catch (error) {
        console.error('Error saving user data:', error);
      }
    }
  };

  // Load user-specific data
  const loadUserData = (key, defaultValue = null) => {
    const dataKey = getUserDataKey(key);
    if (dataKey) {
      try {
        const saved = localStorage.getItem(dataKey);
        return saved ? JSON.parse(saved) : defaultValue;
      } catch (error) {
        console.error('Error loading user data:', error);
        return defaultValue;
      }
    }
    return defaultValue;
  };

  const value = {
    user,
    isLoading,
    error,
    signup,
    login,
    logout,
    updateUserPreferences,
    updateProfile,
    saveUserData,
    loadUserData,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 