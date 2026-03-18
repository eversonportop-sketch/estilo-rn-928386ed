import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Shapes, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useClients } from "@/hooks/useClients";
import { useClientDesignElements, useUpsertDesignElements } from "@/hooks/useDesignElements";

export default function DesignElements() {
  const [selectedClient, setSelectedClient] = useState("");
  const [form, setForm] = useState({
    lines: "",
    shapes: "",
    textures: "",
    fabrics: "",
    prints: "",
    accessories: "",
    recommendations: "",
    notes: "",
  });

  const { data: clients, isLoading: loadingClients } = useClients();
  const { data: elements, isLoading: loadingElements } = useClientDesignElements(selectedClient || undefined);
  const upsert = useUpsertDesignElements();

  useEffect(() => {
    if (elements) {
      setForm({
        lines: elements.lines || "",
        shapes: elements.shapes || "",
        textures: elements.textures || "",
        fabrics: elements.fabrics || "",
        prints: elements.prints || "",
        accessories: elements.accessories || "",
        recommendations: elements.recommendations || "",
        notes: elements.notes || "",
      });
    } else {
      setForm({
        lines: "",
        shapes: "",
        textures: "",
        fabrics: "",
        prints: "",
        accessories: "",
        recommendations: "",
        notes: "",
      });
    }
  }, [elements]);

  const handleSave = () => {
    if (!selectedClient) {
      toast.error("Selecione uma cliente");
      return;
    }
    upsert.mutate(
      { client_id: selectedClient, ...form },
      {
        onSuccess: () => toast.success("Elementos de design salvos!"),
        onError: (e) => toast.error("Erro: " + e.message),
      },
    );
  };

  const fields = [
    { key: "lines", label: "Linhas" },
    { key: "shapes", label: "Formas" },
    { key: "textures", label: "Texturas" },
    { key: "fabrics", label: "Tecidos" },
    { key: "prints", label: "Estampas" },
    { key: "accessories", label: "Acessórios" },
    { key: "recommendations", label: "Recomendações" },
    { key: "notes", label: "Observações" },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-display text-foreground tracking-wide">Elementos de Design</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Defina as recomendações de elementos de design para a cliente
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
                {(clients || []).map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </CardContent>
      </Card>

      {selectedClient && (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shapes className="w-5 h-5 text-primary" />
              Elementos de Design
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loadingElements ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" /> Carregando...
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fields.map(({ key, label }) => (
                    <div key={key} className="space-y-2">
                      <Label>{label}</Label>
                      <Textarea
                        placeholder={`${label}...`}
                        value={form[key as keyof typeof form]}
                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        rows={2}
                      />
                    </div>
                  ))}
                </div>
                <Button onClick={handleSave} className="w-full md:w-auto" disabled={upsert.isPending}>
                  {upsert.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Salvar Elementos
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
