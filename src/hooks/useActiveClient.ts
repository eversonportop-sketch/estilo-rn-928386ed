import { supabase } from '@/integrations/supabase/client';

// Legacy fallback
export function getActiveClientId(): string | null {
  return sessionStorage.getItem("client_id");
}

export function setActiveClientId(clientId: string) {
  sessionStorage.setItem("client_id", clientId);
}

// Resolve client_id from authenticated user
export async function resolveClientId(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return getActiveClientId();

  const { data } = await supabase
    .from('clients')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (data?.id) {
    setActiveClientId(data.id);
    return data.id;
  }

  return getActiveClientId();
}
