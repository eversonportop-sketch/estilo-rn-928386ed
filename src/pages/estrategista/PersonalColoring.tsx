import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Palette, Save, Check, Loader2, Pencil, X } from "lucide-react";
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
  seasonType: string | null;
  name: string;
  description: string;
  colors: string[];
};

type PaletteDraft = {
  name: string;
  description: string;
  colors: string[];
};

function normalizePaletteColors(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (typeof item === "string") return item.trim();
      if (item && typeof item === "object") {
        const record = item as Record<string, unknown>;
        const candidate = [record.hex, record.color_hex, record.color, record.value].find(
          (entry): entry is string => typeof entry === "string" && entry.trim().length > 0,
        );
        return candidate?.trim() ?? "";
      }
      return "";
    })
    .filter(Boolean)
    .slice(0, 5);
}

function normalizePalette(row: Record<string, unknown>): PaletteOption | null {
  const id = typeof row.id === "string" ? row.id : null;
  if (!id) return null;

  return {
    id,
    seasonType: typeof row.season_type === "string" ? row.season_type : null,
    name: typeof row.name === "string" && row.name.trim() ? row.name : "Paleta sem nome",
    description: typeof row.description === "string" ? row.description : "",
    colors: normalizePaletteColors(row.color_palette_colors),
  };
}

function isValidHexColor(value: string) {
  return /^#([0-9A-Fa-f]{6})$/.test(value.trim());
}

function buildPaletteDraft(palette: PaletteOption): PaletteDraft {
  return {
    name: palette.name,
    description: palette.description,
    colors: [...palette.colors, ...Array.from({ length: Math.max(0, 5 - palette.colors.length) }, () => "")].slice(0, 5),
  };
}

async function fetchPaletteOptions(): Promise<PaletteOption[]> {
  const { data, error } = await supabase
    .from("color_palettes")
    .select(
      `
        id,
        name,
        description,
        season_type,
        consultant_id,
        color_palette_colors ( hex )
      `,
    )
    .eq("is_active", true)
    .order("name");

  if (error) throw error;

  return (data ?? [])
    .map((row) => normalizePalette(row as Record<string, unknown>))
    .filter((palette): palette is PaletteOption => Boolean(palette));
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
  const [editingPaletteId, setEditingPaletteId] = useState<string | null>(null);
  const [paletteDraft, setPaletteDraft] = useState<PaletteDraft>({ name: "", description: "", colors: ["", "", "", "", ""] });
  const [savingPaletteId, setSavingPaletteId] = useState<string | null>(null);

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

  const startEditingPalette = (palette: PaletteOption) => {
    setEditingPaletteId(palette.id);
    setPaletteDraft(buildPaletteDraft(palette));
  };

  const stopEditingPalette = () => {
    setEditingPaletteId(null);
    setPaletteDraft({ name: "", description: "", colors: ["", "", "", "", ""] });
  };

  const updateDraftColor = (index: number, value: string) => {
    setPaletteDraft((current) => {
      const nextColors = [...current.colors];
      nextColors[index] = value;
      return { ...current, colors: nextColors };
    });
  };

  const handlePaletteDefinitionSave = async (paletteId: string) => {
    const normalizedName = paletteDraft.name.trim();
    const normalizedDescription = paletteDraft.description.trim();
    const validColors = paletteDraft.colors.map((color) => color.trim()).filter((color) => isValidHexColor(color));

    if (!normalizedName) {
      toast.error("Informe o nome da paleta.");
      return;
    }

    if (validColors.length === 0) {
      toast.error("Informe pelo menos uma cor válida no formato #RRGGBB.");
      return;
    }

    setSavingPaletteId(paletteId);
    try {
      const { error: paletteError } = await supabase
        .from("color_palettes")
        .update({ name: normalizedName, description: normalizedDescription || null })
        .eq("id", paletteId);

      if (paletteError) throw paletteError;

      const { error: deleteError } = await supabase.from("color_palette_colors").delete().eq("palette_id", paletteId);
      if (deleteError) throw deleteError;

      const { error: insertError } = await supabase.from("color_palette_colors").insert(
        validColors.map((hex) => ({ palette_id: paletteId, hex })),
      );

      if (insertError) throw insertError;

      await qc.invalidateQueries({ queryKey: ["color-palette-options"] });
      toast.success("Paleta atualizada com sucesso!");
      stopEditingPalette();
    } catch (error: any) {
      toast.error("Erro: " + error.message);
    } finally {
      setSavingPaletteId(null);
    }
  };

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
                  {paletteOptions.map((palette) => {
                    const isEditing = editingPaletteId === palette.id;
                    const isSavingDefinition = savingPaletteId === palette.id;

                    return (
                      <div
                        key={palette.id}
                        onClick={() => !isEditing && setSelectedPalette(palette.id)}
                        className={cn(
                          "p-4 rounded-xl border-2 transition-all duration-200",
                          isEditing ? "border-primary bg-primary/5" : "cursor-pointer",
                          selectedPalette === palette.id && !isEditing
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50",
                        )}
                      >
                        <div className="flex items-start justify-between mb-3 gap-3">
                          <div>
                            <span className="font-medium block">{palette.name}</span>
                            {palette.slug && (
                              <span className="text-xs text-muted-foreground">{palette.slug}</span>
                            )}
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {!isEditing && selectedPalette === palette.id && (
                              <Check className="w-5 h-5 text-primary" />
                            )}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(event) => {
                                event.stopPropagation();
                                isEditing ? stopEditingPalette() : startEditingPalette(palette);
                              }}
                            >
                              {isEditing ? <X className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
                            </Button>
                          </div>
                        </div>

                        {isEditing ? (
                          <div className="space-y-4" onClick={(event) => event.stopPropagation()}>
                            <div className="space-y-2">
                              <Label htmlFor={`palette-name-${palette.id}`}>Nome</Label>
                              <Input
                                id={`palette-name-${palette.id}`}
                                value={paletteDraft.name}
                                onChange={(event) => setPaletteDraft((current) => ({ ...current, name: event.target.value }))}
                                placeholder="Nome da paleta"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`palette-description-${palette.id}`}>Descrição</Label>
                              <Textarea
                                id={`palette-description-${palette.id}`}
                                value={paletteDraft.description}
                                onChange={(event) =>
                                  setPaletteDraft((current) => ({ ...current, description: event.target.value }))
                                }
                                rows={3}
                                placeholder="Descreva a paleta"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Cores (até 5)</Label>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {paletteDraft.colors.map((color, index) => {
                                  const validHex = isValidHexColor(color);

                                  return (
                                    <div key={`${palette.id}-color-${index}`} className="flex items-center gap-3 rounded-lg border border-border p-3">
                                      <div
                                        className="h-10 w-10 rounded-md border border-border shrink-0"
                                        style={{ backgroundColor: validHex ? color.trim() : "hsl(var(--muted))" }}
                                      />
                                      <Input
                                        value={color}
                                        onChange={(event) => updateDraftColor(index, event.target.value.toUpperCase())}
                                        placeholder="#FF5733"
                                      />
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 pt-1">
                              <Button
                                type="button"
                                onClick={() => handlePaletteDefinitionSave(palette.id)}
                                disabled={isSavingDefinition}
                              >
                                {isSavingDefinition ? (
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                  <Save className="w-4 h-4 mr-2" />
                                )}
                                Salvar card
                              </Button>
                              <Button type="button" variant="outline" onClick={stopEditingPalette}>
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
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
                          </>
                        )}
                      </div>
                    );
                  })}
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
