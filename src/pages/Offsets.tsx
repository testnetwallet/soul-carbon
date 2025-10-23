import { useEffect, useState } from 'react';
import { MapPin, CheckCircle, ShoppingCart } from 'lucide-react';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { offsetsAPI, OffsetProject } from '@/lib/supabase';
import { toast } from 'sonner';

const Offsets = () => {
  const [projects, setProjects] = useState<OffsetProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { projects: data } = await offsetsAPI.getMarketplace();
        setProjects(data || []);
      } catch (error) {
        toast.error('Failed to load offset projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handlePurchase = (project: OffsetProject) => {
    toast.success(`Purchase flow for ${project.name} - Coming soon!`);
  };

  const projectTypeColors: Record<string, string> = {
    reforestation: 'bg-success/10 text-success',
    renewable_energy: 'bg-info/10 text-info',
    methane_capture: 'bg-warning/10 text-warning',
    direct_air_capture: 'bg-accent/10 text-accent',
    other: 'bg-muted text-muted-foreground',
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Carbon Offset Marketplace</h1>
          <p className="text-lg text-muted-foreground">
            Purchase verified carbon credits to offset your emissions
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No offset projects available at this time</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card key={project.project_id} className="flex flex-col hover:shadow-glow transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge className={projectTypeColors[project.project_type] || projectTypeColors.other}>
                      {project.project_type.replace(/_/g, ' ')}
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <CheckCircle className="h-3 w-3" />
                      {project.verification_standard}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{project.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {project.location}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-sm text-muted-foreground mb-4 flex-1">
                    {project.description}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Price per kg CO2e</span>
                      <span className="font-semibold text-lg">{project.cost_per_kg} HBAR</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Available credits</span>
                      <span className="font-medium">{project.available_credits.toLocaleString()} kg</span>
                    </div>

                    <Button 
                      onClick={() => handlePurchase(project)} 
                      variant="gradient" 
                      className="w-full"
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Purchase Credits
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Offsets;
