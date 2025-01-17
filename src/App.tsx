import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
          <Route path="/" element={<Index />} />
          <Route path="/customers" element={<Index />} />
          <Route path="/products/add" element={<AddProduct />} />
          <Route path="/warranty-check" element={<WarrantyCheck />} />
          <Route path="/warranty-registration" element={<WarrantyRegistration />} />
          <Route path="/warranties" element={<Index />} />
          <Route path="/settings" element={<Index />} />
          <Route path="/settings/sms-api" element={<SmsApiIntegration />} />
          <Route path="/become-dealer" element={<BecomeDealer />} />
          <Route path="/customer-information" element={<CustomerInformation />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;