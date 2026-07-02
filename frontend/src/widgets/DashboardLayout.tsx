import React, { useState, useCallback, useEffect } from "react";
import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";
import { useTheme } from "@/app/providers/ThemeProvider";
import { useIdleTimer } from "@/shared/hooks/useIdleTimer";
import { IdleTimerModal } from "@/shared/components/IdleTimerModal";
import {
  notificationsApi,
  type NotificationDto,
} from "@/shared/api/notifications";
import {
  LayoutDashboard,
  ClipboardList,
  BookOpen,
  CalendarCheck,
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
  Eye,
  Bell,
  History,
  Shield,
  BarChart2,
} from "lucide-react";

// --- Nav items per role ---

interface NavItem {
  label: string;
  icon: React.FC<{ className?: string }>;
  to: string;
  active: boolean; // only Dashboard is active for now
}

const adminNav: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard", active: true },
  // { label: 'Formulários', icon: FileText, to: '/forms', active: true }, // INATIVADO TEMPORARIAMENTE
  { label: "Cadastros", icon: ClipboardList, to: "/students", active: true },
  { label: "Turmas", icon: BookOpen, to: "/classes", active: true },
  {
    label: "Registro de Presença",
    icon: CalendarCheck,
    to: "/attendance",
    active: true,
  },
  { label: "Instrutores", icon: Shield, to: "/instructors", active: true },
  { label: "Relatórios", icon: BarChart2, to: "/reports", active: true },
  { label: "Histórico", icon: History, to: "/history", active: true },
];

const volunteerNav: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard", active: true },
  // { label: 'Formulários', icon: FileText, to: '/forms', active: true }, // INATIVADO TEMPORARIAMENTE
  {
    label: "Registro de Presença",
    icon: CalendarCheck,
    to: "/attendance",
    active: true,
  },
  { label: "Turmas", icon: BookOpen, to: "/classes", active: true },
  { label: "Histórico", icon: History, to: "/history", active: true },
];

