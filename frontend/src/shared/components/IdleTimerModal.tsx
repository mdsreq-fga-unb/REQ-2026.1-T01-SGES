import React from 'react';
import { Clock } from 'lucide-react';

interface IdleTimerModalProps {
  /** Segundos restantes antes do logout automático */
  secondsLeft: number;
  /** Callback para quando o usuário clica em "Continuar" */
  onContinue: () => void;
  /** Visibilidade do modal */
  open: boolean;
}

export const IdleTimerModal: React.FC<IdleTimerModalProps> = ({
  secondsLeft,
  onContinue,
  open,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        id="idle-timer-modal"
        className="relative bg-card border border-border rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-[scaleIn_0.2s_ease-out]"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="idle-title"
        aria-describedby="idle-desc"
      >
        <div className="flex flex-col items-center text-center gap-4">
          <div className="p-3 bg-amber-500/10 rounded-full">
            <Clock className="w-8 h-8 text-amber-500" />
          </div>

          <h2 id="idle-title" className="text-lg font-bold text-foreground">
            Sessão prestes a expirar
          </h2>

          <p id="idle-desc" className="text-sm text-muted-foreground">
            Sua sessão expirará em{' '}
            <span className="font-bold text-amber-600 dark:text-amber-400 tabular-nums">
              {secondsLeft}s
            </span>
            . Deseja continuar?
          </p>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${(secondsLeft / 30) * 100}%` }}
            />
          </div>

          <button
            id="btn-continue-session"
            onClick={onContinue}
            className="w-full py-2.5 px-6 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 active:scale-[0.98] transition-all text-sm"
          >
            Continuar sessão
          </button>
        </div>
      </div>
    </div>
  );
};
