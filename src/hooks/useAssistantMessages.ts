import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AssistantMessage {
  id: string;
  client_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at?: string;
}

export function useAssistantMessages(clientId: string | undefined) {
  return useQuery({
    queryKey: ['assistant_messages', clientId],
    enabled: !!clientId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('assistant_messages')
        .select('*')
        .eq('client_id', clientId!)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data as AssistantMessage[];
    },
  });
}

export function useAddAssistantMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (msg: Omit<AssistantMessage, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('assistant_messages')
        .insert(msg)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ['assistant_messages', vars.client_id] }),
  });
}
