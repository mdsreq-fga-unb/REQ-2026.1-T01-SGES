import React, { useState, useEffect } from 'react';
import { Plus, Search, X, BookOpen, Calendar, Clock, Users, Trash2, UserPlus, UserCheck, AlertTriangle, Pencil } from 'lucide-react';
import { classesApi, type ClassDto, type UserDto } from '@/shared/api/classes';
import { studentsApi, type StudentDto } from '@/shared/api/students';
import { useAuth } from '@/app/providers/AuthProvider';
import { useToast } from '@/shared/components/Toast';

const DAYS_OF_WEEK = [
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
  'Domingo',
];

export const ClassesPage: React.FC = () => {
  const { user: loggedUser } = useAuth();
  const { addToast } = useToast();
  const isAdmin = loggedUser?.role === 'admin';

  const [classes, setClasses] = useState<ClassDto[]>([]);
  const [students, setStudents] = useState<StudentDto[]>([]);
  const [users, setUsers] = useState<UserDto[]>([]);
  const [search, setSearch] = useState('');

  // Modais e Estados de Edição
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingClassId, setEditingClassId] = useState<string | null>(null);
  const [isStudentsOpen, setIsStudentsOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassDto | null>(null);
  const [classStudents, setClassStudents] = useState<StudentDto[]>([]);

  // Formulário Criar/Editar Turma
  const [nomeCurso, setNomeCurso] = useState('');
  const [livrosEstudados, setLivrosEstudados] = useState('');
  const [horario, setHorario] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([DAYS_OF_WEEK[5]]); // Sábado por padrão
  const [vagasLimite, setVagasLimite] = useState('50');
  const [selectedInstructors, setSelectedInstructors] = useState<string[]>([]);

  // Cadastro Rápido de Instrutor
  const [isQuickInstructorOpen, setIsQuickInstructorOpen] = useState(false);
  const [quickInstructorName, setQuickInstructorName] = useState('');
  const [quickInstructorEmail, setQuickInstructorEmail] = useState('');
  const [quickInstructorRole, setQuickInstructorRole] = useState<'admin' | 'volunteer'>('volunteer');
  const [quickError, setQuickError] = useState('');

  // Formulário Matrícula Aluno
  const [selectedStudentId, setSelectedStudentId] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadAllData = async () => {
    try {
      const dataClasses = await classesApi.getAll();
      setClasses(dataClasses);

      const dataStudents = await studentsApi.getAll();
      setStudents(dataStudents);

      const { usersApi } = await import('@/shared/api/classes');
      const res = await usersApi.getAll();
      setUsers(res.users);
    } catch (err) {
      console.error('Erro ao carregar dados de turmas/alunos:', err);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingClassId(null);
    setNomeCurso('');
    setLivrosEstudados('');
    setHorario('');
    setSelectedDays([DAYS_OF_WEEK[5]]);
    setVagasLimite('50');
    setSelectedInstructors([]);
    setError('');
    setIsQuickInstructorOpen(false);
    setQuickInstructorName('');
    setQuickInstructorEmail('');
    setQuickInstructorRole('volunteer');
    setQuickError('');
    setIsCreateOpen(true);
  };

  const handleOpenEditModal = (cls: ClassDto) => {
    setEditingClassId(cls.id);
    setNomeCurso(cls.nomeCurso);
    setLivrosEstudados(cls.livrosEstudados || '');
    setHorario(cls.horario);
    setSelectedDays(cls.diaSemana ? cls.diaSemana.split(', ') : []);
    setVagasLimite(String(cls.vagasLimite || 50));
    setSelectedInstructors(cls.instructors?.map((i) => i.id) || []);
    setError('');
    setIsQuickInstructorOpen(false);
    setQuickInstructorName('');
    setQuickInstructorEmail('');
    setQuickInstructorRole('volunteer');
    setQuickError('');
    setIsCreateOpen(true);
  };

  const handleSaveClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeCurso || !horario || selectedDays.length === 0) {
      setError('Por favor, preencha todos os campos obrigatórios e selecione pelo menos um dia da semana.');
      return;
    }

    if (selectedInstructors.length > 2) {
      setError('Uma turma pode ter no máximo 2 instrutores (dupla).');
      return;
    }

    setLoading(true);
    setError('');

    const payload = {
      nomeCurso,
      livrosEstudados: livrosEstudados || null,
      horario,
      diaSemana: selectedDays.join(', '),
      vagasLimite: vagasLimite ? Number(vagasLimite) : null,
      instructorIds: selectedInstructors,
    };

    try {
      if (editingClassId) {
        await classesApi.update(editingClassId, payload);
        addToast('success', 'Turma atualizada com sucesso!');
      } else {
        await classesApi.create(payload);
        addToast('success', 'Turma criada com sucesso!');
      }
      setIsCreateOpen(false);
      await loadAllData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao salvar a turma.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickCreateInstructor = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!quickInstructorName || !quickInstructorEmail) {
      setQuickError('Preencha o nome e o e-mail do instrutor.');
      return;
    }

    setLoading(true);
    setQuickError('');

    try {
      const { usersApi } = await import('@/shared/api/classes');
      const newUser = await usersApi.create({
        name: quickInstructorName,
        email: quickInstructorEmail,
        role: quickInstructorRole,
      });

      // Adicionar à lista local de instrutores
      setUsers((prev) => [...prev, newUser]);

      // Selecionar o instrutor criado (respeitando limite de 2)
      setSelectedInstructors((prev) => {
        if (prev.includes(newUser.id)) return prev;
        if (prev.length >= 2) {
          addToast('warning', 'Instrutor cadastrado, mas limite de 2 instrutores na turma já atingido.');
          return prev;
        }
        return [...prev, newUser.id];
      });

      addToast('success', 'Instrutor criado e selecionado com sucesso!');
      setQuickInstructorName('');
      setQuickInstructorEmail('');
      setIsQuickInstructorOpen(false);
    } catch (err: any) {
      setQuickError(err.response?.data?.message || 'Erro ao cadastrar instrutor.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClass = async (classId: string) => {
    if (!window.confirm('Tem certeza de que deseja excluir esta turma permanentemente?')) {
      return;
    }
    try {
      await classesApi.delete(classId);
      addToast('success', 'Turma excluída com sucesso.');
      await loadAllData();
    } catch (err: any) {
      addToast('error', err.response?.data?.message || 'Falha ao excluir a turma.');
    }
  };

  const handleOpenStudentsModal = async (cls: ClassDto) => {
    setSelectedClass(cls);
    setSelectedStudentId('');
    setError('');
    setIsStudentsOpen(true);
    try {
      const data = await classesApi.getStudents(cls.id);
      setClassStudents(data);
    } catch (err) {
      console.error('Erro ao carregar estudantes da turma:', err);
    }
  };

  const handleEnrollStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass || !selectedStudentId) return;

    // Verificar limite de vagas antes
    const limit = selectedClass.vagasLimite || 50;
    if (classStudents.length >= limit) {
      addToast('error', `A turma já atingiu a capacidade máxima de ${limit} vagas.`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      await classesApi.enrollStudent(selectedClass.id, selectedStudentId);
      addToast('success', 'Aluno matriculado com sucesso!');
      setSelectedStudentId('');
      // Recarregar alunos da turma e estatísticas gerais
      const data = await classesApi.getStudents(selectedClass.id);
      setClassStudents(data);
      await loadAllData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao matricular o aluno.');
    } finally {
      setLoading(false);
    }
  };

  const handleUnenrollStudent = async (studentId: string) => {
    if (!selectedClass) return;
    if (!window.confirm('Deseja desvincular este aluno desta turma?')) return;

    try {
      await classesApi.unenrollStudent(selectedClass.id, studentId);
      addToast('success', 'Aluno desvinculado com sucesso.');
      // Recarregar
      const data = await classesApi.getStudents(selectedClass.id);
      setClassStudents(data);
      await loadAllData();
    } catch (err: any) {
      addToast('error', err.response?.data?.message || 'Falha ao desvincular o aluno.');
    }
  };

  const toggleInstructor = (id: string) => {
    if (selectedInstructors.includes(id)) {
      setSelectedInstructors(selectedInstructors.filter((insId) => insId !== id));
    } else {
      if (selectedInstructors.length >= 2) {
        addToast('warning', 'O limite é de no máximo 2 instrutores.');
        return;
      }
      setSelectedInstructors([...selectedInstructors, id]);
    }
  };

  // Filtrar alunos não matriculados para exibição no dropdown
  const availableStudents = students.filter(
    (s) => !classStudents.some((cs) => cs.id === s.id)
  );

  const filteredClasses = classes.filter((c) =>
    c.nomeCurso.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Gestão de Turmas</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Cadastre novas turmas, configure instrutores e gerencie a lista de alunos matriculados.
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center justify-center gap-2 bg-primary text-white hover:bg-primary/90 transition-colors px-4 py-2.5 rounded-xl font-medium text-sm shadow-md"
          >
            <Plus className="w-4 h-4" />
            Nova Turma
          </button>
        )}
      </div>

      <div className="flex items-center bg-card border border-border/50 rounded-xl px-3 py-2 max-w-md shadow-sm">
        <Search className="w-4 h-4 text-muted-foreground mr-2" />
        <input
          type="text"
          placeholder="Buscar por curso..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent border-0 outline-none w-full text-sm text-foreground placeholder-muted-foreground"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredClasses.map((cls) => {
          const limit = cls.vagasLimite || 50;
          const currentCount = cls.studentsCount || 0;
          const isFull = currentCount >= limit;
          const isWarning = currentCount >= limit * 0.8 && !isFull;

          return (
            <div
              key={cls.id}
              className="bg-card border border-border/40 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="inline-block text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full">
                      {cls.semester}
                    </span>
                    <h3 className="font-bold text-foreground text-lg">{cls.nomeCurso}</h3>
                  </div>
                  {isAdmin && (
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleOpenEditModal(cls)}
                        className="p-1.5 rounded-lg border border-border/60 hover:border-primary/40 hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all"
                        title="Editar turma"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClass(cls.id)}
                        className="p-1.5 rounded-lg border border-border/60 hover:border-destructive/40 hover:bg-destructive/5 text-muted-foreground hover:text-destructive transition-all"
                        title="Excluir turma"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="leading-tight">{cls.diaSemana}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{cls.horario}</span>
                  </div>
                  {cls.livrosEstudados && (
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="truncate">Livro: {cls.livrosEstudados}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 pt-2 border-t border-border/40">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-foreground">
                      Vagas: {currentCount} / {limit}
                    </span>
                    {isFull && (
                      <span className="text-[10px] bg-destructive/10 text-destructive font-bold px-2 py-0.5 rounded-full">
                        Esgotada
                      </span>
                    )}
                    {isWarning && (
                      <span className="text-[10px] bg-amber-500/10 text-amber-600 font-bold px-2 py-0.5 rounded-full">
                        Lotando
                      </span>
                    )}
                  </div>
                </div>

                {cls.instructors && cls.instructors.length > 0 && (
                  <div className="pt-2 space-y-1.5">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                      Instrutores
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cls.instructors.map((ins) => (
                        <span
                          key={ins.id}
                          className="inline-flex items-center gap-1 text-xs bg-muted/80 text-foreground px-2.5 py-1 rounded-lg border border-border/40"
                        >
                          <UserCheck className="w-3.5 h-3.5 text-primary" />
                          {ins.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-5 mt-5 border-t border-border/40">
                <button
                  onClick={() => handleOpenStudentsModal(cls)}
                  className="w-full flex items-center justify-center gap-2 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all py-2 rounded-xl text-sm font-semibold"
                >
                  <Users className="w-4 h-4" />
                  Gerenciar Alunos
                </button>
              </div>
            </div>
          );
        })}

        {filteredClasses.length === 0 && (
          <div className="col-span-full py-16 text-center text-muted-foreground text-sm border border-dashed border-border/60 rounded-2xl">
            Nenhuma turma cadastrada.
          </div>
        )}
      </div>

      {/* Modal Criar/Editar Turma */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/30 backdrop-blur-sm">
          <div className="bg-card border border-border shadow-2xl rounded-2xl max-w-lg w-full overflow-hidden animate-in scale-in duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="font-bold text-lg text-foreground">
                {editingClassId ? 'Editar Turma' : 'Cadastrar Nova Turma'}
              </h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveClass} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {error && (
                <div className="p-3 bg-destructive/10 text-destructive rounded-xl text-xs font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                  Nome do Curso *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Alfabetização - Turma C"
                  value={nomeCurso}
                  onChange={(e) => setNomeCurso(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                  Dias da Semana * (Selecione um ou mais)
                </label>
                <div className="flex flex-wrap gap-2">
                  {DAYS_OF_WEEK.map((day) => {
                    const selected = selectedDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => {
                          if (selected) {
                            setSelectedDays(selectedDays.filter((d) => d !== day));
                          } else {
                            setSelectedDays([...selectedDays, day]);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                          selected
                            ? 'bg-primary/10 border-primary text-primary'
                            : 'bg-background border-border hover:bg-muted text-foreground'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                    Horário *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 19:00 - 21:00"
                    value={horario}
                    onChange={(e) => setHorario(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                    Limite de Vagas
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Ex: 50"
                    value={vagasLimite}
                    onChange={(e) => setVagasLimite(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                    Livros / Apostilas
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Apostila 1"
                    value={livrosEstudados}
                    onChange={(e) => setLivrosEstudados(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                    Selecionar Instrutores (máximo de 2)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsQuickInstructorOpen(!isQuickInstructorOpen);
                      setQuickError('');
                    }}
                    className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
                  >
                    {isQuickInstructorOpen ? 'Fechar Cadastro Rápido' : '+ Cadastrar Novo Instrutor'}
                  </button>
                </div>

                {isQuickInstructorOpen && (
                  <div className="border border-border rounded-xl p-4 bg-muted/20 space-y-3 animate-in fade-in duration-200">
                    <h4 className="text-xs font-bold text-foreground">Cadastro Rápido de Instrutor</h4>
                    {quickError && (
                      <p className="text-[10px] text-destructive bg-destructive/10 p-2 rounded-lg font-medium">{quickError}</p>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Nome Completo"
                        value={quickInstructorName}
                        onChange={(e) => setQuickInstructorName(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      <input
                        type="email"
                        placeholder="E-mail"
                        value={quickInstructorEmail}
                        onChange={(e) => setQuickInstructorEmail(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setQuickInstructorRole('volunteer')}
                          className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold ${
                            quickInstructorRole === 'volunteer'
                              ? 'bg-primary/10 border-primary text-primary'
                              : 'bg-background border-border text-foreground'
                          }`}
                        >
                          Voluntário
                        </button>
                        <button
                          type="button"
                          onClick={() => setQuickInstructorRole('admin')}
                          className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold ${
                            quickInstructorRole === 'admin'
                              ? 'bg-purple-500/10 border-purple-500 text-purple-600'
                              : 'bg-background border-border text-foreground'
                          }`}
                        >
                          Admin
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={handleQuickCreateInstructor}
                        disabled={loading}
                        className="bg-primary text-white hover:bg-primary/90 text-xs font-bold px-3 py-1.5 rounded-lg disabled:opacity-50"
                      >
                        {loading ? 'Cadastrando...' : 'Cadastrar e Selecionar'}
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border border-border rounded-xl p-3 bg-muted/20">
                  {users.map((u) => {
                    const selected = selectedInstructors.includes(u.id);
                    return (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => toggleInstructor(u.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-left text-xs font-medium transition-all ${
                          selected
                            ? 'bg-primary/10 border-primary text-primary'
                            : 'bg-background border-border/60 hover:bg-muted text-foreground'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selected}
                          readOnly
                          className="pointer-events-none rounded border-border"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-bold truncate">{u.name}</p>
                          <p className="text-[10px] text-muted-foreground capitalize">{u.role}</p>
                        </div>
                      </button>
                    );
                  })}
                  {users.length === 0 && (
                    <p className="text-xs text-muted-foreground col-span-full text-center py-2">
                      Nenhum instrutor disponível.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 border border-border hover:bg-muted text-foreground transition-colors rounded-xl text-sm font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary text-white hover:bg-primary/90 transition-colors px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-50"
                >
                  {loading ? 'Salvando...' : (editingClassId ? 'Salvar Alterações' : 'Criar Turma')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Gerenciar Alunos da Turma */}
      {isStudentsOpen && selectedClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/30 backdrop-blur-sm">
          <div className="bg-card border border-border shadow-2xl rounded-2xl max-w-2xl w-full overflow-hidden animate-in scale-in duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/20">
              <div>
                <h3 className="font-bold text-lg text-foreground">{selectedClass.nomeCurso}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Alunos matriculados: {classStudents.length} / {selectedClass.vagasLimite || 50}
                </p>
              </div>
              <button
                onClick={() => setIsStudentsOpen(false)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Form de matrícula */}
              <form onSubmit={handleEnrollStudent} className="flex flex-col sm:flex-row gap-3 items-end">
                <div className="flex-1 space-y-1.5 w-full">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                    Matricular Novo Aluno
                  </label>
                  <select
                    required
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground"
                  >
                    <option value="">Selecione um aluno...</option>
                    {availableStudents.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.codigo_matricula})
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={loading || !selectedStudentId}
                  className="flex items-center justify-center gap-2 bg-primary text-white hover:bg-primary/90 transition-colors px-4 py-2.5 rounded-xl font-medium text-sm shadow-md disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                >
                  <UserPlus className="w-4 h-4" />
                  Matricular
                </button>
              </form>

              {/* Lista de matriculados */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                  Lista de Alunos Matriculados
                </span>
                <div className="border border-border rounded-xl divide-y divide-border/60 max-h-[300px] overflow-y-auto bg-muted/10">
                  {classStudents.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-3.5 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.foto_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
                          alt={student.name}
                          className="w-9 h-9 rounded-full object-cover border border-border"
                        />
                        <div>
                          <p className="font-bold text-foreground text-sm">{student.name}</p>
                          <p className="text-[10px] text-muted-foreground">{student.codigo_matricula}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleUnenrollStudent(student.id)}
                        className="p-1.5 rounded-lg border border-border/60 hover:border-destructive/40 hover:bg-destructive/5 text-muted-foreground hover:text-destructive transition-all"
                        title="Remover matrícula"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {classStudents.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-8">
                      Nenhum aluno matriculado nesta turma ainda.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
