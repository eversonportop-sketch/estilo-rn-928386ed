import { NavLink, useLocation } from "react-router-dom";
import { 
  Home, FileText, User, Palette, 
  Image, Sparkles, LogOut, Menu, X,
  ClipboardList, Scan, Shapes, Camera
} from "lucide-react";
import { useState } from "react";
import rnLogo from "@/assets/rn-logo.png";

const menuItems = [
  { title: "Início", url: "/cliente", icon: Home },
  { title: "Minha Análise Estratégica de Imagem", url: "/cliente/analise", icon: FileText },
  { title: "Minha Identidade de Estilo", url: "/cliente/identidade-estilo", icon: User },
  { title: "Minha Coloração Pessoal", url: "/cliente/coloracao", icon: Palette },
  { title: "Minha Morfologia", url: "/cliente/morfologia", icon: Scan },
  { title: "Meus Elementos de Design", url: "/cliente/elementos", icon: Shapes },
  { title: "Meus Looks", url: "/cliente/looks", icon: Image },
  { title: "Minhas Fotos", url: "/cliente/fotos", icon: Camera },
  { title: "Assistente de Looks", url: "/cliente/assistente", icon: Sparkles },
];

export default function ClientSidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const SidebarContent = () => (
    <>
      <div className="p-4 md:p-6 flex flex-col items-center border-b border-sidebar-border">
        <img src={rnLogo} alt="RN" className="w-12 h-12 md:w-16 md:h-16 object-contain mb-2" />
        <span className="text-xs md:text-sm font-display tracking-[0.2em] md:tracking-[0.3em] text-sidebar-primary uppercase">
          Consulting
        </span>
        <span className="text-[8px] md:text-[10px] tracking-[0.1em] md:tracking-[0.15em] text-sidebar-foreground/60 uppercase mt-1 text-center leading-tight">
          Consultoria & Posicionamento<br />Estratégico de Imagem
        </span>
      </div>

      <nav className="flex-1 py-4 px-2 md:px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.url ||
            (item.url !== "/cliente" && location.pathname.startsWith(item.url));
          return (
            <NavLink
              key={item.url}
              to={item.url}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-lg text-xs md:text-sm font-body transition-all duration-200 ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              }`}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{item.title}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-3 md:p-4 border-t border-sidebar-border">
        <NavLink
          to="/"
          onClick={() => setIsOpen(false)}
          className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-3 rounded-lg text-xs md:text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          <span>Sair</span>
        </NavLink>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-sidebar border-b border-sidebar-border flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <img src={rnLogo} alt="RN" className="w-8 h-8 object-contain" />
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40 pt-14"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={`md:hidden fixed top-14 left-0 bottom-0 w-64 bg-sidebar z-50 flex flex-col transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 h-screen sticky top-0 bg-sidebar flex-col border-r border-sidebar-border">
        <SidebarContent />
      </aside>

    </>
  );
}
