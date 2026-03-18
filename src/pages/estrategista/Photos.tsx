import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { Plus, Image, Trash2, Loader2 } from "lucide-react";
import { useClients } from "@/hooks/useClients";
import { useWardrobeItems, useDeleteWardrobeItem } from "@/hooks/useWardrobeItems";
import { useConsultantId } from "@/hooks/useConsultantId";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";

export default function StrategistPhotos() {
  const { data: clients, isLoading: clientsLoading } = useClients();
  const { data: consultantId } = useConsultantId();
  const [selectedClient, setSelectedClient] = useState<string>("");
  const { data: items, isLoading: itemsLoading } = useWardrobeItems(selectedClient || undefined);
  const deleteItem = useDeleteWardrobeItem();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const qc = useQueryClient();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedClient) return;

    if (!consultantId) {
      toast.error("Erro: consultant_id não encontrado. Faça login novamente.");
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const fileName = `${selectedClient}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage.from("wardrobe").upload(fileName, file, { upsert: false });
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from("wardrobe").getPublicUrl(fileName);
      const name = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");

      const { error: insertError } = await supabase.from("wardrobe_items").insert({
        client_id: selectedClient,
        consultant_id: consultantId,
        name,
        image_url: urlData.publicUrl,
        created_by_role: "consultora",
        source_type: "manual",
        is_active: true,
      });
      if (insertError) throw insertError;

      qc.invalidateQueries({ queryKey: ["wardrobe_items", selectedClient] });
      toast.success("Foto adicionada com sucesso!");
    } catch (err: any) {
      toast.error("Erro ao enviar foto: " + (err.message || ""));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm("Excluir esta foto?")) return;
    deleteItem.mutate(
      { id, clientId: selectedClient },
      {
        onSuccess: () => toast.success("Foto excluída!"),
        onError: (e) => toast.error("Erro: " + e.message),
      },
    );
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 md:mb-10">
          <div>
            <h1 className="text-2xl md:text-4xl font-display font-light mb-1">Inspirações de Looks</h1>
            <p className="text-muted-foreground text-xs md:text-sm">Galeria de inspirações e referências visuais</p>
          </div>
          {selectedClient && (
            <div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl gold-gradient text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                {uploading ? "Enviando..." : "Adicionar Foto"}
              </button>
            </div>
          )}
        </div>
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
        <div className="text-center py-16 text-muted-foreground">
          <Image className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p className="font-display text-xl mb-2">Selecione uma cliente</p>
          <p className="text-sm">Escolha uma cliente para ver suas fotos e referências.</p>
        </div>
      ) : itemsLoading ? (
        <div className="flex items-center justify-center py-20 gap-2 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" /> Carregando fotos...
        </div>
      ) : (items || []).length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Image className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p className="font-display text-xl mb-2">Nenhuma foto encontrada</p>
          <p className="text-sm">Adicione fotos e referências visuais para esta cliente.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {(items || []).map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="card-luxury overflow-hidden group"
            >
              <div className="relative aspect-video overflow-hidden bg-muted">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image className="w-8 h-8 text-muted-foreground/20" />
                  </div>
                )}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 bg-black/50 backdrop-blur rounded-lg text-white hover:bg-red-500/80 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="p-3 md:p-4">
                <h3 className="font-display text-sm md:text-base mb-1">{item.name}</h3>
                {item.notes && <p className="text-xs text-muted-foreground">{item.notes}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
