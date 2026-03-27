import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function StudentReportIllness() {
  const { user } = useAuth();
  const [form, setForm] = useState({ symptoms: '', description: '', severity: 'mild', onset_date: '', location: '' });
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState<any[]>([]);

  const fetchReports = async () => {
    if (!user) return;
    const { data } = await supabase.from('illness_reports').select('*').eq('student_id', user.id).order('created_at', { ascending: false });
    if (data) setReports(data);
  };

  useEffect(() => {
    fetchReports();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    const fullDescription = form.location ? `Location: ${form.location}\n\n${form.description}` : form.description;
    const { error } = await supabase.from('illness_reports').insert({
      student_id: user.id,
      symptoms: form.symptoms,
      description: fullDescription,
      severity: form.severity,
      onset_date: form.onset_date,
    });
    if (error) { toast.error(error.message); }
    else {
      toast.success('Illness report submitted');
      setForm({ symptoms: '', description: '', severity: 'mild', onset_date: '', location: '' });
      fetchReports();
    }
    setLoading(false);
  };

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
      <div className="max-w-4xl space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold">Report Illness</h1>
          <p className="text-muted-foreground mt-1">Submit a new health report to the clinic</p>
        </div>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Symptoms</Label>
                <Input value={form.symptoms} onChange={e => setForm(f => ({ ...f, symptoms: e.target.value }))} required placeholder="e.g. Headache, fever, cough" />
              </div>
              <div className="space-y-2">
                <Label>Current Location</Label>
                <Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} required placeholder="e.g. Hostels, Block A, Room 12" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe how you're feeling..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Severity</Label>
                  <select className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={form.severity} onChange={e => setForm(f => ({ ...f, severity: e.target.value }))}>
                    <option value="mild">Mild</option>
                    <option value="moderate">Moderate</option>
                    <option value="severe">Severe</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Onset Date</Label>
                  <Input type="date" value={form.onset_date} onChange={e => setForm(f => ({ ...f, onset_date: e.target.value }))} required />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Report'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="pt-4">
          <h2 className="text-2xl font-display font-bold mb-4">My Past Reports</h2>
          <Card className="shadow-card">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Symptoms</TableHead>
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
                      <TableCell><Badge variant="outline" className={severityColor(r.severity)}>{r.severity}</Badge></TableCell>
                      <TableCell><Badge variant="outline" className={statusColor(r.status)}>{r.status}</Badge></TableCell>
                      <TableCell className="max-w-[250px] truncate">{r.staff_notes ?? '—'}</TableCell>
                    </TableRow>
                  ))}
                  {reports.length === 0 && (
                    <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No reports submitted yet</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
