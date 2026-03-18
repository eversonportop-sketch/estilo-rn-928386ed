import { motion } from "framer-motion";
import { Sparkles, Loader2, Plus, Save, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useLooks, useAddLook } from "@/hooks/useLooks";
import { getActiveClientId } from "@/hooks/useActiveClient";
import { useClient } from "@/hooks/useClients";
import { supabase } from "@/integrations/supabase/client";
import EmptyState from "@/components/EmptyState";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OCASIOES } from "@/types/wardrobe";
import { toast } from "sonner";

type OccasionOption = {
  id: string;
  label: string;
};

const FILTROS_OCASIAO = ["Todos", ...OCASIOES] as const;

function normalizeOccasionLabel(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function normalizeOccasion(row: Record<string, unknown>): OccasionOption | null {
  const id = typeof row.id === "string" ? row.id : null;
  const labelCandidate = [row.name, row.label, row.title].find(
    (value): value is string => typeof value === "string" && value.trim().length > 0,
  );

  if (!id || !labelCandidate) return null;

  return { id, label: labelCandidate };
}

function useOccasionOptions() {
  return useQuery({
    queryKey: ["occasion-options"],
    queryFn: async () => {
      const { data, error } = await supabase.from("occasions").select("*").order("name");
      if (error) throw error;

      const available = (data ?? [])
        .map((row) => normalizeOccasion(row as Record<string, unknown>))
        .filter((option): option is OccasionOption => Boolean(option));

      const availableMap = new Map(available.map((option) => [normalizeOccasionLabel(option.label), option]));

      return OCASIOES.map((label) => availableMap.get(normalizeOccasionLabel(label))).filter(
        (option): option is OccasionOption => Boolean(option),
      );
    },
  });
}

export default function ClientLooks() {
  const clientId = getActiveClientId();
  const { data: looks, isLoading: looksLoading } = useLooks(clientId ?? undefined);
  const { data: client } = useClient(clientId ?? undefined);
  const { data: occasionOptions = [], isLoading: occasionsLoading } = useOccasionOptions();
  const addLook = useAddLook();

  const [activeFilter, setActiveFilter] = useState("Todos");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    occasionId: "",
    strategic_note: "",
  });

  const occasionMap = new Map(occasionOptions.map((option) => [option.id, option.label]));
  const looksEstrategista = (looks || []).filter((look) => look.created_by_role === "strategist");
  const looksCliente = (looks || []).filter((look) => look.created_by_role === "client");

  const getOccasionLabel = (occasionId?: string | null) => {
    if (!occasionId) return "Sem ocasião";
    return occasionMap.get(occasionId) ?? "Sem ocasião";
  };

  const applyFilter = (list: typeof looks) =>
    activeFilter === "Todos"
      ? list || []
      : (list || []).filter((look) => getOccasionLabel(look.occasion_id) === activeFilter);

  const openCreateForm = () => {
    setFormData({
      name: "",
      occasionId: occasionOptions[0]?.id ?? "",
      strategic_note: "",
    });
    setShowCreateForm(true);
  };

  const handleCreateLook = () => {
    if (!clientId) {
      toast.error("Cliente não identificada.");
      return;
    }

    if (!client?.consultant_id) {
      toast.error("Não foi possível identificar a estrategista desta cliente.");
      return;
    }

    if (!formData.name.trim()) {
      toast.error("Informe o nome do look.");
      return;
    }

    if (!formData.occasionId) {
      toast.error("Selecione uma ocasião.");
      return;
    }

    addLook.mutate(
      {
        client_id: clientId,
        consultant_id: client.consultant_id,
        name: formData.name.trim(),
        strategic_note: formData.strategic_note.trim() || null,
        pecas: [],
        created_by_role: "client",
        source_type: "manual",
        occasion_id: formData.occasionId,
      },
      {
        onSuccess: () => {
          toast.success("Look criado com sucesso!");
          setShowCreateForm(false);
          setFormData({ name: "", occasionId: "", strategic_note: "" });
        },
        onError: (error: any) => toast.error("Erro: " + error.message),
      },
    );
  };

  const renderLookCard = (look: any, i: number) => (
    <motion.div
      key={look.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.08 }}
      className="card-luxury overflow-hidden group"
    >
      <div className="aspect-[3/4] bg-muted flex items-center justify-center">
        <span className="text-5xl opacity-20">✨</span>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-3 gap-3">
          <h3 className="font-display text-xl">{look.name}</h3>
          <span className="text-xs px-3 py-1 rounded-full bg-gold/10 text-gold-dark">
            {getOccasionLabel(look.occasion_id)}
          </span>
        </div>
        {look.strategic_note && <p className="text-xs text-muted-foreground mb-3">{look.strategic_note}</p>}
        <span
          className={`text-[10px] px-2 py-0.5 rounded-full ${
            look.created_by_role === "strategist" ? "bg-gold/10 text-gold-dark" : "bg-muted text-muted-foreground"
          }`}
        >
          {look.created_by_role === "strategist" ? "Criado pela estrategista" : "Criado por mim"}
        </span>
      </div>
    </motion.div>
  );

  if (looksLoading) {
    return (
      <div className="p-8 lg:p-12 max-w-6xl flex items-center justify-center py-20">
        <Loader2 className="w-5 h-5 animate-spin text-gold" />
        <span className="ml-2 text-sm text-muted-foreground">Carregando looks...</span>
      </div>
    );
  }

  return (
    <>
      <div className="p-8 lg:p-12 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-start gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-display font-light mb-1">Meus Looks</h1>
            <p className="text-muted-foreground text-sm">Looks montados especialmente para você</p>
          </div>
          <Button onClick={openCreateForm} disabled={!clientId || occasionsLoading || occasionOptions.length === 0}>
            <Plus className="w-4 h-4" />
            Criar Look
          </Button>
        </motion.div>

        <div className="flex gap-2 mb-10 overflow-x-auto pb-2">
          {FILTROS_OCASIAO.map((filtro) => (
            <button
              key={filtro}
              onClick={() => setActiveFilter(filtro)}
              className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${
                activeFilter === filtro ? "gold-gradient text-primary-foreground" : "border border-border hover:border-gold/40"
              }`}
            >
              {filtro}
            </button>
          ))}
        </div>

        <section className="mb-12">
          <h2 className="font-display text-2xl font-light mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-gold" /> Looks recomendados pela estrategista
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applyFilter(looksEstrategista).length === 0 ? (
              <EmptyState
                title="Nenhum look recomendado ainda."
                subtitle="Sua estrategista ainda não criou looks para você."
                icon={<Sparkles className="w-7 h-7 text-muted-foreground/40" />}
              />
            ) : (
              applyFilter(looksEstrategista).map((look, i) => renderLookCard(look, i))
            )}
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl font-light mb-6">Looks que funcionaram para mim</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applyFilter(looksCliente).length === 0 ? (
              <EmptyState
                title="Você ainda não criou looks próprios."
                subtitle="Use o botão Criar Look para registrar combinações que funcionaram bem para você."
                icon={<Sparkles className="w-7 h-7 text-muted-foreground/40" />}
              />
            ) : (
              applyFilter(looksCliente).map((look, i) => renderLookCard(look, i))
            )}
          </div>
        </section>
      </div>

      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card rounded-2xl border border-border/50 shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <h2 className="font-display text-2xl font-light">Criar Look</h2>
              <Button type="button" variant="ghost" size="icon" onClick={() => setShowCreateForm(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="look-name">Nome do look</Label>
                <Input
                  id="look-name"
                  value={formData.name}
                  onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
                  placeholder="Ex: Reunião importante"
                />
              </div>

              <div className="space-y-2">
                <Label>Ocasião</Label>
                <Select
                  value={formData.occasionId}
                  onValueChange={(value) => setFormData((current) => ({ ...current, occasionId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={occasionsLoading ? "Carregando ocasiões..." : "Selecione uma ocasião"} />
                  </SelectTrigger>
                  <SelectContent>
                    {occasionOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="look-note">Nota</Label>
                <Textarea
                  id="look-note"
                  rows={4}
                  value={formData.strategic_note}
                  onChange={(event) => setFormData((current) => ({ ...current, strategic_note: event.target.value }))}
                  placeholder="Descreva por que esse look funcionou bem para você."
                />
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <Button onClick={handleCreateLook} disabled={addLook.isPending || occasionsLoading || occasionOptions.length === 0}>
                  {addLook.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Salvar Look
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
