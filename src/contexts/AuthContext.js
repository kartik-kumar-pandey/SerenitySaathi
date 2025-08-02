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

  useEffect(() => {
    const loadUser = () => {
      try {
        const savedUser = localStorage.getItem('mitra_user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
        }
      } catch (error) {
        localStorage.removeItem('mitra_user');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const saveUserToStorage = (userData) => {
    try {
              localStorage.setItem('mitra_user', JSON.stringify(userData));
    } catch (error) {
    }
  };

  const clearUserFromStorage = () => {
    try {
              localStorage.removeItem('mitra_user');
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('mitra_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
    }
  };

  const signup = async (name, email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const existingUsers = JSON.parse(localStorage.getItem('mitra_users') || '[]');
      const existingUser = existingUsers.find(u => u.email === email);
      
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password: btoa(password),
        createdAt: new Date().toISOString(),
        preferences: {
          theme: 'light',
          language: 'en',
          notifications: true
        }
      };

      existingUsers.push(newUser);
              localStorage.setItem('mitra_users', JSON.stringify(existingUsers));

      const userData = { ...newUser };
      delete userData.password;
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

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const users = JSON.parse(localStorage.getItem('mitra_users') || '[]');
      const user = users.find(u => u.email === email && btoa(password) === u.password);

      if (!user) {
        throw new Error('Invalid email or password');
      }

      const userData = { ...user };
      delete userData.password;
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
        // Silent error handling
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