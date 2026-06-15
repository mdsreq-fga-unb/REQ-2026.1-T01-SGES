import React, { useState, useEffect } from 'react';
import { Archive, Search, Users, Calendar, BookOpen, Clock } from 'lucide-react';
import { historyApi, type HistoryClassDto, type HistoryInstructorDto } from '@/shared/api/history';

export const HistoryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'classes' | 'instructors'>('classes');
  const [classes, setClasses] = useState<HistoryClassDto[]>([]);
  const [instructors, setInstructors] = useState<HistoryInstructorDto[]>([]);

  const [search, setSearch] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const classesData = await historyApi.getClasses();
        setClasses(classesData);
        const instructorsData = await historyApi.getInstructors();
        setInstructors(instructorsData);
      } catch (err) {
        console.error('Failed to load history data', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredClasses = classes.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.teacherName.toLowerCase().includes(search.toLowerCase());
    const matchesSemester = semesterFilter === 'ALL' || c.semester === semesterFilter;
    return matchesSearch && matchesSemester;
  });

  const filteredInstructors = instructors.filter((i) => {
    const matchesSearch =
      i.teacherName.toLowerCase().includes(search.toLowerCase()) ||
      i.className.toLowerCase().includes(search.toLowerCase());
    const matchesSemester = semesterFilter === 'ALL' || i.semester === semesterFilter;
    return matchesSearch && matchesSemester;
  });

  const semesters = Array.from(
    new Set([...classes.map((c) => c.semester), ...instructors.map((i) => i.semester)])
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h2 className="text-xl font-bold text-foreground">Histórico do Sistema</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Consulte o registro histórico de turmas fechadas, instrutores atuantes e carga horária de semestres anteriores.
        </p>
      </div>

      <div className="flex border-b border-border/60">
        <button
          onClick={() => {
            setActiveTab('classes');
            setSearch('');
          }}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-all border-b-2 ${
            activeTab === 'classes'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Turmas Anteriores
        </button>
        <button
          onClick={() => {
            setActiveTab('instructors');
            setSearch('');
          }}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-all border-b-2 ${
            activeTab === 'instructors'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Users className="w-4 h-4" />
          Instrutores & Cargas Horárias
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center bg-card border border-border/50 rounded-xl px-3 py-2 w-full sm:max-w-xs shadow-sm">
          <Search className="w-4 h-4 text-muted-foreground mr-2" />
          <input
            type="text"
            placeholder={
              activeTab === 'classes' ? 'Buscar por turma ou professor...' : 'Buscar por instrutor ou turma...'
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-0 outline-none w-full text-xs text-foreground placeholder-muted-foreground"
          />
        </div>

        <div className="flex items-center bg-card border border-border/50 rounded-xl px-3 py-1.5 shadow-sm w-full sm:w-fit">
          <Calendar className="w-4 h-4 text-muted-foreground mr-2" />
          <select
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
            className="bg-transparent border-0 outline-none text-xs font-semibold text-foreground cursor-pointer w-full"
          >
            <option value="ALL">Todos os Semestres</option>
            {semesters.map((sem) => (
              <option key={sem} value={sem}>
                Semestre {sem}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-sm text-muted-foreground">Carregando histórico...</div>
      ) : (
        <div className="bg-card border border-border/40 rounded-2xl shadow-sm overflow-hidden">
          {activeTab === 'classes' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/20">
                    <th className="py-3 px-4 font-bold text-muted-foreground uppercase">Nome da Turma</th>
                    <th className="py-3 px-4 font-bold text-muted-foreground uppercase">Semestre</th>
                    <th className="py-3 px-4 font-bold text-muted-foreground uppercase">Instrutor Responsável</th>
                    <th className="py-3 px-4 font-bold text-muted-foreground uppercase text-center">Matriculados</th>
                    <th className="py-3 px-4 font-bold text-muted-foreground uppercase text-center">Evasões</th>
                    <th className="py-3 px-4 font-bold text-muted-foreground uppercase text-center">Concluintes</th>
                    <th className="py-3 px-4 font-bold text-muted-foreground uppercase text-center">Taxa de Conclusão</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredClasses.map((c) => {
                    const rate = c.enrolledCount > 0 ? ((c.completedCount / c.enrolledCount) * 100).toFixed(1) : '0';
                    return (
                      <tr key={c.id} className="hover:bg-muted/5 transition-colors">
                        <td className="py-3 px-4 font-semibold text-foreground flex items-center gap-2">
                          <Archive className="w-3.5 h-3.5 text-primary" />
                          {c.name}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">{c.semester}</td>
                        <td className="py-3 px-4 text-foreground font-medium">{c.teacherName}</td>
                        <td className="py-3 px-4 text-center text-muted-foreground font-semibold">{c.enrolledCount}</td>
                        <td className="py-3 px-4 text-center text-rose-500 font-semibold">{c.evadedCount}</td>
                        <td className="py-3 px-4 text-center text-emerald-500 font-semibold">{c.completedCount}</td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400">
                            {rate}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredClasses.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-muted-foreground">
                        Nenhuma turma encontrada para os filtros aplicados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/20">
                    <th className="py-3 px-4 font-bold text-muted-foreground uppercase">Nome do Instrutor</th>
                    <th className="py-3 px-4 font-bold text-muted-foreground uppercase">Turma Ministrada</th>
                    <th className="py-3 px-4 font-bold text-muted-foreground uppercase">Semestre</th>
                    <th className="py-3 px-4 font-bold text-muted-foreground uppercase text-center">Carga Horária</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredInstructors.map((i) => (
                    <tr key={i.id} className="hover:bg-muted/5 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-foreground flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-primary" />
                        {i.teacherName}
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground">{i.className}</td>
                      <td className="py-3.5 px-4 text-muted-foreground">{i.semester}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 font-bold text-foreground">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          {i.hoursCount}h
                        </span>
                      </td>
                    </tr>
                  ))}

                  {filteredInstructors.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-muted-foreground">
                        Nenhum instrutor encontrado para os filtros aplicados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
