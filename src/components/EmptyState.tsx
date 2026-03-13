import { motion } from "framer-motion";
import { Shirt } from "lucide-react";

interface EmptyStateProps {
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
}

export default function EmptyState({ title, subtitle, icon }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="col-span-full flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
        {icon ?? <Shirt className="w-7 h-7 text-muted-foreground/40" />}
      </div>
      <h3 className="font-display text-lg mb-1 text-foreground/70">{title}</h3>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </motion.div>
  );
}
