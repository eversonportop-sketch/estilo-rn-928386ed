import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface WardrobeItem {
  id: string;
  client_id: string;
  consultant_id?: string;
  category_id?: string | null;
  occasion_id?: string | null;
  name: string;
  item_type?: string;
  color?: string;
  notes?: string;
  image_url?: string;
  created_by_role?: string;
  source_type?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export function useWardrobeItems(clientId: string | undefined) {
  return useQuery({
    queryKey: ["wardrobe_items", clientId],
    enabled: !!clientId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wardrobe_items")
        .select("*")
        .eq("client_id", clientId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as WardrobeItem[];
    },
  });
}

export function useAddWardrobeItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (item: Omit<WardrobeItem, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase.from("wardrobe_items").insert(item).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ["wardrobe_items", vars.client_id] }),
  });
}

export function useUpdateWardrobeItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, client_id, ...updates }: Partial<WardrobeItem> & { id: string; client_id: string }) => {
      const { data, error } = await supabase.from("wardrobe_items").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return { ...data, client_id };
    },
    onSuccess: (data) => qc.invalidateQueries({ queryKey: ["wardrobe_items", data.client_id] }),
  });
}

export function useDeleteWardrobeItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, clientId }: { id: string; clientId: string }) => {
      // Get item to find storage path
      const { data: item } = await supabase.from("wardrobe_items").select("image_url").eq("id", id).single();

      // Delete from DB
      const { error } = await supabase.from("wardrobe_items").delete().eq("id", id);
      if (error) throw error;

      // Delete from storage if image exists
      if (item?.image_url) {
        try {
          const url = new URL(item.image_url);
          const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/wardrobe\/(.+)/);
          if (pathMatch) {
            await supabase.storage.from("wardrobe").remove([pathMatch[1]]);
          }
        } catch (_) { /* ignore storage cleanup errors */ }
      }

      return clientId;
    },
    onSuccess: (clientId) => qc.invalidateQueries({ queryKey: ["wardrobe_items", clientId] }),
  });
}
