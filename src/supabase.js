import { createClient } from '@supabase/supabase-js'

// Replace these with your actual Supabase credentials
const supabaseUrl = 'https://bkqjnjtpeeyrmtiplkxx.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrcWpuanRwZWV5cm10aXBsa3h4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwMjc4NzksImV4cCI6MjA2OTYwMzg3OX0.Ew8Ya1_VFlxgsIlVLXimDS8NcvD4568DPHhPEjk-gzg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database service functions
export const dbService = {
  // User data management
  async saveUserData(userId, data) {
    console.log(`Saving data for user ${userId}:`, {
      conversationsCount: data.conversations?.length || 0,
      moodHistoryCount: data.moodHistory?.length || 0,
      currentConversationId: data.currentConversationId
    });
    
    try {
      const { error } = await supabase
        .from('user_data')
        .upsert({
          user_id: userId,
          conversations: data.conversations || [],
          mood_history: data.moodHistory || [],
          preferences: data.userPreferences || { language: 'en', notifications: true, autoSave: true },
          dark_mode: data.isDarkMode || false,
          current_conversation_id: data.currentConversationId || null,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })
      
      if (error) {
        console.error('Error saving user data:', error)
        throw error
      }
      
      console.log(`Successfully saved data for user ${userId}`)
    } catch (error) {
      console.error('Error in saveUserData:', error)
      throw error
    }
  },

  async loadUserData(userId) {
    console.log(`Loading data for user ${userId}...`);
    
    try {
      const { data, error } = await supabase
        .from('user_data')
        .select('*')
        .eq('user_id', userId)
        .single()
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error loading user data:', error)
        throw error
      }
      
      const result = data || {
        conversations: [],
        mood_history: [],
        preferences: { language: 'en', notifications: true, autoSave: true },
        dark_mode: false,
        current_conversation_id: null
      };
      
      console.log(`Loaded data for user ${userId}:`, {
        conversationsCount: result.conversations?.length || 0,
        moodHistoryCount: result.mood_history?.length || 0,
        currentConversationId: result.current_conversation_id
      });
      
      return result;
    } catch (error) {
      console.error('Error in loadUserData:', error)
      // Return default data if there's an error
      return {
        conversations: [],
        mood_history: [],
        preferences: { language: 'en', notifications: true, autoSave: true },
        dark_mode: false,
        current_conversation_id: null
      };
    }
  },

  async deleteUserData(userId) {
    console.log(`Deleting data for user ${userId}...`);
    
    const { error } = await supabase
      .from('user_data')
      .delete()
      .eq('user_id', userId)
    
    if (error) {
      console.error('Error deleting user data:', error)
      throw error
    }
    
    console.log(`Successfully deleted data for user ${userId}`);
  },

  // Clear all data for a user (useful for logout)
  async clearUserData(userId) {
    console.log(`Clearing data for user ${userId}...`);
    
    const { error } = await supabase
      .from('user_data')
      .delete()
      .eq('user_id', userId)
    
    if (error) {
      console.error('Error clearing user data:', error)
      throw error
    }
    
    console.log(`Successfully cleared data for user ${userId}`);
  },

  // Verify user data isolation (for debugging)
  async verifyUserDataIsolation(userId) {
    console.log(`Verifying data isolation for user ${userId}...`);
    
    try {
      // Try to load data for this user
      const userData = await this.loadUserData(userId);
      console.log(`User ${userId} data:`, {
        conversationsCount: userData.conversations?.length || 0,
        moodHistoryCount: userData.mood_history?.length || 0,
        hasData: !!userData
      });
      
      // Try to access all data (should be empty due to RLS)
      const { data: allData, error } = await supabase
        .from('user_data')
        .select('*')
      
      if (error) {
        console.error('Error accessing all data:', error);
        return false;
      }
      
      console.log(`Total records in database: ${allData?.length || 0}`);
      console.log(`Records accessible to user ${userId}: ${allData?.filter(d => d.user_id === userId).length || 0}`);
      
      return true;
    } catch (error) {
      console.error(`Error verifying data isolation for user ${userId}:`, error);
      return false;
    }
  }
} 