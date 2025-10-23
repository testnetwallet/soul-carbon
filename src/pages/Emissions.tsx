import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Car, Zap, Apple, Package } from 'lucide-react';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { emissionsAPI } from '@/lib/supabase';
import { toast } from 'sonner';

const emissionSchema = z.object({
  emissionType: z.enum(['travel', 'energy', 'food', 'other']),
  category: z.string().min(1, 'Category is required'),
  amount: z.coerce.number().min(0.01, 'Amount must be positive'),
  unit: z.string().min(1, 'Unit is required'),
  description: z.string().optional(),
});

type EmissionForm = z.infer<typeof emissionSchema>;

const Emissions = () => {
  const [loading, setLoading] = useState(false);
  const [co2eEstimate, setCo2eEstimate] = useState<number | null>(null);

  const form = useForm<EmissionForm>({
    resolver: zodResolver(emissionSchema),
    defaultValues: {
      emissionType: 'travel',
      category: '',
      amount: 0,
      unit: '',
      description: '',
    },
  });

  const emissionTypes = [
    { value: 'travel', label: 'Travel', icon: Car, categories: ['car', 'flight', 'train', 'bus'] },
    { value: 'energy', label: 'Energy', icon: Zap, categories: ['electricity', 'gas', 'heating'] },
    { value: 'food', label: 'Food', icon: Apple, categories: ['meat', 'dairy', 'produce'] },
    { value: 'other', label: 'Other', icon: Package, categories: ['waste', 'shopping', 'misc'] },
  ];

  const selectedType = form.watch('emissionType');
  const currentCategories = emissionTypes.find((t) => t.value === selectedType)?.categories || [];

  const calculateCO2e = (data: EmissionForm) => {
    // Simple CO2e estimation logic (should use actual API in production)
    const factors: Record<string, number> = {
      car: 0.21,
      flight: 0.25,
      train: 0.04,
      bus: 0.10,
      electricity: 0.45,
      gas: 0.18,
      heating: 0.20,
      meat: 5.0,
      dairy: 1.3,
      produce: 0.3,
      waste: 0.5,
      shopping: 2.0,
      misc: 1.0,
    };

    const factor = factors[data.category] || 1.0;
    return data.amount * factor;
  };

  const onSubmit = async (data: EmissionForm) => {
    try {
      setLoading(true);
      const co2e = calculateCO2e(data);
      setCo2eEstimate(co2e);

      await emissionsAPI.log({
        emissionType: data.emissionType,
        category: data.category,
        amount: data.amount,
        unit: data.unit,
        co2eKg: co2e,
        date: new Date(),
        description: data.description,
      });

      toast.success(`Emission logged! ${co2e.toFixed(2)} kg CO2e`);
      form.reset();
      setCo2eEstimate(null);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to log emission');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Log Your Emissions</h1>
          <p className="text-lg text-muted-foreground">Track your carbon footprint activities</p>
        </div>

        <Tabs defaultValue="log" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="log">Log Emission</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="log">
            <Card>
              <CardHeader>
                <CardTitle>New Emission Entry</CardTitle>
                <CardDescription>Select type and enter details to track CO2e</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Emission Type Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {emissionTypes.map((type) => {
                        const Icon = type.icon;
                        const isSelected = selectedType === type.value;
                        return (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => form.setValue('emissionType', type.value as any)}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              isSelected
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <Icon className={`h-8 w-8 mx-auto mb-2 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                            <p className={`text-sm font-medium ${isSelected ? 'text-primary' : ''}`}>
                              {type.label}
                            </p>
                          </button>
                        );
                      })}
                    </div>

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {currentCategories.map((cat) => (
                                <SelectItem key={cat} value={cat} className="capitalize">
                                  {cat}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="0.00" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="unit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Unit</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select unit" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="km">km</SelectItem>
                                <SelectItem value="miles">miles</SelectItem>
                                <SelectItem value="kWh">kWh</SelectItem>
                                <SelectItem value="kg">kg</SelectItem>
                                <SelectItem value="liters">liters</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="E.g., Daily commute to work" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {co2eEstimate !== null && (
                      <div className="p-4 bg-accent/20 rounded-lg border border-accent">
                        <p className="text-sm text-muted-foreground">Estimated CO2e</p>
                        <p className="text-2xl font-bold text-accent">
                          {co2eEstimate.toFixed(2)} kg
                        </p>
                      </div>
                    )}

                    <Button type="submit" variant="gradient" size="lg" className="w-full" disabled={loading}>
                      {loading ? 'Logging...' : 'Log Emission'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Emission History</CardTitle>
                <CardDescription>View your tracked emissions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  Check your dashboard for recent emissions
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Emissions;
