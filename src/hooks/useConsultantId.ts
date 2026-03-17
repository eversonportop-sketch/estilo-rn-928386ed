import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useConsultantId() {
  return useQuery({
    queryKey: ["consultant_id"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from("consultants")
        .select("id")
        .eq("profile_id", user.id)
        .single();

      if (error) throw error;
      return data?.id as string;
    },
    staleTime: Infinity,
  });
}
