import { create } from 'zustand';
import { initSupabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface Subscription {
  planType: 'free' | 'starter' | 'pro' | 'tiktok';
  status: 'active' | 'cancelled' | 'expired';
  trialUsed: boolean;
  expiresAt: string | null;
}

interface SubscriptionStore {
  subscription: Subscription | null;
  loading: boolean;
  checkSubscription: () => Promise<void>;
  useTrial: () => Promise<boolean>;
  upgradePlan: (planType: Subscription['planType']) => Promise<void>;
  isUnlimitedUser: (email?: string | null) => boolean;
}

export const useSubscription = create<SubscriptionStore>((set, get) => ({
  subscription: null,
  loading: true,

  isUnlimitedUser: (email) => {
    // Admin sempre tem acesso ilimitado
    return email === 'admin@commentify.com';
  },

  checkSubscription: async () => {
    try {
      const supabase = await initSupabase();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        set({ subscription: null, loading: false });
        return;
      }

      // Se for admin, define um plano PRO automático
      if (session.user.email === 'admin@commentify.com') {
        set({
          subscription: {
            planType: 'pro',
            status: 'active',
            trialUsed: false,
            expiresAt: null
          },
          loading: false
        });
        return;
      }

      // Buscar assinatura atualizada
      const { data: subscription, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching subscription:', error);
        set({ subscription: null, loading: false });
        return;
      }

      if (subscription) {
        set({
          subscription: {
            planType: subscription.plan_type,
            status: subscription.status,
            trialUsed: subscription.trial_used,
            expiresAt: subscription.expires_at
          },
          loading: false
        });
      } else {
        // Se não encontrar assinatura, define como plano free
        set({
          subscription: {
            planType: 'free',
            status: 'active',
            trialUsed: false,
            expiresAt: null
          },
          loading: false
        });
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
      set({ subscription: null, loading: false });
    }
  },

  useTrial: async () => {
    try {
      const supabase = await initSupabase();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        throw new Error('Usuário não autenticado');
      }

      // Admin não precisa de trial
      if (session.user.email === 'admin@commentify.com') {
        return true;
      }

      // Get device/browser fingerprint
      const deviceId = await getDeviceId();
      const ipAddress = await getIpAddress();

      const { data, error } = await supabase
        .rpc('use_trial', {
          p_user_id: session.user.id,
          p_ip_address: ipAddress,
          p_device_id: deviceId
        });

      if (error) throw error;

      if (data) {
        await get().checkSubscription();
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error using trial:', error);
      return false;
    }
  },

  upgradePlan: async (planType) => {
    // Implement payment integration here
    toast.error('Funcionalidade de pagamento em desenvolvimento');
  }
}));

// Helper functions to get device info and IP
async function getDeviceId(): Promise<string> {
  // Simple device fingerprint based on navigator properties
  const { userAgent, language, platform } = navigator;
  const fingerprint = `${userAgent}|${language}|${platform}`;
  return btoa(fingerprint);
}

async function getIpAddress(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error getting IP:', error);
    return 'unknown';
  }
}