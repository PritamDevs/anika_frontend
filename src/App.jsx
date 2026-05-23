import { Routes, Route, Navigate } from "react-router-dom";
import ErrorBoundary from "./components/common/ErrorBoundary";

// Guard
import ProtectedRoute from "./components/common/Protectedroute";

// Layouts
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import {lazy,Suspense} from "react";
import CustomerLedgerPage from "./pages/customers/temp";

// Pages
const Register = lazy(() => import("./pages/auth/Register"));
const Login = lazy(() => import("./pages/auth/Login"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const Products = lazy(() => import("./pages/products/Products"));
const Customers = lazy(() => import("./pages/customers/Customers"));
const CreateInvoice = lazy(() => import("./pages/invoices/CreateInvoice"));
const EditInvoice = lazy(() => import("./pages/invoices/EditInvoice"));
const InvoicePreview = lazy(() => import("./pages/invoices/InvoicePreview"));
const Payments = lazy(() => import("./pages/payments/Payments"));
const Expenses = lazy(() => import("./pages/expenses/Expenses"));
const Reports = lazy(() => import("./pages/reports/Reports"));

function App() {
  return (
     <ErrorBoundary>
        <Suspense fallback={
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: "16px",
        color: "#01292f"
      }}>
        Loading...
      </div>
    }>
    <Routes>

      {/* Root → login (or dashboard if already logged in) */}
      <Route
        path="/"
        element={
          localStorage.getItem("token")
            ? <Navigate to="/dashboard" replace />
            : <Navigate to="/login" replace />
        }
      />

      {/* ✅ Public Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Route>

      {/* 🔒 Protected Routes — ProtectedRoute checks token on every render */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/:id/ledger" element={<CustomerLedgerPage />}/>
              <Route path="/invoice/create" element={<CreateInvoice />} />

              <Route
                path="/invoice/edit/:id"
                element={<EditInvoice />}
              />

              <Route path="/invoice/preview" element={<InvoicePreview />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/reports" element={<Reports />} />
        </Route>
      </Route>

      {/* Catch-all → any unknown URL goes to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
   </Suspense>
  </ErrorBoundary>
  );
}

export default App;