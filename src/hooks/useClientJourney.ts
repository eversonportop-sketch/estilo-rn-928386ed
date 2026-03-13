import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface JourneyStep {
  key: string;
  completed: boolean;
}

/**
 * Fetches the first client from the database (demo mode)
 * and checks real Supabase data for each consulting journey step.
 */
export function useClientJourney() {
  return useQuery({
    queryKey: ['client_journey_progress'],
    queryFn: async () => {
      // Get the first client as demo client
      const { data: clients, error: clientErr } = await supabase
        .from('clients')
        .select('id')
        .limit(1)
        .order('created_at', { ascending: true });

      if (clientErr) throw clientErr;
      const clientId = clients?.[0]?.id;
      if (!clientId) return { clientId: null, steps: getDefaultSteps() };

      // Check all journey steps in parallel
      const [anamnese, analysis, morphology, styleIdentity, coloring, designElements, looks] =
        await Promise.all([
          // Anamnese: check if client has status/progress indicating completion
          // Since anamnese is local-only for now, mark as pending unless client progress > 0
          supabase
            .from('clients')
            .select('progress')
            .eq('id', clientId)
            .single(),
          // Strategic Analysis
          supabase
            .from('client_strategic_analysis')
            .select('id')
            .eq('client_id', clientId)
            .maybeSingle(),
          // Morphology
          supabase
            .from('client_morphology')
            .select('id')
            .eq('client_id', clientId)
            .maybeSingle(),
          // Style Identity — no dedicated table, check if client has style-related analysis
          // Using strategic analysis as proxy (objetivo_imagem filled = style defined)
          supabase
            .from('client_strategic_analysis')
            .select('objetivo_imagem')
            .eq('client_id', clientId)
            .maybeSingle(),
          // Personal Coloring — no dedicated table, check design elements with color category
          supabase
            .from('client_design_elements')
            .select('id')
            .eq('client_id', clientId)
            .eq('categoria', 'Coloração')
            .limit(1),
          // Design Elements
          supabase
            .from('client_design_elements')
            .select('id')
            .eq('client_id', clientId)
            .limit(1),
          // Looks
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
