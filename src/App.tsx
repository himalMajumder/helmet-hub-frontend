import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Index from './pages/Index';
import BecomeDealer from './pages/BecomeDealer';
import CustomerInformation from './pages/CustomerInformation';
import WarrantyCheck from './pages/WarrantyCheck';
import WarrantyRegistration from './pages/WarrantyRegistration';
import DealerDirectory from './pages/DealerDirectory';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Index />} />
          <Route path="/become-dealer" element={<BecomeDealer />} />
          <Route path="/customer-information" element={<CustomerInformation />} />
          <Route path="/warranty-check" element={<WarrantyCheck />} />
          <Route path="/warranty-registration" element={<WarrantyRegistration />} />
          <Route path="/dealer-directory" element={<DealerDirectory />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;