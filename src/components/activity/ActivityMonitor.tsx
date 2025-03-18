import React, { useState, useEffect } from "react";
import {
  getActivityLogs,
  ActivityLogEntry,
  exportLogsToCSV,
} from "@/lib/activityLogger";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Download, Filter, RefreshCw, Search } from "lucide-react";
import { format } from "date-fns";
import LoadingState from "@/components/shared/LoadingState";
import EmptyState from "@/components/shared/EmptyState";

const ActivityMonitor: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    action_type: "",
    entity_type: "",
    status: "",
    start_date: "",
    end_date: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [actionTypes, setActionTypes] = useState<string[]>([]);
  const [entityTypes, setEntityTypes] = useState<string[]>([]);

  const ITEMS_PER_PAGE = 20;

  // Load activity logs
  const loadLogs = async () => {
    setLoading(true);
    try {
      // Calculate offset based on current page
      const offset = (page - 1) * ITEMS_PER_PAGE;

      // Prepare filter options
      const options: any = {
        limit: ITEMS_PER_PAGE,
        offset,
      };

      // Add filters if they are set
      if (filters.action_type) options.action_type = filters.action_type;
      if (filters.entity_type) options.entity_type = filters.entity_type;
      if (filters.status) options.status = filters.status;
      if (filters.start_date) options.start_date = filters.start_date;
      if (filters.end_date) options.end_date = filters.end_date;

      // Get logs based on active tab
      let fetchedLogs: ActivityLogEntry[] = [];

      if (activeTab === "all") {
        fetchedLogs = await getActivityLogs(options);
      } else if (activeTab === "auth") {
        options.action_type = options.action_type || "auth_%";
        fetchedLogs = await getActivityLogs(options);
      } else if (activeTab === "data") {
        // Filter for data operations (create, update, delete)
        options.action_type =
          options.action_type ||
          "%_investors" ||
          "%_subscriptions" ||
          "%_token_allocations" ||
          "%_projects";
        fetchedLogs = await getActivityLogs(options);
      } else if (activeTab === "admin") {
        // Filter for admin operations
        options.action_type =
          options.action_type || "%_user_roles" || "%_rules" || "%_permissions";
        fetchedLogs = await getActivityLogs(options);
      }

      // Filter by search query if provided
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        fetchedLogs = fetchedLogs.filter(
          (log) =>
            (log.user_email && log.user_email.toLowerCase().includes(query)) ||
            (log.action_type &&
              log.action_type.toLowerCase().includes(query)) ||
            (log.entity_type &&
              log.entity_type.toLowerCase().includes(query)) ||
            (log.entity_id && log.entity_id.toLowerCase().includes(query)) ||
            (log.details &&
              JSON.stringify(log.details).toLowerCase().includes(query)),
        );
      }

      setLogs(fetchedLogs);

      // Extract unique action types and entity types for filters
      const actions = Array.from(
        new Set(fetchedLogs.map((log) => log.action_type).filter(Boolean)),
      );
      const entities = Array.from(
        new Set(fetchedLogs.map((log) => log.entity_type).filter(Boolean)),
      );

      setActionTypes(actions as string[]);
      setEntityTypes(entities as string[]);

      // Calculate total pages
      // In a real implementation, you would get the total count from the API
      // For now, we'll assume there are more pages if we got a full page of results
      setTotalPages(
        Math.max(1, fetchedLogs.length === ITEMS_PER_PAGE ? page + 1 : page),
      );
    } catch (error) {
      console.error("Error loading activity logs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load logs when component mounts or filters change
  useEffect(() => {
    loadLogs();
  }, [page, activeTab, filters]);

  // Handle search
  const handleSearch = () => {
    setPage(1); // Reset to first page
    loadLogs();
  };

  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPage(1); // Reset to first page
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      action_type: "",
      entity_type: "",
      status: "",
      start_date: "",
      end_date: "",
    });
    setSearchQuery("");
    setPage(1);
  };

  // Export logs to CSV
  const exportToCSV = () => {
    const csv = exportLogsToCSV(logs);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `activity_logs_${format(new Date(), "yyyy-MM-dd")}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Format timestamp
  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return "";
    return format(new Date(timestamp), "MMM dd, yyyy HH:mm:ss");
  };

  // Format action type for display
  const formatActionType = (actionType?: string) => {
    if (!actionType) return "";
    return actionType
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Get status badge color
  const getStatusBadge = (status?: string) => {
    if (!status) return <Badge variant="outline">Unknown</Badge>;

    switch (status.toLowerCase()) {
      case "success":
        return <Badge className="bg-green-100 text-green-800">Success</Badge>;
      case "failure":
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Activity Monitor</CardTitle>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
            <Button variant="outline" size="sm" onClick={loadLogs}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={exportToCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Activity</TabsTrigger>
              <TabsTrigger value="auth">Authentication</TabsTrigger>
              <TabsTrigger value="data">Data Operations</TabsTrigger>
              <TabsTrigger value="admin">Admin Actions</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-8"
              />
            </div>
            <Button onClick={handleSearch}>Search</Button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 p-4 bg-muted/20 rounded-md">
              <div>
                <label className="text-sm font-medium">Action Type</label>
                <Select
                  value={filters.action_type}
                  onValueChange={(value) =>
                    handleFilterChange("action_type", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select action type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Actions</SelectItem>
                    {actionTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {formatActionType(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Entity Type</label>
                <Select
                  value={filters.entity_type}
                  onValueChange={(value) =>
                    handleFilterChange("entity_type", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select entity type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Entities</SelectItem>
                    {entityTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => handleFilterChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Statuses</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="failure">Failure</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Start Date</label>
                <DatePicker
                  date={
                    filters.start_date
                      ? new Date(filters.start_date)
                      : undefined
                  }
                  onSelect={(date) =>
                    handleFilterChange(
                      "start_date",
                      date ? date.toISOString() : "",
                    )
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium">End Date</label>
                <DatePicker
                  date={
                    filters.end_date ? new Date(filters.end_date) : undefined
                  }
                  onSelect={(date) =>
                    handleFilterChange(
                      "end_date",
                      date ? date.toISOString() : "",
                    )
                  }
                />
              </div>

              <div className="md:col-span-5 flex justify-end">
                <Button variant="outline" onClick={resetFilters}>
                  Reset Filters
                </Button>
              </div>
            </div>
          )}

          {loading ? (
            <LoadingState message="Loading activity logs..." />
          ) : logs.length === 0 ? (
            <EmptyState
              title="No activity logs found"
              description="No logs match your current filters. Try adjusting your search criteria."
            />
          ) : (
            <>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Entity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-xs">
                          {formatTimestamp(log.timestamp)}
                        </TableCell>
                        <TableCell>{log.user_email || "System"}</TableCell>
                        <TableCell>
                          {formatActionType(log.action_type)}
                        </TableCell>
                        <TableCell>
                          {log.entity_type && (
                            <span className="text-xs">
                              {log.entity_type.charAt(0).toUpperCase() +
                                log.entity_type.slice(1)}
                              {log.entity_id && (
                                <span className="text-muted-foreground ml-1">
                                  ({log.entity_id.substring(0, 8)}...)
                                </span>
                              )}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(log.status)}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {log.details ? (
                            <span className="text-xs text-muted-foreground">
                              {typeof log.details === "object"
                                ? JSON.stringify(log.details).substring(0, 50) +
                                  "..."
                                : String(log.details).substring(0, 50) + "..."}
                            </span>
                          ) : null}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    />
                  </PaginationItem>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Show pages around current page
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }

                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => setPage(pageNum)}
                          isActive={page === pageNum}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityMonitor;
