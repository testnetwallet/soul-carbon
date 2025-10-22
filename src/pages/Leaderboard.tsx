import { Trophy, Medal, Award } from 'lucide-react';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Leaderboard = () => {
  // Mock data for demonstration
  const topUsers = [
    { rank: 1, name: 'EcoWarrior', offsetsKg: 2450, icon: Trophy, color: 'text-warning' },
    { rank: 2, name: 'GreenChampion', offsetsKg: 1890, icon: Medal, color: 'text-muted-foreground' },
    { rank: 3, name: 'CarbonNinja', offsetsKg: 1650, icon: Award, color: 'text-accent' },
  ];

  const otherUsers = [
    { rank: 4, name: 'EcoHero', offsetsKg: 1420 },
    { rank: 5, name: 'PlanetSaver', offsetsKg: 1280 },
    { rank: 6, name: 'GreenGuardian', offsetsKg: 1150 },
    { rank: 7, name: 'ClimateChampion', offsetsKg: 980 },
    { rank: 8, name: 'EarthDefender', offsetsKg: 850 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Leaderboard</h1>
          <p className="text-lg text-muted-foreground">
            Top offset contributors making a difference
          </p>
        </div>

        {/* Top 3 Podium */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {topUsers.map((user) => {
            const Icon = user.icon;
            return (
              <Card key={user.rank} className={user.rank === 1 ? 'md:order-2 bg-gradient-card' : user.rank === 2 ? 'md:order-1' : 'md:order-3'}>
                <CardHeader className="text-center pb-3">
                  <div className="mx-auto mb-2">
                    <Icon className={`h-12 w-12 ${user.color}`} />
                  </div>
                  <Badge className="mx-auto mb-2">Rank #{user.rank}</Badge>
                  <CardTitle className="text-xl">{user.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-3xl font-bold text-success">{user.offsetsKg}</p>
                  <p className="text-sm text-muted-foreground">kg CO2e offset</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Rest of leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle>All Rankings</CardTitle>
            <CardDescription>Complete leaderboard standings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {otherUsers.map((user) => (
                <div
                  key={user.rank}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="w-12 justify-center">
                      #{user.rank}
                    </Badge>
                    <p className="font-medium">{user.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-success">{user.offsetsKg} kg</p>
                    <p className="text-xs text-muted-foreground">CO2e offset</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Leaderboard;
