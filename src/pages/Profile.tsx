import { Wallet, Mail, User, Calendar } from 'lucide-react';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Your Profile</h1>
          <p className="text-lg text-muted-foreground">Manage your account and view your stats</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-3">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">
                    {user.profile.firstName} {user.profile.lastName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-3">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-3">
                  <Wallet className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Hedera Account ID</p>
                  <p className="font-mono text-sm font-medium">
                    {user.hederaAccountId || 'Not connected'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-3">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Member since</p>
                  <p className="font-medium">
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <Badge variant={user.isActive ? 'default' : 'secondary'}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sustainability Stats</CardTitle>
              <CardDescription>Your environmental impact journey</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                View detailed stats on your dashboard
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Profile;
