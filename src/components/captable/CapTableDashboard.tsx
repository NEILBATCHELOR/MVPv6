import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Users,
  FileText,
  Wallet,
  FileCheck,
  Shield,
  File,
  ArrowRight,
} from "lucide-react";
import CapTableNavigation from "./CapTableNavigation";
import ProjectSelector from "./ProjectSelector";

interface CapTableDashboardProps {
  projectId?: string;
}

const CapTableDashboard = ({
  projectId: propProjectId,
}: CapTableDashboardProps) => {
  const { projectId: paramProjectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalInvestors: 0,
    totalSubscriptions: 0,
    totalAllocated: 0,
    totalDistributed: 0,
    pendingCompliance: 0,
  });
  const { toast } = useToast();

  // Use projectId from props or from URL params
  const currentProjectId = propProjectId || paramProjectId;

  useEffect(() => {
    if (currentProjectId) {
      fetchProjectDetails();
      fetchCapTableStats();
    }
  }, [currentProjectId]);

  const fetchProjectDetails = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", currentProjectId)
        .single();

      if (error) throw error;
      setProject(data);
    } catch (err) {
      console.error("Error fetching project details:", err);
      toast({
        title: "Error",
        description: "Failed to load project details",
        variant: "destructive",
      });
    }
  };

  const fetchCapTableStats = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching cap table stats for project ID:", currentProjectId);

      if (!currentProjectId) {
        setIsLoading(false);
        return;
      }

      // 1. Get total investors count for this project from subscriptions
      const { data: investorsData, error: investorsError } = await supabase
        .from("subscriptions")
        .select("investor_id")
        .eq("project_id", currentProjectId);

      if (investorsError) {
        console.error("Error fetching investors:", investorsError);
        throw investorsError;
      }

      // Count unique investor IDs
      const uniqueInvestorIds = new Set();
      investorsData?.forEach((item) => uniqueInvestorIds.add(item.investor_id));
      const investorsCount = uniqueInvestorIds.size;

      console.log(
        `Found ${investorsCount} unique investors for project ${currentProjectId}`,
      );

      // 2. Get total subscriptions count for this project
      const { data: subscriptionsData, error: subscriptionsError } =
        await supabase
          .from("subscriptions")
          .select("id")
          .eq("project_id", currentProjectId);

      if (subscriptionsError) {
        console.error("Error fetching subscriptions:", subscriptionsError);
        throw subscriptionsError;
      }

      const subscriptionsCount = subscriptionsData?.length || 0;
      console.log(
        `Found ${subscriptionsCount} subscriptions for project ${currentProjectId}`,
      );

      // Get subscription IDs for token allocation queries
      const subscriptionIds = subscriptionsData?.map((sub) => sub.id) || [];

      // 3. Get allocations count (token_allocations where distributed = false)
      let allocationsCount = 0;
      if (subscriptionIds.length > 0) {
        const { data: allocData, error: allocError } = await supabase
          .from("token_allocations")
          .select("id")
          .in("subscription_id", subscriptionIds)
          .eq("distributed", false);

        if (allocError) {
          console.error("Error fetching allocations:", allocError);
          throw allocError;
        }

        allocationsCount = allocData?.length || 0;
        console.log(
          `Found ${allocationsCount} allocations (not distributed) for project ${currentProjectId}`,
        );
      }

      // 4. Get distributions count (token_allocations where distributed = true)
      let distributionsCount = 0;
      if (subscriptionIds.length > 0) {
        const { data: distData, error: distError } = await supabase
          .from("token_allocations")
          .select("id")
          .in("subscription_id", subscriptionIds)
          .eq("distributed", true);

        if (distError) {
          console.error("Error fetching distributions:", distError);
          throw distError;
        }

        distributionsCount = distData?.length || 0;
        console.log(
          `Found ${distributionsCount} distributions (distributed = true) for project ${currentProjectId}`,
        );
      }

      // 5. Get pending compliance reviews count
      const { data: complianceData, error: complianceError } = await supabase
        .from("compliance_checks")
        .select("id")
        .eq("project_id", currentProjectId)
        .eq("status", "pending");

      if (complianceError) {
        console.error("Error fetching compliance checks:", complianceError);
        throw complianceError;
      }

      const complianceCount = complianceData?.length || 0;
      console.log(
        `Found ${complianceCount} pending compliance checks for project ${currentProjectId}`,
      );

      setStats({
        totalInvestors: investorsCount,
        totalSubscriptions: subscriptionsCount,
        totalAllocated: allocationsCount,
        totalDistributed: distributionsCount,
        pendingCompliance: complianceCount,
      });
    } catch (err) {
      console.error("Error fetching cap table stats:", err);
      // Continue with empty data rather than failing completely
      setStats({
        totalInvestors: 0,
        totalSubscriptions: 0,
        totalAllocated: 0,
        totalDistributed: 0,
        pendingCompliance: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProjectChange = (newProjectId: string) => {
    navigate(`/projects/${newProjectId}/captable`);
  };

  const modules = [
    {
      title: "Investors",
      description: "Manage investor records and KYC status",
      icon: <Users className="h-6 w-6 text-blue-600" />,
      href: `/projects/${currentProjectId}/captable/investors`,
      stat: stats.totalInvestors,
      statLabel: "Total Investors",
    },
    {
      title: "Subscriptions",
      description: "Track and confirm investment subscriptions",
      icon: <FileText className="h-6 w-6 text-indigo-600" />,
      href: `/projects/${currentProjectId}/captable/subscriptions`,
      stat: stats.totalSubscriptions,
      statLabel: "Total Subscriptions",
    },
    {
      title: "Allocations",
      description: "Manage token allocations for investors",
      icon: <Wallet className="h-6 w-6 text-purple-600" />,
      href: `/projects/${currentProjectId}/captable/allocations`,
      stat: stats.totalAllocated,
      statLabel: "Allocations Confirmed",
    },
    {
      title: "Distributions",
      description: "Distribute tokens to investor wallets",
      icon: <FileCheck className="h-6 w-6 text-green-600" />,
      href: `/projects/${currentProjectId}/captable/distributions`,
      stat: stats.totalDistributed,
      statLabel: "Distributions Complete",
    },
    {
      title: "Compliance",
      description: "Monitor compliance and regulatory requirements",
      icon: <Shield className="h-6 w-6 text-red-600" />,
      href: `/projects/${currentProjectId}/captable/compliance`,
      stat: stats.pendingCompliance,
      statLabel: "Pending Reviews",
    },
    {
      title: "Reports",
      description: "Generate cap table reports and analytics",
      icon: <BarChart3 className="h-6 w-6 text-amber-600" />,
      href: `/projects/${currentProjectId}/captable/reports`,
      stat: null,
      statLabel: null,
    },
    {
      title: "Documents",
      description: "Store and manage project documents",
      icon: <File className="h-6 w-6 text-teal-600" />,
      href: `/projects/${currentProjectId}/captable/documents`,
      stat: null,
      statLabel: null,
    },
  ];

  if (!currentProjectId) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-6 space-y-6">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-2xl font-bold">Issuance Overview</h1>
              <p className="text-muted-foreground">
                Select a project to view its details
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-medium mb-4">Select a Project</h2>
              <ProjectSelector onProjectChange={handleProjectChange} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{project?.name || "Project"}</h1>
            <p className="text-muted-foreground">
              Manage investors, subscriptions, and token distributions
            </p>
          </div>
          <ProjectSelector
            currentProjectId={currentProjectId}
            onProjectChange={handleProjectChange}
          />
        </div>
        {/* Dashboard Metrics */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <Card key={module.title} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{module.title}</CardTitle>
                  {module.icon}
                </div>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {module.stat !== null && (
                  <div className="mt-2 mb-4">
                    <p className="text-sm text-muted-foreground">
                      {module.statLabel}
                    </p>
                    <p className="text-2xl font-bold">{module.stat}</p>
                  </div>
                )}
                <Link to={module.href}>
                  <Button className="w-full mt-2">
                    Go to {module.title} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CapTableDashboard;
