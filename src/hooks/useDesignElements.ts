import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ClientDesignElement {
  id: string;
  client_id: string;
  categoria: string;
  descricao: string;
  observacao?: string;
  created_at?: string;
}

export function useClientDesignElements(clientId: string | undefined) {
  return useQuery({
    queryKey: ['client_design_elements', clientId],
    enabled: !!clientId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('client_design_elements')
        .select('*')
        .eq('client_id', clientId!)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data as ClientDesignElement[];
    },
  });
}

export function useAddDesignElement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (el: Omit<ClientDesignElement, 'id' | 'created_at'>) => {
      const { data, error } = await supabase.from('client_design_elements').insert(el).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ['client_design_elements', vars.client_id] }),
  });
}

export function useDeleteDesignElement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, clientId }: { id: string; clientId: string }) => {
      const { error } = await supabase.from('client_design_elements').delete().eq('id', id);
      if (error) throw error;
      return clientId;
    },
    onSuccess: (clientId) => qc.invalidateQueries({ queryKey: ['client_design_elements', clientId] }),
  });
}
