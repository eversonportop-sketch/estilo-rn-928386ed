import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";
import { useClients } from "@/hooks/useClients";
import { useLooks, useAddLook, useUpdateLook, useDeleteLook } from "@/hooks/useLooks";
import { useWardrobeItems } from "@/hooks/useWardrobeItems";
import { useConsultantId } from "@/hooks/useConsultantId";
import EmptyState from "@/components/EmptyState";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function LooksGallery() {
  const { data: clients, isLoading: clientsLoading } = useClients();
  const { data: consultantId } = useConsultantId();
  const [selectedClient, setSelectedClient] = useState<string>("");
  const { data: looks, isLoading: looksLoading } = useLooks(selectedClient || undefined);
  const { data: wardrobeItems } = useWardrobeItems(selectedClient || undefined);
  const addLook = useAddLook();
  const updateLook = useUpdateLook();
  const deleteLookMutation = useDeleteLook();

  const [showForm, setShowForm] = useState(false);
  const [editingLook, setEditingLook] = useState<any>(undefined);
  const [formData, setFormData] = useState({
    name: "",
    strategic_note: "",
    pecas: [] as string[],
  });

  const getPecaName = (id: string) => wardrobeItems?.find((p) => p.id === id)?.name ?? null;

  const openNew = () => {
    setEditingLook(undefined);
    setFormData({ name: "", strategic_note: "", pecas: [] });
    setShowForm(true);
  };

  const openEdit = (look: any) => {
    setEditingLook(look);
    setFormData({
      name: look.name || "",
      strategic_note: look.strategic_note || "",
      pecas: look.pecas || [],
    });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!selectedClient) {
      toast.error("Selecione uma cliente primeiro.");
      return;
    }
    if (!formData.name.trim()) {
      toast.error("Nome do look é obrigatório.");
      return;
    }
    if (!consultantId) {
      toast.error("Erro: consultant_id não encontrado.");
      return;
    }

    if (editingLook) {
      updateLook.mutate(
        {
          id: editingLook.id,
          client_id: selectedClient,
          name: formData.name,
          strategic_note: formData.strategic_note,
          pecas: formData.pecas,
        },
        {
          onSuccess: () => {
            toast.success("Look atualizado!");
            setShowForm(false);
          },
          onError: (e) => toast.error("Erro: " + e.message),
        },
      );
    } else {
      addLook.mutate(
        {
          client_id: selectedClient,
          consultant_id: consultantId,
          name: formData.name,
          strategic_note: formData.strategic_note,
          pecas: formData.pecas,
          created_by_role: "consultora",
          source_type: "manual",
          occasion_id: null,
        },
        {
          onSuccess: () => {
            toast.success("Look criado!");
            setShowForm(false);
          },
          onError: (e) => toast.error("Erro: " + e.message),
        },
      );
    }
  };

  const handleDelete = (lookId: string) => {
    if (!confirm("Excluir este look?")) return;
    deleteLookMutation.mutate(
      { id: lookId, clientId: selectedClient },
      {
        onSuccess: () => toast.success("Look excluído!"),
        onError: (e) => toast.error("Erro: " + e.message),
      },
    );
  };

  const togglePeca = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      pecas: prev.pecas.includes(id) ? prev.pecas.filter((p) => p !== id) : [...prev.pecas, id],
    }));
  };

  return (
    <div className="p-8 lg:p-12 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-start mb-10"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-light mb-1">Composições Estratégicas de Looks</h1>
          <p className="text-muted-foreground text-sm">Looks montados para suas clientes</p>
        </div>
        {selectedClient && (
          <button
            onClick={openNew}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg gold-gradient text-primary-foreground text-sm"
          >
            <Plus className="w-4 h-4" /> Criar Look
          </button>
        )}
      </motion.div>

      <div className="mb-8">
        <label className="text-sm text-muted-foreground block mb-2">Selecionar Cliente</label>
        <Select value={selectedClient} onValueChange={setSelectedClient}>
          <SelectTrigger className="w-full max-w-xs">
            <SelectValue placeholder={clientsLoading ? "Carregando..." : "Selecione uma cliente"} />
          </SelectTrigger>
          <SelectContent>
            {(clients || []).map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!selectedClient ? (
        <EmptyState
          title="Selecione uma cliente"
          subtitle="Escolha uma cliente para ver e criar looks."
          icon={<Sparkles className="w-7 h-7 text-muted-foreground/40" />}
        />
      ) : looksLoading ? (
        <div className="flex items-center justify-center py-20 gap-2 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" /> Carregando looks...
        </div>
      ) : (looks || []).length === 0 ? (
        <EmptyState
          title="Nenhum look criado ainda."
          subtitle="Crie seu primeiro look para esta cliente."
          icon={<Sparkles className="w-7 h-7 text-muted-foreground/40" />}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(looks || []).map((look, i) => (
            <motion.div
              key={look.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="card-luxury overflow-hidden group"
            >
              <div className="aspect-[3/4] bg-muted flex items-center justify-center relative">
                <span className="text-5xl opacity-20">✨</span>
                <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(look)}
                    className="p-2 rounded-lg bg-card/90 border border-border/50 hover:border-gold/40 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(look.id)}
                    className="p-2 rounded-lg bg-card/90 border border-border/50 hover:border-destructive/40 transition-colors text-destructive"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl mb-2">{look.name}</h3>
                <div className="flex flex-wrap gap-1 mb-3">
                  {(look.pecas || []).map((pid: string) => {
                    const name = getPecaName(pid);
                    return name ? (
                      <span key={pid} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        {name}
                      </span>
                    ) : null;
                  })}
                </div>
                {look.strategic_note && <p className="text-xs text-muted-foreground mb-2">{look.strategic_note}</p>}
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold/10 text-gold-dark">
                  {look.created_by_role === "estrategista" ? "Criado pela estrategista" : "Criado pela cliente"}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card rounded-2xl border border-border/50 shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <h2 className="font-display text-2xl font-light">{editingLook ? "Editar Look" : "Criar Look"}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-muted transition-colors">
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <Label>Nome do Look</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Power Meeting"
                />
              </div>
              <div className="space-y-2">
                <Label>
                  Selecionar Peças ({formData.pecas.length} selecionada{formData.pecas.length !== 1 ? "s" : ""})
                </Label>
                {(wardrobeItems || []).length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">Nenhuma peça no guarda-roupa.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                    {(wardrobeItems || []).map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => togglePeca(item.id)}
                        className={`p-3 rounded-xl border text-left text-xs transition-all ${formData.pecas.includes(item.id) ? "border-gold bg-gold/5" : "border-border hover:border-gold/30"}`}
                      >
                        <span className="font-medium block truncate">{item.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label>Observação Estratégica</Label>
                <Textarea
                  value={formData.strategic_note}
                  onChange={(e) => setFormData({ ...formData, strategic_note: e.target.value })}
                  rows={3}
                  placeholder="Notas sobre este look..."
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm hover:bg-muted transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2.5 rounded-lg gold-gradient text-primary-foreground text-sm"
                >
                  {editingLook ? "Salvar" : "Criar Look"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
