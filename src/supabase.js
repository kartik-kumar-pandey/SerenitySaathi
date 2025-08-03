import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const dbService = {
  async saveUserData(userId, data) {
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
        throw error
      }
    } catch (error) {
      throw error
    }
  },

  async loadUserData(userId) {
    try {
      const { data, error } = await supabase
        .from('user_data')
        .select('*')
        .eq('user_id', userId)
        .single()
      
      if (error && error.code !== 'PGRST116') {
        throw error
      }
      
      const result = data || {
        conversations: [],
        mood_history: [],
        preferences: { language: 'en', notifications: true, autoSave: true },
        dark_mode: false,
        current_conversation_id: null
      };
      
      return result;
    } catch (error) {
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
    const { error } = await supabase
      .from('user_data')
      .delete()
      .eq('user_id', userId)
    
    if (error) {
      throw error
    }
  },

  async clearUserData(userId) {
    const { error } = await supabase
      .from('user_data')
      .delete()
      .eq('user_id', userId)
    
    if (error) {
      throw error
    }
  },

  async verifyUserDataIsolation(userId) {
    try {
      await this.loadUserData(userId);
      
      const { error } = await supabase
        .from('user_data')
        .select('*')
      
      if (error) {
        return false;
      }
      
      return true;
    } catch (error) {
      return false;
    }
  }
} 