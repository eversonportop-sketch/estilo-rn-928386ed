import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Scan, Save, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useClients } from "@/hooks/useClients";
import { useClientMorphology, useUpsertMorphology } from "@/hooks/useMorphology";

const silhouettes = [
  {
    id: "ampulheta-x",
    name: "Silhueta Ampulheta X",
    description: "Ombros e quadris alinhados com cintura bem definida",
  },
  { id: "oito", name: "Silhueta em 8", description: "Similar à ampulheta com curvas mais suaves" },
  { id: "triangulo-a", name: "Silhueta Triângulo em A", description: "Quadris mais largos que os ombros" },
  { id: "curvilinea", name: "Silhueta Curvilínea", description: "Curvas acentuadas em todo o corpo" },
  { id: "triangulo-invertido", name: "Silhueta Triângulo Invertido", description: "Ombros mais largos que os quadris" },
  { id: "retangulo", name: "Retângulo", description: "Ombros, cintura e quadris com medidas similares" },
  { id: "oblonga", name: "Oblonga", description: "Silhueta alongada e esguia" },
];

export default function Morphology() {
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedSilhouette, setSelectedSilhouette] = useState("");
  const [shoulders, setShoulders] = useState("");
  const [waist, setWaist] = useState("");
  const [hips, setHips] = useState("");
  const [verticalLine, setVerticalLine] = useState("");
  const [proportions, setProportions] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [notes, setNotes] = useState("");

  const { data: clients, isLoading: loadingClients } = useClients();
  const { data: morphology, isLoading: loadingMorph } = useClientMorphology(selectedClient || undefined);
  const upsertMorphology = useUpsertMorphology();

  useEffect(() => {
    if (morphology) {
      setSelectedSilhouette(morphology.body_type || "");
      setShoulders(morphology.shoulders || "");
      setWaist(morphology.waist || "");
      setHips(morphology.hips || "");
      setVerticalLine(morphology.vertical_line || "");
      setProportions(morphology.proportions || "");
      setRecommendations(morphology.recommendations || "");
      setNotes(morphology.notes || "");
    } else {
      setSelectedSilhouette("");
      setShoulders("");
      setWaist("");
      setHips("");
      setVerticalLine("");
      setProportions("");
      setRecommendations("");
      setNotes("");
    }
  }, [morphology]);

  const handleSave = () => {
    if (!selectedClient) {
      toast.error("Selecione uma cliente");
      return;
    }
    if (!selectedSilhouette) {
      toast.error("Selecione uma silhueta");
      return;
    }
    const sil = silhouettes.find((s) => s.id === selectedSilhouette);
    upsertMorphology.mutate(
      {
        client_id: selectedClient,
        body_type: sil?.name || selectedSilhouette,
        shoulders,
        waist,
        hips,
        vertical_line: verticalLine,
        proportions,
        recommendations,
        notes,
      },
      {
        onSuccess: () => toast.success("Morfologia salva com sucesso!"),
        onError: (e) => toast.error("Erro ao salvar: " + e.message),
      },
    );
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-display text-foreground tracking-wide">Morfologia</h1>
        <p className="text-sm text-muted-foreground mt-2">Defina a análise morfológica da cliente</p>
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
              <Loader2 className="w-4 h-4 animate-spin" /> Carregando clientes...
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
          {loadingMorph ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" /> Carregando dados...
            </div>
          ) : (
            <>
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Scan className="w-5 h-5 text-primary" />
                    Silhuetas Corporais
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {silhouettes.map((silhouette) => (
                      <button
                        key={silhouette.id}
                        onClick={() => setSelectedSilhouette(silhouette.id)}
                        className={cn(
                          "p-5 rounded-xl border-2 transition-all duration-200 text-left",
                          selectedSilhouette === silhouette.id
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50",
                        )}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{silhouette.name}</span>
                          {selectedSilhouette === silhouette.id && <Check className="w-5 h-5 text-primary" />}
                        </div>
                        <p className="text-sm text-muted-foreground">{silhouette.description}</p>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Detalhes e Observações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Ombros</Label>
                      <Textarea
                        placeholder="Descrição dos ombros..."
                        value={shoulders}
                        onChange={(e) => setShoulders(e.target.value)}
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Cintura</Label>
                      <Textarea
                        placeholder="Descrição da cintura..."
                        value={waist}
                        onChange={(e) => setWaist(e.target.value)}
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Quadris</Label>
                      <Textarea
                        placeholder="Descrição dos quadris..."
                        value={hips}
                        onChange={(e) => setHips(e.target.value)}
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Linha Vertical</Label>
                      <Textarea
                        placeholder="Linha vertical..."
                        value={verticalLine}
                        onChange={(e) => setVerticalLine(e.target.value)}
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Proporções</Label>
                      <Textarea
                        placeholder="Proporções corporais..."
                        value={proportions}
                        onChange={(e) => setProportions(e.target.value)}
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Recomendações</Label>
                      <Textarea
                        placeholder="Recomendações gerais..."
                        value={recommendations}
                        onChange={(e) => setRecommendations(e.target.value)}
                        rows={2}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notas sobre a morfologia</Label>
                    <Textarea
                      id="notes"
                      placeholder="Adicione observações sobre proporções, pontos de atenção e recomendações de modelagem..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <Button onClick={handleSave} className="w-full md:w-auto" disabled={upsertMorphology.isPending}>
                    {upsertMorphology.isPending ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Salvar Morfologia
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
