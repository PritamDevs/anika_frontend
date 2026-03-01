import { Routes, Route, Navigate } from "react-router-dom";


// Layouts
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// Pages
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import ResetPassword from "./pages/auth/ResetPassword";
import Dashboard from "./pages/dashboard/Dashboard";
import Products from "./pages/products/Products";
import Customers from "./pages/customers/Customers";
import CreateInvoice from "./pages/invoices/CreateInvoice";
import InvoicePreview from "./pages/invoices/InvoicePreview";
import Payments from "./pages/payments/Payments";
import Expenses from "./pages/expenses/Expenses";
import Reports from "./pages/reports/Reports";

function App() {
  return (
    <Routes>

        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />   {/* 🔥 MOVE HERE */}
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Route>

        {/* Protected Dashboard Routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/invoice/create" element={<CreateInvoice />} />
          <Route path="/invoice/preview" element={<InvoicePreview />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/reports" element={<Reports />} />
        </Route>

      
    </Routes>
  );

}
export default App;