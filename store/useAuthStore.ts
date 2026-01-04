import { create } from 'zustand';
import { supabase } from '@/services/supabaseConfig';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
  initAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,

  initAuth: () => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            if (data) {
              set({
                user: {
                  id: data.id,
                  email: data.email,
                  name: data.name,
                  photoURL: data.photo_url,
                  createdAt: new Date(data.created_at),
                },
                loading: false,
              });
            } else {
              set({ loading: false });
            }
          });
      } else {
        set({ user: null, loading: false });
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (data) {
          set({
            user: {
              id: data.id,
              email: data.email,
              name: data.name,
              photoURL: data.photo_url,
              createdAt: new Date(data.created_at),
            },
            loading: false,
          });
        }
      } else {
        set({ user: null, loading: false });
      }
    });

    return () => subscription.unsubscribe();
  },

  signUp: async (email: string, password: string, name: string) => {
    try {
      set({ loading: true, error: null });

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('No user returned from signup');

      const { error: insertError } = await supabase.from('users').insert({
        id: authData.user.id,
        email,
        name,
        created_at: new Date().toISOString(),
        photo_url: null,
      });

      if (insertError) throw insertError;

      set({
        user: {
          id: authData.user.id,
          email: email,
          name,
          createdAt: new Date(),
        },
        loading: false,
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  logOut: async () => {
    try {
      await supabase.auth.signOut();
      set({ user: null });
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  updateUserProfile: async (data: Partial<User>) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      const updateData: any = {};
      if (data.name) updateData.name = data.name;
      if (data.photoURL !== undefined) updateData.photo_url = data.photoURL;

      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;

      set((state) => ({
        user: state.user ? { ...state.user, ...data } : null,
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },
}));
