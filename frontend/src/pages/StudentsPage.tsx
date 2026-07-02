import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, User, Mail, Briefcase, X, History, AlertTriangle, CheckCircle, Calendar, GraduationCap } from 'lucide-react';
import { studentsApi, type StudentDto, type StudentHistoryDto } from '@/shared/api/students';

const getStatusBadgeClass = (status: string) => {
  switch (status.toUpperCase()) {
    case 'ACTIVE':
      return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
    case 'EVADED':
      return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
    case 'COMPLETED':
      return 'bg-primary/10 text-primary border-primary/20';
    default:
      return 'bg-muted text-muted-foreground border-border';
  }
};

const getStatusLabel = (status: string) => {
  switch (status.toUpperCase()) {
    case 'ACTIVE':
      return 'Ativo';
    case 'EVADED':
      return 'Evasão';
    case 'COMPLETED':
      return 'Concluído';
    default:
      return status;
  }
};

const getPresenceBadgeClass = (status: string) => {
  switch (status.toUpperCase()) {
    case 'PRESENT':
      return 'bg-emerald-500 text-white';
    case 'ABSENT':
      return 'bg-rose-500 text-white';
    case 'JUSTIFIED':
      return 'bg-amber-500 text-white';
    case 'FT':
      return 'bg-primary text-white';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

export const StudentsPage: React.FC = () => {
  const [students, setStudents] = useState<StudentDto[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentDto | null>(null);

  // History modal states
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState<StudentHistoryDto | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profissao, setProfissao] = useState('');
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
    setError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (student: StudentDto) => {
    setEditingStudent(student);
    setName(student.name);
    setEmail(student.email);
    setProfissao(student.profissao);
    setError('');
    setIsModalOpen(true);
  };

  const handleOpenHistoryModal = async (student: StudentDto) => {
    setHistoryLoading(true);
    setSelectedHistory(null);
    setIsHistoryModalOpen(true);
    try {
      const data = await studentsApi.getHistory(student.id);
      setSelectedHistory(data);
    } catch (err) {
      console.error('Failed to load student history', err);
    } finally {
      setHistoryLoading(false);
    }
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
        await studentsApi.update(editingStudent.id, { name, email, profissao });
      } else {
        await studentsApi.create({ name, email, profissao });
      }
      await fetchStudents();
      setIsModalOpen(false);
    } catch (err) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message || 'Ocorreu um erro ao salvar o aluno.');
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
            Cadastre e gerencie a ficha cadastral e histórico dos alunos e beneficiários da SEAS.
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
            className="bg-card border border-border/40 hover:border-primary/30 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative group"
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-border/80 text-primary flex-shrink-0">
                <User className="w-8 h-8" />
              </div>
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

            <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-border/30">
              <button
                onClick={() => handleOpenHistoryModal(student)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/80 hover:border-primary/40 hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all text-xs font-semibold"
                title="Visualizar histórico completo"
              >
                <History className="w-3.5 h-3.5" />
                Histórico / Ficha
              </button>
            </div>
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
                    placeholder="Ex: joao@email.com"
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

      {/* History Modal */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/30 backdrop-blur-sm">
          <div className="bg-card border border-border shadow-2xl rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col animate-in scale-in duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                  <History className="w-5 h-5 text-primary" />
                  Ficha e Histórico do Aluno
                </h3>
                {selectedHistory && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Matrícula: <span className="font-mono font-semibold">{selectedHistory.student.codigoMatricula}</span>
                  </p>
                )}
              </div>
              <button
                onClick={() => setIsHistoryModalOpen(false)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {historyLoading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                  <span className="text-sm text-muted-foreground">Carregando histórico do beneficiário...</span>
                </div>
              ) : selectedHistory ? (
                <>
                  {/* Personal details */}
                  <div className="p-4 bg-muted/20 border border-border rounded-xl space-y-3">
                    <h4 className="font-bold text-sm text-foreground">Ficha Cadastral</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-muted-foreground block font-medium">Nome</span>
                        <span className="font-semibold text-foreground text-sm">{selectedHistory.student.name}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block font-medium">E-mail</span>
                        <span className="font-semibold text-foreground text-sm">{selectedHistory.student.email}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block font-medium">Profissão / Ocupação</span>
                        <span className="font-semibold text-foreground text-sm">{selectedHistory.student.profissao || 'Não informado'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Evasion Alerts */}
                  {selectedHistory.evasionAlerts.some((a) => a.evaded || a.absencesCount >= 3) && (
                    <div className="space-y-2">
                      <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                        <AlertTriangle className="w-4.5 h-4.5 text-rose-500" />
                        Alertas de Risco de Evasão
                      </h4>
                      <div className="space-y-2">
                        {selectedHistory.evasionAlerts
                          .filter((a) => a.evaded || a.absencesCount >= 3)
                          .map((alert) => (
                            <div
                              key={alert.classId}
                              className={`p-3 border rounded-xl text-xs flex items-center justify-between ${
                                alert.evaded
                                  ? 'bg-rose-500/10 border-rose-500/20 text-rose-700'
                                  : 'bg-amber-500/10 border-amber-500/20 text-amber-700'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                                <span>
                                  Turma <strong>{alert.className}</strong>:{' '}
                                  {alert.evaded ? 'Status definido como EVADIDO.' : `Possui ${alert.absencesCount} faltas acumuladas.`}
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Enrollments */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                      <GraduationCap className="w-4.5 h-4.5 text-primary" />
                      Histórico de Matrículas
                    </h4>
                    <div className="border border-border/60 rounded-xl overflow-hidden text-xs">
                      <table className="w-full text-left">
                        <thead className="bg-muted/30 font-bold text-muted-foreground border-b border-border/60">
                          <tr>
                            <th className="p-3">Turma</th>
                            <th className="p-3">Semestre</th>
                            <th className="p-3">Data de Matrícula</th>
                            <th className="p-3 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                          {selectedHistory.enrollments.map((e) => (
                            <tr key={e.classId} className="hover:bg-muted/5">
                              <td className="p-3 font-semibold text-foreground">{e.className}</td>
                              <td className="p-3">{e.semester}</td>
                              <td className="p-3">{new Date(e.createdAt).toLocaleDateString('pt-BR')}</td>
                              <td className="p-3 text-right">
                                <span className={`inline-block px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${getStatusBadgeClass(e.status)}`}>
                                  {getStatusLabel(e.status)}
                                </span>
                              </td>
                            </tr>
                          ))}
                          {selectedHistory.enrollments.length === 0 && (
                            <tr>
                              <td colSpan={4} className="p-4 text-center text-muted-foreground">
                                Nenhuma matrícula registrada para este aluno.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Attendance Stats */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                      <CheckCircle className="w-4.5 h-4.5 text-primary" />
                      Frequência Acumulada
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedHistory.attendanceStats.map((stat) => (
                        <div key={stat.classId} className="p-4 bg-card border border-border/60 rounded-xl space-y-2">
                          <span className="font-semibold text-xs text-foreground block truncate">{stat.className}</span>
                          <div className="flex justify-between items-end">
                            <div className="text-[10px] text-muted-foreground space-y-0.5">
                              <div>Aulas Registradas: <strong className="text-foreground">{stat.totalClasses}</strong></div>
                              <div>Presenças: <strong className="text-emerald-600">{stat.presenceCount}</strong></div>
                              <div>Faltas: <strong className="text-rose-600">{stat.absenceCount}</strong></div>
                              <div>Justificadas: <strong className="text-amber-600">{stat.justifiedCount}</strong></div>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] text-muted-foreground block">Taxa de Frequência</span>
                              <span className={`text-lg font-extrabold ${stat.attendanceRate >= 75 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {stat.attendanceRate}%
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                      <Calendar className="w-4.5 h-4.5 text-primary" />
                      Linha do Tempo de Presenças
                    </h4>
                    <div className="relative border-l border-border/80 pl-4 ml-2 space-y-4 text-xs">
                      {selectedHistory.attendanceTimeline.map((item, idx) => (
                        <div key={idx} className="relative">
                          {/* Bullet marker */}
                          <div className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-primary border-2 border-background" />

                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-foreground">
                                {new Date(item.date).toLocaleDateString('pt-BR')}
                              </span>
                              <span className="text-[10px] text-muted-foreground">•</span>
                              <span className="text-muted-foreground">{item.className}</span>
                              <span className={`ml-auto px-1.5 py-0.5 rounded text-[9px] font-bold ${getPresenceBadgeClass(item.status)}`}>
                                {item.status === 'PRESENT'
                                  ? 'Presença'
                                  : item.status === 'ABSENT'
                                  ? 'Falta'
                                  : item.status === 'JUSTIFIED'
                                  ? 'Justificada'
                                  : 'Falta Trab.'}
                              </span>
                            </div>
                            {(item.observacao || item.justificativaDetalhes) && (
                              <div className="p-2 bg-muted/30 border border-border/40 rounded-lg text-[10px] text-muted-foreground mt-1 space-y-0.5">
                                {item.observacao && (
                                  <div>
                                    <strong>Obs:</strong> {item.observacao}
                                  </div>
                                )}
                                {item.justificativaDetalhes && (
                                  <div>
                                    <strong>Motivo alteração retroativa:</strong> {item.justificativaDetalhes}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      {selectedHistory.attendanceTimeline.length === 0 && (
                        <div className="text-muted-foreground py-4 text-center">
                          Nenhum registro de chamada encontrado.
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-muted-foreground text-sm">
                  Não foi possível obter os dados do histórico.
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-border bg-muted/20">
              <button
                type="button"
                onClick={() => setIsHistoryModalOpen(false)}
                className="px-4 py-2 bg-card border border-border hover:bg-muted text-foreground transition-colors rounded-xl text-sm font-medium"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
