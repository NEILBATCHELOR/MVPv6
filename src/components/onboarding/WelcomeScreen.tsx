import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Landmark, Settings, Key } from "lucide-react";
import LoginModal from "@/components/auth/LoginModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const WelcomeScreen = () => {
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginType, setLoginType] = useState<"issuer" | "investor">("issuer");
  const [showAdminDialog, setShowAdminDialog] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");
  const [adminLinks, setAdminLinks] = useState<
    { name: string; path: string }[]
  >([
    { name: "Projects", path: "/projects" },
    { name: "Token Builder", path: "/projects/${projectId}/tokens" },
    { name: "Investors", path: "/investors" },
    { name: "Cap Table", path: "/captable" },
    { name: "Activity Monitor", path: "/activity" },
    { name: "Wallet Dashboard", path: "/wallet/dashboard" },
    { name: "Role Management", path: "/role-management" },
    { name: "Rule Management", path: "/rule-management" },
  ]);

  // Secret key combination to open admin dialog (Ctrl+Shift+A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "A") {
        setShowAdminDialog(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLoginClick = (type: "issuer" | "investor") => {
    setLoginType(type);
    setIsLoginModalOpen(true);
  };

  const handleAdminAccess = () => {
    // Simple admin password - in a real app, this would be more secure
    if (adminPassword === "admin123") {
      setAdminError("");
      setShowAdminDialog(false);
      // Set admin bypass in localStorage
      localStorage.setItem("adminBypass", "true");
      // Auto-login as admin
      navigate("/dashboard");
    } else {
      setAdminError("Invalid admin password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-4xl px-4">
        <div className="text-center mb-10 relative">
          <h1 className="text-4xl font-bold mb-4">Welcome to Chain Capital</h1>
          <p className="text-xl text-gray-600">
            Choose your account type to get started
          </p>
          <button
            className="absolute top-0 right-0 p-2 text-gray-400 hover:text-gray-600"
            onClick={() => setShowAdminDialog(true)}
            aria-label="Admin Access"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-0">
              <div className="p-8 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Landmark className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2">I'm an Issuer</h2>
                <p className="text-gray-600 mb-6">
                  Raise capital and issue securities
                </p>
                <div className="space-y-3 w-full">
                  <Button
                    className="w-full"
                    onClick={() => navigate("/onboarding/registration")}
                  >
                    Register as Issuer
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleLoginClick("issuer")}
                  >
                    Sign In as Issuer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-0">
              <div className="p-8 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">I'm an Investor</h2>
                <p className="text-gray-600 mb-6">
                  I want to invest in securities
                </p>
                <div className="space-y-3 w-full">
                  <Button
                    className="w-full"
                    onClick={() => navigate("/investor/registration")}
                  >
                    Register as Investor
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleLoginClick("investor")}
                  >
                    Sign In as Investor
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        open={isLoginModalOpen}
        onOpenChange={setIsLoginModalOpen}
        defaultTab={loginType}
      />

      {/* Admin Access Dialog */}
      <Dialog open={showAdminDialog} onOpenChange={setShowAdminDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Admin Access</DialogTitle>
            <DialogDescription>
              Enter admin password to access the system directly. Default
              password: admin123
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="adminPassword">Admin Password</Label>
              <div className="flex items-center">
                <Key className="mr-2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="adminPassword"
                  type="password"
                  placeholder="Enter admin password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAdminAccess()}
                />
              </div>
              {adminError && (
                <p className="text-sm text-red-500">{adminError}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Quick Access Links</Label>
              <div className="grid grid-cols-2 gap-2">
                {adminLinks.map((link) => (
                  <Button
                    key={link.path}
                    variant="outline"
                    className="justify-start"
                    onClick={() => {
                      // Set admin bypass in localStorage before navigating
                      localStorage.setItem("adminBypass", "true");
                      navigate(link.path);
                    }}
                  >
                    {link.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdminDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdminAccess}>Access Admin</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WelcomeScreen;
