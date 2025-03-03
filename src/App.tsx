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
import ModelList from "./pages/ModelList";
import ModelCreate from "./pages/ModelCreate";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import ModelEdit from "./pages/ModelEdit";
import UsersList from "./pages/UsersList";
import UserCreate from "./pages/UserCreate";
import UserEdit from "./pages/UserEdit";
import RolesList from "./pages/RolesList";
import RoleCreate from "./pages/RoleCreate";
import RoleEdit from "./pages/RoleEdit";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
            retry: 0,
            refetchOnWindowFocus: false,
            gcTime: 5 * 60 * 1000,
        },
        mutations: {
            retry: false, // Disable retry for mutations
        } 
	} 
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

						{/* Models Routes */}
						<Route path="/models" element={<PrivateRoute><Layout><ModelList /></Layout></PrivateRoute>} />
						<Route path="/models/create" element={<PrivateRoute><Layout><ModelCreate /></Layout></PrivateRoute>} />
						<Route path="/models/edit/:uuid" element={<PrivateRoute><Layout><ModelEdit /></Layout></PrivateRoute>} />
						
						{/* Users Routes */}
						<Route path="/users" element={<PrivateRoute><Layout><UsersList /></Layout></PrivateRoute>} />
						<Route path="/users/create" element={<PrivateRoute><Layout><UserCreate /></Layout></PrivateRoute>} />
						<Route path="/users/edit/:uuid" element={<PrivateRoute><Layout><UserEdit /></Layout></PrivateRoute>} />

						{/* Roles Routes */}
						<Route path="/roles" element={<PrivateRoute permission="Preview Role"><Layout><RolesList /></Layout></PrivateRoute>} />
						<Route path="/roles/create" element={<PrivateRoute><Layout><RoleCreate /></Layout></PrivateRoute>} />
						<Route path="/roles/edit/:id" element={<PrivateRoute><Layout><RoleEdit /></Layout></PrivateRoute>} />



						
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
			<ReactQueryDevtools initialIsOpen={false} />

		</QueryClientProvider>
	);
};
export default App;