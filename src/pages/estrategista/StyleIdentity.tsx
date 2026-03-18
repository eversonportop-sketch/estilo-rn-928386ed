import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Sparkles, Save, Check, Loader2, Pencil, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useClients } from "@/hooks/useClients";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface StyleProfile {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

type StyleDraft = {
  name: string;
  description: string;
};

function useStyleProfiles() {
  return useQuery({
    queryKey: ["style_profiles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("style_profiles").select("*").order("name");
      if (error) throw error;
      return data as StyleProfile[];
    },
  });
}

function useClientStyleProfiles(clientId: string | undefined) {
  return useQuery({
    queryKey: ["client_style_profiles", clientId],
    enabled: !!clientId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("client_style_profiles")
        .select("*")
        .eq("client_id", clientId!);
      if (error) throw error;
      return data as { id: string; client_id: string; style_profile_id: string; profile_type: string; notes: string | null }[];
    },
  });
}

export default function StyleIdentity() {
  const [selectedClient, setSelectedClient] = useState("");
  const [predominantStyle, setPredominantStyle] = useState("");
  const [secondaryStyles, setSecondaryStyles] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingStyleId, setEditingStyleId] = useState<string | null>(null);
  const [styleDraft, setStyleDraft] = useState<StyleDraft>({ name: "", description: "" });
  const [savingStyleId, setSavingStyleId] = useState<string | null>(null);

  const { data: clients, isLoading: loadingClients } = useClients();
  const { data: styleProfiles, isLoading: loadingStyles } = useStyleProfiles();
  const { data: existingProfiles } = useClientStyleProfiles(selectedClient || undefined);
  const qc = useQueryClient();

  useEffect(() => {
    if (existingProfiles && existingProfiles.length > 0) {
      const predominant = existingProfiles.find((p) => p.profile_type === "predominante");
      const secondaries = existingProfiles.filter((p) => p.profile_type === "secundário");
      setPredominantStyle(predominant?.style_profile_id || "");
      setSecondaryStyles(secondaries.map((s) => s.style_profile_id));
      setNotes(predominant?.notes || "");
    } else {
      setPredominantStyle("");
      setSecondaryStyles([]);
      setNotes("");
    }
  }, [existingProfiles]);

  const toggleSecondaryStyle = (styleId: string) => {
    if (styleId === predominantStyle) return;
    setSecondaryStyles((prev) =>
      prev.includes(styleId)
        ? prev.filter((s) => s !== styleId)
        : prev.length < 2
          ? [...prev, styleId]
          : prev,
    );
  };

  const startEditingStyle = (style: StyleProfile) => {
    setEditingStyleId(style.id);
    setStyleDraft({ name: style.name, description: style.description ?? "" });
  };

  const stopEditingStyle = () => {
    setEditingStyleId(null);
    setStyleDraft({ name: "", description: "" });
  };

  const handleStyleDefinitionSave = async (styleId: string) => {
    if (!styleDraft.name.trim()) {
      toast.error("Informe o nome do estilo.");
      return;
    }

    setSavingStyleId(styleId);
    try {
      const { error } = await supabase
        .from("style_profiles")
        .update({ name: styleDraft.name.trim(), description: styleDraft.description.trim() || null })
        .eq("id", styleId);

      if (error) throw error;

      await qc.invalidateQueries({ queryKey: ["style_profiles"] });
      toast.success("Estilo atualizado com sucesso!");
      stopEditingStyle();
    } catch (error: any) {
      toast.error("Erro: " + error.message);
    } finally {
      setSavingStyleId(null);
    }
  };

  const handleSave = async () => {
    if (!selectedClient) {
      toast.error("Selecione uma cliente");
      return;
    }
    if (!predominantStyle) {
      toast.error("Selecione o estilo predominante");
      return;
    }

    setSaving(true);
    try {
      await supabase.from("client_style_profiles").delete().eq("client_id", selectedClient);

      const rows: { client_id: string; style_profile_id: string; profile_type: string; notes: string | null }[] = [
        { client_id: selectedClient, style_profile_id: predominantStyle, profile_type: "predominante", notes: notes || null },
      ];

      for (const sid of secondaryStyles) {
        rows.push({ client_id: selectedClient, style_profile_id: sid, profile_type: "secundário", notes: null });
      }

      const { error } = await supabase.from("client_style_profiles").insert(rows);
      if (error) throw error;

      qc.invalidateQueries({ queryKey: ["client_style_profiles", selectedClient] });
      toast.success("Identidade de estilo salva com sucesso!");
    } catch (e: any) {
      toast.error("Erro: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  const styles = styleProfiles || [];

  const renderStyleCard = (style: StyleProfile, selected: boolean, onSelect: () => void, accent: "primary" | "secondary") => {
    const isEditing = editingStyleId === style.id;
    const isSavingDefinition = savingStyleId === style.id;

    return (
      <div
        key={style.id}
        onClick={() => !isEditing && onSelect()}
        className={cn(
          "p-4 rounded-xl border-2 transition-all duration-200",
          isEditing ? "border-primary bg-primary/5" : "cursor-pointer",
          selected
            ? accent === "primary"
              ? "border-primary bg-primary/10"
              : "border-secondary bg-secondary/10"
            : accent === "primary"
              ? "border-border hover:border-primary/50"
              : "border-border hover:border-secondary/50",
        )}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="font-medium text-sm">{style.name}</span>
          <div className="flex items-center gap-1 shrink-0">
            {!isEditing && selected && (
              <Check className={cn("w-4 h-4", accent === "primary" ? "text-primary" : "text-secondary-foreground")} />
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(event) => {
                event.stopPropagation();
                isEditing ? stopEditingStyle() : startEditingStyle(style);
              }}
            >
              {isEditing ? <X className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-3" onClick={(event) => event.stopPropagation()}>
            <div className="space-y-2">
              <Label htmlFor={`style-name-${style.id}`}>Nome</Label>
              <Input
                id={`style-name-${style.id}`}
                value={styleDraft.name}
                onChange={(event) => setStyleDraft((current) => ({ ...current, name: event.target.value }))}
                placeholder="Nome do estilo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`style-description-${style.id}`}>Descrição</Label>
              <Textarea
                id={`style-description-${style.id}`}
                value={styleDraft.description}
                onChange={(event) => setStyleDraft((current) => ({ ...current, description: event.target.value }))}
                rows={3}
                placeholder="Descreva este estilo"
              />
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <Button type="button" onClick={() => handleStyleDefinitionSave(style.id)} disabled={isSavingDefinition}>
                {isSavingDefinition ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Salvar card
              </Button>
              <Button type="button" variant="outline" onClick={stopEditingStyle}>
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground line-clamp-3">{style.description || "Sem descrição cadastrada."}</p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-display text-foreground tracking-wide">
          Identidade de Estilo
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Defina a identidade de estilo da cliente
        </p>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Selecionar Cliente
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingClients ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" /> Carregando...
            </div>
          ) : (
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="Escolha uma cliente" />
              </SelectTrigger>
              <SelectContent>
                {(clients || []).map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </CardContent>
      </Card>

      {selectedClient && (
        <>
          {loadingStyles ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" /> Carregando estilos...
            </div>
          ) : (
            <>
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Estilo Predominante
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {styles.map((style) =>
                      renderStyleCard(
                        style,
                        predominantStyle === style.id,
                        () => {
                          setPredominantStyle(style.id);
                          setSecondaryStyles((prev) => prev.filter((s) => s !== style.id));
                        },
                        "primary",
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Estilos Secundários (máx. 2)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {styles
                      .filter((s) => s.id !== predominantStyle)
                      .map((style) =>
                        renderStyleCard(
                          style,
                          secondaryStyles.includes(style.id),
                          () => toggleSecondaryStyle(style.id),
                          "secondary",
                        ),
                      )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Observações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notas sobre a identidade de estilo</Label>
                    <Textarea
                      id="notes"
                      placeholder="Adicione observações sobre como a identidade de estilo se manifesta na cliente..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <Button onClick={handleSave} className="w-full md:w-auto" disabled={saving}>
                    {saving ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Salvar Identidade de Estilo
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </>
      )}
    </div>
  );
}
