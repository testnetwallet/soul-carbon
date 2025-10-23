import { supabase } from '@/integrations/supabase/client';

// Types
export interface Profile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  hedera_account_id?: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
}

export interface OffsetProject {
  id: string;
  project_id: string;
  name: string;
  description: string;
  location: string;
  project_type: 'reforestation' | 'renewable_energy' | 'methane_capture' | 'direct_air_capture' | 'other';
  cost_per_kg: number;
  available_credits: number;
  verification_standard: 'VCS' | 'Gold Standard' | 'CDM' | 'CAR';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OffsetPurchase {
  id: string;
  user_id: string;
  project_id: string;
  quantity: number;
  total_co2e_kg: number;
  total_hbar_cost: number;
  hedera_transaction_id?: string;
  token_mint_transaction_id?: string;
  token_id?: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
}

export interface Emission {
  id: string;
  user_id: string;
  emission_type: 'travel' | 'energy' | 'food' | 'other';
  category: string;
  amount: number;
  unit: string;
  co2e_kg: number;
  date: string;
  description?: string;
  hedera_transaction_id?: string;
  consensus_timestamp?: string;
  topic_id?: string;
  created_at: string;
}

// Auth API
export const authAPI = {
  register: async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    hederaAccountId?: string;
  }) => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Registration failed');

    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        user_id: authData.user.id,
        first_name: data.firstName,
        last_name: data.lastName,
        hedera_account_id: data.hederaAccountId,
      });

    if (profileError) throw profileError;

    return { user: authData.user, session: authData.session };
  },

  login: async (data: { email: string; password: string }) => {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) throw error;
    return { user: authData.user, session: authData.session };
  },

  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  getProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  },
};

// Emissions API
export const emissionsAPI = {
  log: async (data: {
    emissionType: 'travel' | 'energy' | 'food' | 'other';
    category: string;
    amount: number;
    unit: string;
    co2eKg: number;
    date: Date;
    description?: string;
  }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: emission, error } = await supabase
      .from('emissions')
      .insert({
        user_id: user.id,
        emission_type: data.emissionType,
        category: data.category,
        amount: data.amount,
        unit: data.unit,
        co2e_kg: data.co2eKg,
        date: data.date.toISOString().split('T')[0],
        description: data.description,
      })
      .select()
      .single();

    if (error) throw error;
    return emission;
  },

  getHistory: async (params?: {
    page?: number;
    limit?: number;
    emissionType?: string;
  }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const limit = params?.limit || 20;
    const offset = ((params?.page || 1) - 1) * limit;

    let query = supabase
      .from('emissions')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .range(offset, offset + limit - 1);

    if (params?.emissionType) {
      query = query.eq('emission_type', params.emissionType);
    }

    const { data, error, count } = await query;

    if (error) throw error;
    return { emissions: data || [], total: count || 0 };
  },
};

// Offsets API
export const offsetsAPI = {
  getMarketplace: async (params?: {
    page?: number;
    limit?: number;
    projectType?: string;
  }) => {
    const limit = params?.limit || 20;
    const offset = ((params?.page || 1) - 1) * limit;

    let query = supabase
      .from('offset_projects')
      .select('*', { count: 'exact' })
      .eq('is_active', true)
      .order('name')
      .range(offset, offset + limit - 1);

    if (params?.projectType) {
      query = query.eq('project_type', params.projectType);
    }

    const { data, error, count } = await query;

    if (error) throw error;
    return { projects: data || [], total: count || 0 };
  },

  purchase: async (data: {
    projectId: string;
    quantity: number;
    totalCo2eKg: number;
    totalHbarCost: number;
  }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Get project UUID from project_id
    const { data: project, error: projectError } = await supabase
      .from('offset_projects')
      .select('id, available_credits')
      .eq('project_id', data.projectId)
      .single();

    if (projectError) throw projectError;
    if (!project) throw new Error('Project not found');
    if (project.available_credits < data.quantity) {
      throw new Error('Insufficient credits available');
    }

    // Create purchase record
    const { data: purchase, error: purchaseError } = await supabase
      .from('offset_purchases')
      .insert({
        user_id: user.id,
        project_id: project.id,
        quantity: data.quantity,
        total_co2e_kg: data.totalCo2eKg,
        total_hbar_cost: data.totalHbarCost,
        status: 'completed',
      })
      .select()
      .single();

    if (purchaseError) throw purchaseError;

    // Update project credits
    const { error: updateError } = await supabase
      .from('offset_projects')
      .update({ available_credits: project.available_credits - data.quantity })
      .eq('id', project.id);

    if (updateError) throw updateError;

    // Update or insert user balance
    const { data: existingBalance } = await supabase
      .from('user_offset_balances')
      .select('*')
      .eq('user_id', user.id)
      .eq('project_id', project.id)
      .single();

    if (existingBalance) {
      await supabase
        .from('user_offset_balances')
        .update({
          total_kg_co2e: existingBalance.total_kg_co2e + data.totalCo2eKg,
          token_balance: existingBalance.token_balance + data.quantity,
          last_updated: new Date().toISOString(),
        })
        .eq('id', existingBalance.id);
    } else {
      await supabase
        .from('user_offset_balances')
        .insert({
          user_id: user.id,
          project_id: project.id,
          total_kg_co2e: data.totalCo2eKg,
          token_balance: data.quantity,
        });
    }

    return purchase;
  },

  getBalance: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('user_offset_balances')
      .select(`
        *,
        offset_projects (
          name,
          project_id,
          project_type
        )
      `)
      .eq('user_id', user.id);

    if (error) throw error;
    return data || [];
  },
};
