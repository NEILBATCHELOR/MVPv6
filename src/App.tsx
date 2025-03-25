import { Suspense } from "react";
import { Routes, Route, useRoutes } from "react-router-dom";
import Home from "./components/home";
import CapTableDashboard from "./components/captable/CapTableDashboard";
import InvestorsList from "./components/investors/InvestorsList";
import ReportsDashboard from "./components/reports/ReportsDashboard";
import TokenBuilder from "./components/tokens/TokenBuilder";
import TokenAdministration from "./components/tokens/TokenAdministration";
import MainLayout from "./components/layout/MainLayout";
import CapTableManagerNew from "./components/captable/CapTableManagerNew";
import RuleManagementDashboard from "./components/rules/RuleManagementDashboard";
import RoleManagementDashboard from "./components/UserManagement/RoleManagementDashboard";
import RedemptionDashboard from "./components/redemption/RedemptionDashboard";
import ActivityMonitorPage from "./pages/ActivityMonitorPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import MFASettingsPage from "./pages/MFASettingsPage";
import UserMFAPage from "./pages/UserMFAPage";

// Wallet Pages
import WalletDashboardPage from "./pages/wallet/WalletDashboardPage";
import MultiSigWalletPage from "./pages/wallet/MultiSigWalletPage";
import KeyManagementPage from "./pages/wallet/KeyManagementPage";
import TokenManagementPage from "./pages/wallet/TokenManagementPage";
import MultiSigWalletDashboard from "./components/wallet/MultiSigWalletDashboard";
import NewWalletPage from "./pages/wallet/NewWalletPage";

// ✅ Import Onboarding Components
import WelcomeScreen from "@/components/onboarding/WelcomeScreen";
import OnboardingFlow from "@/components/onboarding/OnboardingFlow";
import OnboardingHome from "@/components/onboarding/OnboardingHome"; // Ensure this exists!
// Import provider
import { OnboardingProvider } from "@/components/onboarding/OnboardingContext";
import InvestorOnboardingFlow from "@/components/investors/InvestorOnboardingFlow";

// Import Auth Components
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import UnauthorizedPage from "@/components/auth/UnauthorizedPage";
// Temporarily disabled for Fast Refresh issues
// import AuthProvider from "@/components/auth/AuthProvider";

// Import Activity Log Provider - temporarily disabled
// import ActivityLogProvider from "@/components/activity/ActivityLogProvider";
// Import Notification Provider
import { NotificationProvider } from "@/context/NotificationContext";

// Import Tempo routes
import routes from "tempo-routes";

