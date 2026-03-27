import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, ClipboardPlus, Stethoscope, FlaskConical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ appointments: 0, reports: 0, visits: 0, labResults: 0 });

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const [a, r, v, l] = await Promise.all([
        supabase.from('appointments').select('id', { count: 'exact', head: true }).eq('student_id', user.id),
        supabase.from('illness_reports').select('id', { count: 'exact', head: true }).eq('student_id', user.id),
        supabase.from('consultations').select('id', { count: 'exact', head: true }).eq('student_id', user.id),
        supabase.from('lab_results').select('id', { count: 'exact', head: true }).eq('student_id', user.id),
      ]);
      setStats({
        appointments: a.count ?? 0,
        reports: r.count ?? 0,
        visits: v.count ?? 0,
        labResults: l.count ?? 0,
      });
    };
    fetch();
  }, [user]);

  const cards = [
    { title: 'My Appointments', value: stats.appointments, icon: <Calendar className="w-6 h-6" />, color: 'text-accent', path: '/student/appointments' },
    { title: 'Illness Reports', value: stats.reports, icon: <ClipboardPlus className="w-6 h-6" />, color: 'text-warning', path: '/student/report' },
    { title: 'My Visits', value: stats.visits, icon: <Stethoscope className="w-6 h-6" />, color: 'text-primary', path: '/student/visits' },
    { title: 'Lab Results', value: stats.labResults, icon: <FlaskConical className="w-6 h-6" />, color: 'text-success', path: '/student/lab-results' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">My Dashboard</h1>
          <p className="text-muted-foreground mt-1">Your health overview at a glance</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card) => (
            <Card
              key={card.title}
              className="shadow-card hover:shadow-elevated transition-shadow cursor-pointer"
              onClick={() => navigate(card.path)}
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{card.title}</p>
                    <p className="text-3xl font-bold font-display mt-1">{card.value}</p>
                  </div>
                  <div className={`${card.color} opacity-80`}>{card.icon}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
