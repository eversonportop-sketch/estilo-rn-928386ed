import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Sparkles, Save, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const styleIdentities = [
  { id: "glamurosa", name: "Glamurosa", description: "Elegância sofisticada e presença marcante" },
  { id: "natural", name: "Natural", description: "Simplicidade autêntica e conforto" },
  { id: "artistica", name: "Artística", description: "Criatividade e expressão única" },
  { id: "teatral", name: "Teatral", description: "Drama, ousadia e impacto visual" },
  { id: "jovial", name: "Jovial", description: "Energia, leveza e modernidade" },
  { id: "nostalgica", name: "Nostálgica", description: "Romantismo e referências vintage" },
  { id: "ponderado", name: "Ponderado", description: "Equilíbrio, discrição e refinamento" },
  { id: "contemporanea", name: "Contemporânea", description: "Atualidade e tendências atuais" },
  { id: "sofisticada", name: "Sofisticada", description: "Luxo discreto e atemporalidade" },
  { id: "inovadora", name: "Inovadora", description: "Vanguarda e experimentação" },
];

const mockClients = [
  { id: "1", name: "Maria Silva" },
  { id: "2", name: "Ana Costa" },
  { id: "3", name: "Juliana Santos" },
];

export default function StyleIdentity() {
  const [selectedClient, setSelectedClient] = useState("");
  const [predominantStyle, setPredominantStyle] = useState("");
  const [secondaryStyles, setSecondaryStyles] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  const toggleSecondaryStyle = (styleId: string) => {
    if (styleId === predominantStyle) return;
    setSecondaryStyles((prev) =>
      prev.includes(styleId)
        ? prev.filter((s) => s !== styleId)
        : prev.length < 2
        ? [...prev, styleId]
        : prev
    );
  };

  const handleSave = () => {
    if (!selectedClient) {
      toast.error("Selecione uma cliente");
      return;
    }
    if (!predominantStyle) {
      toast.error("Selecione o estilo predominante");
      return;
    }
    toast.success("Identidade de estilo salva com sucesso!");
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
          <Select value={selectedClient} onValueChange={setSelectedClient}>
            <SelectTrigger className="w-full md:w-64">
              <SelectValue placeholder="Escolha uma cliente" />
            </SelectTrigger>
            <SelectContent>
              {mockClients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedClient && (
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
                {styleIdentities.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => {
                      setPredominantStyle(style.id);
                      setSecondaryStyles((prev) => prev.filter((s) => s !== style.id));
                    }}
                    className={cn(
                      "p-4 rounded-xl border-2 transition-all duration-200 text-left",
                      predominantStyle === style.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{style.name}</span>
                      {predominantStyle === style.id && (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {style.description}
                    </p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Estilos Secundários (máx. 2)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {styleIdentities
                  .filter((s) => s.id !== predominantStyle)
                  .map((style) => (
                    <button
                      key={style.id}
                      onClick={() => toggleSecondaryStyle(style.id)}
                      className={cn(
                        "p-4 rounded-xl border-2 transition-all duration-200 text-left",
                        secondaryStyles.includes(style.id)
                          ? "border-secondary bg-secondary/10"
                          : "border-border hover:border-secondary/50"
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{style.name}</span>
                        {secondaryStyles.includes(style.id) && (
                          <Check className="w-4 h-4 text-secondary-foreground" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {style.description}
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
                <Label htmlFor="notes">Notas sobre a identidade de estilo</Label>
                <Textarea
                  id="notes"
                  placeholder="Adicione observações sobre como a identidade de estilo se manifesta na cliente..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </div>
              <Button onClick={handleSave} className="w-full md:w-auto">
                <Save className="w-4 h-4 mr-2" />
                Salvar Identidade de Estilo
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
