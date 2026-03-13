import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface DbInspiration {
  id: string;
  client_id: string;
  imagem?: string;
  ocasiao: string;
  nota_estilo: string;
  created_at?: string;
}

export function useInspirations(clientId: string | undefined) {
  return useQuery({
    queryKey: ['inspirations', clientId],
    enabled: !!clientId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inspirations')
        .select('*')
        .eq('client_id', clientId!)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as DbInspiration[];
    },
  });
}

export function useAddInspiration() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (insp: Omit<DbInspiration, 'id' | 'created_at'>) => {
      const { data, error } = await supabase.from('inspirations').insert(insp).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ['inspirations', vars.client_id] }),
  });
}

export function useDeleteInspiration() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, clientId }: { id: string; clientId: string }) => {
      const { error } = await supabase.from('inspirations').delete().eq('id', id);
      if (error) throw error;
      return clientId;
    },
    onSuccess: (clientId) => qc.invalidateQueries({ queryKey: ['inspirations', clientId] }),
  });
}
