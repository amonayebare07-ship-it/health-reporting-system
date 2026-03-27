import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';
import { signUpStaff } from '@/lib/supabase-helpers';

interface StaffProfile {
  id: string;
  full_name: string;
  email: string | null;
  department: string | null;
  phone: string | null;
  user_id: string;
}

export default function AdminStaff() {
  const [staff, setStaff] = useState<StaffProfile[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [creating, setCreating] = useState(false);

  const fetchStaff = async () => {
    const { data: roles } = await supabase.from('user_roles').select('user_id').eq('role', 'staff');
    if (!roles || roles.length === 0) { setStaff([]); return; }
    const staffIds = roles.map(r => r.user_id);
    const { data: profiles } = await supabase.from('profiles').select('*').in('user_id', staffIds);
    if (profiles) setStaff(profiles);
  };

  useEffect(() => { fetchStaff(); }, []);

  const handleDelete = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this staff member?")) return;
    
    await supabase.from('user_roles').delete().eq('user_id', userId);
    const { error } = await supabase.from('profiles').delete().eq('user_id', userId);
    
    if (error) toast.error("Error deleting staff member");
    else {
      toast.success("Staff deleted successfully");
      fetchStaff();
    }
  };

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    const { error } = await signUpStaff(form.email, form.password, form.fullName);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Staff account created');
      setDialogOpen(false);
      setForm({ fullName: '', email: '', password: '' });
      setTimeout(fetchStaff, 1000);
    }
    setCreating(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-display font-bold text-foreground">Staff Members</h1>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" /> Add Staff</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create Staff Account</DialogTitle></DialogHeader>
              <form onSubmit={handleCreateStaff} className="space-y-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input required value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input type="password" required minLength={6} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
                </div>
                <Button type="submit" className="w-full" disabled={creating}>
                  {creating ? 'Creating...' : 'Create Staff Account'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <Card className="shadow-card">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map(s => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.full_name}</TableCell>
                    <TableCell>{s.email ?? '—'}</TableCell>
                    <TableCell>{s.department ?? '—'}</TableCell>
                    <TableCell>{s.phone ?? '—'}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(s.user_id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {staff.length === 0 && (
                  <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No staff members</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
