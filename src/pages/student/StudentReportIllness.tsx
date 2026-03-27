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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function StudentReportIllness() {
  const { user } = useAuth();
  const [form, setForm] = useState({ description: '', severity: 'mild', onset_date: '', location: '' });
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [otherSymptoms, setOtherSymptoms] = useState('');
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  
  const PRESET_SYMPTOMS = ['Headache', 'Fever', 'Cough', 'Nausea/Vomiting', 'Sore Throat', 'Fatigue', 'Stomach ache', 'Muscle/Joint pain'];
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
    
    const finalSymptoms = [...selectedSymptoms, otherSymptoms.trim()].filter(Boolean).join(', ');
    if (!finalSymptoms) {
      toast.error('Please select or describe at least one symptom.');
      return;
    }
    
    setLoading(true);
    const fullDescription = form.location ? `Location: ${form.location}\n\n${form.description}` : form.description;
    const { error } = await supabase.from('illness_reports').insert({
      student_id: user.id,
      symptoms: finalSymptoms,
      description: fullDescription,
      severity: form.severity,
      onset_date: form.onset_date,
    });
    if (error) { toast.error(error.message); }
    else {
      toast.success('Illness report submitted');
      setForm({ description: '', severity: 'mild', onset_date: '', location: '' });
      setSelectedSymptoms([]);
      setOtherSymptoms('');
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
              <div className="space-y-4">
                <Label>What are your symptoms?</Label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_SYMPTOMS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSymptoms(prev => 
                        prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
                      )}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                        selectedSymptoms.includes(s)
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background text-muted-foreground border-input hover:bg-muted'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <div className="space-y-2 pt-2">
                  <Label>Other Symptoms (optional)</Label>
                  <Input 
                    value={otherSymptoms} 
                    onChange={e => setOtherSymptoms(e.target.value)} 
                    placeholder="e.g. Dizziness, Chills"
                  />
                </div>
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
                    <TableHead>Feedback</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map(r => (
                    <TableRow key={r.id}>
                      <TableCell>{r.onset_date}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{r.symptoms}</TableCell>
                      <TableCell><Badge variant="outline" className={severityColor(r.severity)}>{r.severity}</Badge></TableCell>
                      <TableCell><Badge variant="outline" className={statusColor(r.status)}>{r.status}</Badge></TableCell>
                      <TableCell>
                        {r.status === 'reviewed' ? (
                          <Button variant="outline" size="sm" onClick={() => { setSelectedReport(r); setFeedbackOpen(true); }}>
                            <MessageCircle className="w-4 h-4 mr-2" /> View
                          </Button>
                        ) : (
                          <span className="text-muted-foreground text-sm">Pending</span>
                        )}
                      </TableCell>
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

        <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Clinic Feedback</DialogTitle></DialogHeader>
            {selectedReport && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground">Your Symptoms</h4>
                  <p className="mt-1 text-sm">{selectedReport.symptoms}</p>
                </div>
                <div className="pt-4 border-t border-border">
                  <h4 className="text-sm font-semibold text-primary">Staff Response</h4>
                  {(() => {
                    const notes = selectedReport.staff_notes || 'The medical staff reviewed your report but didn\'t leave any specific notes.';
                    const match = notes.match(/^\[REFERRAL:\s*(.*?)\]\n\n/);
                    const isReferred = !!match;
                    const referralDest = isReferred ? match[1] : null;
                    const cleanNotes = isReferred ? notes.replace(match[0], '') : notes;

                    return (
                      <>
                        {isReferred && (
                          <div className="mt-3 mb-3 p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-md flex flex-col gap-1">
                             <span className="font-bold text-sm flex items-center gap-2">🚨 EXTERNAL REFERRAL REQUIRED</span>
                             <span className="text-sm border-t border-destructive/20 pt-1 mt-1">Please report to: <strong>{referralDest}</strong></span>
                          </div>
                        )}
                        <div className="mt-2 p-3 bg-muted/50 border border-border rounded-md whitespace-pre-wrap text-sm">
                          {cleanNotes}
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
