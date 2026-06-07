import React from 'react';
import { Users, BookOpen, AlertTriangle } from 'lucide-react';

const stats = [
  {
    id: 'stat-beneficiarios',
    label: 'Total de Beneficiários',
    value: 0,
    icon: Users,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    id: 'stat-turmas',
    label: 'Turmas Ativas',
    value: 0,
    icon: BookOpen,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    id: 'stat-alertas',
    label: 'Alertas de Evasão',
    value: 0,
    icon: AlertTriangle,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
];

export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-foreground">Visão Geral</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Acompanhe os indicadores do sistema em tempo real.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              id={stat.id}
              className="p-6 bg-card border border-border/50 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground tabular-nums">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Placeholder content */}
      <div className="p-8 rounded-2xl border border-dashed border-border/60 text-center">
        <p className="text-sm text-muted-foreground">
          Conteúdo adicional do dashboard será exibido aqui conforme os módulos forem implementados.
        </p>
      </div>
    </div>
  );
};
