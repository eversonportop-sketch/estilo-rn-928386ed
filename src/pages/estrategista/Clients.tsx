import { motion } from "framer-motion";
import { Search, Plus, Eye, Edit, Trash2, Loader2, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useClients, useCreateClient, useUpdateClient, useDeleteClient } from "@/hooks/useClients";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const statusFilters = ["Todos", "Ativo", "Concluído"];

const emptyForm = { name: "", email: "", phone: "", profession: "", objective: "", status: "ativo", password: "" };

export default function ClientsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const { data: clients, isLoading } = useClients();
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();
  const deleteClient = useDeleteClient();

  const filtered = (clients || []).filter((c) => {
    const matchSearch = (c.name || "").toLowerCase().includes(search.toLowerCase()) || (c.email || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "Todos" || (c.status || "ativo") === statusFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (client: any) => {
    setEditingId(client.id);
    setForm({
      name: client.name || "",
      email: client.email || "",
      phone: client.phone || "",
      profession: client.profession || "",
      objective: client.objective || "",
      status: client.status || "ativo",
      password: "",
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name || !form.email) {
      toast.error("Nome e email são obrigatórios.");
      return;
    }
    if (editingId) {
      updateClient.mutate({ id: editingId, ...form }, {
        onSuccess: () => { toast.success("Cliente atualizada!"); setShowModal(false); },
        onError: (e) => toast.error("Erro: " + e.message),
      });
    } else {
      createClient.mutate(form, {
        onSuccess: () => { toast.success("Cliente criada!"); setShowModal(false); },
        onError: (e) => toast.error("Erro: " + e.message),
      });
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta cliente?")) return;
    deleteClient.mutate(id, {
      onSuccess: () => toast.success("Cliente excluída!"),
      onError: (e) => toast.error("Erro: " + e.message),
    });
  };

  const isSaving = createClient.isPending || updateClient.isPending;

  return (
    <div className="p-8 lg:p-12 max-w-7xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-4xl font-display font-light mb-1">Clientes</h1>
          <p className="text-muted-foreground text-sm">Gerencie suas clientes e consultorias</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-5 py-2.5 rounded-lg gold-gradient text-primary-foreground text-sm hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" />
          Nova Cliente
        </button>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Buscar por nome ou email..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-1 focus:ring-gold/40" />
        </div>
        <div className="flex gap-2">
          {statusFilters.map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-4 py-2.5 rounded-lg text-sm transition-all ${statusFilter === s ? "gold-gradient text-primary-foreground" : "border border-border hover:border-gold/40"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 gap-2 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" /> Carregando clientes...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p>Nenhuma cliente encontrada.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((client, i) => (
            <motion.div key={client.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }} className="card-luxury p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-display text-lg">{client.name}</h3>
                  <p className="text-xs text-muted-foreground">{client.email}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${(client.status || "ativo") === "concluído" ? "bg-green-100 text-green-700" : "bg-gold/10 text-gold-dark"}`}>
                  {(client.status || "ativo") === "concluído" ? "Concluído" : "Ativo"}
                </span>
              </div>
              <div className="text-sm space-y-1 mb-4">
                {client.profession && <p><span className="text-muted-foreground">Profissão:</span> {client.profession}</p>}
                {client.objective && <p><span className="text-muted-foreground">Objetivo:</span> {client.objective}</p>}
              </div>
              {client.progress != null && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Progresso</span>
                    <span className="text-gold-dark font-medium">{client.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full gold-gradient rounded-full" style={{ width: `${client.progress}%` }} />
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                <Link to={`/estrategista/clientes/${client.id}`} className="flex items-center gap-1 text-xs px-3 py-2 rounded-lg border border-border hover:border-gold/40 transition-colors">
                  <Eye className="w-3 h-3" /> Ver
                </Link>
                <button onClick={() => openEdit(client)} className="flex items-center gap-1 text-xs px-3 py-2 rounded-lg border border-border hover:border-gold/40 transition-colors">
                  <Edit className="w-3 h-3" /> Editar
                </button>
                <button onClick={() => handleDelete(client.id)} className="flex items-center gap-1 text-xs px-3 py-2 rounded-lg border border-border hover:border-destructive/40 text-destructive/70 hover:text-destructive transition-colors">
                  <Trash2 className="w-3 h-3" /> Excluir
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal Nova/Editar Cliente */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card border border-border rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-display">{editingId ? "Editar Cliente" : "Nova Cliente"}</h2>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Nome *</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nome completo" />
              </div>
              <div>
                <Label>Email *</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@exemplo.com" />
              </div>
              <div>
                <Label>Telefone</Label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="(00) 00000-0000" />
              </div>
              <div>
                <Label>Profissão</Label>
                <Input value={form.profession} onChange={(e) => setForm({ ...form, profession: e.target.value })} placeholder="Profissão" />
              </div>
              <div>
                <Label>Objetivo</Label>
                <Input value={form.objective} onChange={(e) => setForm({ ...form, objective: e.target.value })} placeholder="Objetivo da consultoria" />
              </div>
              {!editingId && (
                <div>
                  <Label>Senha de acesso *</Label>
                  <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Senha para login da cliente" />
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-6 justify-end">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted transition-colors">Cancelar</button>
              <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-5 py-2 text-sm rounded-lg gold-gradient text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50">
                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingId ? "Salvar" : "Criar"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
