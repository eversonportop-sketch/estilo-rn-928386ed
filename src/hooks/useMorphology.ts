import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ClientMorphology {
  id: string;
  client_id: string;
  body_type?: string;
  shoulders?: string;
  waist?: string;
  hips?: string;
  vertical_line?: string;
  proportions?: string;
  recommendations?: string;
  notes?: string;
  created_at?: string;
}

export function useClientMorphology(clientId: string | undefined) {
  return useQuery({
    queryKey: ['client_morphology', clientId],
    enabled: !!clientId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('client_morphology')
        .select('*')
        .eq('client_id', clientId!)
        .maybeSingle();
      if (error) throw error;
      return data as ClientMorphology | null;
    },
  });
}

export function useUpsertMorphology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (morph: Omit<ClientMorphology, 'id' | 'created_at'>) => {
      // Check if exists
      const { data: existing } = await supabase
        .from('client_morphology')
        .select('id')
        .eq('client_id', morph.client_id)
        .maybeSingle();

      if (existing) {
        const { data, error } = await supabase
          .from('client_morphology')
          .update(morph)
          .eq('id', existing.id)
          .select()
          .single();
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('client_morphology')
          .insert(morph)
          .select()
          .single();
        if (error) throw error;
        return data;
      }
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ['client_morphology', vars.client_id] }),
  });
}
