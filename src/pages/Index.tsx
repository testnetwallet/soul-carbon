import { Link } from 'react-router-dom';
import { Leaf, TrendingDown, Shield, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  const features = [
    {
      icon: TrendingDown,
      title: 'Track Emissions',
      description: 'Log your daily carbon footprint from travel, energy, and more',
    },
    {
      icon: Leaf,
      title: 'Purchase Offsets',
      description: 'Buy verified carbon credits powered by Hedera blockchain',
    },
    {
      icon: Shield,
      title: 'Blockchain Verified',
      description: 'Every transaction is transparent and immutable on Hedera',
    },
    {
      icon: Zap,
      title: 'Real-time Impact',
      description: 'See your environmental impact and sustainability progress',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-hero">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center text-primary-foreground">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-2 backdrop-blur">
              <Leaf className="h-5 w-5" />
              <span className="text-sm font-medium">Blockchain-Powered Sustainability</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Track, Offset, and Reduce Your Carbon Footprint
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Join the movement towards a sustainable future with transparent, blockchain-verified carbon credits
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="text-lg">
                <Link to="/register">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Link to="/login">
                  Sign In
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Why Choose Carbon Tracker?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A comprehensive platform to measure, manage, and offset your environmental impact
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="bg-gradient-card hover:shadow-glow transition-all">
                <CardContent className="pt-6">
                  <div className="rounded-xl bg-primary/10 p-3 w-fit mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 pb-20">
        <Card className="bg-gradient-hero text-primary-foreground overflow-hidden relative">
          <CardContent className="p-12 text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Make a Difference?
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Start tracking your carbon emissions and contribute to a sustainable future today
            </p>
            <Button asChild size="lg" variant="secondary" className="text-lg">
              <Link to="/register">
                Create Your Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t bg-card">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Leaf className="h-5 w-5 text-primary" />
            <span>© 2025 Carbon Tracker. Building a sustainable future.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
