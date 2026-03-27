import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  Heart, LayoutDashboard, Users, Calendar, FileText,
  FlaskConical, UserCircle, LogOut, ClipboardPlus, Stethoscope, Menu, X
} from 'lucide-react';
import { useState } from 'react';

interface NavItem {
  label: string;
  path: string;
  icon: ReactNode;
}

const adminNav: NavItem[] = [
  { label: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'Students', path: '/admin/students', icon: <Users className="w-5 h-5" /> },
  { label: 'Staff', path: '/admin/staff', icon: <UserCircle className="w-5 h-5" /> },
  { label: 'Illness Reports', path: '/admin/reports', icon: <FileText className="w-5 h-5" /> },
];

const staffNav: NavItem[] = [
  { label: 'Dashboard', path: '/staff', icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'Patients', path: '/staff/patients', icon: <Users className="w-5 h-5" /> },
  { label: 'Appointments', path: '/staff/appointments', icon: <Calendar className="w-5 h-5" /> },
  { label: 'Illness Reports', path: '/staff/reports', icon: <FileText className="w-5 h-5" /> },
  { label: 'Consultations', path: '/staff/consultations', icon: <Stethoscope className="w-5 h-5" /> },
  { label: 'Lab Results', path: '/staff/lab-results', icon: <FlaskConical className="w-5 h-5" /> },
];

const studentNav: NavItem[] = [
  { label: 'Dashboard', path: '/student', icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'Report Illness', path: '/student/report', icon: <ClipboardPlus className="w-5 h-5" /> },
  { label: 'My Visits', path: '/student/visits', icon: <Stethoscope className="w-5 h-5" /> },
  { label: 'Appointments', path: '/student/appointments', icon: <Calendar className="w-5 h-5" /> },
  { label: 'Lab Results', path: '/student/lab-results', icon: <FlaskConical className="w-5 h-5" /> },
  { label: 'Profile', path: '/student/profile', icon: <UserCircle className="w-5 h-5" /> },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { role, user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = role === 'admin' ? adminNav : role === 'student' ? studentNav : staffNav;

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground flex flex-col transition-transform lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
          <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
            <Heart className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-lg">CampusHealth</span>
        </div>
        
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => { navigate(item.path); setMobileOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-sidebar-accent text-sidebar-primary'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-sidebar-border space-y-2">
          <div className="px-3 py-2">
            <p className="text-xs text-sidebar-foreground/50 truncate">{user?.email}</p>
            <p className="text-xs font-medium text-sidebar-primary capitalize">{role}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-foreground/20 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-card border-b border-border">
          <button onClick={() => setMobileOpen(true)}>
            <Menu className="w-6 h-6 text-foreground" />
          </button>
          <span className="font-display font-bold text-foreground">CampusHealth</span>
          <div className="w-6" />
        </header>

        <main className="p-6 lg:p-8 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
