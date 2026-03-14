import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ClientAnamnesis {
  id: string;
  client_id: string;
  lifestyle?: string;
  profession?: string;
  routine?: string;
  objectives?: string;
  preferences?: string;
  challenges?: string;
  created_at?: string;
}

export function useClientAnamnesis(clientId: string | undefined) {
  return useQuery({
    queryKey: ['client_anamnesis', clientId],
    enabled: !!clientId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('client_anamnesis')
        .select('*')
        .eq('client_id', clientId!)
        .maybeSingle();
      if (error) throw error;
      return data as ClientAnamnesis | null;
    },
  });
}

export function useUpsertAnamnesis() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (anamnesis: Omit<ClientAnamnesis, 'id' | 'created_at'>) => {
      const { data: existing } = await supabase
        .from('client_anamnesis')
        .select('id')
        .eq('client_id', anamnesis.client_id)
        .maybeSingle();

      if (existing) {
        const { data, error } = await supabase
          .from('client_anamnesis')
          .update(anamnesis)
          .eq('id', existing.id)
          .select()
          .single();
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('client_anamnesis')
          .insert(anamnesis)
          .select()
          .single();
        if (error) throw error;
        return data;
      }
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ['client_anamnesis', vars.client_id] }),
  });
}
