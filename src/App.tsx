import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import AddProduct from "./components/dealer/AddProduct";
import WarrantyCheck from "./pages/WarrantyCheck";
import BecomeDealer from "./pages/BecomeDealer";
import SmsApiIntegration from "./components/settings/SmsApiIntegration";
import CustomerInformation from "./pages/CustomerInformation";
import WarrantyRegistration from "./pages/WarrantyRegistration";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 60 * 1000,
			refetchOnWindowFocus: false,
		},
	},
});

const App = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<TooltipProvider>
				<Toaster />
				<Sonner />
				<BrowserRouter>
					<Routes>
						<Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
						<Route path="/" element={<PrivateRoute><Layout><Index /></Layout></PrivateRoute>} />
						<Route path="/warranty-registration" element={<PrivateRoute><Layout><WarrantyRegistration /></Layout></PrivateRoute>} />
						<Route path="/customer-information" element={<PrivateRoute><Layout><CustomerInformation /></Layout></PrivateRoute>} />

						
						<Route path="/customers" element={<PrivateRoute><Layout><Index /></Layout></PrivateRoute>} />
						<Route path="/products/add" element={<PrivateRoute><Layout><AddProduct /></Layout></PrivateRoute>} />
						<Route path="/warranty-check" element={<PrivateRoute><Layout><WarrantyCheck /></Layout></PrivateRoute>} />
						<Route path="/warranties" element={<PrivateRoute><Layout><Index /></Layout></PrivateRoute>} />
						<Route path="/settings" element={<PrivateRoute><Layout><Index /></Layout></PrivateRoute>} />
						<Route path="/settings/sms-api" element={<PrivateRoute><Layout><SmsApiIntegration /></Layout></PrivateRoute>} />
						<Route path="/become-dealer" element={<PrivateRoute><Layout><BecomeDealer /></Layout></PrivateRoute>} />
					</Routes>
				</BrowserRouter>
			</TooltipProvider>
		</QueryClientProvider>
	);
};
export default App;