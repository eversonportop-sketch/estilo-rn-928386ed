import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Client {
  id: string;
  consultant_id?: string;
  user_id?: string;
  name: string;
  full_name?: string;
  email: string;
  phone?: string;
  profession?: string;
  objective?: string;
  status?: string;
  progress?: number;
  created_at?: string;
}

export function useClients() {
  return useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Client[];
    },
  });
}

export function useClient(id: string | undefined) {
  return useQuery({
    queryKey: ['clients', id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id!)
        .single();
      if (error) throw error;
      return data as Client;
    },
  });
}

interface CreateClientInput {
  name: string;
  email: string;
  phone?: string;
  profession?: string;
  objective?: string;
  status?: string;
  password?: string;
}

export function useCreateClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ password, ...clientData }: CreateClientInput) => {
      const { data, error } = await supabase.functions.invoke('create-client', {
        body: { ...clientData, password },
      });
      if (error) throw new Error(error.message || 'Erro ao criar cliente');
      if (data?.error) throw new Error(data.error);
      return data as Client;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
  });
}

export function useUpdateClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Client> & { id: string }) => {
      const { data, error } = await supabase.from('clients').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data as Client;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
  });
}

export function useDeleteClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('clients').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
  });
}
