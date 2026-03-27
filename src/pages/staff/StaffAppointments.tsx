import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

interface Appointment {
  id: string;
  date: string;
  time: string;
  reason: string;
  status: string;
  student_id: string;
  notes: string | null;
}

export default function StaffAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const fetchAppointments = async () => {
    const { data } = await supabase.from('appointments').select('*').order('date', { ascending: false });
    if (data) setAppointments(data);
  };

  useEffect(() => { fetchAppointments(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('appointments').update({ status }).eq('id', id);
    toast.success(`Appointment ${status}`);
    fetchAppointments();
  };

  const statusColor = (s: string) => {
    if (s === 'confirmed') return 'bg-success/10 text-success border-success/20';
    if (s === 'cancelled') return 'bg-destructive/10 text-destructive border-destructive/20';
    return 'bg-warning/10 text-warning border-warning/20';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-display font-bold">Appointments</h1>
        <Card className="shadow-card">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map(a => (
                  <TableRow key={a.id}>
                    <TableCell>{a.date}</TableCell>
                    <TableCell>{a.time}</TableCell>
                    <TableCell>{a.reason}</TableCell>
                    <TableCell><Badge variant="outline" className={statusColor(a.status)}>{a.status}</Badge></TableCell>
                    <TableCell className="space-x-2">
                      {a.status === 'pending' && (
                        <>
                          <Button size="sm" onClick={() => updateStatus(a.id, 'confirmed')}>Confirm</Button>
                          <Button size="sm" variant="outline" onClick={() => updateStatus(a.id, 'cancelled')}>Cancel</Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {appointments.length === 0 && (
                  <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No appointments</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
