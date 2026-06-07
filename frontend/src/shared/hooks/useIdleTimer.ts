import { useEffect, useRef, useCallback, useState } from 'react';

/** Tempo de inatividade antes do aviso (ms) — 14min 30s */
const IDLE_TIMEOUT_MS = 14.5 * 60 * 1000;
/** Tempo de contagem regressiva do aviso até logout (ms) — 30s */
const WARNING_DURATION_MS = 30 * 1000;

interface UseIdleTimerOptions {
  /** Callback executado ao fim do período de inatividade (exibir modal). */
  onWarning: () => void;
  /** Callback executado quando o tempo do warning expira (logout). */
  onTimeout: () => void;
  /** Se true, o timer está ativo. */
  enabled?: boolean;
}

interface UseIdleTimerReturn {
  /** Reinicia o timer (chamada ao clicar "Continuar" no modal). */
  reset: () => void;
  /** Segundos restantes no aviso (0–30). Só relevante enquanto warning ativo. */
  warningSecondsLeft: number;
  /** Se o warning está ativo. */
  isWarning: boolean;
}

export function useIdleTimer({
  onWarning,
  onTimeout,
  enabled = true,
}: UseIdleTimerOptions): UseIdleTimerReturn {
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [isWarning, setIsWarning] = useState(false);
  const [warningSecondsLeft, setWarningSecondsLeft] = useState(30);

  // Refs for callbacks to avoid re-registering event listeners
  const onWarningRef = useRef(onWarning);
  const onTimeoutRef = useRef(onTimeout);
  onWarningRef.current = onWarning;
  onTimeoutRef.current = onTimeout;

  const clearAllTimers = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    idleTimerRef.current = null;
    warningTimerRef.current = null;
    countdownRef.current = null;
  }, []);

  const startIdleTimer = useCallback(() => {
    clearAllTimers();
    setIsWarning(false);
    setWarningSecondsLeft(30);

    idleTimerRef.current = setTimeout(() => {
      // Idle period expired → show warning
      setIsWarning(true);
      setWarningSecondsLeft(30);
      onWarningRef.current();

      // Start countdown
      let remaining = 30;
      countdownRef.current = setInterval(() => {
        remaining -= 1;
        setWarningSecondsLeft(remaining);
        if (remaining <= 0) {
          clearAllTimers();
          onTimeoutRef.current();
        }
      }, 1000);

      // Fallback: hard timeout after WARNING_DURATION_MS
      warningTimerRef.current = setTimeout(() => {
        clearAllTimers();
        onTimeoutRef.current();
      }, WARNING_DURATION_MS);
    }, IDLE_TIMEOUT_MS);
  }, [clearAllTimers]);

  const reset = useCallback(() => {
    if (enabled) {
      startIdleTimer();
    }
  }, [enabled, startIdleTimer]);

  // Register user interaction listeners
  useEffect(() => {
    if (!enabled) {
      clearAllTimers();
      return;
    }

    const events: (keyof WindowEventMap)[] = ['mousedown', 'keydown', 'scroll', 'touchstart'];

    const handleActivity = () => {
      // Only reset if NOT in warning phase (user must click "Continue" during warning)
      if (!isWarning) {
        startIdleTimer();
      }
    };

    events.forEach((event) => window.addEventListener(event, handleActivity, { passive: true }));

    // Start the initial timer
    startIdleTimer();

    return () => {
      events.forEach((event) => window.removeEventListener(event, handleActivity));
      clearAllTimers();
    };
  }, [enabled, isWarning, startIdleTimer, clearAllTimers]);

  return { reset, warningSecondsLeft, isWarning };
}
