import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, CheckSquare, Square } from 'lucide-react';
import toast from 'react-hot-toast';
import { Comment } from '../../types';
import { useAuth } from '../../hooks/useAuth';

interface CommentsListProps {
  comments: Comment[];
  selectedComments: string[];
  onAddComment: (comment: Comment) => Promise<void>;
  onRemoveComment: (id: string) => Promise<void>;
  onToggleSelection: (id: string) => void;
  onSelectAll: () => void;
  onUnselectAll: () => void;
  isAutomating: boolean;
}

export function CommentsList({
  comments = [],
  selectedComments = [],
  onAddComment,
  onRemoveComment,
  onToggleSelection,
  onSelectAll,
  onUnselectAll,
  isAutomating
}: CommentsListProps) {
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Você precisa estar logado para adicionar comentários');
      return;
    }

    if (!newComment.trim()) {
      toast.error('Digite um comentário!');
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddComment({
        id: crypto.randomUUID(),
        text: newComment.trim()
      });
      
      setNewComment('');
      toast.success('Comentário adicionado!');
    } catch (error) {
      toast.error('Erro ao adicionar comentário. Tente novamente.');
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEdit = (comment: Comment) => {
    setEditingId(comment.id);
    setEditingText(comment.text);
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    if (!editingText.trim()) {
      toast.error('O comentário não pode estar vazio!');
      return;
    }

    try {
      await onRemoveComment(editingId);
      await onAddComment({
        id: crypto.randomUUID(),
        text: editingText.trim()
      });
      setEditingId(null);
      toast.success('Comentário atualizado!');
    } catch (error) {
      toast.error('Erro ao atualizar comentário');
      console.error('Error updating comment:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  const handleRemoveComment = async (id: string) => {
    try {
      await onRemoveComment(id);
      toast.success('Comentário removido!');
    } catch (error) {
      toast.error('Erro ao remover comentário');
      console.error('Error removing comment:', error);
    }
  };

  const areAllSelected = comments.length > 0 && selectedComments.length === comments.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Comentários</h3>
        <button
          onClick={() => areAllSelected ? onUnselectAll() : onSelectAll()}
          className="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-2"
          disabled={isAutomating || comments.length === 0}
        >
          {areAllSelected ? (
            <CheckSquare className="w-4 h-4" />
          ) : (
            <Square className="w-4 h-4" />
          )}
          {areAllSelected ? 'Desmarcar Todos' : 'Selecionar Todos'}
        </button>
      </div>

      <form onSubmit={handleAddComment} className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Digite seu comentário..."
          disabled={isAutomating || isSubmitting}
          className="flex-1"
        />
        <button
          type="submit"
          disabled={isAutomating || isSubmitting}
          className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          <Plus className="w-5 h-5" />
        </button>
      </form>

      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {comments.map((comment) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex items-center gap-2 p-3 bg-gray-800 rounded-lg"
          >
            <button
              onClick={() => onToggleSelection(comment.id)}
              disabled={isAutomating}
              className="text-indigo-400 hover:text-indigo-300 disabled:opacity-50"
            >
              {selectedComments.includes(comment.id) ? (
                <CheckSquare className="w-4 h-4" />
              ) : (
                <Square className="w-4 h-4" />
              )}
            </button>
            
            {editingId === comment.id ? (
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className="flex-1"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveEdit();
                    if (e.key === 'Escape') handleCancelEdit();
                  }}
                />
                <button
                  onClick={handleSaveEdit}
                  className="text-green-400 hover:text-green-300 transition-colors"
                >
                  Salvar
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="text-gray-400 hover:text-gray-300 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <>
                <span className="flex-1 text-gray-300">{comment.text}</span>
                {!isAutomating && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStartEdit(comment)}
                      className="text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRemoveComment(comment.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}