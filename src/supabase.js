import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bkqjnjtpeeyrmtiplkxx.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrcWpuanRwZWV5cm10aXBsa3h4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwMjc4NzksImV4cCI6MjA2OTYwMzg3OX0.Ew8Ya1_VFlxgsIlVLXimDS8NcvD4568DPHhPEjk-gzg'

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