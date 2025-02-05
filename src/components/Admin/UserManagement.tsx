import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Edit2, Trash2, Plus } from 'lucide-react';
import { initSupabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  name: string;
  planType: string;
  status: string;
  createdAt: string;
}

interface NewUser {
  email: string;
  password: string;
  name: string;
  planType: string;
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newUser, setNewUser] = useState<NewUser>({
    email: '',
    password: '',
    name: '',
    planType: 'free'
  });

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    try {
      const supabase = await initSupabase();
      const { data, error } = await supabase
        .from('users_view')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setUsers(data.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name || '',
        planType: user.plan_type || 'free',
        status: user.status || 'active',
        createdAt: new Date(user.created_at).toLocaleDateString()
      })));
    } catch (error: any) {
      console.error('Error loading users:', error);
      toast.error(error.message || 'Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  }

  async function createUser() {
    setLoading(true);
    try {
      const supabase = await initSupabase();
      const { error } = await supabase.rpc('admin_create_user', {
        in_email: newUser.email,
        in_password: newUser.password,
        in_name: newUser.name,
        in_plan_type: newUser.planType
      });

      if (error) throw error;

      toast.success('Usuário criado com sucesso!');
      setIsCreating(false);
      setNewUser({
        email: '',
        password: '',
        name: '',
        planType: 'free'
      });
      await loadUsers();
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast.error(error.message || 'Erro ao criar usuário');
    } finally {
      setLoading(false);
    }
  }

  async function updateUser(userId: string) {
    if (!editingUser) return;
    setLoading(true);

    try {
      const supabase = await initSupabase();
      const { error } = await supabase.rpc('admin_update_user', {
        in_user_id: userId,
        in_name: editingUser.name,
        in_plan_type: editingUser.planType,
        in_status: editingUser.status
      });

      if (error) throw error;

      toast.success('Usuário atualizado com sucesso!');
      setEditingUser(null);
      await loadUsers();
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast.error(error.message || 'Erro ao atualizar usuário');
    } finally {
      setLoading(false);
    }
  }

  async function deleteUser(userId: string) {
    if (!confirm('Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.')) {
      return;
    }

    setLoading(true);
    try {
      const supabase = await initSupabase();
      const { error } = await supabase.rpc('admin_delete_user', {
        in_user_id: userId
      });

      if (error) throw error;

      toast.success('Usuário excluído com sucesso!');
      await loadUsers();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast.error(error.message || 'Erro ao excluir usuário');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-indigo-500" />
          <h2 className="text-2xl font-bold text-white">Gerenciar Usuários</h2>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Plus className="w-5 h-5" />
          Criar Usuário
        </button>
      </div>

      <div className="gradient-border p-6">
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-gray-800 p-6 rounded-lg"
          >
            <h3 className="text-lg font-medium text-white mb-4">Criar Novo Usuário</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Nome
                </label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Senha
                </label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Plano
                </label>
                <select
                  value={newUser.planType}
                  onChange={(e) => setNewUser({ ...newUser, planType: e.target.value })}
                  className="w-full bg-gray-700 border-gray-600 text-white rounded-lg"
                >
                  <option value="free">Free</option>
                  <option value="starter">Starter</option>
                  <option value="pro">Pro</option>
                  <option value="tiktok">TikTok</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  onClick={createUser}
                  disabled={loading || !newUser.email || !newUser.password || !newUser.name}
                  className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  Criar Usuário
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800 p-4 rounded-lg"
              >
                {editingUser?.id === user.id ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Nome
                      </label>
                      <input
                        type="text"
                        value={editingUser.name}
                        onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Plano
                      </label>
                      <select
                        value={editingUser.planType}
                        onChange={(e) => setEditingUser({ ...editingUser, planType: e.target.value })}
                        className="w-full bg-gray-700 border-gray-600 text-white rounded-lg"
                      >
                        <option value="free">Free</option>
                        <option value="starter">Starter</option>
                        <option value="pro">Pro</option>
                        <option value="tiktok">TikTok</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Status
                      </label>
                      <select
                        value={editingUser.status}
                        onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })}
                        className="w-full bg-gray-700 border-gray-600 text-white rounded-lg"
                      >
                        <option value="active">Ativo</option>
                        <option value="cancelled">Cancelado</option>
                        <option value="expired">Expirado</option>
                      </select>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingUser(null)}
                        className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => updateUser(user.id)}
                        className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                      >
                        Salvar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-white">{user.name}</h3>
                      <p className="text-sm text-gray-400">{user.email}</p>
                      <div className="mt-1 flex items-center gap-4">
                        <span className="text-sm text-gray-400">
                          Plano: <span className="text-indigo-400">{user.planType.toUpperCase()}</span>
                        </span>
                        <span className="text-sm text-gray-400">
                          Status: <span className={`${
                            user.status === 'active' ? 'text-green-400' :
                            user.status === 'cancelled' ? 'text-red-400' :
                            'text-yellow-400'
                          }`}>{user.status}</span>
                        </span>
                        <span className="text-sm text-gray-400">
                          Criado em: {user.createdAt}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingUser(user)}
                        className="p-2 text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="p-2 text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}

            {users.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                Nenhum usuário encontrado
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}