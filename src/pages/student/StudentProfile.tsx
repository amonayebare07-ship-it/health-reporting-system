import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function StudentProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from('profiles').select('*').eq('user_id', user.id).single()
      .then(({ data }) => { if (data) setProfile(data); });
  }, [user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;
    setLoading(true);
    const { error } = await supabase.from('profiles').update({
      full_name: profile.full_name,
      phone: profile.phone,
      department: profile.department,
      blood_type: profile.blood_type,
      allergies: profile.allergies,
      emergency_contact: profile.emergency_contact,
      emergency_phone: profile.emergency_phone,
      gender: profile.gender,
    }).eq('user_id', user.id);
    if (error) toast.error(error.message);
    else toast.success('Profile updated');
    setLoading(false);
  };

  if (!profile) return <DashboardLayout><div className="text-muted-foreground">Loading...</div></DashboardLayout>;

  const field = (label: string, key: string, type = 'text') => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input type={type} value={profile[key] ?? ''} onChange={e => setProfile((p: any) => ({ ...p, [key]: e.target.value }))} />
    </div>
  );

  return (
    <DashboardLayout>
      <div className="max-w-2xl space-y-6">
        <h1 className="text-3xl font-display font-bold">My Profile</h1>
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {field('Full Name', 'full_name')}
                {field('Phone', 'phone', 'tel')}
                {field('Department', 'department')}
                {field('Gender', 'gender')}
                {field('Blood Type', 'blood_type')}
                {field('Allergies', 'allergies')}
                {field('Emergency Contact', 'emergency_contact')}
                {field('Emergency Phone', 'emergency_phone', 'tel')}
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Saving...' : 'Update Profile'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
