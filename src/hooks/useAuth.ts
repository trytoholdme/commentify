import { create } from 'zustand';
import toast from 'react-hot-toast';
import { initSupabase } from '../lib/supabase';
import { useStore } from '../store';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthStore {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuth = create<AuthStore>((set) => ({
  isAuthenticated: false,
  user: null,
  loading: true,

  checkAuth: async () => {
    try {
      const supabase = await initSupabase();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('name')
          .eq('user_id', session.user.id)
          .single();

        set({
          isAuthenticated: true,
          user: {
            id: session.user.id,
            email: session.user.email!,
            name: profile?.name || 'Usuário'
          }
        });

        // Load data after confirming authentication
        const store = useStore.getState();
        await store.loadComments();
        await store.loadProfiles('instagram');
      } else {
        set({ isAuthenticated: false, user: null });
        useStore.getState().reset();
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      set({ isAuthenticated: false, user: null });
      useStore.getState().reset();
    } finally {
      set({ loading: false });
    }
  },

  login: async (email: string, password: string) => {
    try {
      const supabase = await initSupabase();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('name')
          .eq('user_id', data.user.id)
          .single();

        set({
          isAuthenticated: true,
          user: {
            id: data.user.id,
            email: data.user.email!,
            name: profile?.name || 'Usuário'
          }
        });

        // Load comments immediately after successful login
        await useStore.getState().loadComments();
        toast.success('Login realizado com sucesso!');
      }
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer login');
      throw error;
    }
  },

  logout: async () => {
    try {
      const supabase = await initSupabase();
      
      // Reset store state before logout
      useStore.getState().reset();
      
      // Reset auth state
      set({ isAuthenticated: false, user: null });
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success('Logout realizado com sucesso!');
    } catch (error: any) {
      // Even if there's an error, we want to clear the local state
      set({ isAuthenticated: false, user: null });
      useStore.getState().reset();
      
      // Only show error if it's not a session_not_found error
      if (error.message !== 'session_not_found') {
        console.error('Logout error:', error);
        toast.error('Erro ao fazer logout, mas sua sessão foi encerrada');
      }
    }
  },

  signup: async (email: string, password: string, name: string) => {
    try {
      const supabase = await initSupabase();
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });

      if (error) throw error;

      if (data.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              user_id: data.user.id,
              name
            }
          ]);

        if (profileError) throw profileError;

        set({
          isAuthenticated: true,
          user: {
            id: data.user.id,
            email: data.user.email!,
            name
          }
        });

        // Load comments immediately after successful signup
        await useStore.getState().loadComments();
        toast.success('Conta criada com sucesso!');
      }
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar conta');
      throw error;
    }
  }
}));