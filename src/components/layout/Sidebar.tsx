import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Users,
  Layers,
  Home,
  PieChart,
  ShieldCheck,
  UserRoundCog,
  Scale,
  WalletCards,
  FileStack,
  UserRoundPlus,
  Landmark,
  Activity,
  Wallet,
  KeyRound,
  Coins,
  LayoutDashboard,
  Fingerprint,
  CreditCard,
  Shield,
  FileText,
  Plus,
} from "lucide-react";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const SidebarItem = ({ icon, label, href }: SidebarItemProps) => {
  const location = useLocation();
  // Check if the current path starts with the href to ensure only one item is active
  const isActive =
    location.pathname === href ||
    (href !== "/" && location.pathname.startsWith(href + "/"));

  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-primary/10",
        isActive
          ? "bg-primary/10 text-primary font-medium"
          : "text-muted-foreground",
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

const Sidebar = () => {
  const { projectId } = useParams();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  useEffect(() => {
    if (projectId) {
      setSelectedProject(projectId);
    }
  }, [projectId]);

  return (
    <div className="h-full w-64 border-r bg-white p-4 flex flex-col">
      <div className="mb-8 px-2">
        <h2 className="text-xl font-bold">Chain Capital</h2>
        <p className="text-xs text-muted-foreground">Tokenization Platform</p>
      </div>

      <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground">
        ONBOARDING AND KYC
      </h3>
      <div className="space-y-1">
        <SidebarItem
          icon={<Landmark className="h-4 w-4" />}
          label="Issuer"
          href="/onboarding/registration"
        />
        <SidebarItem
          icon={<UserRoundPlus className="h-4 w-4" />}
          label="Investor"
          href="/investor/registration"
        />
      </div>

      <div className="mt-6">
        <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground">
          OVERVIEW
        </h3>
        <div className="space-y-1">
          <SidebarItem
            icon={<Home className="h-4 w-4" />}
            label="Dashboard"
            href="/dashboard"
          />
          <SidebarItem
            icon={<Layers className="h-4 w-4" />}
            label="Projects"
            href="/projects"
          />
        </div>
      </div>

      <div className="mt-6">
        <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground">
          ISSUANCE
        </h3>
        <div className="space-y-1">
          <SidebarItem
            icon={<PieChart className="h-4 w-4" />}
            label="Issuance"
            href="/captable"
          />
          <SidebarItem
            icon={<Users className="h-4 w-4" />}
            label="Investors"
            href="/captable/investors"
          />
          {selectedProject && (
            <SidebarItem
              icon={<CreditCard className="h-4 w-4" />}
              label="Subscriptions"
              href={`/projects/${selectedProject}/captable/subscriptions`}
            />
          )}
          <SidebarItem
            icon={<WalletCards className="h-4 w-4" />}
            label="Redemptions"
            href="/redemption"
          />
        </div>
      </div>

      <div className="mt-6">
        <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground">
          WALLET MANAGEMENT
        </h3>
        <div className="space-y-1">
          <SidebarItem
            icon={<Plus className="h-4 w-4" />}
            label="New Wallet"
            href="/wallet/new"
          />
          <SidebarItem
            icon={<LayoutDashboard className="h-4 w-4" />}
            label="Wallet Dashboard"
            href="/wallet/dashboard"
          />
          <SidebarItem
            icon={<Wallet className="h-4 w-4" />}
            label="Multi-Sig Wallet"
            href="/wallet/multisig"
          />
          <SidebarItem
            icon={<Shield className="h-4 w-4" />}
            label="Transaction Approvals"
            href="/wallet/approvals"
          />
          <SidebarItem
            icon={<KeyRound className="h-4 w-4" />}
            label="Key Management"
            href="/wallet/keys"
          />
          <SidebarItem
            icon={<Coins className="h-4 w-4" />}
            label="Token Management"
            href="/wallet/tokens"
          />
          <SidebarItem
            icon={<FileText className="h-4 w-4" />}
            label="Transaction History"
            href="/wallet/transactions"
          />
        </div>
      </div>

      <div className="mt-6">
        <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground">
          ADMINISTRATION
        </h3>
        <div className="space-y-1">
          <SidebarItem
            icon={<UserRoundCog className="h-4 w-4" />}
            label="Roles"
            href="/role-management"
          />
          <SidebarItem
            icon={<ShieldCheck className="h-4 w-4" />}
            label="Rules"
            href="/rule-management"
          />
          <SidebarItem
            icon={<Scale className="h-4 w-4" />}
            label="Compliance"
            href="/captable/compliance"
          />
          <SidebarItem
            icon={<Activity className="h-4 w-4" />}
            label="Activity Monitor"
            href="/activity"
          />
          <SidebarItem
            icon={<BarChart3 className="h-4 w-4" />}
            label="Reports"
            href="/captable/reports"
          />
          <SidebarItem
            icon={<FileStack className="h-4 w-4" />}
            label="Documents"
            href="/captable/documents"
          />
          <SidebarItem
            icon={<Fingerprint className="h-4 w-4" />}
            label="MFA Settings"
            href="/mfa-settings"
          />
        </div>
      </div>

      <div className="mt-auto pt-4 border-t">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-xs font-medium text-primary">NB</span>
          </div>
          <div>
            <p className="text-sm font-medium">Neil Batchelor</p>
            <p className="text-xs text-muted-foreground">
              neil@chaincapital.xyz
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
