import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileText, Stethoscope, MessageCircle } from 'lucide-react';

export default function StudentVisits() {
  const { user } = useAuth();
  const [reports, setReports] = useState<any[]>([]);
  const [visits, setVisits] = useState<any[]>([]);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Fetch illness reports submitted by student
    supabase
      .from('illness_reports')
      .select('*')
      .eq('student_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setReports(data); });

    // Fetch consultation records by staff
    supabase
      .from('consultations')
      .select('*')
      .eq('student_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setVisits(data); });
  }, [user]);

  const severityColor = (s: string) => {
    if (s === 'severe') return 'bg-destructive/10 text-destructive border-destructive/20';
    if (s === 'moderate') return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
    return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
  };

  const statusColor = (s: string) => {
    if (s === 'reviewed') return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
    return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold">My Health Records</h1>
          <p className="text-muted-foreground mt-1">View your illness reports and consultation history</p>
        </div>

        {/* Stats summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="shadow-card">
            <CardContent className="pt-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{reports.length}</p>
                <p className="text-sm text-muted-foreground">Reports Submitted</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="pt-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{visits.length}</p>
                <p className="text-sm text-muted-foreground">Clinic Visits</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="pt-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{reports.filter(r => r.status === 'pending').length}</p>
                <p className="text-sm text-muted-foreground">Awaiting Review</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Illness Reports */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="w-5 h-5 text-primary" />
              My Illness Reports
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Symptoms</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Staff Feedback</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map(r => (
                  <TableRow key={r.id}>
                    <TableCell className="whitespace-nowrap">{r.onset_date || new Date(r.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{r.symptoms}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={severityColor(r.severity)}>{r.severity}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusColor(r.status)}>{r.status}</Badge>
                    </TableCell>
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
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No illness reports submitted yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Consultation / Visit Records */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Stethoscope className="w-5 h-5 text-emerald-600" />
              My Clinic Visit Records
            </CardTitle>
          </CardHeader>
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
                    <TableCell className="whitespace-nowrap">{new Date(v.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{v.diagnosis ?? '—'}</TableCell>
                    <TableCell>{v.treatment ?? '—'}</TableCell>
                    <TableCell>{v.prescription ?? '—'}</TableCell>
                    <TableCell className="max-w-xs truncate">{v.notes ?? '—'}</TableCell>
                  </TableRow>
                ))}
                {visits.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No clinic visit records yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Staff Feedback Dialog */}
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
                  const notes = selectedReport.staff_notes || "The medical staff reviewed your report but didn't leave any specific notes.";
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
    </DashboardLayout>
  );
}
