import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function StudentReportIllness() {
  const { user } = useAuth();
  const [form, setForm] = useState({ symptoms: '', description: '', severity: 'mild', onset_date: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    const { error } = await supabase.from('illness_reports').insert({
      student_id: user.id,
      symptoms: form.symptoms,
      description: form.description,
      severity: form.severity,
      onset_date: form.onset_date,
    });
    if (error) { toast.error(error.message); }
    else {
      toast.success('Illness report submitted');
      setForm({ symptoms: '', description: '', severity: 'mild', onset_date: '' });
    }
    setLoading(false);
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl space-y-6">
        <h1 className="text-3xl font-display font-bold">Report Illness</h1>
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Symptoms</Label>
                <Input value={form.symptoms} onChange={e => setForm(f => ({ ...f, symptoms: e.target.value }))} required placeholder="e.g. Headache, fever, cough" />
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
      </div>
    </DashboardLayout>
  );
}
