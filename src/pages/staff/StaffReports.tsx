import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Trash2, PenSquare } from 'lucide-react';

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
  student_name?: string;
}

export default function StaffReports() {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [referral, setReferral] = useState('None');

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({ symptoms: '', description: '', severity: '', status: '', staff_notes: '' });
  const [editReferral, setEditReferral] = useState('None');

  const fetchReports = async () => {
    const { data } = await supabase.from('illness_reports').select('*').order('created_at', { ascending: false });
    if (!data) return;

    if (data.length === 0) {
      setReports([]);
      return;
    }

    const studentIds = [...new Set(data.map(r => r.student_id))];
    const { data: profiles } = await supabase.from('profiles').select('user_id, full_name').in('user_id', studentIds);
    const profilesMap = Object.fromEntries(profiles?.map(p => [p.user_id, p.full_name]) || []);

    const reportsWithNames = data.map(r => ({
      ...r,
      student_name: profilesMap[r.student_id] || 'Unknown Student'
    }));

    setReports(reportsWithNames as Report[]);
  };

  useEffect(() => { fetchReports(); }, []);

  const openReviewDialog = (report: Report) => {
    setSelectedReport(report);
    setNotes(report.staff_notes || '');
    setReferral('None');
    setReviewDialogOpen(true);
  };

  const reviewReport = async () => {
    if (!selectedReport || !user) return;
    
    let finalNotes = notes;
    if (referral !== 'None') {
      finalNotes = `[REFERRAL: ${referral}]\n\n${notes}`;
    }
    
    await supabase.from('illness_reports').update({
      status: 'reviewed',
      staff_notes: finalNotes,
      reviewed_by: user.id
    }).eq('id', selectedReport.id);
    toast.success('Report reviewed');
    setReviewDialogOpen(false);
    setNotes('');
    setReferral('None');
    fetchReports();
  };

  const openEditDialog = (report: Report) => {
    setSelectedReport(report);
    let currentNotes = report.staff_notes || '';
    let currReferral = 'None';
    const match = currentNotes.match(/^\[REFERRAL:\s*(.*?)\]\n\n/);
    if (match) {
      currReferral = match[1];
      currentNotes = currentNotes.replace(match[0], '');
    }
    setEditReferral(currReferral);
    setEditForm({
      symptoms: report.symptoms,
      description: report.description || '',
      severity: report.severity,
      status: report.status,
      staff_notes: currentNotes
    });
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!selectedReport) return;
    
    const finalNotes = editReferral !== 'None' 
      ? `[REFERRAL: ${editReferral}]\n\n${editForm.staff_notes}` 
      : editForm.staff_notes;
      
    const { error } = await supabase.from('illness_reports').update({
      symptoms: editForm.symptoms,
      description: editForm.description,
      severity: editForm.severity,
      status: editForm.status,
      staff_notes: finalNotes
    }).eq('id', selectedReport.id);
    
    if (error) toast.error(error.message);
    else {
      toast.success('Report updated successfully');
      setEditDialogOpen(false);
      fetchReports();
    }
  };

  const deleteReport = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;
    const { error } = await supabase.from('illness_reports').delete().eq('id', id);
    if (error) toast.error(error.message);
    else {
      toast.success('Report deleted successfully');
      fetchReports();
    }
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
                  <TableHead>Student</TableHead>
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
                    <TableCell className="font-medium">{r.student_name}</TableCell>
                    <TableCell className="max-w-xs truncate">{r.symptoms}</TableCell>
                    <TableCell><Badge variant="outline" className={severityColor(r.severity)}>{r.severity}</Badge></TableCell>
                    <TableCell><Badge variant="outline">{r.status}</Badge></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {r.status === 'reported' && (
                          <Button size="sm" onClick={() => openReviewDialog(r)}>Review</Button>
                        )}
                        <Button size="sm" variant="outline" onClick={() => openEditDialog(r)}>
                          <PenSquare className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteReport(r.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {reports.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No reports</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Review Dialog */}
        <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Review Illness Report</DialogTitle></DialogHeader>
            {selectedReport && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Symptoms</p>
                  <p className="font-medium">{selectedReport.symptoms}</p>
                </div>
                {selectedReport.description && (
                  <div>
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="whitespace-pre-wrap">{selectedReport.description}</p>
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Required Referral (Optional)</Label>
                  <select className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={referral} onChange={e => setReferral(e.target.value)}>
                    <option value="None">None</option>
                    <option value="Rugarama Hospital">Rugarama Hospital</option>
                    <option value="Kabale Regional Referral Hospital">Kabale Regional Referral Hospital</option>
                    <option value="Rushoroza Hospital">Rushoroza Hospital</option>
                    <option value="Kamukira Health Centre IV">Kamukira Health Centre IV</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Staff Notes</Label>
                  <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Add your review notes..." />
                </div>
                <Button onClick={reviewReport} className="w-full">Mark as Reviewed</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Edit Illness Report</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Symptoms</Label>
                <Input value={editForm.symptoms} onChange={e => setEditForm({ ...editForm, symptoms: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Severity</Label>
                  <select className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={editForm.severity} onChange={e => setEditForm({ ...editForm, severity: e.target.value })}>
                    <option value="mild">Mild</option>
                    <option value="moderate">Moderate</option>
                    <option value="severe">Severe</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <select className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value })}>
                    <option value="reported">Reported</option>
                    <option value="reviewed">Reviewed</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Required Referral (Optional)</Label>
                <select className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={editReferral} onChange={e => setEditReferral(e.target.value)}>
                  <option value="None">None</option>
                  <option value="Rugarama Hospital">Rugarama Hospital</option>
                  <option value="Kabale Regional Referral Hospital">Kabale Regional Referral Hospital</option>
                  <option value="Rushoroza Hospital">Rushoroza Hospital</option>
                  <option value="Kamukira Health Centre IV">Kamukira Health Centre IV</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Staff Notes</Label>
                <Textarea value={editForm.staff_notes} onChange={e => setEditForm({ ...editForm, staff_notes: e.target.value })} />
              </div>
              <Button onClick={handleEditSubmit} className="w-full">Save Changes</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
