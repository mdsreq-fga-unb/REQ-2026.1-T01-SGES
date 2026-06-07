import React from 'react';
import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  /** Tamanho do spinner em pixels */
  size?: number;
  /** Texto de carregamento exibido abaixo do spinner */
  label?: string;
  /** Se true, centraliza em tela cheia */
  fullScreen?: boolean;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 32,
  label = 'Carregando...',
  fullScreen = false,
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2
        className="animate-spin text-primary"
        style={{ width: size, height: size }}
      />
      {label && (
        <span className="text-sm text-muted-foreground font-medium">{label}</span>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
};
