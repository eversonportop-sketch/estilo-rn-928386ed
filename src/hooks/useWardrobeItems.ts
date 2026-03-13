import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface WardrobeItem {
  id: string;
  client_id: string;
  nome: string;
  categoria: string;
  cor: string;
  ocasiao: string;
  observacao?: string;
  foto?: string;
  criado_por: string;
  created_at?: string;
}

export function useWardrobeItems(clientId: string | undefined) {
  return useQuery({
    queryKey: ['wardrobe_items', clientId],
    enabled: !!clientId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wardrobe_items')
        .select('*')
        .eq('client_id', clientId!)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as WardrobeItem[];
    },
  });
}

export function useAddWardrobeItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (item: Omit<WardrobeItem, 'id' | 'created_at'>) => {
      const { data, error } = await supabase.from('wardrobe_items').insert(item).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ['wardrobe_items', vars.client_id] }),
  });
}

export function useUpdateWardrobeItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, client_id, ...updates }: Partial<WardrobeItem> & { id: string; client_id: string }) => {
      const { data, error } = await supabase.from('wardrobe_items').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return { ...data, client_id };
    },
    onSuccess: (data) => qc.invalidateQueries({ queryKey: ['wardrobe_items', data.client_id] }),
  });
}

export function useDeleteWardrobeItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, clientId }: { id: string; clientId: string }) => {
      const { error } = await supabase.from('wardrobe_items').delete().eq('id', id);
      if (error) throw error;
      return clientId;
    },
    onSuccess: (clientId) => qc.invalidateQueries({ queryKey: ['wardrobe_items', clientId] }),
  });
}
