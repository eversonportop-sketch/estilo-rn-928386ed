import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getActiveClientId } from '@/hooks/useActiveClient';

export interface JourneyStep {
  key: string;
  completed: boolean;
}

/**
 * Checks real Supabase data for each consulting journey step
 * using the active client from sessionStorage.
 */
export function useClientJourney() {
  const clientId = getActiveClientId();

  return useQuery({
    queryKey: ['client_journey_progress', clientId],
    enabled: !!clientId,
    queryFn: async () => {
      if (!clientId) return { clientId: null, steps: getDefaultSteps() };

      // Check all journey steps in parallel
      const [anamnese, analysis, morphology, styleIdentity, coloring, designElements, looks] =
        await Promise.all([
          supabase
            .from('clients')
            .select('progress')
            .eq('id', clientId)
            .maybeSingle(),
          supabase
            .from('client_strategic_analysis')
            .select('id')
            .eq('client_id', clientId)
            .maybeSingle(),
          supabase
            .from('client_morphology')
            .select('id')
            .eq('client_id', clientId)
            .maybeSingle(),
          supabase
            .from('client_strategic_analysis')
            .select('image_objective')
            .eq('client_id', clientId)
            .maybeSingle(),
          supabase
            .from('client_design_elements')
            .select('id')
            .eq('client_id', clientId)
            .eq('categoria', 'Coloração')
            .limit(1),
          supabase
            .from('client_design_elements')
            .select('id')
            .eq('client_id', clientId)
            .limit(1),
          supabase
            .from('looks')
            .select('id')
            .eq('client_id', clientId)
            .limit(1),
        ]);

      const steps: JourneyStep[] = [
        { key: 'anamnese', completed: (anamnese.data?.progress ?? 0) > 0 },
        { key: 'analise', completed: !!analysis.data },
        { key: 'morfologia', completed: !!morphology.data },
        { key: 'identidade', completed: !!styleIdentity.data?.objetivo_imagem },
        { key: 'coloracao', completed: (coloring.data?.length ?? 0) > 0 },
        { key: 'elementos', completed: (designElements.data?.length ?? 0) > 0 },
        { key: 'looks', completed: (looks.data?.length ?? 0) > 0 },
      ];

      return { clientId, steps };
    },
  });
}

function getDefaultSteps(): JourneyStep[] {
  return [
    { key: 'anamnese', completed: false },
    { key: 'analise', completed: false },
    { key: 'morfologia', completed: false },
    { key: 'identidade', completed: false },
    { key: 'coloracao', completed: false },
    { key: 'elementos', completed: false },
    { key: 'looks', completed: false },
  ];
}
