import { Users, Plus, Trash2, CheckSquare, Square } from 'lucide-react';
import { Profile } from '../../types';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { useSubscription } from '../../hooks/useSubscription';

interface ProfileManagerProps {
  profiles: Profile[];
  selectedProfiles: string[];
  onAddProfile: (profile: Profile) => void;
  onRemoveProfile: (id: string) => void;
  onToggleSelection: (id: string) => void;
  onSelectAll: () => void;
  onUnselectAll: () => void;
}

export function ProfileManager({
  profiles,
  selectedProfiles,
  onAddProfile,
  onRemoveProfile,
  onToggleSelection,
  onSelectAll,
  onUnselectAll,
}: ProfileManagerProps) {
  const [cookieInput, setCookieInput] = useState('');
  const [proxyInput, setProxyInput] = useState('');
  const [name, setName] = useState('');
  const { isAuthenticated, user } = useAuth();
  const { subscription } = useSubscription();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAdmin = user?.email === 'admin@commentify.com';
  const hasPaidPlan = subscription && subscription.status === 'active' && subscription.planType !== 'free';
  const canAddMoreProfiles = isAdmin || hasPaidPlan || profiles.length === 0;

  const handleAddProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Você precisa estar logado para adicionar perfis');
      return;
    }

    if (!canAddMoreProfiles) {
      toast.error('Faça upgrade do seu plano para adicionar mais perfis');
      return;
    }

    if (!name.trim()) {
      toast.error('Nome do perfil é obrigatório');
      return;
    }

    if (!cookieInput.trim()) {
      toast.error('Cookie é obrigatório');
      return;
    }

    try {
      setIsSubmitting(true);
      let cookieData;
      
      try {
        cookieData = JSON.parse(cookieInput);
      } catch (error) {
        toast.error('Cookie inválido! Certifique-se que está no formato JSON correto');
        return;
      }
      
      if (!Array.isArray(cookieData)) {
        toast.error('O cookie deve ser um array de objetos');
        return;
      }

      const sessionCookie = cookieData.find(c => c.name === 'sessionid');
      const csrfCookie = cookieData.find(c => c.name === 'csrftoken');

      if (!sessionCookie || !csrfCookie) {
        toast.error('Cookie inválido! Certifique-se de incluir sessionid e csrftoken');
        return;
      }

      const newProfile: Profile = {
        id: crypto.randomUUID(),
        name: name.trim(),
        cookie: cookieInput,
        proxy: proxyInput.trim() || undefined
      };

      await onAddProfile(newProfile);
      setName('');
      setCookieInput('');
      setProxyInput('');
      toast.success('Perfil adicionado com sucesso!');
    } catch (error: any) {
      console.error('Error adding profile:', error);
      toast.error(error.message || 'Erro ao adicionar perfil');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveProfile = async (id: string) => {
    try {
      await onRemoveProfile(id);
      toast.success('Perfil removido com sucesso!');
    } catch (error) {
      console.error('Error removing profile:', error);
      toast.error('Erro ao remover perfil');
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-indigo-400">
          <Users className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Perfis</h2>
        </div>
        {profiles.length > 0 && (
          <button
            onClick={() => profiles.length === selectedProfiles.length ? onUnselectAll() : onSelectAll()}
            className="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-2"
          >
            {profiles.length === selectedProfiles.length ? (
              <CheckSquare className="w-4 h-4" />
            ) : (
              <Square className="w-4 h-4" />
            )}
            {profiles.length === selectedProfiles.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
          </button>
        )}
      </div>

      {!hasPaidPlan && !isAdmin && profiles.length > 0 && (
        <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="text-sm text-yellow-500">
            Usuários gratuitos podem adicionar apenas 1 perfil. Faça upgrade do seu plano para adicionar mais perfis.
          </p>
        </div>
      )}

      <form onSubmit={handleAddProfile} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Nome do Perfil
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white focus:ring-indigo-500 focus:border-indigo-500"
            disabled={isSubmitting || !canAddMoreProfiles}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Cookie (formato JSON)
          </label>
          <textarea
            value={cookieInput}
            onChange={(e) => setCookieInput(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white focus:ring-indigo-500 focus:border-indigo-500"
            placeholder='[{"domain": ".instagram.com","name": "sessionid","value": "..."}]'
            disabled={isSubmitting || !canAddMoreProfiles}
          />
          <p className="mt-1 text-sm text-gray-400">
            Cole o cookie no formato JSON exportado da extensão do navegador
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Proxy (opcional)
          </label>
          <input
            type="text"
            value={proxyInput}
            onChange={(e) => setProxyInput(e.target.value)}
            className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="http://usuario:senha@host:porta"
            disabled={isSubmitting || !canAddMoreProfiles}
          />
          <p className="mt-1 text-sm text-gray-400">
            Formato: http://usuario:senha@host:porta ou http://host:porta
          </p>
        </div>
        <button
          type="submit"
          disabled={isSubmitting || !canAddMoreProfiles}
          className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4 mr-2" />
          {isSubmitting ? 'Adicionando...' : 'Adicionar Perfil'}
        </button>
      </form>

      <div className="mt-6 space-y-2">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => onToggleSelection(profile.id)}
                className="text-indigo-400 hover:text-indigo-300"
              >
                {selectedProfiles.includes(profile.id) ? (
                  <CheckSquare className="w-4 h-4" />
                ) : (
                  <Square className="w-4 h-4" />
                )}
              </button>
              <div>
                <p className="font-medium text-white">{profile.name}</p>
                {profile.proxy && (
                  <p className="text-sm text-gray-400">Proxy: {profile.proxy}</p>
                )}
              </div>
            </div>
            <button
              onClick={() => handleRemoveProfile(profile.id)}
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {profiles.length === 0 && (
          <div className="text-center py-4 text-gray-400">
            Nenhum perfil adicionado. Adicione um perfil para começar.
          </div>
        )}
      </div>
    </div>
  );
}