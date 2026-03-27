import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { Heart, Shield, Users } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Logged in successfully');
      navigate('/index');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero items-center justify-center p-12">
        <div className="max-w-md text-center space-y-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-primary">
            <Heart className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold font-display text-sidebar-foreground">
            Campus Health Management System
          </h1>
          <p className="text-lg text-sidebar-foreground/70">
            Streamlining student healthcare with secure digital records, easy appointment booking, and remote illness reporting.
          </p>
          <div className="flex gap-6 justify-center pt-4">
            <div className="flex items-center gap-2 text-sidebar-foreground/60">
              <Shield className="w-5 h-5" />
              <span className="text-sm">Secure</span>
            </div>
            <div className="flex items-center gap-2 text-sidebar-foreground/60">
              <Users className="w-5 h-5" />
              <span className="text-sm">Role-based</span>
            </div>
            <div className="flex items-center gap-2 text-sidebar-foreground/60">
              <Heart className="w-5 h-5" />
              <span className="text-sm">Student-first</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md shadow-elevated border-border">
          <CardHeader className="space-y-2">
            <div className="lg:hidden flex justify-center mb-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl gradient-primary">
                <Heart className="w-7 h-7 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl font-display text-center">Welcome back</CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Sign in to access the health management system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center text-xs"><span className="bg-card px-2 text-muted-foreground">New here?</span></div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={() => navigate('/register/admin')}>
                  Admin Setup
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigate('/register/student')}>
                  Student Register
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
