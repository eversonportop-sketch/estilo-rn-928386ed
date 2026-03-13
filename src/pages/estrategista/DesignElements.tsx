import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Shapes, Save, Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useClients } from "@/hooks/useClients";
import { useClientDesignElements, useAddDesignElement, useDeleteDesignElement } from "@/hooks/useDesignElements";

const elementCategories = [
  "Linhas", "Formas", "Cores", "Texturas", "Fibras Têxteis",
  "Bolsas", "Carteiras", "Joias", "Sapatos", "Acessórios",
];

export default function DesignElements() {
  const [selectedClient, setSelectedClient] = useState("");
  const [newElement, setNewElement] = useState({ categoria: "", descricao: "", observacao: "" });

  const { data: clients, isLoading: loadingClients } = useClients();
  const { data: elements, isLoading: loadingElements } = useClientDesignElements(selectedClient || undefined);
  const addElement = useAddDesignElement();
  const deleteElement = useDeleteDesignElement();

  const handleAdd = () => {
    if (!newElement.categoria || !newElement.descricao) { toast.error("Preencha categoria e descrição"); return; }
    addElement.mutate({
      client_id: selectedClient,
      categoria: newElement.categoria,
      descricao: newElement.descricao,
      observacao: newElement.observacao,
    }, {
      onSuccess: () => { setNewElement({ categoria: "", descricao: "", observacao: "" }); toast.success("Elemento adicionado!"); },
      onError: (e) => toast.error("Erro: " + e.message),
    });
  };

  const handleDelete = (id: string) => {
    deleteElement.mutate({ id, clientId: selectedClient }, {
      onSuccess: () => toast.success("Elemento removido!"),
      onError: (e) => toast.error("Erro: " + e.message),
    });
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-display text-foreground tracking-wide">Elementos de Design</h1>
        <p className="text-sm text-muted-foreground mt-2">Defina as recomendações de elementos de design para a cliente</p>
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
          {loadingElements ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> Carregando elementos...</div>
          ) : (
            <>
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shapes className="w-5 h-5 text-primary" />
                    Adicionar Elemento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Categoria</Label>
                      <Select value={newElement.categoria} onValueChange={(v) => setNewElement({ ...newElement, categoria: v })}>
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>
                          {elementCategories.map((cat) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Descrição</Label>
                      <Input placeholder="Ex: Linhas retas e verticais" value={newElement.descricao} onChange={(e) => setNewElement({ ...newElement, descricao: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Observação Estratégica</Label>
                      <Input placeholder="Ex: Alongam a silhueta" value={newElement.observacao} onChange={(e) => setNewElement({ ...newElement, observacao: e.target.value })} />
                    </div>
                  </div>
                  <Button onClick={handleAdd} variant="outline" disabled={addElement.isPending}>
                    {addElement.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                    Adicionar Elemento
                  </Button>
                </CardContent>
              </Card>

              {(elements || []).length > 0 && (
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader><CardTitle className="text-lg">Elementos Cadastrados</CardTitle></CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {(elements || []).map((element) => (
                        <div key={element.id} className="flex items-center justify-between p-4 rounded-lg border border-border bg-background/50">
                          <div>
                            <span className="text-xs text-primary font-medium uppercase tracking-wider">{element.categoria}</span>
                            <p className="font-medium mt-1">{element.descricao}</p>
                            {element.observacao && <p className="text-sm text-muted-foreground mt-1">{element.observacao}</p>}
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(element.id)} className="text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
