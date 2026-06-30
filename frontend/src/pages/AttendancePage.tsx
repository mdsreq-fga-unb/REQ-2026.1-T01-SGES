import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Calendar, Users, ClipboardCheck, User } from 'lucide-react';
import { classesApi, type ClassDto, type AttendanceStatus } from '@/shared/api/classes';
import type { StudentDto } from '@/shared/api/students';

interface AttendanceState {
  [studentId: string]: {
    status: AttendanceStatus;
    justification: string;
  };
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
};

export const AttendancePage: React.FC = () => {
  const [classes, setClasses] = useState<ClassDto[]>([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [students, setStudents] = useState<StudentDto[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendances, setAttendances] = useState<AttendanceState>({});

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const data = await classesApi.getAll();
        setClasses(data);
        if (data.length > 0) {
          setSelectedClassId(data[0].id);
        }
      } catch (err) {
        console.error('Failed to load classes', err);
      }
    };
    loadClasses();
  }, []);

  useEffect(() => {
    if (!selectedClassId || !date) return;

    const loadStudentsAndAttendance = async () => {
      setLoading(true);
      setError('');
      try {
        const classStudents = await classesApi.getStudents(selectedClassId);
        setStudents(classStudents);

        const attendanceList = await classesApi.getAttendance(selectedClassId, date);

        const initial: AttendanceState = {};
        classStudents.forEach((s) => {
          const record = attendanceList.find((r) => r.studentId === s.id);
          initial[s.id] = {
            status: record?.status || 'PRESENT',
            justification: record?.observacao || '',
          };
        });
        setAttendances(initial);
      } catch (err) {
        console.error('Failed to load class students and attendance', err);
        setError('Erro ao carregar os dados dos alunos ou chamada anterior.');
      } finally {
        setLoading(false);
      }
    };
    loadStudentsAndAttendance();
  }, [selectedClassId, date]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendances((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }));
  };

  const handleJustificationChange = (studentId: string, justification: string) => {
    setAttendances((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        justification,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassId) return;

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const payload = Object.keys(attendances).map((studentId) => ({
        studentId,
        status: attendances[studentId].status,
        justification: attendances[studentId].justification,
      }));

      await classesApi.saveAttendance(selectedClassId, date, payload);
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError('Erro ao salvar a chamada de presença.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h2 className="text-xl font-bold text-foreground">Registro de Presença</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Selecione a turma e realize o lançamento da chamada diária de presença.
        </p>
      </div>

      {success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 rounded-2xl flex items-center gap-3 text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>Chamada salva com sucesso! Os alertas de limite de faltas e evasão foram processados.</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-2xl flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="p-6 bg-card border border-border/40 rounded-2xl shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 space-y-1.5">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
            Turma / Curso
          </label>
          <div className="flex items-center bg-muted/30 border border-border rounded-xl px-3 py-2">
            <Users className="w-4 h-4 text-muted-foreground mr-2" />
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="bg-transparent border-0 outline-none w-full text-sm text-foreground placeholder-muted-foreground"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nomeCurso} ({c.semester})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="w-full md:w-48 space-y-1.5">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
            Data da Aula
          </label>
          <div className="flex items-center bg-muted/30 border border-border rounded-xl px-3 py-2">
            <Calendar className="w-4 h-4 text-muted-foreground mr-2" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-transparent border-0 outline-none w-full text-sm text-foreground"
            />
          </div>
          <p className="text-[10px] text-muted-foreground/80 mt-1">
            Data selecionada: <span className="font-bold text-foreground">{formatDate(date)}</span>
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card border border-border/40 rounded-2xl shadow-sm overflow-hidden">
          <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-6 py-4 bg-muted/20 border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-wider">
            <div className="col-span-4">Aluno / Matrícula</div>
            <div className="col-span-4 text-center">Presença</div>
            <div className="col-span-4">Observações / Justificativa detalhada</div>
          </div>

          <div className="divide-y divide-border/50">
            {students.map((student) => {
              const attendance = attendances[student.id] || { status: 'PRESENT', justification: '' };
              return (
                <div
                  key={student.id}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center px-6 py-4 hover:bg-muted/5 transition-colors"
                >
                  <div className="col-span-1 lg:col-span-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-border text-primary flex-shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-foreground text-sm truncate">{student.name}</h4>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{student.codigo_matricula}</p>
                    </div>
                  </div>

                  <div className="col-span-1 lg:col-span-4 flex justify-center">
                    <div className="flex p-1 bg-muted rounded-xl gap-1 w-full max-w-xs sm:max-w-none">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.id, 'PRESENT')}
                        className={`flex-1 text-center py-2 rounded-lg text-xs font-bold transition-all ${
                          attendance.status === 'PRESENT'
                            ? 'bg-emerald-500 text-white shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        P
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.id, 'ABSENT')}
                        className={`flex-1 text-center py-2 rounded-lg text-xs font-bold transition-all ${
                          attendance.status === 'ABSENT'
                            ? 'bg-rose-500 text-white shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        F
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.id, 'JUSTIFIED')}
                        className={`flex-1 text-center py-2 rounded-lg text-xs font-bold transition-all ${
                          attendance.status === 'JUSTIFIED'
                            ? 'bg-amber-500 text-white shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                        title="Falta Justificada"
                      >
                        FJ
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.id, 'FT')}
                        className={`flex-1 text-center py-2 rounded-lg text-xs font-bold transition-all ${
                          attendance.status === 'FT'
                            ? 'bg-primary text-white shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                        title="Falta justificável por motivo de trabalho"
                      >
                        FT
                      </button>
                    </div>
                  </div>

                  <div className="col-span-1 lg:col-span-4">
                    <input
                      type="text"
                      placeholder={
                        attendance.status === 'FT'
                          ? 'Descreva a justificativa de trabalho...'
                          : attendance.status === 'JUSTIFIED'
                          ? 'Descreva a justificativa da falta...'
                          : 'Adicione observações para faltas ou ausências...'
                      }
                      value={attendance.justification}
                      onChange={(e) => handleJustificationChange(student.id, e.target.value)}
                      required={attendance.status === 'FT' || attendance.status === 'JUSTIFIED'}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-muted/10 text-foreground placeholder-muted-foreground outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>
              );
            })}

            {students.length === 0 && (
              <div className="p-12 text-center text-sm text-muted-foreground">
                Nenhum estudante matriculado nesta turma.
              </div>
            )}
          </div>
        </div>

        {students.length > 0 && (
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90 transition-colors px-6 py-3 rounded-xl font-medium text-sm shadow-md disabled:opacity-50"
            >
              <ClipboardCheck className="w-4 h-4" />
              {loading ? 'Salvando chamada...' : 'Salvar Chamada'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
