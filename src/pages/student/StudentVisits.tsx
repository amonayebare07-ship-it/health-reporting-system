import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function StudentVisits() {
  const { user } = useAuth();
  const [visits, setVisits] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from('consultations').select('*').eq('student_id', user.id).order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setVisits(data); });
  }, [user]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-display font-bold">My Visits</h1>
        <Card className="shadow-card">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Diagnosis</TableHead>
                  <TableHead>Treatment</TableHead>
                  <TableHead>Prescription</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visits.map(v => (
                  <TableRow key={v.id}>
                    <TableCell>{new Date(v.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{v.diagnosis ?? '—'}</TableCell>
                    <TableCell>{v.treatment ?? '—'}</TableCell>
                    <TableCell>{v.prescription ?? '—'}</TableCell>
                    <TableCell className="max-w-xs truncate">{v.notes ?? '—'}</TableCell>
                  </TableRow>
                ))}
                {visits.length === 0 && (
                  <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No visits yet</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
