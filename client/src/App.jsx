import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { ProtectedRoute, AdminRoute } from "./components/shared/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";

import LandingPage        from "./pages/LandingPage";
import LoginPage          from "./pages/LoginPage";
import RegisterPage       from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage  from "./pages/ResetPasswordPage";
import DashboardPage      from "./pages/DashboardPage";
import TransferPage       from "./pages/TransferPage";
import TransactionsPage   from "./pages/TransactionsPage";
import ProfilePage        from "./pages/ProfilePage";
import AdminDashboard     from "./pages/admin/AdminDashboard";
import AdminUsers         from "./pages/admin/AdminUsers";
import AdminTransactions  from "./pages/admin/AdminTransactions";
import NotFoundPage       from "./pages/NotFoundPage";

const App = () => (
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/"                        element={<LandingPage />} />
        <Route path="/login"                   element={<LoginPage />} />
        <Route path="/register"                element={<RegisterPage />} />
        <Route path="/forgot-password"         element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token"   element={<ResetPasswordPage />} />

        {/* Protected user routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard"    element={<DashboardPage />} />
            <Route path="/transfer"     element={<TransferPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/profile"      element={<ProfilePage />} />
          </Route>
        </Route>

        {/* Admin-only routes */}
        <Route element={<AdminRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/admin"               element={<AdminDashboard />} />
            <Route path="/admin/users"         element={<AdminUsers />} />
            <Route path="/admin/transactions"  element={<AdminTransactions />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  </Provider>
);

export default App;
