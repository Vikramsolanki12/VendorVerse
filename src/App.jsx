import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import VendorDashboard from "./pages/VendorDashboard";
import SupplierDashboard from "./pages/SupplierDashboard";
import SupplierLogin from "./pages/SupplierLogin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default page - Login for Vendors */}
        <Route path="/" element={<LoginPage />} />

        {/* Vendor dashboard (only after login) */}
        <Route path="/vendor" element={<VendorDashboard />} />

        {/* Supplier Login Page */}
        <Route path="/supplier-login" element={<SupplierLogin />} />

        {/* Supplier Dashboard (after login + store setup) */}
        <Route path="/supplier" element={<SupplierDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
