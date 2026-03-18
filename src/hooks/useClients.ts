import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Client {
  id: string;
  consultant_id?: string;
  user_id?: string;
  name: string;
  full_name?: string;
  email: string;
  phone?: string;
  profession?: string;
  objective?: string;
  status?: string;
  progress?: number;
  created_at?: string;
}

export function useClients() {
  return useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data, error } = await supabase.from("clients").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Client[];
    },
  });
}

export function useClient(id: string | undefined) {
  return useQuery({
    queryKey: ["clients", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase.from("clients").select("*").eq("id", id!).single();
      if (error) throw error;
      return data as Client;
    },
  });
}

interface CreateClientInput {
  name: string;
  email: string;
  phone?: string;
  profession?: string;
  objective?: string;
  password: string;
  consultant_id: string;
}

export function useCreateClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateClientInput) => {
      const { data: sessionData, error: sessionError } = await supabase.auth.refreshSession();
      const session = sessionData?.session;

      if (sessionError || !session) {
        throw new Error("Sessão expirada. Faça login novamente.");
      }

      const body = {
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        profession: payload.profession,
        objective: payload.objective,
        password: payload.password,
        consultant_id: payload.consultant_id,
      };

      const { data, error } = await supabase.functions.invoke("create-client", { body });

      if (error) {
        let detailedMessage = error.message || "Erro ao criar cliente";
        let errorResponse: unknown = null;
        const context = (error as { context?: Response }).context;

        if (context) {
          try {
            errorResponse = await context.json();
          } catch {
            try {
              errorResponse = await context.text();
            } catch {
              errorResponse = null;
            }
          }
        }

        if (errorResponse && typeof errorResponse === "object") {
          const typedResponse = errorResponse as { error?: string; message?: string };
          detailedMessage = typedResponse.error || typedResponse.message || detailedMessage;
        } else if (typeof errorResponse === "string" && errorResponse.trim()) {
          detailedMessage = errorResponse;
        }

        throw new Error(detailedMessage);
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      return data as Client;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["clients"] }),
  });
}

export function useUpdateClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Client> & { id: string }) => {
      const { data, error } = await supabase.from("clients").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data as Client;
    },
    onMutate: async ({ id, ...updates }) => {
      await qc.cancelQueries({ queryKey: ["clients"] });
      const previousClients = qc.getQueryData<Client[]>(["clients"]);

      qc.setQueryData<Client[]>(["clients"], (current = []) =>
        current.map((client) => (client.id === id ? { ...client, ...updates } : client)),
      );

      return { previousClients };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousClients) {
        qc.setQueryData(["clients"], context.previousClients);
      }
    },
    onSuccess: (data) => {
      qc.setQueryData<Client[]>(["clients"], (current = []) =>
        current.map((client) => (client.id === data.id ? data : client)),
      );
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["clients"] }),
  });
}

export function useDeleteClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("clients").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["clients"] }),
  });
}
