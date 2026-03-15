import { motion } from "framer-motion";
import { Search, Plus, Eye, Edit, Trash2, Loader2, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useClients, useCreateClient, useUpdateClient, useDeleteClient } from "@/hooks/useClients";
import { useAuth } from "@/hooks/useAuth";
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

  const { user } = useAuth();
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
    if (!editingId && !form.password) {
      toast.error("Senha é obrigatória para criar a cliente.");
      return;
    }
    if (!editingId && form.password.length < 6) {
      toast.error("A senha deve ter no mínimo 6 caracteres.");
      return;
    }
    if (editingId) {
      const { password, ...updates } = form;
      updateClient.mutate({ id: editingId, ...updates }, {
        onSuccess: () => { toast.success("Cliente atualizada!"); setShowModal(false); },
        onError: (e) => toast.error("Erro: " + e.message),
      });
    } else {
      if (!user?.id) {
        toast.error("Estrategista não autenticada.");
        return;
      }

      createClient.mutate({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        profession: form.profession || undefined,
        objective: form.objective || undefined,
        password: form.password,
        consultant_id: user.id,
      }, {
        onSuccess: () => { toast.success("Cliente criada com login!"); setShowModal(false); },
        onError: (e) => {
          const message = e instanceof Error ? e.message : "Erro ao criar cliente";
          toast.error(message);
        },
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
              {client.progress != null