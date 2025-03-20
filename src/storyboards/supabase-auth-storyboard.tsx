import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";

export default function SupabaseAuthStoryboard() {
  const [activeTab, setActiveTab] = useState("register");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Register form state
  const [registerForm, setRegisterForm] = useState({
    email: "",
    password: "",
    name: "",
    role: "issuer" as
      | "issuer"
      | "investor"
      | "admin"
      | "compliance_officer"
      | "viewer",
  });

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  // User state
  const [user, setUser] = useState<any>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // 1. Create the user in auth.users
      const { data: authUser, error: authError } = await supabase.auth.signUp({
        email: registerForm.email,
        password: registerForm.password,
        options: {
          data: {
            name: registerForm.name,
            role: registerForm.role,
          },
        },
      });

      if (authError) throw authError;
      if (!authUser.user) throw new Error("Failed to create user");

      // 2. Create entry in public.users table
      const { error: publicUserError } = await supabase.from("users").insert({
        id: authUser.user.id,
        name: registerForm.name,
        email: registerForm.email,
        role: registerForm.role,
        status: "active",
      });

      if (publicUserError) throw publicUserError;

      // 3. Add role to user_roles table
      const { error: roleError } = await supabase.from("user_roles").insert({
        user_id: authUser.user.id,
        role: registerForm.role,
      });

      if (roleError) throw roleError;

      setMessage({ type: "success", text: "User registered successfully!" });
      setUser(authUser.user);

      // Clear form
      setRegisterForm({
        email: "",
        password: "",
        name: "",
        role: "issuer",
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      setMessage({
        type: "error",
        text: error.message || "Registration failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password,
      });

      if (error) throw error;

      setMessage({ type: "success", text: "Logged in successfully!" });
      setUser(data.user);

      // Clear form
      setLoginForm({
        email: "",
        password: "",
      });
    } catch (error: any) {
      console.error("Login error:", error);
      setMessage({ type: "error", text: error.message || "Login failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setMessage({ type: "success", text: "Logged out successfully!" });
      setUser(null);
    } catch (error: any) {
      console.error("Logout error:", error);
      setMessage({ type: "error", text: error.message || "Logout failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Supabase Auth Demo</CardTitle>
        </CardHeader>
        <CardContent>
          {user ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                <h3 className="font-medium text-green-800">Logged in as:</h3>
                <pre className="mt-2 text-sm bg-white p-2 rounded overflow-auto">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>

              <Button
                onClick={handleLogout}
                className="w-full"
                disabled={loading}
              >
                {loading ? "Logging out..." : "Logout"}
              </Button>
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="register">Register</TabsTrigger>
                <TabsTrigger value="login">Login</TabsTrigger>
              </TabsList>

              <TabsContent value="register" className="space-y-4 pt-4">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Name</Label>
                    <Input
                      id="register-name"
                      value={registerForm.name}
                      onChange={(e) =>
                        setRegisterForm({
                          ...registerForm,
                          name: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      value={registerForm.email}
                      onChange={(e) =>
                        setRegisterForm({
                          ...registerForm,
                          email: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input
                      id="register-password"
                      type="password"
                      value={registerForm.password}
                      onChange={(e) =>
                        setRegisterForm({
                          ...registerForm,
                          password: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-role">Role</Label>
                    <select
                      id="register-role"
                      className="w-full p-2 border rounded-md"
                      value={registerForm.role}
                      onChange={(e) =>
                        setRegisterForm({
                          ...registerForm,
                          role: e.target.value as any,
                        })
                      }
                    >
                      <option value="issuer">Issuer</option>
                      <option value="investor">Investor</option>
                      <option value="admin">Admin</option>
                      <option value="compliance_officer">
                        Compliance Officer
                      </option>
                      <option value="viewer">Viewer</option>
                    </select>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Registering..." : "Register"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="login" className="space-y-4 pt-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={loginForm.email}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, email: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginForm.password}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, password: e.target.value })
                      }
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          )}

          {message && (
            <div
              className={`mt-4 p-3 rounded-md ${message.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
            >
              {message.text}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
