import { create } from 'zustand';
import { supabase } from '../services/supabase';
import { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  profile: any | null;
  loading: boolean;
  initialize: () => Promise;
  setUser: (user: User | null) => void;
  setProfile: (profile: any) => void;
}

export const useAuthStore = create((set) => ({
  user: null,
  profile: null,
  loading: true,
  
  initialize: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      set({ user: session.user });
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      set({ profile, loading: false });
    } else {
      set({ loading: false });
    }

    supabase.auth.onAuthStateChange(async (event, session) => {
      set({ user: session?.user ?? null });
      
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        set({ profile });
      } else {
        set({ profile: null });
      }
    });
  },
  
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile })
}));