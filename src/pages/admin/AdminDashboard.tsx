import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Users, FileText, Calendar, Stethoscope, ShieldCheck, UserPlus } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ students: 0, staff: 0, reports: 0, appointments: 0, consultations: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [students, staff, reports, appointments, consultations] = await Promise.all([
        supabase.from('user_roles').select('id', { count: 'exact', head: true }).eq('role', 'student'),
        supabase.from('user_roles').select('id', { count: 'exact', head: true }).eq('role', 'staff'),
        supabase.from('illness_reports').select('id', { count: 'exact', head: true }),
        supabase.from('appointments').select('id', { count: 'exact', head: true }),
        supabase.from('consultations').select('id', { count: 'exact', head: true }),
      ]);
      setStats({
        students: students.count ?? 0,
        staff: staff.count ?? 0,
        reports: reports.count ?? 0,
        appointments: appointments.count ?? 0,
        consultations: consultations.count ?? 0,
      });
    };
    fetchStats();
  }, []);

  const cards = [
    { title: 'Students', value: stats.students, icon: <Users className="w-6 h-6" />, color: 'text-primary' },
    { title: 'Staff Members', value: stats.staff, icon: <ShieldCheck className="w-6 h-6" />, color: 'text-accent' },
    { title: 'Illness Reports', value: stats.reports, icon: <FileText className="w-6 h-6" />, color: 'text-warning' },
    { title: 'Appointments', value: stats.appointments, icon: <Calendar className="w-6 h-6" />, color: 'text-success' },
    { title: 'Consultations', value: stats.consultations, icon: <Stethoscope className="w-6 h-6" />, color: 'text-primary' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">System overview and management</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {cards.map((card) => (
            <Card key={card.title} className="shadow-card hover:shadow-elevated transition-shadow">
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
