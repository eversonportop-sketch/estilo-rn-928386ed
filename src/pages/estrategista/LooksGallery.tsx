import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";
import { useClients } from "@/hooks/useClients";
import { useLooks, useAddLook, useUpdateLook, useDeleteLook } from "@/hooks/useLooks";
import { useWardrobeItems } from "@/hooks/useWardrobeItems";
import { OCASIOES } from "@/types/wardrobe";
import LookForm from "@/components/LookForm";
import EmptyState from "@/components/EmptyState";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const FILTROS_OCASIAO = ["Todos", ...OCASIOES] as const;

export default function LooksGallery() {
  const { data: clients, isLoading: clientsLoading } = useClients();
  const [selectedClient, setSelectedClient] = useState<string>("");
  const { data: looks, isLoading: looksLoading } = useLooks(selectedClient || undefined);
  const { data: wardrobeItems } = useWardrobeItems(selectedClient || undefined);
  const addLook = useAddLook();
  const updateLook = useUpdateLook();
  const deleteLookMutation = useDeleteLook();

  const [activeFilter, setActiveFilter] = useState("Todos");
  const [showForm, setShowForm] = useState(false);
  const [editingLook, setEditingLook] = useState<any>(undefined);

  const filtered = activeFilter === "Todos" ? (looks || []) : (looks || []).filter((l) => l.ocasiao === activeFilter);
  const getPecaName = (id: string) => wardrobeItems?.find(p => p.id === id)?.nome ?? null;

  const handleSave = (data: any) => {
    if (!selectedClient) {
      toast.error("Selecione uma cliente primeiro.");
      return;
    }
    if (editingLook) {
      updateLook.mutate({
        id: editingLook.id,
        client_id: selectedClient,
        nome: data.nome,
        ocasiao: data.ocasiao,
        observacao: data.observacao,
        pecas: data.pecas,
        criado_por: "estrategista",
      }, {
        onSuccess: () => toast.success("Look atualizado!"),
        onError: (e) => toast.error("Erro: " + e.message),
      });
    } else {
      addLook.mutate({
        client_id: selectedClient,
        nome: data.nome,
        ocasiao: data.ocasiao,
        observacao: data.observacao,
        pecas: data.pecas,
        criado_por: "estrategista",
      }, {
        onSuccess: () => toast.success("Look criado!"),
        onError: (e) => toast.error("Erro: " + e.message),
      });
    }
    setEditingLook(undefined);
  };

  const handleDelete = (lookId: string) => {
    if (!confirm("Excluir este look?")) return;
    deleteLookMutation.mutate({ id: lookId, clientId: selectedClient }, {
      onSuccess: () => toast.success("Look excluído!"),
      onError: (e) => toast.error("Erro: " + e.message),
    });
  };

  // Map wardrobe items to the format LookForm expects
  const pecasForForm = (wardrobeItems || []).map(item => ({
    id: item.id,
    nome: item.nome,
    categoria: item.categoria as any,
    cor: item.cor,
    ocasiao: item.ocasiao as any,
    observacao: item.observacao || "",
    criadoPor: item.criado_por as any,
    foto: item.foto,
  }));

  return (
    <div className="p-8 lg:p-12 max-w-6xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-light mb-1">Composições Estratégicas de Looks</h1>
          <p className="text-muted-foreground text-sm">Looks montados para suas clientes</p>
        </div>
        {selectedClient && (
          <div className="flex gap-2">
            <button onClick={() => { setEditingLook(undefined); setShowForm(true); }} className="flex items-center gap-2 px-5 py-2.5 rounded-lg gold-gradient text-primary-foreground text-sm">
              <Plus className="w-4 h-4" /> Criar Look
            </button>
          </div>
        )}
      </motion.div>

      <div className="mb-8">
        <label className="text-sm text-muted-foreground block mb-2">Selecionar Cliente</label>
        <Select value={selectedClient} onValueChange={setSelectedClient}>
          <SelectTrigger className="w-full max-w-xs">
            <SelectValue placeholder={clientsLoading ? "Carregando..." : "Selecione uma cliente"} />
          </SelectTrigger>
          <SelectContent>
            {(clients || []).map(c => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!selectedClient ? (
        <EmptyState title="Selecione uma cliente" subtitle="Escolha uma cliente para ver e criar looks." icon={<Sparkles className="w-7 h-7 text-muted-foreground/40" />} />
      ) : looksLoading ? (
        <div className="flex items-center justify-center py-20 gap-2 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" /> Carregando looks...
        </div>
      ) : (
        <>
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {FILTROS_OCASIAO.map((f) => (
              <button key={f} onClick={() => setActiveFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${activeFilter === f ? "gold-gradient text-primary-foreground" : "border border-border hover:border-gold/40"}`}>
                {f}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.length === 0 ? (
              <EmptyState title="Nenhum look criado ainda." subtitle="Crie seu primeiro look para esta cliente." icon={<Sparkles className="w-7 h-7 text-muted-foreground/40" />} />
            ) : filtered.map((look, i) => (
              <motion.div key={look.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="card-luxury overflow-hidden group">
                <div className="aspect-[3/4] bg-muted flex items-center justify-center relative">
                  <span className="text-5xl opacity-20">✨</span>
                  <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditingLook(look); setShowForm(true); }} className="p-2 rounded-lg bg-card/90 border border-border/50 hover:border-gold/40 transition-colors">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(look.id)} className="p-2 rounded-lg bg-card/90 border border-border/50 hover:border-destructive/40 transition-colors text-destructive">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-display text-xl">{look.nome}</h3>
                    <span className="text-xs px-3 py-1 rounded-full bg-gold/10 text-gold-dark">{look.ocasiao}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {(look.pecas || []).map((pid: string) => {
                      const name = getPecaName(pid);
                      return name ? <span key={pid} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{name}</span> : null;
                    })}
                  </div>
                  {look.observacao && <p className="text-xs text-muted-foreground mb-2">{look.observacao}</p>}
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${look.criado_por === "estrategista" ? "bg-gold/10 text-gold-dark" : "bg-muted text-muted-foreground"}`}>
                    {look.criado_por === "estrategista" ? "Criado pela estrategista" : "Criado pela cliente"}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {showForm && (
        <LookForm
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditingLook(undefined); }}
          pecas={pecasForForm}
          initial={editingLook ? {
            id: editingLook.id,
            nome: editingLook.nome,
            ocasiao: editingLook.ocasiao,
            pecas: editingLook.pecas || [],
            observacao: editingLook.observacao || "",
            criadoPor: "estrategista",
          } : undefined}
          criadoPor="estrategista"
        />
      )}
    </div>
  );
}
