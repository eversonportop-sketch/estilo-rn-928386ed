import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DbLook {
  id: string;
  client_id: string;
  consultant_id?: string;
  occasion_id?: string | null;
  name: string;
  strategic_note?: string;
  created_by_role?: string;
  source_type?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DbLookItem {
  id: string;
  look_id: string;
  wardrobe_item_id: string;
  sort_order?: number;
}

export interface LookWithItems extends DbLook {
  pecas: string[];
}

export function useLooks(clientId: string | undefined) {
  return useQuery({
    queryKey: ["looks", clientId],
    enabled: !!clientId,
    queryFn: async () => {
      const { data: looks, error } = await supabase
        .from("looks")
        .select("*")
        .eq("client_id", clientId!)
        .order("created_at", { ascending: false });
      if (error) throw error;

      const lookIds = (looks || []).map((l) => l.id);
      let lookItems: DbLookItem[] = [];
      if (lookIds.length > 0) {
        const { data, error: err2 } = await supabase.from("look_items").select("*").in("look_id", lookIds);
        if (err2) throw err2;
        lookItems = data || [];
      }

      return (looks || []).map((look) => ({
        ...look,
        pecas: lookItems.filter((li) => li.look_id === look.id).map((li) => li.wardrobe_item_id),
      })) as LookWithItems[];
    },
  });
}

export function useAddLook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ pecas, ...look }: Omit<LookWithItems, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase.from("looks").insert(look).select().single();
      if (error) throw error;

      if (pecas.length > 0) {
        const items = pecas.map((wardrobe_item_id, idx) => ({
          look_id: data.id,
          wardrobe_item_id,
          sort_order: idx,
        }));
        const { error: err2 } = await supabase.from("look_items").insert(items);
        if (err2) throw err2;
      }

      return data;
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ["looks", vars.client_id] }),
  });
}

export function useUpdateLook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      pecas,
      client_id,
      ...updates
    }: Partial<LookWithItems> & { id: string; client_id: string }) => {
      const { error } = await supabase.from("looks").update(updates).eq("id", id);
      if (error) throw error;

      if (pecas) {
        await supabase.from("look_items").delete().eq("look_id", id);
        if (pecas.length > 0) {
          const items = pecas.map((wardrobe_item_id, idx) => ({
            look_id: id,
            wardrobe_item_id,
            sort_order: idx,
          }));
          await supabase.from("look_items").insert(items);
        }
      }
      return client_id;
    },
    onSuccess: (clientId) => qc.invalidateQueries({ queryKey: ["looks", clientId] }),
  });
}

export function useDeleteLook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, clientId }: { id: string; clientId: string }) => {
      await supabase.from("look_items").delete().eq("look_id", id);
      const { error } = await supabase.from("looks").delete().eq("id", id);
      if (error) throw error;
      return clientId;
    },
    onSuccess: (clientId) => qc.invalidateQueries({ queryKey: ["looks", clientId] }),
  });
}
