import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Profile, Comment } from './types';
import { initSupabase } from './lib/supabase';
import { loadProfiles as loadProfilesService } from './services/ProfileService';
import toast from 'react-hot-toast';

interface PlatformComments {
  instagram: Comment[];
  facebook: Comment[];
  tiktok: Comment[];
}

interface PlatformSelectedComments {
  instagram: string[];
  facebook: string[];
  tiktok: string[];
}

interface Store {
  profiles: Profile[];
  selectedProfiles: string[];
  comments: PlatformComments;
  selectedComments: PlatformSelectedComments;
  postUrl: string;
  intervalSeconds: number;
  addComment: (platform: keyof PlatformComments, comment: Comment) => Promise<void>;
  removeComment: (platform: keyof PlatformComments, id: string) => Promise<void>;
  toggleCommentSelection: (platform: keyof PlatformComments, id: string) => void;
  selectAllComments: (platform: keyof PlatformComments) => void;
  unselectAllComments: (platform: keyof PlatformComments) => void;
  addProfile: (platform: keyof PlatformComments, profile: Profile) => Promise<void>;
  removeProfile: (id: string) => Promise<void>;
  toggleProfileSelection: (id: string) => void;
  selectAllProfiles: () => void;
  unselectAllProfiles: () => void;
  setPostUrl: (url: string) => void;
  setIntervalSeconds: (seconds: number) => void;
  loadComments: () => Promise<void>;
  loadProfiles: (platform: keyof PlatformComments) => Promise<void>;
  reset: () => void;
}

const initialState = {
  profiles: [],
  selectedProfiles: [],
  comments: {
    instagram: [],
    facebook: [],
    tiktok: []
  },
  selectedComments: {
    instagram: [],
    facebook: [],
    tiktok: []
  },
  postUrl: '',
  intervalSeconds: 30
};

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      ...initialState,

      reset: () => set(initialState),

      loadProfiles: async (platform: keyof PlatformComments) => {
        try {
          const profiles = await loadProfilesService(platform);
          set({ profiles });
        } catch (error) {
          console.error(`Error loading ${platform} profiles:`, error);
          toast.error(`Erro ao carregar perfis do ${platform}`);
        }
      },

      loadComments: async () => {
        try {
          const supabase = await initSupabase();
          const { data: { session } } = await supabase.auth.getSession();
          
          if (!session?.user) {
            set({ comments: initialState.comments });
            return;
          }

          const { data: comments, error } = await supabase
            .from('comments')
            .select('*')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false });

          if (error) throw error;

          const platformComments: PlatformComments = {
            instagram: [],
            facebook: [],
            tiktok: []
          };

          comments?.forEach(comment => {
            if (comment.platform in platformComments) {
              platformComments[comment.platform as keyof PlatformComments].push({
                id: comment.id,
                text: comment.text
              });
            }
          });

          set({ comments: platformComments });
        } catch (error) {
          console.error('Error loading comments:', error);
          toast.error('Erro ao carregar comentários');
        }
      },

      addComment: async (platform, comment) => {
        try {
          const supabase = await initSupabase();
          const { data: { session } } = await supabase.auth.getSession();
            
          if (!session?.user) {
            throw new Error('Você precisa estar logado para adicionar comentários');
          }

          const { error } = await supabase
            .from('comments')
            .insert([{
              id: comment.id,
              text: comment.text,
              platform,
              user_id: session.user.id
            }]);

          if (error) throw error;

          set((state) => ({
            comments: {
              ...state.comments,
              [platform]: [...state.comments[platform], comment]
            }
          }));
        } catch (error) {
          console.error('Error adding comment:', error);
          throw error;
        }
      },

      removeComment: async (platform, id) => {
        try {
          const supabase = await initSupabase();
          const { data: { session } } = await supabase.auth.getSession();
            
          if (!session?.user) {
            throw new Error('Você precisa estar logado para remover comentários');
          }

          const { error } = await supabase
            .from('comments')
            .delete()
            .eq('id', id)
            .eq('user_id', session.user.id);

          if (error) throw error;

          set((state) => ({
            comments: {
              ...state.comments,
              [platform]: state.comments[platform].filter((comment) => comment.id !== id)
            },
            selectedComments: {
              ...state.selectedComments,
              [platform]: state.selectedComments[platform].filter((commentId) => commentId !== id)
            }
          }));
        } catch (error) {
          console.error('Error removing comment:', error);
          throw error;
        }
      },

      toggleCommentSelection: (platform, id) => {
        set((state) => ({
          selectedComments: {
            ...state.selectedComments,
            [platform]: state.selectedComments[platform].includes(id)
              ? state.selectedComments[platform].filter((commentId) => commentId !== id)
              : [...state.selectedComments[platform], id]
          }
        }));
      },

      selectAllComments: (platform) => {
        set((state) => ({
          selectedComments: {
            ...state.selectedComments,
            [platform]: state.comments[platform].map((comment) => comment.id)
          }
        }));
      },

      unselectAllComments: (platform) => {
        set((state) => ({
          selectedComments: {
            ...state.selectedComments,
            [platform]: []
          }
        }));
      },

      addProfile: async (platform, profile) => {
        try {
          const supabase = await initSupabase();
          const { data: { session } } = await supabase.auth.getSession();
          
          if (!session?.user) {
            throw new Error('Você precisa estar logado para adicionar perfis');
          }

          const { error } = await supabase
            .from('profiles_automation')
            .insert([{
              id: profile.id,
              user_id: session.user.id,
              platform,
              name: profile.name,
              cookie: profile.cookie,
              proxy: profile.proxy
            }]);

          if (error) throw error;

          set((state) => ({ 
            profiles: [...state.profiles, profile] 
          }));
        } catch (error) {
          console.error('Error adding profile:', error);
          throw error;
        }
      },

      removeProfile: async (id) => {
        try {
          const supabase = await initSupabase();
          const { data: { session } } = await supabase.auth.getSession();
          
          if (!session?.user) {
            throw new Error('Você precisa estar logado para remover perfis');
          }

          const { error } = await supabase
            .from('profiles_automation')
            .delete()
            .eq('id', id)
            .eq('user_id', session.user.id);

          if (error) throw error;

          set((state) => ({
            profiles: state.profiles.filter((profile) => profile.id !== id),
            selectedProfiles: state.selectedProfiles.filter((profileId) => profileId !== id)
          }));
        } catch (error) {
          console.error('Error removing profile:', error);
          throw error;
        }
      },

      toggleProfileSelection: (id) => {
        set((state) => ({
          selectedProfiles: state.selectedProfiles.includes(id)
            ? state.selectedProfiles.filter((profileId) => profileId !== id)
            : [...state.selectedProfiles, id]
        }));
      },

      selectAllProfiles: () => {
        set((state) => ({
          selectedProfiles: state.profiles.map((profile) => profile.id)
        }));
      },

      unselectAllProfiles: () => {
        set({ selectedProfiles: [] });
      },

      setPostUrl: (url) => {
        set({ postUrl: url });
      },
      
      setIntervalSeconds: (seconds) => {
        set({ intervalSeconds: seconds });
      }
    }),
    {
      name: 'instagram-automation-storage',
      version: 1,
      partialize: (state) => ({
        postUrl: state.postUrl,
        intervalSeconds: state.intervalSeconds
      })
    }
  )
);