export const DashboardLayout: React.FC = () => {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showIdleModal, setShowIdleModal] = useState(false);
  const [notifications, setNotifications] = useState<NotificationDto[]>([]);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await notificationsApi.getAll();
      setNotifications(data);
    } catch {
      // API de notificações ainda não implementada no backend — exibe estado vazio
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user, fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
    } catch {
      // API de notificações ainda não implementada
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unread = notifications.filter((n) => !n.isRead);
      await Promise.all(unread.map((n) => notificationsApi.markAsRead(n.id)));
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {
      // API de notificações ainda não implementada
    }
  };

  const navItems = user?.role === "admin" ? adminNav : volunteerNav;

  // --- Idle timer ---
  const handleWarning = useCallback(() => {
    setShowIdleModal(true);
  }, []);

  const handleTimeout = useCallback(() => {
    setShowIdleModal(false);
    signOut();
    navigate("/login?expired=true", { replace: true });
  }, [signOut, navigate]);

  const { reset, warningSecondsLeft } = useIdleTimer({
    onWarning: handleWarning,
    onTimeout: handleTimeout,
    enabled: true,
  });

  const handleContinueSession = useCallback(() => {
    setShowIdleModal(false);
    reset();
  }, [reset]);

  // --- Logout ---
  const handleLogout = useCallback(() => {
    signOut();
    navigate("/login", { replace: true });
  }, [signOut, navigate]);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        id="sidebar"
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border/50 shadow-lg
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:shadow-none
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Brand */}
          <div className="flex items-center justify-between px-5 py-5 border-b border-border/30">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                className="w-9 h-9 rounded-xl shadow-sm"
                alt="Auta de Sousa"
              />
              <div>
                <span className="text-base font-bold text-foreground tracking-tight">
                  Auta de Sousa
                </span>
                <p className="text-[10px] text-muted-foreground leading-tight">
                  Gestão de Impacto Social
                </p>
              </div>
            </div>
            <button
              className="lg:hidden p-1 rounded-lg hover:bg-muted/50 text-muted-foreground"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              if (!item.active) {
                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground/60 cursor-not-allowed select-none"
                    title="Em breve"
                  >
                    <Icon className="w-4.5 h-4.5" />
                    <span>{item.label}</span>
                    <span className="ml-auto text-[10px] bg-muted/60 text-muted-foreground/50 px-1.5 py-0.5 rounded-full font-medium">
                      Em breve
                    </span>
                  </div>
                );
              }
              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    }`
                  }
                >
                  <Icon className="w-4.5 h-4.5" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Sidebar footer — user info */}
          <div className="border-t border-border/30 px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.name}
                </p>
                <p className="text-[11px] text-muted-foreground truncate capitalize">
                  {user?.role}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-card/80 backdrop-blur-lg border-b border-border/40 px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                id="btn-toggle-sidebar"
                className="lg:hidden p-2 rounded-lg hover:bg-muted/50 text-muted-foreground"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-base sm:text-lg font-semibold text-foreground">
                Olá,{" "}
                <span className="text-primary">{user?.name || "Usuário"}</span>!
              </h1>
            </div>

            <div className="flex items-center gap-2">
              {/* Notifications Bell */}
              <div className="relative">
                <button
                  id="btn-notifications-toggle"
                  onClick={() => setPopoverOpen(!popoverOpen)}
                  className="p-2 rounded-lg border border-border hover:bg-muted/50 text-foreground transition-colors relative"
                  title="Notificações"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {popoverOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setPopoverOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-80 bg-card rounded-xl border border-border shadow-xl z-40 max-h-96 overflow-y-auto">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                        <span className="font-semibold text-sm">
                          Notificações
                        </span>
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllAsRead}
                            className="text-xs text-primary hover:underline font-medium"
                          >
                            Ler todas
                          </button>
                        )}
                      </div>
                      <div className="divide-y divide-border/50">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center text-sm text-muted-foreground">
                            Nenhuma notificação por aqui.
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n.id}
                              onClick={() => handleMarkAsRead(n.id)}
                              className={`p-4 transition-colors cursor-pointer hover:bg-muted/30 flex gap-3 ${
                                !n.isRead ? "bg-primary/5" : ""
                              }`}
                            >
                              <div className="flex-1 min-w-0">
                                <p
                                  className={`text-xs font-semibold ${!n.isRead ? "text-foreground" : "text-muted-foreground"}`}
                                >
                                  {n.title}
                                </p>
                                <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-3 leading-normal">
                                  {n.message}
                                </p>
                                <p className="text-[9px] text-muted-foreground/60 mt-1">
                                  {new Date(n.createdAt).toLocaleDateString(
                                    "pt-BR",
                                  )}{" "}
                                  às{" "}
                                  {new Date(n.createdAt).toLocaleTimeString(
                                    [],
                                    { hour: "2-digit", minute: "2-digit" },
                                  )}
                                </p>
                              </div>
                              {!n.isRead && (
                                <span className="h-2 w-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* High contrast */}
              <button
                id="btn-high-contrast"
                onClick={() =>
                  setTheme(
                    theme === "high-contrast" ? "light" : "high-contrast",
                  )
                }
                className="p-2 rounded-lg border border-border hover:bg-muted/50 text-foreground transition-colors"
                title="Alternar Alto Contraste"
              >
                <Eye className="w-4 h-4" />
              </button>

              {/* Dark mode */}
              <button
                id="btn-theme-toggle"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-lg border border-border hover:bg-muted/50 text-foreground transition-colors"
                title="Alternar Tema Escuro"
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>

              {/* Logout */}
              <button
                id="btn-logout"
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors text-sm font-medium"
                title="Sair do sistema"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Idle timer modal */}
      <IdleTimerModal
        open={showIdleModal}
        secondsLeft={warningSecondsLeft}
        onContinue={handleContinueSession}
      />
    </div>
  );
};
