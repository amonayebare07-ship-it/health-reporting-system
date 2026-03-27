import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Search, Trash2 } from 'lucide-react';

interface StudentProfile {
  id: string;
  full_name: string;
  email: string | null;
  student_id: string | null;
  department: string | null;
  phone: string | null;
  user_id: string;
}

export default function AdminStudents() {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [search, setSearch] = useState('');

  const fetchStudents = async () => {
    const { data: roles } = await supabase.from('user_roles').select('user_id').eq('role', 'student');
    if (!roles || roles.length === 0) { setStudents([]); return; }

    const studentIds = roles.map(r => r.user_id);
    const { data: profiles } = await supabase.from('profiles').select('*').in('user_id', studentIds);
    if (profiles) setStudents(profiles);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    
    await supabase.from('user_roles').delete().eq('user_id', userId);
    const { error } = await supabase.from('profiles').delete().eq('user_id', userId);
    
    if (error) toast.error("Error deleting student");
    else {
      toast.success("Student deleted successfully");
      fetchStudents();
    }
  };

  const filtered = students.filter(p =>
    p.full_name.toLowerCase().includes(search.toLowerCase()) ||
    (p.student_id ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (p.email ?? '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-display font-bold text-foreground">Students</h1>
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search students..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Card className="shadow-card">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(p => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.full_name}</TableCell>
                    <TableCell>{p.student_id ?? '—'}</TableCell>
                    <TableCell>{p.email ?? '—'}</TableCell>
                    <TableCell>{p.department ?? '—'}</TableCell>
                    <TableCell>{p.phone ?? '—'}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(p.user_id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No students found</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
