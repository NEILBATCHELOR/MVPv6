import React, { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { FileText, Copy, Trash2, Calendar, Tag } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface PolicyTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  createdAt: string;
  tags: string[];
  rules: any[];
  approvers: any[];
  isTemplate: boolean;
}

interface PolicyTemplateListProps {
  templates: PolicyTemplate[];
  onUseTemplate: (template: PolicyTemplate) => void;
  onDeleteTemplate: (templateId: string) => void;
}

const PolicyTemplateList = ({
  templates = [],
  onUseTemplate = () => {},
  onDeleteTemplate = () => {},
}: PolicyTemplateListProps) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getPolicyTypeName = (type: string) => {
    const typeMap: Record<string, string> = {
      transfer_limit: "Transfer Limit",
      kyc_verification: "KYC Verification",
      restricted_assets: "Restricted Assets",
      multi_signature: "Multi-Signature Approval",
      dormant_account: "Dormant Account",
      risk_assessment: "Risk Assessment",
      transaction_monitoring: "Transaction Monitoring",
      custom: "Custom Policy",
    };
    return (
      typeMap[type] ||
      (type
        ? type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
        : "")
    );
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm">
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Policy Templates
        </h2>
      </div>

      {templates.length > 0 ? (
        <div className="space-y-4">
          {templates.map((template) => (
            <Card
              key={template.id}
              className="w-full border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {template.name}
                      </h3>
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        Template
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {template.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <div className="flex items-center text-xs text-gray-500">
                        <FileText className="h-3.5 w-3.5 mr-1" />
                        {getPolicyTypeName(template.type)}
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        Created: {formatDate(template.createdAt)}
                      </div>
                    </div>

                    {template.tags && template.tags.length > 0 && (
                      <div className="flex items-center gap-1 flex-wrap">
                        <Tag className="h-3.5 w-3.5 text-gray-400" />
                        {template.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-start">
                    <Button
                      onClick={() => onUseTemplate(template)}
                      className="bg-[#0f172b] hover:bg-[#0f172b]/90 text-white"
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Use Template
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="12" cy="5" r="1" />
                            <circle cx="12" cy="19" r="1" />
                          </svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => onDeleteTemplate(template.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Template
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <Separator className="my-3" />

                <div className="text-xs text-gray-500">
                  <span className="font-medium">Rules:</span>{" "}
                  {template.rules.length} rule(s) •{" "}
                  <span className="font-medium">Approvers:</span>{" "}
                  {template.approvers.length} approver(s)
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">No policy templates available</p>
          <p className="text-sm text-gray-400">
            Save policies as templates to reuse them later
          </p>
        </div>
      )}
    </div>
  );
};

export default PolicyTemplateList;
