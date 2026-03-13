import { motion } from "framer-motion";
import { useState } from "react";
import { Upload, Camera, Trash2, Tag } from "lucide-react";

interface ClientPhoto {
  id: string;
  url: string;
  title: string;
  category: "minha_foto" | "referencia";
  notes: string;
}

const mockPhotos: ClientPhoto[] = [
  { id: "1", url: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400", title: "Referência Look Trabalho", category: "referencia", notes: "Quero usar algo parecido para reuniões" },
  { id: "2", url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400", title: "Inspiração Look Evento", category: "referencia", notes: "Para o casamento em dezembro" },
];

const categories = [
  { value: "minha_foto", label: "Minha Foto" },
  { value: "referencia", label: "Referência de Estilo" },
];

export default function ClientPhotos() {
  const [photos, setPhotos] = useState<ClientPhoto[]>(mockPhotos);
  const [filter, setFilter] = useState("todos");
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<ClientPhoto["category"]>("referencia");
  const [newNotes, setNewNotes] = useState("");

  const filtered = filter === "todos" ? photos : photos.filter(p => p.category === filter);

  const addPhoto = () => {
    if (!newTitle.trim()) return;
    const newPhoto: ClientPhoto = {
      id: Date.now().toString(),
      url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400",
      title: newTitle,
      category: newCategory,
      notes: newNotes,
    };
    setPhotos(prev => [...prev, newPhoto]);
    setNewTitle(""); setNewNotes(""); setShowForm(false);
  };

  const deletePhoto = (id: string) => setPhotos(prev => prev.filter(p => p.id !== id));

  return (
    <div className="p-4 md:p-8 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 md:mb-10">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Camera className="w-6 h-6 text-gold" />
              <h1 className="text-2xl md:text-4xl font-display font-light">Minhas Fotos</h1>
            </div>
            <p className="text-muted-foreground text-xs md:text-sm">Suas fotos e referências de estilo</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl gold-gradient text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Upload className="w-4 h-4" />
            Adicionar Foto
          </button>
        </div>
      </motion.div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[{ value: "todos", label: "Todas" }, ...categories].map(cat => (
          <button
            key={cat.value}
            onClick={() => setFilter(cat.value)}
            className={`px-4 py-2 rounded-full text-xs whitespace-nowrap transition-colors ${
              filter === cat.value
                ? "gold-gradient text-primary-foreground"
                : "border border-border hover:border-gold/40"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card-luxury p-4 md:p-6 mb-6">
          <h3 className="font-display text-base md:text-lg mb-4">Adicionar Foto</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Título</label>
              <input
                type="text"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="Nome da foto..."
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-gold/40"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Categoria</label>
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value as ClientPhoto["category"])}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-gold/40"
              >
                {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-muted-foreground block mb-1.5">Observações</label>
              <textarea
                value={newNotes}
                onChange={e => setNewNotes(e.target.value)}
                placeholder="Notas sobre essa imagem..."
                rows={2}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-gold/40 resize-none"
              />
            </div>
            <div className="md:col-span-2">
              <div className="border-2 border-dashed border-border/50 rounded-xl p-6 md:p-8 text-center hover:border-gold/30 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">Toque para fazer upload da foto</p>
                <p className="text-xs text-muted-foreground/60 mt-1">PNG, JPG ou WEBP</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={addPhoto} className="px-4 py-2.5 rounded-xl gold-gradient text-primary-foreground text-sm hover:opacity-90">Salvar</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2.5 rounded-xl border border-border text-sm hover:bg-muted/50">Cancelar</button>
          </div>
        </motion.div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Camera className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p className="font-display text-xl mb-2">Nenhuma foto encontrada</p>
          <p className="text-sm">Adicione suas fotos e referências.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {filtered.map((photo, idx) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="card-luxury overflow-hidden group"
            >
              <div className="relative aspect-video overflow-hidden bg-muted">
                <img src={photo.url} alt={photo.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => deletePhoto(photo.id)}
                    className="p-1.5 bg-black/50 backdrop-blur rounded-lg text-white hover:bg-red-500/80 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="p-3 md:p-4">
                <h3 className="font-display text-sm md:text-base mb-1">{photo.title}</h3>
                <div className="flex items-center gap-1 mb-2">
                  <Tag className="w-3 h-3 text-gold" />
                  <span className="text-[10px] text-gold">
                    {categories.find(c => c.value === photo.category)?.label}
                  </span>
                </div>
                {photo.notes && <p className="text-xs text-muted-foreground">{photo.notes}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
