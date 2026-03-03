import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, CalendarDays, Users, FileText, MessageSquare,
  UserCircle, Menu, X, ArrowLeftRight, Building2, Wifi
} from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
  mode: 'manager' | 'member';
  onModeSwitch: () => void;
}

const managerLinks = [
  { to: '/manager', icon: LayoutDashboard, label: 'Tableau de bord' },
  { to: '/manager/reservations', icon: CalendarDays, label: 'Réservations' },
  { to: '/manager/membres', icon: Users, label: 'Membres' },
  { to: '/manager/facturation', icon: FileText, label: 'Facturation' },
];

const memberLinks = [
  { to: '/member/feed', icon: MessageSquare, label: 'Le Réseau Social Nomad' },
  { to: '/member/annuaire', icon: Users, label: 'Annuaire' },
  { to: '/member/reservations', icon: CalendarDays, label: 'Réservations' },
  { to: '/member/profil', icon: UserCircle, label: 'Mon Profil' },
];

export default function AppLayout({ children, mode, onModeSwitch }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const links = mode === 'manager' ? managerLinks : memberLinks;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Mobile header */}
      <header className="lg:hidden flex items-center justify-between px-4 py-3 gradient-primary">
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="text-primary-foreground">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-secondary" />
            <span className="font-display text-primary-foreground font-semibold text-lg">L'Espace Nomad</span>
          </div>
        </div>
        <button
          onClick={onModeSwitch}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-sidebar-accent text-sidebar-accent-foreground"
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          {mode === 'manager' ? 'Membre' : 'Gérante'}
        </button>
      </header>

      {/* Sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/40 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-50 w-72 gradient-primary flex flex-col
          transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between p-5 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
              <Building2 className="w-5 h-5 text-secondary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-sidebar-foreground font-bold text-lg leading-tight">L'Espace Nomad</h1>
              <p className="text-xs text-sidebar-foreground/60">
                {mode === 'manager' ? 'Interface Gérante' : 'Espace Membre'}
              </p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-sidebar-foreground/60">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {links.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-lg shadow-sidebar-muted/30'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                  }
                `}
              >
                <link.icon className={`w-5 h-5 ${isActive ? 'text-secondary' : ''}`} />
                {link.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <button
            onClick={() => { onModeSwitch(); setSidebarOpen(false); }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium bg-secondary text-secondary-foreground hover:opacity-90 transition-opacity"
          >
            <ArrowLeftRight className="w-4 h-4" />
            Basculer en mode {mode === 'manager' ? 'Membre' : 'Gérante'}
          </button>

          {/* Online indicator */}
          <div className="mt-3 flex items-center gap-2 px-4 py-2 text-xs text-sidebar-foreground/60">
            <Wifi className="w-3.5 h-3.5 text-success animate-pulse-soft" />
            <span>5 membres en ligne</span>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-h-screen overflow-auto">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
