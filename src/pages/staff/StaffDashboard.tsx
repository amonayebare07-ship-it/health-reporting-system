import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, FileText, Stethoscope } from 'lucide-react';

export default function StaffDashboard() {
  const [stats, setStats] = useState({ patients: 0, appointments: 0, reports: 0, consultations: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [patients, appointments, reports, consultations] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('appointments').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('illness_reports').select('id', { count: 'exact', head: true }).eq('status', 'reported'),
        supabase.from('consultations').select('id', { count: 'exact', head: true }),
      ]);
      setStats({
        patients: patients.count ?? 0,
        appointments: appointments.count ?? 0,
        reports: reports.count ?? 0,
        consultations: consultations.count ?? 0,
      });
    };
    fetchStats();
  }, []);

  const cards = [
    { title: 'Total Patients', value: stats.patients, icon: <Users className="w-6 h-6" />, color: 'text-primary' },
    { title: 'Pending Appointments', value: stats.appointments, icon: <Calendar className="w-6 h-6" />, color: 'text-accent' },
    { title: 'New Reports', value: stats.reports, icon: <FileText className="w-6 h-6" />, color: 'text-warning' },
    { title: 'Consultations', value: stats.consultations, icon: <Stethoscope className="w-6 h-6" />, color: 'text-success' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Staff Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of health center operations</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
