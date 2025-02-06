import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Send } from 'lucide-react';
import { CommentsList } from './CommentsList';
import { MetricsPanel } from './MetricsPanel';
import { AutomationPanel } from './AutomationPanel';
import { ProfileManager } from '../Profiles/ProfileManager';
import toast from 'react-hot-toast';
import { useStore } from '../../store';
import { comentarInstagram } from '../../api';
import { useAuth } from '../../hooks/useAuth';
import { useSubscription } from '../../hooks/useSubscription';
import { Profile, Comment } from '../../types';

export function InstagramDashboard() {
  const {
    comments,
    selectedComments,
    postUrl,
    setPostUrl,
    addComment,
    removeComment,
    toggleCommentSelection,
    selectAllComments,
    unselectAllComments,
    profiles,
    loadProfiles,
    addProfile,
    removeProfile,
    selectedProfiles,
    toggleProfileSelection,
    selectAllProfiles,
    unselectAllProfiles
  } = useStore();

  const { isAuthenticated, user } = useAuth();
  const { subscription, isUnlimitedUser } = useSubscription();
  const [isAutomating, setIsAutomating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStats, setCurrentStats] = useState({
    total: 0,
    success: 0,
    failed: 0
  });

  // Load profiles when component mounts or auth state changes
  useEffect(() => {
    if (isAuthenticated) {
      loadProfiles('instagram').catch(error => {
        console.error('Error loading profiles:', error);
        toast.error('Erro ao carregar perfis');
      });
    }
  }, [isAuthenticated, loadProfiles]);

  const validatePostUrl = (url: string): boolean => {
    const urlPattern = /^https:\/\/(www\.)?instagram\.com\/p\/[\w-]+\/?$/;
    return urlPattern.test(url);
  };

  const handleAddProfile = async (profile: Profile) => {
    if (!isAuthenticated) {
      toast.error('Você precisa estar logado para adicionar perfis');
      return;
    }
    try {
      await addProfile('instagram', profile);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao adicionar perfil');
    }
  };

  const handleAddComment = async (comment: Comment) => {
    if (!isAuthenticated) {
      toast.error('Você precisa estar logado para adicionar comentários');
      return;
    }
    try {
      await addComment('instagram', comment);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao adicionar comentário');
    }
  };

  const handleRemoveComment = async (id: string) => {
    if (!isAuthenticated) {
      toast.error('Você precisa estar logado para remover comentários');
      return;
    }
    try {
      await removeComment('instagram', id);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao remover comentário');
    }
  };

  const handleStartAutomation = async () => {
    if (!isAuthenticated) {
      toast.error('Você precisa estar logado para iniciar a automação');
      return;
    }

    // Permite automação se for usuário ilimitado ou tiver plano pago
    if (!isUnlimitedUser(user?.email) && (!subscription || subscription.planType === 'free')) {
      toast.error('Faça upgrade do seu plano para usar a automação');
      return;
    }

    // Validate post URL
    if (!postUrl.trim()) {
      toast.error('Digite a URL da publicação');
      return;
    }

    if (!validatePostUrl(postUrl)) {
      toast.error('URL do Instagram inválida! Use uma URL de post (ex: https://www.instagram.com/p/xyz123)');
      return;
    }

    if (selectedComments.instagram.length === 0) {
      toast.error('Selecione pelo menos um comentário!');
      return;
    }

    if (selectedProfiles.length === 0) {
      toast.error('Selecione pelo menos um perfil!');
      return;
    }

    // Verificar se há comentários suficientes para todos os perfis
    if (selectedComments.instagram.length < selectedProfiles.length) {
      toast.error('Você precisa ter pelo menos um comentário para cada perfil selecionado');
      return;
    }

    setIsAutomating(true);
    setProgress(0);
    setCurrentStats({ total: 0, success: 0, failed: 0 });

    try {
      const selectedCommentsList = comments.instagram.filter(c => selectedComments.instagram.includes(c.id));
      const selectedProfilesList = profiles.filter(p => selectedProfiles.includes(p.id));
      
      // Distribuir comentários aleatoriamente entre os perfis
      const shuffledComments = [...selectedCommentsList].sort(() => Math.random() - 0.5);
      const commentDistribution = selectedProfilesList.map((profile, index) => ({
        profile,
        comment: shuffledComments[index % shuffledComments.length]
      }));

      let completed = 0;
      let successCount = 0;
      let failedCount = 0;
      const total = selectedProfilesList.length; // Agora é 1 comentário por perfil

      for (const { profile, comment } of commentDistribution) {
        try {
          await comentarInstagram({
            profile,
            postUrl,
            comment: comment.text
          });
          
          successCount++;
          setCurrentStats(prev => ({
            ...prev,
            total: prev.total + 1,
            success: successCount
          }));

          toast.success(`Comentário enviado com sucesso na conta ${profile.name}`);
        } catch (error: any) {
          failedCount++;
          setCurrentStats(prev => ({
            ...prev,
            total: prev.total + 1,
            failed: failedCount
          }));
          
          console.error(`❌ Erro na conta ${profile.name}:`, error.message || 'Erro desconhecido');
          toast.error(`Erro na conta ${profile.name}: ${error.message || 'Erro ao enviar comentário'}`);

          if (error.message?.includes('cookie') || error.message?.includes('Acesso negado')) {
            console.log(`⚠️ Pulando perfil ${profile.name} devido a erro de autenticação`);
            continue;
          }
        }

        completed++;
        setProgress((completed / total) * 100);

        // Add delay between comments to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      // Show final status only after all operations are complete
      if (successCount > 0) {
        toast.success(`Automação concluída! ${successCount} ${successCount === 1 ? 'comentário enviado' : 'comentários enviados'} com sucesso.`);
      }

      if (failedCount > 0) {
        toast.error(`${failedCount} ${failedCount === 1 ? 'comentário falhou' : 'comentários falharam'}. Verifique os erros acima.`);
      }

    } catch (error: any) {
      toast.error(error.message || 'Erro ao executar automação');
      console.error('Erro na automação:', error);
    } finally {
      setIsAutomating(false);
      setProgress(0);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Instagram className="w-8 h-8 text-pink-500" />
        <h2 className="text-2xl font-bold text-white">Instagram</h2>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          {/* URL Input */}
          <div className="gradient-border p-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              URL da Publicação
            </label>
            <input
              type="url"
              value={postUrl}
              onChange={(e) => setPostUrl(e.target.value)}
              placeholder="https://instagram.com/p/..."
              className={`w-full ${!validatePostUrl(postUrl) && postUrl ? 'border-red-500' : ''}`}
              disabled={isAutomating}
            />
            {postUrl && !validatePostUrl(postUrl) && (
              <p className="mt-1 text-sm text-red-500">
                URL inválida. Use o formato: https://www.instagram.com/p/xyz123
              </p>
            )}
          </div>

          {/* Profiles Section */}
          <div className="gradient-border p-6">
            <ProfileManager
              profiles={profiles}
              selectedProfiles={selectedProfiles}
              onAddProfile={handleAddProfile}
              onRemoveProfile={removeProfile}
              onToggleSelection={toggleProfileSelection}
              onSelectAll={selectAllProfiles}
              onUnselectAll={unselectAllProfiles}
            />
          </div>

          {/* Comments Section */}
          <div className="gradient-border p-6">
            <CommentsList
              comments={comments.instagram}
              selectedComments={selectedComments.instagram}
              onAddComment={handleAddComment}
              onRemoveComment={handleRemoveComment}
              onToggleSelection={(id) => toggleCommentSelection('instagram', id)}
              onSelectAll={() => selectAllComments('instagram')}
              onUnselectAll={() => unselectAllComments('instagram')}
              isAutomating={isAutomating}
            />
          </div>

          {/* Action Button */}
          <button
            onClick={handleStartAutomation}
            disabled={isAutomating || !isAuthenticated}
            className="w-full button-glow py-3 px-4 rounded-lg text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
            {isAutomating ? 'Automação em Andamento...' : 'Iniciar Automação'}
          </button>

          {/* Progress Bar */}
          {isAutomating && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Progresso</span>
                <span>{progress.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full"
                />
              </div>
              <div className="mt-2 flex justify-between text-sm">
                <span className="text-green-400">Sucesso: {currentStats.success}</span>
                <span className="text-gray-400">Total: {currentStats.total}</span>
                <span className="text-red-400">Falhas: {currentStats.failed}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="space-y-6">
          <MetricsPanel platform="instagram" stats={currentStats} />
          <AutomationPanel platform="instagram" />
        </div>
      </div>
    </div>
  );
}