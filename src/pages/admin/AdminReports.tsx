import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Report {
  id: string;
  symptoms: string;
  description: string | null;
  severity: string;
  onset_date: string;
  status: string;
  staff_notes: string | null;
  student_id: string;
  created_at: string;
}

export default function AdminReports() {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    supabase.from('illness_reports').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setReports(data);
    });
  }, []);

  const severityColor = (s: string) => {
    if (s === 'severe') return 'bg-destructive/10 text-destructive border-destructive/20';
    if (s === 'moderate') return 'bg-warning/10 text-warning border-warning/20';
    return 'bg-success/10 text-success border-success/20';
  };

  const statusColor = (s: string) => {
    if (s === 'reviewed') return 'bg-success/10 text-success border-success/20';
    return 'bg-warning/10 text-warning border-warning/20';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-display font-bold text-foreground">All Illness Reports</h1>
        <Card className="shadow-card">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Symptoms</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Staff Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map(r => (
                  <TableRow key={r.id}>
                    <TableCell>{r.onset_date}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{r.symptoms}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{r.description ?? '—'}</TableCell>
                    <TableCell><Badge variant="outline" className={severityColor(r.severity)}>{r.severity}</Badge></TableCell>
                    <TableCell><Badge variant="outline" className={statusColor(r.status)}>{r.status}</Badge></TableCell>
                    <TableCell className="max-w-[200px] truncate">{r.staff_notes ?? '—'}</TableCell>
                  </TableRow>
                ))}
                {reports.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No reports</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
