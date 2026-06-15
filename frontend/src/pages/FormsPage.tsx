import React, { useState, useEffect } from 'react';
import { Plus, FileText, CheckCircle2, ChevronRight, X, User } from 'lucide-react';
import { useAuth } from '@/app/providers/AuthProvider';
import { formsApi, type FormDto, type FormField, type FormResponseDto } from '@/shared/api/forms';
import { studentsApi, type StudentDto } from '@/shared/api/students';

export const FormsPage: React.FC = () => {
  const { user } = useAuth();
  const [forms, setForms] = useState<FormDto[]>([]);
  const [students, setStudents] = useState<StudentDto[]>([]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isRespondOpen, setIsRespondOpen] = useState(false);
  const [isResponsesOpen, setIsResponsesOpen] = useState(false);

  const [selectedForm, setSelectedForm] = useState<FormDto | null>(null);
  const [formResponses, setFormResponses] = useState<FormResponseDto[]>([]);

  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newFields, setNewFields] = useState<FormField[]>([]);
  const [currentLabel, setCurrentLabel] = useState('');
  const [currentType, setCurrentType] = useState<'text' | 'select'>('text');
  const [currentOptions, setCurrentOptions] = useState('');

  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [answers, setAnswers] = useState<{ [fieldId: string]: string }>({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const loadAll = async () => {
    try {
      const formsData = await formsApi.getAll();
      setForms(formsData);
      const studentsData = await studentsApi.getAll();
      setStudents(studentsData);
    } catch (err) {
      console.error('Failed to load forms data', err);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleAddField = () => {
    if (!currentLabel) return;
    const field: FormField = {
      id: `q_${Date.now()}`,
      type: currentType,
      label: currentLabel,
      required: true,
      options: currentType === 'select' ? currentOptions.split(',').map((o) => o.trim()).filter(Boolean) : undefined,
    };
    setNewFields((prev) => [...prev, field]);
    setCurrentLabel('');
    setCurrentOptions('');
  };

  const handleRemoveField = (id: string) => {
    setNewFields((prev) => prev.filter((f) => f.id !== id));
  };

  const handleCreateForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || newFields.length === 0) {
      setError('Por favor, preencha o título e adicione pelo menos uma pergunta.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await formsApi.create(newTitle, newDesc, newFields);
      setSuccessMsg('Formulário criado com sucesso!');
      setIsCreateOpen(false);
      setNewTitle('');
      setNewDesc('');
      setNewFields([]);
      await loadAll();
    } catch (err) {
      setError('Erro ao criar o formulário.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRespond = (form: FormDto) => {
    setSelectedForm(form);
    setSelectedStudentId(students[0]?.id || '');
    setAnswers({});
    setError('');
    setIsRespondOpen(true);
  };

  const handleSubmitResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedForm || !selectedStudentId) return;

    for (const field of selectedForm.fields) {
      if (field.required && !answers[field.id]) {
        setError(`A pergunta "${field.label}" é obrigatória.`);
        return;
      }
    }

    setLoading(true);
    setError('');
    try {
      await formsApi.submitResponse(selectedForm.id, selectedStudentId, answers);
      setSuccessMsg('Resposta enviada com sucesso!');
      setIsRespondOpen(false);
    } catch (err) {
      setError('Erro ao enviar a resposta.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewResponses = async (form: FormDto) => {
    setSelectedForm(form);
    try {
      const data = await formsApi.getResponses(form.id);
      setFormResponses(data);
      setIsResponsesOpen(true);
    } catch (err) {
      console.error('Failed to load form responses', err);
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Pesquisas & Formulários Customizados</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Crie enquetes e pesquisas de feedback ou socioeconômicas e colete respostas de alunos.
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center justify-center gap-2 bg-primary text-white hover:bg-primary/90 transition-colors px-4 py-2.5 rounded-xl font-medium text-sm shadow-md"
          >
            <Plus className="w-4 h-4" />
            Criar Formulário
          </button>
        )}
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 rounded-2xl flex items-center gap-3 text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {forms.map((form) => (
          <div
            key={form.id}
            className="bg-card border border-border/40 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="p-2.5 bg-primary/10 rounded-xl w-fit text-primary mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-foreground">{form.title}</h3>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{form.description}</p>
              <p className="text-[10px] text-muted-foreground/60 mt-3">
                {form.fields.length} perguntas • Criado em {new Date(form.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border/50">
              <button
                onClick={() => handleOpenRespond(form)}
                className="flex-1 flex items-center justify-center gap-1.5 bg-primary/10 text-primary hover:bg-primary/20 transition-colors py-2 rounded-xl text-xs font-bold"
              >
                Preencher Resposta
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              {isAdmin && (
                <button
                  onClick={() => handleViewResponses(form)}
                  className="flex-1 flex items-center justify-center gap-1.5 border border-border hover:bg-muted transition-colors py-2 rounded-xl text-xs font-bold text-foreground"
                >
                  Ver Respostas
                </button>
              )}
            </div>
          </div>
        ))}

        {forms.length === 0 && (
          <div className="col-span-full py-16 text-center text-muted-foreground text-sm border border-dashed border-border/60 rounded-2xl">
            Nenhum formulário cadastrado.
          </div>
        )}
      </div>

      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/30 backdrop-blur-sm overflow-y-auto">
          <div className="bg-card border border-border shadow-2xl rounded-2xl max-w-lg w-full overflow-hidden my-8 animate-in scale-in duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="font-bold text-lg text-foreground">Novo Formulário Customizado</h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateForm} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {error && <div className="p-3 bg-destructive/10 text-destructive rounded-xl text-xs">{error}</div>}

              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">Título da Pesquisa</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Formulário de Satisfação Geral"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-transparent outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">Descrição</label>
                <textarea
                  placeholder="Descrição breve dos objetivos da enquete..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-transparent outline-none focus:border-primary resize-none"
                />
              </div>

              {newFields.length > 0 && (
                <div className="space-y-2 border-t border-border pt-4">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Perguntas Adicionadas</label>
                  <div className="space-y-2">
                    {newFields.map((f, idx) => (
                      <div key={f.id} className="p-3 bg-muted/40 border border-border rounded-xl flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold">{idx + 1}. {f.label}</p>
                          <p className="text-[10px] text-muted-foreground uppercase mt-0.5">Tipo: {f.type}</p>
                        </div>
                        <button type="button" onClick={() => handleRemoveField(f.id)} className="text-rose-500 text-xs font-bold hover:underline">
                          Remover
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-4 bg-muted/20 border border-border/60 rounded-xl space-y-3 mt-4">
                <p className="text-xs font-bold text-foreground">Nova Pergunta</p>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Pergunta (ex: Possui filhos?)"
                    value={currentLabel}
                    onChange={(e) => setCurrentLabel(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-card outline-none"
                  />
                  <div className="flex gap-2">
                    <select
                      value={currentType}
                      onChange={(e) => setCurrentType(e.target.value as any)}
                      className="bg-card border border-border rounded-lg px-3 py-1.5 text-xs outline-none"
                    >
                      <option value="text">Resposta Escrita (Texto)</option>
                      <option value="select">Múltipla Escolha (Opções)</option>
                    </select>
                  </div>
                  {currentType === 'select' && (
                    <input
                      type="text"
                      placeholder="Opções separadas por vírgula (Ex: Sim, Não)"
                      value={currentOptions}
                      onChange={(e) => setCurrentOptions(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-card outline-none"
                    />
                  )}
                  <button
                    type="button"
                    onClick={handleAddField}
                    className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors py-1.5 px-3 rounded-lg text-xs font-bold block ml-auto"
                  >
                    + Adicionar Pergunta
                  </button>
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
                  disabled={loading || newFields.length === 0}
                  className="bg-primary text-white hover:bg-primary/90 transition-colors px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-50"
                >
                  Criar Formulário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isRespondOpen && selectedForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/30 backdrop-blur-sm overflow-y-auto">
          <div className="bg-card border border-border shadow-2xl rounded-2xl max-w-md w-full overflow-hidden animate-in scale-in duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="min-w-0">
                <h3 className="font-bold text-base text-foreground truncate">{selectedForm.title}</h3>
                <p className="text-[10px] text-muted-foreground truncate">{selectedForm.description}</p>
              </div>
              <button
                onClick={() => setIsRespondOpen(false)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitResponse} className="p-6 space-y-4">
              {error && <div className="p-3 bg-destructive/10 text-destructive rounded-xl text-xs">{error}</div>}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                  Aluno Respondente
                </label>
                <div className="flex items-center bg-muted/30 border border-border rounded-xl px-3 py-2">
                  <User className="w-4 h-4 text-muted-foreground mr-2" />
                  <select
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="bg-transparent border-0 outline-none w-full text-sm text-foreground cursor-pointer"
                  >
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.codigo_matricula})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-4 border-t border-border pt-4">
                {selectedForm.fields.map((f) => (
                  <div key={f.id} className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">
                      {f.label} {f.required && <span className="text-rose-500">*</span>}
                    </label>
                    {f.type === 'text' ? (
                      <input
                        type="text"
                        required={f.required}
                        value={answers[f.id] || ''}
                        onChange={(e) => setAnswers((prev) => ({ ...prev, [f.id]: e.target.value }))}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-muted/10 text-foreground outline-none focus:border-primary"
                      />
                    ) : (
                      <select
                        required={f.required}
                        value={answers[f.id] || ''}
                        onChange={(e) => setAnswers((prev) => ({ ...prev, [f.id]: e.target.value }))}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-muted/10 text-foreground outline-none focus:border-primary cursor-pointer"
                      >
                        <option value="">Selecione uma opção...</option>
                        {f.options?.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
                <button
                  type="button"
                  onClick={() => setIsRespondOpen(false)}
                  className="px-4 py-2 border border-border hover:bg-muted text-foreground transition-colors rounded-xl text-sm font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary text-white hover:bg-primary/90 transition-colors px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-50"
                >
                  Enviar Resposta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isResponsesOpen && selectedForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/30 backdrop-blur-sm overflow-y-auto">
          <div className="bg-card border border-border shadow-2xl rounded-2xl max-w-2xl w-full overflow-hidden animate-in scale-in duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <h3 className="font-bold text-base text-foreground">{selectedForm.title}</h3>
                <p className="text-[10px] text-muted-foreground">Respostas recebidas</p>
              </div>
              <button
                onClick={() => setIsResponsesOpen(false)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-x-auto max-h-[60vh]">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/20">
                    <th className="py-2 px-3 font-bold text-muted-foreground uppercase">Aluno</th>
                    {selectedForm.fields.map((f) => (
                      <th key={f.id} className="py-2 px-3 font-bold text-muted-foreground uppercase">
                        {f.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {formResponses.map((r) => (
                    <tr key={r.id} className="hover:bg-muted/5">
                      <td className="py-2.5 px-3 font-semibold text-foreground">{r.studentName}</td>
                      {selectedForm.fields.map((f) => (
                        <td key={f.id} className="py-2.5 px-3 text-muted-foreground">
                          {r.answers[f.id] || '-'}
                        </td>
                      ))}
                    </tr>
                  ))}

                  {formResponses.length === 0 && (
                    <tr>
                      <td colSpan={selectedForm.fields.length + 1} className="py-8 text-center text-muted-foreground">
                        Nenhuma resposta coletada ainda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end p-4 border-t border-border">
              <button
                onClick={() => setIsResponsesOpen(false)}
                className="px-4 py-2 border border-border hover:bg-muted text-foreground transition-colors rounded-xl text-sm font-medium"
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
