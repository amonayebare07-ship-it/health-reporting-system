import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

export default function StaffLabResults() {
  const { user } = useAuth();
  const [results, setResults] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ student_id: '', test_name: '', result: '', reference_range: '', status: 'pending', notes: '' });

  const fetchData = async () => {
    const [r, p] = await Promise.all([
      supabase.from('lab_results').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('user_id, full_name'),
    ]);
    if (r.data) setResults(r.data);
    if (p.data) setPatients(p.data);
  };

  useEffect(() => { fetchData(); }, []);

  const getPatientName = (id: string) => patients.find(p => p.user_id === id)?.full_name ?? 'Unknown';

  const handleCreate = async () => {
    if (!user) return;
    const { error } = await supabase.from('lab_results').insert({
      student_id: form.student_id,
      test_name: form.test_name,
      result: form.result,
      reference_range: form.reference_range,
      status: form.status,
      notes: form.notes,
      ordered_by: user.id,
    });
    if (error) { toast.error(error.message); return; }
    toast.success('Lab result added');
    setDialogOpen(false);
    setForm({ student_id: '', test_name: '', result: '', reference_range: '', status: 'pending', notes: '' });
    fetchData();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-display font-bold">Lab Results</h1>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" />Add Result</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Lab Result</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Patient</Label>
                  <select className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={form.student_id} onChange={e => setForm(f => ({ ...f, student_id: e.target.value }))}>
                    <option value="">Select patient</option>
                    {patients.map(p => <option key={p.user_id} value={p.user_id}>{p.full_name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Test Name</Label>
                  <Input value={form.test_name} onChange={e => setForm(f => ({ ...f, test_name: e.target.value }))} placeholder="e.g. Blood Count" />
                </div>
                <div className="space-y-2">
                  <Label>Result</Label>
                  <Input value={form.result} onChange={e => setForm(f => ({ ...f, result: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Reference Range</Label>
                  <Input value={form.reference_range} onChange={e => setForm(f => ({ ...f, reference_range: e.target.value }))} placeholder="e.g. 4.5-11.0" />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <select className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <Button onClick={handleCreate} className="w-full">Save Result</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <Card className="shadow-card">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Test</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map(r => (
                  <TableRow key={r.id}>
                    <TableCell>{new Date(r.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{getPatientName(r.student_id)}</TableCell>
                    <TableCell>{r.test_name}</TableCell>
                    <TableCell>{r.result}</TableCell>
                    <TableCell>{r.reference_range ?? '—'}</TableCell>
                    <TableCell><Badge variant="outline">{r.status}</Badge></TableCell>
                  </TableRow>
                ))}
                {results.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No lab results</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
