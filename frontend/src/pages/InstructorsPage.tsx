import React, { useState, useEffect } from 'react';
import { Plus, Search, X, Mail, User, Trash2, AlertTriangle, Edit } from 'lucide-react';
import { usersApi, type UserDto } from '@/shared/api/classes';
import { useAuth } from '@/app/providers/AuthProvider';
import { useToast } from '@/shared/components/Toast';

export const InstructorsPage: React.FC = () => {
  const { user: loggedUser } = useAuth();
  const { addToast } = useToast();
  const isAdmin = loggedUser?.role === 'admin';

  const [users, setUsers] = useState<UserDto[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'volunteer'>('volunteer');

  const fetchUsers = async () => {
    try {
      const data = await usersApi.getAll();
      setUsers(data.users);
    } catch (err) {
      console.error('Failed to load instructors/users', err);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const handleOpenCreateModal = () => {
    setEditingUser(null);
    setName('');
    setEmail('');
    setRole('volunteer');
    setError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: UserDto) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !role) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (editingUser) {
        await usersApi.update(editingUser.id, { name, email, role });
        addToast('success', 'Cadastro do instrutor atualizado com sucesso!');
      } else {
        await usersApi.create({ name, email, role });
        addToast('success', 'Instrutor cadastrado com sucesso!');
      }
      setIsModalOpen(false);
      await fetchUsers();
    } catch (err) {
      const errorMsg = (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Erro ao salvar o instrutor.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (userId === loggedUser?.id) {
      addToast('error', 'Você não pode excluir a si mesmo.');
      return;
    }

    if (!window.confirm(`Tem certeza de que deseja remover o cadastro de ${userName} permanentemente?`)) {
      return;
    }

    try {
      await usersApi.delete(userId);
      addToast('success', 'Cadastro removido com sucesso.');
      await fetchUsers();
    } catch (err) {
      const errorMsg = (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Falha ao remover o cadastro.';
      addToast('error', errorMsg);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  if (!isAdmin) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
        <p className="text-lg font-semibold text-foreground">Acesso Negado</p>
        <p className="text-sm mt-1">Apenas administradores podem gerenciar o cadastro de instrutores.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Gestão de Instrutores</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie o cadastro de voluntários, instrutores e administradores da plataforma.
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center justify-center gap-2 bg-primary text-white hover:bg-primary/90 transition-colors px-4 py-2.5 rounded-xl font-medium text-sm shadow-md"
        >
          <Plus className="w-4 h-4" />
          Cadastrar Instrutor
        </button>
      </div>

      <div className="flex items-center bg-card border border-border/50 rounded-xl px-3 py-2 max-w-md shadow-sm">
        <Search className="w-4 h-4 text-muted-foreground mr-2" />
        <input
          type="text"
          placeholder="Buscar por nome, e-mail ou cargo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent border-0 outline-none w-full text-sm text-foreground placeholder-muted-foreground"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredUsers.map((u) => (
          <div
            key={u.id}
            className="bg-card border border-border/40 hover:border-primary/30 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex items-start justify-between gap-4 relative group"
          >
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span
                  className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 capitalize ${
                    u.role === 'admin'
                      ? 'bg-purple-500/10 text-purple-600'
                      : 'bg-primary/10 text-primary'
                  }`}
                >
                  {u.role === 'admin' ? 'Administrador' : 'Voluntário / Instrutor'}
                </span>
                <h3 className="font-bold text-foreground text-base truncate">{u.name}</h3>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 truncate">
                  <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{u.email}</span>
                </div>
              </div>
            </div>

            {u.id !== loggedUser?.id && u.id !== 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' && (
              <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-all">
                <button
                  onClick={() => handleOpenEditModal(u)}
                  className="p-1.5 rounded-lg border border-border/60 hover:border-primary/45 hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all"
                  title="Editar cadastro"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteUser(u.id, u.name)}
                  className="p-1.5 rounded-lg border border-border/60 hover:border-destructive/40 hover:bg-destructive/5 text-muted-foreground hover:text-destructive transition-all"
                  title="Excluir cadastro"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        ))}

        {filteredUsers.length === 0 && (
          <div className="col-span-full py-16 text-center text-muted-foreground text-sm border border-dashed border-border/60 rounded-2xl">
            Nenhum instrutor encontrado.
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/30 backdrop-blur-sm">
          <div className="bg-card border border-border shadow-2xl rounded-2xl max-w-md w-full overflow-hidden animate-in scale-in duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="font-bold text-lg text-foreground">
                {editingUser ? 'Editar Instrutor' : 'Cadastrar Novo Instrutor'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-destructive/10 text-destructive rounded-xl text-xs font-medium">
                  {error}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                  Nome Completo
                </label>
                <div className="flex items-center bg-muted/30 border border-border rounded-xl px-3 py-2">
                  <User className="w-4 h-4 text-muted-foreground mr-2" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: Carlos Oliveira"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onInvalid={(e) => {
                      const target = e.target as HTMLInputElement;
                      if (target.validity.valueMissing) {
                        target.setCustomValidity('Por favor, preencha este campo.');
                      } else {
                        target.setCustomValidity('');
                      }
                    }}
                    onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
                    className="bg-transparent border-0 outline-none w-full text-sm text-foreground placeholder-muted-foreground"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                  E-mail
                </label>
                <div className="flex items-center bg-muted/30 border border-border rounded-xl px-3 py-2">
                  <Mail className="w-4 h-4 text-muted-foreground mr-2" />
                  <input
                    type="email"
                    required
                    placeholder="Ex: carlos@sges.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onInvalid={(e) => {
                      const target = e.target as HTMLInputElement;
                      if (target.validity.valueMissing) {
                        target.setCustomValidity('Por favor, preencha este campo.');
                      } else if (target.validity.typeMismatch) {
                        target.setCustomValidity('Por favor, insira um e-mail válido.');
                      } else {
                        target.setCustomValidity('');
                      }
                    }}
                    onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
                    className="bg-transparent border-0 outline-none w-full text-sm text-foreground placeholder-muted-foreground"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                  Nível de Acesso / Função
                </label>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setRole('volunteer')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                      role === 'volunteer'
                        ? 'bg-primary/10 border-primary text-primary'
                        : 'bg-background border-border/60 hover:bg-muted text-foreground'
                    }`}
                  >
                    Voluntário / Instrutor
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                      role === 'admin'
                        ? 'bg-purple-500/10 border-purple-500 text-purple-600'
                        : 'bg-background border-border/60 hover:bg-muted text-foreground'
                    }`}
                  >
                    Administrador
                  </button>
                </div>
              </div>

              {!editingUser && (
                <div className="p-3 bg-blue-500/5 text-primary border border-primary/20 rounded-xl text-[11px]">
                  <p className="font-semibold">Nota sobre a senha:</p>
                  <p className="mt-0.5 text-muted-foreground">
                    A senha padrão de primeiro acesso para novos cadastros é <strong className="text-foreground font-bold">Senha123!</strong>. O instrutor poderá alterá-la após o login.
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-border hover:bg-muted text-foreground transition-colors rounded-xl text-sm font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary text-white hover:bg-primary/90 transition-colors px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-50"
                >
                  {loading ? 'Salvando...' : editingUser ? 'Salvar Alterações' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
