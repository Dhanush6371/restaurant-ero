
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UtensilsCrossed, Loader as Loader2, CircleAlert as AlertCircle, ArrowLeft, ChevronRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

const demoAccounts = [
  { label: 'Admin', email: 'admin@maisoneetoile.com', password: 'admin123', name: 'Antoine Laurent' },
  { label: 'Manager', email: 'manager@maisoneetoile.com', password: 'manager123', name: 'Claire Dubois' },
  { label: 'Waiter', email: 'waiter@maisoneetoile.com', password: 'waiter123', name: 'Jean Martin' },
  { label: 'Chef', email: 'chef@maisoneetoile.com', password: 'chef123', name: 'Louis Bernard' },
  { label: 'Cashier', email: 'cashier@maisoneetoile.com', password: 'cashier123', name: 'Sophie Moreau' },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Invalid email or password. Please try again.');
    }
  };

  const quickLogin = (acc: typeof demoAccounts[0]) => {
    setEmail(acc.email);
    setPassword(acc.password);
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotSent(true);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left side - branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[hsl(38,32%,18%)] via-[hsl(38,28%,15%)] to-[hsl(30,15%,10%)]">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 30%, hsl(38,44%,52%) 0%, transparent 50%), radial-gradient(circle at 80% 70%, hsl(38,44%,52%) 0%, transparent 40%)',
          }}
        />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
              <UtensilsCrossed className="h-6 w-6 text-[hsl(38,44%,60%)]" />
            </div>
            <span className="font-serif text-2xl font-semibold tracking-tight">MaisonOS</span>
          </div>

          <div className="max-w-md">
            <h1 className="font-serif text-5xl font-semibold leading-tight tracking-tight">
              Everything your restaurant needs, in one place.
            </h1>
            <p className="mt-6 text-lg text-white/60">
              The complete restaurant management platform for Maison Étoile, Paris.
            </p>
            <div className="mt-12 space-y-4">
              {[
                'Manage orders, tables, and reservations in real time',
                'Track inventory, recipes, and food costs with precision',
                'Analyze sales performance and financial reporting',
              ].map((feat, i) => (
                <div key={i} className="flex items-center gap-3 text-white/70">
                  <div className="h-1.5 w-1.5 rounded-full bg-[hsl(38,44%,60%)]" />
                  <span className="text-sm">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-sm text-white/40">
            <p className="font-serif italic text-white/50">Maison Étoile</p>
            <p>Paris, France</p>
          </div>
        </div>
      </div>

      {/* Right side - login form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <UtensilsCrossed className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-serif text-xl font-semibold">MaisonOS</span>
          </div>

          <Card className="border-border/60 shadow-lg">
            <CardHeader className="space-y-2">
              <CardTitle className="font-serif text-2xl">Welcome back</CardTitle>
              <CardDescription>Sign in to manage Maison Étoile</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 rounded-md bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@maisoneetoile.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    autoFocus
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="remember"
                      checked={remember}
                      onCheckedChange={(v) => setRemember(v === true)}
                    />
                    <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                      Remember me
                    </Label>
                  </div>
                  <button
                    type="button"
                    onClick={() => setForgotOpen(true)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Signing in…
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>

              {/* Quick demo accounts */}
              <div className="mt-6">
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Quick demo login
                </p>
                <div className="space-y-1.5">
                  {demoAccounts.map((acc) => (
                    <button
                      key={acc.email}
                      onClick={() => quickLogin(acc)}
                      className="flex w-full items-center justify-between rounded-lg border border-border/60 px-3 py-2 text-left transition-colors hover:border-primary/40 hover:bg-muted"
                    >
                      <div>
                        <p className="text-sm font-medium">{acc.label}</p>
                        <p className="text-xs text-muted-foreground">{acc.name}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Forgot password dialog */}
      <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
        <DialogContent>
          {forgotSent ? (
            <>
              <DialogHeader>
                <DialogTitle>Check your email</DialogTitle>
                <DialogDescription>
                  Password reset instructions have been sent to your email.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button onClick={() => { setForgotOpen(false); setForgotSent(false); setForgotEmail(''); }}>
                  Close
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Reset your password</DialogTitle>
                <DialogDescription>
                  Enter your email address and we'll send you instructions to reset your password.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleForgot} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="forgot-email">Email</Label>
                  <Input
                    id="forgot-email"
                    type="email"
                    placeholder="you@maisoneetoile.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setForgotOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Send instructions</Button>
                </DialogFooter>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
