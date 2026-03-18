import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WardrobeProvider } from "@/contexts/WardrobeContext";
import NotFound from "./pages/NotFound";

// Layouts
import StrategistLayout from "./layouts/StrategistLayout";
import ClientLayout from "./layouts/ClientLayout";

// Login
import LoginPage from "./pages/Login";

// Strategist pages
import StrategistDashboard from "./pages/estrategista/Dashboard";
import ClientsPage from "./pages/estrategista/Clients";
import ClientProfile from "./pages/estrategista/ClientProfile";
import StrategistStrategicAnalysis from "./pages/estrategista/StrategicAnalysis";
import StrategistStyleIdentity from "./pages/estrategista/StyleIdentity";
import StrategistPersonalColoring from "./pages/estrategista/PersonalColoring";
import StrategistMorphology from "./pages/estrategista/Morphology";
import StrategistDesignElements from "./pages/estrategista/DesignElements";

import StyleAssistant from "./pages/estrategista/StyleAssistant";
import ConsultingStructure from "./pages/estrategista/ConsultingStructure";
import StrategistPhotos from "./pages/estrategista/Photos";

// Client pages
import ClientDashboard from "./pages/cliente/Dashboard";
import ClientAssistant from "./pages/cliente/Assistant";
import ClientAnamnese from "./pages/cliente/Anamnese";
import ClientStrategicAnalysis from "./pages/cliente/StrategicAnalysis";
import ClientStyleIdentity from "./pages/cliente/StyleIdentity";
import ClientPersonalColoring from "./pages/cliente/PersonalColoring";
import ClientMorphology from "./pages/cliente/Morphology";
import ClientDesignElements from "./pages/cliente/DesignElements";

import ClientPhotos from "./pages/cliente/Photos";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <WardrobeProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />

            {/* Strategist Portal */}
            <Route path="/estrategista" element={<StrategistLayout />}>
              <Route index element={<StrategistDashboard />} />
              <Route path="clientes" element={<ClientsPage />} />
              <Route path="clientes/:id" element={<ClientProfile />} />
              <Route path="analise" element={<StrategistStrategicAnalysis />} />
              <Route path="identidade-estilo" element={<StrategistStyleIdentity />} />
              <Route path="coloracao" element={<StrategistPersonalColoring />} />
              <Route path="morfologia" element={<StrategistMorphology />} />
              <Route path="elementos" element={<StrategistDesignElements />} />
              
              <Route path="assistente" element={<StyleAssistant />} />
              <Route path="estrutura" element={<ConsultingStructure />} />
              <Route path="fotos" element={<StrategistPhotos />} />
            </Route>

            {/* Client Portal */}
            <Route path="/cliente" element={<ClientLayout />}>
              <Route index element={<ClientDashboard />} />
              <Route path="anamnese" element={<ClientAnamnese />} />
              <Route path="analise" element={<ClientStrategicAnalysis />} />
              <Route path="identidade-estilo" element={<ClientStyleIdentity />} />
              <Route path="coloracao" element={<ClientPersonalColoring />} />
              <Route path="morfologia" element={<ClientMorphology />} />
              <Route path="elementos" element={<ClientDesignElements />} />
              
              <Route path="fotos" element={<ClientPhotos />} />
              <Route path="assistente" element={<ClientAssistant />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </WardrobeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
