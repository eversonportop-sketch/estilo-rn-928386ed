import { motion } from "framer-motion";
import { Search, Plus, Eye, Edit, Trash2, Loader2, X, ChevronDown, CircleDot, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useClients, useCreateClient, useUpdateClient, useDeleteClient } from "@/hooks/useClients";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const statusFilters = ["Todos", "Ativo", "Concluído"];

const emptyForm = { name: "", email: "", phone: "", profession: "", objective: "", status: "ativo", password: "" };

export default function ClientsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);
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

  const handleStatusChange = (id: string, status: "ativo" | "concluído") => {
    setStatusUpdatingId(id);
    updateClient.mutate(
      { id, status },
      {
        onSuccess: () => toast.success(`Status atualizado para ${status === "ativo" ? "Ativo" : "Concluído"}.`),
        onError: (e) => toast.error("Erro ao atualizar status: " + e.message),
        onSettled: () => setStatusUpdatingId(null),
      },
    );
  };

  const isSaving = createClient.isPending || updateClient.isPending;

  const getStatusMeta = (status?: string) => {
    const normalizedStatus = status === "concluído" ? "concluído" : "ativo";

    return normalizedStatus === "concluído"
      ? {
          label: "Concluído",
          icon: CheckCircle2,
          badgeClassName: "bg-secondary text-secondary-foreground",
        }
      : {
          label: "Ativo",
          icon: CircleDot,
          badgeClassName: "bg-primary/10 text-primary",
        };
  };

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
              <div className="flex justify-between items-start mb-3 gap-3">
                <div>
                  <h3 className="font-display text-lg">{client.name}</h3>
                  <p className="text-xs text-muted-foreground">{client.email}</p>
                </div>
                {(() => {
                  const statusMeta = getStatusMeta(client.status);
                  const StatusIcon = statusMeta.icon;

                  return (
                    <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full ${statusMeta.badgeClassName}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {statusMeta.label}
                    </span>
                  );
                })()}
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
                    <div className="h-full gold-gradient rounded-full transition-all duration-500" style={{ width: `${client.progress}%` }} />
                  </div>
                </div>
              )}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                <Link to={`/estrategista/clientes/${client.id}`} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-gold transition-colors">
                  <Eye className="w-3.5 h-3.5" /> Ver
                </Link>
                <button onClick={() => openEdit(client)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-gold transition-colors">
                  <Edit className="w-3.5 h-3.5" /> Editar
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      disabled={statusUpdatingId === client.id}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                    >
                      {statusUpdatingId === client.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <getStatusMeta(client.status).icon className="w-3.5 h-3.5" />}
                      {getStatusMeta(client.status).label}
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-40">
                    <DropdownMenuItem onClick={() => handleStatusChange(client.id, "ativo")}>Ativo</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(client.id, "concluído")}>Concluído</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <button onClick={() => handleDelete(client.id)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors ml-auto">
                  <Trash2 className="w-3.5 h-3.5" /> Excluir
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card border border-border rounded-xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-display">{editingId ? "Editar Cliente" : "Nova Cliente"}</h2>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-muted-foreground hover:text-foreground" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nome completo" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@exemplo.com" />
              </div>
              {!editingId && (
                <div>
                  <Label htmlFor="password">Senha de acesso</Label>
                  <Input id="password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Mínimo 6 caracteres" />
                </div>
              )}
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="(00) 00000-0000" />
              </div>
              <div>
                <Label htmlFor="profession">Profissão</Label>
                <Input id="profession" value={form.profession} onChange={(e) => setForm({ ...form, profession: e.target.value })} placeholder="Ex: Advogada" />
              </div>
              <div>
                <Label htmlFor="objective">Objetivo</Label>
                <Input id="objective" value={form.objective} onChange={(e) => setForm({ ...form, objective: e.target.value })} placeholder="Ex: Imagem profissional" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-colors">Cancelar</button>
              <button onClick={handleSave} disabled={isSaving} className="px-5 py-2 text-sm rounded-lg gold-gradient text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2">
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