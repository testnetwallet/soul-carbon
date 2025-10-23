-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  hedera_account_id TEXT,
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create offset_projects table
CREATE TABLE public.offset_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  project_type TEXT NOT NULL CHECK (project_type IN ('reforestation', 'renewable_energy', 'methane_capture', 'direct_air_capture', 'other')),
  cost_per_kg DECIMAL(10, 2) NOT NULL CHECK (cost_per_kg > 0),
  available_credits INTEGER NOT NULL CHECK (available_credits >= 0),
  verification_standard TEXT NOT NULL CHECK (verification_standard IN ('VCS', 'Gold Standard', 'CDM', 'CAR')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create offset_purchases table
CREATE TABLE public.offset_purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES public.offset_projects(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  total_co2e_kg DECIMAL(10, 2) NOT NULL,
  total_hbar_cost DECIMAL(10, 2) NOT NULL,
  hedera_transaction_id TEXT,
  token_mint_transaction_id TEXT,
  token_id TEXT,
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_offset_balances table
CREATE TABLE public.user_offset_balances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES public.offset_projects(id),
  total_kg_co2e DECIMAL(10, 2) NOT NULL DEFAULT 0,
  token_balance INTEGER NOT NULL DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, project_id)
);

-- Create emissions table
CREATE TABLE public.emissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  emission_type TEXT NOT NULL CHECK (emission_type IN ('travel', 'energy', 'food', 'other')),
  category TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  unit TEXT NOT NULL,
  co2e_kg DECIMAL(10, 2) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT,
  hedera_transaction_id TEXT,
  consensus_timestamp TEXT,
  topic_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offset_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offset_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_offset_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emissions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Offset projects policies (public read, admin write)
CREATE POLICY "Anyone can view active offset projects"
  ON public.offset_projects FOR SELECT
  USING (is_active = true);

-- Offset purchases policies
CREATE POLICY "Users can view own purchases"
  ON public.offset_purchases FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own purchases"
  ON public.offset_purchases FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- User offset balances policies
CREATE POLICY "Users can view own balances"
  ON public.user_offset_balances FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own balances"
  ON public.user_offset_balances FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own balances"
  ON public.user_offset_balances FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Emissions policies
CREATE POLICY "Users can view own emissions"
  ON public.emissions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own emissions"
  ON public.emissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_offset_projects_type ON public.offset_projects(project_type);
CREATE INDEX idx_offset_projects_active ON public.offset_projects(is_active);
CREATE INDEX idx_offset_purchases_user ON public.offset_purchases(user_id);
CREATE INDEX idx_offset_purchases_project ON public.offset_purchases(project_id);
CREATE INDEX idx_user_offset_balances_user ON public.user_offset_balances(user_id);
CREATE INDEX idx_emissions_user ON public.emissions(user_id);
CREATE INDEX idx_emissions_date ON public.emissions(date DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_offset_projects_updated_at
  BEFORE UPDATE ON public.offset_projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample offset projects
INSERT INTO public.offset_projects (project_id, name, description, location, project_type, cost_per_kg, available_credits, verification_standard) VALUES
  ('REFOR-001', 'Amazon Rainforest Conservation', 'Protecting 10,000 hectares of primary rainforest in Brazil', 'Brazil', 'reforestation', 0.05, 500000, 'VCS'),
  ('SOLAR-001', 'Solar Farm Development', 'Large-scale solar energy installation in India', 'India', 'renewable_energy', 0.03, 750000, 'Gold Standard'),
  ('METH-001', 'Landfill Methane Capture', 'Capturing methane emissions from waste management', 'United States', 'methane_capture', 0.04, 300000, 'CAR'),
  ('WIND-001', 'Offshore Wind Energy', 'Wind turbine installation in North Sea', 'Denmark', 'renewable_energy', 0.035, 600000, 'VCS'),
  ('REFOR-002', 'Mangrove Restoration', 'Restoring coastal mangrove forests in Southeast Asia', 'Indonesia', 'reforestation', 0.06, 200000, 'Gold Standard');