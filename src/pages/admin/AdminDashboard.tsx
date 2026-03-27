import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, Calendar, Stethoscope, ShieldCheck } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { format, subDays, isSameDay } from 'date-fns';

const COLORS = ['#0ea5e9', '#8b5cf6', '#f43f5e', '#10b981', '#f59e0b'];

export default function AdminDashboard() {
  const [stats, setStats] = useState({ students: 0, staff: 0, reports: 0, appointments: 0, consultations: 0 });
  const [roleData, setRoleData] = useState<any[]>([]);
  const [severityData, setSeverityData] = useState<any[]>([]);
  const [activityData, setActivityData] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const [rolesRes, reportsRes, appointmentsRes, consultationsRes] = await Promise.all([
        supabase.from('user_roles').select('role'),
        supabase.from('illness_reports').select('id, severity, created_at'),
        supabase.from('appointments').select('id, created_at'),
        supabase.from('consultations').select('id', { count: 'exact', head: true }),
      ]);

      const roles = rolesRes.data || [];
      const reports = reportsRes.data || [];
      const appointments = appointmentsRes.data || [];

      // Basic stats
      const studentCount = roles.filter(r => r.role === 'student').length;
      const staffCount = roles.filter(r => r.role === 'staff').length;

      setStats({
        students: studentCount,
        staff: staffCount,
        reports: reports.length,
        appointments: appointments.length,
        consultations: consultationsRes.count ?? 0,
      });

      // Role Pie Chart Data
      setRoleData([
        { name: 'Students', value: studentCount },
        { name: 'Staff', value: staffCount },
        { name: 'Admins', value: roles.filter(r => r.role === 'admin').length }
      ].filter(d => d.value > 0));

      // Severity Bar Chart Data
      const mild = reports.filter(r => r.severity === 'mild').length;
      const moderate = reports.filter(r => r.severity === 'moderate').length;
      const severe = reports.filter(r => r.severity === 'severe').length;
      
      setSeverityData([
        { severity: 'Mild', count: mild },
        { severity: 'Moderate', count: moderate },
        { severity: 'Severe', count: severe }
      ]);

      // Activity Line Chart Data (Last 7 Days)
      const last7Days = Array.from({ length: 7 }).map((_, i) => subDays(new Date(), 6 - i)).reverse();
      
      const activity = last7Days.map(date => {
        const dayReports = reports.filter(r => isSameDay(new Date(r.created_at), date)).length;
        const dayAppts = appointments.filter(a => isSameDay(new Date(a.created_at), date)).length;
        return {
          date: format(date, 'MMM dd'),
          Reports: dayReports,
          Appointments: dayAppts
        };
      });
      
      setActivityData(activity);
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
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">System overview and management metrics</p>
        </div>

        {/* Top Metric Cards */}
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

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Activity Line Chart */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">System Activity (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={activityData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend />
                    <Line type="monotone" dataKey="Reports" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="Appointments" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Severity Bar Chart */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Illness Severity Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={severityData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="severity" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={60}>
                      {severityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.severity === 'Severe' ? '#ef4444' : entry.severity === 'Moderate' ? '#f59e0b' : '#10b981'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* User Roles Pie Chart */}
          <Card className="shadow-card lg:col-span-2">
             <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">User Role Distribution</CardTitle>
             </CardHeader>
             <CardContent className="flex justify-center">
                <div className="h-72 w-full max-w-md">
                   <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                       <Pie 
                         data={roleData} 
                         cx="50%" 
                         cy="50%" 
                         innerRadius={60} 
                         outerRadius={90} 
                         paddingAngle={5} 
                         dataKey="value"
                       >
                         {roleData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                         ))}
                       </Pie>
                       <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                       <Legend verticalAlign="bottom" height={36}/>
                     </PieChart>
                  </ResponsiveContainer>
                </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
