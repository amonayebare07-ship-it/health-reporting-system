import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';

interface Report {
  id: string;
  symptoms: string;
  description: string | null;
  severity: string;
  onset_date: string;
  status: string;
  staff_notes: string | null;
  student_id: string;
}

export default function StaffReports() {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [notes, setNotes] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchReports = async () => {
    const { data } = await supabase.from('illness_reports').select('*').order('created_at', { ascending: false });
    if (data) setReports(data);
  };

  useEffect(() => { fetchReports(); }, []);

  const reviewReport = async () => {
    if (!selectedReport || !user) return;
    await supabase.from('illness_reports').update({
      status: 'reviewed',
      staff_notes: notes,
      reviewed_by: user.id
    }).eq('id', selectedReport.id);
    toast.success('Report reviewed');
    setDialogOpen(false);
    setNotes('');
    fetchReports();
  };

  const severityColor = (s: string) => {
    if (s === 'severe') return 'bg-destructive/10 text-destructive border-destructive/20';
    if (s === 'moderate') return 'bg-warning/10 text-warning border-warning/20';
    return 'bg-success/10 text-success border-success/20';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-display font-bold">Illness Reports</h1>
        <Card className="shadow-card">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Symptoms</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map(r => (
                  <TableRow key={r.id}>
                    <TableCell>{r.onset_date}</TableCell>
                    <TableCell className="max-w-xs truncate">{r.symptoms}</TableCell>
                    <TableCell><Badge variant="outline" className={severityColor(r.severity)}>{r.severity}</Badge></TableCell>
                    <TableCell><Badge variant="outline">{r.status}</Badge></TableCell>
                    <TableCell>
                      {r.status === 'reported' && (
                        <Dialog open={dialogOpen && selectedReport?.id === r.id} onOpenChange={(open) => { setDialogOpen(open); if (open) setSelectedReport(r); }}>
                          <DialogTrigger asChild>
                            <Button size="sm">Review</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader><DialogTitle>Review Illness Report</DialogTitle></DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <p className="text-sm text-muted-foreground">Symptoms</p>
                                <p className="font-medium">{r.symptoms}</p>
                              </div>
                              {r.description && (
                                <div>
                                  <p className="text-sm text-muted-foreground">Description</p>
                                  <p>{r.description}</p>
                                </div>
                              )}
                              <div className="space-y-2">
                                <Label>Staff Notes</Label>
                                <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Add your review notes..." />
                              </div>
                              <Button onClick={reviewReport} className="w-full">Mark as Reviewed</Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {reports.length === 0 && (
                  <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No reports</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
