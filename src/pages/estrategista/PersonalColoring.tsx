import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Palette, Save, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useClients } from "@/hooks/useClients";
import { supabase } from "@/integrations/supabase/client";

type ClientColorPaletteRecord = {
  id: string;
  client_id: string;
  palette_id: string;
  notes: string | null;
};

type PaletteOption = {
  id: string;
  slug: string | null;
  name: string;
  description: string;
  colors: string[];
};

function normalizePaletteColors(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .filter((color): color is string => typeof color === "string" && color.trim().length > 0)
      .slice(0, 5);
  }

  if (typeof value === "string") {
    const trimmed = value.trim();

    if (!trimmed) return [];

    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed
          .filter((color): color is string => typeof color === "string" && color.trim().length > 0)
          .slice(0, 5);
      }
    } catch {
      // ignore invalid JSON and try comma-separated parsing below
    }

    return trimmed
      .split(",")
      .map((color) => color.trim())
      .filter(Boolean)
      .slice(0, 5);
  }

  return [];
}

function normalizePalette(row: Record<string, unknown>): PaletteOption | null {
  const id = typeof row.id === "string" ? row.id : null;

  if (!id) return null;

  const nameCandidates = [row.name, row.season_name, row.title];
  const name =
    nameCandidates.find((value): value is string => typeof value === "string" && value.trim().length > 0) ??
    "Paleta sem nome";

  const description = typeof row.description === "string" ? row.description : "";
  const colors = normalizePaletteColors(row.colors ?? row.palette_colors ?? row.hex_colors ?? row.hex_codes);

  return {
    id,
    slug: typeof row.slug === "string" ? row.slug : null,
    name,
    description,
    colors,
  };
}

async function fetchPaletteOptions(): Promise<PaletteOption[]> {
  const paletteTables = ["color_seasons", "color_palettes"];
  let lastError: Error | null = null;

  for (const tableName of paletteTables) {
    const { data, error } = await supabase.from(tableName).select("*");

    if (error) {
      lastError = error;
      continue;
    }

    const palettes = (data ?? [])
      .map((row) => normalizePalette(row as Record<string, unknown>))
      .filter((palette): palette is PaletteOption => Boolean(palette));

    if (palettes.length > 0) {
      return palettes;
    }
  }

  if (lastError) throw lastError;
  return [];
}

function usePaletteOptions() {
  return useQuery({
    queryKey: ["color-palette-options"],
    queryFn: fetchPaletteOptions,
  });
}

function useClientColorPalette(clientId: string | undefined) {
  return useQuery({
    queryKey: ["client_color_palettes", clientId],
    enabled: !!clientId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("client_color_palettes")
        .select("id, client_id, palette_id, notes")
        .eq("client_id", clientId!)
        .maybeSingle();

      if (error) throw error;
      return data as ClientColorPaletteRecord | null;
    },
  });
}

export default function PersonalColoring() {
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedPalette, setSelectedPalette] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const { data: clients, isLoading: loadingClients } = useClients();
  const { data: existing } = useClientColorPalette(selectedClient || undefined);
  const { data: paletteOptions = [], isLoading: loadingPalettes, error: paletteError } = usePaletteOptions();
  const qc = useQueryClient();

  useEffect(() => {
    if (existing) {
      setSelectedPalette(existing.palette_id || "");
      setNotes(existing.notes || "");
    } else {
      setSelectedPalette("");
      setNotes("");
    }
  }, [existing]);

  const handleSave = async () => {
    if (!selectedClient) {
      toast.error("Selecione uma cliente");
      return;
    }

    if (!selectedPalette) {
      toast.error("Selecione uma paleta de cores");
      return;
    }

    const selectedPaletteOption = paletteOptions.find((palette) => palette.id === selectedPalette);

    if (!selectedPaletteOption) {
      toast.error("A paleta selecionada não possui um ID válido para salvar.");
      return;
    }

    setSaving(true);
    try {
      if (existing) {
        const { error } = await supabase
          .from("client_color_palettes")
          .update({ palette_id: selectedPaletteOption.id, notes: notes || null })
          .eq("id", existing.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("client_color_palettes")
          .insert({ client_id: selectedClient, palette_id: selectedPaletteOption.id, notes: notes || null });

        if (error) throw error;
      }

      qc.invalidateQueries({ queryKey: ["client_color_palettes", selectedClient] });
      toast.success("Coloração pessoal salva com sucesso!");
    } catch (e: any) {
      toast.error("Erro: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-display text-foreground tracking-wide">
          Coloração Pessoal
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Defina a paleta de cores da cliente pelo método sazonal expandido
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
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Palette className="w-5 h-5 text-primary" />
                Paletas de Cores
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingPalettes ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" /> Carregando paletas...
                </div>
              ) : paletteError ? (
                <p className="text-sm text-destructive">
                  Não foi possível carregar as paletas cadastradas no banco.
                </p>
              ) : paletteOptions.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhuma paleta foi encontrada na base de dados.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paletteOptions.map((palette) => (
                    <button
                      key={palette.id}
                      onClick={() => setSelectedPalette(palette.id)}
                      className={cn(
                        "p-4 rounded-xl border-2 transition-all duration-200 text-left",
                        selectedPalette === palette.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <div className="flex items-center justify-between mb-3 gap-3">
                        <div>
                          <span className="font-medium block">{palette.name}</span>
                          {palette.slug && (
                            <span className="text-xs text-muted-foreground">{palette.slug}</span>
                          )}
                        </div>
                        {selectedPalette === palette.id && (
                          <Check className="w-5 h-5 text-primary shrink-0" />
                        )}
                      </div>
                      {palette.colors.length > 0 && (
                        <div className="flex gap-1 mb-2">
                          {palette.colors.map((color, idx) => (
                            <div
                              key={`${palette.id}-${idx}`}
                              className="w-8 h-8 rounded-md shadow-sm"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {palette.description || "Sem descrição cadastrada."}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Observações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notes">Notas sobre a coloração pessoal</Label>
                <Textarea
                  id="notes"
                  placeholder="Adicione observações sobre como as cores funcionam para a cliente..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </div>
              <Button
                onClick={handleSave}
                className="w-full md:w-auto"
                disabled={saving || loadingPalettes || paletteOptions.length === 0}
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Salvar Coloração Pessoal
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
