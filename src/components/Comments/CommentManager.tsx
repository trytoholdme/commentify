import { MessageSquare, Plus, Trash2, CheckSquare, Square } from 'lucide-react';
import { Comment } from '../../types';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { useSubscription } from '../../hooks/useSubscription';
import { useState } from 'react';

interface CommentManagerProps {
  comments: Comment[];
  selectedComments: string[];
  onAddComment: (comment: Comment) => Promise<void>;
  onRemoveComment: (id: string) => Promise<void>;
  onToggleSelection: (id: string) => void;
  onSelectAll: () => void;
  onUnselectAll: () => void;
}

export function CommentManager({
  comments,
  selectedComments,
  onAddComment,
  onRemoveComment,
  onToggleSelection,
  onSelectAll,
  onUnselectAll,
}: CommentManagerProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const { subscription } = useSubscription();

  const isAdmin = user?.email === 'admin@commentify.com';
  const hasPaidPlan = subscription && subscription.status === 'active' && subscription.planType !== 'free';
  const canAddMoreComments = isAdmin || hasPaidPlan || comments.length === 0;

  const handleAddComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Você precisa estar logado para adicionar comentários');
      return;
    }

    if (!canAddMoreComments) {
      toast.error('Faça upgrade do seu plano para adicionar mais comentários');
      return;
    }

    const formData = new FormData(e.currentTarget);
    const text = formData.get('comment') as string;

    if (!text) {
      toast.error('O comentário não pode estar vazio!');
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddComment({
        id: crypto.randomUUID(),
        text: text.trim()
      });
      
      e.currentTarget.reset();
      toast.success('Comentário adicionado com sucesso!');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Erro ao adicionar comentário');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveComment = async (id: string) => {
    if (!isAuthenticated) {
      toast.error('Você precisa estar logado para remover comentários');
      return;
    }

    try {
      await onRemoveComment(id);
      toast.success('Comentário removido com sucesso!');
    } catch (error) {
      console.error('Error removing comment:', error);
      toast.error('Erro ao remover comentário');
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-indigo-400">
          <MessageSquare className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Comentários</h2>
        </div>
        <button
          onClick={() => comments.length === selectedComments.length ? onUnselectAll() : onSelectAll()}
          className="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-2"
        >
          {comments.length === selectedComments.length ? (
            <CheckSquare className="w-4 h-4" />
          ) : (
            <Square className="w-4 h-4" />
          )}
          {comments.length === selectedComments.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
        </button>
      </div>

      {!hasPaidPlan && !isAdmin && comments.length > 0 && (
        <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="text-sm text-yellow-500">
            Usuários gratuitos podem adicionar apenas 1 comentário. Faça upgrade do seu plano para adicionar mais comentários.
          </p>
        </div>
      )}

      <form onSubmit={handleAddComment} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Novo Comentário
          </label>
          <textarea
            name="comment"
            rows={3}
            className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Digite seu comentário..."
            disabled={isSubmitting || !canAddMoreComments}
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting || !canAddMoreComments}
          className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:opacity-50"
        >
          <Plus className="w-4 h-4 mr-2" />
          {isSubmitting ? 'Adicionando...' : 'Adicionar Comentário'}
        </button>
      </form>

      <div className="mt-6 space-y-2">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => onToggleSelection(comment.id)}
                className="text-indigo-400 hover:text-indigo-300"
              >
                {selectedComments.includes(comment.id) ? (
                  <CheckSquare className="w-4 h-4" />
                ) : (
                  <Square className="w-4 h-4" />
                )}
              </button>
              <p className="text-white">{comment.text}</p>
            </div>
            <button
              onClick={() => handleRemoveComment(comment.id)}
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}