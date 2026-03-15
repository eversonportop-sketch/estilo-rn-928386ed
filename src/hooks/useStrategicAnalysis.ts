import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ClientStrategicAnalysis {
  id: string;
  client_id: string;
  image_objective?: string;
  strengths?: string;
  challenges?: string;
  positioning?: string;
  personal_brand?: string;
  lifestyle?: string;
  profession?: string;
  communication_objective?: string;
  recommendations?: string;
  notes?: string;
  created_at?: string;
}

export function useClientStrategicAnalysis(clientId: string | undefined) {
  return useQuery({
    queryKey: ['client_strategic_analysis', clientId],
    enabled: !!clientId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('client_strategic_analysis')
        .select('*')
        .eq('client_id', clientId!)
        .maybeSingle();
      if (error) throw error;
      return data as ClientStrategicAnalysis | null;
    },
  });
}

export function useUpsertStrategicAnalysis() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (analysis: Omit<ClientStrategicAnalysis, 'id' | 'created_at'>) => {
      const { data: existing } = await supabase
        .from('client_strategic_analysis')
        .select('id')
        .eq('client_id', analysis.client_id)
        .maybeSingle();

      if (existing) {
        const { data, error } = await supabase
          .from('client_strategic_analysis')
          .update(analysis)
          .eq('id', existing.id)
          .select()
          .single();
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('client_strategic_analysis')
          .insert(analysis)
          .select()
          .single();
        if (error) throw error;
        return data;
      }
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ['client_strategic_analysis', vars.client_id] }),
  });
}
