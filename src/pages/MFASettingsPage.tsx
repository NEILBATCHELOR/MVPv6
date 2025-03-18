import React from "react";
import AdminMFASettings from "@/components/auth/AdminMFASettings";
import { useAuth } from "@/components/auth/AuthProvider";
import { Alert, AlertDescription } from "@/components/ui/alert";

const MFASettingsPage: React.FC = () => {
  const { userRole } = useAuth();

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">
        Multi-Factor Authentication Settings
      </h1>

      {userRole === "admin" ? (
        <AdminMFASettings />
      ) : (
        <Alert variant="destructive">
          <AlertDescription>
            You don't have permission to access MFA settings. Please contact an
            administrator.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default MFASettingsPage;
