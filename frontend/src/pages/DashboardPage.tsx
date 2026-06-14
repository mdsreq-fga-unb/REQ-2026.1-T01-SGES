import React, { useState, useEffect } from 'react';
import { Users, BookOpen, AlertTriangle, CheckCircle, BarChart3, Calendar } from 'lucide-react';
import { reportsApi, type FunnelReportDto } from '@/shared/api/reports';

export const DashboardPage: React.FC = () => {
  const [semester, setSemester] = useState('2026.1');
  const [data, setData] = useState<FunnelReportDto | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFunnelData = async () => {
      setLoading(true);
      try {
        const res = await reportsApi.getFunnel(semester);
        setData(res);
      } catch (err) {
        console.error('Failed to load funnel report data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFunnelData();
  }, [semester]);

  const entered = data?.entered || 0;
  const active = data?.active || 0;
  const evaded = data?.evaded || 0;
  const completed = data?.completed || 0;

  const activePct = entered > 0 ? ((active / entered) * 100).toFixed(1) : '0';
  const evadedPct = entered > 0 ? ((evaded / entered) * 100).toFixed(1) : '0';
  const completedPct = entered > 0 ? ((completed / entered) * 100).toFixed(1) : '0';

  const stats = [
    {
      id: 'stat-matriculados',
      label: 'Alunos Matriculados',
      value: entered,
      icon: Users,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      id: 'stat-ativos',
      label: 'Alunos Ativos',
      value: active,
      icon: BookOpen,
      color: 'text-sky-500',
      bg: 'bg-sky-500/10',
    },
    {
      id: 'stat-concluintes',
      label: 'Alunos Concluintes',
      value: completed,
      icon: CheckCircle,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
    {
      id: 'stat-evadidos',
      label: 'Desistentes / Evasão',
      value: evaded,
      icon: AlertTriangle,
      color: 'text-rose-500',
      bg: 'bg-rose-500/10',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Visão Geral do Ciclo</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Acompanhe a taxa de conversão e evasão dos beneficiários por semestre.
          </p>
        </div>

        <div className="flex items-center bg-card border border-border/50 rounded-xl px-3 py-1.5 shadow-sm w-fit">
          <Calendar className="w-4 h-4 text-muted-foreground mr-2" />
          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="bg-transparent border-0 outline-none text-sm font-semibold text-foreground cursor-pointer"
          >
            <option value="2026.1">Ciclo 2026.1 (Atual)</option>
            <option value="2025.2">Ciclo 2025.2 (Passado)</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-sm text-muted-foreground">Carregando indicadores...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.id}
                  id={stat.id}
                  className="p-5 bg-card border border-border/40 rounded-2xl shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-foreground tabular-nums">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1.5">{stat.label}</p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-card border border-border/40 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-base text-foreground">Funil de Conversão e Retenção</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-foreground">
                    <span>1. Alunos Matriculados (Base de Entrada)</span>
                    <span className="font-bold">100% ({entered} alunos)</span>
                  </div>
                  <div className="h-7 w-full bg-muted rounded-xl overflow-hidden relative">
                    <div className="h-full bg-gradient-to-r from-primary/70 to-primary rounded-xl transition-all duration-500 w-full" />
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white uppercase tracking-wider">
                      Fase de Ingresso
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-foreground">
                    <span>2. Alunos Ativos (Frequentes)</span>
                    <span className="font-bold">{activePct}% ({active} alunos)</span>
                  </div>
                  <div className="h-7 w-full bg-muted rounded-xl overflow-hidden relative">
                    <div
                      className="h-full bg-gradient-to-r from-sky-400 to-sky-500 rounded-xl transition-all duration-500"
                      style={{ width: `${activePct}%` }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-foreground uppercase tracking-wider">
                      Fase de Aprendizado
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-foreground">
                    <span>3. Alunos Concluintes (Sucesso)</span>
                    <span className="font-bold">{completedPct}% ({completed} alunos)</span>
                  </div>
                  <div className="h-7 w-full bg-muted rounded-xl overflow-hidden relative">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-xl transition-all duration-500"
                      style={{ width: `${completedPct}%` }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white uppercase tracking-wider">
                      Fase de Formatura
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border/50 text-[11px] text-muted-foreground flex justify-between">
                <span>* A taxa de conversão calcula a proporção de alunos que concluíram ou seguem ativos em relação ao total de matriculados.</span>
              </div>
            </div>

            <div className="bg-card border border-border/40 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-base text-foreground mb-4">Taxas de Desempenho</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-rose-50/50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-950/20 rounded-xl flex justify-between items-center">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">Taxa de Evasão</p>
                      <p className="text-xs text-rose-600 font-bold mt-0.5">{evadedPct}% de perda</p>
                    </div>
                    <span className="text-2xl font-extrabold text-rose-500">{evaded}</span>
                  </div>

                  <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-950/20 rounded-xl flex justify-between items-center">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">Taxa de Conclusão</p>
                      <p className="text-xs text-emerald-600 font-bold mt-0.5">{completedPct}% de sucesso</p>
                    </div>
                    <span className="text-2xl font-extrabold text-emerald-500">{completed}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-3 bg-muted/30 border border-border/40 rounded-xl text-center">
                <span className="text-xs font-semibold text-foreground block">
                  Status de Alerta de Evasão
                </span>
                <span className="inline-block mt-2 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400">
                  Saudável
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
