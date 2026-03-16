import { useState, useEffect } from "react";
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
import { useQuery, useQueryClient } from "@tanstack/react-query";

const colorPalettes = [
  { id: "verao-suave", name: "Verão Suave", colors: ["#B8A99A", "#C4B7A6", "#D4C5B5", "#9B8B7A", "#A89888"], description: "Tons suaves e acinzentados" },
  { id: "inverno-profundo", name: "Inverno Profundo", colors: ["#1a1a2e", "#16213e", "#0f3460", "#533483", "#2c2c54"], description: "Cores intensas e profundas" },
  { id: "inverno-frio", name: "Inverno Frio", colors: ["#2C3E50", "#34495E", "#5D6D7E", "#85929E", "#1B2631"], description: "Tons frios e dramáticos" },
  { id: "outono-profundo", name: "Outono Profundo", colors: ["#8B4513", "#A0522D", "#CD853F", "#D2691E", "#8B0000"], description: "Cores ricas e terrosas" },
  { id: "primavera-clara", name: "Primavera Clara", colors: ["#FFB6C1", "#FFDAB9", "#E6E6FA", "#98FB98", "#87CEEB"], description: "Tons claros e delicados" },
  { id: "inverno-brilhante", name: "Inverno Brilhante", colors: ["#FF1493", "#00CED1", "#9400D3", "#FF4500", "#00FF7F"], description: "Cores vibrantes e contrastantes" },
  { id: "outono-suave", name: "Outono Suave", colors: ["#C4A77D", "#D4B896", "#C9B89D", "#B5A18E", "#A89987"], description: "Tons neutros e suaves" },
  { id: "primavera-quente", name: "Primavera Quente", colors: ["#FF7F50", "#FFD700", "#FF6347", "#FFA500", "#FF8C00"], description: "Tons quentes e ensolarados" },
  { id: "verao-frio", name: "Verão Frio", colors: ["#B0C4DE", "#87CEEB", "#ADD8E6", "#E6E6FA", "#DDA0DD"], description: "Tons frescos e suaves" },
  { id: "verao-claro", name: "Verão Claro", colors: ["#F0E68C", "#E0FFFF", "#FAFAD2", "#FFE4E1", "#F5F5DC"], description: "Tons luminosos e claros" },
  { id: "primavera-brilhante", name: "Primavera Brilhante", colors: ["#00FF00", "#FF69B4", "#00BFFF", "#FF1493", "#7FFF00"], description: "Cores vivas e energéticas" },
  { id: "outono-quente", name: "Outono Quente", colors: ["#B8860B", "#DAA520", "#CD853F", "#D2B48C", "#BC8F8F"], description: "Tons dourados e acobreados" },
];

function useClientColorPalette(clientId: string | undefined) {
  return useQuery({
    queryKey: ["client_color_palettes", clientId],
    enabled: !!clientId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("client_color_palettes")
        .select("*")
        .eq("client_id", clientId!)
        .maybeSingle();
      if (error) throw error;
      return data as { id: string; client_id: string; palette_id: string; notes: string | null } | null;
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

    setSaving(true);
    try {
      if (existing) {
        const { error } = await supabase
          .from("client_color_palettes")
          .update({ palette_id: selectedPalette, notes: notes || null })
          .eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("client_color_palettes")
          .insert({ client_id: selectedClient, palette_id: selectedPalette, notes: notes || null });
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {colorPalettes.map((palette) => (
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
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium">{palette.name}</span>
                      {selectedPalette === palette.id && (
                        <Check className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <div className="flex gap-1 mb-2">
                      {palette.colors.map((color, idx) => (
                        <div
                          key={idx}
                          className="w-8 h-8 rounded-md shadow-sm"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {palette.description}
                    </p>
                  </button>
                ))}
              </div>
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
              <Button onClick={handleSave} className="w-full md:w-auto" disabled={saving}>
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
