import { supabase } from "@/integrations/supabase/client";

export type AppRole = 'admin' | 'staff' | 'student';

export async function getUserRole(userId: string): Promise<AppRole | null> {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .maybeSingle();
  
  if (error || !data) return null;
  return data.role as AppRole;
}

export async function assignRole(userId: string, role: AppRole) {
  const { error } = await supabase
    .from('user_roles')
    .insert({ user_id: userId, role: role as any });
  return { error };
}

export async function signUpAdmin(email: string, password: string, fullName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName, role: 'admin' } }
  });
  
  if (error || !data.user) return { error };
  return { error: null, user: data.user };
}

export async function signUpStaff(email: string, password: string, fullName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName, role: 'staff' } }
  });
  
  if (error || !data.user) return { error };
  return { error: null, user: data.user };
}

export async function signUpStudent(email: string, password: string, fullName: string, studentId: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName, role: 'student' } }
  });
  
  if (error || !data.user) return { error };
  
  // Update profile with student ID
  await supabase.from('profiles').update({ student_id: studentId }).eq('user_id', data.user.id);
  
  return { error: null, user: data.user };
}
