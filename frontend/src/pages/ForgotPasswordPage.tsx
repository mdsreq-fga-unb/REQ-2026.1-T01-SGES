import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';
import { Layers, Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Informe seu e-mail.');
      return;
    }

    setLoading(true);
    try {
      await requestPasswordReset(email);
      setSent(true);
    } catch {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="p-4 bg-primary/10 rounded-2xl mb-4">
            <Layers className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Recuperar Senha</h1>
        </div>

        {/* Card */}
        <div className="bg-card border border-border/50 rounded-2xl shadow-xl p-8">
          {sent ? (
            /* Success state */
            <div className="flex flex-col items-center text-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-full">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Verifique seu e-mail</h2>
              <p className="text-sm text-muted-foreground">
                Se o e-mail existir, um link de recuperação será enviado.
              </p>
              <Link
                to="/login"
                className="mt-2 w-full py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 active:scale-[0.98] transition-all text-sm text-center block"
              >
                Voltar ao login
              </Link>
            </div>
          ) : (
            /* Form state */
            <>
              <p className="text-sm text-muted-foreground mb-6">
                Informe o e-mail cadastrado e enviaremos um link para redefinir sua senha.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div
                    className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-sm text-destructive font-medium"
                    role="alert"
                  >
                    {error}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label htmlFor="forgot-email" className="text-sm font-medium text-foreground">
                    E-mail
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      id="forgot-email"
                      type="email"
                      autoComplete="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
                    />
                  </div>
                </div>

                <button
                  id="btn-send-recovery"
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 active:scale-[0.98] transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Mail className="w-4 h-4" />
                  )}
                  {loading ? 'Enviando...' : 'Enviar link de recuperação'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  to="/login"
                  className="text-sm text-primary hover:underline font-medium inline-flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Voltar ao login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