function App() {
  return (
    <>
      {/* AuthProvider temporarily disabled */}
      {/* ActivityLogProvider temporarily disabled */}
      <NotificationProvider>
        <OnboardingProvider>
          <Suspense fallback={<p>Loading...</p>}>
            {/* Tempo routes - ensure these come before other routes */}
            {import.meta.env.VITE_TEMPO && useRoutes(routes)}

            <Routes>
              {/* ✅ Default route redirects to welcome screen */}
              <Route path="/" element={<WelcomeScreen />} />
              <Route index element={<WelcomeScreen />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />

              {/* ✅ Onboarding Routes */}
              <Route path="/onboarding/*" element={<OnboardingFlow />} />
              <Route path="/onboarding/home" element={<OnboardingHome />} />

              {/* ✅ Investor onboarding */}
              <Route path="/investor/*" element={<InvestorOnboardingFlow />} />

              {/* ✅ Main Layout - Ensures Sidebar Renders Only Once */}
              <Route element={<MainLayout />}>
                <Route
                  path="dashboard"
                  element={
                    <ProtectedRoute>
                      <CapTableDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="projects"
                  element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="activity"
                  element={
                    <ProtectedRoute>
                      <ActivityMonitorPage />
                    </ProtectedRoute>
                  }
                />

                {/* ✅ Wallet Routes */}
                <Route
                  path="wallet/dashboard"
                  element={
                    <ProtectedRoute>
                      <WalletDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="wallet/new"
                  element={
                    <ProtectedRoute>
                      <NewWalletPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="wallet/multisig"
                  element={
                    <ProtectedRoute>
                      <MultiSigWalletPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="wallet/approvals"
                  element={
                    <ProtectedRoute>
                      <MultiSigWalletPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="wallet/transactions"
                  element={
                    <ProtectedRoute>
                      <MultiSigWalletPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="wallet/keys"
                  element={
                    <ProtectedRoute>
                      <KeyManagementPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="wallet/tokens"
                  element={
                    <ProtectedRoute>
                      <TokenManagementPage />
                    </ProtectedRoute>
                  }
                />

                {/* ✅ Cap Table Routes - Protected */}
                <Route
                  path="captable"
                  element={
                    <ProtectedRoute allowedRoles={["admin", "issuer"]}>
                      <CapTableManagerNew section="overview" />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="captable/investors"
                  element={
                    <ProtectedRoute allowedRoles={["admin", "issuer"]}>
                      <CapTableManagerNew section="investors" />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="captable/subscriptions"
                  element={
                    <ProtectedRoute allowedRoles={["admin", "issuer"]}>
                      <CapTableManagerNew section="subscriptions" />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="captable/allocations"
                  element={
                    <ProtectedRoute allowedRoles={["admin", "issuer"]}>
                      <CapTableManagerNew section="allocations" />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="captable/distributions"
                  element={
                    <ProtectedRoute allowedRoles={["admin", "issuer"]}>
                      <CapTableManagerNew section="distributions" />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="captable/compliance"
                  element={
                    <ProtectedRoute
                      allowedRoles={["admin", "issuer", "compliance_officer"]}
                    >
                      <CapTableManagerNew section="compliance" />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="captable/reports"
                  element={
                    <ProtectedRoute allowedRoles={["admin", "issuer"]}>
                      <CapTableManagerNew section="reports" />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="captable/documents"
                  element={
                    <ProtectedRoute allowedRoles={["admin", "issuer"]}>
                      <CapTableManagerNew section="documents" />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="captable/minting"
                  element={
                    <ProtectedRoute allowedRoles={["admin", "issuer"]}>
                      <CapTableManagerNew section="minting" />
                    </ProtectedRoute>
                  }
                />

                {/* ✅ Project-specific Cap Table Routes - Protected */}
                <Route
                  path="/projects/:projectId/captable"
                  element={
                    <ProtectedRoute allowedRoles={["admin", "issuer"]}>
                      <CapTableManagerNew />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/projects/:projectId/captable/investors"
                  element={
                    <ProtectedRoute allowedRoles={["admin", "issuer"]}>
                      <CapTableManagerNew section="investors" />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/projects/:projectId/captable/subscriptions"
                  element={
                    <ProtectedRoute allowedRoles={["admin", "issuer"]}>
                      <CapTableManagerNew section="subscriptions" />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/projects/:projectId/captable/allocations"
                  element={
                    <ProtectedRoute allowedRoles={["admin", "issuer"]}>
                      <CapTableManagerNew section="allocations" />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/projects/:projectId/captable/distributions"
                  element={
                    <ProtectedRoute allowedRoles={["admin", "issuer"]}>
                      <CapTableManagerNew section="distributions" />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/projects/:projectId/captable/minting"
                  element={
                    <ProtectedRoute allowedRoles={["admin", "issuer"]}>
                      <CapTableManagerNew section="minting" />
                    </ProtectedRoute>
                  }
                />

                {/* ✅ Management and Reporting Routes - Protected */}
                <Route
                  path="rule-management"
                  element={
                    <ProtectedRoute
                      allowedRoles={["admin", "compliance_officer"]}
                    >
                      <RuleManagementDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="role-management"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <RoleManagementDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="mfa-settings"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <MFASettingsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="account/security"
                  element={
                    <ProtectedRoute>
                      <UserMFAPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="redemption"
                  element={
                    <ProtectedRoute>
                      <RedemptionDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="investors"
                  element={
                    <ProtectedRoute allowedRoles={["admin", "issuer"]}>
                      <InvestorsList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="reports"
                  element={
                    <ProtectedRoute>
                      <ReportsDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/projects/:projectId/tokens"
                  element={
                    <ProtectedRoute allowedRoles={["admin", "issuer"]}>
                      <TokenBuilder />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/projects/:projectId/token-admin"
                  element={
                    <ProtectedRoute allowedRoles={["admin", "issuer"]}>
                      <TokenAdministration />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* ✅ Tempo Catchall Route - ensure this comes after all other routes */}
              {import.meta.env.VITE_TEMPO && (
                <Route path="/tempobook/*" element={<></>} />
              )}
            </Routes>
          </Suspense>
        </OnboardingProvider>
      </NotificationProvider>
      {/* End of disabled ActivityLogProvider */}
      {/* End of disabled AuthProvider */}
    </>
  );
}

export default App;
