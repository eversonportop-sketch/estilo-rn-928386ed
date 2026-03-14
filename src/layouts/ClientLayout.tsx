import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import ClientSidebar from "@/components/ClientSidebar";
import { resolveClientId } from "@/hooks/useActiveClient";

export default function ClientLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    resolveClientId().then(() => setReady(true));
  }, []);

  return (
    <div className="flex min-h-screen w-full">
      <ClientSidebar />
      <main className="flex-1 overflow-auto md:pb-0 pb-4 pt-16 md:pt-0">
        {ready ? <Outlet /> : (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            Carregando...
          </div>
        )}
      </main>
    </div>
  );
}
