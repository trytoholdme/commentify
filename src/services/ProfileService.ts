import { Profile } from '../types';
import { initSupabase } from '../lib/supabase';

export async function loadProfiles(platform: 'instagram' | 'facebook' | 'tiktok'): Promise<Profile[]> {
  try {
    const supabase = await initSupabase();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return [];
    }

    const { data: profiles, error } = await supabase
      .from('profiles_automation')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('platform', platform)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading profiles:', error);
      throw error;
    }

    return profiles.map(profile => ({
      id: profile.id,
      name: profile.name,
      cookie: profile.cookie,
      proxy: profile.proxy
    }));
  } catch (error) {
    console.error(`Error loading ${platform} profiles:`, error);
    throw error;
  }
}

export async function addProfile(platform: 'instagram' | 'facebook' | 'tiktok', profile: Profile): Promise<void> {
  try {
    const supabase = await initSupabase();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      throw new Error('Usuário não autenticado');
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
  } catch (error) {
    console.error('Error adding profile:', error);
    throw error;
  }
}

export async function removeProfile(id: string): Promise<void> {
  try {
    const supabase = await initSupabase();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      throw new Error('Usuário não autenticado');
    }

    const { error } = await supabase
      .from('profiles_automation')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id);

    if (error) throw error;
  } catch (error) {
    console.error('Error removing profile:', error);
    throw error;
  }
}