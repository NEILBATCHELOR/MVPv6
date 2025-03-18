import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Completely disabled ResetPasswordForm
const ResetPasswordForm: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Password Reset Disabled</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="mb-4">
              Password reset functionality has been disabled.
            </p>
            <Button onClick={() => navigate("/")} className="w-full">
              Back to Sign In
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordForm;
