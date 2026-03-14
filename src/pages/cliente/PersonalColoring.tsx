```tsx
import { motion } from "framer-motion";
import { Palette } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getActiveClientId } from "@/hooks/useActiveClient";

type ClientPalette = {
  id: string;
  season_name: string | null;
  description: string | null;
};

export default function ClientPersonalColoring() {
  const [palette, setPalette] = useState<ClientPalette | null>(null);

  useEffect(() => {
    const loadPalette = async () => {
      const clientId = getActiveClientId();

      if (!clientId) return;

      const { data } = await supabase
        .from("client_color_palettes")
        .select("*")
        .eq("client_id", clientId)
        .single();

      if (data) {
        setPalette(data);
      }
    };

    loadPalette();
  }, []);

  const season =
    palette?.season_name ?? "Ainda não definida";

  const description =
    palette?.description ??
    "Sua análise de coloração pessoal ainda não foi registrada pela estrategista.";

  return (
    <div className="p-4 md:p-8 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <Palette className="w-6 h-6 text-gold" />
          <h1 className="text-2xl md:text-4xl font-display font-light">
            Minha Coloração
          </h1>
        </div>
        <p className="text-muted-foreground text-xs md:text-sm mb-8 md:mb-10">
          Paleta de cores definida pela análise de coloração pessoal
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-luxury p-6 md:p-8"
      >
        <span className="text-xs text-gold uppercase tracking-wider font-medium">
          Estação de cor
        </span>

        <h2 className="font-display text-3xl md:text-4xl mt-2 mb-4">
          {season}
        </h2>

        <p className="text-sm text-muted-foreground max-w-xl">
          {description}
        </p>
      </motion.div>
    </div>
  );
}
```;
