import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

export default function StaffConsultations() {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ student_id: '', diagnosis: '', treatment: '', prescription: '', notes: '' });

  const fetchData = async () => {
    const [c, p] = await Promise.all([
      supabase.from('consultations').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('user_id, full_name'),
    ]);
    if (c.data) setConsultations(c.data);
    if (p.data) setPatients(p.data);
  };

  useEffect(() => { fetchData(); }, []);

  const getPatientName = (id: string) => patients.find(p => p.user_id === id)?.full_name ?? 'Unknown';

  const handleCreate = async () => {
    if (!user) return;
    const { error } = await supabase.from('consultations').insert({
      student_id: form.student_id,
      staff_id: user.id,
      diagnosis: form.diagnosis,
      treatment: form.treatment,
      prescription: form.prescription,
      notes: form.notes,
    });
    if (error) { toast.error(error.message); return; }
    toast.success('Consultation recorded');
    setDialogOpen(false);
    setForm({ student_id: '', diagnosis: '', treatment: '', prescription: '', notes: '' });
    fetchData();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-display font-bold">Consultations</h1>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" />New Consultation</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>Record Consultation</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Patient</Label>
                  <select
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                    value={form.student_id}
                    onChange={e => setForm(f => ({ ...f, student_id: e.target.value }))}
                  >
                    <option value="">Select patient</option>
                    {patients.map(p => <option key={p.user_id} value={p.user_id}>{p.full_name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Diagnosis</Label>
                  <Input value={form.diagnosis} onChange={e => setForm(f => ({ ...f, diagnosis: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Treatment</Label>
                  <Textarea value={form.treatment} onChange={e => setForm(f => ({ ...f, treatment: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Prescription</Label>
                  <Input value={form.prescription} onChange={e => setForm(f => ({ ...f, prescription: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
                </div>
                <Button onClick={handleCreate} className="w-full">Save Consultation</Button>
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
                  <TableHead>Diagnosis</TableHead>
                  <TableHead>Treatment</TableHead>
                  <TableHead>Prescription</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {consultations.map(c => (
                  <TableRow key={c.id}>
                    <TableCell>{new Date(c.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{getPatientName(c.student_id)}</TableCell>
                    <TableCell>{c.diagnosis ?? '—'}</TableCell>
                    <TableCell className="max-w-xs truncate">{c.treatment ?? '—'}</TableCell>
                    <TableCell>{c.prescription ?? '—'}</TableCell>
                  </TableRow>
                ))}
                {consultations.length === 0 && (
                  <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No consultations</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
