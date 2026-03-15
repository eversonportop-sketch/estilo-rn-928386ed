import { motion } from "framer-motion";
import { Shapes } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getActiveClientId } from "@/hooks/useActiveClient";

type ClientMorphology = {
  id: string;
  body_type: string | null;
  notes: string | null;
};

export default function Morphology() {
  const [morphology, setMorphology] = useState<ClientMorphology | null>(null);

  useEffect(() => {
    const loadMorphology = async () => {
      const clientId = getActiveClientId();

      if (!clientId) return;

      const { data } = await supabase.from("client_morphology").select("*").eq("client_id", clientId).maybeSingle();

      if (data) {
        setMorphology(data);
      }
    };

    loadMorphology();
  }, []);

  const bodyShape = morphology?.body_shape ?? "Ainda não definida";

  const description =
    morphology?.description ?? "Sua análise de morfologia corporal ainda não foi registrada pela estrategista.";

  return (
    <div className="p-4 md:p-8 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <Shapes className="w-6 h-6 text-gold" />
          <h1 className="text-2xl md:text-4xl font-display font-light">Minha Morfologia</h1>
        </div>
        <p className="text-muted-foreground text-xs md:text-sm mb-8 md:mb-10">
          Análise do formato do seu corpo e proporções
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-luxury p-6 md:p-8">
        <span className="text-xs text-gold uppercase tracking-wider font-medium">Tipo de corpo</span>

        <h2 className="font-display text-3xl md:text-4xl mt-2 mb-4">{bodyShape}</h2>

        <p className="text-sm text-muted-foreground max-w-xl">{description}</p>
      </motion.div>
    </div>
  );
}
