import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, User, Mail, Briefcase, X } from 'lucide-react';
import { studentsApi, type StudentDto } from '@/shared/api/students';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
];

export const StudentsPage: React.FC = () => {
  const [students, setStudents] = useState<StudentDto[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentDto | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profissao, setProfissao] = useState('');
  const [fotoUrl, setFotoUrl] = useState(AVATAR_PRESETS[0]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchStudents = async () => {
    try {
      const data = await studentsApi.getAll();
      setStudents(data);
    } catch (err) {
      console.error('Failed to load students', err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingStudent(null);
    setName('');
    setEmail('');
    setProfissao('');
    setFotoUrl(AVATAR_PRESETS[0]);
    setError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (student: StudentDto) => {
    setEditingStudent(student);
    setName(student.name);
    setEmail(student.email);
    setProfissao(student.profissao);
    setFotoUrl(student.foto_url || AVATAR_PRESETS[0]);
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !profissao) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (editingStudent) {
        await studentsApi.update(editingStudent.id, { name, email, profissao, foto_url: fotoUrl });
      } else {
        await studentsApi.create({ name, email, profissao, foto_url: fotoUrl });
      }
      await fetchStudents();
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ocorreu um erro ao salvar o aluno.');
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.codigo_matricula.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Gestão de Beneficiários</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Cadastre e gerencie a ficha cadastral dos alunos e beneficiários da SEAS.
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center justify-center gap-2 bg-primary text-white hover:bg-primary/90 transition-colors px-4 py-2.5 rounded-xl font-medium text-sm shadow-md"
        >
          <Plus className="w-4 h-4" />
          Cadastrar Aluno
        </button>
      </div>

      <div className="flex items-center bg-card border border-border/50 rounded-xl px-3 py-2 max-w-md shadow-sm">
        <Search className="w-4 h-4 text-muted-foreground mr-2" />
        <input
          type="text"
          placeholder="Buscar por nome, e-mail ou matrícula..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent border-0 outline-none w-full text-sm text-foreground placeholder-muted-foreground"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredStudents.map((student) => (
          <div
            key={student.id}
            className="bg-card border border-border/40 hover:border-primary/30 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex items-start gap-4 relative group"
          >
            <img
              src={student.foto_url || AVATAR_PRESETS[0]}
              alt={student.name}
              className="w-16 h-16 rounded-full object-cover border border-border/80"
            />
            <div className="flex-1 min-w-0">
              <span className="inline-block text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full mb-1">
                {student.codigo_matricula}
              </span>
              <h3 className="font-bold text-foreground text-base truncate">{student.name}</h3>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1.5 truncate">
                <Briefcase className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{student.profissao}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 truncate">
                <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{student.email}</span>
              </div>
            </div>
            <button
              onClick={() => handleOpenEditModal(student)}
              className="absolute top-4 right-4 p-1.5 rounded-lg border border-border/60 hover:border-primary/40 hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
              title="Editar ficha do aluno"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        {filteredStudents.length === 0 && (
          <div className="col-span-full py-16 text-center text-muted-foreground text-sm border border-dashed border-border/60 rounded-2xl">
            Nenhum aluno encontrado.
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/30 backdrop-blur-sm">
          <div className="bg-card border border-border shadow-2xl rounded-2xl max-w-md w-full overflow-hidden animate-in scale-in duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="font-bold text-lg text-foreground">
                {editingStudent ? 'Editar Ficha do Aluno' : 'Cadastrar Novo Aluno'}
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

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                  Foto de Perfil
                </label>
                <div className="flex items-center gap-4">
                  <img
                    src={fotoUrl}
                    alt="Preview"
                    className="w-16 h-16 rounded-full object-cover border-2 border-primary/20 shadow-sm"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex gap-2">
                      {AVATAR_PRESETS.map((p, idx) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setFotoUrl(p)}
                          className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all ${
                            fotoUrl === p ? 'border-primary ring-2 ring-primary/20' : 'border-transparent'
                          }`}
                        >
                          <img src={p} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Ou cole a URL da imagem..."
                      value={fotoUrl}
                      onChange={(e) => setFotoUrl(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-border bg-transparent text-xs text-foreground placeholder-muted-foreground outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                  Nome Completo
                </label>
                <div className="flex items-center bg-muted/30 border border-border rounded-xl px-3 py-2">
                  <User className="w-4 h-4 text-muted-foreground mr-2" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: João da Silva"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                    placeholder="Ex: joao@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-transparent border-0 outline-none w-full text-sm text-foreground placeholder-muted-foreground"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                  Profissão / Ocupação
                </label>
                <div className="flex items-center bg-muted/30 border border-border rounded-xl px-3 py-2">
                  <Briefcase className="w-4 h-4 text-muted-foreground mr-2" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: Carpinteiro, Costureira"
                    value={profissao}
                    onChange={(e) => setProfissao(e.target.value)}
                    className="bg-transparent border-0 outline-none w-full text-sm text-foreground placeholder-muted-foreground"
                  />
                </div>
              </div>

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
                  {loading ? 'Salvando...' : 'Salvar Aluno'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
