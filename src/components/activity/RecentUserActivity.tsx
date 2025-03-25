import React, { useState, useEffect } from "react";
import { getUserRecentActivity, ActivityLogEntry } from "@/lib/activityLogger";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadingState from "@/components/shared/LoadingState";
import EmptyState from "@/components/shared/EmptyState";
import ActivityLogDetails from "./ActivityLogDetails";

interface RecentUserActivityProps {
  limit?: number;
  className?: string;
}

const RecentUserActivity: React.FC<RecentUserActivityProps> = ({
  limit = 5,
  className = "",
}) => {
  const [logs, setLogs] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<ActivityLogEntry | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Load recent activity logs for the current user
  const loadLogs = async () => {
    setLoading(true);
    try {
      const fetchedLogs = await getUserRecentActivity(limit);
      setLogs(fetchedLogs);
    } catch (error) {
      console.error("Error loading recent user activity:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load logs when component mounts
  useEffect(() => {
    loadLogs();
  }, [limit]);

  // Format timestamp
  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return format(date, "MMM d");
  };

  // Format action type for display
  const formatActionType = (actionType?: string) => {
    if (!actionType) return "";
    return actionType
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Handle log click to show details
  const handleLogClick = (log: ActivityLogEntry) => {
    setSelectedLog(log);
    setShowDetails(true);
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between py-4">
        <CardTitle className="text-lg">Your Recent Activity</CardTitle>
        <Button variant="ghost" size="sm" onClick={loadLogs}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <LoadingState message="Loading your activity..." />
        ) : logs.length === 0 ? (
          <EmptyState
            title="No recent activity"
            description="You haven't performed any actions yet."
          />
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between py-2 border-b last:border-0 cursor-pointer hover:bg-muted/20 px-2 rounded-md transition-colors"
                onClick={() => handleLogClick(log)}
              >
                <div>
                  <div className="font-medium text-sm">
                    {formatActionType(log.action_type)}
                  </div>
                  {log.entity_type && (
                    <div className="text-xs text-muted-foreground">
                      {log.entity_type.charAt(0).toUpperCase() +
                        log.entity_type.slice(1)}
                      {log.entity_id && (
                        <span className="opacity-70 ml-1">
                          ({log.entity_id.substring(0, 6)}...)
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatTimestamp(log.timestamp)}
                </div>
              </div>
            ))}
          </div>
        )}

        <ActivityLogDetails
          log={selectedLog}
          open={showDetails}
          onOpenChange={setShowDetails}
        />
      </CardContent>
    </Card>
  );
};

export default RecentUserActivity;
