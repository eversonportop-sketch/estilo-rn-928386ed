import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ClientDesignElements {
  id: string;
  client_id: string;
  lines?: string;
  shapes?: string;
  scale?: string;
  contrast?: string;
  textures?: string;
  fabrics?: string;
  prints?: string;
  accessories?: string;
  recommendations?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export function useClientDesignElements(clientId: string | undefined) {
  return useQuery({
    queryKey: ["client_design_elements", clientId],
    enabled: !!clientId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("client_design_elements")
        .select("*")
        .eq("client_id", clientId!)
        .maybeSingle();
      if (error) throw error;
      return data as ClientDesignElements | null;
    },
  });
}

export function useUpsertDesignElements() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (el: Omit<ClientDesignElements, "id" | "created_at" | "updated_at">) => {
      const { data: existing } = await supabase
        .from("client_design_elements")
        .select("id")
        .eq("client_id", el.client_id)
        .maybeSingle();

      if (existing) {
        const { data, error } = await supabase
          .from("client_design_elements")
          .update(el)
          .eq("id", existing.id)
          .select()
          .single();
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase.from("client_design_elements").insert(el).select().single();
        if (error) throw error;
        return data;
      }
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ["client_design_elements", vars.client_id] }),
  });
}
