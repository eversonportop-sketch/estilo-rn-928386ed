import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Save, User, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useClients } from "@/hooks/useClients";
import { useClientStrategicAnalysis, useUpsertStrategicAnalysis } from "@/hooks/useStrategicAnalysis";

export default function StrategicAnalysis() {
  const [selectedClient, setSelectedClient] = useState("");
  const [analysis, setAnalysis] = useState({
    imageObjective: "",
    strengths: "",
    challenges: "",
    positioning: "",
    personalBrand: "",
    lifestyle: "",
    profession: "",
    communicationObjective: "",
    recommendations: "",
    notes: ""
  });

  const { data: clients, isLoading: loadingClients } = useClients();
  const { data: existing, isLoading: loadingAnalysis } = useClientStrategicAnalysis(selectedClient || undefined);
  const upsert = useUpsertStrategicAnalysis();

  useEffect(() => {
    if (existing) {
      setAnalysis({
        imageObjective: existing.image_objective || "",
        strengths: existing.strengths || "",
        challenges: existing.challenges || "",
        positioning: existing.positioning || "",
        personalBrand: existing.personal_brand || "",
        lifestyle: existing.lifestyle || "",
        profession: existing.profession || "",
        communicationObjective: existing.communication_objective || "",
        recommendations: existing.recommendations || "",
        notes: existing.notes || "",
      });
    } else {
      setAnalysis({ imageObjective: "", strengths: "", challenges: "", positioning: "", personalBrand: "", lifestyle: "", profession: "", communicationObjective: "", recommendations: "", notes: "" });
    }
  }, [existing]);

  const handleSave = () => {
    if (!selectedClient) { toast.error("Selecione uma cliente"); return; }
    upsert.mutate({
      client_id: selectedClient,
      objetivo_imagem: analysis.objetivoImagem,
      pontos_fortes_visuais: analysis.pontosFortesVisuais,
      pontos_atencao: analysis.pontosAtencao,
      estrategia_posicionamento: analysis.estrategiaPosicionamento,
      recomendacoes_gerais: analysis.recomendacoesGerais,
      observacoes_adicionais: analysis.observacoesAdicionais,
    }, {
      onSuccess: () => toast.success("Análise estratégica salva com sucesso!"),
      onError: (e) => toast.error("Erro: " + e.message),
    });
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-display text-foreground tracking-wide">Análise Estratégica de Imagem</h1>
        <p className="text-sm text-muted-foreground mt-2">Defina o posicionamento estratégico de imagem da cliente</p>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2"><User className="w-5 h-5 text-primary" /> Selecionar Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingClients ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> Carregando...</div>
          ) : (
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger className="w-full md:w-64"><SelectValue placeholder="Escolha uma cliente" /></SelectTrigger>
              <SelectContent>
                {(clients || []).map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
        </CardContent>
      </Card>

      {selectedClient && (
        <>
          {loadingAnalysis ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> Carregando...</div>
          ) : (
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2"><FileText className="w-5 h-5 text-primary" /> Análise Estratégica</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="objetivo">Objetivo de Imagem</Label>
                  <Input id="objetivo" placeholder="Ex: Transmitir autoridade e sofisticação no ambiente corporativo" value={analysis.objetivoImagem} onChange={(e) => setAnalysis({ ...analysis, objetivoImagem: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fortes">Pontos Fortes Visuais</Label>
                  <Textarea id="fortes" placeholder="Descreva os pontos fortes visuais da cliente..." value={analysis.pontosFortesVisuais} onChange={(e) => setAnalysis({ ...analysis, pontosFortesVisuais: e.target.value })} rows={3} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="atencao">Pontos de Atenção</Label>
                  <Textarea id="atencao" placeholder="Descreva pontos que requerem atenção..." value={analysis.pontosAtencao} onChange={(e) => setAnalysis({ ...analysis, pontosAtencao: e.target.value })} rows={3} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estrategia">Estratégia de Posicionamento</Label>
                  <Textarea id="estrategia" placeholder="Defina a estratégia de posicionamento de imagem..." value={analysis.estrategiaPosicionamento} onChange={(e) => setAnalysis({ ...analysis, estrategiaPosicionamento: e.target.value })} rows={4} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recomendacoes">Recomendações Gerais</Label>
                  <Textarea id="recomendacoes" placeholder="Liste as recomendações gerais para a cliente..." value={analysis.recomendacoesGerais} onChange={(e) => setAnalysis({ ...analysis, recomendacoesGerais: e.target.value })} rows={4} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="observacoes">Observações Adicionais</Label>
                  <Textarea id="observacoes" placeholder="Observações adicionais..." value={analysis.observacoesAdicionais} onChange={(e) => setAnalysis({ ...analysis, observacoesAdicionais: e.target.value })} rows={3} />
                </div>
                <Button onClick={handleSave} className="w-full md:w-auto" disabled={upsert.isPending}>
                  {upsert.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Salvar Análise
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
