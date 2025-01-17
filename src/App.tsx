import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import AddProduct from "./components/dealer/AddProduct";
import WarrantyCheck from "./pages/WarrantyCheck";
import BecomeDealer from "./pages/BecomeDealer";
import SmsApiIntegration from "./components/settings/SmsApiIntegration";
import CustomerInformation from "./pages/CustomerInformation";
import WarrantyRegistration from "./pages/WarrantyRegistration";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Index /></Layout>} />
          <Route path="/customers" element={<Layout><Index /></Layout>} />
          <Route path="/products/add" element={<Layout><AddProduct /></Layout>} />
          <Route path="/warranty-check" element={<Layout><WarrantyCheck /></Layout>} />
          <Route path="/warranty-registration" element={<Layout><WarrantyRegistration /></Layout>} />
          <Route path="/warranties" element={<Layout><Index /></Layout>} />
          <Route path="/settings" element={<Layout><Index /></Layout>} />
          <Route path="/settings/sms-api" element={<Layout><SmsApiIntegration /></Layout>} />
          <Route path="/become-dealer" element={<Layout><BecomeDealer /></Layout>} />
          <Route path="/customer-information" element={<Layout><CustomerInformation /></Layout>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;