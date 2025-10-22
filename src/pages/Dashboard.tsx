import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, Leaf, Wallet, Plus, ShoppingCart } from 'lucide-react';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { emissionsAPI, offsetsAPI, Emission } from '@/lib/api';
import { toast } from 'sonner';

const Dashboard = () => {
  const [emissions, setEmissions] = useState<Emission[]>([]);
  const [stats, setStats] = useState({
    totalEmissions: 0,
    totalOffsets: 0,
    netFootprint: 0,
    hbarBalance: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [emissionsRes, balanceRes] = await Promise.all([
          emissionsAPI.getHistory({ limit: 5 }),
          offsetsAPI.getBalance(),
        ]);

        const emissionsData = emissionsRes.data.data.emissions || [];
        setEmissions(emissionsData);

        const totalEmissions = emissionsData.reduce(
          (sum: number, e: Emission) => sum + e.co2eKg,
          0
        );
        const totalOffsets = balanceRes.data.data?.totalCo2eKg || 0;
        const hbarBalance = balanceRes.data.data?.hbarBalance || 0;

        setStats({
          totalEmissions: Math.round(totalEmissions),
          totalOffsets: Math.round(totalOffsets),
          netFootprint: Math.round(totalEmissions - totalOffsets),
          hbarBalance: Math.round(hbarBalance * 100) / 100,
        });
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    {
      title: 'Total Emissions',
      value: `${stats.totalEmissions} kg`,
      description: 'CO2e tracked',
      icon: TrendingUp,
      color: 'text-destructive',
    },
    {
      title: 'Offsets Purchased',
      value: `${stats.totalOffsets} kg`,
      description: 'Carbon credits',
      icon: Leaf,
      color: 'text-success',
    },
    {
      title: 'Net Footprint',
      value: `${stats.netFootprint} kg`,
      description: 'Remaining CO2e',
      icon: stats.netFootprint > 0 ? TrendingUp : TrendingDown,
      color: stats.netFootprint > 0 ? 'text-warning' : 'text-success',
    },
    {
      title: 'HBAR Balance',
      value: `${stats.hbarBalance}`,
      description: 'Wallet balance',
      icon: Wallet,
      color: 'text-info',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8 rounded-2xl bg-gradient-hero p-8 text-primary-foreground">
          <h1 className="text-4xl font-bold mb-2">Welcome to Your Carbon Dashboard</h1>
          <p className="text-lg opacity-90">Track, offset, and reduce your environmental impact</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="bg-gradient-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Log emissions or purchase offsets</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-4">
              <Button asChild variant="gradient" className="flex-1">
                <Link to="/emissions">
                  <Plus className="mr-2 h-4 w-4" />
                  Log Emission
                </Link>
              </Button>
              <Button asChild variant="secondary" className="flex-1">
                <Link to="/offsets">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Buy Offset
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Impact</CardTitle>
              <CardDescription>Environmental equivalents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Trees planted equivalent</span>
                <span className="font-semibold">{Math.round(stats.totalOffsets / 20)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Miles driven equivalent</span>
                <span className="font-semibold">{Math.round(stats.totalEmissions * 2.5)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Emissions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Emissions</CardTitle>
            <CardDescription>Your latest tracked activities</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : emissions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No emissions logged yet. <Link to="/emissions" className="text-primary hover:underline">Start tracking</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {emissions.map((emission) => (
                  <div
                    key={emission._id}
                    className="flex items-center justify-between border-b pb-4 last:border-0"
                  >
                    <div>
                      <p className="font-medium capitalize">{emission.emissionType}</p>
                      <p className="text-sm text-muted-foreground">
                        {emission.amount} {emission.unit} • {emission.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{emission.co2eKg} kg CO2e</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(emission.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
